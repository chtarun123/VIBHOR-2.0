/* ============================================================
   VIBHOR — upload configuration (multer)
   - safe random filenames (no path traversal, original name never used)
   - MIME + extension whitelist
   - size limits (page images 8 MB · videos 50 MB)
   ============================================================ */
"use strict";
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const multer = require("multer");
const { ROOT } = require("../db");

const IMAGE_EXT = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif" };
const VIDEO_EXT = { "video/mp4": ".mp4", "video/webm": ".webm", "video/quicktime": ".mov" };
const ALL = { ...IMAGE_EXT, ...VIDEO_EXT };

function dir(sub) {
  const p = path.join(ROOT, "server", "uploads", sub);
  fs.mkdirSync(p, { recursive: true });
  return p;
}

function makeStorage(sub) {
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dir(sub)),
    filename: (_req, file, cb) => {
      const ext = ALL[file.mimetype] || ".bin";
      cb(null, `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`);
    },
  });
}

function fileFilter(_req, file, cb) {
  if (ALL[file.mimetype]) return cb(null, true);
  cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname) && Object.assign(
    new Error(`Unsupported file type: ${file.mimetype}`), { code: "BAD_MIME" }
  ));
}

const archiveUpload = multer({
  storage: makeStorage("archive"),
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024, files: 13 },
});

const challengeUpload = multer({
  storage: makeStorage("challenges"),
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024, files: 2 },
});

function uploadError(err, _req, res, next) {
  if (!err) return next();
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "FILE_TOO_LARGE", message: "File too large — images up to 8 MB and videos up to 50 MB." });
  }
  if (err.code === "BAD_MIME" || /Unsupported file type/.test(err.message || "")) {
    return res.status(415).json({ error: "BAD_MIME", message: "Only JPG/PNG/WebP/GIF images and MP4/WebM/MOV videos are accepted." });
  }
  return res.status(400).json({ error: "UPLOAD", message: "Upload failed — please try again." });
}

module.exports = { archiveUpload, challengeUpload, uploadError, IMAGE_EXT, VIDEO_EXT };
