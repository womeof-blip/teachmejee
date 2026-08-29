/* JEE Planner — simulation registry. Importing this file registers all sims. */

import "./simsA.js";
import "./simsB.js";
import "./simsB2.js";
import "./simsC.js";
import "./simsBio.js";
import "./simsD.js";
import { SIM_FOR_CONCEPT as MAP_D } from "./simsD.js";
import { SIM_FOR_CONCEPT as MAP_E } from "./simsE.js";

export { mountSim, hasSim } from "./engine.js";
export const CONCEPT_SIM_MAP = { ...MAP_D, ...MAP_E };
