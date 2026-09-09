/* JEE Planner — simulation registry. Importing this file registers all sims. */

import "./simsA.js";
import "./simsB.js";
import "./simsB2.js";
import "./simsC.js";
import "./simsBio.js";
import "./simsBio2.js";
import "./simsD.js";
import { SIM_FOR_CONCEPT as MAP_D } from "./simsD.js";
import { SIM_FOR_CONCEPT as MAP_E } from "./simsE.js";
import "./simsF.js";
import { SIM_FOR_CONCEPT as MAP_F } from "./simsF.js";
import "./simsG.js";
import { SIM_FOR_CONCEPT as MAP_G } from "./simsG.js";
import "./simsH.js";
import { SIM_FOR_CONCEPT as MAP_H } from "./simsH.js";
import "./simsI.js";
import { SIM_FOR_CONCEPT as MAP_I } from "./simsI.js";
import "./simsJ.js";
import { SIM_FOR_CONCEPT as MAP_J } from "./simsJ.js";

export { mountSim, hasSim } from "./engine.js";
export const CONCEPT_SIM_MAP = { ...MAP_D, ...MAP_E, ...MAP_F, ...MAP_G, ...MAP_H, ...MAP_I, ...MAP_J };
