/* VIBHOR — Heritage Archive page
   Browse (real records, real filters) · Preserve (capture / upload
   on mobile + preview, retake, delete, add page) · record viewer.
   Every submission lands in SQLite + server/uploads. Preserving
   uses the same VIBHOR_ARCHIVE API the chatbot reads. */
(function () {
  "use strict";
  const D = window.HERITAGE;
  const qs = (s, el = document) => el.querySelector(s);
  const esc = D.esc || ((s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])));
  const tr = (key, fb) => D.tr ? D.tr(key, fb) : fb;
  const A = () => window.VIBHOR_ARCHIVE;

  const stateNames = () => { try { return HERITAGE_STATES.map((s) => s.name); } catch (e) { return []; } };
  const FILTERS = { state: "", language: "", category: "", sort: "new" };

  /* ============ BROWSE ============ */
  function renderFilters() {
    const el = qs("#archFilters");
    if (!el) return;
    el.innerHTML = `
      <select id="afState" aria-label="State">
        <option value="">${esc(tr("arch.filter.state", "All states"))}</option>
        ${stateNames().map((s) => `<option ${FILTERS.state === s ? "selected" : ""}>${esc(s)}</option>`).join("")}
      </select>
      <select id="afLang" aria-label="Language">
        <option value="">${esc(tr("arch.filter.lang", "All languages"))}</option>
        ${A().DOCLANGS.map((l) => `<option value="${l.id}" ${FILTERS.language === l.id ? "selected" : ""}>${esc(l.name)}</option>`).join("")}
      </select>
      <select id="afCat" aria-label="Category">
        <option value="">${esc(tr("arch.filter.cat", "All categories"))}</option>
        ${A().CATEGORIES.map((c) => `<option value="${c.id}" ${FILTERS.category === c.id ? "selected" : ""}>${esc(c.name)}</option>`).join("")}
      </select>
      <select id="afSort" aria-label="Sort">
        <option value="new" ${FILTERS.sort !== "old" ? "selected" : ""}>${esc(tr("arch.sort.new", "Newest first"))}</option>
        <option value="old" ${FILTERS.sort === "old" ? "selected" : ""}>${esc(tr("arch.sort.old", "Oldest first"))}</option>
      </select>`;
    qs("#afState", el).addEventListener("change", (e) => { FILTERS.state = e.target.value; loadRecords(); });
    qs("#afLang", el).addEventListener("change", (e) => { FILTERS.language = e.target.value; loadRecords(); });
    qs("#afCat", el).addEventListener("change", (e) => { FILTERS.category = e.target.value; loadRecords(); });
    qs("#afSort", el).addEventListener("change", (e) => { FILTERS.sort = e.target.value; loadRecords(); });
  }

  async function loadRecords() {
    const grid = qs("#archGrid");
    if (!grid) return;
    grid.innerHTML = `<div class="yt-state"><div class="spinner"></div></div>`;
    let records = [];
    try { records = await A().all(FILTERS); } catch (e) {}
    const count = qs("#archCount");
    if (count) count.textContent = records.length ? `✦ ${records.length}` : "";
    grid.innerHTML = records.length ? `<div class="arch-grid">${records.map(cardHTML).join("")}</div>`
      : `<div class="empty arch-empty">
           <div class="e-icon">📜</div>
           <h3>${esc(tr("arch.empty", "No community-preserved documents yet."))}</h3>
           <a class="btn btn-gold" href="#preserve">${esc(tr("arch.empty.cta", "📷 Preserve the first one"))}</a>
         </div>`;
    grid.querySelectorAll("[data-rec]").forEach((c) => c.addEventListener("click", () => openRecord(c.dataset.rec)));
  }

  function cardHTML(r) {
    const first = r.pageUrls[0];
    return `
      <article class="arch-card" data-rec="${esc(r.id)}" tabindex="0" role="button" aria-label="${esc(r.title)}">
        <div class="ac-media">
          ${first ? `<img src="${esc(first)}" alt="${esc(r.title)} — page 1" loading="lazy">` : `<img src="${D.placeholder(r.title, A().catMeta(r.category).e)}" alt="${esc(r.title)}" loading="lazy">`}
          <span class="ac-cat">${A().catMeta(r.category).e} ${esc(A().catMeta(r.category).name)}</span>
          ${r.videoUrl ? `<span class="ac-video">🎞️ ${esc(tr("arch.video", "has video"))}</span>` : ""}
        </div>
        <div class="ac-body">
          <b>${esc(r.title)}</b>
          <p>${esc(r.desc).slice(0, 110)}${r.desc.length > 110 ? "…" : ""}</p>
          <small>📍 ${esc(r.state)}${r.district ? ", " + esc(r.district) : ""} · 🗣 ${esc(A().langName(r.language))} · 🕰 ${esc(r.age)}</small>
          <small>👤 ${esc(tr("arch.by", "by"))} ${esc(r.contributor)} · ${esc(tr("arch.pages", "{n} pages").replace("{n}", r.pageUrls.length))}</small>
        </div>
      </article>`;
  }

  /* ============ RECORD VIEWER ============ */
  let vModal = null;
  function openRecord(id) {
    A().get(id).then((r) => {
      if (!vModal) {
        vModal = document.createElement("div");
        vModal.className = "record-modal";
        document.body.appendChild(vModal);
      }
      vModal.innerHTML = `
        <div class="rm-box" role="dialog" aria-modal="true" aria-label="${esc(r.title)}">
          <button class="modal-close" id="rmClose" aria-label="${esc(tr("arch.close", "Close"))}">✕</button>
          <div class="rm-head">
            <span class="ac-cat">${A().catMeta(r.category).e} ${esc(A().catMeta(r.category).name)}</span>
            <h3>${esc(r.title)}</h3>
            <p class="rm-meta">${esc(r.id)} · 📍 ${esc(r.state)}${r.district ? ", " + esc(r.district) : ""} · 🗣 ${esc(A().langName(r.language))} · 🕰 ${esc(r.age)} · 👤 ${esc(r.contributor)}</p>
            <p class="rm-desc">${esc(r.desc)}</p>
          </div>
          <div class="rm-pages">
            ${r.pageUrls.map((u, i) => `<figure data-i="${i}"><img src="${esc(u)}" alt="${esc(r.title)} — page ${i + 1}" loading="lazy"><figcaption>Page ${i + 1}</figcaption></figure>`).join("")}
          </div>
          ${r.videoUrl ? `<div class="rm-video"><video src="${esc(r.videoUrl)}" controls playsinline preload="metadata"></video></div>` : ""}
          <p class="rm-note">🧾 ${esc(tr("arch.ocrnote", "OCR text extraction is a planned future step — pages are stored as faithful images for now."))}</p>
        </div>`;
      vModal.classList.add("open");
      document.body.style.overflow = "hidden";
      const close = () => { vModal.classList.remove("open"); document.body.style.overflow = ""; };
      qs("#rmClose", vModal).addEventListener("click", close);
      vModal.addEventListener("click", (e) => { if (e.target === vModal) close(); });
      vModal.querySelectorAll("figure").forEach((f) => {
        f.addEventListener("click", () => D.openLightbox(qs("img", f).src, qs("figcaption", f).textContent));
      });
    }).catch(() => {});
  }

  /* ============ PRESERVE FORM ============ */
  const FORM = { pages: [], video: null };
  function renderForm() {
    const el = qs("#preservePanel");
    if (!el) return;
    const me = VH_API.me();
    el.innerHTML = `
      <div class="pf-grid">
        <form class="pf-form" id="pfForm" novalidate>
          <div class="vf"><label data-i18n="arch.form.title">Document title</label>
            <input id="pfTitle" maxlength="80" required placeholder="e.g. Grandmother's pickle recipe book"></div>
          <div class="em-cols">
            <div class="vf"><label data-i18n="arch.form.state">State / UT</label>
              <select id="pfState" required><option value="">—</option>${stateNames().map((s) => `<option>${esc(s)}</option>`).join("")}</select></div>
            <div class="vf"><label data-i18n="arch.form.district">District</label>
              <input id="pfDistrict" maxlength="40" placeholder="e.g. Krishna"></div>
          </div>
          <div class="em-cols">
            <div class="vf"><label data-i18n="arch.form.lang">Document language</label>
              <select id="pfLang" required><option value="">—</option>${A().DOCLANGS.map((l) => `<option value="${l.id}">${esc(l.name)}</option>`).join("")}</select></div>
            <div class="vf"><label data-i18n="arch.form.cat">Category</label>
              <select id="pfCat" required>${A().CATEGORIES.map((c) => `<option value="${c.id}">${c.e} ${esc(c.name)}</option>`).join("")}</select></div>
          </div>
          <div class="em-cols">
            <div class="vf"><label data-i18n="arch.form.age">Approximate age</label>
              <select id="pfAge">${A().AGES.map((a) => `<option ${a === "Unknown" ? "selected" : ""}>${esc(a)}</option>`).join("")}</select></div>
            <div class="vf"><label data-i18n="arch.form.by">Contributor name</label>
              <input id="pfBy" maxlength="40" value="${esc(me.authenticated && me.user ? me.user.name : "")}" placeholder="Your name"></div>
          </div>
          <div class="vf"><label data-i18n="arch.form.desc">Description</label>
            <textarea id="pfDescr" maxlength="300" rows="3" required placeholder="What is this document? Whose handwriting? Which festival or tradition does it belong to?"></textarea></div>
          <div class="vh-auth-err" id="pfErr" hidden></div>
          <div class="vh-auth-ok" id="pfOk" hidden></div>
          <button type="submit" class="btn btn-gold" id="pfSubmit">📜 ${esc(tr("arch.form.submit", "Preserve it — +50 Heritage Points"))}</button>
        </form>

        <div class="pf-media">
          <h4 data-i18n="arch.form.pages">Pages (photos of each page)</h4>
          <div class="pf-pages" id="pfPages"></div>
          <label class="pf-add">
            <input type="file" id="pfPageInput" accept="image/jpeg,image/png,image/webp" multiple hidden>
            <span class="btn btn-ghost btn-sm">📷 ${esc(tr("arch.form.addpage", "+ Add / scan page"))}</span>
          </label>
          <label class="pf-add" style="margin-top:8px">
            <input type="file" id="pfPageCam" accept="image/*" capture="environment" hidden>
            <span class="btn btn-ghost btn-sm">📸 ${esc(tr("arch.form.camera", "Capture with camera"))}</span>
          </label>
          <h4 style="margin-top:18px" data-i18n="arch.form.video">Video (optional)</h4>
          <label class="pf-add">
            <input type="file" id="pfVideo" accept="video/mp4,video/webm,video/quicktime" hidden>
            <span class="btn btn-ghost btn-sm">🎞️ ${esc(tr("arch.form.video", "Video (optional)"))}</span>
          </label>
          <div class="pv-wrap" id="pfVideoPrev"></div>
        </div>
      </div>`;

    qs("#pfPageInput", el).addEventListener("change", (e) => addPages([...e.target.files]));
    qs("#pfPageCam", el).addEventListener("change", (e) => addPages([...e.target.files]));
    qs("#pfVideo", el).addEventListener("change", (e) => {
      FORM.video = e.target.files[0] || null;
      renderVideoPrev();
    });
    qs("#pfForm", el).addEventListener("submit", submitPreserve);
    paintPages();
  }

  function addPages(files) {
    const ok = (files || []).filter((f) => /image\//.test(f.type));
    if (FORM.pages.length + ok.length > 12) ok.length = 12 - FORM.pages.length;
    ok.forEach((f) => FORM.pages.push(f));
    paintPages();
  }
  function paintPages() {
    const box = qs("#pfPages");
    if (!box) return;
    box.innerHTML = FORM.pages.length ? FORM.pages.map((f, i) => {
      const url = URL.createObjectURL(f);
      return `
      <figure class="page-thumb" data-p="${i}">
        <img src="${url}" alt="Page ${i + 1}">
        <figcaption>${esc(f.name).slice(0, 24)}</figcaption>
        <div class="pt-tools">
          <label class="pt-retake" title="${esc(tr("arch.form.retake", "Retake"))}">🔁
            <input type="file" accept="image/*" capture="environment" hidden data-retake="${i}">
          </label>
          <button type="button" class="pt-del" data-del="${i}" title="${esc(tr("arch.form.delete", "Delete"))}">✕</button>
        </div>
      </figure>`;
    }).join("") : `<div class="pf-pages-empty">${esc(tr("arch.form.pageshelp", "No pages yet — photograph or scan each page, one by one."))}</div>`;
    box.querySelectorAll("[data-del]").forEach((b) => b.addEventListener("click", () => {
      FORM.pages.splice(parseInt(b.dataset.del, 10), 1); paintPages();
    }));
    box.querySelectorAll("[data-retake]").forEach((inp) => inp.addEventListener("change", () => {
      const i = parseInt(inp.dataset.retake, 10);
      if (inp.files[0]) FORM.pages[i] = inp.files[0];
      paintPages();
    }));
  }
  function renderVideoPrev() {
    const box = qs("#pfVideoPrev");
    if (!box) return;
    box.innerHTML = FORM.video
      ? `<video src="${URL.createObjectURL(FORM.video)}" controls muted playsinline></video>
         <button type="button" class="pt-del pf-vdel" title="${esc(tr("arch.form.delete", "Delete"))}">✕</button>`
      : "";
    const d = qs(".pf-vdel", box);
    if (d) d.addEventListener("click", () => { FORM.video = null; renderVideoPrev(); });
  }

  async function submitPreserve(e) {
    e.preventDefault();
    if (!window.VIBHOR_AUTH || !VH_API.isLoggedIn()) {
      VIBHOR_AUTH.requireAuth(() => {
        const f = qs("#pfForm");
        if (f) f.dispatchEvent(new Event("submit", { cancelable: true }));
      }, tr("arch.form.login", "Sign in to reserve a place in the archive."));
      return;
    }
    const err = qs("#pfErr"), ok = qs("#pfOk");
    err.hidden = true; ok.hidden = true;
    const meta = {
      title: qs("#pfTitle").value.trim(),
      state: qs("#pfState").value,
      district: qs("#pfDistrict").value.trim(),
      language: qs("#pfLang").value,
      category: qs("#pfCat").value,
      age: qs("#pfAge").value,
      desc: qs("#pfDescr").value.trim(),
      contributor: qs("#pfBy").value.trim()
    };
    if (!meta.title || !meta.state || !meta.language || !meta.desc) {
      err.hidden = false;
      err.textContent = "Please fill title, state, language and description.";
      return;
    }
    if (!FORM.pages.length) {
      err.hidden = false;
      err.textContent = tr("arch.form.needpages", "Add at least one page photo before preserving.");
      return;
    }
    const btn = qs("#pfSubmit");
    btn.disabled = true;
    btn.textContent = "⌛ Uploading…";
    try {
      const rec = await A().add(meta, FORM.pages, FORM.video);
      FORM.pages = [];
      FORM.video = null;
      qs("#pfForm").reset();
      paintPages();
      renderVideoPrev();
      ok.hidden = false;
      ok.textContent = tr("arch.success", "📜 Preserved! Record {id} now lives in the community archive.").replace("{id}", rec.id);
      loadRecords();
      renderStatsCount();
      if (rec.id) openRecord(rec.id);
    } catch (ex) {
      err.hidden = false;
      err.textContent = ex.message || "Upload failed — please try again.";
    } finally {
      btn.disabled = false;
      btn.innerHTML = "📜 " + esc(tr("arch.form.submit", "Preserve it — +50 Heritage Points"));
    }
  }

  async function renderStatsCount() {
    try {
      const s = await VH_API.get("/api/stats/public");
      const c = qs("#archCount");
      if (c) c.textContent = s.preserved ? `✦ ${s.preserved}` : "";
    } catch (e) {}
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderFilters();
    loadRecords();
    renderForm();
    renderStatsCount();
    const rid = new URLSearchParams(location.search).get("record");
    if (rid) openRecord(rid);
    document.addEventListener("vh:langchange", () => { renderFilters(); renderForm(); loadRecords(); });
  });
})();
