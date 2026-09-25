/* ============================================================
   VIBHOR — authentication UI
   Sign in / Create account / Continue as guest — one modal on
   every page, plus the nav account chip. After the first sign-in
   on a device, the visitor's LOCAL (guest) progress is merged
   into the account ONCE — the server recomputes every point
   (client sends events, never points).
   ============================================================ */
(function () {
  "use strict";
  const qs = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const tr = (key, fb) => (window.VH_TR ? VH_TR(key) : fb);

  let modal = null;
  let mode = "login";
  let afterLogin = null;

  function ensureModal() {
    if (modal) return modal;
    modal = document.createElement("div");
    modal.id = "vhAuthModal";
    modal.className = "vh-auth";
    modal.innerHTML = `
      <div class="vh-auth-box" role="dialog" aria-modal="true" aria-label="VIBHOR account">
        <button class="vh-auth-x" aria-label="Close">✕</button>
        <div class="vh-auth-brand">
          <span class="brand-mark">V</span>
          <b data-i18n="auth.title">Your VIBHOR account</b>
          <small data-i18n="auth.sub">Track your journey, earn points and join the community.</small>
        </div>
        <div class="vh-auth-tabs">
          <button type="button" class="active" data-mode="login" data-i18n="auth.signin">Sign in</button>
          <button type="button" data-mode="register" data-i18n="auth.register">Create account</button>
        </div>
        <form class="vh-auth-form" novalidate>
          <div class="vf" data-f="name" hidden>
            <label for="vhaName" data-i18n="auth.name">Display name</label>
            <input id="vhaName" type="text" maxlength="40" autocomplete="name" placeholder="Asha">
          </div>
          <div class="vf">
            <label for="vhaEmail" data-i18n="auth.email">Email</label>
            <input id="vhaEmail" type="email" maxlength="120" autocomplete="email" placeholder="you@example.com" required>
          </div>
          <div class="vf">
            <label for="vhaPass" data-i18n="auth.password">Password</label>
            <input id="vhaPass" type="password" maxlength="72" autocomplete="current-password" placeholder="••••••••" required>
            <small data-i18n="auth.passhint">At least 8 characters.</small>
          </div>
          <div class="vf" data-f="lang">
            <label for="vhaLang" data-i18n="auth.lang">Preferred language</label>
            <select id="vhaLang">
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="te">తెలుగు</option>
              <option value="ta">தமிழ்</option>
              <option value="bn">বাংলা</option>
            </select>
          </div>
          <div class="vh-auth-err" id="vhaErr" hidden></div>
          <button type="submit" class="btn btn-gold vh-auth-submit" data-i18n="auth.go">Sign in</button>
        </form>
        <div class="vh-auth-guest">
          <span data-i18n="auth.or">or</span>
          <button type="button" id="vhaGuest" data-i18n="auth.guest">Continue as guest</button>
          <small data-i18n="auth.guestnote">Guests can browse, search, listen, chat and play the quiz — progress saves need a free account.</small>
        </div>
      </div>`;
    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
    qs(".vh-auth-x", modal).addEventListener("click", close);
    modal.querySelectorAll("[data-mode]").forEach((b) =>
      b.addEventListener("click", () => setMode(b.dataset.mode)));
    qs("form", modal).addEventListener("submit", submit);
    qs("#vhaGuest", modal).addEventListener("click", async () => {
      try { await VH_API.post("/api/auth/guest"); } catch (e) {}
      await VH_API.refresh();
      close();
      toast(tr("auth.toast.guest", "Browsing as guest — enjoy the journey!"));
    });
    if (window.VIBHOR_I18N) VIBHOR_I18N.apply(modal);
    return modal;
  }

  function setMode(m) {
    mode = m === "register" ? "register" : "login";
    ensureModal();
    modal.querySelectorAll("[data-mode]").forEach((b) => b.classList.toggle("active", b.dataset.mode === mode));
    qs('[data-f="name"]', modal).hidden = mode !== "register";
    qs("#vhaPass", modal).setAttribute("autocomplete", mode === "register" ? "new-password" : "current-password");
    qs(".vh-auth-submit", modal).textContent =
      tr(mode === "register" ? "auth.create" : "auth.signin", mode === "register" ? "Create account" : "Sign in");
    error("");
  }
  function error(msg) {
    const el = qs("#vhaErr", modal);
    if (!el) return;
    el.hidden = !msg;
    el.textContent = msg || "";
  }
  function toast(msg) {
    if (window.HERITAGE && HERITAGE.toast) return HERITAGE.toast(msg, "ok", 3800);
    try {
      const t = document.createElement("div");
      t.className = "toast show";
      t.textContent = msg;
      document.body.appendChild(t);
      setTimeout(() => t.classList.remove("show"), 3400);
      setTimeout(() => t.remove(), 3900);
    } catch (e) {}
  }

  /* after first login on a device → merge guest progress (events only, once) */
  async function mergeLocalProgress() {
    if (localStorage.getItem("vh_merged_v1")) return;
    localStorage.setItem("vh_merged_v1", Date.now().toString(36));
    const payload = { viewed: [], stamps: [], quiz: [] };
    try {
      const p = JSON.parse(localStorage.getItem("vh_progress_v1") || "null");
      if (p) {
        payload.viewed = (p.viewed || []).slice(0, 400).map((id) => ({ id, cat: null }));
        payload.quiz = (p.rounds || []).slice(0, 60);
      }
    } catch (e) {}
    try {
      const pp = JSON.parse(localStorage.getItem("vh_passport_v1") || "null");
      if (pp && pp.explored) payload.stamps = Object.keys(pp.explored).slice(0, 40);
    } catch (e) {}
    if (!payload.viewed.length && !payload.stamps.length && !payload.quiz.length) return;
    try {
      const r = await VH_API.post("/api/auth/merge", payload);
      console.info("[VIBHOR auth] merged local progress:", r.merged);
      if (r.merged && (r.merged.views || r.merged.stamps || r.merged.quiz)) {
        toast(tr("auth.toast.merged", "✦ Your device progress was added to your account!"));
      }
    } catch (e) {
      console.warn("[VIBHOR auth] merge failed:", e);
    }
  }

  async function submit(e) {
    e.preventDefault();
    error("");
    const email = qs("#vhaEmail", modal).value.trim();
    const password = qs("#vhaPass", modal).value;
    try {
      if (mode === "register") {
        const name = qs("#vhaName", modal).value.trim();
        const lang = qs("#vhaLang", modal).value;
        await VH_API.post("/api/auth/register", { name, email, password, lang });
        if (window.VIBHOR_I18N && lang !== VIBHOR_I18N.getLang()) VIBHOR_I18N.setLang(lang);
      } else {
        await VH_API.post("/api/auth/login", { email, password });
      }
      await VH_API.refresh();
      await mergeLocalProgress();
      await VH_API.refresh(); /* stats now include merged progress */
      close();
      toast(tr("auth.toast.welcome", "Namaste! 🙏 Welcome to VIBHOR."));
      const cb = afterLogin; afterLogin = null;
      if (typeof cb === "function") cb();
    } catch (err) {
      error(err.message || "Sign in failed — please try again.");
    }
  }

  function open(m, cb) {
    ensureModal();
    setMode(m || "login");
    afterLogin = typeof cb === "function" ? cb : null;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    setTimeout(() => { try { qs("#vhaEmail", modal).focus(); } catch (e) {} }, 120);
  }
  function close() {
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal && modal.classList.contains("open")) close(); });

  /* run fn when authenticated — otherwise open the sign-in modal first */
  function requireAuth(fn, reason) {
    if (VH_API.isLoggedIn()) { fn(); return true; }
    if (reason && window.HERITAGE && HERITAGE.toast) HERITAGE.toast(reason, "warn", 3200);
    open("login", fn);
    return false;
  }

  window.VIBHOR_AUTH = { open, close, requireAuth, modal: () => ensureModal() };

  /* pages can tag protected buttons: <button data-requires-auth> */
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-requires-auth]");
    if (!el) return;
    if (VH_API.isLoggedIn()) return;
    e.preventDefault();
    e.stopPropagation();
    open("login", () => el.click());
  }, true);
})();
