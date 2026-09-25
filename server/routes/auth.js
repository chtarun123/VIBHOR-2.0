/* ============================================================
   VIBHOR — authentication
   register · login · logout · guest · me · one-time local merge
   Passwords are bcrypt-hashed (never stored or logged plain).
   ============================================================ */
"use strict";
const express = require("express");
const bcrypt = require("bcryptjs");
const { db } = require("../db");
const { requireLogin, cleanText, EMAIL_RE, bad } = require("../middleware/auth");
const rewards = require("../lib/rewards");

const router = express.Router();
const LANGS = ["en", "hi", "te", "ta", "bn"];

function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email, lang: u.lang, created_at: u.created_at };
}
function mePayload(req) {
  if (!req.user) {
    return {
      authenticated: false,
      guest: !!(req.session && req.session.isGuest),
      user: null,
    };
  }
  const stats = rewards.statsFor(req.user.id);
  stats.badges = db.prepare("SELECT badge_id FROM user_badges WHERE user_id = ?").all(req.user.id).map((r) => r.badge_id);
  return { authenticated: true, guest: false, user: publicUser(req.user), stats };
}

/* ---------- register ---------- */
router.post("/register", (req, res) => {
  const name = cleanText(req.body.name, 40);
  const email = cleanText(req.body.email, 120).toLowerCase();
  const password = String(req.body.password || "");
  const lang = LANGS.includes(req.body.lang) ? req.body.lang : "en";

  if (name.length < 2) return bad(res, "Display name needs at least 2 characters.", "name");
  if (!EMAIL_RE.test(email)) return bad(res, "Please enter a valid email address.", "email");
  if (password.length < 8) return bad(res, "Password must be at least 8 characters.", "password");

  const exists = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (exists) return res.status(409).json({ error: "EMAIL_TAKEN", message: "An account with this email already exists — try signing in." });

  const hash = bcrypt.hashSync(password, 10);
  const info = db.prepare("INSERT INTO users (name, email, pass_hash, lang) VALUES (?, ?, ?, ?)").run(name, email, hash, lang);
  rewards.ensurePoints(info.lastInsertRowid);
  req.session.userId = info.lastInsertRowid;
  req.session.isGuest = false;
  req.user = db.prepare("SELECT id, name, email, lang, created_at FROM users WHERE id = ?").get(info.lastInsertRowid);
  console.info(`[auth] registered user #${info.lastInsertRowid} (${email})`);
  res.status(201).json(mePayload(req));
});

/* ---------- login ---------- */
router.post("/login", (req, res) => {
  const email = cleanText(req.body.email, 120).toLowerCase();
  const password = String(req.body.password || "");
  if (!email || !password) return bad(res, "Email and password are required.");
  const u = db.prepare("SELECT id, name, email, pass_hash, lang, created_at FROM users WHERE email = ?").get(email);
  if (!u || !bcrypt.compareSync(password, u.pass_hash)) {
    return res.status(401).json({ error: "BAD_CREDENTIALS", message: "Email or password is incorrect." });
  }
  req.session.userId = u.id;
  req.session.isGuest = false;
  const { pass_hash, ...safe } = u;
  req.user = safe;
  res.json(mePayload(req));
});

/* ---------- guest mode (browse only; nothing is persisted server-side) ---------- */
router.post("/guest", (req, res) => {
  req.session.userId = null;
  req.session.isGuest = true;
  res.json({ authenticated: false, guest: true, user: null });
});

/* ---------- logout ---------- */
router.post("/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

/* ---------- who am I ---------- */
router.get("/me", (req, res) => res.json(mePayload(req)));

/* ---------- one-time merge of this device's LOCAL progress ----------
   The client sends EVENTS (story ids viewed/badged states/quiz rounds) —
   the server recomputes all points server-side. Points are never trusted. */
router.post("/merge", requireLogin, (req, res) => {
  const uid = req.user.id;
  const viewed = Array.isArray(req.body.viewed) ? req.body.viewed.slice(0, 500) : [];
  const stamps = Array.isArray(req.body.stamps) ? req.body.stamps.slice(0, 40) : [];
  const quiz = Array.isArray(req.body.quiz) ? req.body.quiz.slice(0, 100) : [];
  const heritageIds = new Set(db.prepare("SELECT id FROM heritage_records").all().map((r) => r.id));
  const stateNames = new Set(db.prepare("SELECT name FROM states").all().map((r) => r.name));
  let merged = { views: 0, stamps: 0, quiz: 0 };
  for (const v of viewed) {
    const id = cleanText(v && v.id, 60);
    if (!heritageIds.has(id)) continue;
    const before = rewards.getPoints(uid).points;
    const r = rewards.viewStory(uid, { id, cat: cleanText(v && v.cat, 30) });
    if (r.total > before) merged.views++;
  }
  for (const s of stamps) {
    const st = cleanText(s, 60);
    if (!stateNames.has(st)) continue;
    const r = rewards.stampState(uid, st);
    if (r.earned) merged.stamps++;
  }
  for (const q of quiz) {
    const score = Math.max(0, Math.min(2250, parseInt(q && q.score, 10) || 0));
    const correct = Math.max(0, Math.min(10, parseInt(q && q.correct, 10) || 0));
    const answered = Math.max(0, Math.min(10, parseInt(q && q.answered, 10) || 0));
    rewards.quizResult(uid, {
      mode: ["category", "state", "region"].includes(q && q.mode) ? q.mode : "category",
      key: cleanText(q && q.key, 60), score, correct, answered,
      pct: Math.max(0, Math.min(100, parseInt(q && q.pct, 10) || 0)),
    });
    merged.quiz++;
  }
  console.info(`[auth] merged local progress for user #${uid}:`, merged);
  res.json({ ok: true, merged, stats: rewards.statsFor(uid) });
});

module.exports = router;
