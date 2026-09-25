/* ============================================================
   VIBHOR — Multilingual CONTENT layer (the real fix)
   ------------------------------------------------------------
   Translates ALL heritage content — not just UI labels:
   item names/descriptions/history/features/importance,
   timelines, the 256-entry cultural knowledge base,
   state/category/region names, challenge copy, journey copy
   and chatbot response templates.

   Structure (one file per language, see js/content-*.js):
     window.VH_CONTENT_REGISTER("hi", {
       items:    { "<id>": { n, d, h, f:[3], i } },
       timelines:{ "<id>": [ {y, t}, … ] },
       culture:  [ { n, d }, … 256 in heritage-data.json order ],
       features: { cats:{}, regions:{}, states:{}, ch:{}, journey:{}, chat:{}, search:{}, voice:{}, misc:{} }
     });

   - English is the single source of truth (built live from the
     existing data files — nothing is duplicated).
   - VH_CONTENT.item(id) / .timeline(id) / .culture(i) /
     .feat("ch.photo.desc") / .state(name) / .cat(name) /
     .regionName(key) always return the ACTIVE language with
     automatic English fallback per field.
   - VALIDATION: on load every language file is cross-checked
     against the English source (ids, field counts, culture
     length, undefined values). Issues are logged to console
     and exposed via VH_CONTENT.report() for the debug panel.
   - CONSOLE LOGS: every language change + load is logged so
     you can verify behaviour in DevTools.
   ============================================================ */
