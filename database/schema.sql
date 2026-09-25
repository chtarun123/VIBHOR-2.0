-- ============================================================
-- VIBHOR — SQLite schema (final build)
-- Real users, real interactions, real community data.
-- No seed user content. Seeded reference data only:
-- states, heritage_records (curated stories), challenges.
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL CHECK (length(name) BETWEEN 2 AND 40),
  email       TEXT    NOT NULL UNIQUE COLLATE NOCASE,
  pass_hash   TEXT    NOT NULL,
  lang        TEXT    NOT NULL DEFAULT 'en' CHECK (lang IN ('en','hi','te','ta','bn')),
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  sid      TEXT    PRIMARY KEY,
  sess     TEXT    NOT NULL,
  expires  INTEGER NOT NULL  -- unix epoch (ms)
);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires);

-- 28 states + 8 UTs (36 units) — reference data, seeded from the
-- same public/js/data-states.js the frontend uses (one source of truth)
CREATE TABLE IF NOT EXISTS states (
  name      TEXT PRIMARY KEY,
  region    TEXT NOT NULL,
  capital   TEXT NOT NULL,
  languages TEXT NOT NULL DEFAULT '[]', -- JSON array
  ut        INTEGER NOT NULL DEFAULT 0,
  emoji     TEXT NOT NULL DEFAULT '🗺️',
  color     TEXT NOT NULL DEFAULT '#D4AF37',
  landmark  TEXT NOT NULL DEFAULT '',
  famous    TEXT NOT NULL DEFAULT ''
);

-- the 120 curated heritage stories — reference data for journeys/search/API
CREATE TABLE IF NOT EXISTS heritage_records (
  id      TEXT PRIMARY KEY,
  name    TEXT NOT NULL,
  cat     TEXT NOT NULL,
  region  TEXT NOT NULL,
  state   TEXT NOT NULL,
  city    TEXT NOT NULL DEFAULT '',
  img     TEXT NOT NULL DEFAULT '',
  descr   TEXT NOT NULL DEFAULT '',
  hist    TEXT NOT NULL DEFAULT '',
  feat    TEXT NOT NULL DEFAULT '[]', -- JSON array(3)
  imp     TEXT NOT NULL DEFAULT '',
  wiki    TEXT NOT NULL DEFAULT ''
);

-- 5 real community challenges (definitions only — counts are computed)
CREATE TABLE IF NOT EXISTS challenges (
  code      TEXT PRIMARY KEY,
  name      TEXT NOT NULL,
  icon      TEXT NOT NULL,
  descr     TEXT NOT NULL DEFAULT '',
  kind      TEXT NOT NULL DEFAULT 'entry'  -- 'entry' (media submission) | 'archive' (links to Heritage Archive)
);

CREATE TABLE IF NOT EXISTS challenge_entries (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_code TEXT    NOT NULL REFERENCES challenges(code) ON DELETE CASCADE,
  title          TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 60),
  descr          TEXT NOT NULL DEFAULT '',
  state          TEXT NOT NULL DEFAULT '',
  category       TEXT NOT NULL DEFAULT '',
  image_path     TEXT NOT NULL DEFAULT '',
  video_path     TEXT NOT NULL DEFAULT '',
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_entries_user ON challenge_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_entries_code ON challenge_entries(challenge_code);

-- community Heritage Archive — real preservation records only
CREATE TABLE IF NOT EXISTS archive_records (
  id          TEXT PRIMARY KEY, -- HVA-YYYY-XXXXX (server-generated)
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 80),
  state       TEXT NOT NULL,
  district    TEXT NOT NULL DEFAULT '',
  language    TEXT NOT NULL DEFAULT 'other'
                CHECK (language IN ('en','hi','te','ta','bn','other')),
  category    TEXT NOT NULL DEFAULT 'other',
  age         TEXT NOT NULL DEFAULT 'Unknown',
  descr       TEXT NOT NULL DEFAULT '',
  contributor TEXT NOT NULL DEFAULT '',
  pages       TEXT NOT NULL DEFAULT '[]', -- JSON array of stored page paths
  video_path  TEXT NOT NULL DEFAULT '',
  status      TEXT NOT NULL DEFAULT 'submitted'
                CHECK (status IN ('submitted','under-review','verified')),
  awarded     INTEGER NOT NULL DEFAULT 0, -- 1 once the +50 reward landed (idempotent)
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_archive_user ON archive_records(user_id);
CREATE INDEX IF NOT EXISTS idx_archive_state ON archive_records(state);

CREATE TABLE IF NOT EXISTS quiz_results (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mode       TEXT NOT NULL,             -- 'category' | 'state' | 'region'
  key_name   TEXT NOT NULL DEFAULT '',  -- category key, state name or region key
  score      INTEGER NOT NULL DEFAULT 0,
  correct    INTEGER NOT NULL DEFAULT 0,
  answered   INTEGER NOT NULL DEFAULT 0,
  pct        INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_quiz_user ON quiz_results(user_id);

-- ledger of learning events (story views, narrations, stamps, joins…)
CREATE TABLE IF NOT EXISTS user_activity (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,  -- view | listen | stamp | challenge | archive | quiz | journey
  ref_id     TEXT NOT NULL DEFAULT '',
  meta       TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_activity_user ON user_activity(user_id);

-- single source of truth for counters (derived only by the server)
CREATE TABLE IF NOT EXISTS user_points (
  user_id          INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  points           INTEGER NOT NULL DEFAULT 0,
  states_count     INTEGER NOT NULL DEFAULT 0,
  stories_count    INTEGER NOT NULL DEFAULT 0,
  listens          INTEGER NOT NULL DEFAULT 0,
  challenges_count INTEGER NOT NULL DEFAULT 0,
  archive_count    INTEGER NOT NULL DEFAULT 0,
  updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS user_badges (
  user_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id  TEXT NOT NULL,
  earned_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, badge_id)
);

CREATE TABLE IF NOT EXISTS saved_journeys (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL DEFAULT 'My Heritage Journey',
  days       INTEGER NOT NULL DEFAULT 5,
  interests  TEXT NOT NULL DEFAULT '[]', -- JSON array
  stops      TEXT NOT NULL DEFAULT '[]', -- JSON array of stop objects
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_journeys_user ON saved_journeys(user_id);

CREATE TABLE IF NOT EXISTS newsletter (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT NOT NULL UNIQUE COLLATE NOCASE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
