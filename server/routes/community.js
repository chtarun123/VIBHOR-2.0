/* ============================================================
   VIBHOR — community domain
   challenges (real counts) · entries (real submissions) ·
   contributions feed · leaderboard (REAL users only)
   ============================================================ */
"use strict";
const express = require("express");
const { db } = require("../db");
const { requireLogin, cleanText } = require("../middleware/auth");
const { challengeUpload } = require("../middleware/upload");
const rewards = require("../lib/rewards");

const router = express.Router();
const CATS = ["temples","monuments","forts","historical","festivals","foods","dances","music","crafts","textiles","gardens","architecture"];

/* ---------- challenge definitions with REAL counts ---------- */
router.get("/challenges", (req, res) => {
  const defs = db.prepare("SELECT code, name, icon, descr, kind FROM challenges").all();
  const rows = defs.map((c) => {
    const agg = db.prepare(
      "SELECT COUNT(*) entries, COUNT(DISTINCT user_id) participants FROM challenge_entries WHERE challenge_code = ?"
    ).get(c.code);
    let joined = false, mine = 0;
    if (req.user) {
      joined = !!db.prepare(
        "SELECT id FROM user_activity WHERE user_id = ? AND type = 'challenge' AND ref_id = ?"
      ).get(req.user.id, c.code);
      mine = db.prepare("SELECT COUNT(*) n FROM challenge_entries WHERE user_id = ? AND challenge_code = ?").get(req.user.id, c.code).n;
    }
    let archiveCount = 0;
    if (c.kind === "archive") archiveCount = db.prepare("SELECT COUNT(*) n FROM archive_records").get().n;
    return { ...c, entries: agg.entries, participants: agg.participants, joined, mine, archiveCount };
  });
  res.json({ challenges: rows });
});

/* ---------- entries of one challenge (public community feed) ---------- */
router.get("/challenges/:code/entries", (req, res) => {
  const code = cleanText(req.params.code, 20);
  const rows = db.prepare(
    `SELECT e.id, e.title, e.descr, e.state, e.category, e.image_path, e.video_path, e.created_at,
            u.name contributor
     FROM challenge_entries e JOIN users u ON u.id = e.user_id
     WHERE e.challenge_code = ? ORDER BY e.id DESC LIMIT 60`
  ).all(code);
  res.json({ entries: rows });
});

/* ---------- submit an entry (auth + real file upload) ---------- */
router.post("/challenges/:code/entries", requireLogin, (req, res, next) => {
  const code = cleanText(req.params.code, 20);
  const exists = db.prepare("SELECT code, kind FROM challenges WHERE code = ?").get(code);
  if (!exists) return res.status(404).json({ error: "UNKNOWN_CHALLENGE" });
  if (exists.kind === "archive") {
    return res.status(400).json({ error: "USE_ARCHIVE_ENDPOINT", message: "Heritage Preservation submissions go through the Heritage Archive." });
  }
  challengeUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ])(req, res, (err) => {
    if (err) return next(err);
    const title = cleanText(req.body.title, 60);
    const descr = cleanText(req.body.descr, 300);
    const state = cleanText(req.body.state, 60);
    const category = CATS.includes(req.body.category) ? req.body.category : "";
    if (!title) return res.status(400).json({ error: "VALIDATION", field: "title", message: "A title is required." });
    if (!descr) return res.status(400).json({ error: "VALIDATION", field: "descr", message: "A short description is required." });
    const img = req.files && req.files.image && req.files.image[0];
    const vid = req.files && req.files.video && req.files.video[0];
    if (!img && !vid) {
      return res.status(400).json({ error: "VALIDATION", field: "image", message: "Attach at least an image or a video for your entry." });
    }
    const imagePath = img ? `/uploads/challenges/${img.filename}` : "";
    const videoPath = vid ? `/uploads/challenges/${vid.filename}` : "";
    const info = db.prepare(
      `INSERT INTO challenge_entries (user_id, challenge_code, title, descr, state, category, image_path, video_path)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(req.user.id, code, title, descr, state, category, imagePath, videoPath);
    const reward = rewards.challengeJoined(req.user.id, code);
    const entry = db.prepare(
      `SELECT e.*, u.name contributor FROM challenge_entries e JOIN users u ON u.id = e.user_id WHERE e.id = ?`
    ).get(info.lastInsertRowid);
    console.info(`[community] entry #${info.lastInsertRowid} by user #${req.user.id} on "${code}"${reward.earned ? ` (+${reward.earned} pts)` : ""}`);
    res.status(201).json({ ok: true, entry, reward });
  });
});

/* ---------- latest real community contributions ---------- */
router.get("/contributions", (req, res) => {
  const rows = db.prepare(
    `SELECT e.id, e.challenge_code, e.title, e.descr, e.state, e.category, e.image_path, e.video_path, e.created_at,
            u.name contributor
     FROM challenge_entries e JOIN users u ON u.id = e.user_id
     ORDER BY e.id DESC LIMIT 24`
  ).all();
  res.json({ contributions: rows });
});

/* ---------- leaderboard — REAL registered users only ---------- */
router.get("/leaderboard", (req, res) => {
  const rows = db.prepare(
    `SELECT u.id, u.name,
       COALESCE(p.points, 0) points,
       COALESCE(p.states_count, 0) states,
       COALESCE(p.challenges_count, 0) challenges,
       COALESCE(p.archive_count, 0) archives,
       (SELECT COUNT(*) FROM user_badges b WHERE b.user_id = u.id) badges,
       COALESCE((SELECT MAX(q.score) FROM quiz_results q WHERE q.user_id = u.id), 0) quiz_best
     FROM users u LEFT JOIN user_points p ON p.user_id = u.id`
  ).all();
  const scored = rows.map((r) => ({
    ...r,
    score: Math.round(r.quiz_best / 10) * 4 + r.states * 15 + r.challenges * 50 + r.badges * 30 + r.archives * 50,
  }));
  scored.sort((a, b) => b.score - a.score || a.id - b.id);
  const me = req.user ? scored.find((r) => r.id === req.user.id) : null;
  res.json({
    total: scored.length,
    rank: me ? scored.indexOf(me) + 1 : null,
    rows: scored.slice(0, 50).map((r, i) => ({ ...r, rank: i + 1, me: !!(req.user && r.id === req.user.id) })),
  });
});

module.exports = router;