(function () {
  "use strict";
  const D = window.HERITAGE;
  const LANGS = ["en", "hi", "te", "ta", "bn"];
  const TAGS = { en: "en-IN", hi: "hi-IN", te: "te-IN", ta: "ta-IN", bn: "bn-IN" };

  /* ---------------- English baseline (from existing data) ---------------- */
  const en = {
    items: {},
    timelines: {},
    culture: [],          // filled when heritage-data.json loads
    features: {
      cats: {}, regions: {}, states: {}, ch: {}, journey: {}, chat: {}, search: {}, voice: {}, misc: {}
    }
  };
  D.categories.forEach((c) => (en.features.cats[c.id] = c.name));
  Object.values(D.regions).forEach((r) => (en.features.regions[r.key] = r.name));
  const stateSet = {};
  D.items.forEach((i) => { stateSet[i.state] = 1; });
  Object.keys(stateSet).forEach((s) => (en.features.states[s] = s));

  /* English items & timelines = live data (source of truth, never duplicated) */
  D.items.forEach((i) => {
    en.items[i.id] = { n: i.name, d: i.desc, h: i.hist, f: i.feat, i: i.imp };
  });
  Object.assign(en.timelines, window.VH_TIMELINES || {});

  /* ---------------- registered translations ---------------- */
  const data = { en };
  window.VH_CONTENT_REGISTER = (lang, obj) => {
    if (!LANGS.includes(lang)) { console.warn("[VIBHOR i18n] unknown language:", lang); return; }
    data[lang] = obj;
    console.info(`[VIBHOR i18n] registered "${lang}": ${obj.items ? Object.keys(obj.items).length : 0} items, ${obj.timelines ? Object.keys(obj.timelines).length : 0} timelines, ${obj.culture ? obj.culture.length : 0} culture entries, ${obj.features ? Object.keys(obj.features).length : 0} feature groups`);
  };

  let activeLang = "en";
  try { activeLang = localStorage.getItem("vh_lang") || "en"; } catch (e) {}
  if (!data[activeLang]) activeLang = "en";

  /* ---------------- English fallback helpers ---------------- */
  function pick(obj, key, fallback) {
    const v = obj ? obj[key] : undefined;
    return (v === undefined || v === null || v === "") ? fallback : v;
  }
  function itemEn(id) { return en.items[id] || null; }
  function itemLoc(id, lang) {
    const l = (data[lang] && data[lang].items && data[lang].items[id]) || null;
    const e = itemEn(id);
    if (!e) return null;
    return {
      n: pick(l, "n", e.n),
      d: pick(l, "d", e.d),
      h: pick(l, "h", e.h),
      f: Array.isArray(l && l.f) && l.f.length === e.f.length ? l.f : e.f,
      i: pick(l, "i", e.i)
    };
  }
  function timelineLoc(id, lang) {
    const l = data[lang] && data[lang].timelines && data[lang].timelines[id];
    const e = en.timelines[id];
    if (Array.isArray(l) && l.length && e && l.length === e.length) return l;
    return e || null;
  }
  function cultureEn(i) { return en.culture[i] || null; }
  function cultureLoc(i, lang) {
    const l = data[lang] && data[lang].culture && data[lang].culture[i];
    const e = cultureEn(i);
    if (!e) return null;
    return { n: pick(l, "n", e.n), d: pick(l, "d", e.d) };
  }
  function featLoc(group, key, lang) {
    const l = data[lang] && data[lang].features && data[lang].features[group];
    const e = en.features[group];
    return pick(l, key, pick(e, key, undefined));
  }

  /* ---------------- public API ---------------- */
  const C = (window.VH_CONTENT = {
    LANGS,
    TAGS,
    active: () => activeLang,
    tag: (lang) => TAGS[lang] || TAGS.en,
    isLoaded: (lang) => !!data[lang] && lang !== "en",

    setLang: (lang) => {
      if (!data[lang]) lang = "en";
      const prev = activeLang;
      activeLang = lang;
      if (prev !== lang) {
        console.info(`[VIBHOR i18n] language changed ${prev} → ${lang} · content layer active · fallback=English`);
      }
      return activeLang;
    },

    item: (id) => itemLoc(id, activeLang),
    itemAll: (id) => ({ en: itemLoc(id, "en") }),
    name: (id) => { const r = itemLoc(id, activeLang); return r ? r.n : null; },
    timeline: (id) => timelineLoc(id, activeLang),
    culture: (i) => cultureLoc(i, activeLang),

    /* every registered language at once — smart search indexes all of them,
       so a Hindi/Telugu/Tamil/Bengali query still finds English-indexed records */
    itemAllLangs: (id) => { const out = {}; LANGS.forEach((l) => { const r = itemLoc(id, l); if (r) out[l] = r; }); return out; },
    cultureAllLangs: (i) => { const out = {}; LANGS.forEach((l) => { const r = cultureLoc(i, l); if (r) out[l] = r; }); return out; },
    stateAllLangs: (name) => { const out = {}; LANGS.forEach((l) => { const r = featLoc("states", name, l); if (r) out[l] = r; }); return out; },
    catAllLangs: (id) => { const out = {}; LANGS.forEach((l) => { const r = featLoc("cats", id, l); if (r) out[l] = r; }); return out; },
    cultureCount: () => en.culture.length,

    /* feature strings: feat("ch","photo.desc") or featPath "ch.photo.desc" */
    feat: (a, b) => {
      if (typeof a === "string" && b === undefined) {
        const p = a.split(".");
        let v = null;
        for (const lang of [activeLang, "en"]) {
          let cur = data[lang].features;
          let ok = true;
          for (const k of p) {
            if (cur && cur[k] !== undefined && cur[k] !== null) { cur = cur[k]; } else { ok = false; break; }
          }
          if (ok) { v = cur; break; }
        }
        if (v === undefined) console.warn(`[VIBHOR i18n] missing feature string: ${a}`);
        return v;
      }
      return featLoc(a, b, activeLang);
    },

    state: (name) => featLoc("states", name, activeLang),
    cat: (id) => featLoc("cats", id, activeLang),
    regionName: (key) => featLoc("regions", key, activeLang),

    /* attach culture data once heritage-data.json resolves */
    setCulture: (list) => {
      en.culture = (list || []).map((e) => ({ n: e.name, d: e.desc, state: e.state, type: e.type, unesco: !!e.unesco }));
      console.info(`[VIBHOR i18n] culture baseline loaded: ${en.culture.length} entries (English source of truth)`);
      validate();
    },

    /* ---------------- validation + report (debug panel) ---------------- */
    report: () => {
      const rep = {
        langs: {},
        itemsTotal: D.items.length,
        cultureTotal: en.culture.length || null,
        timelinesTotal: Object.keys(en.timelines).length,
        issues: 0
      };
      for (const lang of LANGS) {
        if (lang === "en") { rep.langs[lang] = { status: "source-of-truth", issues: 0 }; continue; }
        const d = data[lang];
        const issues = [];
        if (!d) { issues.push("language file missing"); rep.langs[lang] = { status: "missing", issues }; rep.issues += 1; continue; }
        const ids = Object.keys(d.items || {});
        D.items.forEach((i) => {
          const it = (d.items || {})[i.id];
          if (!it) { issues.push("missing item: " + i.id); return; }
          ["n", "d", "h", "i"].forEach((k) => { if (it[k] === undefined || it[k] === null || it[k] === "") issues.push(`${i.id}.${k} empty`); });
          if (!Array.isArray(it.f) || it.f.length !== 3 || it.f.some((x) => !x)) issues.push(`${i.id}.f bad`);
        });
        ids.forEach((id) => { if (!D.items.find((i) => i.id === id)) issues.push("unknown item id: " + id); });
        if (d.timelines) Object.keys(d.timelines).forEach((id) => {
          if (!en.timelines[id]) issues.push("unknown timeline id: " + id);
          else if (!Array.isArray(d.timelines[id]) || d.timelines[id].length !== en.timelines[id].length) issues.push(`timeline ${id} node-count mismatch`);
          else d.timelines[id].forEach((nd, j) => { if (!nd.t) issues.push(`timeline ${id}[${j}].t empty`); });
        });
        if (en.culture.length && d.culture) {
          if (d.culture.length !== en.culture.length) issues.push(`culture length ${d.culture.length} ≠ ${en.culture.length}`);
          else d.culture.forEach((c, i) => { if (!c.n || !c.d) issues.push(`culture[${i}] field empty`); });
        }
        rep.langs[lang] = { status: issues.length ? "issues" : "ok", issues: issues.slice(0, 30), count: issues.length };
        rep.issues += issues.length;
        if (issues.length) console.warn(`[VIBHOR i18n] validation "${lang}": ${issues.length} issue(s)`, issues.slice(0, 10));
      }
      return rep;
    }
  });

  /* ---------------- validation on load ---------------- */
  function validate() {
    const rep = C.report();
    console.info(`[VIBHOR i18n] validation complete — ${rep.issues ? rep.issues + " issue(s)" : "all clean"} · ${rep.itemsTotal} items · ${rep.cultureTotal || "culture loading…"} culture · ${rep.timelinesTotal} timelines`);
  }
  setTimeout(validate, 400);

  /* culture baseline: share the fetch with search.js via a cached promise */
  if (!window.VH_CULTURE_PROMISE) {
    window.VH_CULTURE_PROMISE = fetch("data/heritage-data.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => { C.setCulture(list); return list; })
      .catch((e) => { console.warn("[VIBHOR i18n] cultural knowledge base unavailable (offline/file://) — search will cover the 120 curated stories only", e); return []; });
  }
})();
