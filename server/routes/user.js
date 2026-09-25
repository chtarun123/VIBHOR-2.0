/* ============================================================
   VIBHOR — authenticated user domain
   dashboard (My VIBHOR) · progress events · passport stamps ·
   quiz results & history · saved journeys
   ============================================================ */
"use strict";
const express = require("express");
const { db } = require("../db");
const { requireLogin, cleanText } = require("../middleware/auth");
const rewards = require("../lib/rewards");

const router = express.Router();
const progressRouter = express.Router();
const passportRouter = express.Router();
const quizRouter = express.Router();

/* ---------- My VIBHOR dashboard ---------- */
router.get("/dashboard", requireLogin, (req, res) => {
  const uid = req.user.id;
  const stats = rewards.statsFor(uid);
  const badges = rewards.badgeList(uid);
  const level = rewards.levelFor(stats.states);
  const stamps = db.prepare(
    "SELECT ref_id state, created_at FROM user_activity WHERE user_id = ? AND type = 'stamp' ORDER BY created_at"
  ).all(uid);
  const quizHistory = db.prepare(
    "SELECT mode, key_name, score, correct, answered, pct, created_at FROM quiz_results WHERE user_id = ? ORDER BY id DESC LIMIT 20"
  ).all(uid);
  const journeys = db.prepare(
    "SELECT id, title, days, interests, stops, created_at FROM saved_journeys WHERE user_id = ? ORDER BY id DESC"
  ).all(uid).map((j) => ({
    ...j,
    interests: JSON.parse(j.interests || "[]"),
    stops: JSON.parse(j.stops || "[]"),
  }));
  const joined = db.prepare(
    "SELECT ref_id code, COUNT(*) n FROM user_activity WHERE user_id = ? AND type = 'challenge' GROUP BY ref_id"
  ).all(uid);
  const entries = db.prepare(
    "SELECT id, challenge_code, title, state, category, image_path, video_path, created_at FROM challenge_entries WHERE user_id = ? ORDER BY id DESC"
  ).all(uid);
  const archive = db.prepare(
    "SELECT id, title, state, district, language, category, age, status, pages, video_path, created_at FROM archive_records WHERE user_id = ? ORDER BY created_at DESC"
  ).all(uid).map((r) => ({ ...r, pages: JSON.parse(r.pages || "[]") }));
  const activity = db.prepare(
    "SELECT type, ref_id, created_at FROM user_activity WHERE user_id = ? ORDER BY id DESC LIMIT 12"
  ).all(uid);

  res.json({
    user: { id: req.user.id, name: req.user.name, email: req.user.email, lang: req.user.lang, created_at: req.user.created_at },
    stats, badges, level,
    stamps,
    quizHistory,
    journeys,
    challengesJoined: joined.map((j) => j.code),
    entries,
    archive,
    activity,
  });
});

/* ---------- progress events ---------- */
progressRouter.post("/view", requireLogin, (req, res) => {
  const id = cleanText(req.body.id, 60);
  const cat = cleanText(req.body.cat, 30);
  const exists = db.prepare("SELECT id FROM heritage_records WHERE id = ?").get(id);
  if (!exists) return res.status(404).json({ error: "UNKNOWN_STORY" });
  res.json(rewards.viewStory(req.user.id, { id, cat }));
});

progressRouter.post("/listen", requireLogin, (req, res) => {
  res.json(rewards.listenStory(req.user.id, { id: cleanText(req.body.id, 60) }));
});

passportRouter.post("/stamp", requireLogin, (req, res) => {
  const state = cleanText(req.body.state, 60);
  const exists = db.prepare("SELECT name FROM states WHERE name = ?").get(state);
  if (!exists) return res.status(404).json({ error: "UNKNOWN_STATE" });
  res.json(rewards.stampState(req.user.id, state));
});

passportRouter.get("/", requireLogin, (req, res) => {
  res.json({
    stamps: db.prepare("SELECT ref_id state, created_at FROM user_activity WHERE user_id = ? AND type = 'stamp' ORDER BY created_at")
      .all(req.user.id),
  });
});

/* ---------- quiz ---------- */
quizRouter.post("/result", requireLogin, (req, res) => {
  const score = Math.max(0, Math.min(2250, parseInt(req.body.score, 10) || 0));
  const correct = Math.max(0, Math.min(10, parseInt(req.body.correct, 10) || 0));
  const answered = Math.max(0, Math.min(10, parseInt(req.body.answered, 10) || 0));
  const mode = ["category", "state", "region"].includes(req.body.mode) ? req.body.mode : "category";
  const key = cleanText(req.body.key, 60);
  if (answered === 0) return res.status(400).json({ error: "EMPTY_ROUND" });
  const pct = Math.max(0, Math.min(100, parseInt(req.body.pct, 10) || 0));
  res.json(rewards.quizResult(req.user.id, { mode, key, score, correct, answered, pct }));
});

quizRouter.get("/history", requireLogin, (req, res) => {
  res.json({
    history: db.prepare(
      "SELECT mode, key_name, score, correct, answered, pct, created_at FROM quiz_results WHERE user_id = ? ORDER BY id DESC LIMIT 50"
    ).all(req.user.id),
  });
});

/* ---------- saved journeys ---------- */
router.get("/journeys", requireLogin, (req, res) => {
  res.json({
    journeys: db.prepare("SELECT * FROM saved_journeys WHERE user_id = ? ORDER BY id DESC").all(req.user.id)
      .map((j) => ({ ...j, interests: JSON.parse(j.interests || "[]"), stops: JSON.parse(j.stops || "[]") })),
  });
});

router.post("/journeys", requireLogin, (req, res) => {
  const title = cleanText(req.body.title, 60) || "My Heritage Journey";
  const days = Math.max(1, Math.min(14, parseInt(req.body.days, 10) || 5));
  const interests = Array.isArray(req.body.interests) ? req.body.interests.slice(0, 10).map((x) => cleanText(x, 30)) : [];
  const stops = Array.isArray(req.body.stops) ? req.body.stops.slice(0, 30).map((s) => ({
    id: cleanText(s && s.id, 60), name: cleanText(s && s.name, 90), state: cleanText(s && s.state, 60),
    city: cleanText(s && s.city, 60), cat: cleanText(s && s.cat, 30),
  })) : [];
  if (!stops.length) return res.status(400).json({ error: "EMPTY_JOURNEY", message: "Generate a route first — a journey needs stops." });
  const info = db.prepare(
    "INSERT INTO saved_journeys (user_id, title, days, interests, stops) VALUES (?, ?, ?, ?, ?)"
  ).run(req.user.id, title, days, JSON.stringify(interests), JSON.stringify(stops));
  rewards.evalBadges(req.user.id);
  res.status(201).json({ id: info.lastInsertRowid, ok: true });
});

router.delete("/journeys/:id", requireLogin, (req, res) => {
  const info = db.prepare("DELETE FROM saved_journeys WHERE id = ? AND user_id = ?").run(req.params.id, req.user.id);
  res.json({ ok: info.changes > 0 });
});

module.exports = { router, progressRouter, passportRouter, quizRouter };
