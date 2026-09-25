# VIBHOR — Indian Heritage Portal

One India. Four regions. Endless heritage.
A curated, multilingual, community-powered web application for India's
living culture: **120 curated heritage stories** (4 regions × 12 categories
× 10 stories), all **36 States & Union Territories**, heritage quiz,
passport & badges, community challenges with a real leaderboard, a
community **Heritage Archive**, multilingual **voice narration**, shared
**voice search**, and an on-device **AI Guide** — all served by a single
Node + SQLite backend.

---

## 1 · Install

Requirements: **Node.js 18+** (no build step, no bundler, no other tools).

```bash
npm install
```

That's it. `npm install` fetches the six runtime dependencies
(`express`, `express-session`, `better-sqlite3`, `bcryptjs`, `multer`,
`dotenv`). There is **no compile/transpile step** — the frontend is
hand-written HTML/CSS/JS served statically.

## 2 · Run

```bash
node server/server.js        # or:  npm start
```

Open **http://localhost:5000** in a browser.
Set `PORT=xxxx` to change the port. For production create a `.env` from
`.env.example` and set at least `SESSION_SECRET`.

Optional environment variables (all have safe dev defaults):

| Var | Purpose |
|---|---|
| `PORT` | Listening port (default `5000`) |
| `SESSION_SECRET` | Random string — **set in production** |
| `VIBHOR_AI_KEY` | AI Guide upgrade path — unused without a key; the built-in local knowledge engine always works |

## 3 · Database

* SQLite (WAL mode) at `database/vibhor.sqlite`, created automatically on
  first boot from `database/schema.sql`.
* **Zero seed users / zero fake submissions.** Reference content (36 states,
  120 stories, 5 community challenges) is baked in as static JSON/JS; the
  SQL database contains *user-generated* data only: accounts, quiz results,
  passport stamps, coachmarks, saved journeys, challenge entries, archive
  records, points, badges.
* To reset the app to factory state: stop the server and delete
  `database/vibhor.sqlite*` — it is rebuilt on next boot.

## 4 · Auth & uploads

* Passwords hashed with **bcrypt** (`bcryptjs`, 10 rounds).
* Sessions via `express-session` with an SQLite session store; the cookie
  is `HttpOnly`. Guests can read/browse/quiz/chat freely; **only saves and
  submissions require login** (progress merges into your account on
  sign-up — no progress is lost).
* Uploads (`multer`) validate MIME + size, sanitise filenames, are stored
  under `server/uploads/archive` and `server/uploads/challenges`, and are
  exposed at read-only `/uploads/…` URLs. Limits: **12 MB per file**,
  ≤ 12 pages per archive record, ≤ 1 image + 1 video per challenge entry.
* All scoring happens server-side — the client can never award itself
  points (`+10` story read, `+15` narration, quiz formula, `+50` first
  submission/challenge, badge bonuses end at the server's discretion).

## 5 · Voice: narration & microphone

* **Narration (detail pages):** real voices only — the dropdown lists
  exactly the voices your OS/browser exposes (`speechSynthesis.getVoices`,
  refreshed via `onvoiceschanged` + short polling). Play/Pause/Resume,
  Stop, Speed, Volume, Test. Long text is chunked (~200 chars) and
  `cancel()` is called before every `speak()` (Chrome quirk). Nothing is
  ever auto-spoken.
* **Microphone (hero · search · AI Guide):** one shared controller
  (`public/js/voice-input.js`) with independent instances, states
  🎤 idle / 🔴 listening / ⌛ processing / ✅ done / 🔒 denied / ⚠
  unavailable — browsers without `SpeechRecognition` get the disabled
  state with an honest tooltip.
* **Browsers:** Web Speech voices + recognition work in Chrome/Edge
  (desktop & Android). Firefox/Safari fall back gracefully (typing always
  works; narration uses OS voices where available).

## 6 · AI Guide

Local, offline knowledge engine (`public/js/chatbot.js`) over the shipped
120-item corpus + 256 culture entries — no API key needed, no network
calls. Typing indicator, follow-up chips, context-aware chips per page,
voice-in / TTS-out, and strict scroll isolation while open.

## 7 · Project layout

```
server/          Express app (routes/, middleware/, db.js, server.js)
database/        schema.sql + generated vibhor.sqlite
public/          Static frontend (HTML, css/, js/, data/, images/)
  js/data-*.js   Static corpus: 120 stories, 36 states, timelines, quiz banks
  js/content-*.js Multilingual packs: English · Hindi · Telugu · Tamil · Bengali
  images/        hero.jpg (the one bundled photograph — homepage hero)
server/uploads/  User uploads (created on demand)
```

### Image strategy (how story/card art works)

The app ships with **real, freely-licensed photographs** of all 120 stories,
12 categories, 4 regions and 36 states/UTs — the lead photograph of each
subject's own Wikipedia article, fetched from **Wikimedia Commons** once,
resized to 760 px (JPEG q78), and bundled under `public/images/…` (no
external hotlinks, fully offline). Full provenance + artist + license per
file: **`public/credits.txt`**.

`public/js/data-images.js` (auto-wired) assigns the photos onto the data
layer and is loaded on pages that load `js/data-*.js`. Every visual spot has
a graceful themed fallback: `script.js → ensureAssets()` renders a
deterministic maroon/gold SVG tile for any story whose image is ever
*blank*, so the app can never show a broken-image frame.

Replace any photo with your own: drop the file into `public/images/` and
set that story's `image` field in `public/js/data-*.js` (or edit
`js/data-images.js`). Express serves anything under `public/` at the root
path, so `/images/items/<id>.jpg`, `/images/states/<id>.jpg`, and
`/images/pool/<file>` all work automatically with zero config.

## 8 · Practical limits & deployment notes

* Files **≤ 12 MB** each; SQLite comfortably holds tens of thousands of
  users/entries on modest hardware. For heavy traffic put the app behind a
  reverse proxy (nginx) and serve `public/` statically there.
* HTTPS is strongly recommended in production (voice APIs require a secure
  context or `localhost`).
* The session cookie uses `Secure` automatically when served over HTTPS.
* Run as a plain node process (systemd/pm2). No migrations framework:
  `schema.sql` is idempotent (`CREATE TABLE IF NOT EXISTS`, columns added
  via `ALTER` guards).

## 9 · Verified state (acceptance audit)

Fresh-boot, empty-database audit AND real-browser flows (Chromium) were
executed: all 8 pages boot error-free; register/login/session round-trip;
upload to archive & challenge with real +50 awards; leaderboard/leaderboard
ranking from real users only; honest empty states everywhere; voice & mic
state machines verified with speech-API doubles; search below-navbar panel;
AI Guide scroll-lock; mobile 390×844 layout. See the repo history /
verification notes for details.
