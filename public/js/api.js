/* ============================================================
   VIBHOR — API client
   One tiny wrapper around fetch():
     VH_API.get/post/upload(url, …)
     VH_API.me() · refresh() · logout()
   Sessions are server-side (httpOnly cookie); the client keeps
   only a NON-SENSITIVE mirror (name/points/badges) for instant
   paint between page loads. The DB is the source of truth.
   ============================================================ */
(function () {
  "use strict";
  const CACHE_KEY = "vh_session_cache_v1";

  async function req(method, url, body, isForm) {
    const opts = { method, credentials: "same-origin", headers: {} };
    if (body && !isForm) {
      opts.headers["Content-Type"] = "application/json";
      opts.body = JSON.stringify(body);
    } else if (isForm) {
      opts.body = body; /* browser sets multipart boundary */
    }
    let res;
    try {
      res = await fetch(url, opts);
    } catch (e) {
      throw { status: 0, error: "OFFLINE", message: "Cannot reach the VIBHOR server — is it running on :5000?" };
    }
    let data = null;
    try { data = await res.json(); } catch (e) { /* non-JSON */ }
    if (!res.ok) {
      const err = (data && data.error) || "HTTP_" + res.status;
      const msg = (data && data.message) || "Something went wrong.";
      throw { status: res.status, error: err, message: msg };
    }
    return data;
  }

  function cachedSession() {
    try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "null"); }
    catch (e) { return null; }
  }
  function writeCache(s) {
    try {
      if (!s) localStorage.removeItem(CACHE_KEY);
      else localStorage.setItem(CACHE_KEY, JSON.stringify({
        authenticated: !!s.authenticated,
        guest: !!s.guest,
        user: s.user || null,
        stats: s.stats || null,
        at: Date.now()
      }));
    } catch (e) {}
  }
  function broadcast() {
    try { document.dispatchEvent(new CustomEvent("vh:auth-change", { detail: cachedSession() })); } catch (e) {}
  }

  let inflight = null;
  async function refresh() {
    if (!inflight) {
      inflight = req("GET", "/api/auth/me")
        .then((s) => { writeCache(s); broadcast(); return s; })
        .catch(() => { writeCache({ authenticated: false, guest: false }); return cachedSession(); })
        .finally(() => { inflight = null; });
    }
    return inflight;
  }

  const API = (window.VH_API = {
    get: (url) => req("GET", url),
    post: (url, body) => req("POST", url, body || {}),
    upload: (url, formData) => req("POST", url, formData, true),
    del: (url) => req("DELETE", url),

    me: () => cachedSession() || { authenticated: false, guest: false },
    isLoggedIn: () => !!(cachedSession() && cachedSession().authenticated),
    refresh,
    broadcast,

    logout: async () => {
      try { await req("POST", "/api/auth/logout"); } catch (e) {}
      writeCache({ authenticated: false, guest: false });
      broadcast();
    }
  });

  /* hydrate the session mirror early on every page */
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", refresh);
  else refresh();
})();
