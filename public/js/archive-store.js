/* ============================================================
   VIBHOR — Heritage Archive store (backend-backed)
   Same API surface the pages have always used
   (VIBHOR_ARCHIVE.all/get/add/DOCLANGS/CATEGORIES/AGES…),
   but every record lives in the server SQLite DB and every file
   lives under server/uploads/ — the archive is genuinely shared
   by the whole community, not locked inside one browser.
   Preserving a document requires sign-in (+50 points, server-side,
   idempotent; first submission also earns the Preserver badge).
   ============================================================ */
(function () {
  "use strict";

  const DOCLANGS = [
    { id: "en", name: "English" },
    { id: "hi", name: "Hindi" },
    { id: "te", name: "Telugu" },
    { id: "ta", name: "Tamil" },
    { id: "bn", name: "Bengali" },
    { id: "other", name: "Other" }
  ];
  const CATEGORIES = [
    { id: "religious", name: "Religious Text", e: "🕉️" },
    { id: "manuscript", name: "Manuscript", e: "🖋️" },
    { id: "cultural", name: "Cultural Book", e: "📚" },
    { id: "recipe", name: "Recipe Book", e: "🍛" },
    { id: "folk", name: "Folk Literature", e: "🎭" },
    { id: "historical", name: "Historical Document", e: "🏛️" },
    { id: "family", name: "Family Archive", e: "👪" },
    { id: "other", name: "Other Cultural Heritage", e: "📜" }
  ];
  const AGES = ["Under 50 years", "50–100 years", "100–200 years", "200–500 years", "Over 500 years", "Unknown"];
  const STATUS_SUBMITTED = "submitted";
  const STATUS_REVIEW = "under-review";
  const STATUS_VERIFIED = "verified";

  let cache = null; // synchronous snapshot for chatbot etc.

  /* normalise a server record into the shape pages already render */
  function norm(r) {
    return {
      id: r.id,
      title: r.title,
      state: r.state,
      district: r.district || "",
      language: r.language || "en",
      category: r.category || "other",
      age: r.age || "Unknown",
      desc: r.descr || r.desc || "",
      descr: r.descr || r.desc || "",
      contributor: r.contributor || r.owner || "Community member",
      owner: r.owner || r.contributor || "",
      date: r.created_at || r.date || "",
      status: r.status || STATUS_SUBMITTED,
      pages: (r.pages || []).map((p, i) => ({ url: p, alt: "Page " + (i + 1) })),
      pageUrls: r.pages || [],
      videoUrl: r.video_path || ""
    };
  }

  const A = (window.VIBHOR_ARCHIVE = {
    DOCLANGS, CATEGORIES, AGES,
    STATUS: { SUBMITTED: STATUS_SUBMITTED, REVIEW: STATUS_REVIEW, VERIFIED: STATUS_VERIFIED },
    supported: () => true,

    langName: (id) => { const l = DOCLANGS.find((x) => x.id === id); return l ? l.name : id; },
    catMeta: (id) => CATEGORIES.find((x) => x.id === id) || { name: id, e: "📜" },

    /* list all records (newest first) — real community data only */
    all: async (filters) => {
      const q = new URLSearchParams();
      if (filters) {
        ["state", "language", "category", "sort"].forEach((k) => { if (filters[k]) q.set(k, filters[k]); });
      }
      const data = await VH_API.get("/api/archive" + (q.toString() ? "?" + q : ""));
      const out = (data.records || []).map(norm);
      out.sort((a, b) => String(b.date).localeCompare(String(a.date)));
      cache = out;
      return out;
    },
    get: async (id) => {
      const data = await VH_API.get("/api/archive/" + encodeURIComponent(id));
      return norm(data.record);
    },
    snapshot: () => cache || [],
    count: () => (cache ? cache.length : 0),

    /* preserve a document: meta + File objects → server upload */
    add: async (meta, files, videoFile) => {
      const fd = new FormData();
      fd.set("title", meta.title || "");
      fd.set("state", meta.state || "");
      fd.set("district", meta.district || "");
      fd.set("language", meta.language || "");
      fd.set("category", meta.category || "");
      fd.set("age", meta.age || "Unknown");
      fd.set("descr", meta.desc || meta.descr || "");
      fd.set("contributor", meta.contributor || "");
      (files || []).forEach((f) => { if (f && f.size) fd.append("pages", f, f.name || "page.jpg"); });
      if (videoFile && videoFile.size) fd.append("video", videoFile, videoFile.name || "video.mp4");
      const data = await VH_API.upload("/api/archive", fd);
      const rec = norm(data.record);
      /* +50 points were awarded server-side (idempotent) — reflect in mirror */
      if (data.reward && window.VH_API) { VH_API.refresh(); }
      cache = (cache || []).filter((r) => r.id !== rec.id);
      cache.unshift(rec);
      return rec;
    },

    /* images now live on the server — kept for API compatibility */
    pageBlob: async () => null,
    videoBlob: async () => null,

    /* OCR-ready hooks (future pipeline; intentionally inert) */
    ocrAvailable: () => false,
    extractText: async () => { throw new Error("OCR is a planned future step, not available in this prototype"); }
  });
})();
