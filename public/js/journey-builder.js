/* ============================================================
   VIBHOR — Journey Builder
   Pick up to 8 interests + trip length → a visual route
   START → … → END built ONLY from real VIBHOR records (the
   120 curated stories, each a real place/tradition).
   Saving needs a sign-in (POST /api/user/journeys) — events,
   never points. Guests can generate freely.
   Used inside My VIBHOR; the AI Guide also links here.
   ============================================================ */
(function () {
  "use strict";
  const D = window.HERITAGE;
  const qs = (s, el = document) => el.querySelector(s);
  const esc = D.esc || ((s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])));
  const tr = (key, fb) => D.tr ? D.tr(key, fb) : fb;
  const MAX_INTERESTS = 8;

  /* the 8 interest tracks the planner offers */
  const INTERESTS = [
    { id: "temples",    e: "🛕", label: "Sacred Temples" },
    { id: "forts",      e: "🏰", label: "Forts & Palaces" },
    { id: "festivals",  e: "🪔", label: "Festivals" },
    { id: "foods",      e: "🍛", label: "Food Trails" },
    { id: "dances",     e: "💃", label: "Dance & Theatre" },
    { id: "music",      e: "🎶", label: "Music" },
    { id: "crafts",     e: "🧶", label: "Crafts & Textiles" },
    { id: "monuments",  e: "🏛️", label: "Monuments" }
  ];
  /* a stop order that reads like a journey: sweep the country
     north → east → south → west so the route flows geographically */
  const REGION_ORDER = { north: 0, east: 1, south: 2, west: 3 };

  const S = { picked: new Set(), days: 5, route: null };
  let root = null;

  function shuffle(a) {
    const r = a.slice();
    for (let i = r.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [r[i], r[j]] = [r[j], r[i]];
    }
    return r;
  }

  function interestName(i) {
    /* localise the chip labels from the category dictionary when present */
    const D2 = D;
    try { if (window.VH_CONTENT && VH_CONTENT.cat) { const n = VH_CONTENT.cat(i.id); if (n) return n; } } catch (e) {}
    return i.label;
  }

  function buildRoute() {
    const picks = [...S.picked];
    if (!picks.length) return null;
    /* candidate items: any whose category matches a picked interest;
       crafts↔textiles and monuments↔historical/forsts overlap sensibly */
    const alias = { monuments: ["monuments", "historical", "forts"], forts: ["forts", "historical", "monuments"], crafts: ["crafts", "textiles"], dances: ["dances", "music"], music: ["music", "dances"] };
    const wanted = new Set(picks.flatMap((p) => alias[p] || [p]));
    let pool = D.items.filter((i) => wanted.has(i.cat));
    if (pool.length < S.days) pool = D.items.slice();
    /* spread across states & regions so the route isn't ten stops in one city */
    const byState = {};
    pool.forEach((i) => { (byState[i.state] = byState[i.state] || []).push(i); });
    const states = shuffle(Object.keys(byState)).sort((a, b) => {
      const ra = REGION_ORDER[(byState[a][0] || {}).region] != null ? REGION_ORDER[byState[a][0].region] : 4;
      const rb = REGION_ORDER[(byState[b][0] || {}).region] != null ? REGION_ORDER[byState[b][0].region] : 4;
      return ra - rb;
    });
    const stops = [];
    const target = Math.min(S.days * 2, Math.max(S.days, 6));
    for (const st of states) {
      if (stops.length >= target) break;
      /* up to two stops per state, prefer interest matches */
      const best = byState[st].slice().sort((a, b) => (wanted.has(a.cat) ? 0 : 1) - (wanted.has(b.cat) ? 0 : 1));
      stops.push(best[0]);
      if (stops.length < target && best[1] && Math.random() < 0.45) stops.push(best[1]);
    }
    return stops;
  }

  function render() {
    root.innerHTML = `
      <div class="jr">
        <div class="jr-setup">
          <h3>${esc(tr("jr.title", "Build your heritage journey"))}</h3>
          <p class="jr-hint">${esc(tr("jr.interests", "Pick up to {n} interests").replace("{n}", MAX_INTERESTS))}</p>
          <div class="jr-chips">
            ${INTERESTS.map((i) => `
              <button type="button" class="jr-chip ${S.picked.has(i.id) ? "on" : ""}" data-i="${i.id}" aria-pressed="${S.picked.has(i.id)}">
                <span aria-hidden="true">${i.e}</span> ${esc(interestName(i))}
              </button>`).join("")}
          </div>
          <div class="jr-days-row">
            <label for="jrDays"><b>${esc(tr("jr.days", "Days on the road"))}</b></label>
            <input type="range" id="jrDays" min="3" max="14" step="1" value="${S.days}" aria-label="${esc(tr("jr.days", "Days on the road"))}">
            <output id="jrDaysOut">${S.days}</output>
          </div>
          <button type="button" class="btn btn-gold" id="jrBuild">🧭 ${esc(tr("jr.generate", "Generate my route"))}</button>
          <div class="jr-err" id="jrErr" hidden></div>
        </div>
        <div class="jr-out" id="jrOut"></div>
      </div>`;

    root.querySelectorAll(".jr-chip").forEach((c) => c.addEventListener("click", () => {
      const id = c.dataset.i;
      if (S.picked.has(id)) S.picked.delete(id);
      else if (S.picked.size < MAX_INTERESTS) S.picked.add(id);
      S.route = null;
      render();
    }));
    const range = qs("#jrDays", root);
    range.addEventListener("input", () => { S.days = parseInt(range.value, 10) || 5; qs("#jrDaysOut", root).textContent = S.days; S.route = null; render(); });
    qs("#jrBuild", root).addEventListener("click", () => {
      const err = qs("#jrErr", root);
      if (!S.picked.size) {
        err.hidden = false;
        err.textContent = tr("jr.empty", "Pick at least one interest to build a route.");
        return;
      }
      err.hidden = true;
      S.route = buildRoute();
      render();
      const out = qs("#jrOut", root);
      if (out && out.scrollIntoView) out.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    if (S.route) renderRoute();
  }

  function stopDay(idx) { return Math.floor(idx / 2) + 1; }

  function renderRoute() {
    const out = qs("#jrOut", root);
    if (!out || !S.route) return;
    const stops = S.route;
    const interests = [...S.picked];
    out.innerHTML = `
      <div class="jr-route">
        <div class="jr-route-head">
          <h3>${esc(tr("jr.route", "Your route"))}</h3>
          <p>${esc(tr("jr.routeHint", "Real places from the VIBHOR library — built for your interests."))}</p>
        </div>
        <div class="jr-path">
          <span class="jr-pin start">${esc(tr("jr.start", "START"))}</span>
          <div class="jr-line"></div>
          ${stops.map((it, i) => `
            <div class="jr-stop">
              <span class="jr-num">${i + 1}</span>
              <div class="jr-stop-body">
                <b>${esc(it.name)}</b>
                <small>${esc(tr("jr.day", "Day"))} ${stopDay(i)} · ${esc(it.city || it.state)} · ${(D.catOf(it.cat).icon || "✦")} ${esc(D.catOf(it.cat).name || it.cat)}</small>
                <a class="jr-open" href="detail.html?id=${it.id}">${esc(tr("jr.openStory", "Read the story"))} →</a>
              </div>
            </div>
            ${i + 1 < stops.length ? '<span class="jr-conn" aria-hidden="true"></span>' : ""}
          `).join("")}
          <div class="jr-line"></div>
          <span class="jr-pin end">${esc(tr("jr.end", "END"))}</span>
        </div>
        <div class="jr-actions">
          <button type="button" class="btn btn-gold" id="jrSave">💾 ${esc(tr("jr.save", "Save this journey"))}</button>
          <span class="jr-save-msg" id="jrMsg"></span>
        </div>
      </div>`;
    qs("#jrSave", out).addEventListener("click", () => {
      const title = (interests.map((p) => interestName(INTERESTS.find((x) => x.id === p))).join(" · ")).slice(0, 60) || "My Heritage Journey";
      const payload = {
        title,
        days: S.days,
        interests,
        stops: stops.map((it) => ({ id: it.id, name: it.name, state: it.state, city: it.city || "", cat: it.cat }))
      };
      if (window.VIBHOR_AUTH && !VIBHOR_AUTH.requireAuth(() => { /* re-click after login */ qs("#jrSave", root) && qs("#jrSave", root).click(); }, tr("jr.loginSave", "Sign in to save journeys"))) return;
      qs("#jrSave", out).disabled = true;
      VH_API.post("/api/user/journeys", payload)
        .then(() => {
          const m = qs("#jrMsg", out);
          if (m) m.textContent = tr("jr.saved", "Journey saved to My VIBHOR ✦");
          out.classList.add("jr-saved");
          document.dispatchEvent(new CustomEvent("vh:journeys"));
        })
        .catch((e) => {
          qs("#jrSave", out).disabled = false;
          const m = qs("#jrMsg", out);
          if (m) m.textContent = e.message || "Could not save right now.";
        });
    });
  }

  function init(el) {
    root = el;
    render();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const el = qs("#journeyBuilder");
    if (el) init(el);
  });
  document.addEventListener("vh:langchange", () => { if (root) render(); });

  window.VIBHOR_JOURNEY = { build: () => { const el = qs("#journeyBuilder"); if (el) { el.scrollIntoView({ behavior: "smooth" }); } } };
})();
