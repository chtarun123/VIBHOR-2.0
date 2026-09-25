/* VIBHOR — Region page (drill-down: region → category → state → items) */
(function () {
  "use strict";
  const D = window.HERITAGE;
  const qs = D.qs;

  let state = { region: D.param("r") || "", cat: D.param("c") || "", stateName: D.param("state") || "" };
  if (state.region && !D.regions[state.region]) state.region = "";
  if (state.cat && !D.catOf(state.cat)) state.cat = "";

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderDrilldown();
    renderStateBanner();
    renderResults();
  });

  /* journey CTA: when a state is in focus, offer passport + quiz */
  function renderStateBanner() {
    if (!state.stateName) return;
    const dd = qs("#drilldown");
    if (!dd) return;
    const PROG = window.HERITAGE_PROGRESS;
    const inPassport = PROG ? PROG.isStamped(state.stateName) : false;
    const n = D.itemsOf({ state: state.stateName }).length;
    const banner = document.createElement("div");
    banner.className = "state-banner";
    banner.innerHTML = `
      <div class="sb-left">
        <b>📍 ${esc(state.stateName)}</b>
        <span>${n} curated ${n === 1 ? "story" : "stories"} in this state</span>
      </div>
      <div class="sb-actions">
        ${inPassport
          ? `<a class="btn btn-ghost btn-sm sb-stamped" href="my-vibhor.html#passport">✓ Stamped in your passport 📘</a>`
          : `<button class="btn btn-gold btn-sm" id="sbAdd">📘 Add ${esc(state.stateName)} to Passport</button>`}
        <a class="btn btn-ghost btn-sm" href="quiz.html">🎲 Take the Heritage Quiz</a>
      </div>`;
    dd.insertBefore(banner, dd.firstChild);
    const addBtn = qs("#sbAdd", banner);
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        if (!PROG) return;
        PROG.stampState(state.stateName);
        location.href = "my-vibhor.html?celebrate=" + encodeURIComponent(state.stateName) + "#passport";
      });
    }
  }

  function currentStates() {
    if (state.region) return D.regions[state.region].states;
    const pool = state.cat ? D.items.filter((i) => i.cat === state.cat) : D.items;
    const s = new Set(pool.map((i) => i.state));
    return Array.from(s).sort();
  }

  function renderHeader() {
    const head = qs("#pageHeader");
    let bg = "images/hero.jpg", name = "Explore India", sub = D.tagline, chips = "";
    if (state.region) {
      const r = D.regions[state.region];
      bg = r.image; name = r.name; sub = r.tagline + ". " + r.blurb;
      chips = `<span class="ph-chip">📍 ${r.states.length} states</span><span class="ph-chip">✦ ${D.items.filter(i=>i.region===r.key).length} stories</span><span class="ph-chip">12 categories</span>`;
    } else if (state.cat) {
      const c = D.catOf(state.cat);
      bg = c.image; name = c.name; sub = c.blurb + " — across all four regions of India.";
      chips = `<span class="ph-chip">📍 ${new Set(D.items.filter(i=>i.cat===state.cat).map(i=>i.state)).size} states</span><span class="ph-chip">✦ ${D.items.filter(i=>i.cat===state.cat).length} stories</span>`;
    } else {
      name = "One India. Four Regions.";
      sub = "Choose a region, a category or a state — and let the journey unfold. Every card leads to a full story.";
    }
    head.innerHTML = `
      <div class="ph-bg" style="background-image:url('${bg}')"></div>
      <div class="container ph-inner">
        <nav class="breadcrumb">
          <a href="index.html">Home</a><span class="sep">/</span>
          ${state.region ? `<span class="current">${esc(D.regions[state.region].name)}</span>` : state.cat ? `<span class="current">${esc(D.catOf(state.cat).name)}</span>` : `<span class="current">Explore</span>`}
          ${state.cat && state.region ? `<span class="sep">/</span><span class="current">${esc(D.catOf(state.cat).name)}</span>` : ""}
          ${state.stateName ? `<span class="sep">/</span><span class="current">${esc(state.stateName)}</span>` : ""}
        </nav>
        <h1>${esc(name)}</h1>
        <p class="ph-sub">${esc(sub)}</p>
        <div class="ph-chips">${chips}</div>
      </div>`;
  }

  /* build a shareable link for a filter combination — every chip is a real link */
  function chipHref(kind, val) {
    const p = new URLSearchParams();
    const region = kind === "region" ? (val === "all" ? "" : val) : state.region;
    const cat = kind === "cat" ? (val === "all" ? "" : val) : state.cat;
    const st = kind === "state" ? val : "";
    if (region) p.set("r", region);
    if (cat) p.set("c", cat);
    if (st) p.set("state", st);
    const q = p.toString();
    return "region.html" + (q ? "?" + q : "");
  }

  function renderDrilldown() {
    const dd = qs("#drilldown");
    const regionChips = `<a class="chip ${!state.region ? "active" : ""}" href="${chipHref("region", "all")}">All Regions</a>` +
      Object.values(D.regions).map((r) => `<a class="chip ${state.region === r.key ? "active" : ""}" href="${chipHref("region", r.key)}">${esc(r.name)}</a>`).join("");
    const catChips = `<a class="chip ${!state.cat ? "active" : ""}" href="${chipHref("cat", "all")}">All Categories</a>` +
      D.categories.map((c) => `<a class="chip ${state.cat === c.id ? "active" : ""}" href="${chipHref("cat", c.id)}">${c.icon} ${esc(c.name)}</a>`).join("");
    const states = currentStates();
    dd.innerHTML = `
      <div class="drill-row"><span class="drill-label">Region</span><div class="chip-row">${regionChips}</div></div>
      <div class="drill-row"><span class="drill-label">Category</span><div class="chip-row">${catChips}</div></div>
      <div class="drill-row">
        <span class="drill-label">State</span>
        <div class="select-wrap">
          <select class="select" id="stateSelect" aria-label="Select state">
            <option value="">All States</option>
            ${states.map((s) => `<option value="${esc(s)}" ${state.stateName === s ? "selected" : ""}>${esc(s)}</option>`).join("")}
          </select>
        </div>
        <span style="font-size:.75rem;color:var(--muted2)">— drill down to the state level</span>
      </div>`;
    qs("#stateSelect", dd).addEventListener("change", (e) => {
      state.stateName = e.target.value;
      location.href = chipHref("state", state.stateName);
    });
  }

  function renderResults() {
    const items = D.itemsOf({ region: state.region, cat: state.cat, state: state.stateName });
    const grid = qs("#itemGrid");
    const meta = qs("#resultsMeta");
    const parts = [];
    if (state.region) parts.push(D.regions[state.region].name);
    if (state.cat) parts.push(D.catOf(state.cat).name);
    if (state.stateName) parts.push(state.stateName);
    const label = parts.length ? parts.join(" · ") : "All of India";
    meta.innerHTML = `<h3>${esc(label)}</h3><span class="results-count"><b>${items.length}</b> heritage ${items.length === 1 ? "story" : "stories"}</span>`;
    if (!items.length) {
      grid.innerHTML = `<div class="empty" style="grid-column:1/-1"><div class="e-icon">🪷</div>
        <h3>No curated stories here yet</h3>
        <p>Try a different combination — or pick any other state from the dropdown above.</p></div>`;
      return;
    }
    grid.innerHTML = items.map(D.itemCardHTML).join("");
    // re-run reveal for new cards
    const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); } }), { threshold: 0.08 });
    D.qsa("#itemGrid .reveal").forEach((el) => io.observe(el));
  }
})();
