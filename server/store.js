/* ============================================================
   VIBHOR — SQLite-backed session store for express-session
   Sessions survive restarts; expired rows are swept hourly.
   ============================================================ */
"use strict";
const session = require("express-session");
const { db } = require("./db");

class SQLiteStore extends session.Store {
  constructor(options = {}) {
    super();
    this.table = options.table || "sessions";
    db.prepare(
      `CREATE TABLE IF NOT EXISTS ${this.table} (
         sid TEXT PRIMARY KEY,
         sess TEXT NOT NULL,
         expires INTEGER NOT NULL
       )`
    ).run();
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_${this.table}_expires ON ${this.table}(expires)`).run();
    this._get = db.prepare(`SELECT sess, expires FROM ${this.table} WHERE sid = ?`);
    this._put = db.prepare(
      `INSERT INTO ${this.table} (sid, sess, expires) VALUES (?, ?, ?)
       ON CONFLICT(sid) DO UPDATE SET sess=excluded.sess, expires=excluded.expires`
    );
    this._del = db.prepare(`DELETE FROM ${this.table} WHERE sid = ?`);
    this._sweep = db.prepare(`DELETE FROM ${this.table} WHERE expires < ?`);
    this._timer = setInterval(() => {
      try { this._sweep.run(Date.now()); } catch (e) { /* non-fatal */ }
    }, 60 * 60 * 1000);
    if (this._timer.unref) this._timer.unref();
  }

  get(sid, cb) {
    try {
      const row = this._get.get(sid);
      if (!row) return cb(null, null);
      if (row.expires < Date.now()) {
        this._del.run(sid);
        return cb(null, null);
      }
      cb(null, JSON.parse(row.sess));
    } catch (e) { cb(e); }
  }

  set(sid, sess, cb) {
    try {
      const expires =
        sess && sess.cookie && sess.cookie.expires
          ? new Date(sess.cookie.expires).getTime()
          : Date.now() + 14 * 24 * 60 * 60 * 1000;
      this._put.run(sid, JSON.stringify(sess), expires);
      cb && cb(null);
    } catch (e) { cb && cb(e); }
  }

  destroy(sid, cb) {
    try { this._del.run(sid); cb && cb(null); }
    catch (e) { cb && cb(e); }
  }

  touch(sid, sess, cb) {
    this.set(sid, sess, (e) => (cb ? cb(e) : undefined));
  }
}

module.exports = SQLiteStore;
