/* Full Notes — Physics part 2 (COM → magnetism). */

export const PHYS_NOTES_2 = {

"P-com": {
mins: 24,
secs: [
{ t: "Centre of mass: the balance point", h: `
<p>Replace a whole system by one point — the centre of mass — whose motion obeys Newton's laws as if all mass and all external forces were concentrated there. For discrete masses x_cm = Σmᵢxᵢ/Σmᵢ; for continuous bodies integrate. Symmetry shortcuts: CM of a uniform ring is its centre; of an L-shaped lamina, split into rectangles and use the weighted average.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">2 kg at origin, 3 kg at (4 m, 0). Where is the CM?</div>
<ol class="steps">
<li>x_cm = (2×0 + 3×4)/(2+3) = 12/5.</li>
</ol>
<div class="exa">x_cm = 2.4 m from the 2 kg mass — closer to the heavier one, as intuition says.</div></div>` },
{ t: "Motion of the CM and momentum conservation", h: `
<p>Differentiating M·a_cm = F_ext gives the master result: with no external force, <b>total momentum is conserved and the CM keeps uniform velocity</b> — even while parts fly apart chaotically. A bomb exploding mid-air: fragments scatter, yet the CM continues on the original parabola.</p>
<div class="fml"><span class="fx">M v_cm = Σmᵢvᵢ = const (if F_ext = 0)</span><span class="fd">rocket, recoil, explosion problems all live here</span></div>
<div class="ex"><div class="ext">Worked example — recoil</div>
<div class="exq">60 kg skater throws 3 kg ball forward at 10 m/s. Recoil speed?</div>
<ol class="steps">
<li>Initial momentum zero ⇒ 60v + 3×10 = 0.</li>
<li>v = −30/60 = −0.5 m/s (backward).</li>
</ol>
<div class="exa">0.5 m/s backward; CM of the system stays put.</div></div>` },
{ t: "Collisions: elastic, inelastic, perfectly inelastic", h: `
<div class="tblw"><table class="tbl">
<tr><th>Type</th><th>Conserved?</th><th>Key results (m₁ hits stationary m₂)</th></tr>
<tr><td>Elastic</td><td>momentum + KE</td><td>v₁ = (m₁−m₂)/(m₁+m₂)·u ; v₂ = 2m₁/(m₁+m₂)·u</td></tr>
<tr><td>Inelastic</td><td>momentum only</td><td>coefficient of restitution e = |relative separation speed| / |relative approach speed| ∈ [0,1]</td></tr>
<tr><td>Perfectly inelastic (stick together)</td><td>momentum only</td><td>v_common = m₁u/(m₁+m₂); ΔK = ½μu² lost (μ = reduced mass)</td></tr>
</table></div>
<ul>
<li>Equal masses in elastic collision <b>swap velocities</b> — the billiard-ball special case.</li>
<li>e = 1 elastic, e = 0 sticky; general case uses e in both momentum and restitution equations.</li>
<li>In 2D collisions conserve momentum componentwise; elastic ones also conserve K.</li>
</ul>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">1 kg moving 6 m/s hits resting 2 kg elastically. Final speeds?</div>
<ol class="steps">
<li>v₁ = (1−2)/3 × 6 = −2 m/s (rebounds).</li>
<li>v₂ = 2×1/3 × 6 = 4 m/s.</li>
<li>Check K: ½(1)(36) = 18 J → ½(1)(4) + ½(2)(16) = 2+16 = 18 ✓.</li>
</ol>
<div class="exa">1 kg bounces back at 2 m/s; 2 kg leaves at 4 m/s.</div></div>` },
{ t: "Variable-mass systems", h: `
<p>Rockets and conveyor belts need momentum bookkeeping per instant: F_ext = m(dv/dt) + v_rel(dm/dt) sign conventions matter. Rocket equation: Δv = u_rel ln(m₀/m_f). Conveyor belt: the belt feels horizontal force λv² where λ is mass per length being accelerated onto it.</p>
<div class="trap"><b>Trap.</b> In belt problems the "lost" energy (belt does work λv² but gains KE only ½λv²) becomes heat/friction — half always dissipates. Classic Advanced-level trap.</div>` },
],
cps: [
{ q: "Fragments of an exploding projectile mid-flight: their CM…", o: ["stops", "follows the original parabola", "moves straight up", "falls straight down"], a: 1, e: "Internal explosion forces can't move the CM; external force (gravity) still acts on total mass.", after: 1 },
{ q: "Elastic head-on collision, equal masses, target at rest:", o: ["both move at u/2", "projectile stops, target takes u", "both rebound", "target moves 2u"], a: 1, e: "Velocity-swap special case.", after: 2 },
],
fl: [
["CM definition (discrete)", "Σmx/Σm"],
["Perfectly inelastic energy loss", "ΔK = ½ μ u²"],
["Coefficient of restitution range", "0 ≤ e ≤ 1"],
["Rocket thrust", "v_rel · dm/dt"],
],
},

"P-fluids": {
mins: 24,
secs: [
{ t: "Elasticity essentials", h: `
<p>Solids deform under stress (force/area), producing strain (fractional deformation). Hooke's regime: stress ∝ strain, slope = Young's modulus Y (tensile), bulk modulus B (pressure/volumetric), shear modulus G (shape). Energy stored per volume = ½×stress×strain = ½Y(strain)². Beyond the yield point comes plastic flow; breaking stress is tensile strength.</p>
<div class="fml"><span class="fx">Y = (F/A)/(ΔL/L) · ΔL = FL/(AY) · U/V = ½·stress·strain</span><span class="fd">stretching a wire</span></div>
<div class="tipbox"><b>Tip.</b> Thermal-stress problems: clamped rod heated by ΔT behaves like needing force F = YAαΔT to hold it — equate that to elastic restoring force.</div>` },
{ t: "Pressure, buoyancy, Archimedes", h: `
<p>Pressure at depth h in a static fluid: p = p₀ + ρgh (Pascal). Pascal's law gives hydraulic lifts: small force on small piston lifts huge weight on large piston (F₁/A₁ = F₂/A₂). Archimedes: buoyant force = weight of displaced fluid; float condition ρ_body ≤ ρ_fluid, fraction submerged = ρ_body/ρ_fluid.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Ice (ρ=900) floats in water (ρ=1000). What fraction hides below?</div>
<ol class="steps">
<li>Fraction submerged = ρ_ice/ρ_water = 900/1000 = 0.9.</li>
</ol>
<div class="exa">90% below, 10% above — the tip of the iceberg, literally.</div></div>` },
{ t: "Fluid dynamics: continuity and Bernoulli", h: `
<p>Ideal fluid picture (incompressible, non-viscous, steady):</p>
<div class="fml"><span class="fx">A₁v₁ = A₂v₂ · p + ½ρv² + ρgh = const along a streamline</span><span class="fd">mass conservation + energy per unit volume</span></div>
<p>Consequences JEE loves: speed high ⇒ pressure low (airfoil lift direction, spinning-ball Magnus effect, blowing over paper). Torricelli: efflux speed from a hole depth h below surface is √(2gh) — same as free fall. Range of jet maximised when hole is at half the liquid height.</p>
<div class="ex"><div class="ext">Worked example — Venturi</div>
<div class="exq">Pipe narrows from area 2A to A; upstream speed v, pressure difference?</div>
<ol class="steps">
<li>Continuity: narrow section speed = 2v.</li>
<li>Bernoulli (level pipe): Δp = ½ρ((2v)² − v²) = 3ρv²/2.</li>
</ol>
<div class="exa">Δp = 1.5 ρv², lower pressure at the throat.</div></div>` },
{ t: "Viscosity, Stokes, surface tension", h: `
<p>Viscosity η is internal friction: F = ηA(dv/dx). Poiseuille: flow rate through a tube ∝ R⁴/η — halving radius slashes flow 16×. Stokes' law F = 6πηrv gives terminal velocity v_t = 2r²g(ρ_s−ρ_f)/9η for spheres. Surface tension γ (force per length, N/m): excess pressure inside a bubble 4γ/r (soap film has two surfaces), 2γ/r for a drop; capillary rise h = 2γcosθ/(rρg).</p>
<div class="trap"><b>Trap.</b> Terminal velocity scales with r² — small raindrops drift, big ones hurt. Also soap bubble pressure is double a drop's because of two surfaces.</div>` },
],
cps: [
{ q: "Efflux speed from a tank hole at depth h:", o: ["√(gh)", "√(2gh)", "2√(gh)", "√(ρgh)"], a: 1, e: "Torricelli's theorem — identical to free-fall speed from height h.", after: 2 },
{ q: "Flow rate through a tube if radius halves (fixed pressure drop)?", o: ["halves", "quarters", "/8", "/16"], a: 3, e: "Poiseuille ∝ R⁴ ⇒ (1/2)⁴ = 1/16.", after: 3 },
],
fl: [
["Bernoulli equation", "p + ½ρv² + ρgh = const"],
["Capillary rise formula", "h = 2γcosθ/(rρg)"],
["Excess pressure in soap bubble", "4γ/r"],
["Terminal velocity (Stokes)", "2r²g(ρs−ρf)/9η"],
],
},

"P-thermal": {
mins: 20,
secs: [
{ t: "Temperature, heat, thermal expansion", h: `
<p>Temperature measures average translational kinetic energy per molecule; heat is energy in transit because of temperature difference. Expansion: ΔL = LαΔT (linear), ΔA = 2αAΔT, ΔV = 3αVΔT ≈ VγΔT. Anomalous water between 0–4 °C (contracts on warming) keeps lakes alive in winter.</p>
<div class="tipbox"><b>Tip.</b> Pendulum clocks run slow in summer (l longer ⇒ T larger). Compensated pendulums use mixed metals. Thermal-expansion clock questions are recurring PYQ material.</div>` },
{ t: "Calorimetry", h: `
<p>Heat needed without phase change: Q = mcΔT (c = specific heat). With phase change: Q = mL (latent heat, no temperature change during melting/boiling). Mixing problems are just bookkeeping:</p>
<div class="fml"><span class="fx">Σ (heat gained) = Σ (heat lost)</span><span class="fd">watch out for crossing 0 °C or 100 °C — final state may include phase mixture</span></div>
<div class="ex"><div class="ext">Worked example — with a consistency check</div>
<div class="exq">200 g steam at 100 °C is passed into 1 kg water at 20 °C. Excess steam escapes once the mixture boils. Find the final state. (L_v = 540 cal/g, c = 1 cal/g°C)</div>
<ol class="steps">
<li>Try "all 200 g condenses": heat given = 200×540 = 108000 cal exceeds what cold water can absorb reaching 100 °C (1000×80 = 80000) — contradiction.</li>
<li>So final state is boiling water at 100 °C with leftover steam.</li>
<li>Steam needed: m×540 = 80000 ⇒ m ≈ 148 g.</li>
</ol>
<div class="exa">Final temperature 100 °C; ~148 g steam condensed, ~52 g unused — always verify your assumed final state is physically possible.</div></div>` },
{ t: "Heat transfer: conduction, convection, radiation", h: `
<div class="tblw"><table class="tbl">
<tr><th>Mode</th><th>Law</th><th>Medium</th></tr>
<tr><td>Conduction</td><td>dQ/dt = kA·ΔT/L (series rods: same rate, add thermal resistances)</td><td>solids mostly</td></tr>
<tr><td>Convection</td><td>bulk fluid motion (gravity-driven)</td><td>fluids</td></tr>
<tr><td>Radiation</td><td>P = εσA(T⁴ − T₀⁴), σ = 5.67×10⁻⁸</td><td>vacuum OK</td></tr>
</table></div>
<p>Kirchhoff's radiation law: good absorbers are good emitters (ε→1 blackbody). Newton's cooling (small ΔT): dT/dt ∝ −(T−T₀), exponential approach; used in "tea cooling" numericals via log ratios.</p>
<div class="ex"><div class="ext">Worked example — rods in series</div>
<div class="exq">Rod A (k, L) joined to rod B (2k, L); ends held at 100 °C and 0 °C. Junction temperature?</div>
<ol class="steps">
<li>Same current of heat: kA(100−T)/L = 2kA(T−0)/L.</li>
<li>100 − T = 2T ⇒ T = 33.3 °C.</li>
</ol>
<div class="exa">≈33 °C. The better conductor B needs only half the temperature gradient for the same heat flow, so most of the drop happens across A.</div></div>` },
],
cps: [
{ q: "During boiling at fixed pressure, supplied heat goes to…", o: ["raising temperature", "latent heat only", "both equally", "nothing"], a: 1, e: "Phase change absorbs latent heat at constant temperature.", after: 1 },
{ q: "Doubling absolute temperature of a blackbody multiplies radiated power by", o: ["2", "4", "8", "16"], a: 3, e: "P ∝ T⁴ (Stefan–Boltzmann).", after: 2 },
],
fl: [
["Latent heat meaning", "heat for phase change at constant T"],
["Series conduction rule", "same heat rate, resistances add"],
["Newton's law of cooling", "rate ∝ temperature excess (small ΔT)"],
["Thermal stress force", "F = YAαΔT"],
],
},

"P-thermo": {
mins: 22,
secs: [
{ t: "The zeroth and first laws", h: `
<p><b>Zeroth law:</b> bodies in mutual equilibrium share a temperature — the license to use thermometers. <b>First law</b> is energy conservation with heat made explicit:</p>
<div class="fml"><span class="fx">ΔU = Q − W_by_gas</span><span class="fd">sign convention: W positive when gas expands</span></div>
<p>Internal energy U of an ideal gas depends only on temperature: ΔU = nCvΔT. Heat and work are path-dependent (areas under p–V curves); U is a state function — the asymmetry drives every engine analysis.</p>` },
{ t: "Processes you must know cold", h: `
<div class="tblw"><table class="tbl">
<tr><th>Process</th><th>Constraint</th><th>Work / key facts</th></tr>
<tr><td>Isochoric</td><td>V const</td><td>W = 0, Q = ΔU = nCvΔT</td></tr>
<tr><td>Isobaric</td><td>p const</td><td>W = pΔV, Q = nCpΔT</td></tr>
<tr><td>Isothermal</td><td>T const</td><td>W = nRT ln(V₂/V₁), ΔU = 0, Q = W</td></tr>
<tr><td>Adiabatic</td><td>Q = 0</td><td>W = −ΔU; pv^γ const; TV^(γ−1) const</td></tr>
<tr><td>Cyclic</td><td>returns to start</td><td>ΔU = 0 ⇒ net Q = net W = loop area</td></tr>
</table></div>
<p>Mayer relation Cp − Cv = R. For monatomic ideal gas Cv = 3R/2, γ = 5/3; diatomic Cv = 5R/2, γ = 7/5. Adiabats fall steeper than isotherms on p–V axes — a favourite graph question.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Monatomic gas does 200 J work adiabatically. Temperature change if n = 1 mol?</div>
<ol class="steps">
<li>Adiabatic: Q = 0 ⇒ ΔU = −W = −200 J.</li>
<li>ΔU = (3/2)RΔT = −200 ⇒ ΔT = −400/(3×8.31) ≈ −16 K.</li>
</ol>
<div class="exa">Cooling ≈ 16 K — expanding gas chills (fridge physics).</div></div>` },
{ t: "Engines, refrigerators, second law", h: `
<p>A heat engine runs a cycle absorbing Q_H from a hot reservoir, dumping Q_C, delivering W = Q_H − Q_C. Efficiency η = W/Q_H = 1 − Q_C/Q_H. Carnot's reversible engine caps performance:</p>
<div class="fml"><span class="fx">η_carnot = 1 − T_C/T_H (absolute temperatures!)</span><span class="fd">no engine beats it; real engines trail far behind</span></div>
<p>Refrigerator: COP = Q_C/W = T_C/(T_H−T_C). Second law (Kelvin): no process converts heat fully to work; (Clausius): heat won't flow cold→hot unaided. Entropy statement: isolated systems evolve toward higher total entropy — arrow of time.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Carnot engine between 500 K and 300 K delivers 800 J/cycle. Heat absorbed?</div>
<ol class="steps">
<li>η = 1 − 300/500 = 0.4.</li>
<li>Q_H = W/η = 800/0.4 = 2000 J; rejected Q_C = 1200 J.</li>
</ol>
<div class="exa">2000 J absorbed, 1200 J dumped — engines are mostly heaters, unfortunately.</div></div>
<div class="trap"><b>Trap.</b> Efficiency needs kelvin, not Celsius. 0 °C ≠ zero energy reservoir.</div>` },
],
cps: [
{ q: "In a cyclic process, net change in internal energy is…", o: ["positive", "negative", "zero", "path-dependent"], a: 2, e: "U returns to its initial value over a cycle; net Q equals net W.", after: 1 },
{ q: "Adiabatic expansion of ideal gas causes temperature to…", o: ["rise", "fall", "stay constant", "depend on gas"], a: 1, e: "Gas spends internal energy doing work ⇒ cools.", after: 1 },
],
fl: [
["First law", "ΔU = Q − W"],
["Carnot efficiency", "1 − T_C/T_H"],
["Mayer relation", "Cp − Cv = R"],
["Adiabatic condition", "pv^γ = const"],
],
},

"P-ktg": {
mins: 18,
secs: [
{ t: "Ideal-gas law from molecular bookkeeping", h: `
<p>Kinetic theory derives macroscopic gas behaviour from molecules bouncing around. Ideal gas: huge numbers of identical molecules, negligible volume, no forces except elastic wall collisions. Result:</p>
<div class="fml"><span class="fx">pV = nRT = Nk_BT · p = ⅓ ρ v_rms²</span><span class="fd">the bridge between worlds</span></div>
<p>The pressure expression comes from momentum transfer per collision × collision rate; matching it to experiment reveals mean kinetic energy:</p>
<div class="fml"><span class="fx">½m v_rms² = (3/2) k_B T</span><span class="fd">temperature IS molecular kinetic energy</span></div>` },
{ t: "Speeds: rms, average, most probable", h: `
<div class="tblw"><table class="tbl">
<tr><th>Speed</th><th>Formula</th><th>Ratio</th></tr>
<tr><td>v_rms</td><td>√(3RT/M)</td><td>1.732·√(RT/M)</td></tr>
<tr><td>v_avg</td><td>√(8RT/πM)</td><td>1.596·√(RT/M)</td></tr>
<tr><td>v_mp</td><td>√(2RT/M)</td><td>1.414·√(RT/M)</td></tr>
</table></div>
<p>All scale as √(T/M): hotter = faster, heavier = slower. Maxwell's distribution curve: peak at v_mp, tail toward high speeds, flattens and shifts right as T rises. Doubling T raises speeds by √2, not 2.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">O₂ at 27 °C vs He at same T. Ratio of rms speeds? (M_O₂=32, M_He=4)</div>
<ol class="steps">
<li>v_rms ∝ 1/√M.</li>
<li>v_He/v_O₂ = √(32/4) = √8 ≈ 2.83.</li>
</ol>
<div class="exa">Helium zips ~2.8× faster — why it escapes balloons first.</div></div>` },
{ t: "Degrees of freedom and specific heats", h: `
<p>Energy equipartition: each degree of freedom holds ½k_BT per molecule. Monatomic: 3 translational f ⇒ Cv = 3R/2. Diatomic near room temp: +2 rotational ⇒ Cv = 5R/2 (vibrations frozen out until very high T). Then γ = 1 + 2/f: monatomic 5/3, diatomic 7/5. Internal energy of any ideal gas U = f/2·nRT depends only on T.</p>
<div class="trap"><b>Trap.</b> Internal energy depends on temperature alone for ideal gases regardless of pressure changes — students wrongly tie U to pV separately.</div>` },
{ t: "Real-gas corrections (van der Waals)", h: `
<p>At high p, low T the ideal picture fails: molecules occupy space and attract each other. Van der Waals: (p + a n²/V²)(V − nb) = nRT. Constant a corrects attraction (lowers observed pressure), b corrects finite size. Critical temperature marks where liquefaction by pressure alone becomes possible.</p>` },
],
cps: [
{ q: "If absolute temperature doubles, v_rms becomes…", o: ["2×", "√2×", "4×", "unchanged"], a: 1, e: "v_rms ∝ √T.", after: 1 },
{ q: "Mean translational KE per molecule at temperature T:", o: ["(3/2)kT", "(3/2)RT", "(1/2)kT", "(5/2)kT"], a: 0, e: "(3/2)k_BT per molecule; RT per mole.", after: 0 },
],
fl: [
["Pressure from molecules", "p = ⅓ρv_rms²"],
["Order of speeds", "v_mp < v_avg < v_rms"],
["Diatomic γ", "7/5"],
["van der Waals 'a' corrects", "intermolecular attraction"],
],
},

"P-waves": {
mins: 26,
secs: [
{ t: "Wave anatomy and types", h: `
<p>A wave transports energy without transporting matter. Mechanical waves need a medium; transverse waves oscillate ⊥ propagation (string), longitudinal ∥ (sound: compressions & rarefactions). Basic descriptors:</p>
<div class="fml"><span class="fx">y = A sin(kx − ωt + φ) · v = ω/k = λf · k = 2π/λ</span><span class="fd">one equation to describe them all</span></div>
<p>Sign convention: (kx − ωt) travels +x; (kx + ωt) travels −x. Phase φ sets initial position. Wave speed set by the medium (string: √(T/μ); sound in air ≈ 330–350 m/s rising with temperature), frequency by the source.</p>` },
{ t: "Speed of sound and its properties", h: `
<p>Newton–Laplace: v = √(γp/ρ) = √(γRT/M). Air at 20 °C ≈ 343 m/s. Sound travels faster in water (~1500) and steel (~5000) — stiffer media win despite density penalties.</p>
<ul>
<li>Loudness ↔ intensity (W/m²); intensity ∝ amplitude². Decibels: β = 10 log(I/I₀).</li>
<li>Pitch ↔ frequency; human range 20 Hz – 20 kHz.</li>
<li>Interference of two nearby frequencies → beats: beat frequency = |f₁ − f₂|.</li>
<li>Doppler effect: apparent frequency f' = f(v ± v_o)/(v ∓ v_s); signs chosen so approach raises pitch. Both source and observer motion matter independently.</li>
</ul>
<div class="ex"><div class="ext">Worked example — Doppler</div>
<div class="exq">Ambulance siren 1000 Hz approaching at 30 m/s (v_sound = 340). Frequency heard standing ahead?</div>
<ol class="steps">
<li>f' = f·v/(v − v_s) = 1000×340/(310).</li>
<li>= 1097 Hz. After passing: 1000×340/370 ≈ 919 Hz.</li>
</ol>
<div class="exa">~1100 Hz then ~920 Hz — the eeee-ooooh slide.</div></div>` },
{ t: "Superposition: interference and standing waves", h: `
<p>Overlapping waves add displacement-wise (principle of superposition). Same-frequency pairs give stable patterns: constructive when in phase, destructive at π. Path-difference rule: bright/loud at Δx = nλ, dark/silent at (n+½)λ.</p>
<p><b>Standing waves</b>: two identical counter-propagating waves create nodes (never move) spaced λ/2 apart, antinodes between them. Boundary conditions decide allowed frequencies:</p>
<div class="tblw"><table class="tbl">
<tr><th>System</th><th>Condition</th><th>Frequencies</th></tr>
<tr><td>String both ends fixed</td><td>nodes at ends</td><td>f_n = nv/2L (harmonics all integers)</td></tr>
<tr><td>Pipe closed one end</td><td>node at closed end, antinode open</td><td>f_n = nv/4L odd harmonics only</td></tr>
<tr><td>Pipe open both ends</td><td>antinodes at ends</td><td>f_n = nv/2L like string</td></tr>
</table></div>
<div class="tipbox"><b>Tip.</b> End correction adds ≈0.6r to acoustic length of each open end — shows up in resonance-tube experiments.</div>` },
{ t: "Energy, power and organ-pipe style questions", h: `
<p>Wave intensity falls as 1/r² from a point source (power spread over sphere 4πr²). Standing waves store energy alternately kinetic/potential like SHM writ large; travelling waves deliver time-averaged power P = ½μω²A²v on strings.</p>
<div class="ex"><div class="ext">Worked example — resonance column</div>
<div class="exq">Tube resonates at lengths 25 cm and 77 cm consecutively (same tuning fork). Speed of sound?</div>
<ol class="steps">
<li>Closed pipe: consecutive resonances differ λ/2 ⇒ λ = 2(77−25) = 104 cm.</li>
<li>f unknown but v = fλ; use end-corrected fundamental? Simpler: v = λ·f and f from L₁: (L₁+e) = λ/4.</li>
<li>With e small, v ≈ fλ where f = v/(4(L₁+e)) — standard trick: v = 2f(L₂−L₁) needs f… exam versions give f (e.g., 320 Hz): v = 320×1.04 ≈ 333 m/s.</li>
</ol>
<div class="exa">≈333 m/s with typical fork values — the classic lab question.</div></div>` },
],
cps: [
{ q: "Closed pipe harmonics present are…", o: ["all integers", "odd multiples of fundamental", "even multiples", "none"], a: 1, e: "Node at closed end forces odd harmonics only.", after: 2 },
{ q: "Beat frequency of 256 Hz and 260 Hz forks:", o: ["2 Hz", "4 Hz", "8 Hz", "516 Hz"], a: 1, e: "|f₁−f₂| = 4 Hz.", after: 1 },
{ q: "Wave speed on string depends on", o: ["amplitude", "frequency", "tension and linear density", "wavelength"], a: 2, e: "v = √(T/μ) — medium properties only.", after: 0 },
],
fl: [
["Wave equation form", "y = A sin(kx − ωt)"],
["String wave speed", "√(T/μ)"],
["Doppler approaching", "f' = fv/(v − v_s)"],
["Standing-wave node spacing", "λ/2"],
],
},

"P-electro": {
mins: 28,
secs: [
{ t: "Coulomb's law and superposition", h: `
<p>Charges interact via F = k q₁q₂/r², k = 1/4πε₀ ≈ 9×10⁹ N·m²/C², directed along the line joining them (repulsive for like signs). Vector addition handles multiple charges: compute pairwise forces and sum. Charge is quantised (e = 1.6×10⁻¹⁹ C) and conserved absolutely.</p>
<div class="tipbox"><b>Tip.</b> Force between charges doesn't depend on other charges present (superposition), but fields do get modified by inserted conductors — keep the contexts straight.</div>` },
{ t: "Electric field and field lines", h: `
<p>E = F/q₀ (N/C) — force per unit positive test charge. Point charge E = kq/r². Field lines start on +, end on −, never cross (crossing would mean two directions at one point), density encodes magnitude. Dipole: p = qd pointing − to +; field on axis 2kp/r³, equatorial kp/r³ (opposite p direction); torque τ = p×E, energy U = −p·E.</p>
<div class="tblw"><table class="tbl">
<tr><th>Source</th><th>E magnitude</th></tr>
<tr><td>Point charge</td><td>kq/r²</td></tr>
<tr><td>Infinite line charge</td><td>2kλ/r = λ/2πε₀r</td></tr>
<tr><td>Infinite sheet</td><td>σ/2ε₀ (independent of distance!)</td></tr>
<tr><td>Inside conducting shell material</td><td>zero</td></tr>
<tr><td>Uniformly charged solid sphere (inside)</td><td>kQr/R³ (linear in r)</td></tr>
</table></div>` },
{ t: "Gauss's law: flux bookkeeping", h: `
<p>Flux Φ = ∮E·dA counts how much field pierces a surface. <b>Gauss: Φ = q_enclosed/ε₀</b>. It converts ugly integrals into algebra whenever symmetry lets E slip out constant through a Gaussian surface: sphere, infinite cylinder (field 2kλ/r), infinite plane (σ/2ε₀). Inside a conductor E = 0; charge resides on surfaces; cavity charges induce inner-surface redistribution.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Flux through a cube face when charge q sits at cube centre?</div>
<ol class="steps">
<li>Total flux = q/ε₀ spread over 6 equal faces.</li>
<li>Per face: q/6ε₀.</li>
</ol>
<div class="exa">q/6ε₀. (Charge at a corner: q/24ε₀ per face meeting that corner.)</div></div>` },
{ t: "Potential, potential energy, equipotentials", h: `
<p>V = U/q₀ = kq/r for a point charge (scalar — signs add directly!). Work done moving charge: W_ext = qΔV. Equipotential surfaces ⊥ field lines; no work along them. Relation E = −dV/dx: field points down the steepest potential descent.</p>
<p>System energies: pair cost kq₁q₂/r summed over pairs; continuous bodies integrate. Electron-volt unit: 1 eV = 1.6×10⁻¹⁹ J — energy gained crossing 1 V.</p>
<div class="trap"><b>Trap.</b> Potential is scalar: never resolve components. Zero field ⇒ constant potential, but constant potential does NOT imply zero field everywhere (e.g., inside shell V = kQ/R ≠ 0 while E = 0).</div>` },
{ t: "Capacitors: storing charge and energy", h: `
<p>C = Q/V measures charge stored per volt. Parallel plate: C = ε₀A/d (with dielectric κ: multiply by κ). Combinations: parallel adds capacitance (same V), series adds reciprocals (same Q).</p>
<div class="fml"><span class="fx">U = ½CV² = ½QV = Q²/2C · energy density = ½ε₀E²</span><span class="fd">where the energy lives: in the FIELD</span></div>
<div class="tblw"><table class="tbl">
<tr><th>Action</th><th>Battery connected (V const)</th><th>Battery disconnected (Q const)</th></tr>
<tr><td>Insert dielectric κ</td><td>Q↑, C↑, U↑κ×</td><td>V↓, C↑, U↓κ×</td></tr>
<tr><td>Pull plates apart d↑</td><td>Q↓, C↓, U↓</td><td>V↑, C↓, U↑ (you do work)</td></tr>
</table></div>
<div class="ex"><div class="ext">Worked example — series capacitors</div>
<div class="exq">2 μF and 3 μF in series across 10 V. Charges and voltage splits?</div>
<ol class="steps">
<li>C_eq = (2×3)/(2+3) = 1.2 μF; Q_total = CV = 12 μC on each.</li>
<li>V₁ = 12/2 = 6 V, V₂ = 12/3 = 4 V (smaller capacitor takes more volts).</li>
</ol>
<div class="exa">12 μC each; 6 V + 4 V = 10 V ✓.</div></div>` },
],
cps: [
{ q: "Electric field inside a uniformly charged conducting sphere's material is…", o: ["kQr/R³", "zero", "kQ/R²", "σ/ε₀"], a: 1, e: "Conductors shield interiors; charge lives entirely on the surface.", after: 1 },
{ q: "Two capacitors in series across a battery have the same…", o: ["voltage", "charge", "energy", "capacitance"], a: 1, e: "Series shares charge; parallel shares voltage.", after: 4 },
{ q: "Energy density of an electric field E in vacuum:", o: ["½ε₀E", "ε₀E²", "½ε₀E²", "ε₀E"], a: 2, e: "u = ½ε₀E² — the field itself stores energy.", after: 4 },
],
fl: [
["Coulomb constant k", "≈9×10⁹ N·m²/C²"],
["Infinite sheet field", "σ/2ε₀, distance-independent"],
["Dipole in field torque", "τ = pE sinθ"],
["Parallel-plate capacitance", "ε₀A/d"],
["Dielectric insertion (battery off)", "V drops, energy drops"],
],
},

"P-current": {
mins: 26,
secs: [
{ t: "Current, resistance, Ohm's law", h: `
<p>Current I = dq/dt is charge flow rate (ampere = C/s). Drift velocity links micro to macro: I = neAv_d. Resistance R = V/I; for a wire R = ρL/A — geometry times resistivity ρ (material property, grows with temperature for metals: ρ_T = ρ₀(1+αΔT)).</p>
<div class="tblw"><table class="tbl">
<tr><th>Combination</th><th>Resistance</th><th>Current/Voltage</th></tr>
<tr><td>Series</td><td>R₁+R₂+…</td><td>same I, voltages divide ∝ R</td></tr>
<tr><td>Parallel</td><td>(1/R = Σ1/Rᵢ)</td><td>same V, currents divide ∝ 1/R</td></tr>
</table></div>
<p>EMF is the battery's ideal push (work per unit charge internally); terminal voltage V = ε − Ir while discharging (drops below EMF), rises above while charging. Internal resistance explains why batteries sag under load.</p>` },
{ t: "Kirchhoff's circuit laws", h: `
<p><b>Junction rule:</b> charge in = charge out at every node (current conservation). <b>Loop rule:</b> ΣΔV = 0 around any closed loop (energy conservation). Together they crack any ladder network:</p>
<ol>
<li>Assign currents with guessed directions.</li>
<li>Write junction equations (n−1 independent for n nodes).</li>
<li>Write loop equations walking each closed path; resistor crossed along current: −IR; battery − to +: +ε.</li>
<li>Solve; negative answer just means your guess was reversed.</li>
</ol>
<div class="ex"><div class="ext">Worked example — Wheatstone bridge</div>
<div class="exq">Bridge arms 2, 3, 4, 6 Ω (top-left clockwise). Galvanometer current?</div>
<ol class="steps">
<li>Balance condition: P/Q = R/S ⇒ 2/3 vs 4/6 = 2/3 ✓ balanced.</li>
<li>No potential difference across galvanometer.</li>
</ol>
<div class="exa">Zero — balanced bridges ignore the middle arm. Unbalanced ones need Kirchhoff or Thevenin.</div></div>` },
{ t: "Power and heating effects", h: `
<p>P = VI = I²R = V²/R — pick the form matching what's held constant. Series: brighter bulb has higher R (shares current, power ∝ R). Parallel: lower-R bulb wins (∝ 1/R). Joule heating Q = I²Rt is why transmission lines run at kilovolts (I small ⇒ losses small).</p>
<div class="ex"><div class="ext">Worked example — bulbs</div>
<div class="exq">60 W and 100 W bulbs rated 220 V are wired in series to 220 V. Which glows brighter?</div>
<ol class="steps">
<li>Resistances: 220²/60 ≈ 807 Ω; 220²/100 = 484 Ω.</li>
<li>Same series current ⇒ P ∝ R ⇒ 60 W bulb dissipates more.</li>
</ol>
<div class="exa">The 60 W bulb glows brighter — counterintuitive but true.</div></div>` },
{ t: "Meters, cells and useful tricks", h: `
<ul>
<li>Ammeter: tiny shunt resistance in parallel with galvanometer; ideal ammeter R→0, wired in series.</li>
<li>Voltmeter: large multiplier resistance in series; ideal voltmeter R→∞, wired across elements.</li>
<li>Cells in series aid/oppose depending on polarity; identical cells in parallel: ε same, internal r/n.</li>
<li>Maximum power transfer: load R = internal r delivers P_max = ε²/4r (efficiency only 50%).</li>
</ul>
<div class="trap"><b>Trap.</b> Real voltmeters steal a little current and read low; real ammeters add resistance and read high. Meter-correction questions exploit exactly this.</div>` },
],
cps: [
{ q: "Two identical bulbs in series vs a single bulb across the same supply. Each series bulb's brightness is…", o: ["same as single", "double", "quarter", "half"], a: 2, e: "Each gets half the voltage ⇒ quarter power (P ∝ V²).", after: 2 },
{ q: "For maximum power transfer, external R equals…", o: ["2r", "r", "r/2", "any value"], a: 1, e: "R = r gives P_max = ε²/4r.", after: 3 },
],
fl: [
["Drift velocity relation", "I = neAv_d"],
["Terminal voltage discharging", "V = ε − Ir"],
["Joule heating power", "P = I²R"],
["Balanced Wheatstone", "P/Q = R/S"],
],
},

"P-magnet": {
mins: 26,
secs: [
{ t: "Force on moving charges and currents", h: `
<p>Magnetic fields push sideways on moving charge: <b>F = qv × B</b>, magnitude qvB sinθ, always perpendicular to both v and B — so it bends paths but never does work (speed constant!). Consequences:</p>
<ul>
<li>Perpendicular launch: circle with radius r = mv/qB, period T = 2πm/qB (mass spectrometer principle).</li>
<li>Helical motion with parallel velocity component: pitch = v∥T.</li>
<li>Wire segment: F = IL × B (direction by right-hand palm rule); full loops feel torques instead.</li>
</ul>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Proton enters 0.5 T field ⊥ at 2×10⁶ m/s. Circle radius? (m=1.67×10⁻²⁷, q=1.6×10⁻¹⁹)</div>
<ol class="steps">
<li>r = mv/qB = (1.67×10⁻²⁷×2×10⁶)/(1.6×10⁻¹⁹×0.5).</li>
<li>r = 3.34×10⁻²¹ / 0.8×10⁻¹⁹ ≈ 0.042 m.</li>
</ol>
<div class="exa">≈4 cm.</div></div>` },
{ t: "Biot–Savart and Ampère: making magnetic fields", h: `
<p>Every current element dB = (μ₀/4π)·I dl×r̂/r². Integrate the classics:</p>
<div class="tblw"><table class="tbl">
<tr><th>Source</th><th>B</th></tr>
<tr><td>Long straight wire</td><td>μ₀I/2πr (circles around wire)</td></tr>
<tr><td>Centre of circular loop (N turns)</td><td>μ₀NI/2R</td></tr>
<tr><td>On solenoid axis (inside, long)</td><td>μ₀nI (uniform!)</td></tr>
<tr><td>Toroid</td><td>μ₀NI/2πr within core</td></tr>
</table></div>
<p><b>Ampère's law</b> ∮B·dl = μ₀I_through does the same job where symmetry exists (line currents, sheets, solenoids). Direction rules: right-hand thumb for wires, curled fingers for loops.</p>` },
{ t: "Torque on loops and magnetic dipole moment", h: `
<p>A current loop behaves as a dipole with moment m = NIA (normal to plane, curl fingers along current). Uniform field exerts τ = m×B aligning the loop; potential energy U = −mB cosθ. Motors convert electrical to mechanical work this way; galvanometers measure current via spring-balanced torque.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">50-turn coil, 10 cm square, 2 A, in 0.3 T field. Max torque?</div>
<ol class="steps">
<li>m = NIA = 50×2×0.01 = 1 A·m².</li>
<li>τ_max = mB = 0.3 N·m.</li>
</ol>
<div class="exa">0.3 N·m at θ = 90°.</div></div>` },
{ t: "Moving-coil instruments and materials", h: `
<p>Galvanometer sensitivity improves with stronger springs' softness (smaller k), bigger m, stronger B; converting to voltmeter/ammeter mirrors the meter rules from current electricity. Matter responds via permeability μ = μ₀μ_r: diamagnetics (μ_r slightly &lt;1, repelled), paramagnetics (&gt;1 weakly aligned, Curie law χ ∝ 1/T), ferromagnetics (domains, huge μ_r, hysteresis loop — remanence and coercivity explain permanent magnets vs transformer cores).</p>
<div class="trap"><b>Trap.</b> Magnetic force does no work on a lone charge, yet motors do mechanical work — the energy comes from the power supply maintaining the current, not from B itself.</div>` },
],
cps: [
{ q: "Magnetic force on a charged particle can change its…", o: ["speed", "kinetic energy", "direction only", "momentum magnitude"], a: 2, e: "F ⊥ v always: direction bends, speed and KE untouched.", after: 0 },
{ q: "Field at the centre of a single circular loop radius R carrying I:", o: ["μ₀I/2πR", "μ₀I/2R", "μ₀I/R", "zero"], a: 1, e: "Biot–Savart integration gives μ₀I/2R.", after: 1 },
],
fl: [
["Circular path radius in B", "r = mv/qB"],
["Long wire field", "B = μ₀I/2πr"],
["Solenoid interior field", "B = μ₀nI"],
["Loop dipole moment", "m = NIA"],
["Magnetic force does work?", "Never (on free charge)"],
],
},
};