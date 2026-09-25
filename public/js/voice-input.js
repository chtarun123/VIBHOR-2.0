/* ============================================================
   VIBHOR — shared voice INPUT controller (speech recognition)
   One engine for every mic on the site:
     VIBHOR_MIC.attach({ button, input, status, onResult })
   - independent state per instance (hero / search overlay / AI
     Guide can each listen on their own)
   - explicit states: idle 🎤 · listening 🔴 · processing ⌛ ·
     done ✅ · unavailable ⚠ · denied 🔒 (microphone blocked)
   - recognition language follows the UI language
   Uses the Web Speech API (Chrome/Edge/Chrome-Android). When a
   browser ships no recognition, the button is disabled with an
   honest tooltip — never a fake "listening" animation.
   ============================================================ */
(function () {
  "use strict";
  const qs = (s, el = document) => el.querySelector(s);
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const tr = (key, fb) => (window.VH_TR ? VH_TR(key) : fb);

  function currentTag() {
    try { if (window.VH_CONTENT && VH_CONTENT.TAGS) { const t = VH_CONTENT.TAGS[VH_CONTENT.active()]; if (t) return t; } } catch (e) {}
    const map = { en: "en-IN", hi: "hi-IN", te: "te-IN", ta: "ta-IN", bn: "bn-IN" };
    try { const l = window.VIBHOR_I18N ? VIBHOR_I18N.getLang() : "en"; return map[l] || "en-IN"; } catch (e) {}
    return "en-IN";
  }

  function setState(inst, st, detail) {
    inst.state = st;
    const b = inst.button;
    if (!b) return;
    b.classList.remove("vh-mic-listening", "vh-mic-processing", "vh-mic-done", "vh-mic-err", "vh-mic-denied");
    const ICON = { idle: "🎤", listening: "🔴", processing: "⌛", done: "✅", unavailable: "⚠", denied: "🔒" };
    b.textContent = ICON[st] || "🎤";
    const TIP = {
      idle: tr("mic.tip.idle", "Voice search"),
      listening: tr("mic.tip.listening", "Listening… tap to stop"),
      processing: tr("mic.tip.processing", "Processing…"),
      done: tr("mic.tip.done", "Got it!"),
      unavailable: tr("mic.tip.unavailable", "Voice input is not supported in this browser"),
      denied: tr("mic.tip.denied", "Microphone permission blocked — allow it in the browser address bar")
    };
    b.title = TIP[st] || "";
    b.setAttribute("aria-label", b.title);
    b.setAttribute("aria-pressed", st === "listening" ? "true" : "false");
    if (st === "listening") b.classList.add("vh-mic-listening");
    if (st === "processing") b.classList.add("vh-mic-processing");
    if (st === "done") b.classList.add("vh-mic-done");
    if (st === "unavailable" || st === "denied") b.classList.add("vh-mic-err");
    if (st === "denied") b.classList.add("vh-mic-denied");
    if (inst.status) {
      const TXT = {
        listening: tr("mic.status.listening", "🎤 Listening… speak now"),
        processing: tr("mic.status.processing", "⌛ Processing your voice…"),
        done: detail ? "✅ “" + detail + "”" : tr("mic.status.done", "✅ Got it!"),
        denied: tr("mic.status.denied", "🔒 Microphone blocked — click the lock/tune icon in your address bar to allow it"),
        unavailable: tr("mic.status.unavailable", "⚠ Voice input needs Chrome / Edge on desktop or Android. Typing works everywhere."),
        error: tr("mic.status.error", "⚠ Couldn't hear you — try again or type instead.")
      };
      inst.status.textContent = TXT[st] || (st === "error" ? TXT.error : "");
      if (st === "idle" || st === "done") setTimeout(() => { if (inst.status && inst.state !== "listening") inst.status.textContent = ""; }, 2600);
    }
  }

  function attach(cfg) {
    const inst = {
      button: cfg.button || null,
      input: cfg.input || null,
      status: cfg.status || null,
      onResult: cfg.onResult || null,
      state: "idle",
      rec: null,
      get supported() { return !!SR; }
    };
    if (!inst.button) return inst;

    if (!SR) {
      inst.button.setAttribute("aria-disabled", "true");
      setState(inst, "unavailable");
      inst.button.addEventListener("click", () => setState(inst, "unavailable"));
      return inst;
    }

    inst.button.addEventListener("click", () => {
      if (inst.state === "listening") { try { inst.rec && inst.rec.stop(); } catch (e) {} return; }
      let rec;
      try { rec = new SR(); } catch (e) { setState(inst, "error"); return; }
      rec.lang = currentTag();
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      inst.rec = rec;
      setState(inst, "listening");

      rec.onresult = (e) => {
        const txt = (e.results && e.results[0] && e.results[0][0] && e.results[0][0].transcript) || "";
        setState(inst, "done", txt);
        if (inst.input) {
          inst.input.value = txt;
          inst.input.dispatchEvent(new Event("input", { bubbles: true }));
        }
        if (inst.onResult && txt.trim()) {
          try { inst.onResult(txt.trim(), inst); } catch (err) { console.warn("[VIBHOR mic]", err); }
        }
      };
      rec.onerror = (e) => {
        const k = e && e.error;
        if (k === "not-allowed" || k === "service-not-allowed") setState(inst, "denied");
        else if (k === "audio-capture") setState(inst, "unavailable", "no microphone");
        else if (k !== "aborted") setState(inst, "error");
        else setState(inst, "idle");
      };
      rec.onend = () => { if (inst.state === "listening") setState(inst, "idle"); };
      try { rec.start(); } catch (e) { setState(inst, "error"); }
    });

    document.addEventListener("vh:langchange", () => setState(inst, "idle"));
    return inst;
  }

  window.VIBHOR_MIC = {
    attach,
    supported: !!SR,
    makeStatus: (afterEl) => {
      const s = document.createElement("div");
      s.className = "vh-mic-status";
      s.setAttribute("aria-live", "polite");
      if (afterEl && afterEl.parentNode) afterEl.parentNode.insertBefore(s, afterEl.nextSibling);
      return s;
    }
  };
})();
