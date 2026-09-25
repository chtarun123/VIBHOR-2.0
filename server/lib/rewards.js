/* ============================================================
   VIBHOR — server-side rewards engine (authoritative)
   The CLIENT never sends points. It sends events
   (viewed a story, listened, stamped a state, finished a quiz,
   submitted a challenge entry, preserved a document) and the
   SERVER computes points + badges using these rules.
   Mirrors the legacy client-side engine values so numbers
   feel identical to the previous frontend-only build.
   ============================================================ */
"use strict";
const { db } = require("../db");

const ACTIONS = {
  view: 10,       // first time per story per user
  listen: 15,     // per narration
  stamp: 100,     // per state/UT
  challenge: 50,  // first entry per challenge
  archive: 50,    // per preservation record (idempotent by record id)
};
const MAX_ROUND = 2250; // 10 questions × 225

const quizEarned = (score) => 20 + Math.round((score || 0) / 10);

const BADGES = [
  { id: "state5",   name: "Heritage Explorer",  e: "🗺️", bonus: 100, line: "Stamp 5 states in your passport.",                  need: 5,   cur: (s) => s.states },
  { id: "state12",  name: "Culture Champion",   e: "🏅", bonus: 250, line: "Stamp 12 states in your passport.",                 need: 12,  cur: (s) => s.states },
  { id: "state28",  name: "India Expert",       e: "🏆", bonus: 500, line: "Stamp 28 states — the grand badge.",                need: 28,  cur: (s) => s.states },
  { id: "quiz1",    name: "First Quest",        e: "🎲", bonus: 50,  line: "Complete your first quiz round.",                   need: 1,   cur: (s) => s.quizPlays },
  { id: "quiz60",   name: "Quiz Whiz",          e: "🎯", bonus: 100, line: "Score 60% or better in any quiz round.",            need: 60,  cur: (s) => Math.round((s.quizBest / MAX_ROUND) * 100) },
  { id: "quiz100",  name: "Perfect Scholar",    e: "🌟", bonus: 200, line: "Finish a round with every answer correct.",         need: 1,   cur: (s) => s.quizPerfects },
  { id: "fest8",    name: "Festival Master",    e: "🪔", bonus: 150, line: "Explore 8 festival stories across India.",          need: 8,   cur: (s) => s.viewedCats.festivals || 0 },
  { id: "food8",    name: "Food Expert",        e: "🍛", bonus: 150, line: "Explore 8 traditional food stories.",               need: 8,   cur: (s) => s.viewedCats.foods || 0 },
  { id: "amb15",    name: "Culture Ambassador", e: "🎖️", bonus: 200, line: "Explore 15 stories and play 3 quiz rounds.",        need: 1,   cur: (s) => (s.viewed >= 15 && s.quizPlays >= 3 ? 1 : Math.max(s.viewed / 15, s.quizPlays / 3)) },
  { id: "legend",   name: "Heritage Legend",    e: "👑", bonus: 300, line: "Earn 500+ heritage points.",                        need: 500, cur: (s) => s.points },
  { id: "preserver", name: "Heritage Preserver", e: "📜", bonus: 150, line: "Submit your first heritage document to the archive.", need: 1, cur: (s) => s.archives },
];

