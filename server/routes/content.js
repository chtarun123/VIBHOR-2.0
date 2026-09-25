/* ============================================================
   VIBHOR — public content API
   states · curated heritage stories · real public counters
   (Reference data only — user numbers are computed, never seeded.)
   ============================================================ */
"use strict";
const express = require("express");
const { db } = require("../db");

const router = express.Router();

router.get("/states", (_req, res) => {
  res.json({
    states: db.prepare("SELECT * FROM states ORDER BY ut, name").all()
      .map((s) => ({ ...s, languages: JSON.parse(s.languages || "[]"), ut: !!s.ut })),
  });
});

router.get("/heritage", (req, res) => {
  const { cat, state, region, q } = req.query;
  const where = [];
  const params = {};
  if (cat) { where.push("cat = @cat"); params.cat = cat; }
  if (state) { where.push("state = @state"); params.state = state; }
  if (region) { where.push("region = @region"); params.region = region; }
  if (q) { where.push("(name LIKE @q OR descr LIKE @q)"); params.q = `%${q}%`; }
  res.json({
    items: db.prepare(
      `SELECT * FROM heritage_records ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY name`
    ).all(params).map((i) => ({ ...i, feat: JSON.parse(i.feat || "[]") })),
  });
});

/* real community counters for the homepage/community header — zero when empty */
router.get("/stats/public", (_req, res) => {
  res.json({
    explorers: db.prepare("SELECT COUNT(*) c FROM users").get().c,
    contributions: db.prepare("SELECT COUNT(*) c FROM challenge_entries").get().c,
    preserved: db.prepare("SELECT COUNT(*) c FROM archive_records").get().c,
  });
});

module.exports = router;
