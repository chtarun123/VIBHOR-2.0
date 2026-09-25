/* ============================================================
   VIBHOR — Heritage Progress Engine (hybrid)
   Guests        → full engine runs in localStorage (their own
                   device, their own activity — nothing is faked).
   Signed-in     → the BACKEND is the source of truth. The client
                   sends EVENTS (viewed / listened / stamped /
                   quizzed / joined / preserved) and the server
                   computes the points + badges. The engine mirrors
                   the server's answer for painting the UI, and
                   shows an optimistic estimate until the reply
                   lands — it NEVER tells the server a point value.
   Public API is unchanged, so detail.js, region.js, quiz.js,
   voice-guide.js and the dashboard work with either backend.
   ============================================================ */
(function () {
  "use strict";
  const LS = "vh_progress_v1";
  const PASSPORT_LS = "vh_passport_v1";
  const STAMPS_MIRROR = "vh_stamps_mirror_v1";
  const LEGACY_PLAY = "vh_quiz_plays";
  const LEGACY_BEST = "vh_quiz_best";
  const MAX_ROUND = 2250; // 10 questions × 225

  const ACTIONS = { view: 10, listen: 15, quiz: 20, stamp: 100, challenge: 50, archive: 50 };
  const quizEarned = (score) => ACTIONS.quiz + Math.round((score || 0) / 10);

  const LEVELS = [
    { min: 36, name: "India Expert",       e: "🏆", line: "All 36 states & UTs stamped — you are the living map of India." },
    { min: 28, name: "Culture Champion",   e: "🏅", line: "28 units stamped — a true champion of culture." },
    { min: 20, name: "Nation Wanderer",    e: "🧭", line: "20 units stamped — every region knows your footsteps." },
    { min: 16, name: "Heritage Explorer",  e: "🗺️", line: "16 units stamped — the road to mastery." },
    { min: 10, name: "Culture Voyager",    e: "🎒", line: "10 units stamped — momentum is on your side." },
    { min: 5,  name: "Heritage Traveler",  e: "🌄", line: "5 units stamped — the journey has truly begun." },
    { min: 1,  name: "Sprouting Wanderer", e: "🌱", line: "Your first stamps are in — keep collecting!" },
    { min: 0,  name: "Blank Passport",     e: "📘", line: "Your passport is blank. Pick a state and make history." }
  ];

  const BADGES = [
    { id: "state5",    name: "Heritage Explorer",  e: "🗺️", bonus: 100, line: "Stamp 5 states in your passport.",                    need: 5,   cur: (d) => d.states },
    { id: "state12",   name: "Culture Champion",   e: "🏅", bonus: 250, line: "Stamp 12 states in your passport.",                   need: 12,  cur: (d) => d.states },
    { id: "state28",   name: "India Expert",       e: "🏆", bonus: 500, line: "Stamp 28 states — the grand badge.",                  need: 28,  cur: (d) => d.states },
    { id: "quiz1",     name: "First Quest",        e: "🎲", bonus: 50,  line: "Complete your first quiz round.",                     need: 1,   cur: (d) => d.quiz.plays },
    { id: "quiz60",    name: "Quiz Whiz",          e: "🎯", bonus: 100, line: "Score 60% or better in any quiz round.",              need: 60,  cur: (d) => Math.round(((d.quiz.best || 0) / MAX_ROUND) * 100) },
    { id: "quiz100",   name: "Perfect Scholar",    e: "🌟", bonus: 200, line: "Finish a round with every answer correct.",           need: 1,   cur: (d) => d.quiz.perfects },
    { id: "fest8",     name: "Festival Master",    e: "🪔", bonus: 150, line: "Explore 8 festival stories across India.",            need: 8,   cur: (d) => d.viewedCats.festivals || 0 },
    { id: "food8",     name: "Food Expert",        e: "🍛", bonus: 150, line: "Explore 8 traditional food stories.",                 need: 8,   cur: (d) => d.viewedCats.foods || 0 },
    { id: "amb15",     name: "Culture Ambassador", e: "🎖️", bonus: 200, line: "Explore 15 stories and play 3 quiz rounds.",          need: 1,   cur: (d) => (d.viewedLen >= 15 && d.quiz.plays >= 3 ? 1 : Math.max(d.viewedLen / 15, d.quiz.plays / 3)) },
    { id: "legend",    name: "Heritage Legend",    e: "👑", bonus: 300, line: "Earn 500+ heritage points.",                          need: 500, cur: (d) => d.points },
    { id: "preserver", name: "Heritage Preserver", e: "📜", bonus: 150, line: "Submit your first heritage document to the archive.", need: 1,   cur: (d) => d.archiveSubs || 0 }
  ];

  /* ---------------- shared bits ---------------- */
  function emit() {
    try { document.dispatchEvent(new CustomEvent("vh:progress", { detail: { points: H.totalPoints() } })); } catch (e) {}
  }
  function toast(base, gained, badges) {
    if (!gained && !(badges && badges.length)) return;
    const parts = gained ? [`+${gained} Heritage Points` + (base ? ` · ${base}` : "")] : [];
    (badges || []).forEach((b) => parts.push(`${b.e || "🏅"} Badge earned — ${b.name}!`));
    showToast("✦ " + parts.join(" ✦ "), "ok");
  }
  function showToast(msg, kind, ms) {
    try {
      let t = document.querySelector(".toast");
      if (!t) {
        t = document.createElement("div");
        t.className = "toast";
        document.body.appendChild(t);
      }
      t.textContent = msg;
      t.style.background = kind === "warn"
        ? "linear-gradient(135deg,#c2571b,#8a3410)"
        : "linear-gradient(135deg,var(--gold),#b8912a)";
      t.classList.add("show");
      clearTimeout(t._h);
      t._h = setTimeout(() => t.classList.remove("show"), ms || 3000);
    } catch (e) {}
  }

  /* ---------------- guest engine (localStorage) ---------------- */
  function readPassportLS() {
    try {
      const p = JSON.parse(localStorage.getItem(PASSPORT_LS) || "null");
      return p && p.explored ? Object.keys(p.explored) : [];
    } catch (e) { return []; }
  }
  function writePassportLS(state) {
    try {
      const p = JSON.parse(localStorage.getItem(PASSPORT_LS) || "null") || {};
      p.explored = p.explored || {};
      if (!p.explored[state]) {
        p.explored[state] = new Date().toISOString();
        localStorage.setItem(PASSPORT_LS, JSON.stringify(p));
        return true;
      }
    } catch (e) {}
    return false;
  }
  function legacyQuiz() {
    let plays = 0, best = null;
    try { plays = parseInt(localStorage.getItem(LEGACY_PLAY) || "0", 10) || 0; } catch (e) {}
    try {
      const b = JSON.parse(localStorage.getItem(LEGACY_BEST) || "null");
      if (b && typeof b.score === "number") best = b.score;
    } catch (e) {}
    return { plays, best };
  }
  function guestLoad() {
    try {
      const raw = localStorage.getItem(LS);
      if (raw) {
        const d = JSON.parse(raw);
        if (d && typeof d.points === "number" && d.quiz) {
          d.viewedCats = d.viewedCats || {};
          d.listens = d.listens || 0;
          d.challenges = d.challenges || 0;
          d.archiveSubs = d.archiveSubs || 0;
          return d;
        }
      }
    } catch (e) {}
    const lq = legacyQuiz();
    const d = {
      points: lq.plays ? 50 + Math.round((lq.best || 0) / 10) : 0,
      quiz: { plays: lq.plays, best: lq.best || 0, totalAnswered: lq.plays * 10, totalCorrect: 0, perfects: (lq.best || 0) >= MAX_ROUND ? 1 : 0 },
      viewed: [], viewedCats: {}, listens: 0, challenges: 0, joined: [],
      badges: lq.plays >= 1 ? { quiz1: "legacy" } : {}, archiveSubs: 0, archiveAwards: [], rounds: []
    };
    guestPersist(d);
    return d;
  }
  function guestPersist(d) {
    try { localStorage.setItem(LS, JSON.stringify(d)); } catch (e) {}
    emit();
  }
  function guestView(cat, id, bonusCheck) {
    const d = guestLoad();
    let gained = 0;
    if (!bonusCheck) {
      if (!d.viewed.includes(id)) {
        d.viewed.push(id);
        if (cat) d.viewedCats[cat] = (d.viewedCats[cat] || 0) + 1;
        gained = ACTIONS.view;
        d.points += gained;
      }
    }
    return { d, gained };
  }
  function guestEval(d) {
    const stats = guestStats(d);
    const fresh = [];
    BADGES.forEach((b) => {
      if (d.badges[b.id]) return;
      if (b.cur(stats) >= b.need) {
        d.points += b.bonus;
        d.badges[b.id] = new Date().toISOString().slice(0, 10);
        fresh.push(b);
      }
    });
    return fresh;
  }
  function guestStats(d) {
    return {
      points: d.points, states: readPassportLS().length, viewedLen: d.viewed.length,
      viewedCats: d.viewedCats, listens: d.listens, challenges: d.challenges,
      archiveSubs: d.archiveSubs || 0,
      quiz: { plays: d.quiz.plays, best: d.quiz.best, perfects: d.quiz.perfects, totalAnswered: d.quiz.totalAnswered, totalCorrect: d.quiz.totalCorrect },
      badges: d.badges || {}
    };
  }

  /* ---------------- authenticated view (server mirror) -------------------- */
  function serverMe() { return window.VH_API ? VH_API.me() : { authenticated: false }; }
  function serverStats() {
    const m = serverMe();
    const s = (m && m.stats) || {};
    return {
      points: s.points || 0, states: s.states || 0, viewedLen: s.stories || 0,
      viewedCats: s.viewedCats || {}, listens: s.listens || 0, challenges: s.challenges || 0,
      archiveSubs: s.archives || 0,
      quiz: { plays: s.quizPlays || 0, best: s.quizBest || 0, perfects: s.quizPerfects || 0, totalAnswered: s.quizAnswered || 0, totalCorrect: s.quizCorrect || 0 },
      badges: (s.badges || []).reduce((acc, b) => { acc[b] = "server"; return acc; }, {})
    };
  }
  function isAuthed() { return !!(serverMe() && serverMe().authenticated); }

  /* stamps: guest → localStorage, user → server mirror */
  function stampsMirror() {
    try { return JSON.parse(localStorage.getItem(STAMPS_MIRROR) || "[]"); }
    catch (e) { return []; }
  }
  function writeStampsMirror(list) {
    try { localStorage.setItem(STAMPS_MIRROR, JSON.stringify(list)); } catch (e) {}
  }
  async function syncStampsFromServer() {
    if (!isAuthed()) return;
    try {
      const r = await VH_API.get("/api/passport");
      writeStampsMirror((r.stamps || []).map((x) => x.state));
    } catch (e) {}
  }
  if (window.VH_API) {
    document.addEventListener("vh:auth-change", () => {
      if (isAuthed()) syncStampsFromServer().then(emit);
      else emit();
    });
  }

  function statsNow() { return isAuthed() ? serverStats() : guestStats(guestLoad()); }

  /* push an event to the server; mirror the truth when it replies */
  function push(path, body, base, estimate) {
    if (!isAuthed()) return;
    VH_API.post(path, body)
      .then((r) => {
        /* merge server truth back into the session mirror */
        const cache = serverMe();
        if (cache && cache.stats && typeof r.total === "number") cache.stats.points = r.total;
        toast(base, r.gained != null ? r.gained : r.earned, r.newBadges);
        VH_API.broadcast();
        emit();
        if (r.gained || r.earned) VH_API.refresh(); /* badges/ counts may have changed */
      })
      .catch((err) => {
        if (err && err.error === "LOGIN_REQUIRED") {
          try { localStorage.removeItem("vh_session_cache_v1"); } catch (e) {}
          emit();
        }
      });
    if (estimate) toast(base, estimate.gained || estimate.earned || 0, estimate.newBadges);
    emit();
    return estimate;
  }

  /* estimate new badges locally so the toast feels instant
     (server reply still wins; duplicates show only when genuinely new) */
  function estimateBadges(s, extraIds) {
    const owned = new Set(Object.keys(s.badges || {}).concat(extraIds || []));
    const out = [];
    for (const b of BADGES) {
      if (owned.has(b.id)) continue;
      const v = b.cur(s);
      if (v >= b.need) { out.push(b); owned.add(b.id); }
    }
    return out;
  }

  /* ---------------- public API ---------------- */
  const H = (window.HERITAGE_PROGRESS = {
    LEVELS, BADGES, ACTIONS, MAX_ROUND, quizEarned,
    showToast,

    isGuest: () => !isAuthed(),
    authed: isAuthed,
    states: () => statsNow().states,
    stamps: () => (isAuthed() ? stampsMirror() : readPassportLS()),
    isStamped: (state) => H.stamps().includes(state),
    levelFor: (n) => LEVELS.find((l) => (n || 0) >= l.min) || LEVELS[LEVELS.length - 1],
    totalPoints: () => statsNow().points,
    factsLearned: () => statsNow().viewedLen,
    listens: () => statsNow().listens,
    challengesJoined: () => statsNow().challenges,
    archiveSubs: () => statsNow().archiveSubs,
    viewedCats: () => statsNow().viewedCats,
    quizStats: () => statsNow().quiz,
    accuracy: () => {
      const q = statsNow().quiz;
      return q.totalAnswered ? Math.round((q.totalCorrect / q.totalAnswered) * 100) : null;
    },

    badges: () => {
      const s = statsNow();
      return BADGES.map((b) => ({
        ...b,
        cur: Math.min(b.need, Math.floor(typeof b.cur === "function" ? b.cur(s) : 0)),
        earned: !!s.badges[b.id],
        earnedOn: s.badges[b.id] && s.badges[b.id] !== "server" ? s.badges[b.id] : ""
      }));
    },
    earnedCount: () => H.badges().filter((b) => b.earned).length,
    nextBadge: () => H.badges().filter((b) => !b.earned)
      .sort((a, b) => (b.cur / b.need) - (a.cur / a.need))[0] || null,

    /* +10 first time per story */
    viewItem: (id, cat) => {
      if (!id) return { gained: 0 };
      if (isAuthed()) {
        /* we don't know server-side uniqueness — server decides; send event */
        return push("/api/progress/view", { id, cat }, "Story viewed", null) || { gained: 0 };
      }
      const { d, gained } = guestView(cat, id);
      let fresh = [];
      if (gained) { fresh = guestEval(d); guestPersist(d); toast("Story viewed", gained, fresh); }
      return { gained, total: d.points, newBadges: fresh };
    },

    /* +15 per narration */
    listenStory: () => {
      if (isAuthed()) {
        return push("/api/progress/listen", {}, "Listened to the story", { gained: ACTIONS.listen, newBadges: [] });
      }
      const d = guestLoad();
      d.listens += 1;
      d.points += ACTIONS.listen;
      const fresh = guestEval(d);
      guestPersist(d);
      toast("Listened to the story", ACTIONS.listen, fresh);
      return { gained: ACTIONS.listen, total: d.points, newBadges: fresh };
    },

    /* quiz completion — NEVER sends points, only results */
    addQuizRound: ({ score = 0, correct = 0, answered = 0, cat = "", mode = "category", key = "" } = {}) => {
      const earned = quizEarned(score);
      if (isAuthed()) {
        const s = statsNow();
        s.quiz.plays += 1;
        s.quiz.totalAnswered += answered;
        s.points += earned;
        const newBadges = estimateBadges(s);
        return push("/api/quiz/result",
          { mode: mode || "category", key: key || cat, score, correct, answered, pct: answered ? Math.round((correct / answered) * 100) : 0 },
          "Quiz complete", { earned, newBadges }) || { earned, newBadges };
      }
      const d = guestLoad();
      d.points += earned;
      d.quiz.plays += 1;
      d.quiz.totalAnswered += answered;
      d.quiz.totalCorrect += correct;
      if (score > d.quiz.best) d.quiz.best = score;
      if (answered >= 10 && correct === answered) d.quiz.perfects += 1;
      d.rounds = d.rounds || [];
      d.rounds.push({ mode: mode || "category", key: key || cat, score, correct, answered, pct: answered ? Math.round((correct / answered) * 100) : 0 });
      if (d.rounds.length > 60) d.rounds = d.rounds.slice(-60);
      const fresh = guestEval(d);
      guestPersist(d);
      toast("Quiz complete", earned, fresh);
      return { earned, total: d.points, newBadges: fresh };
    },

    /* passport stamp — single call used by detail/region pages */
    stampState: (state) => {
      if (!state) return { earned: 0, newBadges: [] };
      try {
        if (window.HERITAGE_STATES && !HERITAGE_STATES.get(state)) return { earned: 0, newBadges: [] };
      } catch (e) {}
      if (H.isStamped(state)) return { earned: 0, total: statsNow().points, newBadges: [] };
      const s = statsNow();
      s.states += 1;
      s.points += ACTIONS.stamp;
      const newBadges = estimateBadges(s);
      if (isAuthed()) {
        writeStampsMirror([...new Set(stampsMirror().concat(state))]);
        return push("/api/passport/stamp", { state }, "Passport stamped", { earned: ACTIONS.stamp, newBadges }) || { earned: ACTIONS.stamp, newBadges };
      }
      const changed = writePassportLS(state);
      if (!changed) return { earned: 0, total: guestLoad().points, newBadges: [] };
      const d = guestLoad();
      d.points += ACTIONS.stamp;
      const fresh = guestEval(d);
      guestPersist(d);
      toast("Passport stamped", ACTIONS.stamp, fresh);
      return { earned: ACTIONS.stamp, total: d.points, newBadges: fresh };
    },
    unstampState: (state) => {
      if (isAuthed()) { writeStampsMirror(stampsMirror().filter((x) => x !== state)); emit(); return; }
      try {
        const p = JSON.parse(localStorage.getItem(PASSPORT_LS) || "null") || {};
        if (p.explored && p.explored[state]) {
          delete p.explored[state];
          localStorage.setItem(PASSPORT_LS, JSON.stringify(p));
          emit();
        }
      } catch (e) {}
    },

    /* challenge join (+50 first time per challenge — the server awards it
       with the FIRST submitted entry; signed-in joins are tracked there) */
    joinChallenge: (id) => {
      if (isAuthed()) return { gained: 0, total: statsNow().points, newBadges: [] };
      const d = guestLoad();
      const list = d.joined || (d.joined = []);
      if (!id || list.includes(id)) return { gained: 0, total: d.points, newBadges: [] };
      list.push(id);
      d.challenges += 1;
      d.points += ACTIONS.challenge;
      const fresh = guestEval(d);
      guestPersist(d);
      return { gained: ACTIONS.challenge, total: d.points, newBadges: fresh };
    },

    /* archive submission (+50, idempotent per record on the server) */
    submitArchive: (recId) => {
      if (isAuthed()) return { awarded: false, gained: 0 }; /* server already awarded at upload time */
      const d = guestLoad();
      d.archiveAwards = d.archiveAwards || [];
      if (!recId || d.archiveAwards.includes(recId)) return { awarded: false, gained: 0, total: d.points, newBadges: [] };
      d.archiveAwards.push(recId);
      d.archiveSubs = (d.archiveSubs || 0) + 1;
      d.points += ACTIONS.archive;
      const fresh = guestEval(d);
      guestPersist(d);
      return { awarded: true, gained: ACTIONS.archive, badge: "preserver", total: d.points, newBadges: fresh };
    }
  });

  /* expose a toast on HERITAGE for auth.js & pages */
  document.addEventListener("DOMContentLoaded", () => {
    try { window.HERITAGE = window.HERITAGE || {}; HERITAGE.toast = showToast; } catch (e) {}
  });
})();
