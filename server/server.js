/* ============================================================
   VIBHOR — server entry point
   npm install && npm start  →  http://localhost:5000
   ============================================================ */
"use strict";
require("dotenv").config();
const path = require("path");
const express = require("express");
const session = require("express-session");

const { init, db, ROOT } = require("./db");
const SQLiteStore = require("./store");
const { loadUser } = require("./middleware/auth");
const { uploadError } = require("./middleware/upload");

const PORT = parseInt(process.env.PORT, 10) || 5000;
const SESSION_SECRET = process.env.SESSION_SECRET || "vibhor-dev-secret-change-me";
if (!process.env.SESSION_SECRET) {
  console.warn("[server] SESSION_SECRET not set — using the development default. Set it in .env for production.");
}

init(); // schema + reference seed (no fake user data, ever)

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(express.json({ limit: "256kb" }));
app.use(express.urlencoded({ extended: false, limit: "256kb" }));

app.use(
  session({
    store: new SQLiteStore({ table: "sessions" }),
    name: "vibhor.sid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 14 * 24 * 60 * 60 * 1000, // 2 weeks
      secure: process.env.COOKIE_SECURE === "1",
    },
  })
);
app.use(loadUser);

/* ---------- static ---------- */
app.use(express.static(path.join(ROOT, "public"), { index: "index.html", maxAge: "1h" }));
app.use("/uploads", express.static(path.join(ROOT, "server", "uploads"), { maxAge: "7d" }));

/* ---------- api ---------- */
app.use("/api/auth", require("./routes/auth"));
const userRoutes = require("./routes/user");
app.use("/api/user", userRoutes.router);
app.use("/api/progress", userRoutes.progressRouter);
app.use("/api/passport", userRoutes.passportRouter);
app.use("/api/quiz", userRoutes.quizRouter);
app.use("/api", require("./routes/community"));   // /api/challenges… /api/leaderboard
app.use("/api/archive", require("./routes/archive"));
app.use("/api", require("./routes/content"));     // /api/states /api/heritage /api/stats/public
app.use("/api", require("./routes/misc"));        // /api/newsletter /api/ai/config

app.use("/api", uploadError);

/* ---------- 404 for unknown API paths ---------- */
app.use("/api", (_req, res) => res.status(404).json({ error: "NOT_FOUND" }));

app.listen(PORT, () => {
  console.info(`\n🪔  VIBHOR running → http://localhost:${PORT}`);
  const stats = db.prepare("SELECT COUNT(*) c FROM heritage_records").get().c;
  console.info(`    ${stats} curated heritage stories · SQLite at ${db.name === "" ? "(disk)" : "database/vibhor.sqlite"}\n`);
});
