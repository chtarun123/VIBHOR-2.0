/* ============================================================
   VIBHOR — database layer (better-sqlite3)
   - auto-creates the schema on first run (database/schema.sql)
   - seeds REFERENCE data only (states / curated heritage / challenges)
   - the reference data comes from the very same public/js data files
     the browser uses — one source of truth, nothing duplicated
   - NO users, entries, archive records, points or badges are seeded
   Run directly with `node server/db.js --reseed` to rebuild reference data.
   ============================================================ */
"use strict";
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const DB_PATH = process.env.DB_PATH || path.join(ROOT, "database", "vibhor.sqlite");
const SCHEMA_PATH = path.join(ROOT, "database", "schema.sql");

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const Database = require("better-sqlite3");
const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

/* ---------- load the public data files in a sandbox window ---------- */
function loadPublicData() {
  const sandbox = {
    window: {},
    document: { addEventListener() {} },
    console,
    fetch: () => Promise.resolve({ ok: false, json: async () => [] }),
  };
  sandbox.window = sandbox; // both `window.X` and bare globals resolve
  vm.createContext(sandbox);
  for (const f of [
    "data-core.js",
    "data-items-1.js",
    "data-items-2.js",
    "data-states.js",
    "quiz-data.js",
    "passport-data.js",
  ]) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, "public", "js", f), "utf8"), sandbox, { filename: f });
  }
  return {
    items: sandbox.HERITAGE.items,
    categories: sandbox.HERITAGE.categories,
    regions: sandbox.HERITAGE.regions,
    states: sandbox.HERITAGE_STATES.map((s) => s), // array-like + .get()
    passport: sandbox.HERITAGE_PASSPORT,
    quiz: sandbox.HERITAGE_QUIZ,
  };
}

/* ---------- challenges are real product definitions (no fake counts) ---------- */
const CHALLENGE_DEFS = [
  { code: "photo",    icon: "📸", name: "Heritage Photography",
    descr: "Capture a heritage site, street art, festival moment or craft in its truest light. One image, your story in 30 words.", kind: "entry" },
  { code: "dance",    icon: "💃", name: "Folk Dance Reel",
    descr: "Share a short clip of a folk dance — Bihu, Bhangra, Lavani, Garba, Chhau… Show the rhythm your region carries.", kind: "entry" },
  { code: "food",     icon: "🍛", name: "Traditional Food",
    descr: "Plate a dish your family has cooked for generations. Name the dish, tell its story and the festival it belongs to.", kind: "entry" },
  { code: "story",    icon: "📖", name: "Monument Storytelling",
    descr: "Write or record a 60-second storytelling piece about any Indian monument — its builder, its secret, its sound.", kind: "entry" },
  { code: "preserve", icon: "📜", name: "Heritage Preservation",
    descr: "Digitize an old cultural document — a religious book, manuscript, recipe book or family record — and add it to the community Heritage Archive.", kind: "archive" },
];

/* prepared lazily — the schema may not exist yet at module load time */
const _stmts = {};
const stmts = () => {
  if (!_stmts.insertState) {
    _stmts.insertState = db.prepare(`
      INSERT INTO states (name, region, capital, languages, ut, emoji, color, landmark, famous)
      VALUES (@name, @region, @capital, @languages, @ut, @emoji, @color, @landmark, @famous)
      ON CONFLICT(name) DO UPDATE SET region=excluded.region, capital=excluded.capital,
        languages=excluded.languages, ut=excluded.ut, emoji=excluded.emoji, color=excluded.color,
        landmark=excluded.landmark, famous=excluded.famous`);
    _stmts.insertHeritage = db.prepare(`
      INSERT INTO heritage_records (id, name, cat, region, state, city, img, descr, hist, feat, imp, wiki)
      VALUES (@id, @name, @cat, @region, @state, @city, @img, @descr, @hist, @feat, @imp, @wiki)
      ON CONFLICT(id) DO UPDATE SET name=excluded.name, cat=excluded.cat, region=excluded.region,
        state=excluded.state, city=excluded.city, img=excluded.img, descr=excluded.descr,
        hist=excluded.hist, feat=excluded.feat, imp=excluded.imp, wiki=excluded.wiki`);
    _stmts.insertChallenge = db.prepare(`
      INSERT INTO challenges (code, name, icon, descr, kind) VALUES (@code, @name, @icon, @descr, @kind)
      ON CONFLICT(code) DO UPDATE SET name=excluded.name, icon=excluded.icon, descr=excluded.descr, kind=excluded.kind`);
  }
  return _stmts;
};

function seed() {
  const data = loadPublicData();
  const s = stmts();
  const passportByName = new Map((data.passport.states || []).map((p) => [p.name, p]));
  const tx = db.transaction(() => {
    for (const st of data.states) {
      const p = passportByName.get(st.name) || {};
      s.insertState.run({
        name: st.name,
        region: st.region || p.region || "",
        capital: st.capital || "",
        languages: JSON.stringify(st.languages || []),
        ut: st.ut ? 1 : 0,
        emoji: st.emoji || p.emoji || "🗺️",
        color: st.color || p.color || "#D4AF37",
        landmark: p.landmark || "",
        famous: p.famous || (st.t && st.t.en ? st.t.en.famous || "" : ""),
      });
    }
    for (const i of data.items) {
      s.insertHeritage.run({
        id: i.id, name: i.name, cat: i.cat, region: i.region, state: i.state,
        city: i.city || "", img: i.img || "", descr: i.desc || "", hist: i.hist || "",
        feat: JSON.stringify(i.feat || []), imp: i.imp || "", wiki: i.wiki || "",
      });
    }
    for (const c of CHALLENGE_DEFS) s.insertChallenge.run(c);
  });
  tx();
  const counts = {
    states: db.prepare("SELECT COUNT(*) c FROM states").get().c,
    heritage_records: db.prepare("SELECT COUNT(*) c FROM heritage_records").get().c,
    challenges: db.prepare("SELECT COUNT(*) c FROM challenges").get().c,
  };
  console.info(`[db] reference seed ok — ${counts.states} states/UTs · ${counts.heritage_records} heritage stories · ${counts.challenges} challenges`);
  return counts;
}

function init() {
  db.exec(fs.readFileSync(SCHEMA_PATH, "utf8"));
  const hasStates = db.prepare("SELECT COUNT(*) c FROM states").get().c === 36;
  const hasItems = db.prepare("SELECT COUNT(*) c FROM heritage_records").get().c === 120;
  if (!hasStates || !hasItems) seed();
  else console.info("[db] schema ok — reference data already present");
}

module.exports = { db, init, seed, loadPublicData, CHALLENGE_DEFS, DB_PATH, ROOT };

/* direct run: node server/db.js --reseed */
if (require.main === module) {
  init();
  if (process.argv.includes("--reseed")) {
    seed();
    console.info("[db] reseed complete");
  }
}
