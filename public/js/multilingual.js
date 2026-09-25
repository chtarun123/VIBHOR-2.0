/* ============================================================
   VIBHOR — Multilingual engine
   - 5 languages: en · hi · te · ta · bn
   - data-i18n="<key>"  → element text
   - data-i18n-ph       → placeholder attribute
   - data-i18n-title    → title attribute
   - Language switcher is injected into the navbar by
     script.js; this module owns state + live re-translation.
   - Add a language: put strings in js/translations.js
     (window.VIBHOR_I18N_DATA) + a VIBHOR_LANGS entry,
     and a font entry in FONTS below. That's it.
   ============================================================ */
(function () {
  "use strict";
  const LS = "vh_lang";
  const DATA = window.VIBHOR_I18N_DATA || {};
  const LANGS = window.VIBHOR_LANGS || [{ code: "en", name: "English" }];

  /* language-specific web fonts (loaded dynamically) */
  const FONTS = {
    hi: ["Noto Sans Devanagari", "https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&display=swap"],
    te: ["Noto Sans Telugu", "https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@400;600;700&display=swap"],
    ta: ["Noto Sans Tamil", "https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;600;700&display=swap"],
    bn: ["Noto Sans Bengali", "https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700&display=swap"]
  };

  let current = "en";
  try { current = localStorage.getItem(LS) || "en"; } catch (e) {}
  if (!DATA[current]) current = "en";

  function t(key) {
    return (DATA[current] && DATA[current][key]) || (DATA.en && DATA.en[key]) || key;
  }

  function apply(root) {
    const el = root || document;
    el.querySelectorAll("[data-i18n]").forEach((n) => { n.textContent = t(n.dataset.i18n); });
    el.querySelectorAll("[data-i18n-ph]").forEach((n) => { n.setAttribute("placeholder", t(n.dataset.i18nPh)); });
    el.querySelectorAll("[data-i18n-title]").forEach((n) => { n.setAttribute("title", t(n.dataset.i18nTitle)); });
  }

  const loadedFonts = new Set();
  function loadFont(code) {
    const f = FONTS[code];
    if (!f) { document.body.style.fontFamily = ""; document.documentElement.removeAttribute("data-script-font"); return; }
    if (typeof loadedFonts === "undefined") return;
    /* load EVERY language's font the first time it is picked —
       the old check only ever loaded the first non-English font */
    if (!loadedFonts.has(code) && !document.querySelector(`link[data-vh-font="${code}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.setAttribute("data-vh-font", code);
      link.href = f[1];
      document.head.appendChild(link);
      loadedFonts.add(code);
    }
    document.body.style.fontFamily = `"${f[0]}", var(--font-body)`;
    /* headings keep the serif display face; body/UI use the script font */
    document.documentElement.setAttribute("data-script-font", f[0]);
  }

  function setLang(code) {
    if (!DATA[code]) return;
    current = code;
    try { localStorage.setItem(LS, code); } catch (e) {}
    loadFont(code);
    apply(document);
    /* sync the heritage CONTENT layer (items/timelines/culture/features) */
    if (window.VH_CONTENT) {
      window.VH_CONTENT.setLang(code);
      console.info(`[VIBHOR] language → ${code} · content layer + UI labels synced · ${window.VH_CONTENT.active()} active`);
    }
    /* let page scripts re-render their dynamic strings */
    document.dispatchEvent(new CustomEvent("vh:langchange", { detail: { lang: code } }));
  }

  window.VIBHOR_I18N = {
    getLang: () => current,
    setLang,
    t,
    apply,
    LANGS
  };

  document.addEventListener("DOMContentLoaded", () => {
    loadFont(current);
    apply(document);
    /* ensure content layer starts on the saved language (not just "en") */
    if (window.VH_CONTENT && window.VH_CONTENT.active() !== current) {
      window.VH_CONTENT.setLang(current);
      console.info(`[VIBHOR] initial language → ${current} · content layer synced on load`);
    }
  });
})();
