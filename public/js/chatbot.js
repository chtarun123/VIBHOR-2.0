/* ============================================================
   VIBHOR — "VIBHOR AI Guide" (redesigned heritage companion)
   - premium floating chat, independent scroll container
     (ONLY the message area scrolls; page behind never moves)
   - welcome experience + interactive suggestion chips
   - quick actions · context-aware suggestions per page
   - rich response cards (image · name · category · state ·
     working Explore + Listen buttons)
   - typing indicator · auto-scroll · "New response" pill
     · clear conversation · follow-up suggestions
   - voice: 🎤 ask by voice + 🔊 read answer aloud
     (follows the selected language; feature-detected, never
     claims a voice that the device doesn't have)
   - archive-aware: how-to-preserve + "show preserved
     heritage from <state>" against the local archive
   - future-ready: swap the body of answer() with an LLM API
     call — the UI already renders rich cards.
   ============================================================ */
(function () {
  "use strict";
  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>\"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const D = window.HERITAGE;
  const I18N = window.VIBHOR_I18N;
  const TAGS = { en: "en-IN", hi: "hi-IN", te: "te-IN", ta: "ta-IN", bn: "bn-IN" };
  let ready = false;

  /* multilingual content layer (auto English fallback) */
  const feat = (a, b) => { try { const v = window.VH_CONTENT && window.VH_CONTENT.feat(a); if (v) return v; } catch (e) {} return b; };
  const itemName = (it) => { try { const v = window.VH_CONTENT && window.VH_CONTENT.name(it.id); return v || it.name; } catch (e) {} return it.name; };
  const itemDesc = (it) => { try { const r = window.VH_CONTENT && window.VH_CONTENT.item(it.id); if (r && r.d) return r.d; } catch (e) {} return it.desc; };
  const stateName = (st) => { try { const v = window.VH_CONTENT && window.VH_CONTENT.state(st); return v || st; } catch (e) {} return st; };
  const catName = (id) => { try { const v = window.VH_CONTENT && window.VH_CONTENT.cat(id); return v || id; } catch (e) {} return id; };
  const cultureName = (c) => { try { if (c && c.idx !== undefined && window.VH_CONTENT) { const r = window.VH_CONTENT.culture(c.idx); if (r && r.n) return r; } } catch (e) {} return null; };

  /* type bucket → item category id */
  const TYPE_TO_CAT = { temple: "temples", monument: "monuments", fort: "forts", food: "foods", festival: "festivals", dance: "dances", music: "music", craft: "crafts", textile: "textiles", attraction: null };
  const catsFor = (types) => types.map((t) => TYPE_TO_CAT[t]).filter(Boolean);

  /* ================= page context (spec 43) ================= */
  function pageContext() {
    const ctx = { page: document.body ? document.body.dataset.page || "" : "", state: "", item: null };
    const P = D.param || ((k) => { try { return new URLSearchParams(location.search).get(k); } catch (e) { return null; } });
    try {
      if (ctx.page === "detail") {
        const id = P("id");
        ctx.item = (D.itemById && D.itemById(id)) || null;
        if (ctx.item) ctx.state = ctx.item.state;
      } else if (["region", "map", "quiz"].includes(ctx.page)) {
        ctx.state = P("state") || "";
      }
    } catch (e) {}
    return ctx;
  }

  /* ================= answer engine (returns html) ================= */
  function itemCard(it) {
    const c = D.categories.find((x) => x.id === it.cat) || {};
    return `<div class="vh-item-card">
      ${it.img ? `<img class="vh-item-img" src="${esc(it.img)}" alt="" loading="lazy" onerror="this.parentNode.classList.add('no-img');this.style.display='none'">` : ""}
      <div class="vh-item-body">
        <b>${esc(itemName(it))}</b>
        <small>${c.emoji || "📍"} ${esc(stateName(it.state))} · ${esc(catName(it.cat))}</small>
        <p class="vh-item-desc">${esc(itemDesc(it).slice(0, 110))}…</p>
        <div class="vh-item-actions">
          <a class="vh-ibtn" href="detail.html?id=${it.id}">${esc(feat("chat.card.explore", "Explore"))}</a>
          <button type="button" class="vh-ibtn" data-vh-listen="${it.id}">🔊 ${esc(feat("chat.card.listen", "Listen"))}</button>
        </div>
      </div>
    </div>`;
  }
  function cultureCard(c) {
    const loc = cultureName(c);
    return `<a class="vh-msg-card" href="region.html?state=${encodeURIComponent(c.state)}">
      <span class="vh-mc-ico">📜</span>
      <span><b>${esc(loc ? loc.n : c.name)}</b><br><small>${esc(stateName(c.state))} · ${esc(c.type)}${c.unesco ? " · UNESCO" : ""}</small></span>
    </a>`;
  }

  function answer(raw) {
    const text = String(raw || "").toLowerCase().trim();
    const SEARCH = window.VIBHOR_SEARCH;
    const p = SEARCH ? SEARCH.parseQuery(text) : { state: "", types: [], terms: [], unesco: false };
    let res = SEARCH ? SEARCH.search(text) : { results: [] };

    /* greetings */
    if (/^(hi|hello|hey|namaste|namaskar|vanakkam|namaskaram|how are you)\b/.test(text) || /^(नमस्ते|హలో|வணக்கம்|হ্যালো|কেআরে|হাই)\b/.test(text)) {
      return `<p>${feat("chat.hello", "Namaste! 🙏 I'm the <b>VIBHOR AI Guide</b> — your Indian heritage assistant, now aware of the community Heritage Archive too.")}</p>
      <p>${feat("chat.tryAsk", "Try asking:")}</p>` + chipsLine(welcomeChips());
    }

    /* ---------- Heritage Archive (local, real records only) ---------- */
    const A = window.VIBHOR_ARCHIVE;
    const archiveRecs = A && A.supported() ? (A.snapshot() || []) : [];

    /* "show preserved heritage from <state>" / "what is in the heritage archive" */
    if (/(preserv|archive|document)/.test(text) && /(show|what|list|who|which|any|documents|records)/.test(text) && !/(how\s+(to|do|can|should))/.test(text)) {
      let st = null;
      const states = window.HERITAGE_STATES || [];
      states.forEach((x) => {
        const n = x.name.toLowerCase();
        if (n.length > 3 && text.includes(n) && (!st || n.length > st.length)) st = x.name;
      });
      const match = st ? archiveRecs.filter((r) => r.state === st) : archiveRecs;
      if (match.length) {
        const pre = feat("chat.archiveFound", "Here is what the community has preserved");
        const mid = st ? " " + feat("chat.archiveIn", "in") + " <b>" + esc(st) + "</b>" : "";
        const post = feat("chat.archiveFoundPost", " so far:");
        return `<p>${pre}${mid}${post}</p>` +
          match.slice(0, 4).map((r) => `<a class="vh-msg-card" href="archive.html">
            <span class="vh-mc-ico">📜</span>
            <span><b>${esc(r.title)}</b><br><small>${esc(A.langName(r.language))} · ${esc(A.catMeta(r.category).e)} · ${esc(r.contributor)} · <span class="mono">${r.id}</span></small></span>
          </a>`).join("") +
          `<a class="vh-cta" href="archive.html">${feat("chat.archiveCta", "Browse the Heritage Archive")}</a>`;
      }
      const ePre = feat("chat.archiveEmpty", "The local Heritage Archive has no preserved documents");
      const eMid = st ? " " + feat("chat.archiveFrom", "from") + " <b>" + esc(st) + "</b>" : "";
      const ePost = feat("chat.archiveEmptyPost", " yet. It starts empty by design — no fake entries — so the first record is yours to add.");
      return `<p>${ePre}${eMid}${ePost}</p>
      <a class="vh-cta" href="archive.html#preserve">${feat("chat.archiveEmptyCta", "📷 Scan / Upload the first document")}</a>`;
    }

    /* how to preserve a document (with a concrete example) */
    if (/(preserv|digitiz|scan|capture)/.test(text) && /(document|book|manuscript|archive|family record|heritage|page)/.test(text)) {
      return `<p>${feat("chat.preserve", "Preserving a document is simple — and it earns real points:")}</p>
      <p><b>1.</b> ${feat("chat.preserveS1", "Photograph or scan each page (flat, well-lit, straight-on).")}<br>
      <b>2.</b> ${feat("chat.preserveS2", "Add it on the Preserve page — title, state/UT, document language, category, approximate age and a short description.")}<br>
      <b>3.</b> ${feat("chat.preserveS3", "Confirm you have permission to share it — a display name only, never email or private details.")}<br>
      <b>4.</b> ${feat("chat.preserveS4", "Submit — it's stored on this device in the local Heritage Archive (OCR-ready), and you earn +50 Heritage Points and the 📜 Heritage Preserver badge.")}</p>
      <p>${feat("chat.preserveEx", "Example — a Telugu devotional book: capture each page, set the language to Telugu and the category to Religious Text, describe who owned it and what it contains, then submit. The pages are stored as clean images ready for a future OCR → text → translate → searchable pipeline.")}</p>
      <a class="vh-cta" href="archive.html#preserve">${feat("chat.preserveCta", "📷 Open the Heritage Preservation Challenge")}</a>`;
    }

    /* navigation helpers */
    if (/(quiz|test me|question|क्विज़|క్విజ్|கவிழ்|কুইজ)/.test(text) && !p.types.length) {
      return `<p>${feat("chat.quiz", "Great! 🎯 The <b>Heritage Quiz</b> has 10 questions on festivals, temples, dances, foods and crafts — with streaks, speed bonuses and ranks.")}</p>
      <a class="vh-cta" href="quiz.html">${feat("chat.quizCta", "▶ Play the Quiz")}</a>`;
    }
    if (/passport|stamp|पासपोर्ट|పాస్‌పోర్ట్|பாஸ்போர்ட்|পাসপোর্ট/.test(text) && !p.state) {
      return `<p>${feat("chat.passport", "Your <b>Heritage Passport</b> 📘 is a stamp book of all 28 states. Visit a state page and hit “Add to Passport” to collect a stamp and 100 points each.")}</p>
      <a class="vh-cta" href="passport.html">${feat("chat.passportCta", "Open my Passport")}</a>`;
    }
    if (/challenge|participate|compet|चैलेंज|ఛాలెంజ్|போட்டி|চ্যালেঞ্জ/.test(text)) {
      return `<p>${feat("chat.challenge", "The <b>Community Challenges</b> 📸 are open to everyone: Heritage Photography, Folk Dance, Traditional Food &amp; Monument Storytelling. Upload your work, get a profile card, and climb the leaderboard.")}</p>
      <a class="vh-cta" href="challenge.html">${feat("chat.challengeCta", "See the Challenges")}</a>`;
    }
    if (/leaderboard|rank|champion|लीडरबोर्ड|లిడర్‌బోర్డ్|லிடர்போர்டு|লিডারবোর্ড/.test(text) && !p.state) {
      return `<p>${feat("chat.leaderboard", "The <b>Heritage Leaderboard</b> 🏆 ranks explorers by quiz score, states explored, challenges and passport progress. Top ranks: 🥇 Heritage Champion, 🥈 Culture Ambassador, 🥉 Rising Explorer.")}</p>
      <a class="vh-cta" href="leaderboard.html">${feat("chat.leaderboardCta", "View Leaderboard")}</a>`;
    }
    if (/journey|itinerary|plan|trip|tour|यात्रा|నెడక|பயணம்|ভ্রমণ/.test(text)) {
      const st = p.state;
      const dayW = feat("chat.dayPrefix", "Day");
      if (st) {
        const items = D.items.filter((i) => i.state === st).slice(0, 3);
        if (items.length) {
          return `<p>${feat("chat.stateFound", "Here's what I found:")} <b>${esc(stateName(st))}</b> 🧳</p>` +
            items.map((it, i) => `<p><b>${esc(dayW)} ${i + 1} —</b> ${esc(itemName(it))} (${esc(catName(it.cat))}). ${esc(itemDesc(it).slice(0, 120))}…</p>`).join("") +
            `<p>${feat("chat.tripDayNote", "Full details, videos and a timeline on each story page.")}</p>` + items.map(itemCard).join("");
        }
      }
      return `<p>${feat("chat.tripIntro", "I'd love to plan one! 🧳 Pick a state — try “plan a trip to Rajasthan”, or open My Heritage Journey for a full interest-based itinerary.")}</p>
      <a class="vh-cta" href="my-vibhor.html#journey">${feat("chat.journeyCta", "Open Journey Planner")}</a>`;
    }

    /* UNESCO */
    if (p.unesco && !p.state) {
      const list = (window.VIBHOR_CULTURE || [])
        .filter((c) => c.unesco && (!p.types.length || p.types.includes(c.type)))
        .slice(0, 6);
      return `<p>${feat("chat.unesco", "India's heritage on the UNESCO list includes these from our knowledge base:")}</p>` +
        (list.map(cultureCard).join("") || `<p>${feat("chat.unescoEmpty", "The cultural knowledge base carries UNESCO tags — browse a state to see its inscribed heritage.")}</p>`) +
        `<p class="vh-msg-small">${feat("chat.unescoTip", "Tip: ask “UNESCO sites in Kerala” to narrow it down.")}</p>`;
    }

    /* state-focused answer */
    if (p.state) {
      const st = p.state;
      const catFilter = catsFor(p.types);
      const items = D.items.filter((i) => i.state === st && (!catFilter.length || catFilter.includes(i.cat))).slice(0, 3);
      const culture = (window.VIBHOR_CULTURE ? window.VIBHOR_CULTURE.filter((c) => c.state === st && (!p.types.length || p.types.includes(c.type))) : []).slice(0, 2);
      const regionObj = D.regions[(items[0] || {}).region];
      const regionName = regionObj ? regionObj.name : "";
      const stLoc = stateName(st);
      let html = `<p><b>${esc(stLoc)}</b>${regionName ? " · " + esc(regionName) : ""} 🗺️ — ${feat("chat.stateFound", "here's what I found for you")}${p.types.length ? " · " + p.types.join(", ") : ""}:</p>`;
      html += items.map(itemCard).join("");
      if (!items.length) html += `<p>${feat("chat.stateInBook", st + " is in my stamp book — open its region page for full stories.")}</p><a class="vh-cta" href="region.html?state=${encodeURIComponent(st)}">${feat("chat.exploreCta", "Explore")} ${esc(stLoc)}</a>`;
      html += culture.map(cultureCard).join("");
      html += `<p class="vh-msg-small">${feat("chat.mapLine", "You can also see " + stLoc + " on the map → <a href='map.html'>Heritage Map</a>")}</p>`;
      return html;
    }

    /* type-focused answer (no state) */
    if (p.types.length) {
      const t = p.types[0];
      const catMap = { temple: "temples", monument: "monuments", fort: "forts", festival: "festivals", food: "foods", dance: "dances", music: "music", craft: "crafts", textile: "textiles", attraction: null };
      const cat = catMap[t];
      const items = cat ? D.items.filter((i) => i.cat === cat).slice(0, 3) : [];
      const typeWord = t === "food" ? catName("foods") : t;
      return `<p>${feat("chat.highlights", "A few highlights")} ${esc(typeWord)} 🌟</p>` +
        items.map(itemCard).join("") +
        `<p class="vh-msg-small">${feat("chat.askNarrow", "Ask for one state at a time — e.g. “" + typeWord + " in Kerala”.")}</p>`;
    }

    /* name match (fuzzy, ranked by how many terms appear in the name) */
    if (p.terms.length) {
      const scored = D.items
        .map((i) => {
          const n = i.name.toLowerCase();
          let hits = 0;
          if (n.includes(p.terms.join(" "))) hits = 100;
          else p.terms.forEach((w) => { if (w.length > 2 && n.includes(w)) hits++; });
          return { i, hits };
        })
        .filter((x) => x.hits > 0)
        .sort((a, b) => b.hits - a.hits);
      const hit = scored[0] && scored[0].i;
      if (hit) {
        return `<p>${feat("chat.nameFound", "Absolutely — here's the story I know best about " + hit.name + ":")}</p>
        <p>${esc(itemDesc(hit))}</p>${itemCard(hit)}
        <p>${feat("chat.similar", "Similar stories:")} ${D.items.filter((i) => i.cat === hit.cat && i.id !== hit.id).slice(0, 2).map((i) => `<a href="detail.html?id=${i.id}">${esc(itemName(i))}</a>`).join(" · ")}</p>`;
      }
    }

    /* fallback */
    return `<p>${feat("chat.fallback", "I hear you! I'm strongest with heritage questions — try any of these:")}</p>
    ${chipsLine(welcomeChips())}
    <p class="vh-msg-small">${feat("chat.fallbackNote", "I'll learn a new language for LLM brains soon — for now I know every story in the portal. 😉")}</p>`;
  }

  /* ================= suggestion chips ================= */
  function welcomeChips() {
    return [
      { l: feat("chat.chip.site", "🏛 Explore a Heritage Site"), a: "tell me about a famous heritage site in India" },
      { l: feat("chat.chip.food", "🍲 Find Traditional Food"), a: "tell me about traditional food in India" },
      { l: feat("chat.chip.fest", "🎉 Discover Festivals"), a: "tell me about a famous festival in India" },
      { l: feat("chat.chip.dance", "💃 Find Dance Forms"), a: "tell me about a classical dance of India" },
      { l: feat("chat.chip.craft", "🎨 Discover Crafts"), a: "tell me about a traditional craft of India" },
      { l: feat("chat.chip.trip", "🗺 Plan My Heritage Journey"), go: "my-vibhor.html#journey" },
      { l: feat("chat.chip.preserve", "📜 Preserve an Old Cultural Book"), a: "how do I preserve an old cultural book?" }
    ];
  }
  function contextChips() {
    const ctx = pageContext();
    const out = [];
    if (ctx.item) {
      out.push({ l: feat("chat.ctx.more", "Tell me more about this place"), a: "tell me about " + ctx.item.name });
      out.push({ l: feat("chat.ctx.similar", "Find similar heritage"), a: ctx.item.name });
      out.push({ l: feat("chat.ctx.listen", "🔊 Listen to its story"), listenId: ctx.item.id });
    } else if (ctx.state) {
      out.push({ l: feat("chat.ctx.ask", "Ask me about") + " " + esc(ctx.state), a: "tell me about " + ctx.state });
      out.push({ l: feat("chat.ctx.food", "Food from") + " " + esc(ctx.state), a: "foods of " + ctx.state });
      out.push({ l: feat("chat.ctx.fest", "Festivals from") + " " + esc(ctx.state), a: "festivals in " + ctx.state });
    } else if (ctx.page === "preserve" || ctx.page === "archive") {
      out.push({ l: feat("chat.chip.preserve", "📜 Preserve an Old Cultural Book"), a: "how do I preserve an old cultural book?" });
      out.push({ l: feat("chat.ctx.showArch", "📜 Show preserved heritage"), a: "show preserved heritage" });
    }
    return out;
  }
  function followUps(lastText) {
    const t = String(lastText || "").toLowerCase();
    const states = window.HERITAGE_STATES || [];
    let st = null;
    states.forEach((x) => { const n = x.name.toLowerCase(); if (n.length > 3 && t.includes(n) && (!st || n.length > st.length)) st = x.name; });
    if (st) {
      return [
        { l: "🪔 " + feat("chat.fu.fest", "Festivals in") + " " + esc(st), a: "festivals in " + st },
        { l: "🍛 " + feat("chat.fu.food", "Food from") + " " + esc(st), a: "foods of " + st },
        { l: "🧳 " + feat("chat.fu.trip", "Plan a trip to") + " " + esc(st), a: "plan a trip to " + st }
      ];
    }
    const hit = D.items.find((i) => i.name.toLowerCase() && t.includes(i.name.toLowerCase().split(" ").pop()));
    if (hit) {
      return [
        { l: "📖 " + feat("chat.fu.history", "Tell me its history"), a: "tell me about " + hit.name },
        { l: "🔎 " + feat("chat.fu.similar", "Find similar heritage"), a: hit.name },
        { l: "🗺 " + feat("chat.fu.more", "More from") + " " + esc(hit.state), a: "tell me about " + hit.state }
      ];
    }
    if (/(preserv|archive|document)/.test(t)) {
      return [
        { l: "📜 " + feat("chat.fu.showArch", "Show the Heritage Archive"), a: "show preserved heritage" },
        { l: "🗺 " + feat("chat.fu.regions", "Explore Regions"), go: "region.html" }
      ];
    }
    if (/(quiz|leaderboard|badge|passport)/.test(t)) {
      return [
        { l: "🏆 " + feat("chat.fu.board", "View Leaderboard"), go: "leaderboard.html" },
        { l: "📘 " + feat("chat.fu.passport", "Open my Passport"), go: "passport.html" }
      ];
    }
    return [
      { l: "🛕 " + feat("chat.fu.t1", "Temples in Tamil Nadu"), a: "temples in Tamil Nadu" },
      { l: "🍛 " + feat("chat.fu.t2", "Foods of Punjab"), a: "foods of Punjab" },
      { l: "🪔 " + feat("chat.fu.t3", "Festivals in Assam"), a: "festivals in Assam" }
    ];
  }
  function chipsLine(chips) {
    if (!chips || !chips.length) return "";
    return `<div class="vh-chips">${chips.map((c, i) =>
      `<button type="button" class="vh-chip" data-chip="${i}" ${c.go ? `data-go="${c.go}"` : c.listenId ? `data-listen="${c.listenId}"` : `data-ask="${esc(c.a)}"`}>${c.l}</button>`
    ).join("")}</div>`;
  }
  function wireChips(scope) {
    qsa(".vh-chip", scope).forEach((b) => {
      b.addEventListener("click", () => {
        if (b.dataset.go) { location.href = b.dataset.go; return; }
        if (b.dataset.listen) { speakItem(b.dataset.listen); return; }
        if (b.dataset.ask) ask(b.dataset.ask);
      });
    });
  }

  /* ================= voice (feature-detected) ================= */
  const synthOK = () => typeof window.speechSynthesis !== "undefined" && !!window.speechSynthesis;
  function currentTag() { const l = I18N ? I18N.getLang() : "en"; return TAGS[l] || "en-IN"; }
  function pickVoice(tag) {
    try {
      const vs = window.speechSynthesis.getVoices();
      const base = tag.split("-")[0];
      return vs.find((x) => x.lang === tag) ||
        vs.find((x) => x.lang.replace("_", "-").startsWith(tag)) ||
        vs.find((x) => x.lang === base) ||
        vs.find((x) => x.lang.startsWith(base)) ||
        vs.find((x) => x.lang.startsWith("en")) || null;
    } catch (e) { return null; }
  }
  let speakingBtn = null;
  function resetSpeakBtn() {
    if (speakingBtn) { speakingBtn.classList.remove("is-speaking"); speakingBtn.innerHTML = "🔊"; speakingBtn = null; }
  }
  function speak(text, btn) {
    if (!synthOK() || !text) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const tag = currentTag();
      u.lang = tag;
      const v = pickVoice(tag);
      if (v) u.voice = v;
      u.rate = 1;
      if (btn) { btn.classList.add("is-speaking"); btn.innerHTML = "⏹"; speakingBtn = btn; }
      u.onend = resetSpeakBtn;
      u.onerror = resetSpeakBtn;
      window.speechSynthesis.speak(u);
    } catch (e) { resetSpeakBtn(); }
  }
  function stopSpeak() { if (synthOK()) { try { window.speechSynthesis.cancel(); } catch (e) {} } resetSpeakBtn(); }
  function plainText(html) {
    const d = document.createElement("div");
    d.innerHTML = html;
    return (d.textContent || "").replace(/\s+/g, " ").trim().slice(0, 700);
  }
  function speakItem(id) {
    const it = D.itemById ? D.itemById(id) : null;
    if (it) speak(itemName(it) + ". " + itemDesc(it));
  }

  /* ================= UI ================= */
  let panel = null, body = null, input = null, fab = null, newResp = null, form = null, micBtn = null, sendBtn = null;
  let busy = false, listening = false;
  let speakMap = {}; // data-vh-read key -> plain text
  let lastUserText = "";
  const convo = []; // { u: userText } — lets the whole conversation re-render in the active language
  let rebuilding = false;

  function welcomeHtml() {
    return `<p>${feat("chat.welcome1", "Namaste! 🙏 I'm the <b>VIBHOR AI Guide</b>.")}</p>
    <p>${feat("chat.welcome2", "I can help you discover India's heritage — food, festivals, dances, crafts and stories.")}</p>` +
      chipsLine(welcomeChips());
  }

  function ensurePanel() {
    if (panel) return;
    /* floating circular button (spec 49) */
    fab = document.createElement("button");
    fab.className = "vh-fab";
    fab.type = "button";
    fab.setAttribute("aria-label", "VIBHOR AI Guide — your personal guide to India's living heritage");
    fab.setAttribute("aria-expanded", "false");
    fab.title = feat("chat.title", "VIBHOR AI Guide");
    fab.innerHTML = `<span class="vh-fab-ring" aria-hidden="true"></span><span class="vh-fab-bubble" aria-hidden="true">💬</span>`;
    document.body.appendChild(fab);
    fab.addEventListener("click", toggle);

    panel = document.createElement("div");
    panel.className = "vh-chat";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "false");
    panel.setAttribute("aria-label", feat("chat.title", "VIBHOR AI Guide"));
    panel.innerHTML = `
      <header class="vh-chat-head">
        <span class="vh-chat-ava" aria-hidden="true">🕉️</span>
        <div class="vh-chat-titles">
          <b class="vh-chat-name">${esc(feat("chat.title", "VIBHOR AI Guide"))}</b>
          <small class="vh-chat-sub" id="vhChatSub">${esc(feat("chat.sub", "Your personal guide to India's living heritage"))}</small>
        </div>
        <button type="button" class="vh-chat-tool" id="vhChatClear" title="${esc(feat("chat.clear", "Clear conversation"))}" aria-label="${esc(feat("chat.clear", "Clear conversation"))}">🗑</button>
        <button type="button" class="vh-chat-x" id="vhChatX" aria-label="${esc(feat("chat.close", "Close chat"))}">✕</button>
      </header>
      <div class="vh-chat-quick" id="vhQuick"></div>
      <div class="vh-chat-body" id="vhChatBody" role="log" aria-live="polite"></div>
      <div class="vh-newresp" id="vhNewResp" hidden>↓ ${esc(feat("chat.newResp", "New response"))}</div>
      <div class="vh-chat-sugg" id="vhSugg"></div>
      <form class="vh-chat-form" id="vhChatForm">
        <input type="text" id="vhChatInput" autocomplete="off" aria-label="${esc(feat("chat.inputPh", "Ask about India's heritage…"))}" placeholder="${esc(feat("chat.inputPh", "Ask about India's heritage…"))}" />
        <button type="button" class="vh-chat-mic" id="vhChatMic" aria-label="${esc(feat("chat.mic", "Ask by voice"))}" title="${esc(feat("chat.mic", "Ask by voice"))}">🎤</button>
        <button type="submit" class="vh-chat-send" id="vhChatSend" aria-label="${esc(feat("chat.send", "Send"))}" title="${esc(feat("chat.send", "Send"))}">➤</button>
      </form>`;
    document.body.appendChild(panel);

    body = qs("#vhChatBody", panel);
    input = qs("#vhChatInput", panel);
    form = qs("#vhChatForm", panel);
    micBtn = qs("#vhChatMic", panel);
    sendBtn = qs("#vhChatSend", panel);
    newResp = qs("#vhNewResp", panel);

    qs("#vhChatX", panel).addEventListener("click", toggle);
    qs("#vhChatClear", panel).addEventListener("click", clearChat);
    form.addEventListener("submit", (e) => { e.preventDefault(); const v = input.value.trim(); if (v && !busy) ask(v); });
    /* Enter sends (input is single-line; Shift+Enter impossible on one-line, kept for a11y note) */
    input.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); const v = input.value.trim(); if (v && !busy) ask(v); } });

    /* scroll isolation (spec): wheel inside the message area must NEVER
       scroll the page; on touch devices ONLY the message area may scroll —
       everything else inside the open panel cancels page scrolling entirely */
    body.addEventListener("wheel", (e) => { if (panel.classList.contains("open")) e.stopPropagation(); }, { passive: true });
    panel.addEventListener("wheel", (e) => {
      if (!e.target.closest(".vh-chat-body") && panel.classList.contains("open")) e.preventDefault();
    }, { passive: false });
    panel.addEventListener("touchmove", (e) => {
      if (!panel.classList.contains("open")) return;
      if (!e.target.closest(".vh-chat-body")) e.preventDefault();
    }, { passive: false });

    /* rich-card + follow-up buttons, delegated */
    panel.addEventListener("click", (e) => {
      const listen = e.target.closest("[data-vh-listen]");
      if (listen) { speakItem(listen.dataset.vhListen); return; }
      const read = e.target.closest("[data-vh-read]");
      if (read) {
        if (read.classList.contains("is-speaking")) { stopSpeak(); return; }
        speak(speakMap[read.dataset.vhRead] || plainText(read.closest(".vh-msg").innerHTML), read);
        return;
      }
      const stopAll = e.target.closest("[data-vh-stop]");
      if (stopAll) { stopSpeak(); return; }
    });

    newResp.addEventListener("click", () => { body.scrollTop = body.scrollHeight; newResp.hidden = true; });

    initMic();
    renderQuick();
  }

  function renderQuick() {
    const el = qs("#vhQuick", panel);
    if (!el) return;
    const actions = [
      { l: feat("chat.qa.exploreState", "Explore this State"), act: () => { const c = pageContext(); if (c.state) ask("tell me about " + c.state); else location.href = "region.html"; } },
      { l: feat("chat.qa.story", "Tell me a Story"), act: () => { const it = D.items[Math.floor(Math.random() * D.items.length)]; ask("tell me about " + it.name); } },
      { l: feat("chat.qa.related", "Find Related Heritage"), act: () => { const c = pageContext(); if (c.item) ask(c.item.name); else if (c.state) ask("heritage in " + c.state); else location.href = "region.html"; } },
      { l: feat("chat.qa.quiz", "Start a Quiz"), go: "quiz.html" },
      { l: feat("chat.qa.journey", "Create a Journey"), go: "my-vibhor.html#journey" },
      { l: feat("chat.qa.preserve", "Preserve Heritage"), go: "archive.html#preserve" }
    ];
    el.innerHTML = actions.map((a, i) => `<button type="button" class="vh-qa" data-qa="${i}">${esc(a.l)}</button>`).join("");
    el.querySelectorAll(".vh-qa").forEach((b) => b.addEventListener("click", () => {
      const a = actions[+b.dataset.qa];
      if (a.go) location.href = a.go; else a.act();
    }));
  }

  let micInst = null;

  function initMic() {
    /* shared voice-input controller — same engine as hero & search mics */
    if (!micBtn) return;
    if (window.VIBHOR_MIC) {
      const inst = VIBHOR_MIC.attach({
        button: micBtn,
        input,
        status: VIBHOR_MIC.makeStatus(form),
        onResult: (v) => { if (v.trim()) ask(v.trim()); }
      });
      if (!window.VIBHOR_MIC.supported) { micBtn.disabled = true; }
      micInst = inst;
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      micBtn.disabled = true;
      micBtn.title = feat("chat.micNo", "Voice input is not supported in this browser");
      micBtn.setAttribute("aria-label", micBtn.title);
    }
  }

  function nearBottom() { return body.scrollHeight - body.scrollTop - body.clientHeight < 90; }
  function scrollBottom(force) { if (force || nearBottom()) body.scrollTop = body.scrollHeight; }

  function addMsg(who, html, plain) {
    const stick = nearBottom();
    const div = document.createElement("div");
    div.className = "vh-msg " + who;
    if (who === "bot") {
      const key = "r" + Math.random().toString(36).slice(2, 8);
      speakMap[key] = plain || plainText(html);
      div.innerHTML = html + `<div class="vh-msg-foot"><button type="button" class="vh-read" data-vh-read="${key}" aria-label="${esc(feat("chat.readAloud", "Read answer aloud"))}" title="${esc(feat("chat.readAloud", "Read answer aloud"))}">🔊</button></div>`;
    } else {
      div.innerHTML = html;
    }
    body.appendChild(div);
    if (rebuilding) return div;
    if (stick || who === "user") { body.scrollTop = body.scrollHeight; newResp.hidden = true; }
    else { newResp.hidden = false; }
    return div;
  }
  function typing() {
    const div = document.createElement("div");
    div.className = "vh-msg bot vh-typing";
    div.setAttribute("aria-label", "…");
    div.innerHTML = `<span></span><span></span><span></span>`;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    return div;
  }

  function setBusy(b) {
    busy = b;
    if (input) input.disabled = b;
    if (sendBtn) sendBtn.disabled = b;
    if (form) form.classList.toggle("is-busy", b);
  }

  function renderSugg(chips) {
    const el = qs("#vhSugg", panel);
    if (!el) return;
    el.innerHTML = chipsLine(chips);
    wireChips(el);
  }

  function showWelcome() {
    const w = welcomeHtml();
    const div = addMsg("bot", w, plainText(w));
    wireChips(div);
    renderSugg(contextChips());
  }

  function clearChat() {
    body.innerHTML = "";
    speakMap = {};
    convo.length = 0;
    lastUserText = "";
    newResp.hidden = true;
    stopSpeak();
    showWelcome();
    try { input.focus({ preventScroll: true }); } catch (e) {}
  }

  function ask(text) {
    ensurePanel();
    lastUserText = String(text);
    convo.push({ u: lastUserText });
    if (!panel.classList.contains("open")) toggle();
    addMsg("user", esc(text));
    setBusy(true);
    const t = typing();
    setTimeout(() => {
      t.remove();
      let html;
      try {
        html = answer(text);
      } catch (err) {
        console.error("[VIBHOR AI Guide]", err);
        html = `<p>${feat("chat.fallbackErr", "I couldn't generate that answer — please try again.")}</p>
        <p class="vh-msg-small">${feat("chat.fallbackHint", "Please try asking about a heritage site, state, food, festival, dance or craft.")}</p>` + chipsLine(welcomeChips());
      }
      const div = addMsg("bot", html, plainText(html));
      div.classList.add("vh-msg-in");
      wireChips(div);
      renderSugg(followUps(text));
      setBusy(false);
      if (document.activeElement !== input) { try { input.focus({ preventScroll: true }); } catch (e) {} }
    }, 550);
    if (input) input.value = "";
  }

  /* STRICT scroll isolation: while the guide is open the page behind it
     must not move a single pixel (wheel, trackpad, touch, arrows). The
     saved offset is restored on close so the visitor lands exactly where
     they were. */
  let savedScrollY = 0;
  function blockPageScroll(e) {
    if (!panel || !panel.classList.contains("open")) return;
    if (e.target && e.target.closest && e.target.closest(".vh-chat-body")) return; /* chat body scrolls itself */
    e.preventDefault();
    e.stopPropagation();
  }
  function addDocBlockers(doc) {
    const docu = document;
    docu.documentElement.style.overflow = "hidden";
    docu.addEventListener("wheel", blockPageScroll, { passive: false, capture: true });
    docu.addEventListener("touchmove", blockPageScroll, { passive: false, capture: true });
  }
  function removeDocBlockers() {
    document.documentElement.style.overflow = "";
    document.removeEventListener("wheel", blockPageScroll, true);
    document.removeEventListener("touchmove", blockPageScroll, true);
  }

  function toggle() {
    ensurePanel();
    const open = panel.classList.toggle("open");
    if (fab) fab.setAttribute("aria-expanded", open ? "true" : "false");
    /* lock page scroll ONLY while the guide is open (spec 39) */
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      savedScrollY = window.scrollY || 0;
      addDocBlockers();
    } else {
      removeDocBlockers();
      try { window.scrollTo(0, savedScrollY); } catch (e) {}
    }
    if (open) {
      if (!body.children.length) showWelcome();
      else renderSugg(followUps(lastUserText));
      newResp.hidden = true;
      body.scrollTop = body.scrollHeight;
      try { input.focus({ preventScroll: true }); } catch (e) {}
    } else {
      stopSpeak();
      if (fab) { try { fab.focus({ preventScroll: true }); } catch (e) {} }
    }
  }
  function syncLang() {
    if (!panel) return;
    const title = feat("chat.title", "VIBHOR AI Guide");
    const sub = feat("chat.sub", "Your personal guide to India's living heritage");
    const nameEl = qs(".vh-chat-name", panel);
    const subEl = qs("#vhChatSub", panel);
    if (nameEl) nameEl.textContent = title;
    if (subEl) subEl.textContent = sub;
    panel.setAttribute("aria-label", title);
    if (fab) { fab.title = title; }
    const ph = feat("chat.inputPh", "Ask about India's heritage…");
    if (input) { input.placeholder = ph; input.setAttribute("aria-label", ph); }
    const clearBtn = qs("#vhChatClear", panel);
    const cl = feat("chat.clear", "Clear conversation");
    if (clearBtn) { clearBtn.title = cl; clearBtn.setAttribute("aria-label", cl); }
    const xBtn = qs("#vhChatX", panel);
    const cl2 = feat("chat.close", "Close chat");
    if (xBtn) xBtn.setAttribute("aria-label", cl2);
    renderQuick();
    /* whole conversation + system messages re-render in the active language */
    stopSpeak();
    body.innerHTML = "";
    speakMap = {};
    newResp.hidden = true;
    rebuilding = true;
    try {
      if (!convo.length) {
        showWelcome();
      } else {
        convo.forEach((c) => {
          addMsg("user", esc(c.u));
          let html;
          try { html = answer(c.u); }
          catch (err) { html = `<p>${feat("chat.fallbackErr", "I couldn't generate that answer — please try again.")}</p>`; }
          const div = addMsg("bot", html, plainText(html));
          wireChips(div);
        });
        renderSugg(followUps(convo[convo.length - 1].u));
      }
    } finally {
      rebuilding = false;
      body.scrollTop = body.scrollHeight;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!D) return;
    ensurePanel();
    /* prime the local-archive snapshot so state queries see real records */
    const A = window.VIBHOR_ARCHIVE;
    if (A && A.supported()) A.all().catch(() => {});
    window.addEventListener("vh:progress", () => { if (A && A.supported()) A.all().catch(() => {}); });
    if (I18N) document.addEventListener("vh:langchange", syncLang);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && panel && panel.classList.contains("open")) toggle();
    });
  });

  window.VIBHOR_CHAT = { open: toggle, ask };
})();
