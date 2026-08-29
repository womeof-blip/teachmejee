/* TeachMeJEE — local server: static files + auth + leaderboard + progress sync.
   Run:  node server.js   →  http://localhost:8000   (keep open while using the app) */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(ROOT, "server-data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const PORT = Number(process.env.PORT) || 8000;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".woff2": "font/woff2",
};

fs.mkdirSync(DATA_DIR, { recursive: true });

function loadUsers() {
  try { return JSON.parse(fs.readFileSync(USERS_FILE, "utf8")).users || {}; }
  catch { return {}; }
}
let USERS = loadUsers();

function persistUsers() {
  const tmp = USERS_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify({ users: USERS }, null, 2));
  fs.renameSync(tmp, USERS_FILE);
}

function send(res, code, data) {
  const body = JSON.stringify(data);
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (c) => { raw += c; if (raw.length > 64 * 1024) reject(new Error("too large")); });
    req.on("end", () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch { reject(new Error("bad json")); }
    });
    req.on("error", reject);
  });
}

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}
const VALID_USER = /^[a-zA-Z0-9_.-]{3,24}$/;

function publicStats(u) {
  return {
    username: u.username,
    xp: u.xp || 0,
    chapters: u.chapters || 0,
    bestQuiz: u.bestQuiz || 0,
    streak: u.streak || 0,
    mocks: u.mocks || 0,
    updated: u.updated || 0,
  };
}

function leaderboard(meToken) {
  const list = Object.values(USERS)
    .map((u) => ({ ...publicStats(u) }))
    .sort((a, b) => b.xp - a.xp || b.chapters - a.chapters || b.bestQuiz - a.bestQuiz || a.username.localeCompare(b.username));
  const me = meToken ? Object.values(USERS).find((u) => u.token === meToken) : null;
  return { list, me: me ? { ...publicStats(me), rank: list.findIndex((r) => r.username === me.username) + 1 } : null };
}

function route(req, res, body) {
  const url = req.url.split("?")[0];

  if (req.method === "OPTIONS") {
    res.writeHead(204, { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization" });
    return res.end();
  }

  if (url === "/api/register" && req.method === "POST") {
    const { username, password } = body || {};
    if (typeof username !== "string" || !VALID_USER.test(username)) return send(res, 400, { error: "Username must be 3-24 letters, numbers, dots, dashes or underscores." });
    if (typeof password !== "string" || password.length < 4) return send(res, 400, { error: "Password must be at least 4 characters." });
    if (USERS[username]) return send(res, 409, { error: "That username is already taken." });
    const salt = crypto.randomBytes(16).toString("hex");
    const token = crypto.randomBytes(32).toString("hex");
    USERS[username] = { username, salt, hash: hashPassword(password, salt), token, xp: 0, chapters: 0, bestQuiz: 0, streak: 0, mocks: 0, created: Date.now(), updated: Date.now() };
    persistUsers();
    return send(res, 201, { token, username, ...publicStats(USERS[username]) });
  }

  if (url === "/api/login" && req.method === "POST") {
    const { username, password } = body || {};
    const u = typeof username === "string" ? USERS[username] : null;
    if (!u || typeof password !== "string" || u.hash !== hashPassword(password, u.salt)) return send(res, 401, { error: "Wrong username or password." });
    u.token = crypto.randomBytes(32).toString("hex");
    u.updated = Date.now();
    persistUsers();
    return send(res, 200, { token: u.token, username, ...publicStats(u) });
  }

  if (url === "/api/logout" && req.method === "POST") {
    const { token } = body || {};
    if (typeof token === "string") {
      const u = Object.values(USERS).find((x) => x.token === token);
      if (u) { delete u.token; persistUsers(); }
    }
    return send(res, 200, { ok: true });
  }

  if (url === "/api/leaderboard" && req.method === "GET") {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    return send(res, 200, leaderboard(token));
  }

  if (url === "/api/sync" && req.method === "POST") {
    const { token } = body || {};
    const u = typeof token === "string" ? Object.values(USERS).find((x) => x.token === token) : null;
    if (!u) return send(res, 401, { error: "Not logged in." });
    const num = (v) => (Number.isFinite(v) ? Math.max(0, Math.round(v)) : 0);
    u.xp = num(body.xp);
    u.chapters = num(body.chapters);
    u.bestQuiz = num(body.bestQuiz);
    u.streak = num(body.streak);
    u.mocks = num(body.mocks);
    u.updated = Date.now();
    persistUsers();
    return send(res, 200, leaderboard(token));
  }

  if (url.startsWith("/api/")) return send(res, 404, { error: "Unknown endpoint." });

  return serveStatic(res, url);
}

function serveStatic(res, url) {
  let file = decodeURIComponent(url === "/" ? "/index.html" : url);
  let abs = path.normalize(path.join(ROOT, file));
  if (!abs.startsWith(ROOT)) {
    res.writeHead(403); return res.end("Forbidden");
  }
  fs.stat(abs, (err, st) => {
    if (err || !st.isFile()) {
      res.writeHead(404); return res.end("Not found");
    }
    res.writeHead(200, { "Content-Type": MIME[path.extname(abs).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-cache" });
    fs.createReadStream(abs).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  readBody(req)
    .then((body) => route(req, res, body))
    .catch((e) => send(res, 400, { error: e.message }));
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("TeachMeJEE server running");
  console.log("  Open  http://localhost:" + PORT + "  in your browser");
  console.log("  Press Ctrl+C to stop.");
});
