/* ============================================================
   VIBHOR — misc endpoints
   newsletter (stored for real) · AI Guide capability probe
   ============================================================ */
"use strict";
const express = require("express");
const { db } = require("../db");
const { cleanText, EMAIL_RE } = require("../middleware/auth");

const router = express.Router();

router.post("/newsletter", (req, res) => {
  const email = cleanText(req.body.email, 120).toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "VALIDATION", field: "email", message: "Please enter a valid email address." });
  }
  db.prepare("INSERT INTO newsletter (email) VALUES (?) ON CONFLICT(email) DO NOTHING").run(email);
  res.status(201).json({ ok: true });
});

/* AI Guide runs on the LOCAL heritage knowledge base — no key required.
   This probe only tells the UI whether a future server-side LLM is wired,
   without exposing any secret. Keys live only in server env vars. */
router.get("/ai/config", (_req, res) => {
  res.json({
    engine: "local-knowledge-base",
    llmConfigured: !!(process.env.AI_LLM_ENDPOINT && process.env.AI_LLM_API_KEY),
  });
});

module.exports = router;
