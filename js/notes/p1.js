/* Full Notes — Physics part 1 (foundation mechanics → SHM). */

export const PHYS_NOTES_1 = {

"f-physics": {
mins: 12,
secs: [
{ t: "Why measurement comes first", h: `
<p>Physics is a quantitative science: every claim it makes ("this force is larger", "this reaction releases energy") is checked against numbers obtained from <b>measurements</b>. A measurement always has two parts — a <b>magnitude</b> and a <b>unit</b>. Writing "the length is 12" is meaningless until you say 12 cm or 12 m. In JEE, dropping units or mixing them up silently destroys otherwise correct solutions, so this chapter builds the discipline the rest of the syllabus stands on.</p>
<p>A <b>physical quantity</b> = number × unit. The number tells you how many units fit into the quantity. That's why changing units changes only the number, never the quantity itself: 1 km = 1000 m describes the same distance.</p>` },
{ t: "The SI system: base and derived units", h: `
<p>The SI system picks seven <b>base quantities</b> whose units are defined independently. Everything else is a <b>derived unit</b>, built by multiplying and dividing base units according to the defining equation of the quantity.</p>
<div class="tblw"><table class="tbl">
<tr><th>Base quantity</th><th>Unit</th><th>Symbol</th></tr>
<tr><td>Length</td><td>metre</td><td>m</td></tr>
<tr><td>Mass</td><td>kilogram</td><td>kg</td></tr>
<tr><td>Time</td><td>second</td><td>s</td></tr>
<tr><td>Electric current</td><td>ampere</td><td>A</td></tr>
<tr><td>Thermodynamic temperature</td><td>kelvin</td><td>K</td></tr>
<tr><td>Amount of substance</td><td>mole</td><td>mol</td></tr>
<tr><td>Luminous intensity</td><td>candela</td><td>cd</td></tr>
</table></div>
<p>To find the derived unit of any quantity, write its defining equation and substitute units for each symbol. Force from F = ma gets kg·m/s², which we abbreviate to the newton (N). Energy from W = F·d becomes N·m = kg·m²/s² = joule (J). Practice deriving these — JEE asks it directly.</p>
<div class="tipbox"><b>Tip.</b> Memorise the common prefixes: T(10¹²) G(10⁹) M(10⁶) k(10³) m(10⁻³) μ(10⁻⁶) n(10⁻⁹) p(10⁻¹²). Conversions between them appear inside nearly every numerical problem.</div>` },
{ t: "Dimensions and dimensional analysis", h: `
<p>A <b>dimensional formula</b> expresses a derived quantity as powers of base dimensions M, L, T, etc. For example force is [M L T⁻²], work is [M L² T⁻²], pressure [M L⁻¹ T⁻²], Planck's constant [M L² T⁻¹]. Dimensions are about the <i>type</i> of quantity; units are the specific scale chosen.</p>
<div class="tblw"><table class="tbl">
<tr><th>Quantity</th><th>Dimensional formula</th></tr>
<tr><td>Momentum / impulse</td><td>[M L T⁻¹]</td></tr>
<tr><td>Force / weight</td><td>[M L T⁻²]</td></tr>
<tr><td>Pressure, stress, modulus</td><td>[M L⁻¹ T⁻²]</td></tr>
<tr><td>Work, energy, torque, heat</td><td>[M L² T⁻²]</td></tr>
<tr><td>Power</td><td>[M L² T⁻³]</td></tr>
<tr><td>Frequency</td><td>[T⁻¹]</td></tr>
<tr><td>Surface tension, spring constant</td><td>[M T⁻²]</td></tr>
<tr><td>Gravitational constant G</td><td>[M⁻¹ L³ T⁻²]</td></tr>
<tr><td>Planck's constant h</td><td>[M L² T⁻¹]</td></tr>
</table></div>
<p>Three classic uses:</p>
<ul>
<li><b>Check an equation:</b> every term added or equated must share identical dimensions (principle of homogeneity).</li>
<li><b>Derive a relation:</b> if you know which variables a result depends on, match exponents of M, L, T on both sides.</li>
<li><b>Convert between systems:</b> n₂ = n₁ (M₁/M₂)ᵃ (L₁/L₂)ᵇ (T₁/T₂)ᶜ for a quantity with dimensions [MᵃLᵇTᶜ].</li>
</ul>
<div class="ex"><div class="ext">Worked example — deriving a formula</div>
<div class="exq">The period T of a pendulum may depend on its length l, mass m and free-fall acceleration g. Find the form of the relation.</div>
<ol class="steps">
<li>Assume T ∝ lᵃ mᵇ gᶜ. Write dimensions: [T] = [L]ᵃ [M]ᵇ [L T⁻²]ᶜ.</li>
<li>Match powers: M: b = 0. L: a + c = 0. T: −2c = 1 ⇒ c = −½.</li>
<li>So a = ½, b = 0 ⇒ T ∝ √(l/g).</li>
</ol>
<div class="exa">T = k√(l/g) with dimensionless k (= 2π from full theory). Mass drops out — exactly what experiment shows.</div></div>
<div class="trap"><b>Trap.</b> Dimensional methods cannot fix dimensionless constants (like the 2 above), cannot distinguish quantities with equal dimensions (work vs torque), and fail for equations containing sin, exp or log arguments — those arguments must themselves be dimensionless.</div>` },
{ t: "Significant figures", h: `
<p>Instruments are not infinitely precise; significant figures record how much you actually know. Rules that matter:</p>
<ul>
<li>All non-zero digits and trapped zeros are significant: 1204 mm has 4 sf. Leading zeros are not: 0.0052 has 2 sf. Trailing zeros after a decimal point are: 2.500 has 4 sf.</li>
<li><b>Multiplication/division:</b> the result keeps the smallest number of significant figures of the inputs.</li>
<li><b>Addition/subtraction:</b> the result keeps the smallest number of decimal places of the inputs.</li>
<li>Rounding: digit ≥ 5 rounds up; if exactly 5 followed by nothing non-zero, round to make the last kept digit even.</li>
</ul>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Masses 4.237 g (4 sf) and 1.3 g (2 sf) are added; the sum is then divided by density 2.51 g/cm³ (3 sf). Report the volume.</div>
<ol class="steps">
<li>Sum first: 4.237 + 1.3 = 5.537, but keep 1 decimal place ⇒ 5.5 g.</li>
<li>Divide: V = 5.5 / 2.51 = 2.1912… cm³. Inputs carry min(2 sf, 3 sf) = 2 sf.</li>
</ol>
<div class="exa">V ≈ 2.2 cm³.</div></div>` },
{ t: "Errors and their combination", h: `
<p>No measurement is exact. If the true value is x₀ and you measure x, the <b>absolute error</b> is Δx = |x − x₀| (in practice, the mean absolute deviation of repeated readings). The quality of a measurement is captured better by the <b>relative error</b> Δx/x, usually quoted as percentage error ×100%.</p>
<p>When quantities combine, errors combine too — and this is where JEE tests you:</p>
<div class="tblw"><table class="tbl">
<tr><th>Relation</th><th>Error rule</th></tr>
<tr><td>Z = A + B or Z = A − B</td><td>ΔZ = ΔA + ΔB (absolute errors add)</td></tr>
<tr><td>Z = AB or Z = A/B</td><td>ΔZ/Z = ΔA/A + ΔB/B</td></tr>
<tr><td>Z = Aᵏ</td><td>ΔZ/Z = |k| ΔA/A</td></tr>
<tr><td>Z = AᵖB^q/Cʳ</td><td>ΔZ/Z = p(ΔA/A) + q(ΔB/B) + r(ΔC/C)</td></tr>
</table></div>
<p>Note the asymmetry: subtracting measured values is dangerous because absolute errors still add while the result shrinks, so the relative error explodes.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Time for 20 oscillations of a pendulum: 40.0 s with stopwatch least count 0.1 s. Length 1.000 m with ±0.001 m. Find % error in g computed from T = 2π√(l/g).</div>
<ol class="steps">
<li>T = 40.0/20 = 2.00 s; Δt per reading 0.1 s over the 20-swing run ⇒ ΔT/T = 0.1/40.0 = 0.25%.</li>
<li>g = 4π²l/T² ⇒ Δg/g = Δl/l + 2(ΔT/T) = 0.1% + 0.5% = 0.6%.</li>
</ol>
<div class="exa">g = 9.87 ± 0.06 m/s² (≈0.6%). Notice timing many swings dilutes stopwatch error — the standard trick.</div></div>
<div class="trap"><b>Trap.</b> Least count of vernier calipers = main-scale division − vernier division; of a screw gauge = pitch ÷ number of circular divisions. Zero error must be subtracted with sign before any calculation. These definitions are asked verbatim.</div>` },
],
cps: [
{ q: "The dimensional formula of pressure × volume is the same as that of…", o: ["force", "energy", "power", "momentum"], a: 1, e: "PV has dimensions [M L⁻¹ T⁻²][L³] = [M L² T⁻²], which is work/energy.", after: 2 },
{ q: "In Z = A²B/C, if ΔA/A = 2%, ΔB/B = 3%, ΔC/C = 1%, then ΔZ/Z is…", o: ["6%", "7%", "8%", "5%"], a: 2, e: "2×2% + 3% + 1% = 8%. Powers multiply the fractional errors.", after: 4 },
],
fl: [
["SI base units?", "m, kg, s, A, K, mol, cd"],
["Dimensions of Planck's constant", "[M L² T⁻¹] (same as angular momentum)"],
["Error rule for Z = Aᵏ?", "ΔZ/Z = |k|·ΔA/A"],
["Vernier least count", "(smallest main-scale div) − (smallest vernier div)"],
["Adding measurements: what adds?", "Absolute errors add, even when subtracting the values."],
],
},

"f-motion": {
mins: 14,
secs: [
{ t: "Describing motion: position, distance, displacement", h: `
<p>Kinematics answers "how does position change with time?" without asking why. The star of the show is the <b>position vector</b>: motion is just position changing. Two different measures of "how far":</p>
<ul>
<li><b>Distance</b> — total path length travelled. Scalar, never decreases, depends on the route taken.</li>
<li><b>Displacement</b> — straight arrow from start to end. Vector, can be zero even after long travel (one full lap of a track).</li>
</ul>
<p>|displacement| ≤ distance always, with equality only for straight-line motion without reversal.</p>` },
{ t: "Speed and velocity", h: `
<p><b>Average speed</b> = total distance / total time. <b>Average velocity</b> = displacement / time — a vector. Instantaneous velocity is the limit as Δt → 0, i.e. the slope of the position–time graph.</p>
<div class="fml"><span class="fx">v̄ = Δx/Δt · v = dx/dt</span><span class="fd">average vs instantaneous velocity</span></div>
<div class="ex"><div class="ext">Worked example — average speed ≠ average of speeds</div>
<div class="exq">A car covers the first half of a distance at 30 km/h and the second half at 60 km/h. Average speed?</div>
<ol class="steps">
<li>Let total distance = 2d. Times: d/30 and d/60.</li>
<li>v̄ = 2d ÷ (d/30 + d/60) = 2/(1/30 + 1/60) = 40 km/h.</li>
</ol>
<div class="exa">Equal distances ⇒ harmonic mean. (Equal times would give the arithmetic mean, 45.)</div></div>
<div class="trap"><b>Trap.</b> Average speed is never the arithmetic mean unless the two speeds last for equal <i>times</i>.</div>` },
{ t: "Acceleration and the motion graphs", h: `
<p>Acceleration is the rate of change of velocity, a = dv/dt. On graphs everything is geometric:</p>
<ul>
<li>x–t graph: slope = velocity; curvature signals acceleration.</li>
<li>v–t graph: slope = acceleration; area under curve = displacement.</li>
<li>a–t graph: area under curve = change in velocity.</li>
</ul>
<div class="tblw"><table class="tbl">
<tr><th>Graph shape</th><th>Meaning</th></tr>
<tr><td>x–t straight sloped line</td><td>constant velocity</td></tr>
<tr><td>x–t parabola opening upward</td><td>constant positive acceleration</td></tr>
<tr><td>v–t horizontal line</td><td>zero acceleration</td></tr>
<tr><td>v–t crosses the axis</td><td>particle reverses direction there</td></tr>
</table></div>` },
{ t: "Relative motion in one line", h: `
<p>Velocity is always measured relative to some observer. If A moves at v_A and B at v_B (along the same line), then velocity of A seen by B is v_AB = v_A − v_B. This single subtraction solves chase problems, overtaking problems and elevator questions later.</p>
<div class="tipbox"><b>Tip.</b> When two objects approach head-on, closing speed = v_A + v_B (subtract a negative). When chasing, it's the difference. Always convert to a signed axis first.</div>` },
],
cps: [
{ q: "A particle returns to its starting point after 10 s. Its average velocity is…", o: ["equal to average speed", "zero", "non-zero", "undefined"], a: 1, e: "Displacement over the trip is zero, so average velocity is zero regardless of speed.", after: 1 },
],
fl: [
["Slope of v–t graph", "acceleration"],
["Area under v–t graph", "displacement"],
["Average speed for equal distances at u and v", "2uv/(u+v)"],
],
},

"P-units": {
mins: 18,
secs: [
{ t: "Beyond the basics: why JEE loves dimensions", h: `
<p>At Class-11 level the same ideas return with sharper teeth. You must instantly produce dimensional formulas for less familiar quantities (coefficient of viscosity, permittivity, magnetic field…) and use them to test candidate equations. The method: write the quantity's defining relation, replace each symbol by base dimensions, simplify exponents.</p>
<div class="tblw"><table class="tbl">
<tr><th>Quantity</th><th>Defining relation</th><th>Dimensions</th></tr>
<tr><td>Coefficient of viscosity η</td><td>F = ηA·dv/dx</td><td>[M L⁻¹ T⁻¹]</td></tr>
<tr><td>Permittivity ε₀</td><td>F = q²/4πε₀r²</td><td>[M⁻¹ L⁻³ T⁴ A²]</td></tr>
<tr><td>Magnetic field B</td><td>F = qvB</td><td>[M T⁻² A⁻¹]</td></tr>
<tr><td>Resistance R</td><td>V = IR</td><td>[M L² T⁻³ A⁻²]</td></tr>
<tr><td>Capacitance C</td><td>Q = CV</td><td>[M⁻¹ L⁻² T⁴ A²]</td></tr>
<tr><td>Latent heat L</td><td>Q = mL</td><td>[L² T⁻²]</td></tr>
<tr><td>Gas constant R</td><td>PV = nRT</td><td>[M L² T⁻² K⁻¹ mol⁻¹]</td></tr>
</table></div>` },
{ t: "Checking and building equations", h: `
<p><b>Homogeneity test:</b> in any physically valid sum, all terms have identical dimensions. Example: s = ut + ½at² — [L][T⁻¹][T] = L ✓ and [L T⁻²][T²] = L ✓.</p>
<p><b>Derivation by matching exponents</b> works whenever you can list the relevant variables. It cannot find dimensionless factors (2π, ½, sinθ) — remember the pendulum gave k√(l/g) but only full dynamics reveals k = 2π.</p>
<div class="trap"><b>Trap.</b> Torque and work both have dimensions [M L² T⁻²] yet are different animals: torque is a vector (cross product r × F), work a scalar. Dimensional analysis alone can never separate them.</div>` },
{ t: "Unit conversion formula", h: `
<p>To convert a measured value n₁ in system 1 to n₂ in system 2 for quantity with dimensions MᵃLᵇTᶜ:</p>
<div class="fml"><span class="fx">n₂ = n₁ (M₁/M₂)ᵃ (L₁/L₂)ᵇ (T₁/T₂)ᶜ</span><span class="fd">value scales inversely with unit size</span></div>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Convert 72 km/h into SI base units and state the number of base units.</div>
<ol class="steps">
<li>72 km/h = 72 × 1000 m / 3600 s = 20 m/s.</li>
<li>Speed has dimensions [L T⁻¹]; expressed in base units it's 20 (metres per second).</li>
</ol>
<div class="exa">20 m/s.</div></div>` },
{ t: "Error analysis at JEE depth", h: `
<p>Two refinements over foundation level:</p>
<ul>
<li><b>Combining data:</b> when the same quantity is measured n times, best estimate is the mean; the declared error is the mean absolute deviation Σ|xᵢ − x̄|/n.</li>
<li><b>Which instrument dominates?</b> The largest fractional error controls the final answer — improve that instrument first. In the pendulum experiment, timing 20 swings divides the timing error by 20, making length precision the bottleneck.</li>
</ul>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Young's modulus Y = 4FL/πd²ℓ. Fractional errors: F 2%, L 1%, d 3%, ℓ 2%. Find % error in Y.</div>
<ol class="steps">
<li>ΔY/Y = ΔF/F + ΔL/L + 2(Δd/d) + Δℓ/ℓ.</li>
<li>= 2% + 1% + 6% + 2% = 11%.</li>
</ol>
<div class="exa">≈11%, dominated by the diameter term — measure d most carefully (its square doubles its weight).</div></div>` },
],
cps: [
{ q: "Which pair has identical dimensions AND represents the same physical quantity?", o: ["work and torque", "pressure and energy density", "momentum and impulse", "stress and strain"], a: 2, e: "Impulse = FΔt = Δp exactly — same dimensions [M L T⁻¹] and the same physics. Work/torque match only in dimensions.", after: 1 },
],
fl: [
["Dimensions of ε₀", "[M⁻¹ L⁻³ T⁴ A²]"],
["Dimensions of magnetic field B", "[M T⁻² A⁻¹]"],
["Unit conversion law", "n₂ = n₁(M₁/M₂)ᵃ(L₁/L₂)ᵇ(T₁/T₂)ᶜ"],
["Dominant error source", "largest fractional contribution"],
],
},

"P-kinematics": {
mins: 26,
secs: [
{ t: "The equations of motion — and where they come from", h: `
<p>For constant acceleration a along a line, starting with velocity u:</p>
<div class="fml"><span class="fx">v = u + at · s = ut + ½at² · v² = u² + 2as · sₙth = u + a(2n−1)/2</span><span class="fd">the four workhorses of kinematics</span></div>
<p>They're not independent facts to memorise — each comes from the previous by calculus. Since a = dv/dt is constant: integrate once for v(t); integrate again for s(t); eliminate t between them for v²(s). The fourth gives distance covered <i>during</i> the n-th second — useful in "body travels x m in n-th second" puzzles.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">A body covers 5 m and 7 m in consecutive seconds. Find its acceleration and initial velocity.</div>
<ol class="steps">
<li>sₙ − sₙ₋₁ = a ⇒ a = 7 − 5 = 2 m/s².</li>
<li>First-second displacement: 5 = u + 2·(1/2) ⇒ u = 4 m/s.</li>
</ol>
<div class="exa">a = 2 m/s², u = 4 m/s.</div></div>` },
{ t: "Free fall and the sign discipline", h: `
<p>Gravity near Earth's surface gives constant a = g ≈ 9.8 m/s² downward. All difficulty in these problems is bookkeeping of signs. Pick one positive direction once, convert every quantity into it ("downward throw: u = −20 m/s if up is +"), then apply the standard equations mechanically.</p>
<div class="tipbox"><b>Tip.</b> For a ball thrown up with speed u: time up = u/g, max height u²/2g, total flight 2u/g, speed on return = u (air ignored). Dropping from height h: t = √(2h/g), impact speed √(2gh).</div>
<div class="trap"><b>Trap.</b> At the top of vertical flight velocity is zero but acceleration is still g downward — never zero. Questions love this point.</div>` },
{ t: "Projectile motion: full treatment", h: `
<p>A projectile launched at speed u at angle θ above horizontal splits into two independent problems: uniform horizontal motion (u cosθ) and vertical free fall (u sinθ upward). Recombining gives everything:</p>
<div class="tblw"><table class="tbl">
<tr><th>Quantity</th><th>Formula</th></tr>
<tr><td>Time of flight T</td><td>2u sinθ / g</td></tr>
<tr><td>Maximum height H</td><td>u² sin²θ / 2g</td></tr>
<tr><td>Horizontal range R</td><td>u² sin2θ / g</td></tr>
<tr><td>Trajectory equation</td><td>y = x tanθ − gx²/(2u²cos²θ)</td></tr>
<tr><td>Speed at height y</td><td>v = √(u² − 2gy)</td></tr>
</table></div>
<ul>
<li><b>Complementary angles:</b> θ and 90°−θ give equal range; θ = 45° maximises it, R_max = u²/g.</li>
<li>The path is a parabola because y is quadratic in x.</li>
<li>Velocity at any instant has magnitude √(vx² + vy²), direction atan(vy/vx); it is perpendicular to initial velocity when the projectile has risen to half the maximum height… actually the clean fact is: vx stays constant while vy reverses sign symmetrically about the top.</li>
</ul>
<div class="ex"><div class="ext">Worked example — range on an inclined plane</div>
<div class="exq">A projectile fired at speed u up an incline of angle α, launch angle β above the incline. Find range along the slope.</div>
<ol class="steps">
<li>Take axes along/perpendicular to the incline. Effective gravity components: along slope −g sinα, normal −g cosα.</li>
<li>Time of flight from normal motion: T = 2u sinβ / (g cosα).</li>
<li>Range along slope: R = u cosβ·T − ½ g sinα T² = (2u² sinβ cos(α+β)) / (g cos²α).</li>
</ol>
<div class="exa">R = 2u² sinβ cos(α+β)/g cos²α. Setting α = 0 recovers the flat-ground result — always check special cases.</div></div>` },
{ t: "Relative velocity in two dimensions", h: `
<p>Vector subtraction handles every relative-motion question: v_AB = v_A − v_B. Two classic setups dominate JEE:</p>
<ul>
<li><b>River–boat:</b> boat speed v_b relative to water, current v_r. To cross straight across, aim upstream at angle θ with sinθ = v_r/v_b. Crossing time then t = d/√(v_b² − v_r²). To cross in least time, aim straight across (drift happens).</li>
<li><b>Rain–man:</b> rain falls vertically at v_r; person walks at v_m; umbrella tilts forward at angle tanθ = v_m/v_r from vertical.</li>
</ul>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">River 100 m wide flows at 3 m/s; boat does 5 m/s in still water. Minimum drift crossing?</div>
<ol class="steps">
<li>Straight-across aiming requires sinθ = 3/5 ⇒ possible (θ = 37° upstream).</li>
<li>Then effective crossing speed = √(25 − 9) = 4 m/s, drift = 0, time = 100/4 = 25 s.</li>
</ol>
<div class="exa">Zero drift in 25 s. (Least-time crossing would be 20 s with 60 m drift.)</div></div>` },
{ t: "Graph-based questions", h: `
<p>JEE frequently gives graphs instead of equations. Decode systematically:</p>
<ul>
<li>Read what's plotted (axes!), then interpret slope, intercept, curvature, area.</li>
<li>Discontinuity in v means impulse/infinite acceleration — usually a collision or wall.</li>
<li>Average acceleration over [t₁,t₂] = chord slope of v–t; instantaneous = tangent slope.</li>
<li>Area under |v|–t gives total distance; signed area of v–t gives displacement.</li>
</ul>
<div class="trap"><b>Trap.</b> A particle moving backward makes the v–t graph dip below the axis. Students read area magnitude as displacement — signs matter.</div>` },
],
cps: [
{ q: "At maximum height of a projectile, which statement is true?", o: ["velocity and acceleration are both zero", "velocity is horizontal, acceleration is g down", "acceleration is zero, velocity horizontal", "speed equals launch speed"], a: 1, e: "Vertical component vanishes; horizontal component u cosθ remains; gravity never switches off.", after: 2 },
{ q: "Boat speed 4 m/s, current 2 m/s, river width d. Time for straight-across crossing?", o: ["d/6", "d/4", "d/√12", "d/2"], a: 2, e: "Effective speed = √(4²−2²) = √12 m/s across.", after: 3 },
{ q: "Range is maximum at 45°. At what pair of angles is range equal?", o: ["30° and 45°", "30° and 60°", "20° and 80°? no—only complementary pairs like 30°/60°", "any pair summing to 90°"], a: 3, e: "sin2θ is symmetric about 45°, so all complementary pairs give equal range.", after: 2 },
],
fl: [
["Time of flight of projectile", "T = 2u sinθ/g"],
["Max range formula", "R = u²/g at θ=45°"],
["sₙ (distance in nth second)", "u + a(2n−1)/2"],
["Straight-across boating angle", "aim upstream with sinθ = v_river/v_boat"],
],
},

"P-laws": {
mins: 24,
secs: [
{ t: "Newton's three laws as a problem-solving machine", h: `
<p><b>First law</b>: no net force ⇒ no change in velocity. Defines inertia and inertial frames. <b>Second law</b>: F_net = dp/dt = ma for constant mass — the quantitative engine. <b>Third law</b>: forces come in equal-opposite pairs acting on <i>different</i> bodies, which is why they never cancel on the same body.</p>
<p>The practical method for nearly every mechanics question is the same three steps:</p>
<ol>
<li>Draw a <b>free-body diagram</b> for each object: every force touching that object only.</li>
<li>Choose axes (along expected motion helps), resolve, write ΣF = ma per axis per body.</li>
<li>Count equations vs unknowns; add constraints (same string tension, no-slip contact, equal accelerations of connected bodies).</li>
</ol>
<div class="trap"><b>Trap.</b> ma is not a force. Never draw "ma" arrows on an FBD — it is the result of adding real forces.</div>` },
{ t: "Momentum, impulse and variable mass", h: `
<p>Momentum p = mv. Newton's second law in original form: F = dp/dt. Rearranged over a collision interval: <b>impulse</b> J = ∫F dt = Δp. Impulse explains why airbags work (stretch the time, shrink the peak force) and solves all crash/rebound questions without knowing force details.</p>
<div class="fml"><span class="fx">J = F_avg Δt = Δp = mv − mu</span><span class="fd">area under F–t curve</span></div>
<p>Rocket propulsion is dp/dt with changing mass: thrust F = v_rel·(dm/dt), where v_rel is exhaust speed relative to the rocket.</p>` },
{ t: "Friction: the self-adjusting force", h: `
<p>Friction opposes <i>relative slipping tendency</i>, not necessarily motion. Its magnitude is whatever is needed to prevent slipping, up to a ceiling:</p>
<div class="tblw"><table class="tbl">
<tr><th>Regime</th><th>Law</th></tr>
<tr><td>Static (no slip yet)</td><td>f ≤ μ_s N, adjusts itself</td></tr>
<tr><td>Kinetic (sliding)</td><td>f = μ_k N, roughly constant, μ_k &lt; μ_s</td></tr>
<tr><td>Rolling</td><td>much smaller; static friction acts during pure rolling</td></tr>
</table></div>
<div class="ex"><div class="ext">Worked example — will it slip?</div>
<div class="exq">Block (m = 2 kg) on floor, μ_s = 0.5, pulled with F = 8 N horizontal. Does it move?</div>
<ol class="steps">
<li>Max static friction = μ_s mg = 0.5 × 2 × 10 = 10 N.</li>
<li>Applied 8 N ≤ 10 N ⇒ friction supplies exactly 8 N.</li>
</ol>
<div class="exa">No motion, a = 0, friction 8 N. (With F = 12 N, a = (12−10)/2 = 1 m/s².)</div></div>
<p><b>Angle of repose</b>: block on incline just slides when tanθ = μ_s. <b>Banking of roads</b>: frictionless safe speed v = √(rg·tanθ); with friction the band √(rg(tanθ−μ)/(1+μtanθ)) ≤ v ≤ √(rg(tanθ+μ)/(1−μtanθ)) applies.</p>` },
{ t: "Circular dynamics and pseudo forces", h: `
<p>Uniform circular motion needs a net inward force mv²/r — centripetal is a <i>job description</i> filled by tension, gravity, friction, normal, or combinations, never a new force of its own.</p>
<ul>
<li>Conical pendulum: tanθ = v²/rg.</li>
<li>Vertical circle: minimum top-of-circle speed √(gr) (string slack below that); bottom tension exceeds weight by mv²/r extra.</li>
<li>Overturning vs skidding of vehicles relates centripetal demand to friction supply.</li>
</ul>
<p>In accelerating (non-inertial) frames you may keep Newton's laws by adding <b>pseudo force</b> −ma_frame on every mass. Elevator problems are the classic: apparent weight = m(g + a) accelerating up, m(g − a) down; free fall reads zero.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Car rounds a curve r = 50 m at 72 km/h. Required friction coefficient?</div>
<ol class="steps">
<li>v = 20 m/s. Need centripetal accel v²/r = 400/50 = 8 m/s².</li>
<li>Friction supplies μg ≥ 8 ⇒ μ ≥ 0.8.</li>
</ol>
<div class="exa">μ_min = 0.8 — sporty tyres required.</div></div>` },
{ t: "Connected bodies: the constraint toolkit", h: `
<p>Pulleys and wedges reduce to pattern recognition:</p>
<ul>
<li>Ideal pulley/string: tension same throughout, speeds equal in magnitude along the string.</li>
<li>Atwood machine: a = (m₁−m₂)g/(m₁+m₂), tensions found from either body's FBD.</li>
<li>Wedge/inclined systems: constrain motion along surfaces, then solve simultaneous equations.</li>
</ul>
<div class="tipbox"><b>Tip.</b> Always write acceleration constraints before algebra. For a string of fixed length, position coordinates of connected masses satisfy a linear relation; differentiate twice for the acceleration relation.</div>` },
],
cps: [
{ q: "A lift accelerates downward at g (cable snapped). Scale reading for a passenger of mass m?", o: ["mg", "zero", "2mg", "mg/2"], a: 1, e: "Both passenger and scale fall together; contact force (apparent weight) is zero — free fall.", after: 3 },
{ q: "Minimum speed at the top of a vertical circular loop of radius r (string)?", o: ["√(2gr)", "√(gr)", "√(5gr)", "2√(gr)"], a: 1, e: "At the top even zero tension works if gravity alone provides mv²/r ⇒ v² = gr. (√5gr is the corresponding bottom speed.)", after: 3 },
{ q: "Why doesn't a third-law pair cancel?", o: ["because they act on different bodies", "because they're unequal", "they do cancel", "only in inertial frames"], a: 0, e: "Action and reaction act on different objects; each body feels only its own force.", after: 0 },
],
fl: [
["Impulse equals", "change in momentum (FΔt)"],
["Angle of repose", "tanθ = μ_s"],
["Banked road (frictionless)", "v = √(rg tanθ)"],
["Rocket thrust", "v_exhaust × dm/dt"],
["Apparent weight, lift accelerating up with a", "m(g+a)"],
],
},

"P-wpe": {
mins: 22,
secs: [
{ t: "Work: force dotted into displacement", h: `
<p>Work transfers energy via force. For a constant force, W = F·d cosθ — the component of force along displacement times displacement. Negative work means the force removes energy (friction braking a box). For a variable force the definition generalises to the area under the F–x graph: W = ∫F dx.</p>
<div class="tblw"><table class="tbl">
<tr><th>Situation</th><th>Work by the named force</th></tr>
<tr><td>Normal force on level ground</td><td>zero (⊥ displacement)</td></tr>
<tr><td>Centripetal force in uniform circle</td><td>zero (⊥ velocity always)</td></tr>
<tr><td>Gravity near Earth</td><td>mgh going down; −mgh up (path-independent)</td></tr>
<tr><td>Spring force</td><td>−½k(x₂² − x₁²)</td></tr>
<tr><td>Static friction while walking? rolling without slipping</td><td>zero (contact point momentarily at rest)</td></tr>
</table></div>` },
{ t: "Kinetic energy and the work–energy theorem", h: `
<p>K = ½mv². The theorem W_net = ΔK is the single most used energy statement: total work of ALL forces (including gravity and friction) equals change in kinetic energy. It shines when forces vary along the path or the path is ugly but endpoints are known.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">A 2 kg block moving at 10 m/s meets a rough patch (μ = 0.25). How far does it slide?</div>
<ol class="steps">
<li>Only friction does work: W = −μmg·d.</li>
<li>ΔK = 0 − ½×2×10² = −100 J.</li>
<li>d = 100/(0.25×2×10) = 20 m.</li>
</ol>
<div class="exa">20 m. No kinematics needed.</div></div>` },
{ t: "Potential energy and conservative forces", h: `
<p>A force is <b>conservative</b> when work depends only on endpoints (gravity, spring, electrostatic) — equivalently, work around any closed loop is zero, and a potential energy function exists with F = −dU/dx. Non-conservative forces (friction, drag, applied pushes) have no PE bookkeeping; their effect shows up as lost mechanical energy.</p>
<div class="fml"><span class="fx">U_gravity = mgh · U_spring = ½kx² · U_grav(general) = −GMm/r</span><span class="fd">choose your reference anywhere; only ΔU matters</span></div>
<p>Mechanical energy E = K + U is conserved exactly when only conservative forces do work. With friction: E_f = E_i + W_friction (negative addition), i.e., the loss equals heat generated.</p>` },
{ t: "Energy conservation as a solver", h: `
<div class="ex"><div class="ext">Worked example — sliding then flying</div>
<div class="exq">Bead slides from rest down a frictionless track and leaves the end horizontally at height h above ground, track drop H. Find landing distance.</div>
<ol class="steps">
<li>Speed at exit: ½mv² = mgH ⇒ v = √(2gH).</li>
<li>Projectile from height h with horizontal v: time t = √(2h/g).</li>
<li>Range R = vt = 2√(Hh).</li>
</ol>
<div class="exa">R = 2√(Hh). Energy gave the speed; kinematics gave the flight.</div></div>
<p>Vertical circles mix energy and dynamics: minimum release heights, slack-string conditions. At the top of a circle radius r, staying on track needs v_top² ≥ gr; combine with energy from the bottom to get v_bottom² ≥ 5gr.</p>
<div class="trap"><b>Trap.</b> Energy methods find speeds, not times or directions of forces. If the question asks "how long", you'll need kinematics too.</div>` },
{ t: "Power and efficiency", h: `
<p>Power is energy flow rate: P = dW/dt = F·v for a force on a moving object. Engines quote average power P = W/t. Efficiency η = useful output/input &lt; 1; the missing share is usually heat.</p>
<div class="ex"><div class="ext">Quick example</div>
<div class="exq">Crane lifts 500 kg at constant 2 m/s. Motor draws power such that efficiency is 80%. Input power?</div>
<ol class="steps">
<li>Useful power = mgv = 500×10×2 = 10 kW.</li>
<li>Input = useful/η = 10/0.8 = 12.5 kW.</li>
</ol>
<div class="exa">12.5 kW.</div></div>` },
],
cps: [
{ q: "Work done by centripetal force in one complete revolution:", o: ["mv²/r", "2πr·mv²/r", "zero", "πr²"], a: 2, e: "Force is always perpendicular to velocity, so zero work — speed stays constant.", after: 0 },
{ q: "Spring compressed x stores U. Compressed 2x it stores…", o: ["2U", "4U", "U/2", "U√2"], a: 1, e: "U = ½kx² scales with x², doubling x quadruples U.", after: 2 },
],
fl: [
["Work-energy theorem", "W_net = ΔK"],
["Conservative force test", "work around closed loop = 0"],
["Bottom speed for completing vertical loop", "v² ≥ 5gr"],
["Instantaneous power", "P = F·v"],
],
},

"P-rotation": {
mins: 28,
secs: [
{ t: "Angular kinematics: the rotational twins", h: `
<p>Rotational motion mirrors linear kinematics with angle θ replacing s. For constant angular acceleration α:</p>
<div class="fml"><span class="fx">ω = ω₀ + αt · θ = ω₀t + ½αt² · ω² = ω₀² + 2αθ</span><span class="fd">identical structure to v = u + at …</span></div>
<p>Link between worlds: arc length s = rθ, speed v = rω, tangential acceleration a_t = rα, and the always-present radial part a_r = rω² pointing to the centre. Rolling contact: v_cm = Rω for rolling without slipping.</p>` },
{ t: "Moment of inertia: rotational laziness", h: `
<p>Mass resists linear acceleration; moment of inertia resists angular acceleration: I = Σmᵢrᵢ². Distribution matters — mass far from the axis counts double-plus. Standard results you must carry:</p>
<div class="tblw"><table class="tbl">
<tr><th>Body</th><th>Axis</th><th>I</th></tr>
<tr><td>Ring / hollow cylinder</td><td>central axis</td><td>MR²</td></tr>
<tr><td>Disc / solid cylinder</td><td>central axis</td><td>MR²/2</td></tr>
<tr><td>Solid sphere</td><td>diameter</td><td>2MR²/5</td></tr>
<tr><td>Hollow sphere</td><td>diameter</td><td>2MR²/3</td></tr>
<tr><td>Rod</td><td>through centre ⊥ length</td><td>ML²/12</td></tr>
<tr><td>Rod</td><td>through end ⊥ length</td><td>ML²/3</td></tr>
<tr><td>Rectangle plate</td><td>through centre ⊥ plane</td><td>M(a²+b²)/12</td></tr>
</table></div>
<p><b>Parallel-axis theorem:</b> I = I_cm + Md², where d is the shift between parallel axes. <b>Perpendicular-axis theorem</b> (plane laminas): I_z = I_x + I_y. These two build every non-listed case.</p>` },
{ t: "Torque and rotational dynamics", h: `
<p>Torque τ = r × F (magnitude rF sinφ) — the turning effectiveness of a force. Rotational Newton: <b>τ_net = Iα</b>. Equilibrium of rigid bodies needs both ΣF = 0 and Στ = 0; choosing the pivot cleverly (through unknown reaction) kills variables fast.</p>
<div class="ex"><div class="ext">Worked example — ladder against a wall</div>
<div class="exq">Uniform ladder (mass m, length L) leans on frictionless wall at 60°. Floor friction coefficient needed?</div>
<ol class="steps">
<li>Forces: weight mg at centre, normal N_w from wall (horizontal), floor: N_f up, f horizontal.</li>
<li>Torques about the base: N_w L sin60° = mg (L/2) cos60° ⇒ N_w = mg/(2tan60°) = mg/(2√3).</li>
<li>Horizontal balance: f = N_w. Vertical: N_f = mg.</li>
<li>Need μ ≥ f/N_f = 1/(2√3) ≈ 0.29.</li>
</ol>
<div class="exa">μ ≈ 0.29.</div></div>` },
{ t: "Angular momentum and its conservation", h: `
<p>L = Iω for a rigid spinner; generally L = r × p. When net external torque vanishes, <b>L is conserved</b> — the deep rule behind a skater spinning faster pulling arms in (I drops, ω rises) and planetary orbits sweeping equal areas.</p>
<div class="fml"><span class="fx">L = Iω conserved if τ_ext = 0 · KE_rot = ½Iω² · P = τω</span><span class="fd">rotational energy and power</span></div>
<div class="trap"><b>Trap.</b> Conserving kinetic energy in collision-with-rotation problems is usually wrong; conserve angular momentum (and total energy including heat/sound losses). Only elastic scenarios allow KE conservation.</div>` },
{ t: "Rolling motion", h: `
<p>Pure rolling = translation of CM plus rotation about CM, locked by v = Rω. Kinetic energy splits: KE = ½Mv² + ½I_cm ω² = ½Mv²(1 + k²/R²) where k² = I/MR². Rolling down an incline from height h reaches:</p>
<div class="fml"><span class="fx">v = √(2gh / (1 + k²/R²)) · a = g sinθ/(1 + k²/R²)</span><span class="fd">sphere beats disc beats ring down any slope</span></div>
<p>Because rotation soaks some energy, rolling bodies accelerate slower than a frictionless slider (a = g sinθ). Friction here is static and does no work — it merely enforces the rolling constraint.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Solid sphere rolls down h = 7 m incline. Speed at bottom? (g = 10)</div>
<ol class="steps">
<li>k²/R² = 2/5 ⇒ factor (1 + 2/5) = 7/5.</li>
<li>v² = 2gh/(7/5) = 10gh/7 = 10×10×7/7 = 100.</li>
</ol>
<div class="exa">v = 10 m/s.</div></div>` },
],
cps: [
{ q: "Ring, disc, solid sphere released together on a rough incline. First to the bottom?", o: ["ring", "disc", "sphere", "tie"], a: 2, e: "Smaller k²/R² wins: sphere (2/5) < disc (1/2) < ring (1).", after: 4 },
{ q: "Skater pulls arms in. What happens?", o: ["L and ω increase", "L constant, ω increases, KE increases", "L constant, ω decreases", "KE constant"], a: 1, e: "τ_ext=0 keeps L = Iω fixed; I falls so ω rises, and ½Lω rises too — work done by the skater's muscles.", after: 3 },
],
fl: [
["Parallel axis theorem", "I = I_cm + Md²"],
["Disc about central axis", "I = MR²/2"],
["Rolling KE split", "½Mv² + ½Iω²"],
["Condition for rolling w/o slipping", "v = Rω"],
],
},

"P-gravitation": {
mins: 22,
secs: [
{ t: "Newton's law of gravitation", h: `
<p>Every pair of masses attracts with F = GMm/r² along the joining line. G = 6.67×10⁻¹¹ N·m²/kg² — tiny, which is why gravity rules only at astronomical scales. The shell theorems make spheres behave like point masses at their centres (outside), and give zero field inside a uniform shell.</p>
<p>Weight is just the local gravitational pull: g = GM/R² ≈ 9.8 m/s², set by Earth's mass and radius, not by anything on the surface.</p>` },
{ t: "How g varies", h: `
<div class="tblw"><table class="tbl">
<tr><th>Location</th><th>Value of g</th></tr>
<tr><td>Height h (h ≪ R)</td><td>g(1 − 2h/R)</td></tr>
<tr><td>Depth d</td><td>g(1 − d/R) — linear, zero at centre</td></tr>
<tr><td>Rotation correction (latitude λ)</td><td>g' = g − ω²R cos²λ</td></tr>
</table></div>
<p>Inside a uniform planet, g ∝ r (linear spring-like field) — a tunnel through Earth would give SHM with period ≈ 84 minutes.</p>` },
{ t: "Gravitational field, potential, potential energy", h: `
<p>Field strength g(r) = GM/r² (N/kg). Potential V(r) = −GM/r (J/kg), negative by convention (zero at infinity) because the field does positive work as masses approach. Potential energy of a pair: U = −GMm/r.</p>
<div class="fml"><span class="fx">E_orbit = −GMm/2r · U = −GMm/r · K = +GMm/2r</span><span class="fd">for a circular orbit: E = U/2 = −K</span></div>
<p>The virial relation E = −K = U/2 is a favourite MCQ: binding energy of a satellite is GMm/2r, and raising an orbit makes E less negative (energy must be supplied).</p>` },
{ t: "Escape and orbital speeds", h: `
<div class="fml"><span class="fx">v_esc = √(2GM/R) = √(2gR) ≈ 11.2 km/s · v_orb = √(GM/r) · T² ∝ r³</span><span class="fd">escape ignores launch direction (except into ground!)</span></div>
<p>Kepler's laws summarise orbital motion: orbits are ellipses (Sun at focus); equal areas in equal times (= L conservation); T² ∝ a³. Geostationary satellites: T = 24 h fixes r ≈ 42,000 km from centre, orbiting in the equatorial plane west→east.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Satellite moved from orbit r to 2r. Energy cost?</div>
<ol class="steps">
<li>E_i = −GMm/2r, E_f = −GMm/4r.</li>
<li>ΔE = E_f − E_i = GMm/4r (positive — you pay fuel).</li>
</ol>
<div class="exa">ΔE = GMm/4r. Higher orbits are slower (v ↓) yet energetically higher.</div></div>
<div class="trap"><b>Trap.</b> Orbital speed decreases with altitude but you still need energy to get there — potential energy grows faster than kinetic energy falls.</div>` },
],
cps: [
{ q: "Weight measured inside a uniformly dense spherical shell:", o: ["larger than mg", "zero", "mg", "depends on position inside"], a: 1, e: "Shell theorem: net field inside a uniform shell is zero everywhere.", after: 0 },
{ q: "If Earth's radius shrank to half with mass fixed, escape velocity becomes…", o: ["half", "unchanged", "√2 times", "2 times"], a: 2, e: "v_esc ∝ √(M/R); halving R multiplies v_esc by √2.", after: 3 },
],
fl: [
["Escape velocity of Earth", "≈11.2 km/s"],
["Orbit energy relation", "E = −K = U/2"],
["g at depth d", "g(1 − d/R)"],
["Kepler's third law", "T² ∝ a³"],
],
},

"P-shm": {
mins: 24,
secs: [
{ t: "What makes motion 'simple harmonic'", h: `
<p>Oscillation about an equilibrium point is simple harmonic exactly when restoring force is proportional to displacement and opposite to it: F = −kx. Divide by mass and you get the defining differential equation:</p>
<div class="fml"><span class="fx">d²x/dt² = −ω²x · x(t) = A sin(ωt + φ)</span><span class="fd">ω = √(k/m); the signature of all SHM</span></div>
<p>Every system that reduces to this equation oscillates identically: mass-spring, pendulum (small angles), torsion balances, charge sloshing in LC circuits. Learn one, know them all.</p>` },
{ t: "Velocity and acceleration profiles", h: `
<p>Differentiate x = A sin(ωt+φ):</p>
<div class="tblw"><table class="tbl">
<tr><th>Quantity</th><th>Expression</th><th>Extreme values</th></tr>
<tr><td>Displacement</td><td>A sin(ωt+φ)</td><td>±A at extremes</td></tr>
<tr><td>Velocity</td><td>Aω cos(ωt+φ)</td><td>±Aω at centre</td></tr>
<tr><td>Acceleration</td><td>−Aω² sin(ωt+φ)</td><td>∓Aω² at extremes</td></tr>
</table></div>
<p>Memorise the phase picture: velocity leads displacement by 90°, acceleration lags displacement by 180°. At mean position: v max, a = 0. At amplitudes: v = 0, |a| max.</p>
<div class="fml"><span class="fx">v = ω√(A² − x²) · a = −ω²x</span><span class="fd">speed anywhere in the cycle</span></div>` },
{ t: "Energy in SHM", h: `
<p>Kinetic ½mω²(A²−x²), potential ½mω²x²; their sum is the constant ½mω²A² = ½kA². Energy sloshes between K and U twice per cycle; time-averages are equal (⟨K⟩ = ⟨U⟩ = E/2). Graphs of K, U vs time have period T/2.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Where is KE = PE in an oscillation of amplitude A?</div>
<ol class="steps">
<li>Set ½mω²(A²−x²) = ½mω²x².</li>
<li>A² − x² = x² ⇒ x = ±A/√2.</li>
</ol>
<div class="exa">x = A/√2 ≈ 0.707A from the mean position.</div></div>` },
{ t: "Spring systems and pendulums", h: `
<div class="tblw"><table class="tbl">
<tr><th>System</th><th>Frequency</th></tr>
<tr><td>Mass m on spring k</td><td>f = (1/2π)√(k/m)</td></tr>
<tr><td>Springs in series (k₁,k₂)</td><td>k_eq = k₁k₂/(k₁+k₂)</td></tr>
<tr><td>Springs in parallel</td><td>k_eq = k₁ + k₂</td></tr>
<tr><td>Spring cut into n equal parts</td><td>each piece k·n; stiffer!</td></tr>
<tr><td>Simple pendulum small angle</td><td>T = 2π√(l/g)</td></tr>
<tr><td>Pendulum in lift accelerating a</td><td>T = 2π√(l/(g±a))</td></tr>
</table></div>
<p>Springs obey H's law like rods obey elasticity: stiffness comes from geometry AND material. Cutting a spring shortens coil count, increasing k proportionally — counterintuitive but examinable.</p>
<div class="ex"><div class="ext">Worked example — two springs, one mass, between walls</div>
<div class="exq">Mass between identical springs k attached to opposite walls; displaced along the springs' line. Find period.</div>
<ol class="steps">
<li>Each spring contributes restoring force toward centre regardless of side.</li>
<li>Total effective constant = k + k = 2k (parallel behaviour).</li>
</ol>
<div class="exa">T = 2π√(m/2k).</div></div>` },
{ t: "Superposition and damping outlook", h: `
<p>Two same-direction, same-frequency SHMs superpose by phasors: resultant amplitude R = √(A₁²+A₂²+2A₁A₂cosδ). In-phase (δ=0) doubles amplitude for equal As; anti-phase cancels. Different frequencies produce beats in the envelope — foundation for wave physics next.</p>
<p>Real oscillators lose energy: damping adds a friction term giving exponentially decaying amplitude; forced + damped systems resonate when drive frequency matches natural frequency — the bridge-collapse cautionary tale.</p>
<div class="trap"><b>Trap.</b> Doubling amplitude doubles energy (E ∝ A²) but leaves period unchanged — period of SHM never depends on amplitude (isochronism).</div>` },
],
cps: [
{ q: "Phase difference between velocity and displacement in SHM:", o: ["0", "90°", "180°", "45°"], a: 1, e: "v = Aω cos(ωt+φ) vs x = A sin(ωt+φ): quarter-cycle lead.", after: 1 },
{ q: "A spring is cut into 2 equal halves. Stiffness of each half vs original k?", o: ["k/2", "k", "2k", "4k"], a: 2, e: "Shorter spring = stiffer: k_half = 2k.", after: 3 },
{ q: "Two equal SHMs with phase δ=120° superpose. Resultant amplitude?", o: ["2A", "A", "zero", "A√3"], a: 1, e: "R = √(A²+A²+2A²cos120°) = √(2A²−A²) = A.", after: 4 },
],
fl: [
["SHM defining equation", "a = −ω²x"],
["Max speed in SHM", "Aω at mean position"],
["Energy of oscillator", "E = ½mω²A² = ½kA²"],
["KE = PE location", "x = ±A/√2"],
["Pendulum in lift (up-accel)", "shorter period: g → g+a"],
],
},
};
