import { getTotalXP, getStreak, todayISO, getState } from "./store.js";
import { ALL_CONCEPTS } from "./data.js";

const SESSION_KEY = "tmj_session";
const LEADERBOARD_KEY = "tmj_leaderboard";
const USERS_KEY = "tmj_users";

export async function checkServer() {
  return false;
}

export function baseUrl() { return ""; }
export function isServerAvailable() { return false; }

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function isLoggedIn() {
  return !!getSession();
}

export function setSession(s) {
  if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  else localStorage.removeItem(SESSION_KEY);
}

function getAllUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveAllUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export async function register(username, password) {
  if (!username || username.length < 3) {
    throw new Error("Username must be at least 3 characters");
  }
  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const users = getAllUsers();
  if (users[username]) {
    throw new Error("Username already exists");
  }

  users[username] = {
    password: hashPassword(password),
    xp: 0,
    chapters: 0,
    bestQuiz: 0,
    streak: 0,
    mocks: 0,
    activeDays: 0,
    lastSync: todayISO(),
  };
  saveAllUsers(users);

  const session = { username, token: "local_" + Math.random().toString(36).slice(2), rank: null, total: null };
  setSession(session);
  return session;
}

export async function login(username, password) {
  const users = getAllUsers();
  const user = users[username];
  
  if (!user || user.password !== hashPassword(password)) {
    throw new Error("Invalid username or password");
  }

  const session = { username, token: "local_" + Math.random().toString(36).slice(2), rank: null, total: null };
  setSession(session);
  return session;
}

export async function logout() {
  setSession(null);
}

export async function fetchLeaderboard() {
  const users = getAllUsers();
  const leaderboard = Object.entries(users)
    .map(([username, data]) => ({
      username,
      xp: data.xp || 0,
      chapters: data.chapters || 0,
      bestQuiz: data.bestQuiz || 0,
      streak: data.streak || 0,
      mocks: data.mocks || 0,
    }))
    .sort((a, b) => b.xp - a.xp)
    .map((entry, idx) => ({ ...entry, rank: idx + 1 }));

  const sess = getSession();
  const me = sess ? (leaderboard.find((u) => u.username === sess.username) || null) : null;
  return { list: leaderboard, me };
}

export async function syncProgress() {
  const s = getSession();
  if (!s) return null;

  const st = getState();
  const today = todayISO();
  const activeDays = Object.keys(st.activity || {}).filter((k) => st.activity[k] > 0).length;
  const bestQuiz = (st.quizBest && st.quizBest.best) || 0;

  const users = getAllUsers();
  if (users[s.username]) {
    users[s.username] = {
      password: users[s.username].password,
      xp: getTotalXP(ALL_CONCEPTS),
      chapters: st.completed.length,
      bestQuiz,
      streak: getStreak(),
      mocks: (st.mocks || []).length,
      activeDays,
      lastSync: today,
    };
    saveAllUsers(users);
  }

  const leaderboard = await fetchLeaderboard();
  const me = leaderboard.list.find((u) => u.username === s.username);
  
  s.rank = me ? me.rank : null;
  s.total = leaderboard.list.length;
  setSession(s);
  
  return leaderboard;
}

export async function serverUp() {
  return false;
}