/* ---------- low-level helpers ---------- */
function ensurePoints(userId) {
  db.prepare(
    "INSERT INTO user_points (user_id) VALUES (?) ON CONFLICT(user_id) DO NOTHING"
  ).run(userId);
}
function getPoints(userId) {
  ensurePoints(userId);
  return db.prepare("SELECT * FROM user_points WHERE user_id = ?").get(userId);
}
function addActivity(userId, type, refId, meta) {
  db.prepare("INSERT INTO user_activity (user_id, type, ref_id, meta) VALUES (?, ?, ?, ?)").run(
    userId, type, refId || "", JSON.stringify(meta || {})
  );
}
function stampCount(userId) {
  return db.prepare("SELECT COUNT(DISTINCT ref_id) c FROM user_activity WHERE user_id = ? AND type = 'stamp'").get(userId).c;
}
function statsFor(userId) {
  const pts = getPoints(userId);
  const quiz = db.prepare(
    `SELECT COUNT(*) plays, COALESCE(MAX(score),0) best,
            COALESCE(SUM(correct),0) correct, COALESCE(SUM(answered),0) answered,
            COALESCE(SUM(CASE WHEN answered >= 10 AND correct = answered THEN 1 ELSE 0 END),0) perfects
     FROM quiz_results WHERE user_id = ?`
  ).get(userId);
  const viewed = db.prepare(
    "SELECT COUNT(*) c FROM user_activity WHERE user_id = ? AND type = 'view'"
  ).get(userId).c;
  const viewedCats = {};
  for (const row of db.prepare("SELECT meta FROM user_activity WHERE user_id = ? AND type = 'view'").all(userId)) {
    try { const c = JSON.parse(row.meta || "{}").cat; if (c) viewedCats[c] = (viewedCats[c] || 0) + 1; } catch (e) {}
  }
  return {
    points: pts.points,
    states: stampCount(userId),
    stories: pts.stories_count || viewed,
    listens: pts.listens || 0,
    challenges: pts.challenges_count || 0,
    archives: pts.archive_count || 0,
    viewed,
    viewedCats,
    quizPlays: quiz.plays,
    quizBest: quiz.best,
    quizPerfects: quiz.perfects,
    quizAnswered: quiz.answered,
    quizCorrect: quiz.correct,
  };
}
const earnStmts = {
  points: "UPDATE user_points SET points = points + ?, updated_at = datetime('now') WHERE user_id = ?",
  stories: "UPDATE user_points SET stories_count = stories_count + 1 WHERE user_id = ?",
  listens: "UPDATE user_points SET listens = listens + 1 WHERE user_id = ?",
  challenges: "UPDATE user_points SET challenges_count = challenges_count + 1 WHERE user_id = ?",
  archives: "UPDATE user_points SET archive_count = archive_count + 1 WHERE user_id = ?",
  states: "UPDATE user_points SET states_count = states_count + 1 WHERE user_id = ?",
};
function addPoints(userId, n) {
  ensurePoints(userId);
  db.prepare(earnStmts.points).run(n, userId);
}
function bump(userId, key) {
  ensurePoints(userId);
  db.prepare(earnStmts[key]).run(userId);
}

/* evaluate badges after a points-stat change; returns the newly earned badges */
function evalBadges(userId) {
  const s = statsFor(userId);
  const owned = new Set(db.prepare("SELECT badge_id FROM user_badges WHERE user_id = ?").all(userId).map((r) => r.badge_id));
  const fresh = [];
  for (const b of BADGES) {
    if (owned.has(b.id)) continue;
    if (b.cur(s) >= b.need) {
      db.prepare("INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?) ON CONFLICT DO NOTHING").run(userId, b.id);
      addPoints(userId, b.bonus);
      fresh.push({ ...b, earned: true });
    }
  }
  return fresh;
}

/* ---------- event handlers (the public API of this module) ---------- */
function viewStory(userId, { id, cat }) {
  ensurePoints(userId);
  const dup = db.prepare(
    "SELECT id FROM user_activity WHERE user_id = ? AND type = 'view' AND ref_id = ?"
  ).get(userId, id);
  let gained = 0;
  if (!dup) {
    gained = ACTIONS.view;
    db.prepare("INSERT INTO user_activity (user_id, type, ref_id, meta) VALUES (?, 'view', ?, ?)").run(
      userId, id, JSON.stringify({ cat: cat || "" })
    );
    bump(userId, "stories");
    addPoints(userId, gained);
  }
  const newBadges = evalBadges(userId);
  return { gained, total: statsFor(userId).points, newBadges };
}

function listenStory(userId, ref) {
  ensurePoints(userId);
  bump(userId, "listens");
  addPoints(userId, ACTIONS.listen);
  addActivity(userId, "listen", (ref && ref.id) || "", {});
  const newBadges = evalBadges(userId);
  return { gained: ACTIONS.listen, total: statsFor(userId).points, newBadges };
}

