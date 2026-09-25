/* VIBHOR — Community page
   Challenges (real counts · real entries) · Leaderboard (REAL
   users only — zero rows shows the honest empty state) ·
   Contributions feed (real submissions). Everything guest-
   readable; submissions need a free account. */
(function () {
  "use strict";
  const D = window.HERITAGE;
  const qs = (s, el = document) => el.querySelector(s);
  const esc = D.esc || ((s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])));
  const tr = (key, fb) => D.tr ? D.tr(key, fb) : fb;
  const fmtDate = (iso) => { try { return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" }); } catch (e) { return iso || ""; } };
  const CATS = D.categories.map((c) => c.id);
  const stateNames = () => { try { return HERITAGE_STATES.map((s) => s.name); } catch (e) { return D.items.map((i) => i.state); } };

  /* ---------- header stats (real) ---------- */
  async function renderStats() {
    const el = qs("#comStats");
    if (!el) return;
    let s = { explorers: 0, contributions: 0, preserved: 0 };
    try { s = await VH_API.get("/api/stats/public"); } catch (e) {}
    el.innerHTML = `
      <div class="stat"><b>${s.explorers}</b><span>${esc(tr("cs.explorers", "Registered Explorers"))}</span></div>
      <div class="stat"><b>${s.contributions}</b><span>${esc(tr("cs.contrib", "Community Contributions"))}</span></div>
      <div class="stat"><b>${s.preserved}</b><span>${esc(tr("cs.preserved", "Documents Preserved"))}</span></div>`;
  }

  /* ---------- challenges ---------- */
  async function renderChallenges() {
    const el = qs("#challengeGrid");
    if (!el) return;
    let challenges = [];
    let entriesByCh = {};
    try { ({ challenges } = await VH_API.get("/api/challenges")); } catch (e) {}
    el.innerHTML = challenges.map((c) => {
      const isArchive = c.kind === "archive";
      const countTxt = isArchive
        ? `📜 ${c.archiveCount} ${esc(tr("cs.preserved", "Documents Preserved"))}`
        : c.participants
          ? `${c.entries} ${esc(tr("com.entries", "entries"))} · ${c.participants} ${esc(tr("com.participants", "participants"))}`
          : `<em class="ch-none">${esc(tr("com.none.yet", "No participants yet — be the first!"))}</em>`;
      return `
      <article class="challenge-card reveal visible" data-ch="${c.code}">
        <div class="cc-top">
          <span class="cc-icon" aria-hidden="true">${c.icon}</span>
          <div>
            <h3>${esc(c.name)}</h3>
            <small class="cc-count">${countTxt}${c.joined ? " · " + esc(tr("com.joined", "Joined ✓")) : ""}</small>
          </div>
        </div>
        <p class="cc-desc">${esc(c.descr)}</p>
        <div class="cc-actions">
          ${isArchive
            ? `<a class="btn btn-gold btn-sm" href="archive.html#preserve">📜 ${esc(tr("arch.preserve", "Preserve a document"))}</a>`
            : `<button type="button" class="btn btn-gold btn-sm" data-join="${c.code}">📤 ${esc(tr("com.submit", "Submit entry"))}</button>`}
          <button type="button" class="btn btn-ghost btn-sm" data-view="${c.code}" ${c.entries ? "" : "hidden"}>
            👀 ${esc(tr("com.entries", "entries"))} (${c.entries})
          </button>
        </div>
        <div class="cc-entries" hidden></div>
      </article>`;
    }).join("");

    el.querySelectorAll("[data-join]").forEach((b) => b.addEventListener("click", () => openEntryModal(b.dataset.join, challenges)));
    el.querySelectorAll("[data-view]").forEach((b) => b.addEventListener("click", async () => {
      const card = b.closest(".challenge-card");
      const box = qs(".cc-entries", card);
      if (!box.hidden) { box.hidden = true; return; }
      box.hidden = false;
      box.innerHTML = `<div class="yt-state"><div class="spinner"></div></div>`;
      try {
        const { entries } = await VH_API.get(`/api/challenges/${encodeURIComponent(b.dataset.view)}/entries`);
        box.innerHTML = entries.length ? entries.map((e) => entryHTML(e)).join("")
          : `<div class="empty"><p>${esc(tr("com.none.yet", "No participants yet — be the first!"))}</p></div>`;
      } catch (e) { box.innerHTML = ""; }
    }));
  }

  function entryHTML(e) {
    return `
      <div class="entry-card">
        ${e.image_path
          ? `<img src="${esc(e.image_path)}" alt="${esc(e.title)}" loading="lazy">`
          : e.video_path
            ? `<video src="${esc(e.video_path)}" controls playsinline preload="metadata"></video>`
            : ""}
        <div class="ec-body">
          <b>${esc(e.title)}</b>
          <p>${esc(e.descr)}</p>
          <small>👤 ${esc(e.contributor)}${e.state ? " · 📍 " + esc(e.state) : ""} · ${esc(fmtDate(e.created_at))}</small>
        </div>
      </div>`;
  }

  /* ---------- entry submission modal ---------- */
  let modal = null;
  function ensureModal() {
    if (modal) return modal;
    modal = document.createElement("div");
    modal.className = "entry-modal";
    modal.innerHTML = `
      <div class="em-box" role="dialog" aria-modal="true">
        <button class="modal-close" aria-label="Close">✕</button>
        <h3 data-i18n="com.entry.title">Submit your entry</h3>
        <p class="em-ch" id="emChallenge"></p>
        <form id="emForm" novalidate>
          <div class="vf"><label data-i18n="com.entry.name">Title</label><input id="emTitle" maxlength="60" required></div>
          <div class="vf"><label data-i18n="com.entry.desc">Short description</label><textarea id="emDescr" maxlength="300" rows="3" required></textarea></div>
          <div class="em-cols">
            <div class="vf"><label data-i18n="com.entry.state">State / UT</label>
              <select id="emState"><option value="">—</option></select></div>
            <div class="vf"><label data-i18n="com.entry.cat">Category</label>
              <select id="emCat"><option value="">—</option></select></div>
          </div>
          <div class="em-cols">
            <div class="vf"><label data-i18n="com.entry.image">Image</label>
              <input id="emImage" type="file" accept="image/jpeg,image/png,image/webp,image/gif"></div>
            <div class="vf"><label data-i18n="com.entry.video">Video (optional)</label>
              <input id="emVideo" type="file" accept="video/mp4,video/webm,video/quicktime"></div>
          </div>
          <div class="em-preview" id="emPreview"></div>
          <div class="vh-auth-err" id="emErr" hidden></div>
          <button type="submit" class="btn btn-gold" id="emSend" data-i18n="com.entry.send">Send my entry</button>
        </form>
      </div>`;
    qs("#entryModalHost").appendChild(modal);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
    qs(".modal-close", modal).addEventListener("click", closeModal);
    qs("#emImage", modal).addEventListener("change", previewEntryFiles);
    qs("#emVideo", modal).addEventListener("change", previewEntryFiles);
    return modal;
  }
  function previewEntryFiles() {
    const box = qs("#emPreview", modal);
    box.innerHTML = "";
    const img = qs("#emImage", modal).files[0];
    const vid = qs("#emVideo", modal).files[0];
    if (img) {
      const url = URL.createObjectURL(img);
      box.innerHTML += `<figure><img src="${url}" alt="preview"><figcaption>${esc(img.name)} · ${(img.size / 1048576).toFixed(1)} MB</figcaption></figure>`;
    }
    if (vid) {
      const url = URL.createObjectURL(vid);
      box.innerHTML += `<figure><video src="${url}" controls muted></video><figcaption>${esc(vid.name)} · ${(vid.size / 1048576).toFixed(1)} MB</figcaption></figure>`;
    }
  }
  function openEntryModal(code, challenges) {
    const c = (challenges || []).find((x) => x.code === code);
    if (window.VIBHOR_AUTH && !VH_API.isLoggedIn()) {
      VIBHOR_AUTH.requireAuth(() => openEntryModal(code, challenges), tr("com.entry.login", "Sign in to submit entries and climb the leaderboard."));
      return;
    }
    ensureModal();
    qs("#emChallenge", modal).textContent = c ? `${c.icon} ${c.name}` : code;
    qs("#emChallenge", modal).dataset.code = code;
    qs("#emState", modal).innerHTML = `<option value="">—</option>` + stateNames().map((s) => `<option>${esc(s)}</option>`).join("");
    qs("#emCat", modal).innerHTML = `<option value="">—</option>` + D.categories.map((c2) => `<option value="${c2.id}">${esc(c2.name)}</option>`).join("");
    qs("#emErr", modal).hidden = true;
    qs("#emForm", modal).reset();
    qs("#emPreview", modal).innerHTML = "";
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    const form = qs("#emForm", modal);
    form.onsubmit = async (ev) => {
      ev.preventDefault();
      const errEl = qs("#emErr", modal);
      errEl.hidden = true;
      const img = qs("#emImage", modal).files[0];
      const vid = qs("#emVideo", modal).files[0];
      if (!img && !vid) {
        errEl.hidden = false;
        errEl.textContent = tr("com.entry.needfile", "Attach at least an image or a video for your entry.");
        return;
      }
      const fd = new FormData();
      fd.set("title", qs("#emTitle", modal).value.trim());
      fd.set("descr", qs("#emDescr", modal).value.trim());
      fd.set("state", qs("#emState", modal).value);
      fd.set("category", qs("#emCat", modal).value);
      if (img) fd.append("image", img, img.name);
      if (vid) fd.append("video", vid, vid.name);
      const btn = qs("#emSend", modal);
      btn.disabled = true;
      try {
        const r = await VH_API.upload(`/api/challenges/${encodeURIComponent(code)}/entries`, fd);
        closeModal();
        if (r.reward && r.reward.earned && window.HERITAGE_PROGRESS) {
          HERITAGE_PROGRESS.showToast(`✦ +${r.reward.earned} Heritage Points`, "ok", 3600);
        } else if (window.HERITAGE_PROGRESS) {
          HERITAGE_PROGRESS.showToast(tr("com.entry.done", "✦ Entry submitted!"), "ok", 3600);
        }
        renderChallenges();
        renderContrib();
        renderStats();
        VH_API.refresh();
      } catch (err) {
        errEl.hidden = false;
        errEl.textContent = err.message || "Upload failed — please try again.";
      } finally {
        btn.disabled = false;
      }
    };
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  /* ---------- leaderboard (real registered users only) ---------- */
  async function renderLeaderboard() {
    const el = qs("#leaderBoard");
    if (!el) return;
    let data = { rows: [], total: 0, rank: null };
    try { data = await VH_API.get("/api/leaderboard"); } catch (e) {}
    if (!data.rows.length) {
      el.innerHTML = `
        <div class="empty lb-empty">
          <div class="e-icon">🥇</div>
          <h3>${esc(tr("com.lb.empty", "Be the first Heritage Explorer — play a quiz or stamp a state!"))}</h3>
          <a class="btn btn-gold btn-sm" href="quiz.html">${esc(tr("mv.playQuiz", "Play the quiz"))}</a>
        </div>`;
      return;
    }
    el.innerHTML = `
      <div class="mv-tablewrap"><table class="mv-table lb-table">
        <thead><tr>
          <th>${esc(tr("com.lb.rank", "Rank"))}</th>
          <th>${esc(tr("com.lb.explorer", "Explorer"))}</th>
          <th>${esc(tr("com.lb.score", "Score"))}</th>
          <th>${esc(tr("com.lb.points", "Points"))}</th>
          <th>${esc(tr("com.lb.states", "States"))}</th>
          <th>${esc(tr("com.lb.badges", "Badges"))}</th>
          <th>${esc(tr("com.lb.archive", "Archive"))}</th>
        </tr></thead>
        <tbody>
          ${data.rows.map((r) => `
          <tr class="${r.me ? "lb-me" : ""}">
            <td>${r.rank <= 3 ? ["🥇", "🥈", "🥉"][r.rank - 1] : r.rank}</td>
            <td><b>${esc(r.name)}</b>${r.me ? ` <span class="lb-you">${esc(tr("com.lb.you", "You"))}</span>` : ""}</td>
            <td><b>${r.score}</b></td>
            <td>${r.points}</td>
            <td>${r.states}</td>
            <td>${r.badges}</td>
            <td>${r.archives}</td>
          </tr>`).join("")}
        </tbody>
      </table></div>
      ${data.rank ? `<p class="lb-note">✦ Your rank: <b>#${data.rank}</b> of ${data.total}</p>` : ""}`;
  }

  /* ---------- contributions feed ---------- */
  async function renderContrib() {
    const el = qs("#contribGrid");
    if (!el) return;
    let list = [];
    try { ({ contributions: list } = await VH_API.get("/api/contributions")); } catch (e) {}
    el.innerHTML = list.length ? `<div class="contrib-feed">${list.map((e) => entryHTML(e) + "").join("")}</div>`
      : `<div class="empty"><div class="e-icon">🎞️</div><p>${esc(tr("com.contrib.empty", "No community contributions yet — submit the first one from a challenge above."))}</p></div>`;
  }

  function paintAll() { renderStats(); renderChallenges(); renderLeaderboard(); renderContrib(); }

  document.addEventListener("DOMContentLoaded", paintAll);
  document.addEventListener("vh:auth-change", paintAll);
  document.addEventListener("vh:langchange", paintAll);
})();
