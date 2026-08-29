/* JEE Planner — planning engine: countdown, phases, daily schedule generation */

import { CONCEPTS, LEVELS, ALL_CONCEPTS } from "./data.js";
import { getState } from "./store.js";

export function daysUntil(isoDate) {
  if (!isoDate) return null;
  const d = new Date(isoDate + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((d - now) / 86400000);
}

export function fmt(dateIso) {
  if (!dateIso) return "—";
  const d = new Date(dateIso + "T00:00:00");
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

/* Study phases between today and the exam. */
export function computePhases(daysToAdv) {
  if (!daysToAdv || daysToAdv <= 0) return [];
  const total = daysToAdv;
  const foundation = Math.round(total * 0.2);
  const main = Math.round(total * 0.4);
  const adv = total - foundation - main;
  return [
    { name: "Foundation & Class 11", days: foundation, pct: Math.round((foundation / total) * 100), desc: "Unlock every Level 0–1 node: basics, mole concept, kinematics, functions, bonding." },
    { name: "Class 12 + JEE Main", days: main, pct: Math.round((main / total) * 100), desc: "Clear Level 2–3 nodes. Daily practice of PYQs; one full mock each week." },
    { name: "JEE Advanced depth", days: adv, pct: Math.round((adv / total) * 100), desc: "Level 4 nodes, previous-year Advanced problems, mock analysis, revision sprints." },
  ];
}

/* A recommended daily schedule from the roadmap, ordered by prerequisites. */
export function generateSchedule(days) {
  const state = getState();
  const completed = new Set(state.completed);
  const queue = ALL_CONCEPTS
    .filter((c) => c.prereq.every((p) => completed.has(p)) && !completed.has(c.id))
    .sort((a, b) => a.level - b.level || a.xp - b.xp);
  return queue;
}

/* Generate a week of daily tasks: each day = 2–3 study slots. */
export function weekTasks(daysLeft) {
  const tasks = [];
  const state = getState();
  const completed = new Set(state.completed);
  const today = new Date();
  const queue = generateSchedule(daysLeft);

  const slots = [
    { type: "Practice", label: "20 PYQs on previous concepts" },
    { type: "Revision", label: "Revise formulas of completed chapters (formula sheet)" },
  ];

  for (let d = 0; d < 7; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const dayKey = date.toISOString().slice(0, 10);
    const items = [];
    if (queue.length) {
      const pick = queue[d % queue.length];
      if (pick) {
        items.push({ type: "Study", text: pick.name, id: pick.id, href: `#/chapter/${pick.id}` });
      }
    }
    for (const s of slots) {
      items.push({ type: s.type, text: s.label, id: `${dayKey}-${s.type}`, href: null });
    }
    tasks.push({ date, dayKey, items });
  }
  return tasks;
}

/* Rough weekly study-hour plan based on daily hours. */
export function weeklyPlan(hoursPerDay) {
  const subjects = ["Physics", "Chemistry", "Mathematics"];
  const weights = { Physics: 0.38, Chemistry: 0.3, Mathematics: 0.32 };
  return subjects.map((s) => ({
    subject: s,
    hours: Math.round(hoursPerDay * 7 * weights[s] * 10) / 10,
  }));
}
