/* VIBHOR — Detail page */
(function () {
  "use strict";
  const D = window.HERITAGE;
  const qs = D.qs;
  const id = D.param("id");
  const item = D.itemById(id);

  if (!item) {
    qs("#detailRoot").innerHTML = `<div class="section"><div class="container">
      <div class="empty"><div class="e-icon">🧭</div><h3>Treasure not found</h3>
      <p>The story you're looking for doesn't exist. Pick one from the explorer.</p>
      <a class="btn btn-gold" style="margin-top:1rem" href="region.html">Open the Explorer</a></div></div></div>`;
    return;
  }

  const region = D.regions[item.region];
  const cat = D.catOf(item.cat);
  const gallery = D.buildGallery(item);

  /* localized item text (content layer with English fallback) */
  function locItem() {
    try { if (window.VH_CONTENT) return window.VH_CONTENT.item(item.id) || null; } catch (e) {}
    return null;
  }
  function f(key, fallback) {
    try { if (window.VH_CONTENT) { const v = window.VH_CONTENT.feat(key); if (v) return v; } } catch (e) {}
    return fallback;
  }
  function t(key, fallback) {
    try { if (window.VIBHOR_I18N) { const v = window.VIBHOR_I18N.t(key); if (v && v !== key) return v; } } catch (e) {}
    return fallback;
  }
  function renderContent() {
    const L = locItem();
    const N = (L && L.n) || item.name;
    const DS = (L && L.d) || item.desc;
    const H = (L && L.h) || item.hist;
    const F = (L && L.f) || item.feat;
    const IM = (L && L.i) || item.imp;
    const ST = window.VH_CONTENT ? (window.VH_CONTENT.state(item.state) || item.state) : item.state;
    const CATN = window.VH_CONTENT ? (window.VH_CONTENT.cat(item.cat) || cat.name) : cat.name;
    const REGN = window.VH_CONTENT ? (window.VH_CONTENT.regionName(region.key) || region.name) : region.name;

    /* header */
    qs("#detailHero").innerHTML = `
      <img class="dh-bg" src="${item.img}" alt="${esc(N)}">
      <div class="dh-inner">
        <nav class="breadcrumb">
          <a href="index.html">${t("nav.home","Home")}</a><span class="sep">/</span>
          <a href="region.html?r=${region.key}">${esc(REGN)}</a><span class="sep">/</span>
          <a href="region.html?r=${region.key}&c=${cat.id}">${esc(CATN)}</a><span class="sep">/</span>
          <span class="current">${esc(N)}</span>
        </nav>
        <h1>${esc(N)}</h1>
        <div class="dh-meta">
          <span class="ph-chip">📍 ${esc(item.city)}, ${esc(ST)}</span>
          <span class="ph-chip">${cat.icon} ${esc(CATN)}</span>
          <span class="ph-chip">✦ ${esc(REGN)}</span>
        </div>
        <p class="ph-sub" style="margin-top:1rem;max-width:70ch">${esc(DS)}</p>
      </div>`;

    /* info boxes */
    qs("#infoGrid").innerHTML = `
      <div class="info-box">
        <div class="ib-icon">📍</div>
        <h3>${f("misc.locTitle","Location")}</h3>
        <p><b style="color:var(--cream)">${esc(item.city)}</b>, ${esc(ST)} — ${esc(REGN)}.
        ${f("misc.locLine","Reachable by road and rail, with heritage trails and local guides around the site.")}</p>
        <a class="btn btn-ghost btn-sm" style="margin-top:1rem" target="_blank" rel="noopener"
           href="https://www.google.com/maps/search/${encodeURIComponent(N + " " + item.city + " " + item.state)}">
           ${f("misc.openMaps","Open in Maps")} ↗</a>
      </div>
      <div class="info-box">
        <div class="ib-icon">🏛️</div>
        <h3>${f("misc.histTitle","History")}</h3>
        <p>${esc(H)}</p>
      </div>
      <div class="info-box">
        <div class="ib-icon">📐</div>
        <h3>${f("misc.featTitle","Key Features")}</h3>
        <ul>${F.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      </div>
      <div class="info-box">
        <div class="ib-icon">🌟</div>
        <h3>${f("misc.impTitle","Cultural Importance")}</h3>
        <p>${esc(IM)}</p>
        <p style="margin-top:.8rem">${f("misc.catLabel","Category")}: <a href="region.html?r=${region.key}&c=${cat.id}">${esc(CATN)} ${f("misc.inWord","in")} ${esc(REGN)}</a></p>
      </div>`;

    /* wiki card */
    qs("#wikiCard").innerHTML = `
      <div class="wc-left">
        <span class="wc-icon">W</span>
        <div><b>${f("misc.wikiLine","Read the full reference on Wikipedia")}</b>
        <span>${esc(item.wiki)}</span></div>
      </div>
      <a class="btn btn-gold btn-sm" target="_blank" rel="noopener" href="${esc(item.wiki)}">${f("misc.wikiOpen","Open Article")} ↗</a>`;

    /* journey: count this fact as learned + offer the passport stamp */
    const PROG = window.HERITAGE_PROGRESS;
    if (PROG) PROG.viewItem(item.id, item.cat);

    /* AI voice storytelling — narration bar with word highlight (init once) */
    const vBar = qs("#voiceGuide");
    if (window.VH_VOICE && vBar && !vBar.dataset.vhBound) {
      vBar.dataset.vhBound = "1";
      VH_VOICE.init(item);
    }

    /* interactive timeline (if this story has one curated) */
    const tl = (window.VH_TIMELINES || {})[item.id];
    if (tl && tl.length) {
      const track = qs("#tlTrack");
      track.innerHTML = tl.map((n, i) => `
        <div class="tl-node ${i % 2 ? "right" : "left"}">
          <span class="tl-dot"></span>
          <div class="tl-card">
            <span class="tl-year">${esc(n.y)}</span>
            <p>${esc(n.t)}</p>
          </div>
        </div>`).join("");
      /* animate nodes in as they scroll into view */
      const nodes = track.querySelectorAll(".tl-node");
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((ents) => ents.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add("seen"); io.unobserve(en.target); }
        }), { threshold: 0.3 });
        nodes.forEach((n) => io.observe(n));
      } else nodes.forEach((n) => n.classList.add("seen"));
    } else {
      qs("#timelineSection").style.display = "none";
    }

    /* recommendation engine — "You May Also Like" */
    const rel2 = D.items
      .filter((i) => i.id !== item.id)
      .map((i) => {
        let s = 0;
        if (i.state === item.state) s += 3;
        if (i.cat === item.cat) s += 2;
        if (i.region === item.region) s += 1;
        return { i, s };
      })
      .sort((a, b) => b.s - a.s)
      .slice(0, 4)
      .map((x) => x.i);
    const recGrid = qs("#recGrid");
    if (recGrid && rel2.length) {
      recGrid.innerHTML = rel2.map(D.itemCardHTML).join("");
    } else if (recGrid) {
      qs("#recSection").style.display = "none";
    }
    const pCta = qs("#passportCta");
    if (pCta && PROG) {
      const inPassport = PROG.isStamped(item.state);
      const pcLineIn = (f("misc.pcIn", "{n} is already in your Heritage Passport.")).replace("{n}", esc(ST));
      const pcLineLearn = (f("misc.pcLearned", "You learned about {n}!")).replace("{n}", esc(ST));
      pCta.innerHTML = inPassport
        ? `<div class="passport-cta"><span class="pc-left"><span class="pc-e">📘</span><b>${pcLineIn}</b><span class="pc-sub">${esc(f("misc.pcAll", "Collect them all and earn the India Expert badge."))}</span></span><a class="btn btn-ghost btn-sm" href="my-vibhor.html#passport">${esc(t("btn.openPassport", "View my Passport"))}</a></div>`
        : `<div class="passport-cta"><span class="pc-left"><span class="pc-e">📘</span><b>${pcLineLearn}</b><span class="pc-sub">${esc(f("misc.pcSub", "Add a stamp to your Heritage Passport — +100 heritage points."))}</span></span><button class="btn btn-gold btn-sm" id="pcAdd">${esc(t("passport.add", "Add to Passport"))} · ${esc(ST)}</button></div>`;
      /* NOTE: the old `return` here skipped the gallery/videos below for
         stamped states (D-1) — the page now always renders fully. */
      if (!inPassport) qs("#pcAdd").addEventListener("click", () => {
        PROG.stampState(item.state); /* guest → device passport · signed-in → server */
        location.href = "my-vibhor.html?celebrate=" + encodeURIComponent(item.state) + "#passport";
      });
    }

    /* gallery — 5 distinct images & captions */
    const g = qs("#galleryGrid");
    g.innerHTML = gallery.map((x) => `
      <figure data-src="${x.src}" data-cap="${esc(x.caption)}">
        <img src="${x.src}" alt="${esc(x.caption)}" loading="lazy">
        <figcaption>${esc(x.caption)}</figcaption>
      </figure>`).join("");
    D.qsa("figure", g).forEach((f) => f.addEventListener("click", () => D.openLightbox(f.dataset.src, f.dataset.cap)));

    /* related stories (same region, different item) */
    const rel = D.items.filter((i) => i.region === item.region && i.id !== item.id).slice(0, 4);
    qs("#relatedGrid").innerHTML = rel.map(D.itemCardHTML).join("");

    /* YouTube section — dynamic query = item name */
    qs("#ytTitle").textContent = (f("misc.ytLabel", 'Watch "{n}" on YouTube')).replace("{n}", N);
    D.loadVideos(N, qs("#videoGrid"), null);
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderContent();
    /* instant content re-render when the language switcher changes */
    document.addEventListener("vh:langchange", (e) => {
      try { if (window.VH_VOICE) window.VH_VOICE.stop(); } catch (err) {}
      renderContent();
      console.info(`[VIBHOR detail] content re-rendered in "${e.detail && e.detail.lang}" via VH_CONTENT`);
    });
  });

  function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
})();
