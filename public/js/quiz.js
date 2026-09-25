/* ============================================================
   VIBHOR — Interactive Heritage Quiz engine
   start → question loop → results · streaks · speed bonuses ·
   timer · sounds · confetti · keyboard play · best-score
   ============================================================ */
(function () {
  "use strict";
  const BANK = window.HERITAGE_QUIZ || { categories: [], questions: [] };
  const CATS = BANK.categories;
  const ALLQ = BANK.questions;
  const ROUND = 10;
  const KB = window.HERITAGE_STATES || [];
  const kbGet = (n) => (KB.get ? KB.get(n) : null);
  const curLang = () => { try { return (window.VIBHOR_I18N && window.VIBHOR_I18N.getLang()) || "en"; } catch (e) { return "en"; } };
  const t = (key, fb) => {
    try {
      const d = window.VIBHOR_I18N_DATA;
      return (d && d[curLang()] && d[curLang()][key]) || fb;
    } catch (e) { return fb; }
  };
  const tpl = (str, vars) => String(str).replace(/\{s\}/g, vars.s == null ? "" : String(vars.s)).replace(/\{a\}/g, vars.a == null ? "" : String(vars.a));
  const stateName = (st, l) => (st && st.t && st.t[l] && st.t[l].name) || (st ? st.name : "");
  const L5 = (st, k) => {
    const l = curLang();
    return (st.t && st.t[l] && st.t[l][k]) || (st.t && st.t.en && st.t.en[k]) || "";
  };

  /* ---------------- state challenge: 10 questions built from one state's KB ---------------- */
  function buildStateRound(stateNameStr) {
    const st = kbGet(stateNameStr) || KB[0] || null;
    if (!st) return shuffle(ALLQ).slice(0, ROUND);
    const en = stateName(st, curLang());
    const others = KB.filter((x) => x.name !== st.name);
    const mk = (q, opts, a, w) => ({ c: "state", e: "🗺️", q, o: opts, a, w });
    const uniq = (arr, avoid) => {
      const out = [];
      for (const v of arr) if (v && v !== avoid && !out.includes(v)) out.push(v);
      return out.slice(0, 3);
    };
    const capOpts = () => uniq(shuffle(others.map((o) => o.capital)), st.capital);
    const stateOpts = () => uniq(shuffle(others).map((o) => stateName(o, curLang())), en);
    let list = [];
    const cap = () => mk(tpl(t("qz.capitalQ", "What is the capital of {s}?"), { s: en }),
      shuffle([st.capital].concat(capOpts())), st.capital,
      tpl(t("qz.capitalWhy", "{a} is the capital of {s}."), { a: st.capital, s: en }));
    const food = (i) => {
      const d = st.food && st.food[i];
      return d ? mk(tpl(t("qz.foodQ", "'{a}' is a traditional dish of which state or UT?"), { a: d }),
        shuffle([en].concat(stateOpts())), en,
        tpl(t("qz.foodWhy", "{a} is a traditional dish of {s}."), { a: d, s: en })) : null;
    };
    const fest = (i) => {
      const f = st.festivals && st.festivals[i];
      return f ? mk(tpl(t("qz.festQ", "Which of these festivals is a celebrated tradition of {s}?"), { s: en }),
        shuffle([f].concat(uniq(shuffle(others.map((o) => (o.festivals && o.festivals[0]) || "")), f))), f,
        tpl(t("qz.festWhy", "{a} is a celebrated festival of {s}."), { a: f, s: en })) : null;
    };
    const dance = (i) => {
      const d = st.dance && st.dance[i];
      return d ? mk(tpl(t("qz.danceQ", "The dance '{a}' belongs to which state or UT?"), { a: d }),
        shuffle([en].concat(stateOpts())), en,
        tpl(t("qz.danceWhy", "{a} is a traditional dance of {s}."), { a: d, s: en })) : null;
    };
    const place = (i) => {
      const h = st.heritage && st.heritage[i];
      return h ? mk(tpl(t("qz.placeQ", "'{a}' is located in which state or UT?"), { a: h }),
        shuffle([en].concat(stateOpts())), en,
        tpl(t("qz.placeWhy", "{a} is found in {s}."), { a: h, s: en })) : null;
    };
    const about = () => mk(t("qz.aboutQ", "Read the clue - which state or UT is this?") + " \u201c" + L5(st, "about") + "\u201d",
      shuffle([en].concat(stateOpts())), en,
      tpl(t("qz.aboutWhy", "{a} - that was the state!"), { a: en }));
    const items = (window.HERITAGE && window.HERITAGE.items || []).filter((i) => i.state === st.name);
    const item = (i) => {
      if (!items[i]) return null;
      const it = items[i];
      const names = (window.HERITAGE.items || []).filter((x) => x.state !== st.name).map((x) => x.name);
      return mk(tpl(t("qz.itemQ", "Which of these treasures is found in {s}?"), { s: en }),
        shuffle([it.name].concat(uniq(shuffle(names), it.name))), it.name,
        tpl(t("qz.itemWhy", "{a} is one of the curated treasures of {s}."), { a: it.name, s: en }));
    };
    (st.food || []).forEach((_, i) => { const q = food(i); if (q) list.push(q); });
    (st.festivals || []).forEach((_, i) => { const q = fest(i); if (q) list.push(q); });
    (st.dance || []).forEach((_, i) => { const q = dance(i); if (q) list.push(q); });
    (st.heritage || []).forEach((_, i) => { const q = place(i); if (q) list.push(q); });
    [cap(), about()].forEach((q) => { if (q) list.push(q); });
    items.forEach((_, i) => { const q = item(i); if (q) list.push(q); });
    list = list.filter((q) => q && q.o.length === 4);
    if (list.length < ROUND && ALLQ.length) list.push(...shuffle(ALLQ).slice(0, ROUND - list.length));
    return shuffle(list).slice(0, ROUND);
  }
  const QTIME = 12000; // ms per question
  const LS_BEST = "vh_quiz_best";
  const LS_MUTE = "vh_quiz_mute";

  const qs = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const rnd = (a) => a[Math.floor(Math.random() * a.length)];
  const shuffle = (a) => {
    const r = a.slice();
    for (let i = r.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [r[i], r[j]] = [r[j], r[i]];
    }
    return r;
  };

  let S = null; // game state
  let muted = false;
  try { muted = localStorage.getItem(LS_MUTE) === "1"; } catch (e) {}
  let timer = null;

  /* ---------------- sound (tiny WebAudio blips, no assets) ---------------- */
  let actx = null;
  function beep(freq, dur, type, when, vol) {
    if (muted) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const t = actx.currentTime + (when || 0);
      const o = actx.createOscillator();
      const g = actx.createGain();
      o.type = type || "sine";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol || 0.18, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(actx.destination);
      o.start(t);
      o.stop(t + dur + 0.05);
    } catch (e) {}
  }
  const sndCorrect = () => { beep(660, 0.12, "sine", 0, 0.16); beep(880, 0.2, "sine", 0.1, 0.16); };
  const sndWrong = () => { beep(196, 0.22, "triangle", 0, 0.2); beep(147, 0.3, "triangle", 0.12, 0.16); };
  const sndTick = () => beep(1200, 0.05, "sine", 0, 0.05);
  const sndWin = () => { [523, 659, 784, 1047].forEach((f, i) => beep(f, 0.22, "sine", i * 0.13, 0.16)); };

  /* ---------------- helpers ---------------- */
  function catMeta(key, regionKey) {
    if (key === "state") return { key: "state", name: t("qz.stateMode", "State Challenge"), emoji: "🗺️", blurb: "" };
    if (key === "region") {
      const r = window.HERITAGE && HERITAGE.regions ? HERITAGE.regions[regionKey] : null;
      return { key: "region", name: (r ? r.name : "Region") + " " + t("qz.regionMode", "Round"), emoji: "🧭", blurb: "" };
    }
    return CATS.find((c) => c.key === key) || CATS[0];
  }
  function drawRound(catKey, pick) {
    if (catKey === "state") return buildStateRound(pick);
    if (catKey === "region") {
      /* region mode: mix question banks from every state in the region */
      const sts = KB.filter((st) => st.region === pick);
      if (!sts.length) return shuffle(ALLQ).slice(0, ROUND);
      const pool = [];
      shuffle(sts.slice()).forEach((st) => { pool.push.apply(pool, buildStateRound(st.name).slice(0, 4)); });
      return shuffle(pool).slice(0, ROUND);
    }
    let pool = catKey === "mixed" ? ALLQ.slice() : ALLQ.filter((q) => q.c === catKey);
    return shuffle(pool).slice(0, ROUND);
  }
  function speedBonus(ms) {
    if (ms < 4000) return 50;
    if (ms < 8000) return 25;
    return 0;
  }
  function streakBonus(streak) {
    return Math.min(75, Math.max(0, streak - 1) * 25);
  }
  const MAX_Q = 100 + 50 + 75; // 225 per question
  function rankOf(pct) {
    if (pct >= 90) return { name: "Heritage Legend", e: "🏆", line: "Incredible! You know India's heritage better than most encyclopaedias." };
    if (pct >= 75) return { name: "Heritage Wizard", e: "🧙", line: "Wow — you caught the details most people miss. Keep climbing!" };
    if (pct >= 60) return { name: "Culture Explorer", e: "🧭", line: "Strong knowledge! A little more wandering and you're a wizard." };
    if (pct >= 40) return { name: "Curious Voyager", e: "🎒", line: "Good start! Explore the treasures and come back for round two." };
    return { name: "Heritage Rookie", e: "🌱", line: "Every expert started here. Dive into the regions and level up!" };
  }
  function bestScore() {
    try {
      const b = JSON.parse(localStorage.getItem(LS_BEST) || "null");
      if (b && typeof b.score === "number") return b;
    } catch (e) {}
    return null;
  }
  function saveBest(score, catKey) {
    const b = bestScore();
    if (!b || score > b.score) {
      try { localStorage.setItem(LS_BEST, JSON.stringify({ score, cat: catKey, date: new Date().toISOString().slice(0, 10) })); } catch (e) {}
    }
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(() => true).catch(() => legacyCopy(text));
    }
    return Promise.resolve(legacyCopy(text));
  }
  function legacyCopy(text) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch (e) { return false; }
  }

  /* ---------------- confetti ---------------- */
  function confetti() {
    const cv = qs("#confetti-canvas");
    if (!cv) return;
    const ctx = cv.getContext ? cv.getContext("2d") : null;
    if (!ctx) return; // no 2d canvas available
    cv.width = innerWidth; cv.height = innerHeight;
    const colors = ["#D4AF37", "#e8cd75", "#f4e9d3", "#ff9d5c", "#2B0000", "#ff5c8a"];
    const parts = [];
    for (let i = 0; i < 150; i++) {
      parts.push({
        x: Math.random() * cv.width,
        y: -20 - Math.random() * cv.height * 0.5,
        w: 5 + Math.random() * 7,
        h: 8 + Math.random() * 8,
        c: rnd(colors),
        vy: 2 + Math.random() * 3.5,
        vx: -1.5 + Math.random() * 3,
        rot: Math.random() * Math.PI,
        vr: -0.12 + Math.random() * 0.24
      });
    }
    const t0 = performance.now();
    (function frame(t) {
      const el = t - t0;
      ctx.clearRect(0, 0, cv.width, cv.height);
      let alive = false;
      for (const p of parts) {
        p.y += p.vy; p.x += p.vx + Math.sin(p.y / 40) * 0.7; p.rot += p.vr;
        if (p.y < cv.height + 30) alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, 1 - el / 4200);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (alive && el < 4500) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, cv.width, cv.height);
    })(t0);
  }

  /* ---------------- rendering ---------------- */
  const root = () => qs("#quiz-root");

  function renderStart() {
    const b = bestScore();
    root().innerHTML = `
      <div class="qz-start">
        ${b ? `<div class="qz-best">
          <span>🏅 Your best</span><b>${b.score}</b>
          <small>· ${esc(catMeta(b.cat).name)}</small>
        </div>` : ""}
        <h2 class="qz-hello">Choose your battlefield <span aria-hidden="true">👇</span></h2>
        <div class="qz-cats">
          ${CATS.map((c) => `
            <button class="qz-cat" data-cat="${c.key}">
              <span class="qz-cat-e" aria-hidden="true">${c.emoji || "🎲"}</span>
              <span class="qz-cat-n">${esc(c.name)}</span>
              <span class="qz-cat-b">${esc(c.blurb)}</span>
            </button>`).join("")}
        </div>
        ${stateBlock()}
        ${regionBlock()}
        <p class="qz-hint">⌨️ Tip: play with keys <b>1–4</b> · <b>Enter</b> to continue · sound on by default 🔊</p>
      </div>`;
    qsa(".qz-cat").forEach((btn) =>
      btn.addEventListener("click", () => { sndTick(); startGame(btn.dataset.cat); })
    );
    const ss = qs("#qzStateStart");
    if (ss) ss.addEventListener("click", () => {
      sndTick();
      const sel = qs("#qzStateSel");
      startGame("state", sel ? sel.value : KB[0].name);
    });
    qsa(".qz-region").forEach((btn) =>
      btn.addEventListener("click", () => { sndTick(); startGame("region", btn.dataset.region); })
    );
  }

  function stateBlock() {
    if (!KB.length) return "";
    const l = curLang();
    return `
      <div class="qz-stateblock">
        <h3 class="qz-state-title">${esc(t("qz.stateMode", "State Challenge"))} <span aria-hidden="true">🗺️</span></h3>
        <p class="qz-state-choose">${esc(t("qz.stateChoose", "Pick any state or Union Territory - 10 questions built from its capital, food, festivals, dances, crafts and stories."))}</p>
        <div class="qz-state-row">
          <select id="qzStateSel" class="qz-state-sel" aria-label="State">
            ${KB.map((st) => `<option value="${esc(st.name)}">${esc(stateName(st, l))}</option>`).join("")}
          </select>
          <button class="btn btn-gold" id="qzStateStart">${esc(t("qz.stateStart", "Start state round"))} ▸</button>
        </div>
      </div>`;
  }

  function regionBlock() {
    const R = window.HERITAGE && HERITAGE.regions ? HERITAGE.regions : {};
    const keys = Object.keys(R);
    if (!keys.length) return "";
    return `
      <div class="qz-stateblock">
        <h3 class="qz-state-title">${esc(t("qz.regionMode", "Region Round"))} <span aria-hidden="true">🧭</span></h3>
        <p class="qz-state-choose">${esc(t("qz.regionChoose", "One round, one whole region — questions drawn from all its states & UTs."))}</p>
        <div class="qz-region-row">
          ${keys.map((k) => `<button class="qz-region btn btn-ghost" data-region="${k}">${esc(R[k].name)} ▸</button>`).join("")}
        </div>
      </div>`;
  }

  /* localise the start screen when the language changes mid-page */
  window.addEventListener("vh:langchange", () => { if (!S) renderStart(); });

  function qsa(sel, el = document) { return Array.from(el.querySelectorAll(sel)); }

  function startGame(catKey, stateNameStr) {
    S = {
      cat: catKey,
      stateName: stateNameStr || "",
      qs: drawRound(catKey, stateNameStr),
      i: 0,
      score: 0,
      correct: 0,
      streak: 0,
      bestStreak: 0,
      times: [],
      answers: [],
      locked: false,
      done: false,
      qStart: 0
    };
    renderQuestion();
  }

  function renderQuestion() {
    const q = S.qs[S.i];
    const meta = catMeta(S.cat, S.stateName);
    S.locked = false;
    S.qStart = performance.now();
    root().innerHTML = `
      <div class="qz-game">
        <div class="qz-top">
          <span class="qz-qcount">Question <b>${S.i + 1}</b> / ${S.qs.length}</span>
          <span class="qz-streak hide" id="qzStreak">🔥 <b>0</b> streak</span>
          <span class="qz-score" id="qzScore" title="Your score">⭐ 0</span>
          <button class="qz-mute ${muted ? "is-muted" : ""}" id="qzMute" aria-label="Toggle sound">${muted ? "🔇" : "🔊"}</button>
        </div>
        <div class="qz-progress"><div class="qz-progress-fill" id="qzProgress"></div></div>
        <div class="qz-timer"><div class="qz-timer-fill" id="qzTimer"></div></div>

        <div class="qz-card" id="qzCard">
          <span class="qz-cat-tag">${meta.emoji || ""} ${esc(meta.name)}${S.cat === "state" && S.stateName ? ` · ${esc(stateName(kbGet(S.stateName), curLang()))}` : ""}</span>
          <h2 class="qz-q">${q.e ? `<span aria-hidden="true">${q.e}</span> ` : ""}${esc(q.q)}</h2>
          <div class="qz-opts" id="qzOpts">
            ${q.o.map((o, idx) => `
              <button class="qz-opt" data-i="${idx}">
                <span class="qz-opt-key">${"ABCD"[idx]}</span>
                <span class="qz-opt-t">${esc(o)}</span>
                <span class="qz-opt-mark" aria-hidden="true"></span>
              </button>`).join("")}
          </div>
        </div>

        <div class="qz-feedback hide" id="qzFeedback">
          <div class="qz-fb-head"></div>
          <div class="qz-fb-why"></div>
          <button class="btn btn-gold btn-next" id="qzNext">Next question <span aria-hidden="true">→</span></button>
        </div>
      </div>`;

    // wire up
    qsa(".qz-opt").forEach((btn) =>
      btn.addEventListener("click", () => answer(+btn.dataset.i, performance.now() - S.qStart))
    );
    qs("#qzMute").addEventListener("click", () => {
      muted = !muted;
      try { localStorage.setItem(LS_MUTE, muted ? "1" : "0"); } catch (e) {}
      qs("#qzMute").textContent = muted ? "🔇" : "🔊";
      qs("#qzMute").classList.toggle("is-muted", muted);
    });
    qs("#qzNext").addEventListener("click", next);
    setProgress();
    updateStreakChip();
    startTimer();
  }

  function setProgress() {
    const p = qs("#qzProgress");
    if (p) p.style.width = ((S.i + 1) / S.qs.length) * 100 + "%";
  }
  function updateStreakChip() {
    const chip = qs("#qzStreak");
    if (!chip) return;
    chip.classList.toggle("hide", S.streak < 2);
    chip.querySelector("b").textContent = S.streak;
  }
  function startTimer() {
    clearInterval(timer);
    const bar = qs("#qzTimer");
    if (!bar) return;
    bar.style.transition = "none";
    bar.style.width = "100%";
    // force reflow so the transition restarts each question
    void bar.offsetWidth;
    bar.style.transition = `width ${QTIME}ms linear`;
    bar.style.width = "0%";
    timer = setTimeout(() => { if (S && !S.locked) answer(-1, QTIME); }, QTIME);
  }

  function answer(idx, ms) {
    if (S.locked) return;
    S.locked = true;
    clearInterval(timer);
    const q = S.qs[S.i];
    const ok = idx === q.a;
    const gain = ok ? 100 + speedBonus(ms) + streakBonus(S.streak) : 0;
    if (ok) {
      S.score += gain;
      S.correct++;
      S.streak++;
      S.bestStreak = Math.max(S.bestStreak, S.streak);
      S.times.push(ms);
      sndCorrect();
    } else {
      S.streak = 0;
      sndWrong();
    }
    S.answers.push({ q, idx, ok, gain, ms });

    // paint options
    qsa(".qz-opt").forEach((btn) => {
      const i = +btn.dataset.i;
      btn.classList.remove("qz-opt");
      btn.disabled = true;
      if (i === q.a) { btn.className = "qz-opt is-right"; btn.querySelector(".qz-opt-mark").textContent = "✓"; }
      else if (i === idx) { btn.className = "qz-opt is-wrong"; btn.querySelector(".qz-opt-mark").textContent = "✕"; }
      else btn.className = "qz-opt is-dim";
    });
    qs("#qzCard").classList.add(ok ? "is-correct" : "is-wrong");

    // feedback panel
    const fb = qs("#qzFeedback");
    const head = qs(".qz-fb-head", fb);
    const why = qs(".qz-fb-why", fb);
    if (idx === -1) {
      head.innerHTML = `<span class="fb-emoji">⏰</span> Time's up! The answer: <b>${esc(q.o[q.a])}</b>`;
    } else if (ok) {
      const praise = rnd(["Correct! 🎯", "Awesome! ⭐", "Nailed it! 💪", "You're on fire! 🔥", "Brilliant! ✨"]);
      head.innerHTML = `<span class="fb-emoji">✅</span> ${praise} <b>+${gain} points</b>`;
    } else {
      head.innerHTML = `<span class="fb-emoji">😅</span> ${rnd(["Oops!", "Not quite!", "Tough one!", "Almost!"])} The answer: <b>${esc(q.o[q.a])}</b>`;
    }
    why.innerHTML = `<div class="qz-why"><span class="qz-why-tag">💡 Did you know?</span> ${esc(q.w)}</div>`;
    fb.classList.remove("hide");
    if (fb.scrollIntoView) fb.scrollIntoView({ behavior: "smooth", block: "nearest" });

    const sc = qs("#qzScore");
    sc.textContent = "⭐ " + S.score;
    sc.classList.add("bump");
    setTimeout(() => sc.classList.remove("bump"), 500);
    updateStreakChip();

    const last = S.i === S.qs.length - 1;
    qs("#qzNext").innerHTML = last
      ? `See my result <span aria-hidden="true">🏁</span>`
      : `Next question <span aria-hidden="true">→</span>`;
  }

  function next() {
    if (!S || !S.locked || S.done) return;
    sndTick();
    S.i++;
    if (S.i >= S.qs.length) renderResult();
    else renderQuestion();
  }

  function renderResult() {
    S.done = true;
    saveBest(S.score, S.cat);
    /* shared journey: award heritage points + check quiz badges */
    const maxRound = S.qs.length * MAX_Q;
    const reward = window.HERITAGE_PROGRESS
      ? window.HERITAGE_PROGRESS.addQuizRound({
          score: S.score,
          correct: S.correct,
          answered: S.qs.length,
          cat: S.cat,
          mode: S.cat === "state" ? "state" : S.cat === "region" ? "region" : "category",
          key: S.cat === "state" || S.cat === "region" ? S.stateName : S.cat,
          pct: Math.round((S.score / maxRound) * 100)
        })
      : { earned: 0, total: 0, newBadges: [] };
    const nextGoal = window.HERITAGE_PROGRESS ? window.HERITAGE_PROGRESS.nextBadge() : null;
    const max = S.qs.length * MAX_Q;
    const pct = Math.round((S.score / max) * 100);
    const rank = rankOf(pct);
    const meta = catMeta(S.cat, S.stateName);
    const wrongs = S.answers.filter((a) => !a.ok);
    const avg = S.times.length
      ? Math.round(S.times.reduce((x, y) => x + y, 0) / S.times.length / 1000) + "s"
      : "—";
    const b = bestScore();
    const isNewBest = b && b.score === S.score;

    root().innerHTML = `
      <div class="qz-result">
        <div class="qz-rank-card ${pct >= 60 ? "glow" : ""}">
          <div class="qz-rank-e" aria-hidden="true">${rank.e}</div>
          <div class="qz-rank-name">${esc(rank.name)}</div>
          <div class="qz-rank-score"><b>${S.score}</b> / ${max}</div>
          <div class="qz-rank-pct">${pct}% · ${esc(meta.name)}${isNewBest ? ' · <span class="new-best">NEW BEST! 🎉</span>' : ""}</div>
          <p class="qz-rank-line">${esc(rank.line)}</p>
        </div>

        <div class="qz-reward">
          <div class="qr-item"><span>🎁 Round reward</span><b>+${reward.earned} pts</b></div>
          <div class="qr-item"><span>⭐ Heritage points</span><b>${reward.total}</b></div>
          ${reward.newBadges.length
            ? `<div class="qr-item qr-badge">🏅 New badge</div>` + reward.newBadges.map((bd) =>
                `<div class="qr-badge-card">${bd.e} <b>${esc(bd.name)}</b><small>+${bd.bonus} pts unlocked</small></div>`).join("")
            : `<div class="qr-item"><span>🏅 Next badge</span><b>${nextGoal ? esc(nextGoal.name) : "All earned!"}</b></div>`}
          ${nextGoal && !reward.newBadges.length
            ? `<div class="qr-goal"><div class="qr-goal-bar"><div style="width:${Math.min(100, Math.round((nextGoal.cur / nextGoal.need) * 100))}%"></div></div>
              <small>${Math.min(nextGoal.cur, nextGoal.need)}/${nextGoal.need} to <b>${esc(nextGoal.name)}</b> — keep going!</small></div>`
            : ""}
        </div>

        <div class="qz-stats">
          <div><b>${S.correct}/${S.qs.length}</b><span>correct</span></div>
          <div><b>${S.bestStreak}🔥</b><span>best streak</span></div>
          <div><b>${avg}</b><span>avg. speed</span></div>
          <div><b>${b ? b.score : "—"}</b><span>all-time best</span></div>
        </div>

        ${wrongs.length ? `
        <div class="qz-review">
          <h3>Review your misses 📖</h3>
          <ul>
            ${wrongs.map((w) => `
              <li>
                <div class="rv-q">${w.q.e ? `<span aria-hidden="true">${w.q.e}</span> ` : ""}${esc(w.q.q)}</div>
                <div class="rv-a">
                  <span class="rv-mine">${w.idx === -1 ? "⏰ No answer" : "You: " + esc(w.q.o[w.idx])}</span>
                  <span class="rv-right">✓ ${esc(w.q.o[w.q.a])}</span>
                </div>
                <div class="rv-w">${esc(w.q.w)}</div>
              </li>`).join("")}
          </ul>
        </div>` : `
        <div class="qz-perfect">🎆 PERFECT ROUND! All ${S.qs.length} correct — you're officially dangerous now.</div>`}

        <div class="qz-actions">
          <button class="btn btn-gold" id="qzAgain">Play again <span aria-hidden="true">🔄</span></button>
          <a class="btn btn-gold" href="my-vibhor.html">📘 See it in My VIBHOR</a>
          <button class="btn btn-ghost" id="qzCats">Change topic <span aria-hidden="true">🎲</span></button>
          <button class="btn btn-ghost" id="qzShare">Share score <span aria-hidden="true">📤</span></button>
        </div>
        <a class="qz-explore" href="region.html${meta.key === "mixed" ? "" : "?c=" + meta.key}">Or explore these treasures in the region explorer →</a>
        <p class="qz-hint" style="margin-top:18px">⌨️ Press <b>Enter</b> to play again</p>
      </div>`;

    if (pct >= 60) { confetti(); sndWin(); }
    /* replay the SAME round type — state and region rounds keep their pick */
    qs("#qzAgain").addEventListener("click", () => { sndTick(); startGame(S.cat, S.stateName); });
    qs("#qzCats").addEventListener("click", () => { sndTick(); S = null; renderStart(); });
    qs("#qzShare").addEventListener("click", () => {
      const text = `I scored ${S.score}/${max} (${pct}%) in the VIBHOR Heritage Quiz — rank: ${rank.name} ${rank.e} Can you beat me? 🇮🇳`;
      copyText(text).then(() => {
        const btn = qs("#qzShare");
        btn.innerHTML = "Copied! <span aria-hidden=\"true\">✅</span>";
        setTimeout(() => { btn.innerHTML = 'Share score <span aria-hidden="true">📤</span>'; }, 1800);
      });
    });
  }

  /* ---------------- keyboard play ---------------- */
  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (!S) {
      if (e.key === "Enter") {
        const first = qs("#quiz-root .qz-cat");
        if (first) first.click();
      }
      return;
    }
    // results screen: Enter replays
    if (qs("#quiz-root .qz-result")) {
      if (e.key === "Enter") {
        const btn = qs("#quiz-root #qzAgain");
        if (btn) btn.click();
      }
      return;
    }
    if (!S.locked && (e.key >= "1" && e.key <= "4" || "abcd".includes(e.key.toLowerCase()) && e.key.length === 1)) {
      const map = { "1": 0, "2": 1, "3": 2, "4": 3, a: 0, b: 1, c: 2, d: 3 };
      const idx = map[String(e.key).toLowerCase()];
      if (idx != null && qs("#quiz-root .qz-opt[data-i=\"" + idx + "\"]:not(:disabled)")) {
        answer(idx, performance.now() - S.qStart);
      }
    }
    if (S.locked && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      next();
    }
  });

  /* ---------------- boot ---------------- */
  document.addEventListener("DOMContentLoaded", renderStart);
})();
/* numeric keys 1-9 answer the matching option (E2E-stable addressing) */
document.addEventListener("keydown", (e) => {
  if (!/^[1-9]$/.test(e.key) || /input|textarea|select/i.test(document.activeElement && document.activeElement.tagName || "")) return;
  const opts = document.querySelectorAll("#qzOptions .qz-opt");
  const pick = opts[+e.key - 1];
  if (pick && !pick.disabled) pick.click();
});
