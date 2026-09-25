/* ============================================================
   VIBHOR — Shared engine
   Nav · Footer · Auth chip · Newsletter · Image placeholders ·
   Gallery · YouTube lookup · Modals
   ============================================================ */
(function () {
  "use strict";

  const D = window.HERITAGE;
  const YT_API = "https://ytapis.djalokyt27.workers.dev/?q=";

  /* ---------- tiny helpers ---------- */
  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  D.param = (k) => new URLSearchParams(location.search).get(k);
  D.qs = qs;
  D.qsa = qsa;
  D.esc = esc;

  D.regionName = (key) => (D.regions[key] ? D.regions[key].name : "India");
  D.catOf = (id) => D.categories.find((c) => c.id === id) || {};
  D.itemById = (id) => D.items.find((i) => i.id === id);
  D.itemsOf = (filter = {}) =>
    D.items.filter((i) =>
      (!filter.region || i.region === filter.region) &&
      (!filter.cat || i.cat === filter.cat) &&
      (!filter.state || i.state === filter.state)
    );
  D.tr = (key, fb) => {
    try { if (window.VIBHOR_I18N) { const v = VIBHOR_I18N.t(key); if (v && v !== key) return v; } } catch (e) {}
    return fb;
  };
  window.VH_TR = window.VH_TR || ((key) => {
    try { if (window.VIBHOR_I18N) { const v = VIBHOR_I18N.t(key); if (v && v !== key) return v; } } catch (e) {}
    return key;
  });

  /* ============================================================
     IMAGE PLACEHOLDERS — the prototype ships ONE real photograph
     (public/images/hero.jpg). Every other heritage visual is a
     themed, deterministic SVG artwork generated here: a maroon/
     gold gradient tile with the category motif and the place
     name — no external hotlinks, no broken images, fully
     offline. Real photographs can later be dropped into
     public/images/ and referenced from the data files with zero
     code changes.
     ============================================================ */
  function hashStr(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) >>> 0; }
    return h;
  }
  const CAT_EMOJI = {
    temples: "🛕", monuments: "🏛️", forts: "🏰", historical: "🕌", festivals: "🪔",
    foods: "🍛", dances: "💃", music: "🎶", crafts: "🧶", textiles: "🧣",
    gardens: "🌸", architecture: "🗿", state: "🗺️", default: "✦"
  };
  function svgPh(label, emoji, seed) {
    const h = seed != null ? seed : hashStr(label);
    const h2 = (h * 2654435761) >>> 0;
    const gold = "#D4AF37";
    const palettes = [
      ["#3d0d0c", "#1c0505"], ["#401318", "#1c0607"], ["#360f2c", "#18040f"],
      ["#26251b", "#100e05"], ["#33131b", "#150408"], ["#2c1a0a", "#120804"]
    ];
    const [c1, c2] = palettes[h % palettes.length];
    const arc = 60 + (h2 % 160);
    const rx = 90 + (h % 120);
    const text = label.length > 26 ? label.slice(0, 25) + "…" : label;
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>` +
      `<radialGradient id="r" cx="0.5" cy="0.42" r="0.9">` +
      `<stop offset="0" stop-color="${gold}" stop-opacity="0.20"/><stop offset="0.55" stop-color="${gold}" stop-opacity="0"/></radialGradient></defs>` +
      `<rect width="800" height="600" fill="url(#g)"/><rect width="800" height="600" fill="url(#r)"/>` +
      `<g stroke="${gold}" stroke-opacity="0.32" fill="none" stroke-width="2.4">` +
      `<circle cx="400" cy="275" r="${arc}"/>` +
      `<circle cx="400" cy="275" r="${arc + 18}" stroke-dasharray="4 10"/>` +
      `<path d="M400 ${275 - arc - 44} v24 M400 ${275 + arc + 20} v24 M${400 - arc - 44} 275 h24 M${400 + arc + 20} 275 h24"/>` +
      `</g>` +
      `<text x="400" y="292" font-size="${rx > 150 ? 96 : 110}" text-anchor="middle" dominant-baseline="middle">${emoji}</text>` +
      `<rect x="30" y="30" width="740" height="540" fill="none" stroke="${gold}" stroke-opacity="0.5" stroke-width="3"/>` +
      `<rect x="40" y="40" width="720" height="520" fill="none" stroke="${gold}" stroke-opacity="0.22" stroke-width="1.4"/>` +
      `<rect x="0" y="508" width="800" height="92" fill="#120404" fill-opacity="0.72"/>` +
      `<text x="400" y="556" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="31" fill="#F2DFA8" letter-spacing="0.5">${text.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text>` +
      `</svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }
  D.placeholder = svgPh;

  function ensureAssets() {
    /* records: themed by category */
    D.items.forEach((i) => {
      /* real photos win — only blank references get a themed tile */
      if (i.img) return;
      const emoji = CAT_EMOJI[i.cat] || CAT_EMOJI.default;
      i.img = svgPh(i.name, emoji, hashStr(i.id + i.cat));
    });
    /* pools feed detail-page galleries */
    Object.keys(D.pools || {}).forEach((cat) => {
      const emoji = CAT_EMOJI[cat] || CAT_EMOJI.default;
      D.pools[cat] = (D.pools[cat] || []).map((u, k) =>
        u ? u : svgPh((D.catOf(cat).name || cat) + " · " + (k + 1), emoji, hashStr(cat + ":" + k)));
    });
    /* regions keep their own accent colour */
    Object.values(D.regions || {}).forEach((r) => {
      const e = { north: "🏔️", south: "🛕", east: "🌄", west: "🏖️" }[r.key] || "🗺️";
      if (!r.image) r.image = svgPh(r.name, e, hashStr("region:" + r.key));
    });
    /* categories */
    (D.categories || []).forEach((c) => {
      if (!c.image) c.image = svgPh(c.name, CAT_EMOJI[c.id] || c.icon || "✦", hashStr("cat:" + c.id));
    });
  }
  try { ensureAssets(); } catch (e) { console.warn("[VIBHOR] placeholder images:", e); }

  /* ---------- shared chrome: navbar ----------
     Home · Explore · Map · Quiz · Community · My VIBHOR · Language · Search
     + account chip (Sign in / your name)                                   */
  const NAV = [
    ["index.html", "Home", "home", "nav.home"],
    ["region.html", "Explore", "region", "nav.explore"],
    ["map.html", "Map", "map", "nav.map"],
    ["quiz.html", "Quiz", "quiz", "nav.quiz"],
    ["community.html", "Community", "community", "nav.community"],
    ["my-vibhor.html", "My VIBHOR", "myvibhor", "nav.myvibhor"]
  ];
  function renderNav() {
    const root = qs("#nav-root") || qs("#siteNav");
    if (!root) return;
    const page = root.dataset.page || document.body.dataset.page || "";
    const links = NAV.map(([href, label, key, trk]) =>
      `<li><a href="${href}" class="${key === page ? "active" : ""}" data-i18n="${trk}">${label}</a></li>`).join("");
    root.innerHTML = `
      <nav class="navbar">
        <div class="container nav-inner">
          <a class="brand" href="index.html" aria-label="VIBHOR home">
            <span class="brand-mark">V</span>
            <span class="brand-text"><b>VIBHOR</b><span>Indian Heritage</span></span>
          </a>
          <button class="nav-toggle" id="navToggle" aria-label="Menu"><span></span><span></span><span></span></button>
          <ul class="nav-links" id="navLinks">
            ${links}
            <li class="nav-search-slot" id="navSearchSlot"></li>
            <li class="nav-lang"><select id="vhLangSelect" aria-label="Language" title="Language"></select></li>
            <li class="nav-account" id="navAccount"></li>
          </ul>
        </div>
      </nav>`;
    /* language switcher (multilingual.js owns state) */
    const langSel = qs("#vhLangSelect", root);
    if (langSel && window.VIBHOR_I18N) {
      langSel.innerHTML = VIBHOR_I18N.LANGS.map((l) =>
        `<option value="${l.code}" ${l.code === VIBHOR_I18N.getLang() ? "selected" : ""}>${l.native}</option>`).join("");
      langSel.addEventListener("change", () => VIBHOR_I18N.setLang(langSel.value));
    }
    const tog = qs("#navToggle", root), linksEl = qs("#navLinks", root);
    tog.addEventListener("click", () => { tog.classList.toggle("open"); linksEl.classList.toggle("open"); });
    qsa("a", linksEl).forEach((a) => a.addEventListener("click", () => { tog.classList.remove("open"); linksEl.classList.remove("open"); }));
    renderAccountChip();
  }

  function initials(name) {
    return (name || "V").trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  }
  function renderAccountChip() {
    const slot = qs("#navAccount");
    if (!slot) return;
    const me = window.VH_API ? VH_API.me() : null;
    if (me && me.authenticated && me.user) {
      const pts = (me.stats && me.stats.points) || 0;
      slot.innerHTML = `
        <a class="nav-user" href="my-vibhor.html" title="Open My VIBHOR">
          <span class="nav-user-ava">${esc(initials(me.user.name))}</span>
          <span class="nav-user-txt"><b>${esc(me.user.name)}</b><small>${pts} pts</small></span>
        </a>`;
    } else {
      slot.innerHTML = `<button type="button" class="btn btn-gold btn-sm" id="navSignIn" data-i18n="nav.signin">Sign in</button>`;
      qs("#navSignIn", slot).addEventListener("click", () => window.VIBHOR_AUTH && VIBHOR_AUTH.open("login"));
    }
    if (window.VIBHOR_I18N) VIBHOR_I18N.apply(slot);
  }
  document.addEventListener("vh:auth-change", renderAccountChip);

  /* ---------- shared chrome: footer ---------- */
  function renderFooter() {
    const el = qs("#footer-root");
    if (!el) return;
    el.innerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              <a class="brand" href="index.html">
                <span class="brand-mark">V</span>
                <span class="brand-text"><b>VIBHOR</b><span>Indian Heritage</span></span>
              </a>
              <p style="margin-top:1rem">${esc(D.tagline || "")} A curated journey through the living culture of India — its temples, dances, foods, crafts and festivals — told region by region, preserved by its community.</p>
            </div>
            <div>
              <h4>Explore</h4>
              <ul>
                ${Object.values(D.regions).map((r) => `<li><a href="region.html?r=${r.key}">${esc(r.name)}</a></li>`).join("")}
                <li><a href="map.html">Interactive Map</a></li>
                <li><a href="quiz.html">Heritage Quiz 🎲</a></li>
                <li><a href="my-vibhor.html">My VIBHOR 📘</a></li>
                <li><a href="index.html#about">About VIBHOR</a></li>
              </ul>
            </div>
            <div>
              <h4>Community</h4>
              <ul>
                <li><a href="community.html#challenges">Challenges 🏆</a></li>
                <li><a href="community.html#leaderboard">Leaderboard 🥇</a></li>
                <li><a href="community.html#contributions">Contributions 🎞️</a></li>
                <li><a href="archive.html">Heritage Archive 📜</a></li>
                <li><a href="archive.html#preserve">Preserve a Document 📷</a></li>
              </ul>
            </div>
            <div>
              <h4>Categories</h4>
              <ul>
                ${D.categories.slice(0, 8).map((c) => `<li><a href="region.html?c=${c.id}">${esc(c.name)}</a></li>`).join("")}
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© ${new Date().getFullYear()} VIBHOR — Indian Heritage Portal. An educational prototype built with open web tech.</span>
            <span class="tag">${esc(D.tagline || "")}</span>
          </div>
        </div>
      </footer>`;
  }

  /* ---------- newsletter (real backend row) ---------- */
  function initNewsletter() {
    qsa("[data-newsletter]").forEach((form) => {
      if (form._wired) return;
      form._wired = true;
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const msg = qs(".nl-msg", form.parentElement) || form.nextElementSibling;
        const email = qs("input[type=email]", form).value.trim();
        try {
          await VH_API.post("/api/newsletter", { email });
          if (msg) { msg.textContent = "✦ " + D.tr("news.ok", "Welcome aboard! Your first heritage dispatch is on its way."); }
          form.reset();
        } catch (err) {
          if (msg) msg.textContent = "⚠ " + (err.message || "Could not subscribe right now — try again.");
        }
      });
    });
  }

  /* ---------- reveal on scroll ---------- */
  function initReveal() {
    const els = qsa(".reveal");
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- gallery builder (distinct images & captions per item) ---------- */
  D.buildGallery = function (item) {
    const idx = Math.max(0, D.items.findIndex((i) => i.id === item.id));
    const pool = D.pools[item.cat] || [];
    const rel = D.pools[D.relatedPools[item.cat]] || [];
    const regionImg = (D.regions[item.region] || {}).image || "";
    const picked = [item.img];
    let a = idx % Math.max(1, pool.length);
    for (let k = 0; k < 6 && picked.length < 5; k++) {
      const c = pool[(a + k) % pool.length];
      if (c && !picked.includes(c)) picked.push(c);
    }
    for (let k = 0; k < rel.length && picked.length < 5; k++) {
      const c = rel[(idx + k) % rel.length];
      if (c && !picked.includes(c)) picked.push(c);
    }
    if (regionImg && !picked.includes(regionImg) && picked.length < 5) picked.push(regionImg);
    const caps = D.captions[item.cat] || D.captions.monuments;
    const gallery = picked.slice(0, 5).map((src, i) => ({
      src: String(src).split("#")[0],
      caption: caps[(idx + i) % caps.length]
    }));
    const seen = new Set(); const out = [];
    for (const g of gallery) if (!seen.has(g.src)) { seen.add(g.src); out.push(g); }
    return out;
  };

  /* ---------- item card renderer ---------- */
  D.itemCardHTML = function (item) {
    const cat = D.catOf(item.cat);
    const VC = window.VH_CONTENT;
    const loc = VC ? (VC.item(item.id) || null) : null;
    const n = (loc && loc.n) || item.name;
    const d = (loc && loc.d) || item.desc;
    const catName = VC ? (VC.cat(item.cat) || cat.name || item.cat) : (cat.name || item.cat);
    const stateName = VC ? (VC.state(item.state) || item.state) : item.state;
    const explore = VC ? (VC.feat("chat.exploreCta") || "Explore") : "Explore";
    return `
      <a class="item-card reveal" href="detail.html?id=${item.id}">
        <div class="ic-media">
          <img src="${item.img}" alt="${esc(n)}" loading="lazy">
          <span class="ic-tag">${esc(catName)}</span>
          <span class="ic-state">${esc(stateName)}</span>
        </div>
        <div class="ic-body">
          <h3>${esc(n)}</h3>
          <p class="ic-desc">${esc(d)}</p>
          <span class="ic-link">${esc(explore)}</span>
        </div>
      </a>`;
  };

  /* ---------- video modal (shared) ---------- */
  D.openVideoModal = function (video, title) {
    let modal = qs("#videoModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "videoModal";
      modal.className = "modal";
      modal.innerHTML = `
        <div class="modal-box">
          <button class="modal-close" aria-label="Close">✕</button>
          <div class="video-frame"></div>
          <div class="modal-caption"></div>
        </div>`;
      document.body.appendChild(modal);
      modal.addEventListener("click", (e) => { if (e.target === modal) D.closeModals(); });
      qs(".modal-close", modal).addEventListener("click", D.closeModals);
    }
    qs(".video-frame", modal).innerHTML =
      `<iframe src="https://www.youtube.com/embed/${encodeURIComponent(video.id)}?autoplay=1&rel=0"
        title="${esc(video.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>`;
    qs(".modal-caption", modal).textContent = `${video.title} — ${video.author} · ${video.viewCount || ""}`;
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  };

  D.openLightbox = function (src, caption) {
    let modal = qs("#lightbox");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "lightbox";
      modal.className = "modal";
      modal.innerHTML = `
        <div class="modal-box" style="max-width:860px">
          <button class="modal-close" aria-label="Close">✕</button>
          <img class="lightbox-img" alt="">
          <div class="lightbox-cap"></div>
        </div>`;
      document.body.appendChild(modal);
      modal.addEventListener("click", (e) => { if (e.target === modal) D.closeModals(); });
      qs(".modal-close", modal).addEventListener("click", D.closeModals);
    }
    qs(".lightbox-img", modal).src = src;
    qs(".lightbox-cap", modal).textContent = caption;
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  };

  D.closeModals = function () {
    qsa(".modal").forEach((m) => m.classList.remove("show"));
    qsa(".video-frame iframe").forEach((f) => (f.src = "about:blank"));
    document.body.style.overflow = "";
  };

  document.addEventListener("keydown", (e) => { if (e.key === "Escape") D.closeModals(); });

  /* ---------- YouTube search API (dynamic query per heritage item) ---------- */
  D.fetchVideos = async function (query) {
    const res = await fetch(YT_API + encodeURIComponent(query), { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    let list = [];
    if (Array.isArray(data)) list = data;
    else if (Array.isArray(data.videos)) list = data.videos;
    else if (Array.isArray(data.results)) list = data.results;
    else if (Array.isArray(data.items)) list = data.items;
    else if (data.data && Array.isArray(data.data)) list = data.data;
    else if (data.data && Array.isArray(data.data.videos)) list = data.data.videos;
    let videos = list.map((v) => {
      const id = v.id || v.videoId || v.video_id || (v.id && v.id.videoId) || "";
      return {
        id,
        title: v.title || "YouTube video",
        author: v.author || v.channel || (v.ownerStatistics && v.ownerStatistics.channelTitle) || "YouTube",
        thumbnail: v.thumbnail ||
          (v.thumbnails && (v.thumbnails.find((t) => /maxres|hq|medium/.test(t.url || "")) || v.thumbnails[0]) && v.thumbnails.find((t) => /maxres|hq|medium/.test(t.url || "")).url) ||
          (id ? `https://i.ytimg.com/vi/${id}/hq720.jpg` : `https://i.ytimg.com/vi/${id || ""}/hqdefault.jpg`),
        viewCount: v.viewCount || (v.viewCountRaw != null ? v.viewCountRaw + " views" : ""),
        viewCountRaw: v.viewCountRaw != null ? v.viewCountRaw : (typeof v.view_count === "number" ? v.view_count : null),
        duration: v.duration || "",
        durationSeconds: v.durationSeconds != null ? v.durationSeconds : (v.duration_seconds != null ? v.duration_seconds : null),
        publishedTime: v.publishedTime || ""
      };
    }).filter((v) => v.id);
    const substantial = videos.filter((v) => v.durationSeconds == null || v.durationSeconds >= 90);
    if (substantial.length) videos = substantial;
    videos = videos.slice().sort((a, b) => (b.viewCountRaw || 0) - (a.viewCountRaw || 0));
    return videos.slice(0, 6);
  };

  D.loadVideos = async function (query, gridEl, headEl) {
    gridEl.innerHTML = `<div class="yt-state"><div class="spinner"></div><span>Searching YouTube for “${esc(query)}”…</span></div>`;
    try {
      const videos = await D.fetchVideos(query);
      if (!videos.length) {
        gridEl.innerHTML = `<div class="yt-state"><div class="e-icon" style="font-size:2rem">🎬</div><p>No videos found for “${esc(query)}”. Try again later.</p></div>`;
        return;
      }
      gridEl.innerHTML = `<div class="video-grid">` + videos.map((v, i) => `
        <div class="video-card reveal visible${i === 0 ? " vc-best-card" : ""}" data-vi="${i}">
          <div class="vc-media">
            <img src="${esc(v.thumbnail)}" alt="${esc(v.title)}" loading="lazy" onerror="this.style.display='none'">
            <div class="vc-play"><span><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span></div>
            ${i === 0 ? `<span class="vc-best">★ Best match</span>` : ""}
            ${v.duration ? `<span class="vc-dur">${esc(v.duration)}</span>` : ""}
          </div>
          <div class="vc-body">
            <h4>${esc(v.title)}</h4>
            <div class="vc-meta"><span>${esc(v.author)}</span><span>${esc(v.viewCount || "")}</span></div>
          </div>
        </div>`).join("") + `</div>`;
      qsa(".video-card", gridEl).forEach((card) => {
        card.addEventListener("click", () => D.openVideoModal(videos[+card.dataset.vi], query));
      });
    } catch (err) {
      gridEl.innerHTML = `
        <div class="yt-state">
          <div class="e-icon" style="font-size:2rem">📡</div>
          <p>Couldn't reach the YouTube search service right now.<br>Check your connection, or watch “${esc(query)}” directly on YouTube.</p>
          <a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encodeURIComponent(query)}">Open on YouTube</a>
        </div>`;
    }
  };

  /* ---------- FAQ (shared accordion) ---------- */
  function initFAQ() {
    qsa(".faq-item").forEach((item) => {
      const q = qs(".faq-q", item), a = qs(".faq-a", item);
      q.addEventListener("click", () => {
        const open = item.classList.contains("open");
        qsa(".faq-item.open").forEach((o) => { o.classList.remove("open"); qs(".faq-a", o).style.maxHeight = null; });
        if (!open) { item.classList.add("open"); a.style.maxHeight = a.scrollHeight + "px"; }
      });
    });
  }

  D.initReveal = initReveal;

  document.addEventListener("DOMContentLoaded", () => {
    renderNav();
    renderFooter();
    initNewsletter();
    setTimeout(initReveal, 0);
    initFAQ();
  });
  document.addEventListener("vh:langchange", () => { renderAccountChip(); });
})();
