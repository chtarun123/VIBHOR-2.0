/* ============================================================
   VIBHOR — Debug Panel (developer tools only)
   Hidden from normal users. Activate developer mode by:
     • opening any page with  ?debug=1   (e.g. index.html?debug=1)
     • or pressing  Ctrl + Shift + D     (toggles, persists for
       the session via localStorage "vh_debug")
   Shows:
     • current language (UI + content layer)
     • voice diagnostics — browser, supported, voices loaded,
       voice count, currently selected voice, narration state
     • translation diagnostics — per-language status + issues
     • search diagnostics — index readiness + record counts
     • number of heritage records
   ⌘ button dumps the full snapshot to the console.
   ============================================================ */
(function () {
  "use strict";
  let btn = null, panel = null;

  function devMode() {
    try {
      if (localStorage.getItem("vh_debug") === "1") return true;
      const sp = new URLSearchParams(location.search);
      return sp.has("debug") || sp.has("dev");
    } catch (e) { return false; }
  }

  function row(label, value, state) {
    return `<div class="vhd-row">
      <span class="vhd-k">${label}</span>
      <span class="vhd-v ${state === "ok" ? "ok" : state === "bad" ? "bad" : ""}">${value}</span>
    </div>`;
  }
  const yn = (b) => (b ? "✅ TRUE" : "❌ FALSE");

  function voiceDiag() {
    const VV = window.VH_VOICE;
    if (!VV || !VV.status) {
      return {
        rows: [row("Voice engine", "not initialised", "bad")],
        raw: { engine: false }
      };
    }
    let v;
    try { v = VV.status(); } catch (e) { v = null; }
    if (!v) return { rows: [row("Voice engine", "status() failed", "bad")], raw: {} };
    const rows = [];
    rows.push(row("Engine", v.supported ? `initialised · ${v.browser}` : `not supported (${v.browser})`, v.supported ? "ok" : "bad"));
    rows.push(row("Voice loaded", yn(v.voicesLoaded), v.voicesLoaded ? "ok" : "bad"));
    rows.push(row("Voices available", `${v.voicesCount}`));
    rows.push(row("Selected voice", v.currentVoice || "—"));
    rows.push(row("Narration state", v.state || "idle"));
    rows.push(row("Narration lang", v.lang || "—"));
    return { rows, raw: v };
  }

  function translationDiag() {
    const VC = window.VH_CONTENT;
    if (!VC || !VC.report) return { rows: [row("Translations", "content layer missing", "bad")], raw: {} };
    let rep;
    try { rep = VC.report(); } catch (e) { return { rows: [row("Translations", "report() failed", "bad")], raw: {} }; }
    const rows = [];
    const per = rep.langs
      ? Object.keys(rep.langs).map((l) => {
          const st = rep.langs[l].status;
          return st === "ok" ? `${l}✓` : st === "source-of-truth" ? `${l}(src)` : `${l}⚠`;
        }).join(" ")
      : "—";
    const ok = rep.issues === 0;
    rows.push(row("Loaded", yn(true), "ok"));
    rows.push(row("Languages", per, ok ? "ok" : "bad"));
    if (rep.issues) rows.push(row("Issues", `${rep.issues} (press ⌘ for list)`, "bad"));
    return { rows, raw: rep };
  }

  function searchDiag() {
    const VS = window.VIBHOR_SEARCH;
    if (!VS || !VS.indexStatus) return { rows: [row("Search index", "not built", "bad")], raw: {} };
    let si;
    try { si = VS.indexStatus(); } catch (e) { return { rows: [row("Search index", "indexStatus() failed", "bad")], raw: {} }; }
    const rows = [];
    rows.push(row("Index ready", yn(si.ready), si.ready ? "ok" : "bad"));
    if (si.ready) rows.push(row("Records indexed", `${si.items} items · ${si.culture} KB · ${si.states} states · ${si.cats} cats`));
    return { rows, raw: si };
  }

  function collect() {
    const out = { lang: "—" };
    const VC = window.VH_CONTENT;
    const VI = window.VIBHOR_I18N;
    const D = window.HERITAGE;
    try { out.lang = (VC && VC.active()) || (VI && VI.getLang()) || "en"; } catch (e) {}
    const vd = voiceDiag(); out.voice = vd.raw;
    const td = translationDiag(); out.translations = td.raw;
    const sd = searchDiag(); out.search = sd.raw;
    if (D && D.items) {
      const culture = (VC && VC.cultureCount) ? (VC.cultureCount() || 0) : (window.VIBHOR_CULTURE ? VIBHOR_CULTURE.length : 0);
      out.records = `${D.items.length} curated stories + ${culture} knowledge-base entries`;
    }
    out._diag = { voice: vd.rows, translation: td.rows, search: sd.rows };
    return out;
  }

  function paint() {
    if (!panel) return;
    const d = collect();
    panel.innerHTML = `
      <div class="vhd-head">
        <b>VIBHOR debug <small>dev mode</small></b>
        <span class="vhd-actions">
          <button class="vhd-btn" data-a="refresh" title="Refresh">↻</button>
          <button class="vhd-btn" data-a="console" title="Dump to console">⌘</button>
          <button class="vhd-btn" data-a="close" title="Close">✕</button>
        </span>
      </div>
      <div class="vhd-body">
        ${row("Language", `<b>${d.lang}</b>`)}
        <div class="vhd-group">Voice diagnostics</div>
        ${d._diag.voice.join("")}
        <div class="vhd-group">Translation diagnostics</div>
        ${d._diag.translation.join("")}
        <div class="vhd-group">Search diagnostics</div>
        ${d._diag.search.join("")}
        <div class="vhd-group">Data</div>
        ${row("Heritage records", d.records || "—")}
      </div>
      <div class="vhd-foot">dev mode — Ctrl+Shift+D hides · ⌘ dumps snapshot</div>`;
    panel.querySelectorAll("[data-a]").forEach((b) =>
      b.addEventListener("click", () => {
        const a = b.dataset.a;
        if (a === "close") panel.classList.remove("open");
        if (a === "refresh") paint();
        if (a === "console") {
          const snap = collect();
          console.info("[VIBHOR debug] snapshot", snap);
          try {
            if (window.VH_CONTENT && VH_CONTENT.report) console.info("[VIBHOR debug] content report", VH_CONTENT.report());
            if (window.VIBHOR_SEARCH && VIBHOR_SEARCH.indexStatus) console.info("[VIBHOR debug] search index", VIBHOR_SEARCH.indexStatus());
            if (window.VH_VOICE && VH_VOICE.status) console.info("[VIBHOR debug] voice status", VH_VOICE.status());
          } catch (e) {}
        }
      })
    );
  }

  function ensureUI(open) {
    if (btn) return;
    btn = document.createElement("button");
    btn.id = "vhDebugBtn";
    btn.className = "vhd-btn-fab";
    btn.textContent = "🔧";
    btn.title = "VIBHOR debug panel (dev mode)";
    btn.setAttribute("aria-label", "Open debug panel");
    document.body.appendChild(btn);

    panel = document.createElement("div");
    panel.id = "vhDebugPanel";
    panel.className = "vhd-panel";
    document.body.appendChild(panel);

    btn.addEventListener("click", () => {
      const is = panel.classList.toggle("open");
      if (is) paint();
    });

    document.addEventListener("vh:langchange", () => {
      if (panel.classList.contains("open")) paint();
    });

    if (open) { panel.classList.add("open"); paint(); }
    console.info("[VIBHOR debug] dev mode active — panel available via the 🔧 button");
  }

  function boot() {
    if (!devMode()) {
      /* normal user: stay invisible; keyboard shortcut activates dev mode */
      document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.shiftKey && (e.key === "D" || e.key === "d")) {
          e.preventDefault();
          try { localStorage.setItem("vh_debug", "1"); } catch (err) {}
          ensureUI(true);
        }
      });
      return;
    }
    ensureUI(false);
  }

  document.addEventListener("DOMContentLoaded", boot);
  if (document.readyState !== "loading") boot();
})();
