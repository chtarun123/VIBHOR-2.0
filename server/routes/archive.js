/* ============================================================
   VIBHOR — Heritage Archive (community-preserved documents)
   Browse (public, real records only) · preserve (auth + uploads)
   The archive starts EMPTY — only real submissions fill it.
   ============================================================ */
"use strict";
const express = require("express");
const { db } = require("../db");
const { requireLogin, cleanText } = require("../middleware/auth");
const { archiveUpload } = require("../middleware/upload");
const rewards = require("../lib/rewards");

const router = express.Router();

const DOCLANGS = ["en", "hi", "te", "ta", "bn", "other"];
const CATEGORIES = ["religious", "manuscript", "cultural", "recipe", "folk", "historical", "family", "other"];
const AGES = ["Under 50 years", "50–100 years", "100–200 years", "200–500 years", "Over 500 years", "Unknown"];

/* server-issued preservation id: HVA-YYYY-NNNNN (zero-padded sequence) */
function newRecordId() {
  const y = new Date().getFullYear();
  const n = db.prepare("SELECT COUNT(*) c FROM archive_records WHERE id LIKE ?").get(`HVA-${y}-%`).c + 1;
  let id;
  let seq = n;
  do {
    id = `HVA-${y}-${String(seq++).padStart(5, "0")}`;
  } while (db.prepare("SELECT id FROM archive_records WHERE id = ?").get(id));
  return id;
}

const pubRow = (r) => ({
  ...r,
  pages: JSON.parse(r.pages || "[]"),
  pageCount: JSON.parse(r.pages || "[]").length,
});

/* ---------- browse (public) ---------- */
router.get("/", (req, res) => {
  const state = cleanText(req.query.state, 60);
  const language = DOCLANGS.includes(req.query.language) ? req.query.language : "";
  const category = CATEGORIES.includes(req.query.category) ? req.query.category : "";
  const sort = req.query.sort === "old" ? "ASC" : "DESC";
  const where = [];
  const params = {};
  if (state) { where.push("r.state = @state"); params.state = state; }
  if (language) { where.push("r.language = @language"); params.language = language; }
  if (category) { where.push("r.category = @category"); params.category = category; }
  const sql = `
    SELECT r.id, r.title, r.state, r.district, r.language, r.category, r.age, r.descr,
           r.contributor, r.status, r.pages, r.video_path, r.created_at, u.name owner
    FROM archive_records r JOIN users u ON u.id = r.user_id
    ${where.length ? "WHERE " + where.join(" AND ") : ""}
    ORDER BY r.created_at ${sort} LIMIT 100`;
  const rows = db.prepare(sql).all(params).map(pubRow);
  res.json({ total: rows.length, records: rows, langs: DOCLANGS, categories: CATEGORIES, ages: AGES });
});

/* ---------- single record (public) ---------- */
router.get("/:id", (req, res) => {
  const r = db.prepare(
    `SELECT r.*, u.name owner FROM archive_records r JOIN users u ON u.id = r.user_id WHERE r.id = ?`
  ).get(cleanText(req.params.id, 20));
  if (!r) return res.status(404).json({ error: "NOT_FOUND" });
  const { user_id, awarded, ...safe } = r;
  res.json({ record: pubRow(safe) });
});

/* ---------- preserve a document (auth + page/video upload) ---------- */
router.post("/", requireLogin, (req, res, next) => {
  archiveUpload.fields([
    { name: "pages", maxCount: 12 },
    { name: "video", maxCount: 1 },
  ])(req, res, (err) => {
    if (err) return next(err);
    const pages = req.files && req.files.pages ? req.files.pages : [];
    const video = req.files && req.files.video ? req.files.video[0] : null;

    const title = cleanText(req.body.title, 80);
    const state = cleanText(req.body.state, 60);
    const district = cleanText(req.body.district, 40);
    const language = DOCLANGS.includes(req.body.language) ? req.body.language : "";
    const category = CATEGORIES.includes(req.body.category) ? req.body.category : "";
    const age = AGES.includes(req.body.age) ? req.body.age : "Unknown";
    const descr = cleanText(req.body.descr, 300);
    const contributor = cleanText(req.body.contributor, 40) || req.user.name;

    if (!title) return res.status(400).json({ error: "VALIDATION", field: "title", message: "A title is required." });
    if (!state) return res.status(400).json({ error: "VALIDATION", field: "state", message: "Please pick a state / UT." });
    if (!language) return res.status(400).json({ error: "VALIDATION", field: "language", message: "Please pick the document language." });
    if (!category) return res.status(400).json({ error: "VALIDATION", field: "category", message: "Please pick a category." });
    if (!descr) return res.status(400).json({ error: "VALIDATION", field: "descr", message: "Please add a short description." });
    if (!pages.length) return res.status(400).json({ error: "VALIDATION", field: "pages", message: "Add at least one page image." });

    const id = newRecordId();
    const pagePaths = pages.map((p) => `/uploads/archive/${p.filename}`);
    const videoPath = video ? `/uploads/archive/${video.filename}` : "";

    db.prepare(
      `INSERT INTO archive_records
         (id, user_id, title, state, district, language, category, age, descr, contributor, pages, video_path, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'submitted')`
    ).run(id, req.user.id, title, state, district, language, category, age, descr, contributor,
          JSON.stringify(pagePaths), videoPath);

    /* +50 Heritage Points, once per record, computed server-side */
    const reward = rewards.archiveSubmitted(req.user.id, id);
    const rec = db.prepare(
      "SELECT r.*, u.name owner FROM archive_records r JOIN users u ON u.id = r.user_id WHERE r.id = ?"
    ).get(id);
    console.info(`[archive] record ${id} by user #${req.user.id} (${pages.length} page(s)${video ? " + video" : ""})${reward.awarded ? ` (+${reward.gained} pts)` : ""}`);
    const { user_id, awarded, ...safe } = rec;
    res.status(201).json({ ok: true, record: pubRow(safe), reward });
  });
});

module.exports = router;
