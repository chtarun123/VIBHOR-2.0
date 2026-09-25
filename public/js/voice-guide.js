/* ============================================================
   VIBHOR — AI Voice Storytelling (audio-guide mode) v2
   - "Listen to the Story" bar on every detail page
   - Web Speech API (speechSynthesis), built for Chrome/Edge:
       * onvoiceschanged + short polling (voices load async)
       * language-aware voice selection — the narration always
         matches the language switcher (hi→hi-IN, te→te-IN, …)
       * fallback: best Indian voice → best English → any voice
       * clear error messages + console debug logs
   - Controls: Play/Pause/Resume, Stop, Speed, Volume,
     Voice-selection dropdown
   - Word-by-word highlight of the narration text
   - +15 heritage points per story listened (progress engine)
   ============================================================ */
(function () {
  "use strict";
  const qs = (s, el = document) => el.querySelector(s);

  let utter = null;
  let chunks = [];
  let chunkIdx = 0;
  let chunkBase = 0;
  let state = "idle";          // idle | playing | paused
  let spanEls = [], offsets = [];
  let activeItem = null;
  let voicesReady = false;
  let voicesCache = [];
  let selectedVoiceURI = null;
  let pollTimer = null;

  /* ---------- helpers ---------- */
  const log = (...a) => console.info("[VIBHOR voice]", ...a);
  const verr = (...a) => console.warn("[VIBHOR voice]", ...a);
  /* page may be gone (or jsdom window closed) when a late timer fires */
  const alive = () => { try { return typeof document !== "undefined" && !!document.querySelector("#voiceGuide"); } catch (e) { return false; } };

  function activeLang() {
    try { if (window.VH_CONTENT) return window.VH_CONTENT.active(); } catch (e) {}
    try { if (window.VIBHOR_I18N) return window.VIBHOR_I18N.getLang(); } catch (e) {}
    return "en";
  }
  function feat(key, fallback) {
    try { if (window.VH_CONTENT) { const v = window.VH_CONTENT.feat(key); if (v) return v; } } catch (e) {}
    return fallback;
  }
  function langTag(lang) {
    try { if (window.VH_CONTENT && window.VH_CONTENT.TAGS && window.VH_CONTENT.TAGS[lang]) return window.VH_CONTENT.TAGS[lang]; } catch (e) {}
    return "en-IN";
  }
  function normLang(l) { return (l || "").replace("_", "-").toLowerCase(); }

  /* narration text in the ACTIVE language (English fallback built into the layer) */
  function narrationText() {
    if (!activeItem) return "";
    let loc = null;
    try { if (window.VH_CONTENT) loc = window.VH_CONTENT.item(activeItem.id); } catch (e) {}
    const n = (loc && loc.n) || activeItem.name;
    const d = (loc && loc.d) || activeItem.desc;
    const h = (loc && loc.h) || activeItem.hist;
    return `${n}. ${d} ${h}`;
  }

  /* ---------- voices ---------- */
  function populateVoiceSelect() {
    const sel = qs("#voiceSelect");
    if (!sel) return;
    sel.innerHTML = voicesCache
      .map((v, i) => `<option value="${v.voiceURI}">${v.name} (${v.lang})</option>`)
      .join("");
    syncVoiceSelect();
  }
  function syncVoiceSelect() {
    const sel = qs("#voiceSelect");
    if (sel && selectedVoiceURI && voicesCache.some((v) => v.voiceURI === selectedVoiceURI)) {
      sel.value = selectedVoiceURI;
    }
  }

  /* pick the best voice for the active language */
  function autoPick() {
    const tag = normLang(langTag(activeLang()));      // e.g. "ta-in"
    const base = tag.split("-")[0];                    // e.g. "ta"
    const vs = voicesCache;
    let v = vs.find((x) => normLang(x.lang) === tag);
    if (!v) v = vs.find((x) => normLang(x.lang).startsWith(base));
    if (!v) v = vs.find((x) => /en-(in|india)/i.test(x.lang));
    if (!v) v = vs.find((x) => /^en/i.test(normLang(x.lang)));
    if (!v) v = vs[0] || null;
    selectedVoiceURI = v ? v.voiceURI : null;
    if (v) log(`voice auto-selected for "${activeLang()}":`, v.name, v.lang);
    else verr(`no speech voices available for "${activeLang()}"`);
    syncVoiceSelect();
    return v;
  }

  function loadVoices() {
    if (!window.speechSynthesis) {
      verr("speechSynthesis is not supported in this browser");
      setStatus(feat("voice.notSupported", "Not supported in this browser"), true);
      return;
    }
    const load = () => {
      let vs = [];
      try { vs = speechSynthesis.getVoices() || []; } catch (e) { verr("getVoices failed", e); }
      if (vs.length) {
        const first = !voicesReady;
        voicesCache = vs;
        voicesReady = true;
        if (first) {
          log(`voices loaded: ${vs.length} available`);
          populateVoiceSelect();
          autoPick();
        }
      }
    };
    load();
    /* Chrome/Edge populate voices asynchronously — listen AND poll briefly */
    try {
      speechSynthesis.onvoiceschanged = () => { log("onvoiceschanged fired"); load(); };
    } catch (e) { verr("onvoiceschanged unavailable", e); }
    let n = 0;
    clearInterval(pollTimer);
    pollTimer = setInterval(() => {
      load();
      if (voicesReady || ++n > 20) clearInterval(pollTimer);
    }, 250);
    if (!selectedVoiceURI) autoPick();
  }

  /* split long text into speech-sized chunks — a single long utterance
     dies mid-way in Chromium (~15s cap); chaining short ones is solid */
  function splitChunks(text, maxLen) {
    const M = maxLen || 200;
    const sents = String(text).replace(/\s+/g, " ").match(/[^.!?।]+[.!?।]+[’’'"\)]*|[^.!?।]+$/g) || [text];
    const out = [];
    let cur = "";
    for (const s of sents) {
      const seg = s.trim();
      if (!seg) continue;
      if ((cur + " " + seg).trim().length <= M) { cur = (cur + " " + seg).trim(); continue; }
      if (cur) { out.push(cur); cur = ""; }
      while (seg.length > M) {
        let cut = seg.lastIndexOf(" ", M);
        if (cut < M * 0.5) cut = M;
        out.push(seg.slice(0, cut));
        seg = seg.slice(cut).trim();
      }
      if (seg) cur = seg;
    }
    if (cur) out.push(cur);
    return out;
  }

  /* ---------- word highlight ---------- */
  function buildWords(text) {
    const wrap = qs("#voiceWords");
    if (!wrap) return;
    spanEls = []; offsets = [];
    const words = text.split(/\s+/).filter(Boolean);
    let pos = 0;
    wrap.innerHTML = words.map((w) => {
      offsets.push(pos);
      pos += w.length + 1;
      return `<span class="vw">${w.replace(/</g, "&lt;")}</span>`;
    }).join(" ");
    spanEls = Array.from(wrap.querySelectorAll(".vw"));
  }
  function voiceCard() {
    const bar = qs("#voiceGuide");
    return bar ? (qs(".voice-guide", bar) || bar) : null;
  }
  function setProgress(pct) {
    const bar = qs("#voiceProgress");
    if (bar) bar.style.width = Math.max(0, Math.min(100, pct)) + "%";
    const card = voiceCard();
    if (card) card.classList.toggle("playing", state === "playing");
  }
  function clearHighlight() { spanEls.forEach((s) => s.classList.remove("active")); }
  function highlight(charIndex) {
    let idx = 0;
    for (let i = 0; i < offsets.length; i++) { if (offsets[i] <= charIndex) idx = i; else break; }
    clearHighlight();
    if (spanEls[idx]) {
      spanEls[idx].classList.add("active");
      try { spanEls[idx].scrollIntoView({ block: "nearest", behavior: "smooth" }); } catch (e) {}
    }
  }

  /* ---------- status + buttons ---------- */
  function setStatus(msg, isError) {
    const el = qs("#voiceStatus");
    if (!el) return;
    el.textContent = msg || "";
    el.classList.toggle("err", !!isError);
  }
  function updateButtons() {
    const play = qs("#voicePlay");
    const label = qs("#voiceLabel");
    if (!play || !label) return;
    if (state === "playing") {
      play.textContent = "⏸";
      play.setAttribute("aria-label", feat("voice.pause", "Pause"));
      label.textContent = feat("voice.pause", "Pause");
    } else if (state === "paused") {
      play.textContent = "▶";
      play.setAttribute("aria-label", feat("voice.resume", "Resume"));
      label.textContent = feat("voice.resume", "Resume");
    } else {
      play.textContent = "▶";
      play.setAttribute("aria-label", feat("voice.play", "Play"));
      label.textContent = feat("voice.play", "Play");
    }
    /* localise the bar strings whenever state changes too */
    const t = qs("#voiceTitle");
    if (t) t.textContent = feat("voice.title", "Listen to the Story");
    const sub = qs("#voiceSub");
    if (sub) sub.textContent = feat("voice.sub", "AI narration · word-by-word guide · +15 pts");
    const sp = qs("#voiceSpeedLbl"); if (sp) sp.textContent = feat("voice.speed", "Speed");
    const vo = qs("#voiceVolLbl"); if (vo) vo.textContent = feat("voice.volume", "Volume");
    const vs = qs("#voiceVoiceLbl"); if (vs) vs.textContent = feat("voice.voice", "Choose a voice");
    const st = qs("#voiceStop"); if (st) st.setAttribute("aria-label", feat("voice.stop", "Stop"));
  }

  function onEnd() {
    state = "idle";
    if (!alive()) return;
    clearHighlight();
    setStatus("");
    setProgress(0);
    log("narration ended");
    updateButtons();
  }

  /* ---------- transport ---------- */
  function play() {
    if (!window.speechSynthesis) {
      setStatus(feat("voice.notSupported", "Not supported in this browser"), true);
      verr("speechSynthesis not supported");
      return;
    }
    if (state === "playing") {
      try { speechSynthesis.pause(); } catch (e) { verr("pause failed", e); }
      state = "paused";
      log("paused");
      updateButtons();
      return;
    }
    if (state === "paused") {
      try { speechSynthesis.resume(); } catch (e) { verr("resume failed", e); }
      state = "playing";
      log("resumed");
      setStatus(feat("voice.listening", "Listening…"));
      updateButtons();
      return;
    }
    const text = narrationText();
    if (!text) { setStatus(feat("voice.error", "Nothing to narrate yet"), true); return; }

    /* a voice must exist, otherwise warn in a friendly way */
    if (!voicesReady) {
      setStatus(feat("voice.noVoice", "No matching voice found — using default"), false);
      log("no voices loaded yet; trying default");
    }

    buildWords(text);
    try { speechSynthesis.cancel(); } catch (e) {}
    chunks = splitChunks(text, 200);
    chunkIdx = 0;
    chunkBase = 0;
    state = "playing";
    updateButtons();
    log(`speak "${activeLang()}" · ${chunks.length} chunk(s) · chars=${text.length}`);
    speakChunk(0, v => v);
    try { if (window.HERITAGE_PROGRESS) window.HERITAGE_PROGRESS.listenStory(); } catch (e) {}
  }

  function speakChunk(i, total) {
    if (i >= chunks.length || state !== "playing") { onEnd(); return; }
    chunkIdx = i;
    const text = chunks.join(" ");
    utter = new SpeechSynthesisUtterance(chunks[i]);
    const rateEl = qs("#voiceRate"), volEl = qs("#voiceVolume");
    utter.rate = parseFloat(rateEl && rateEl.value) || 1;
    utter.volume = volEl ? parseInt(volEl.value, 10) / 100 : 1;
    utter.pitch = 1;
    const v = voicesCache.find((x) => x.voiceURI === selectedVoiceURI) || null;
    if (v) { utter.voice = v; utter.lang = v.lang; }
    else {
      utter.lang = langTag(activeLang());
      if (i === 0) setStatus(feat("voice.noVoice", "No matching voice found — using default"), false);
    }
    utter.onstart = () => {
      log(`chunk ${i + 1}/${chunks.length} started`);
      if (!alive()) return;
      setStatus(feat("voice.listening", "Listening…"));
      chunkBase = chunks.slice(0, i).join(" ").length + (i ? 1 : 0);
    };
    utter.onboundary = (e) => {
      if (!alive()) return;
      if (e.name === "word") {
        const gi = chunkBase + e.charIndex;
        highlight(gi);
        try { setProgress((gi / text.length) * 100); } catch (err) {}
      }
    };
    utter.onend = () => {
      if (state !== "playing") return;
      if (i + 1 < chunks.length) speakChunk(i + 1, total);
      else onEnd();
    };
    utter.onerror = (e) => {
      verr("utterance error:", e && e.error);
      if (!alive()) return;
      setStatus(feat("voice.error", "Narration failed to start"), true);
      onEnd();
    };
    try { speechSynthesis.speak(utter); } catch (e) { verr("speak() threw", e); onEnd(); }
  }

  function stop() {
    if (!window.speechSynthesis) return;
    try { speechSynthesis.cancel(); } catch (e) {}
    state = "idle";
    clearHighlight();
    setStatus("");
    setProgress(0);
    log("stopped");
    updateButtons();
  }

  /* ---------- localisation of the bar ---------- */
  function localizeBar() {
    updateButtons();
  }

  /* ---------- test the selected voice (short sample line) ---------- */
  let testing = false;
  function testVoice() {
    if (!window.speechSynthesis || testing) return;
    if (state === "playing" || state === "paused") stop();
    const samples = {
      en: "Namaste! I will read this heritage story to you.",
      hi: "नमस्ते! मैं आपको यह धरोहर कहानी सुनाऊँगा।",
      te: "నమస్తే! నేను ఈ వారసత్వ కథను మీకు వినిపిస్తాను.",
      ta: "வணக்கம்! இந்த பாரம்பரியக் கதையை நான் உங்களுக்குப் படித்துக் காட்டுவேன்.",
      bn: "নমস্কার! আমি আপনাকে এই ঐতিহ্যের গল্পটা শুনিয়ে দেব।"
    };
    const lang = activeLang();
    const text = samples[lang] || samples.en;
    try { speechSynthesis.cancel(); } catch (e) {}
    const u = new SpeechSynthesisUtterance(text);
    const v = voicesCache.find((x) => x.voiceURI === selectedVoiceURI) || null;
    if (v) { u.voice = v; u.lang = v.lang; }
    else { u.lang = langTag(lang); setStatus(feat("voice.noVoice", "No matching voice found — using default"), false); }
    const rateEl = qs("#voiceRate"), volEl = qs("#voiceVolume");
    u.rate = parseFloat(rateEl && rateEl.value) || 1;
    u.volume = volEl ? parseInt(volEl.value, 10) / 100 : 1;
    testing = true;
    const btn = qs("#voiceTest");
    if (btn) btn.classList.add("testing");
    setStatus(feat("voice.testing", "Testing the voice…"));
    u.onend = () => { testing = false; if (btn) btn.classList.remove("testing"); setStatus(""); };
    u.onerror = () => { testing = false; if (btn) btn.classList.remove("testing"); setStatus(feat("voice.error", "Narration failed to start"), true); };
    try { speechSynthesis.speak(u); } catch (e) { testing = false; if (btn) btn.classList.remove("testing"); }
    log("testing voice:", v ? v.name : "browser-default");
  }

  /* ---------- init ---------- */
  function init(item) {
    activeItem = item;
    const bar = qs("#voiceGuide");
    if (!bar) return;
    (qs(".voice-guide", bar) || bar).classList.add("show");

    const playBtn = qs("#voicePlay", bar);
    const stopBtn = qs("#voiceStop", bar);
    const rateEl = qs("#voiceRate");
    const volEl = qs("#voiceVolume");
    const voiceSel = qs("#voiceSelect");

    if (playBtn) playBtn.addEventListener("click", play);
    if (stopBtn) stopBtn.addEventListener("click", stop);
    const testBtn = qs("#voiceTest", bar);
    if (testBtn) testBtn.addEventListener("click", testVoice);
    if (rateEl) rateEl.addEventListener("change", () => {
      log("rate →", rateEl.value);
      if (state === "playing") { stop(); }      /* re-speak at new speed */
    });
    if (volEl) volEl.addEventListener("change", () => {
      if (utter) utter.volume = parseInt(volEl.value, 10) / 100;
      log("volume →", volEl.value);
    });
    if (voiceSel) voiceSel.addEventListener("change", () => {
      selectedVoiceURI = voiceSel.value;
      log("voice →", selectedVoiceURI);
      if (state === "playing") stop();          /* re-speak with new voice */
    });

    localizeBar();
    buildWords(narrationText());
    loadVoices();

    /* keep narration in sync with the language switcher */
    document.addEventListener("vh:langchange", (e) => {
      log("language change →", e.detail && e.detail.lang);
      stop();
      autoPick();
      buildWords(narrationText());
      localizeBar();
    });

    window.addEventListener("pagehide", stop);
  }

  function browserName() {
    const ua = (navigator && navigator.userAgent) || "";
    if (/edg\//i.test(ua)) return "Edge";
    if (/chrome|chromium/i.test(ua)) return "Chrome";
    if (/firefox/i.test(ua)) return "Firefox";
    if (/safari/i.test(ua)) return "Safari";
    return "Browser";
  }

  /* ---------- global init: voices load on EVERY page (not just detail) ----------
     so the debug panel can always report voice diagnostics */
  let globalInitDone = false;
  function initGlobal() {
    if (globalInitDone) return;
    globalInitDone = true;
    const synth = window.speechSynthesis;
    if (!synth) {
      verr("speechSynthesis unavailable — browser:", browserName(),
        "voice narration will be disabled (Chrome / Edge recommended)");
      return;
    }
    log("initialising speech engine · browser:", browserName(), "· lang:", activeLang());
    loadVoices();
  }
  document.addEventListener("DOMContentLoaded", initGlobal);
  if (document.readyState !== "loading") initGlobal();

  window.VH_VOICE = {
    init,
    stop,
    initGlobal,
    /* debug panel */
    status: () => {
      const synth = typeof window.speechSynthesis !== "undefined" ? window.speechSynthesis : null;
      const cur = voicesCache.find((x) => x.voiceURI === selectedVoiceURI) || null;
      return {
        supported: !!synth,
        browser: browserName(),
        voicesLoaded: voicesReady || !!(synth && synth.getVoices().length),
        voicesCount: voicesCache.length,
        currentVoice: cur ? cur.name + " (" + cur.lang + ")" : (cur === null && voicesReady ? "default" : "—"),
        state: state,
        lang: activeLang()
      };
    }
  };
})();