function stampState(userId, state) {
  ensurePoints(userId);
  const dup = db.prepare(
    "SELECT id FROM user_activity WHERE user_id = ? AND type = 'stamp' AND ref_id = ?"
  ).get(userId, state);
  let earned = 0;
  if (!dup) {
    earned = ACTIONS.stamp;
    bump(userId, "states");
    addPoints(userId, earned);
    addActivity(userId, "stamp", state, {});
  }
  const newBadges = evalBadges(userId);
  return { earned, total: statsFor(userId).points, newBadges };
}

function quizResult(userId, { mode, key, score, correct, answered, pct }) {
  ensurePoints(userId);
  db.prepare(
    "INSERT INTO quiz_results (user_id, mode, key_name, score, correct, answered, pct) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(userId, mode || "category", key || "", score | 0, correct | 0, answered | 0, pct | 0);
  const earned = quizEarned(score | 0);
  addPoints(userId, earned);
  addActivity(userId, "quiz", key || "", { mode, score: score | 0 });
  const newBadges = evalBadges(userId);
  return { earned, total: statsFor(userId).points, newBadges };
}

function challengeJoined(userId, code) {
  ensurePoints(userId);
  const dup = db.prepare(
    "SELECT id FROM user_activity WHERE user_id = ? AND type = 'challenge' AND ref_id = ?"
  ).get(userId, code);
  let earned = 0;
  if (!dup) {
    earned = ACTIONS.challenge;
    bump(userId, "challenges");
    addPoints(userId, earned);
    addActivity(userId, "challenge", code, {});
  }
  const newBadges = evalBadges(userId);
  return { earned, total: statsFor(userId).points, newBadges };
}

function archiveSubmitted(userId, recordId) {
  // idempotent by the record's own `awarded` flag — one reward per record, ever
  const rec = db.prepare("SELECT id, awarded FROM archive_records WHERE id = ? AND user_id = ?").get(recordId, userId);
  if (!rec || rec.awarded) {
    return { awarded: false, gained: 0, total: statsFor(userId).points, newBadges: [] };
  }
  db.prepare("UPDATE archive_records SET awarded = 1 WHERE id = ?").run(recordId);
  ensurePoints(userId);
  bump(userId, "archives");
  addPoints(userId, ACTIONS.archive);
  addActivity(userId, "archive", recordId, {});
  const newBadges = evalBadges(userId);
  return {
    awarded: true, gained: ACTIONS.archive,
    badge: newBadges.find((b) => b.id === "preserver") ? "preserver" : null,
    total: statsFor(userId).points, newBadges,
  };
}

function badgeList(userId) {
  const s = statsFor(userId);
  const owned = new Set(db.prepare("SELECT badge_id FROM user_badges WHERE user_id = ?").all(userId).map((r) => r.badge_id));
  return BADGES.map((b) => ({
    ...b,
    cur: Math.min(b.need, Math.floor(typeof b.cur === "function" ? b.cur(s) : 0)),
    earned: owned.has(b.id),
  }));
}

const LEVELS = [
  { min: 36, name: "India Expert",        e: "🏆", line: "All 36 states & UTs stamped — you are the living map of India." },
  { min: 28, name: "Culture Champion",    e: "🏅", line: "28 units stamped — a true champion of culture." },
  { min: 20, name: "Nation Wanderer",     e: "🧭", line: "20 units stamped — every region knows your footsteps." },
  { min: 16, name: "Heritage Explorer",   e: "🗺️", line: "16 units stamped — the road to mastery." },
  { min: 10, name: "Culture Voyager",     e: "🎒", line: "10 units stamped — momentum is on your side." },
  { min: 5,  name: "Heritage Traveler",   e: "🌄", line: "5 units stamped — the journey has truly begun." },
  { min: 1,  name: "Sprouting Wanderer",  e: "🌱", line: "Your first stamps are in — keep collecting!" },
  { min: 0,  name: "Blank Passport",      e: "📘", line: "Your passport is blank. Pick a state and make history." },
];
const levelFor = (n) => LEVELS.find((l) => n >= l.min) || LEVELS[LEVELS.length - 1];

module.exports = {
  ACTIONS, BADGES, LEVELS, MAX_ROUND,
  quizEarned, statsFor, evalBadges, badgeList, levelFor, getPoints, ensurePoints,
  viewStory, listenStory, stampState, quizResult, challengeJoined, archiveSubmitted,
};
