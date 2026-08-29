/* Full Notes — Physics part 3 (EMI → semiconductors). */

export const PHYS_NOTES_3 = {

"P-emi": {
mins: 22,
secs: [
{ t: "Faraday's law: changing flux makes EMF", h: `
<p>Magnetic flux Φ = B·A cosθ through a loop. Whenever flux <i>changes</i> — field strength, area, or orientation — an EMF appears:</p>
<div class="fml"><span class="fx">ε = −dΦ/dt · for N turns: ε = −N dΦ/dt</span><span class="fd">Faraday's law; minus is Lenz's signature</span></div>
<p><b>Lenz's law</b>: induced effects oppose the change causing them — energy conservation in disguise. Coil facing approaching magnet develops repelling pole; falling magnet slows inside a copper tube (eddy currents). Direction rule: curl right-hand fingers so thumb opposes flux change.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">100-turn coil, area 0.1 m², field 0.2 T ⊥ drops to zero in 0.4 s. EMF?</div>
<ol class="steps">
<li>ΔΦ = BA = 0.02 Wb per turn.</li>
<li>ε = NΔΦ/Δt = 100×0.02/0.4 = 5 V.</li>
</ol>
<div class="exa">5 V.</div></div>` },
{ t: "Motional EMF and rotating coils", h: `
<p>Rod of length l sliding at v across field B: charges separate until qE = qvB, giving <b>ε = Blv</b>. Rails problems combine this with circuit resistance to find current F = BIl retarding force — power balance P_mech = εI always holds.</p>
<p>Coil rotating at ω in uniform field: Φ = NBA cosωt ⇒ ε = NBAω sinωt — the AC generator equation. Peak EMF ε₀ = NBAω; RMS = ε₀/√2.</p>` },
{ t: "Self and mutual inductance", h: `
<p>A coil fighting its own flux change has self-inductance L: ε = −L dI/dt. Energy stored U = ½LI² lives in the magnetic field (density B²/2μ₀). Solenoid: L = μ₀n²Al. Two coupled coils share mutual M: ε₂ = −M dI₁/dt, with M ≤ √(L₁L₂).</p>
<div class="tblw"><table class="tbl">
<tr><th>Element</th><th>Behaviour on sudden change</th></tr>
<tr><td>Inductor at switch-on</td><td>acts like open switch (current grows gradually)</td></tr>
<tr><td>Inductor steady state</td><td>plain wire (ideal)</td></tr>
<tr><td>Current decay LR</td><td>I = I₀e^(−Rt/L), time constant L/R</td></tr>
</table></div>
<div class="trap"><b>Trap.</b> Opening a large-inductor circuit generates huge voltage spikes (spark) because dI/dt is enormous — why ignition coils work and why switches arc.</div>` },
{ t: "Eddy currents and applications", h: `
<p>Bulk conductors in changing fields develop swirling eddy currents: braking (trains, galvanometer damping), induction cooktops, metal detectors, induction motors. Laminated cores interrupt eddy loops, cutting transformer losses — the layering you see in transformer cores exists purely to fight eddies.</p>` },
],
cps: [
{ q: "A magnet falls through a copper tube. Compared with free fall it…", o: ["accelerates more", "falls slower (retarded)", "same speed", "shoots faster"], a: 1, e: "Induced eddy currents oppose the motion (Lenz) — magnetic braking.", after: 0 },
{ q: "Energy stored in inductor L carrying current I:", o: ["½LI", "½LI²", "L²I/2", "½LV²"], a: 1, e: "U = ½LI², stored in the magnetic field.", after: 2 },
],
fl: [
["Faraday EMF", "ε = −N dΦ/dt"],
["Motional EMF", "ε = Blv"],
["AC generator peak EMF", "NBAω"],
["Solenoid self-inductance", "μ₀n²Al"],
],
},

"P-ac": {
mins: 20,
secs: [
{ t: "Why AC quantities need RMS", h: `
<p>Mains voltage swings sinusoidally: V = V₀ sinωt. Since heating scales as V², the effective (RMS) value is what meters report:</p>
<div class="fml"><span class="fx">V_rms = V₀/√2 ≈ 0.707V₀ · I_rms = I₀/√2</span><span class="fd">India: 230 V rms → peak ≈325 V!</span></div>
<p>Average over a full cycle is zero for pure sine — that's why rectifier questions quote half-cycle averages (2V₀/π).</p>` },
{ t: "Reactance: AC-opposing behaviour of L and C", h: `
<div class="tblw"><table class="tbl">
<tr><th>Component</th><th>Reactance</th><th>Phase of I vs V</th><th>Frequency trend</th></tr>
<tr><td>Resistor R</td><td>R</td><td>in phase</td><td>none</td></tr>
<tr><td>Inductor L</td><td>X_L = ωL</td><td>I lags V by 90°</td><td>blocks high f ("choke")</td></tr>
<tr><td>Capacitor C</td><td>X_C = 1/ωC</td><td>I leads V by 90°</td><td>passes high f, blocks DC</td></tr>
</table></div>
<p>Series LCR impedance Z = √(R² + (X_L − X_C)²); phase tanφ = (X_L − X_C)/R. Phasor addition handles any mix — draw the triangle instead of memorising cases.</p>` },
{ t: "Resonance and power factor", h: `
<p>When X_L = X_C (ω₀ = 1/√LC) the reactive parts cancel: Z minimum = R, current maximum, voltage across L and C individually can exceed supply (Q-factor amplification!). Sharpness Q = ω₀L/R — radio tuning lives here.</p>
<div class="fml"><span class="fx">P_avg = V_rms I_rms cosφ · cosφ = R/Z</span><span class="fd">only the resistive part burns average power</span></div>
<p>At resonance cosφ = 1 (maximum power delivery). Pure L or C consumes zero average power — they borrow and return energy each cycle.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">LCR series: R=30 Ω, X_L=60 Ω, X_C=20 Ω, V_rms=50 V. Find Z, I, phase.</div>
<ol class="steps">
<li>Z = √(30² + 40²) = 50 Ω.</li>
<li>I = 50/50 = 1 A.</li>
<li>tanφ = 40/30 ⇒ φ ≈ 53° lagging (inductive).</li>
</ol>
<div class="exa">Z = 50 Ω, I = 1 A, lagging 53°; P = VIcosφ = 50×0.6 = 30 W.</div></div>` },
{ t: "Transformers", h: `
<p>Mutual induction between primary/secondary coils: V_s/V_p = N_s/N_p. Ideal: power conserved ⇒ I_p/I_s = N_s/N_p. Step-up raises V, lowers I (transmission lines love this: I²R losses shrink with the square). Real losses: copper (wire resistance), eddy currents (laminate!), hysteresis (soft iron), flux leakage. Efficiency typically 90–99%.</p>
<div class="trap"><b>Trap.</b> Transformers only work on AC — DC gives constant flux, zero induced secondary EMF (except during switching transients).</div>` },
],
cps: [
{ q: "Capacitive reactance at higher frequency…", o: ["rises", "falls", "constant", "infinite"], a: 1, e: "X_C = 1/ωC decreases — caps pass high frequencies.", after: 1 },
{ q: "At series resonance, impedance equals…", o: ["X_L + X_C", "R", "zero", "L/C"], a: 1, e: "Reactances cancel; Z = R (minimum).", after: 2 },
],
fl: [
["RMS vs peak", "V_rms = V₀/√2"],
["Inductive reactance", "X_L = ωL"],
["Resonance condition", "ω = 1/√LC"],
["Transformer ratio", "V_s/V_p = N_s/N_p"],
],
},

"P-emw": {
mins: 14,
secs: [
{ t: "Maxwell's leap: displacement current", h: `
<p>Ampère's law broke down between capacitor plates (no conduction current there, yet B exists). Maxwell patched it by adding the <b>displacement current</b> I_d = ε₀ dΦ_E/dt — a changing electric field acts like current for making magnetic fields. Symmetry restored: changing E makes B, changing B makes E, and the pair self-propagates as electromagnetic waves.</p>` },
{ t: "Properties of electromagnetic waves", h: `
<ul>
<li>In vacuum all EM waves travel c = 1/√(μ₀ε₀) ≈ 3×10⁸ m/s.</li>
<li>Transverse: E ⊥ B ⊥ propagation direction; E and B in phase, ratio E₀/B₀ = c.</li>
<li>Carry momentum p = U/c even with zero rest mass — radiation pressure P = U/c absorbed, 2U/c reflected.</li>
<li>Energy shared equally: u_E = u_B = ½ε₀E² averaged.</li>
</ul>
<div class="tblw"><table class="tbl">
<tr><th>Spectrum (increasing frequency)</th><th>Typical source/use</th></tr>
<tr><td>Radio → microwave</td><td>broadcast, radar, ovens</td></tr>
<tr><td>Infrared</td><td>heat radiation, remotes</td></tr>
<tr><td>Visible (400–700 nm)</td><td>the eye's window</td></tr>
<tr><td>UV → X-ray → gamma</td><td>ionising, medical imaging, nuclear transitions</td></tr>
</table></div>
<div class="tipbox"><b>Tip.</b> In media, v = c/n slows but frequency stays fixed (source-determined); wavelength shrinks by n. Frequency never changes crossing interfaces — a top MCQ discriminator.</div>` },
],
cps: [
{ q: "Crossing into glass from air, which wave property stays constant?", o: ["speed", "wavelength", "frequency", "all"], a: 2, e: "Source sets frequency; speed and wavelength drop by factor n.", after: 1 },
],
fl: [
["EM wave speed", "c = 1/√(μ₀ε₀)"],
["E–B relation", "E₀ = cB₀"],
["Radiation pressure (absorbing)", "P = U/c"],
],
},

"P-rayoptics": {
mins: 26,
secs: [
{ t: "Reflection toolkit", h: `
<p>Plane mirrors: image virtual, erect, laterally inverted, same size, distance behind = object distance. Rotating a mirror by θ rotates the reflected ray by 2θ — basis of many MCQs. Number of images between inclined mirrors: n = 360/θ (if integer, else floor).</p>
<p>Spherical mirrors obey 1/v + 1/u = 1/f with the sign convention: distances measured from pole, direction of incident light positive. Mirror focal length |f| = R/2.</p>
<div class="tblw"><table class="tbl">
<tr><th>Mirror</th><th>f sign</th><th>Object beyond C</th><th>Object inside F</th></tr>
<tr><td>Concave</td><td>negative</td><td>real, inverted, diminished→same size at C</td><td>virtual, erect, magnified</td></tr>
<tr><td>Convex</td><td>positive</td><td colspan="2">always virtual, erect, diminished (wide-view mirrors)</td></tr>
</table></div>
<div class="fml"><span class="fx">magnification m = −v/u (mirrors)</span><span class="fd">|m|&gt;1 enlarged; sign tells orientation</span></div>` },
{ t: "Refraction, total internal reflection", h: `
<p>Snell: n₁ sin i = n₂ sin r, n = c/v. Denser medium bends light toward normal. <b>TIR</b> needs dense→light and incidence beyond critical angle sinθ_c = n₂/n₁ (water-air 48.6°, glass-air ~42°): fibres, prisms mirroring binoculars, sparkling diamonds (θ_c tiny due to high n).</p>
<div class="ex"><div class="ext">Worked example — apparent depth</div>
<div class="exq">Pool 2 m deep, viewed from above. Apparent depth? (n_water = 4/3)</div>
<ol class="steps">
<li>Near-normal viewing: apparent = real/n = 2/(4/3) = 1.5 m.</li>
</ol>
<div class="exa">1.5 m — pools look shallower; shift = t(1 − 1/n).</div></div>` },
{ t: "Refraction at curved surfaces & lenses", h: `
<p>Lens-maker's equation builds lenses from radii and index:</p>
<div class="fml"><span class="fx">1/f = (n−1)(1/R₁ − 1/R₂) · lens formula 1/v − 1/u = 1/f · m = v/u</span><span class="fd">signs: convex f&gt;0, concave f&lt;0</span></div>
<p>Converging lens: real inverted images for objects beyond F; virtual erect magnified inside F (magnifying glass). Diverging lens: always virtual-erect-diminished. Power P = 1/f(m) in dioptres; thin lenses in contact add powers. Silvered lens = mirror: P_eq = 2P_lens + P_mirror.</p>
<div class="ex"><div class="ext">Worked example — combination</div>
<div class="exq">Two thin lenses +10 cm and −10 cm in contact. Net power?</div>
<ol class="steps">
<li>P = 100/f₁ + 100/f₂ = +10 − 10 = 0 D.</li>
<li>Acts like plain glass sheet.</li>
</ol>
<div class="exa">Zero power — afocal pair.</div></div>` },
{ t: "Prisms, dispersion, optical instruments", h: `
<p>Thin prism deviation δ = (n−1)A. Minimum deviation condition relates n = sin((A+δ_m)/2)/sin(A/2). Dispersion separates colours since n varies with λ (violet bends most); angular dispersion = δ_V − δ_R; achromatic combinations cancel it partially.</p>
<p>Microscope: objective forms magnified real image, eyepiece re-magnifies; M = (L/f_o)(D/f_e) normal adjustment, or M = (1 + D/f_e)(v_o/u_o). Telescope: M = f_o/f_e (large f_o collects light & magnifies). Tube length adjustments give near-point vs relaxed-eye versions — know both formulas.</p>
<div class="trap"><b>Trap.</b> Telescope magnification is f_o/f_e — students flip it. Also microscope objectives have tiny f; telescopes huge f_o.</div>` },
],
cps: [
{ q: "Critical angle for glass-air where n = 1.5:", o: ["≈42°", "≈48.6°", "30°", "60°"], a: 0, e: "sinθ_c = 1/1.5 ⇒ θ_c ≈ 41.8°.", after: 1 },
{ q: "Convex lens f = 20 cm, object at 15 cm. Image is…", o: ["real inverted", "virtual erect enlarged", "at infinity", "same size"], a: 1, e: "u < f ⇒ magnifying-glass mode: virtual, erect, enlarged.", after: 2 },
],
fl: [
["Mirror formula", "1/v + 1/u = 1/f"],
["Lens formula", "1/v − 1/u = 1/f"],
["Critical angle", "sinθ_c = 1/n"],
["Microscope magnification", "(L/f_o)(D/f_e)"],
],
},

"P-waveoptics": {
mins: 22,
secs: [
{ t: "Huygens' principle and coherence", h: `
<p>Every wavefront point is a fresh secondary source; the envelope of secondaries builds the next wavefront — reflection/refraction fall out geometrically. Interference needs <b>coherent</b> sources: same frequency, constant phase difference. Two independent lamps can't interfere (random phases); we split one source instead (Young's double slit, Lloyd's mirror, thin films).</p>` },
{ t: "Young's double-slit experiment", h: `
<div class="fml"><span class="fx">bright: Δx = nλ · dark: Δx = (n+½)λ · fringe width β = λD/d</span><span class="fd">D screen distance, d slit separation</span></div>
<ul>
<li>Fringe width uniform, proportional to λ — red fringes wider than blue.</li>
<li>Dipping setup in liquid: β shrinks by n.</li>
<li>Covering one slit kills interference (single-slit diffraction remains).</li>
<li>Slab of thickness t inserted: central max shifts by (n−1)tD/d toward that side.</li>
</ul>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">λ = 600 nm, D = 2 m, d = 0.6 mm. Fringe width?</div>
<ol class="steps">
<li>β = λD/d = 600e−9 × 2 / 0.6e−3.</li>
<li>= 2×10⁻³ m = 2 mm.</li>
</ol>
<div class="exa">2 mm.</div></div>` },
{ t: "Diffraction: single slit and resolution", h: `
<p>Light bending around edges. Single slit width a: dark minima at a sinθ = mλ; central bright band twice wider than others, intensity pattern decaying sidelobes. Diffraction matters when aperture ~ λ.</p>
<p><b>Resolution limits:</b> Rayleigh criterion θ_min = 1.22λ/D (telescope aperture D) — bigger mirrors resolve closer doubles. Microscopes fight diffraction too; electron microscopes win via tiny de Broglie λ.</p>
<div class="trap"><b>Trap.</b> Interference vs diffraction fringes: interference maxima equally bright; diffraction central maximum dominates. Double-slit reality: both together (envelope × comb).</div>` },
{ t: "Polarisation: light's transverse proof", h: `
<p>Only transverse waves polarise. Unpolarised light through polaroid loses half intensity; through analyser Malus' law I = I₀cos²θ. Crossed polaroids (θ=90°) extinguish completely. Brewster angle: reflected glare fully polarised when tanθ_B = n (≈53° water, 57° glass) — sunglasses logic. Scattered sky light partial polarisation explains polaroid photography tricks.</p>
<div class="ex"><div class="ext">Quick calc</div>
<div class="exq">Polarised beam I₀ hits analyser at 60°. Transmitted intensity?</div>
<ol class="steps">
<li>I = I₀cos²60° = I₀/4.</li>
</ol>
<div class="exa">25%.</div></div>` },
],
cps: [
{ q: "Fringe width in Young's experiment if whole setup dips underwater:", o: ["increases n×", "decreases n×", "unchanged", "zero"], a: 1, e: "λ_medium = λ/n ⇒ β shrinks n-fold.", after: 1 },
{ q: "Malus' law at θ = 45° passes fraction…", o: ["1/2", "1/4", "√2/2 of amplitude squared = 1/2? yes", "3/4"], a: 0, e: "cos²45° = ½.", after: 3 },
],
fl: [
["Fringe width", "β = λD/d"],
["Single-slit minima", "a sinθ = mλ"],
["Rayleigh criterion", "θ_min = 1.22λ/D"],
["Brewster angle", "tanθ_B = n"],
],
},

"P-dual": {
mins: 18,
secs: [
{ t: "Photons: light as particles", h: `
<p>Photoelectric effect forced the quantum view: light delivers energy in packets E = hf = hc/λ, momentum p = E/c = h/λ. Key experimental facts a wave picture cannot explain:</p>
<ul>
<li>Emission is instantaneous below threshold intensity — no energy accumulation delay.</li>
<li>Kinetic energy depends on frequency, not intensity: KE_max = hf − φ (Einstein's equation).</li>
<li>Below threshold frequency φ/h nothing escapes regardless of brightness.</li>
<li>Stopping potential eV₀ = KE_max measures the max kinetic energy.</li>
</ul>
<div class="fml"><span class="fx">hf = φ + KE_max · threshold λ₀ = hc/φ</span><span class="fd">work function φ is material-specific</span></div>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Light 400 nm hits metal φ = 2.0 eV. Stopping potential?</div>
<ol class="steps">
<li>E = 1240/400 = 3.1 eV (handy shortcut: E(eV) = 1240/λ(nm)).</li>
<li>KE_max = 3.1 − 2.0 = 1.1 eV ⇒ V₀ = 1.1 V.</li>
</ol>
<div class="exa">1.1 V.</div></div>` },
{ t: "Matter waves and de Broglie", h: `
<p>Nature's symmetry: if waves act like particles, particles act like waves. De Broglie wavelength λ = h/p = h/mv = h/√(2mK). Electrons diffract off crystals exactly as X-rays do (Davisson–Germer) — confirming wave nature of matter.</p>
<div class="tblw"><table class="tbl">
<tr><th>Situation</th><th>λ scaling</th></tr>
<tr><td>Same K, different mass</td><td>λ ∝ 1/√m (protons shorter than electrons)</td></tr>
<tr><td>Accelerated charge (qV volts)</td><td>λ = h/√(2mqV) ⇒ λ ∝ 1/√V</td></tr>
<tr><td>Photon vs electron same λ</td><td>photon carries more energy (no mass term)</td></tr>
</table></div>
<div class="tipbox"><b>Tip.</b> Heavier particles → absurdly small λ → classical behaviour emerges. Wave nature shows only for microscopic masses/momenta — the bridge principle (Bohr correspondence) in action.</div>` },
{ t: "Uncertainty outlook", h: `
<p>Simultaneously knowing position and momentum has a hard floor: Δx·Δp ≥ ħ/2. Electron orbits "spread" rather than trace paths; diffraction of a narrow beam illustrates: squeezing position broadens momentum spread. This closes the door on exact trajectories — probability amplitudes take over in full quantum mechanics.</p>` },
],
cps: [
{ q: "Doubling light intensity (above threshold) changes photoelectron KE how?", o: ["doubles", "halves", "unchanged (max)", "quadruples"], a: 2, e: "Intensity adds photons, not per-photon energy; KE_max set by frequency alone.", after: 0 },
{ q: "If electron momentum doubles, de Broglie wavelength…", o: ["doubles", "halves", "/4", "/√2"], a: 1, e: "λ = h/p inversely proportional.", after: 1 },
],
fl: [
["Photon energy", "E = hf = hc/λ"],
["Einstein photoelectric eqn", "hf = φ + KE_max"],
["de Broglie wavelength", "h/mv"],
["nm↔eV shortcut", "E(eV) = 1240/λ(nm)"],
],
},

"P-atoms": {
mins: 24,
secs: [
{ t: "Alpha scattering → nuclear atom", h: `
<p>Rutherford fired α-particles at gold foil: most sailed through (atom mostly empty), some bounced hard off something small, heavy, positive — the nucleus (~10⁻¹⁵ m vs atom 10⁻¹⁰ m, 10⁻⁴ linear scale, 10⁻¹² volume fraction). Distance of closest approach r₀ = 2Ze²/4πε₀K for head-on α of kinetic energy K. But orbiting electrons should spiral in classically — contradiction needing Bohr.</p>` },
{ t: "Bohr model: quantised orbits", h: `
<p>Bohr postulated: electrons occupy stationary states with angular momentum mvr = nh/2π; photons carry transition energies hf = E_i − E_f. For hydrogen (Z=1):</p>
<div class="tblw"><table class="tbl">
<tr><th>Quantity</th><th>n-dependence</th><th>Ground value</th></tr>
<tr><td>Radius rₙ</td><td>∝ n²/Z</td><td>0.529 Å</td></tr>
<tr><td>Speed vₙ</td><td>∝ Z/n</td><td>c/137</td></tr>
<tr><td>Energy Eₙ</td><td>−13.6 Z²/n² eV</td><td>−13.6 eV</td></tr>
</table></div>
<p>Total energy negative (bound); K = −E, U = 2E. Ionisation from level n: +13.6/n² eV. Series names: Lyman (to n=1, UV), Balmer (to 2, visible), Paschen (to 3, IR)…</p>
<div class="ex"><div class="ext">Worked example — spectral lines count</div>
<div class="exq">Electron falls to ground state from n = 4. How many distinct wavelengths possible?</div>
<ol class="steps">
<li>Pairs of levels: C(4,2) = 4×3/2 = 6.</li>
</ol>
<div class="exa">6 lines (4→3→2→1 chains plus direct jumps).</div></div>` },
{ t: "Nuclei: binding and radioactivity", h: `
<p>Nucleus = protons + neutrons held by strong force; mass defect Δm converts to binding energy BE = Δmc², peaking near iron (≈8.8 MeV/nucleon) — fusion joins light nuclei upward, fission splits heavy ones downward, both releasing energy.</p>
<p>Radioactive decay law: dN/dt = −λN ⇒ N = N₀e^(−λt), half-life T½ = ln2/λ. Activity A = λN curies/becquerel. Alpha (He nucleus, stopped by paper), beta (electron/positron, aluminium), gamma (photon, lead) — penetrating powers differ hugely.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Sample halves every 5 days. Fraction left after 15 days?</div>
<ol class="steps">
<li>15/5 = 3 half-lives.</li>
<li>(1/2)³ = 1/8.</li>
</ol>
<div class="exa">12.5% remains — exponential, never quite zero.</div></div>` },
{ t: "Nuclear reactions in one breath", h: `
<p>Conservation laws govern every nuclear equation: charge number A and mass number Z tally both sides. Q-value = (mass_initial − mass_final)c²; positive Q releases energy. Fission of U-235 chains via neutron multiplication (critical mass!); fusion in stars needs Coulomb-barrier tunnelling at millions K. Mass-energy equivalence underwrites them all: 1 u ↔ 931.5 MeV.</p>
<div class="trap"><b>Trap.</b> Half-life questions with "after how long will it be 99% decayed?" need logs, not integer multiples: t = T½·log₂(100/remaining%).</div>` },
],
cps: [
{ q: "Radius of nth Bohr orbit scales as…", o: ["n", "n²", "1/n²", "n³"], a: 1, e: "rₙ ∝ n²/Z.", after: 1 },
{ q: "After 4 half-lives, remaining fraction:", o: ["1/4", "1/8", "1/16", "1/32"], a: 2, e: "(1/2)⁴ = 1/16.", after: 2 },
],
fl: [
["Hydrogen ground energy", "−13.6 eV"],
["Bohr radius", "0.529 Å"],
["Half-life relation", "T½ = 0.693/λ"],
["Mass-energy conversion", "1 u = 931.5 MeV"],
],
},

"P-semi": {
mins: 20,
secs: [
{ t: "Bands: insulator, conductor, semiconductor", h: `
<p>Electron energies bunch into bands separated by gaps. Conductors: overlapping bands → free carriers always. Insulators: wide gap (&gt;3 eV) blocks flow. Semiconductors: small gap (~1 eV; Si 1.1, Ge 0.7) — thermal excitation creates electron-hole pairs, conductivity rising sharply with temperature (negative temperature coefficient, opposite of metals!).</p>
<p>Doping engineers carriers: pentavalent (As, P) donors make n-type (electrons majority); trivalent (In, B) acceptors make p-type (holes majority). Both types stay neutral overall — doping adds charge carriers, not net charge.</p>` },
{ t: "The p-n junction diode", h: `
<p>Junction diffusion leaves a depletion region and built-in potential barrier (~0.7 V Si, 0.3 V Ge). Bias decides everything:</p>
<div class="tblw"><table class="tbl">
<tr><th>Bias</th><th>Depletion width</th><th>Current</th></tr>
<tr><td>Forward (p to +)</td><td>shrinks</td><td>exponential surge after knee voltage</td></tr>
<tr><td>Reverse (p to −)</td><td>widens</td><td>tiny saturation leakage (minority carriers)</td></tr>
</table></div>
<p>Diode equation I = I₀(e^(eV/kT) − 1) explains asymmetric I–V curve — the basis of rectification. Half-wave rectifier conducts alternately; full-wave bridge uses both halves, giving ripple frequency 2× mains.</p>` },
{ t: "Special diodes and applications", h: `
<ul>
<li><b>Zener</b>: reverse breakdown at designed voltage, used as voltage regulator (operates reverse-biased deliberately).</li>
<li><b>LED</b>: forward-biased recombination emits photons; colour = band gap (blue needs wide-gap material).</li>
<li><b>Photodiode/solar cell</b>: light generates carriers; operated reverse (detector) or delivering power (cell).</li>
</ul>
<div class="ex"><div class="ext">Worked example — Zener regulator</div>
<div class="exq">12 V input, Zener 5 V, load 500 Ω. Series resistance dropping 7 V safely (ignore Zener current min)?</div>
<ol class="steps">
<li>Load current = 5/500 = 10 mA.</li>
<li>R must pass ≥ 10 mA at drop 7 V ⇒ R ≤ 700 Ω; pick R = 350 Ω giving 20 mA split between load and Zener (10 mA spare keeps regulation).</li>
</ol>
<div class="exa">R ≈ 350 Ω keeps Zener regulating with margin.</div></div>` },
{ t: "Logic gates: digital building blocks", h: `
<div class="tblw"><table class="tbl">
<tr><th>Gate</th><th>Output true when…</th><th>Note</th></tr>
<tr><td>AND</td><td>both inputs 1</td><td>series switches</td></tr>
<tr><td>OR</td><td>any input 1</td><td>parallel switches</td></tr>
<tr><td>NOT</td><td>input 0</td><td>inverter</td></tr>
<tr><td>NAND</td><td>NOT of AND</td><td><b>universal gate</b> — builds everything</td></tr>
<tr><td>NOR</td><td>NOT of OR</td><td>universal too</td></tr>
<tr><td>XOR</td><td>inputs differ</td><td>parity/adders</td></tr>
</table></div>
<p>De Morgan: (A+B)' = A'·B' and (AB)' = A'+B' — simplifies circuits instantly. JEE asks gate-output tables and universal-gate conversions; practise writing truth tables fast.</p>` },
],
cps: [
{ q: "Semiconductor resistance when heated:", o: ["increases", "decreases", "constant", "first up then down"], a: 1, e: "More carrier generation wins ⇒ resistance falls (NTC).", after: 0 },
{ q: "Which single gate can build every other gate?", o: ["XOR", "AND", "NAND", "OR"], a: 2, e: "NAND (and NOR) are universal.", after: 3 },
],
fl: [
["Si band gap", "≈1.1 eV"],
["Diode knee (Si)", "≈0.7 V forward"],
["Zener operates in", "reverse breakdown region"],
["De Morgan first law", "(A+B)' = A'B'"],
],
},
};