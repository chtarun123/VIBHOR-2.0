/* VIBHOR — Home page
   Hero → Smart Search (in hero) → Discover → Learn → Play →
   Preserve → Community → About/FAQ → Footer.
   Every counter you see is either a data-file constant (120
   stories, 12 categories, 36 states & UTs) or a REAL number
   from the server (/api/stats/public). Nothing is seeded. */
(function () {
  "use strict";
  const D = window.HERITAGE;
  const qs = D.qs;
  const qsa = D.qsa;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const tr = (key, fb) => D.tr ? D.tr(key, fb) : fb;

  const STATES_TOTAL = 36; // all states + UTs wired (12 of them also hold curated stories… the map shows all)

  /* ---------- hero stats ---------- */
  function renderHeroStats() {
    const stats = qs("#heroStats");
    if (!stats) return;
    stats.innerHTML = `
      <div class="stat"><b>4</b><span>${esc(tr("hs.regions", "Regions"))}</span></div>
      <div class="stat"><b>${D.categories.length}</b><span>${esc(tr("hs.cats", "Categories"))}</span></div>
      <div class="stat"><b>${D.items.length}</b><span>${esc(tr("hs.stories", "Heritage Stories"))}</span></div>
      <div class="stat"><b>${STATES_TOTAL}</b><span>${esc(tr("hs.states", "States & UTs"))}</span></div>`;
  }

  /* ---------- slim journey strip (guest OR account — honest values) ---------- */
  function renderJourney() {
    const card = qs("#journeyCard");
    if (!card || !window.HERITAGE_PROGRESS) return;
    const P = HERITAGE_PROGRESS;
    const pts = P.totalPoints();
    const stamped = P.states();
    const level = P.levelFor(stamped);
    const stories = P.factsLearned();
    const badges = P.earnedCount();
    const next = P.nextBadge();
    const authed = P.authed && P.authed();
    const acc = P.accuracy();
    card.innerHTML = `
      <div class="jd-left">
        <span class="jd-e">${level.e}</span>
        <div>
          <b>${esc(level.name)}</b>
          <small>${esc(level.line)}</small>
        </div>
      </div>
      <div class="jd-meters">
        <div class="jd-m" title="${esc(tr("jd.points", "Heritage points"))}"><b>${pts}</b><span>${esc(tr("jd.points", "Heritage points"))}</span></div>
        <div class="jd-m" title="${esc(tr("jd.states", "States stamped"))}"><b>${stamped}<small>/${STATES_TOTAL}</small></b><span>${esc(tr("jd.states", "States stamped"))}</span></div>
        <div class="jd-m" title="${esc(tr("jd.stories", "Stories explored"))}"><b>${stories}</b><span>${esc(tr("jd.stories", "Stories explored"))}</span></div>
        <div class="jd-m" title="${esc(tr("jd.badges", "Badges earned"))}"><b>${badges}<small>/${P.BADGES.length}</small></b><span>${esc(tr("jd.badges", "Badges earned"))}</span></div>
        ${acc != null ? `<div class="jd-m" title="${esc(tr("jd.acc", "Quiz accuracy"))}"><b>${acc}%</b><span>${esc(tr("jd.acc", "Quiz accuracy"))}</span></div>` : ""}
      </div>
      <div class="jd-right">
        ${authed
          ? `<a class="btn btn-gold btn-sm" href="my-vibhor.html">${esc(tr("jd.open", "Open My VIBHOR"))}</a>`
          : `<span class="jd-hint">${esc(tr("jd.guest", "🎒 Guest journey — progress stays on this device. Sign in to keep it everywhere."))}</span>
             <button class="btn btn-gold btn-sm" id="jdSignIn">${esc(tr("nav.signin", "Sign in"))}</button>`}
        ${next ? `<small class="jd-next">${esc(tr("jd.next", "Next badge"))}: ${next.e} ${esc(next.name)} (${next.cur}/${next.need})</small>` : ""}
      </div>`;
    const b = qs("#jdSignIn", card);
    if (b) b.addEventListener("click", () => window.VIBHOR_AUTH && VIBHOR_AUTH.open("login"));
  }

  /* ---------- discover: regions + categories ---------- */
  function renderRegions() {
    const el = qs("#regionsGrid");
    if (!el) return;
    el.innerHTML = Object.values(D.regions).map((r, i) => {
      const count = D.items.filter((x) => x.region === r.key).length;
      return `
      <a class="region-card reveal" href="region.html?r=${r.key}">
        <img src="${r.image}" alt="${esc(r.name)}" loading="lazy">
        <div class="rc-veil"></div>
        <span class="rc-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H8M17 7v9"/></svg></span>
        <div class="rc-body">
          <span class="rc-kicker">Region 0${i + 1}</span>
          <h3>${esc(r.name)}</h3>
          <p>${esc(r.blurb)}</p>
          <div class="rc-meta">
            <span>✦ ${r.states.length} states</span>
            <span>✦ ${count} heritage stories</span>
            <span>✦ ${D.categories.length} categories</span>
          </div>
        </div>
      </a>`;
    }).join("");
  }
  function renderCats() {
    const el = qs("#catsGrid");
    if (!el) return;
    el.innerHTML = D.categories.map((c) => {
      const count = D.items.filter((i) => i.cat === c.id).length;
      return `
      <a class="cat-card reveal" href="region.html?c=${c.id}">
        <img src="${c.image}" alt="${esc(c.name)}" loading="lazy">
        <div class="cc-veil"></div>
        <span class="cc-count">${count} stories</span>
        <div class="cc-body">
          <div class="cc-icon">${c.icon}</div>
          <h3>${esc(c.name)}</h3>
          <p>${esc(c.blurb)}</p>
        </div>
      </a>`;
    }).join("");
  }

  /* ---------- learn: a featured taste from each region ---------- */
  function renderFeatured() {
    const el = qs("#featuredGrid");
    if (!el) return;
    const picks = Object.keys(D.regions)
      .map((rk) => D.items.find((i) => i.region === rk))
      .filter(Boolean);
    el.innerHTML = picks.map((i) => D.itemCardHTML(i)).join("");
  }

  /* ---------- community band: REAL counters (zero when empty) ---------- */
  async function renderCommunity() {
    const el = qs("#communityStats");
    if (!el) return;
    let stats = { explorers: 0, contributions: 0, preserved: 0 };
    try { stats = await VH_API.get("/api/stats/public"); } catch (e) {}
    el.innerHTML = `
      <div class="stat cs"><b>${stats.explorers}</b><span>${esc(tr("cs.explorers", "Registered Explorers"))}</span></div>
      <div class="stat cs"><b>${stats.contributions}</b><span>${esc(tr("cs.contrib", "Community Contributions"))}</span></div>
      <div class="stat cs"><b>${stats.preserved}</b><span>${esc(tr("cs.preserved", "Documents Preserved"))}</span></div>`;
    const pc = qs("#preserveCount");
    if (pc) {
      pc.hidden = false;
      pc.textContent = stats.preserved
        ? tr("pv.countsome", "✦ {n} document(s) already preserved by the community.").replace("{n}", stats.preserved)
        : tr("pv.countnone", "✦ The archive is brand new — the first preserved document could be yours.");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderHeroStats();
    renderJourney();
    renderRegions();
    renderCats();
    renderFeatured();
    renderCommunity();
    window.addEventListener("vh:progress", renderJourney);
    document.addEventListener("vh:auth-change", () => { renderJourney(); renderCommunity(); });
  });
})();
