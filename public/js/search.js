/* ============================================================
   VIBHOR — Global Smart Search
   - indexes: 120 curated items + cultural knowledge base +
     states + categories
   - natural-language parsing: "famous temples in Tamil Nadu",
     "traditional food of Bihar", "festivals in Assam",
     "UNESCO sites in India"
   - live suggestions while typing
   - voice search (Web Speech API) with graceful fallback
   - results overlay with category filter chips
   Entry points: hero search bar (home) + nav search icon
   ============================================================ */
(function () {
  "use strict";
  const qs = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const D = window.HERITAGE;
  const S = { items: [], culture: [], states: [], cats: [], ready: false, overlay: null };

  /* ---------- type vocabulary (maps words → type buckets) ---------- */
  const TYPE_WORDS = {
    temple: ["temple", "temples", "mandir", "mooval", "gudi"],
    monument: ["monument", "monuments", "stupa", "ruins", "heritage site", "unesco"],
    fort: ["fort", "forts", "citadel", "garhi"],
    museum: ["museum", "museums"],
    food: ["food", "foods", "dish", "cuisine", "khaana", "khaan", "sweet"],
    festival: ["festival", "festivals", "utsav", "melam", "mela"],
    dance: ["dance", "dances", "naartan", "nritya"],
    music: ["music", "sangeet", "song", "sufi"],
    craft: ["craft", "crafts", "handicraft", "art", "painting", "embroidery"],
    textile: ["textile", "textiles", "sari", "saree", "fabric"],
    practice: ["practice", "martial", "yoga"],
    attraction: ["attraction", "attractions", "place", "places", "tourist"]
  };
  const TYPE_ICONS = { temple: "🛕", monument: "🏛️", fort: "🏰", museum: "🏺", food: "🍛", festival: "🪔", dance: "💃", music: "🎶", craft: "🧵", textile: "🧣", practice: "🥋", attraction: "📍" };
  const CAT_TO_TYPES = { temples: ["temple"], monuments: ["monument", "fort", "museum"], forts: ["fort"], historical: ["monument"], festivals: ["festival"], foods: ["food"], dances: ["dance"], music: ["music"], crafts: ["craft", "textile"], textiles: ["textile"], gardens: ["attraction"] };

  /* localized type words — queries work in hi/te/ta/bn as well as English */
  const TYPE_WORDS_LOCALE = {
    temple: ["मंदिर", "मंदिरों", "दालन", "దేవాలయం", "దేవాలయాల", "దేవాలయాలు", "మందిరం", "మందిరాలు", "மண்டபம்", "மண்டபங்கள்", "மடம்", "மந்திரம்", "মন্দির", "মন্দিরগুলো", "মন্দিরসমূহ"],
    monument: ["स्मारक", "స్మారకం", "சின்னம்", "சின்னங்கள்", "স্মারক"],
    fort: ["किला", "కోట", "கோட்டை", "দুর্গ"],
    food: ["खाना", "ఆహారం", "உணவு", "খাবার", "রান্না"],
    festival: ["त्योहार", "పర్వం", "விழா", "விழாக்கள்", "উৎসব", "উৎসবগুলো"],
    dance: ["नृत्य", "నృత్యం", "நடனம்", "নৃত্য"],
    music: ["संगीत", "సంగీతం", "இசை", "সংগীত"],
    craft: ["शिल्प", "కళ", "கைவினை", "কলা"],
    textile: ["વस्त्र", "వస్త్రం", "புடவை", "পোশাক"],
    attraction: ["आकर्षण", "ఆకర్షణ", "ஈர்ப்பு", "আকর্ষণ"]
  };

  const REGION_WORDS = { north: "north", south: "south", east: "east", west: "west" };
  const REGION_WORDS_LOCALE = {
    north: ["उत्तर", "ఉత్తర", "வடக்கு", "উত্তর"],
    south: ["दक्षिण", "దక్షిణ", "தெற்கு", "দক্ষিণ"],
    east: ["पूर्व", "పుర్వ", "கிழக்கு", "পূর্ব"],
    west: ["पश्चिम", "పశ్చిమ", "மேற்கு", "পশ্চিম"]
  };

  /* extra non-English stopwords so localized queries parse cleanly */
  const STOP_EXTRA = new Set([
    "के", "में", "और", "का", "की", "से", "hain",
    "లో", "కా", "మరియు", "నా",
    "இல்", "ஆன", "மற்றும்",
    "এ", "এর", "থেকে", "এবং", "আর", "কে", "কি",
    "भारत", "भारतের", "ભારત", "భారత", "భారతదేశ", "இந்திய", "இந்தியா", "ভারত", "भारतीय", "yuni", "यूनेस्को", "యునెస్కో", "யூனெஸ்கோ", "ইউনেস্কো",
    "पारंपरिक", "संಪ्रदायिक", "సాంప్రదాయ", "సాంప్రదాయక", "பாரம்பரிய", "ঐতিহ্যবাহী", "ঐতিহ্যবহুল"
  ]);

  /* content layer (may load after this module — guard everywhere) */
  const VC = () => window.VH_CONTENT || null;
  function locName(id, fallback) { try { const v = VC() && VC().name(id); return v || fallback; } catch (e) { return fallback; } }
  function locItemAll(id) { try { return (VC() && VC().item(id)) || null; } catch (e) { return null; } }
  function locState(name) { try { return (VC() && VC().state(name)) || name; } catch (e) { return name; } }
  function locCat(id) { try { return (VC() && VC().cat(id)) || id; } catch (e) { return id; } }
  function feat(key, fallback) { try { const v = VC() && VC().feat(key); return v || fallback; } catch (e) { return fallback; } }

  /* collect the same string in every loaded language → one searchable blob */
  function multiText(parts) {
    return parts.filter(Boolean).join(" ").toLowerCase();
  }

  function buildIndex() {
    /* curated 120 items — indexed in ALL languages so queries in any
       script (e.g. "तमिलनाडु के मंदिर") find English-indexed records */
    S.items = D.items.map((i) => {
      const parts = [i.name, i.desc, i.state, i.city, i.hist];
      const all = VC() && VC().itemAllLangs ? VC().itemAllLangs(i.id) : {};
      Object.keys(all).forEach((l) => parts.push(all[l].n, all[l].d, all[l].h));
      const st = VC() && VC().stateAllLangs ? VC().stateAllLangs(i.state) : {};
      Object.keys(st).forEach((l) => parts.push(st[l]));
      return {
        kind: "item", id: i.id, name: i.name, state: i.state, region: i.region,
        cats: [i.cat], types: (CAT_TO_TYPES[i.cat] || ["attraction"]), unesco: false,
        text: multiText(parts)
      };
    });
    /* states as search targets — all 28 states + 8 UTs, English + every localized name.
       Names come from the state KB (data-states.js) with a content-layer fallback. */
    const KB = window.HERITAGE_STATES || [];
    const stSeen = {};
    S.states = KB.map((st) => {
      const names = [];
      const push = (v) => { if (v && !names.includes(v)) names.push(v); };
      push(st.name);
      ["hi", "te", "ta", "bn"].forEach((l) => push(st.t && st.t[l] && st.t[l].name));
      const all = VC() && VC().stateAllLangs ? VC().stateAllLangs(st.name) : {};
      Object.keys(all).forEach((l) => push(all[l]));
      stSeen[st.name] = 1;
      return { kind: "state", name: st.name, region: st.region, text: multiText(names) };
    });
    /* any item-state not in the KB (safety) */
    D.items.forEach((i) => {
      if (stSeen[i.state]) return;
      const all = VC() && VC().stateAllLangs ? VC().stateAllLangs(i.state) : {};
      S.states.push({ kind: "state", name: i.state, region: (D.stateRegion || {})[i.state] || "", text: multiText([i.state].concat(Object.keys(all).map((l) => all[l]))) });
    });
    /* categories — English + every localized name */
    S.cats = D.categories.map((c) => {
      const all = VC() && VC().catAllLangs ? VC().catAllLangs(c.id) : {};
      return { kind: "cat", id: c.id, name: c.name, types: CAT_TO_TYPES[c.id] || [], text: multiText([c.name].concat(Object.keys(all).map((l) => all[l]))) };
    });
    /* cultural knowledge base (fetched) — shared promise so the culture
       baseline in VH_CONTENT is set before localized names are read */
    const culturePromise = window.VH_CULTURE_PROMISE ||
      fetch("data/heritage-data.json").then((r) => (r.ok ? r.json() : [])).catch(() => []);
    culturePromise.then((list) => {
      S.culture = (list || []).map((e, idx) => {
        const parts = [e.name, e.desc, e.state, (e.tags || []).join(" ")];
        const all = VC() && VC().cultureAllLangs ? VC().cultureAllLangs(idx) : {};
        Object.keys(all).forEach((l) => parts.push(all[l].n, all[l].d));
        const st = VC() && VC().stateAllLangs ? VC().stateAllLangs(e.state) : {};
        Object.keys(st).forEach((l) => parts.push(st[l]));
        return {
          kind: "culture", idx, name: e.name, state: e.state, region: e.region,
          type: e.type, unesco: !!e.unesco, tags: e.tags || [], desc: e.desc || "",
          text: multiText(parts)
        };
      });
      window.VIBHOR_CULTURE = S.culture; /* shared with chatbot & leaderboard */
      S.ready = true;
      console.info(`[VIBHOR search] index ready — ${S.items.length} items + ${S.culture.length} KB entries + ${S.states.length} states (${S.cats.length} categories) · multilingual`);
    });
  }

  /* ---------- natural-language query parser ---------- */
  function parseQuery(raw) {
    const q = " " + String(raw || "").toLowerCase().replace(/[?!.,]/g, " ") + " ";
    const parsed = { state: "", region: "", unesco: false, types: [], terms: [] };
    /* state names — English + every localized name (longest first),
       so "तमिलनाडु के मंदिर" / "తమిళనాడులో దేవాలయాలు" both resolve state=Tamil Nadu */
    const stateNames = []; /* { cand: any-language spelling, en: canonical state } */
    S.states.forEach((s) => {
      const all = VC() && VC().stateAllLangs ? VC().stateAllLangs(s.name) : {};
      const cands = [s.name].concat(Object.keys(all).map((l) => all[l]));
      const kb = window.HERITAGE_STATES && HERITAGE_STATES.get ? HERITAGE_STATES.get(s.name) : null;
      if (kb) ["hi", "te", "ta", "bn"].forEach((l) => { const nm = kb.t && kb.t[l] && kb.t[l].name; if (nm) cands.push(nm); });
      cands.forEach((cand) => { if (cand) stateNames.push({ cand, en: s.name }); });
    });
    stateNames.sort((a, b) => b.cand.length - a.cand.length);
    const tokens = q.trim().split(/\s+/);
    for (const { cand, en } of stateNames) {
      const c = cand.toLowerCase();
      /* whole-string (multi-word "tamil nadu"), exact token OR joined-suffix
         forms: "తమిళనాడులో", "তামিলনাড়ুর", "তমিলনাডুকে" */
      const hit = q.includes(" " + c + " ") || tokens.some((t) => t === c || t.startsWith(c));
      if (hit) { parsed.state = en; break; }
    }
    /* fuzzy pass — transliteration drift ("তমিলনাডু" vs "তামিলনাড়ু") */
    if (!parsed.state) {
      const charOverlap = (a, b) => {
        const cnt = (str) => { const m = {}; [...str].forEach((ch) => { m[ch] = (m[ch] || 0) + 1; }); return m; };
        const A = cnt(a); const B = cnt(b); let inter = 0;
        for (const ch in A) inter += Math.min(A[ch], B[ch] || 0);
        return inter / Math.min(a.length, b.length);
      };
      let bestR = 0.75; let bestEn = "";
      for (const { cand, en } of stateNames) {
        const c = cand.toLowerCase();
        for (const t of tokens) {
          if (Math.min(t.length, c.length) < 6) continue;
          const r = charOverlap(t, c);
          if (r > bestR) { bestR = r; bestEn = en; }
        }
      }
      if (bestEn) parsed.state = bestEn;
    }
    /* regions — English + localized */
    for (const w in REGION_WORDS) {
      const loc = REGION_WORDS_LOCALE[w] || [];
      if (q.includes(" " + w + " ") || q.includes(w + " india") || loc.some((x) => q.includes(x))) parsed.region = REGION_WORDS[w];
    }
    /* unesco (also "యునెస్కో" style spellings) */
    if (q.includes("unesco") || q.includes("यूनेस्को") || q.includes("యునెస్కో") || q.includes("UNESCO")) parsed.unesco = true;
    /* type words — English + localized */
    for (const t in TYPE_WORDS) {
      const words = TYPE_WORDS[t].concat(TYPE_WORDS_LOCALE[t] || []);
      for (const w of words) if (q.includes(w)) { parsed.types.push(t); break; }
    }
    /* remaining meaningful terms — type words, state words & stopwords excluded */
    const typeWords = new Set(Object.values(TYPE_WORDS).flat().concat(Object.values(TYPE_WORDS_LOCALE).flat()));
    const stop = new Set(["in", "of", "the", "a", "an", "and", "famous", "traditional", "best", "site", "sites", "places", "place", "india", "show", "list", "unesco", "unesco's"]);
    typeWords.forEach((w) => { stop.add(w); stop.add(w + "s"); if (w.endsWith("s")) stop.add(w.slice(0, -1)); });
    stateNames.forEach(({ cand }) => stop.add(cand.toLowerCase()));
    STOP_EXTRA.forEach((w) => stop.add(w));
    parsed.terms = String(raw || "").toLowerCase().split(/\s+/).filter((w) =>
      w.length > 2 && !stop.has(w) &&
      !stateNames.some(({ cand }) => w.startsWith(cand.toLowerCase())) /* "বিহারের", "తమిళనాడులో" are state words */
    );
    return parsed;
  }

  /* ---------- scoring / matching ---------- */
  function scoreEntry(entry, p) {
    let s = 0;
    if (p.state && entry.state !== p.state) return 0;
    if (p.region && entry.region && entry.region !== p.region) return 0;
    if (p.unesco && !entry.unesco) return 0;
    if (p.types.length && !entry.types && !entry.type) return 0;
    if (p.types.length && entry.types && !p.types.some((t) => entry.types.includes(t))) return 0;
    if (p.types.length && entry.type && !p.types.includes(entry.type) && !(entry.type === "temple" && p.types.includes("temple"))) return 0;
    /* term match */
    for (const term of p.terms) {
      if (entry.name.toLowerCase().includes(term)) s += 5;
      else if (entry.text.includes(term)) s += 2;
      else if (p.terms.length > 1) return 0; /* AND semantics for multi-term */
    }
    /* type filter passed → base score (e.g. “UNESCO sites in India”) */
    if (p.types.length && ((entry.types && p.types.some((t) => entry.types.includes(t))) || (entry.type && p.types.includes(entry.type)))) s += 3;
    if (!p.terms.length && !p.types.length && !p.unesco) s += 1; /* bare state/region listing */
    if (entry.name.toLowerCase().startsWith((p.terms[0] || "\u0000"))) s += 4;
    return s;
  }

  function search(raw) {
    S.lastQuery = raw;
    const p = parseQuery(raw);
    const out = [];
    const all = [...S.items, ...S.culture, ...S.states, ...S.cats];
    for (const e of all) {
      const sc = scoreEntry(e, p);
      if (sc > 0) out.push({ e, sc });
    }
    out.sort((a, b) => b.sc - a.sc || (a.e.kind === "item" ? -1 : 1));
    return { results: out.map((x) => x.e), parsed: p };
  }

  /* ---------- overlay UI ---------- */
  function ensureOverlay() {
    if (S.overlay) return S.overlay;
    const ov = document.createElement("div");
    ov.id = "vhSearchOverlay";
    ov.className = "vh-so";
    ov.innerHTML = `
      <div class="vh-so-box">
        <button class="vh-so-close" aria-label="Close search">✕</button>
        <div class="vh-so-row">
          <span class="vh-so-ico" aria-hidden="true">🔍</span>
          <input class="vh-so-input" type="text" autocomplete="off" spellcheck="false" aria-label="Search India's heritage">
          <button class="vh-so-mic" id="vhMicBtn" aria-label="Voice search" title="Voice search">🎤</button>
        </div>
        <div class="vh-so-hint" id="vhSoHint"></div>
        <div class="vh-so-body" id="vhSoBody"></div>
      </div>`;
    document.body.appendChild(ov);
    qs(".vh-so-close", ov).addEventListener("click", close);
    const input = qs(".vh-so-input", ov);
    input.addEventListener("input", () => { S.activeSug = 0; renderSuggestions(input.value); });
    input.addEventListener("keydown", (e) => {
      const sugs = Array.from(sugBody().querySelectorAll(".vh-so-sug, .vh-so-all"));
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const items = sugBody().querySelectorAll(".vh-so-sug");
        if (!items.length) return;
        S.activeSug = S.activeSug === undefined ? 0 : S.activeSug;
        S.activeSug = e.key === "ArrowDown" ? (S.activeSug + 1) % items.length : (S.activeSug - 1 + items.length) % items.length;
        items.forEach((el, i) => el.classList.toggle("active", i === S.activeSug));
        const act = items[S.activeSug];
        if (act && act.scrollIntoView) act.scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter") {
        const items = sugBody().querySelectorAll(".vh-so-sug");
        if (items.length && S.activeSug !== undefined && items[S.activeSug] && items[S.activeSug].classList.contains("active")) {
          e.preventDefault();
          location.href = items[S.activeSug].getAttribute("href");
        } else if (input.value.trim().length >= 2) {
          renderResults(input.value);
        } else {
          const first = items[0];
          if (first) location.href = first.getAttribute("href");
        }
      }
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    S.overlay = ov;
    attachMics();
    return ov;
  }

  function open(prequery) {
    ensureOverlay();
    S.overlay.classList.add("open");
    /* a PANEL below the navbar — the page stays scrollable and the
       panel never covers the hero stats, CTAs or the AI Guide FAB */
    const input = qs(".vh-so-input", S.overlay);
    const ph = placeholder();
    input.placeholder = ph;
    input.setAttribute("aria-label", ph);
    input.value = prequery || "";
    qs("#vhSoBody", S.overlay).innerHTML = prequery ? "" : `<div class="vh-so-ideas">${ideasHTML()}</div>`;
    if (prequery && prequery.trim().length >= 2) renderResults(prequery);
    setTimeout(() => input.focus(), 60);
  }
  function close() {
    if (!S.overlay) return;
    S.overlay.classList.remove("open");
  }
  /* click anywhere outside the panel closes it (no backdrop needed) */
  document.addEventListener("pointerdown", (e) => {
    if (!S.overlay || !S.overlay.classList.contains("open")) return;
    if (S.overlay.contains(e.target)) return;
    if (e.target.closest && (e.target.closest("#vhNavSearch") || e.target.closest("#heroSearch"))) return;
    close();
  }, true);

  function entryLink(e) {
    if (e.kind === "item") return "detail.html?id=" + e.id;
    if (e.kind === "state") return "region.html?state=" + encodeURIComponent(e.name);
    if (e.kind === "cat") return "region.html?c=" + e.id;
    return "region.html?state=" + encodeURIComponent(e.state); /* culture entry → its state */
  }
  function entryIcon(e) {
    if (e.kind === "state") return "🗺️";
    if (e.kind === "cat") return "🏷️";
    return TYPE_ICONS[e.type] || (e.types && TYPE_ICONS[e.types[0]]) || "📍";
  }
  /* result names shown in the ACTIVE language (fallback English) */
  function dispName(e) {
    if (e.kind === "item") return locName(e.id, e.name);
    if (e.kind === "state") return locState(e.name);
    if (e.kind === "cat") return locCat(e.id);
    try { const c = VC() && VC().culture(e.idx); if (c && c.n) return c.n; } catch (err) {}
    return e.name;
  }
  function dispDesc(e) {
    if (e.kind === "culture") { try { const c = VC() && VC().culture(e.idx); if (c && c.d) return c.d; } catch (err) {} return e.desc || ""; }
    return "";
  }
  function entryMeta(e) {
    if (e.kind === "state") return "🗺️";
    if (e.kind === "cat") return "🏷️";
    return esc(locState(e.state)) + (e.unesco ? " · UNESCO" : "");
  }
  /* “in Tamil Nadu” — word order follows the active language */
  function inState(stateEn) {
    const lang = (VC() && VC().active()) || "en";
    const inWord = feat("misc.inWord", "in");
    return lang === "en" ? inWord + " " + locState(stateEn) : locState(stateEn) + " " + inWord;
  }
  function ideasHTML() {
    const ideas = feat("search.ideas", ["🛕 temples in Tamil Nadu", "🍛 traditional food of Bihar", "🪔 festivals in Assam", "💃 dances of Northeast India", "🏛️ UNESCO sites in India"]);
    const arr = Array.isArray(ideas) ? ideas : [];
    return arr.map((x) => `<span class="vh-so-idea">${x}</span>`).join("");
  }
  const PH_DEFAULT = "Search temples, food, festivals, states… try “temples in Tamil Nadu”";
  function placeholder() { return feat("search.placeholder", PH_DEFAULT); }

  function sugBody() { return S.overlay ? qs("#vhSoBody", S.overlay) : null; }
  function renderSuggestions(raw) {
    const body = sugBody();
    if (!raw || raw.trim().length < 2) {
      body.innerHTML = `<div class="vh-so-ideas">${ideasHTML()}</div>`;
      return;
    }
    const { results } = search(raw);
    const top = results.slice(0, 8);
    if (!top.length) {
      body.innerHTML = `<div class="vh-so-empty">${esc(feat("search.noResults", "No matches — try “temples”, “biryani”, “Kerala”…"))}</div>`;
      return;
    }
    const allLbl = feat("search.all", "See all results for “{q}” →");
    const btnTxt = allLbl.includes("{q}") ? allLbl.replace("{q}", esc(raw)) : esc(raw) + " " + allLbl;
    body.innerHTML = top.map((e) => `
      <a class="vh-so-sug" href="${entryLink(e)}">
        <span class="vh-so-sug-ico">${entryIcon(e)}</span>
        <span class="vh-so-sug-name">${esc(dispName(e))}</span>
        <span class="vh-so-sug-meta">${entryMeta(e)}</span>
      </a>`).join("") +
      `<button class="vh-so-all" data-q="${esc(raw)}">${btnTxt} →</button>`;
    qs(".vh-so-all", body).addEventListener("click", (ev) => renderResults(ev.target.dataset.q));
  }

  function renderResults(raw) {
    const body = qs("#vhSoBody", S.overlay);
    const { results, parsed } = search(raw);
    const chips = ["all", "heritage", "temple", "food", "festival", "dance", "craft", "state"];
    const iconOf = { all: "✦", heritage: "🏛️", state: "🗺️" };
    /* categorized tags: Heritage (curated stories) / Food / Festival / Dance / Craft / State (+ Temple) */
    const chipLabel = (c) =>
      c === "all" ? "✦"
        : c === "heritage" ? feat("cats.monuments", "Heritage")
        : c === "temple" ? feat("cats.temples", "Temples")
        : c === "food" ? feat("cats.foods", "Food")
        : c === "festival" ? feat("cats.festivals", "Festival")
        : c === "dance" ? feat("cats.dances", "Dance")
        : c === "craft" ? feat("cats.crafts", "Craft")
        : c === "state" ? feat("states.Tamil Nadu", "State")
        : "📍";
    const matchFilter = (e, f) =>
      f === "heritage" ? e.kind === "item"
        : f === "state" ? e.kind === "state"
        : (e.type && e.type === f) || (e.types && e.types.includes(f));
    let filter = "all";
    const paint = () => {
      const list = filter === "all" ? results : results.filter((e) => matchFilter(e, filter));
      const shown = list.slice(0, 24);
      body.innerHTML = `
        <div class="vh-so-chips">${chips.map((c) => `<button class="vh-chip ${filter === c ? "active" : ""}" data-c="${c}">${iconOf[c] || TYPE_ICONS[c] || ""} ${esc(chipLabel(c))}</button>`).join("")}</div>
        <div class="vh-so-count">${list.length} ✦${parsed.state ? " · " + esc(inState(parsed.state)) : ""}${parsed.unesco ? " · UNESCO" : ""}</div>
        <div class="vh-so-results">${shown.map((e) => `
          <a class="vh-so-card" href="${entryLink(e)}">
            <span class="vh-so-card-ico">${entryIcon(e)}</span>
            <span class="vh-so-card-body">
              <b>${esc(dispName(e))}</b>
              <small>${entryMeta(e)}${dispDesc(e) ? " · " + esc(dispDesc(e).slice(0, 90)) : ""}</small>
            </span>
          </a>`).join("") || `<div class="vh-so-empty">${esc(feat("search.noResults", "No matches — try “temples”, “biryani”, “Kerala”…"))}</div>`}</div>`;
      qsaChips().forEach((c) => c.addEventListener("click", () => { filter = c.dataset.c; paint(); }));
    };
    function qsaChips() { return Array.from(body.querySelectorAll(".vh-chip")); }
    paint();
  }

  /* ---------- voice search — shared mic controller (voice-input.js) ---------- */
  function startVoice(targetInput, hintEl) {
    /* legacy one-shot path kept for compat; real wiring happens below via VIBHOR_MIC */
    const input = targetInput || qs(".vh-so-input", S.overlay);
    if (!window.VIBHOR_MIC || !window.VIBHOR_MIC.supported) {
      const hint = hintEl || qs("#vhSoHint", S.overlay);
      if (hint) hint.textContent = feat("voice.unsupported", "Voice search isn't supported in this browser — typing works everywhere.");
      return;
    }
    /* hero mic is pre-attached at init; overlay mic is pre-attached in ensureOverlay.
       This fallback only fires from old call sites. */
    if (input && input._micInst) { input._micInst.button.click(); }
  }
  function attachMics() {
    if (!window.VIBHOR_MIC) return;
    const overlay = S.overlay;
    if (overlay && !overlay._micAttached) {
      overlay._micAttached = true;
      const input = qs(".vh-so-input", overlay);
      const inst = VIBHOR_MIC.attach({
        button: qs(".vh-so-mic", overlay),
        input,
        status: qs("#vhSoHint", overlay) || VIBHOR_MIC.makeStatus(qs(".vh-so-row", overlay)),
        onResult: (txt) => renderResults(txt)
      });
      input._micInst = inst;
    }
    const hero = qs("#heroSearch");
    if (hero && !hero._micAttached) {
      hero._micAttached = true;
      const input = qs("input", hero);
      const status = qs("#heroMicStatus", hero) || qs(".vh-mic-status", hero.parentElement);
      const inst = VIBHOR_MIC.attach({
        button: qs("#heroMic", hero),
        input,
        status,
        onResult: (txt) => { open(txt); }
      });
      input._micInst = inst;
    }
  }

  /* ---------- nav + hero wiring ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    if (!D) return;
    buildIndex();
    /* wire the shared mic controller as soon as it exists */
    const wireMic = () => { if (window.VIBHOR_MIC) attachMics(); };
    if (window.VIBHOR_MIC) wireMic();
    else {
      const t = setInterval(() => { if (window.VIBHOR_MIC) { clearInterval(t); attachMics(); } }, 120);
      setTimeout(() => clearInterval(t), 4000);
    }
    /* nav search slot (script.js renders it into the navbar) */
    const slot = qs("#navSearchSlot");
    if (slot) {
      slot.innerHTML = `<button type="button" class="nav-search-btn" id="vhNavSearch" title="Smart search — try “temples in Tamil Nadu”" aria-label="Search">🔍<span>Search</span></button>`;
      qs("#vhNavSearch").addEventListener("click", (e) => {
        e.preventDefault();
        if (S.overlay && S.overlay.classList.contains("open")) close(); else open();
      });
    } else {
      const links = qs("#navLinks");
      if (links) {
        const li = document.createElement("li");
        li.innerHTML = `<a href="#" class="nav-search-ico" id="vhNavSearch" title="Search" aria-label="Search">🔍</a>`;
        links.appendChild(li);
        qs("#vhNavSearch").addEventListener("click", (e) => { e.preventDefault(); open(); });
      }
    }
    /* hero search bar */
    const hero = qs("#heroSearch");
    if (hero) {
      const input = qs("input", hero);
      try { const ph = placeholder(); input.placeholder = ph; input.setAttribute("aria-label", ph); } catch (e) {}
      input.addEventListener("input", () => {
        const sug = qs("#heroSuggestions", hero);
        if (!sug) return;
        const raw = input.value;
        if (raw.trim().length < 2) { sug.innerHTML = ""; sug.classList.remove("show"); return; }
        const { results } = search(raw);
        const top = results.slice(0, 6);
        sug.classList.add("show");
        sug.innerHTML = top.map((e) => `
          <a class="vh-hs-item" href="${entryLink(e)}">
            <span>${entryIcon(e)}</span><b>${esc(dispName(e))}</b><small>${entryMeta(e)}</small>
          </a>`).join("") || `<div class="vh-so-empty">${esc(feat("search.noResults", "No matches — try “temples”, “biryani”, “Kerala”…"))}</div>`;
      });
      input.addEventListener("keydown", (e) => {
        const items = Array.from(hero.querySelectorAll(".vh-hs-item"));
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          if (!items.length) return;
          e.preventDefault();
          hero.dataset.hsIdx = hero.dataset.hsIdx === undefined ? "" : hero.dataset.hsIdx;
          let i = parseInt(hero.dataset.hsIdx || "0", 10);
          i = e.key === "ArrowDown" ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
          hero.dataset.hsIdx = String(i);
          items.forEach((el, j) => el.classList.toggle("active", j === i));
          if (items[i].scrollIntoView) items[i].scrollIntoView({ block: "nearest" });
        } else if (e.key === "Enter") {
          const i = parseInt(hero.dataset.hsIdx || "-1", 10);
          if (i >= 0 && items[i]) { location.href = items[i].getAttribute("href"); }
          else open(input.value);
        } else if (e.key === "Escape") {
          const sug2 = qs("#heroSuggestions", hero);
          if (sug2) sug2.classList.remove("show");
          input.blur();
        }
      });
      input.addEventListener("focus", () => { if (input.value.trim().length > 1) input.dispatchEvent(new Event("input")); });
      document.addEventListener("click", (e) => {
        const sug = qs("#heroSuggestions", hero);
        if (sug && !hero.contains(e.target)) sug.classList.remove("show");
      });
    }
    /* keyboard shortcut: "/" focuses hero search, or opens overlay elsewhere */
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && !/input|textarea/i.test(document.activeElement.tagName)) {
        e.preventDefault();
        const h = qs("#heroSearch input");
        if (h) h.focus(); else open();
      }
    });
    /* language switcher → refresh open search UI in the new language (no reload) */
    document.addEventListener("vh:langchange", () => {
      try {
        const ph = placeholder();
        const heroInput = qs("#heroSearch input");
        if (heroInput) { heroInput.placeholder = ph; heroInput.setAttribute("aria-label", ph); }
        if (S.overlay && S.overlay.classList.contains("open")) {
          const input = qs(".vh-so-input", S.overlay);
          if (input) { input.placeholder = ph; input.setAttribute("aria-label", ph); }
          const body = qs("#vhSoBody", S.overlay);
          if (body && input) {
            if (input.value.trim().length >= 2) renderResults(input.value);
            else body.innerHTML = `<div class="vh-so-ideas">${ideasHTML()}</div>`;
          }
        }
        console.info("[VIBHOR search] search UI re-rendered in the new language");
      } catch (e) { console.warn("[VIBHOR search] langchange refresh failed:", e); }
    });
  });

  /* index status for the debug panel */
  window.VIBHOR_SEARCH = {
    open, close, search, parseQuery,
    indexStatus: () => ({
      ready: S.ready,
      items: S.items.length,
      culture: S.culture.length,
      states: S.states.length,
      cats: S.cats.length,
      lastQuery: S.lastQuery || null
    })
  };
})();
