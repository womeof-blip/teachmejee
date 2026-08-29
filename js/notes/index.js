/* TeachMeJEE — Full Notes registry.
   DEEP_NOTES[chapterId] = { mins, secs:[{t, h}], cps:[{q,o,a,e,after}], fl:[[front,back]…] }
   Content files are grouped by subject; index merges them into one map. */

import { PHYS_NOTES_1 } from "./p1.js";
import { PHYS_NOTES_2 } from "./p2.js";
import { PHYS_NOTES_3 } from "./p3.js";
import { CHEM_NOTES_1 } from "./c1.js";
import { CHEM_NOTES_2 } from "./c2.js";
import { CHEM_NOTES_3 } from "./c3.js";
import { MATH_NOTES_1 } from "./m1.js";
import { MATH_NOTES_2 } from "./m2.js";
import { ADVANCED_NOTES } from "./advanced.js";

export const DEEP_NOTES = Object.assign({},
  PHYS_NOTES_1, PHYS_NOTES_2, PHYS_NOTES_3,
  CHEM_NOTES_1, CHEM_NOTES_2, CHEM_NOTES_3,
  MATH_NOTES_1, MATH_NOTES_2, ADVANCED_NOTES);

export const DEEP_NOTE_IDS = Object.keys(DEEP_NOTES);

export function hasDeepNotes(id) {
  return !!DEEP_NOTES[id];
}

/* Rough reading-time estimate (words / 180 wpm) if mins is not authored. */
export function noteMinutes(note) {
  if (note.mins) return note.mins;
  let words = 0;
  for (const s of note.secs) words += String(s.h).replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  for (const c of note.cps || []) words += String(c.q + " " + (c.e || "")).split(/\s+/).length;
  return Math.max(3, Math.round(words / 170));
}
