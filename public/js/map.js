/* VIBHOR — Interactive Heritage Map
   Renders India state GeoJSON as clickable SVG; clicking a state
   filters its region and lists that state's heritage items. */
(function () {
  "use strict";
  const D = window.HERITAGE;
  const qs = D.qs;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const GEO = window.INDIA_GEO;
  let selectedState = "";

  /* ---------- projection: equirectangular, scaled to 1000 x 1180 viewBox ---------- */
  const W = 1000, H = 1150, PAD = 30;
  let minLon = 60, maxLon = 100, minLat = 6, maxLat = 38;
  const scale = Math.min((W - 2 * PAD) / (maxLon - minLon), (H - 2 * PAD) / (maxLat - minLat));
  const ox = (W - scale * (maxLon - minLon)) / 2;
  const oy = (H - scale * (maxLat - minLat)) / 2;
  const px = (lon) => ox + (lon - minLon) * scale;
  const py = (lat) => oy + (maxLat - lat) * scale;

  function ringPath(ring) {
    return ring.map((p, i) => (i ? "L" : "M") + px(p[0]).toFixed(1) + " " + py(p[1]).toFixed(1)).join("") + "Z";
  }
  function geomPath(g) {
    const polys = g.type === "MultiPolygon" ? g.coordinates : [g.coordinates];
    let d = "";
    for (const poly of polys) for (const ring of poly) d += ringPath(ring);
    return d;
  }

  document.addEventListener("DOMContentLoaded", () => {
    /* build svg */
    let paths = "";
    for (const f of GEO.features) {
      const name = f.properties.name;
      const r = D.stateRegion[name] || "";
      paths += `<path class="state-path ${r ? "r-" + r : ""}" data-state="${esc(name)}" d="${geomPath(f.geometry)}"></path>`;
    }
    qs("#mapSvg").innerHTML = paths;

    const tooltip = qs("#mapTooltip");
    const svgWrap = qs("#mapPanel");
    let hovered = null;

    D.qsa(".state-path").forEach((p) => {
      p.addEventListener("mouseenter", () => {
        hovered = p.dataset.state;
        tooltip.style.opacity = 1;
        tooltip.innerHTML = `<b>${esc(hovered)}</b>${D.stateRegion[hovered] ? " · " + esc(D.regions[D.stateRegion[hovered]].name) : ""}`;
      });
      p.addEventListener("mousemove", (e) => {
        const rect = svgWrap.getBoundingClientRect();
        tooltip.style.left = (e.clientX - rect.left) + "px";
        tooltip.style.top = (e.clientY - rect.top) + "px";
      });
      p.addEventListener("mouseleave", () => { tooltip.style.opacity = 0; hovered = null; });
      p.addEventListener("click", () => selectState(p.dataset.state));
    });

    /* legend */
    const legend = qs("#legend");
    const counts = {};
    D.items.forEach((i) => { counts[i.region] = (counts[i.region] || 0) + 1; });
    legend.innerHTML = `<h3>Four Regions</h3>` + Object.values(D.regions).map((r) => `
      <div class="legend-item" data-region="${r.key}">
        <span class="legend-dot" style="background:${{ north: "#8a4a2a", south: "#6a7a2a", east: "#2a6a5e", west: "#6a4a8a" }[r.key]}"></span>
        ${esc(r.name)}<b>${counts[r.key] || 0}</b>
      </div>`).join("") +
      `<p style="font-size:.72rem;color:var(--muted2);margin-top:1rem">Tap any state to filter the map by its region and see its curated heritage items.</p>`;

    D.qsa(".legend-item").forEach((li) => li.addEventListener("click", () => {
      const key = li.dataset.region;
      const active = li.classList.contains("active");
      D.qsa(".legend-item").forEach((o) => o.classList.remove("active"));
      clearSelection();
      if (active) { highlightAll(); return; }
      li.classList.add("active");
      D.qsa(".state-path").forEach((p) => {
        const r = D.stateRegion[p.dataset.state];
        p.classList.toggle("dimmed", r !== key);
      });
      renderStateCard({ region: key, isRegion: true });
    }));

    renderStateCard({ region: "", isRegion: true });
  });

  function clearSelection() {
    D.qsa(".state-path").forEach((p) => p.classList.remove("selected"));
    selectedState = "";
  }
  function highlightAll() {
    D.qsa(".state-path").forEach((p) => p.classList.remove("dimmed"));
  }

  function selectState(name) {
    clearSelection();
    D.qsa(".legend-item").forEach((o) => o.classList.remove("active"));
    const path = D.qsa(".state-path").find((p) => p.dataset.state === name);
    if (path) path.classList.add("selected");
    const regionKey = D.stateRegion[name];
    if (regionKey) {
      D.qsa(".state-path").forEach((p) => {
        if (p !== path) p.classList.toggle("dimmed", D.stateRegion[p.dataset.state] !== regionKey);
      });
      const li = D.qsa(".legend-item").find((o) => o.dataset.region === regionKey);
      if (li) li.classList.add("active");
    }
    selectedState = name;
    renderStateCard({ state: name, region: regionKey });
  }

  function renderStateCard({ state, region, isRegion }) {
    const card = qs("#stateCard");
    let html = "";
    if (state) {
      const rKey = D.stateRegion[state];
      const r = rKey ? D.regions[rKey] : null;
      const items = D.items.filter((i) => i.state === state);
      html = `
        <span class="sc-kicker">Selected State</span>
        <h3><a class="sc-state-link" href="region.html?r=${rKey ? rKey : ""}&state=${encodeURIComponent(state)}" title="Open ${esc(state)} in the Explorer">${esc(state)}</a></h3>
        <p class="sc-region">${r ? `Part of <b>${esc(r.name)}</b> — ${esc(r.tagline)}` : "Explore this state through the regional collections."}</p>
        ${items.length ? `
          <p style="font-size:.78rem;color:var(--muted);letter-spacing:.1em;text-transform:uppercase">${items.length} curated ${items.length === 1 ? "story" : "stories"} in ${esc(state)}</p>
          <div class="mini-items">
            ${items.slice(0, 5).map((i) => `
              <a class="mini-item" href="detail.html?id=${i.id}">
                <img src="${i.img}" alt="${esc(i.name)}">
                <span style="flex:1"><b>${esc(i.name)}</b><span>${esc(D.catOf(i.cat).name)} · ${esc(i.city)}</span></span>
                <span style="color:var(--gold)">→</span>
              </a>`).join("")}
          </div>
          <a class="btn btn-gold btn-sm" href="region.html${r ? "?r=" + r.key : ""}${items.length && items[0].state ? "&state=" + encodeURIComponent(state) : ""}">Explore ${esc(state)} in the Explorer</a>`
        : `
          <p style="font-size:.85rem;color:var(--muted);margin:1rem 0 1.2rem">No curated items for ${esc(state)} yet — but the wider region is rich in stories.</p>
          ${r ? `<a class="btn btn-gold btn-sm" href="region.html?r=${r.key}&state=${encodeURIComponent(state)}">See ${esc(state)} in the Explorer</a>` : ""}`}`;
    } else if (isRegion && region && D.regions[region]) {
      const r = D.regions[region];
      const items = D.items.filter((i) => i.region === region);
      const statesWithItems = r.states.filter((s) => D.items.some((i) => i.state === s));
      html = `
        <span class="sc-kicker">Region Selected</span>
        <h3>${esc(r.name)}</h3>
        <p class="sc-region">${esc(r.tagline)}</p>
        <p style="font-size:.78rem;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;margin-bottom:.6rem">${items.length} curated stories · ${statesWithItems.length} states</p>
        <div class="mini-items">
          ${statesWithItems.slice(0, 5).map((s) => {
            const first = D.items.find((i) => i.state === s);
            const n = D.items.filter((i) => i.state === s).length;
            return `<a class="mini-item" href="region.html?r=${region}&state=${encodeURIComponent(s)}">
              <img src="${first.img}" alt="${esc(s)}">
              <span style="flex:1"><b>${esc(s)}</b><span>${n} ${n === 1 ? "story" : "stories"} · ${esc(first.city)}</span></span>
              <span style="color:var(--gold)">→</span>
            </a>`;
          }).join("")}
        </div>
        <a class="btn btn-gold btn-sm" style="margin-top:.8rem" href="region.html?r=${region}">Explore ${esc(r.name)} in the Explorer</a>`;
    } else {
      html = `
        <span class="sc-kicker">Welcome</span>
        <h3>Click a State</h3>
        <p class="sc-region">This map follows <b>four cultural regions</b> of India. Select any state to light up its region, or pick a region from the legend to see all its states glow.</p>
        <div class="mini-items" style="margin-top:1.2rem">
          ${Object.values(D.regions).map((r) => `
            <a class="mini-item" href="region.html?r=${r.key}">
              <img src="${r.image}" alt="${esc(r.name)}">
              <span style="flex:1"><b>${esc(r.name)}</b><span>${D.items.filter((i) => i.region === r.key).length} stories · ${r.states.length} states</span></span>
              <span style="color:var(--gold)">→</span>
            </a>`).join("")}
        </div>`;
    }
    card.innerHTML = html;
  }
})();
