/* VIBHOR — My VIBHOR page
   One dashboard: profile · points · passport (stamps + region
   progress + completion %) · quiz history · badges · challenges ·
   contributions · saved journeys. Guests see the same layout fed
   by the device-local engine + honest sign-in hints. */
(function () {
  "use strict";
  const D = window.HERITAGE;
  const qs = (s, el = document) => el.querySelector(s);
  const esc = D.esc || ((s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])));
  const tr = (key, fb) => D.tr ? D.tr(key, fb) : fb;
  const fmtDate = (iso) => { try { return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }); } catch (e) { return iso || ""; } };

  let DASH = null;   /* /api/user/dashboard when authenticated */
  const P = () => window.HERITAGE_PROGRESS;

  /* ---------- header ---------- */
  function renderHead() {
    const el = qs("#mvHead");
    if (!el) return;
    const me = window.VH_API ? VH_API.me() : null;
    const authed = me && me.authenticated && me.user;
    const pts = P() ? P().totalPoints() : 0;
    const stamped = P() ? P().states() : 0;
    const level = P() ? P().levelFor(stamped) : { name: "—", e: "📘", line: "" };
    name = authed ? me.user.name : tr("mv.guest.title", "Guest Explorer");
    el.innerHTML = `
      <div class="mv-id">
        <span class="mv-ava">${esc((authed ? me.user.name : "G").trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase())}</span>
        <div class="mv-id-txt">
          <span class="overline">${esc(tr("mv.title", "My VIBHOR"))}</span>
          <h1>${esc(authed ? me.user.name : tr("mv.guest.title", "Your guest journey"))}</h1>
          <p>${esc(level.e)} ${esc(level.name)}${authed && me.user.created_at ? " · " + esc(tr("mv.member", "Member since")) + " " + esc(fmtDate(me.user.created_at)) : ""}</p>
        </div>
        <div class="mv-hstats">
          <div class="stat"><b>${pts}</b><span>${esc(tr("jd.points", "Heritage points"))}</span></div>
          <div class="stat"><b>${stamped}<small>/36</small></b><span>${esc(tr("jd.states", "States stamped"))}</span></div>
          <div class="stat"><b>${P() ? P().earnedCount() : 0}<small>/${P() ? P().BADGES.length : 11}</small></b><span>${esc(tr("jd.badges", "Badges earned"))}</span></div>
        </div>
        ${authed
          ? `<button type="button" class="btn btn-ghost btn-sm" id="mvSignOut">${esc(tr("mv.signout", "Sign out"))}</button>`
          : `<button type="button" class="btn btn-gold btn-sm" id="mvSignIn">${esc(tr("nav.signin", "Sign in"))}</button>`}
      </div>`;
    const so = qs("#mvSignOut", el);
    if (so) so.addEventListener("click", () => VH_API.logout());
    const si = qs("#mvSignIn", el);
    if (si) si.addEventListener("click", () => window.VIBHOR_AUTH && VIBHOR_AUTH.open("login"));
  }

  /* ---------- guest banner ---------- */
  function renderGuestBanner() {
    const el = qs("#mvGuest");
    if (!el) return;
    const authed = VH_API.isLoggedIn();
    el.innerHTML = authed ? "" : `
      <div class="mv-guestban reveal visible">
        <span aria-hidden="true">🎒</span>
        <p>${esc(tr("mv.guest.line", "Everything here lives on this device. Create a free account to sync it everywhere and join the community."))}</p>
        <button type="button" class="btn btn-gold btn-sm" id="mvGuestAuth">${esc(tr("auth.register", "Create account"))}</button>
      </div>`;
    const b = qs("#mvGuestAuth", el);
    if (b) b.addEventListener("click", () => window.VIBHOR_AUTH && VIBHOR_AUTH.open("register"));
  }

  /* ---------- section tabs ---------- */
  function renderTabs() {
    const el = qs("#mvTabs");
    if (!el) return;
    const tabs = [
      ["#passport", "📘", tr("mv.tab.passport", "Passport")],
      ["#quiz", "🎲", tr("mv.tab.quiz", "Quiz")],
      ["#badges", "🏅", tr("mv.tab.badges", "Badges")],
      ["#challenges", "🏆", tr("mv.tab.challenges", "Challenges")],
      ["#contributions", "🎞️", tr("mv.tab.contrib", "Contributions")],
      ["#journey", "🧭", tr("mv.tab.journey", "Journey")]
    ];
    el.innerHTML = tabs.map(([h, e, l]) => `<a href="${h}" class="mv-tab">${e} ${esc(l)}</a>`).join("");
  }

  /* ---------- passport: stamp book + region progress + % ---------- */
  function renderPassport() {
    const el = qs("#mvPassport");
    if (!el || !P()) return;
    const stamps = new Set(P().stamps());
    const KB = window.HERITAGE_STATES || [];
    const total = KB.length || 36;
    const pct = Math.round((stamps.size / total) * 100);
    const celebrated = new URLSearchParams(location.search).get("celebrate");

    const regions = { north: [], south: [], east: [], west: [] };
    KB.forEach((st) => (regions[st.region] = regions[st.region] || []).push(st));

    el.innerHTML = `
      <div class="pass-wrap">
        <div class="pass-ringbox">
          <svg class="pass-ring" viewBox="0 0 120 120" aria-label="${pct}% ${esc(tr("mv.complete", "{n}% complete").replace("{n}", pct))}">
            <circle cx="60" cy="60" r="52" class="pr-bg"/>
            <circle cx="60" cy="60" r="52" class="pr-fg" style="stroke-dasharray:${(pct / 100) * 326.7} 326.7"/>
          </svg>
          <div class="pass-ring-txt"><b>${pct}%</b><span>${esc(tr("mv.complete", "{n}% complete").replace("{n}", "")) || ""}</span></div>
          <small>${stamps.size}/${total} ${esc(tr("mv.stamped", "Stamped"))}</small>
        </div>
        <div class="pass-units">
          ${Object.keys(regions).map((rk) => {
            const arr = regions[rk];
            const done = arr.filter((s) => stamps.has(s.name)).length;
            const rname = D.regions[rk] ? D.regions[rk].name : rk;
            return `
            <div class="pass-region">
              <div class="pr-row">
                <b>${esc(rname)}</b><span>${done}/${arr.length}</span>
              </div>
              <div class="pr-bar"><i style="width:${arr.length ? Math.round((done / arr.length) * 100) : 0}%"></i></div>
              <div class="pass-grid" role="list">
                ${arr.map((st) => {
                  const has = stamps.has(st.name);
                  return `
                  <div class="pass-stamp ${has ? "on" : ""} ${celebrated === st.name ? "celebrate" : ""}" role="listitem" title="${esc(st.name)}${has ? " ✓" : ""}">
                    <span class="ps-e" aria-hidden="true">${has ? (st.emoji || "🗺️") : "⬚"}</span>
                    <span class="ps-n">${esc(st.name)}</span>
                    <small>${has ? "✓ " + esc(tr("mv.stamped", "Stamped")) : esc(tr("mv.waiting", "Waiting"))}</small>
                  </div>`;
                }).join("")}
              </div>
            </div>`;
          }).join("")}
        </div>
      </div>
      ${!stamps.size ? `<div class="empty" style="margin-top:18px"><div class="e-icon">📘</div><p>${esc(tr("mv.noStamps", "No stamps yet — explore a state and add your first."))}</p></div>` : ""}`;
  }

  /* ---------- quiz history ---------- */
  function quizRows() {
    if (VH_API.isLoggedIn() && DASH) return DASH.quizHistory || [];
    /* guest: local rounds */
    try {
      const d = JSON.parse(localStorage.getItem("vh_progress_v1") || "null");
      return (d && d.rounds ? d.rounds.slice().reverse() : []).map((r) => ({
        mode: r.mode, key_name: r.key, score: r.score, correct: r.correct, answered: r.answered, pct: r.pct, created_at: "—"
      }));
    } catch (e) { return []; }
  }
  function renderQuiz() {
    const el = qs("#mvQuiz");
    if (!el || !P()) return;
    const rows = quizRows();
    const s = P().quizStats();
    const acc = P().accuracy();
    const CATN = (k) => { const c = D.catOf(k); return c.name || k; };
    const MODE = { category: "🎯", state: "🗺️", region: "🧭" };
    el.innerHTML = `
      <div class="mv-qmeters">
        <div class="stat"><b>${s.plays}</b><span>${esc(tr("mv.quiz.rounds", "Rounds"))}</span></div>
        <div class="stat"><b>${s.best}</b><span>${esc(tr("mv.quiz.best", "Best score"))}</span></div>
        <div class="stat"><b>${s.perfects}</b><span>${esc(tr("mv.quiz.perfects", "Perfect rounds"))}</span></div>
        <div class="stat"><b>${acc != null ? acc + "%" : "—"}</b><span>${esc(tr("jd.acc", "Quiz accuracy"))}</span></div>
      </div>
      ${rows.length ? `
      <div class="mv-tablewrap"><table class="mv-table">
        <thead><tr><th></th><th>${esc(tr("mv.quiz.mode", "Mode"))}</th><th>${esc(tr("com.lb.score", "Score"))}</th><th>${esc(tr("mv.quiz.correct", "Correct"))}</th><th>${esc(tr("mv.quiz.when", "When"))}</th></tr></thead>
        <tbody>
          ${rows.slice(0, 12).map((r) => `
          <tr>
            <td>${MODE[r.mode] || "🎯"}</td>
            <td>${esc(r.mode === "category" ? CATN(r.key_name) : (r.key_name || r.mode))}</td>
            <td><b>${r.score}</b></td>
            <td>${r.correct}/${r.answered} · ${r.pct}%</td>
            <td>${r.created_at === "—" ? "🖥️ " + esc(tr("mv.quiz.device", "this device")) : esc(fmtDate(r.created_at))}</td>
          </tr>`).join("")}
        </tbody>
      </table></div>`
      : `<div class="empty"><div class="e-icon">🎲</div><p>${esc(tr("mv.noQuiz", "No rounds yet — your first quiz is one click away."))}</p>
         <a class="btn btn-gold btn-sm" href="quiz.html">${esc(tr("mv.playQuiz", "Play the quiz"))}</a></div>`}`;
  }

  /* ---------- badges ---------- */
  function renderBadges() {
    const el = qs("#mvBadges");
    if (!el || !P()) return;
    const list = P().badges();
    const next = P().nextBadge();
    el.innerHTML = `
      ${next ? `<div class="next-badge">
        <span class="nb-e">${next.e}</span>
        <div><b>${esc(tr("mv.nextBadge", "Next badge"))}: ${esc(next.name)}</b>
        <p>${esc(next.line)}</p>
        <div class="nb-bar"><i style="width:${Math.min(100, Math.round((next.cur / next.need) * 100))}%"></i></div>
        <small>${next.cur}/${next.need}</small></div>
      </div>` : ""}
      <div class="badge-grid">
        ${list.map((b) => `
        <div class="badge-card ${b.earned ? "on" : ""}">
          <span class="bc-e">${b.e}</span>
          <b>${esc(b.name)}</b>
          <p>${esc(b.line)}</p>
          ${b.earned
            ? `<span class="bc-on">✓ ${esc(tr("mv.earned", "Earned"))}${b.earnedOn ? " · " + esc(b.earnedOn) : ""}</span>`
            : `<span class="bc-prog">${b.cur}/${b.need}</span>`}
        </div>`).join("")}
      </div>`;
  }

  /* ---------- challenges ---------- */
  function renderChallenges() {
    const el = qs("#mvChallenges");
    if (!el) return;
    const authed = VH_API.isLoggedIn();
    const joined = authed && DASH ? (DASH.challengesJoined || []) : [];
    const mine = authed && DASH ? (DASH.entries || []) : [];
    VH_API.get("/api/challenges").then(({ challenges }) => {
      const mineByCh = {};
      mine.forEach((m) => { (mineByCh[m.challenge_code] = mineByCh[m.challenge_code] || []).push(m); });
      el.innerHTML = challenges.length ? `
        <div class="ch-grid">
          ${challenges.map((c) => {
            const my = mineByCh[c.code] || [];
            const joinedC = authed ? (c.joined || joined.includes(c.code)) : false;
            return `
            <div class="ch-card">
              <span class="ch-e">${c.icon}</span>
              <div class="ch-body">
                <b>${esc(c.name)}</b>
                <p>${esc(c.descr)}</p>
                <small>${c.entries} ${esc(tr("com.entries", "entries"))} · ${c.participants} ${esc(tr("com.participants", "participants"))}${joinedC ? " · " + esc(tr("com.joined", "Joined ✓")) : ""}</small>
                <a class="btn btn-ghost btn-sm" href="${c.kind === "archive" ? "archive.html#preserve" : "community.html#challenges"}">${c.kind === "archive" ? "📜 " + esc(tr("arch.preserve", "Preserve a document")) : "🏆 " + esc(tr("com.challenges", "Challenges"))}</a>
              </div>
            </div>`;
          }).join("")}
        </div>`
        : `<div class="empty"><div class="e-icon">🏆</div><p>${esc(tr("mv.noChallenges", "You haven't joined a challenge yet — pick one in the Community."))}</p>
           <a class="btn btn-gold btn-sm" href="community.html#challenges">${esc(tr("com.challenges", "Challenges"))}</a></div>`;
      if (!authed) {
        el.innerHTML = `
        <div class="empty"><div class="e-icon">🏆</div><p>${esc(tr("mv.noChallenges", "You haven't joined a challenge yet — pick one in the Community."))}</p>
        <a class="btn btn-gold btn-sm" href="community.html#challenges">${esc(tr("com.challenges", "Challenges"))}</a></div>
        <div class="ch-grid" style="margin-top:18px">${challenges.map((c) => `
            <div class="ch-card">
              <span class="ch-e">${c.icon}</span>
              <div class="ch-body">
                <b>${esc(c.name)}</b>
                <p>${esc(c.descr)}</p>
                <small>${c.entries} ${esc(tr("com.entries", "entries"))} · ${c.participants} ${esc(tr("com.participants", "participants"))}</small>
              </div>
            </div>`).join("")}</div>`;
      }
    }).catch(() => {});
  }

  /* ---------- contributions (challenge entries + archive records) ---------- */
  function renderContrib() {
    const el = qs("#mvContrib");
    if (!el) return;
    if (!VH_API.isLoggedIn() || !DASH) {
      el.innerHTML = `<div class="empty"><div class="e-icon">🎞️</div><p>${esc(tr("mv.noContrib", "Nothing shared yet — your photos, videos and documents will appear here."))}</p>
        ${!VH_API.isLoggedIn() ? `<button class="btn btn-gold btn-sm" onclick="window.VIBHOR_AUTH&&VIBHOR_AUTH.open('login')">${esc(tr("nav.signin", "Sign in"))}</button>` : ""}</div>`;
      return;
    }
    const entries = DASH.entries || [];
    const records = DASH.archive || [];
    if (!entries.length && !records.length) {
      el.innerHTML = `<div class="empty"><div class="e-icon">🎞️</div><p>${esc(tr("mv.noContrib", "Nothing shared yet — your photos, videos and documents will appear here."))}</p>
        <a class="btn btn-gold btn-sm" href="community.html#challenges">${esc(tr("com.challenges", "Challenges"))}</a>
        <a class="btn btn-ghost btn-sm" href="archive.html#preserve">${esc(tr("arch.preserve", "Preserve a document"))}</a></div>`;
      return;
    }
    el.innerHTML = `
      <div class="contrib-grid">
        ${records.map((r) => `
          <div class="cb-card">
            <img src="${(r.pages[0] && r.pages[0].url) || (r.pageUrls && r.pageUrls[0]) || D.placeholder(r.title, "📜")}" alt="${esc(r.title)}" loading="lazy">
            <div class="cb-body">
              <b>${esc(r.title)}</b>
              <small>📜 ${esc(r.id)} · ${esc(r.state)} · ${esc(fmtDate(r.created_at))}</small>
              <a class="btn btn-ghost btn-sm" href="archive.html?record=${encodeURIComponent(r.id)}">${esc(tr("arch.view", "View record"))}</a>
            </div>
          </div>`).join("")}
        ${entries.map((e) => `
          <div class="cb-card">
            ${e.image_path
              ? `<img src="${esc(e.image_path)}" alt="${esc(e.title)}" loading="lazy">`
              : e.video_path
                ? `<video src="${esc(e.video_path)}" muted playsinline preload="metadata"></video>`
                : `<img src="${D.placeholder(e.title, "🏆")}" alt="${esc(e.title)}" loading="lazy">`}
            <div class="cb-body">
              <b>${esc(e.title)}</b>
              <small>🏆 ${esc(e.challenge_code)} · ${esc(e.state)} · ${esc(fmtDate(e.created_at))}</small>
              <a class="btn btn-ghost btn-sm" href="community.html#contributions">${esc(tr("com.contrib", "Contributions"))}</a>
            </div>
          </div>`).join("")}
      </div>`;
  }

  /* ---------- saved journeys ---------- */
  function renderJourneys() {
    const el = qs("#mvJourneys");
    if (!el) return;
    if (!VH_API.isLoggedIn() || !DASH) {
      el.innerHTML = `<div class="empty"><div class="e-icon">🧭</div><p>${esc(tr("mv.noJourneys", "No saved journeys yet."))}</p></div>`;
      return;
    }
    const js = DASH.journeys || [];
    el.innerHTML = js.length ? `
      <div class="journey-list">
        ${js.map((j) => `
        <div class="journey-row">
          <div class="jrow-main">
            <b>${esc(j.title)}</b>
            <small>${j.days} ${esc(tr("jr.days", "Days on the road"))} · ${j.stops.length} stops · ${esc(fmtDate(j.created_at))}</small>
            <div class="jrow-stops">${j.stops.slice(0, 6).map((s) => `<span>${esc(s.name)}</span>`).join("")}${j.stops.length > 6 ? `<span>+${j.stops.length - 6}</span>` : ""}</div>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-del-j="${j.id}">✕</button>
        </div>`).join("")}
      </div>`
      : `<div class="empty"><div class="e-icon">🧭</div><p>${esc(tr("mv.noJourneys", "No saved journeys yet."))}</p></div>`;
    el.querySelectorAll("[data-del-j]").forEach((b) => b.addEventListener("click", () => {
      VH_API.del("/api/user/journeys/" + b.dataset.delJ).then(() => loadDashboard()).catch(() => {});
    }));
  }

  /* ---------- data ---------- */
  async function loadDashboard() {
    if (!VH_API.isLoggedIn()) { DASH = null; paint(); return; }
    try { DASH = await VH_API.get("/api/user/dashboard"); } catch (e) { DASH = null; }
    paint();
  }
  function paint() {
    renderHead();
    renderGuestBanner();
    renderTabs();
    renderPassport();
    renderQuiz();
    renderBadges();
    renderChallenges();
    renderContrib();
    renderJourneys();
  }

  document.addEventListener("DOMContentLoaded", () => {
    paint();
    loadDashboard();
    window.addEventListener("vh:progress", paint);
    document.addEventListener("vh:auth-change", loadDashboard);
    document.addEventListener("vh:journeys", loadDashboard);
    document.addEventListener("vh:langchange", paint);
  });
})();
