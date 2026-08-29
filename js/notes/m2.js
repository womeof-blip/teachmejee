/* Full Notes — Maths part 2 (binomial → differential equations). */

export const MATH_NOTES_2 = {

"M-binomial": {
mins: 20,
secs: [
{ t: "The expansion and its machinery", h: `
<div class="fml"><span class="fx">(x+y)ⁿ = Σ ⁿC_r x^{n−r}y^r · general term T_{r+1} = ⁿC_r x^{n−r} y^r</span><span class="fd">binomial theorem, n ∈ ℕ</span></div>
<p>Properties: ⁿC_r symmetric (C_r = C_{n−r}), sum of coefficients 2ⁿ, alternating sum 0; coefficients peak at middle. Term independent of x arises when powers cancel — set exponent equation to zero. Middle term(s): single for even n, two for odd n.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Term independent of x in (x + 1/x²)⁹?</div>
<ol class="steps">
<li>T_{r+1} = ⁹C_r x^{9−r}·x^{−2r} = ⁹C_r x^{9−3r}.</li>
<li>9−3r=0 ⇒ r=3 ⇒ term = ⁹C₃ = 84.</li>
</ol>
<div class="exa">84.</div></div>` },
{ t: "Applications and series tricks", h: `
<ul>
<li>Divisibility/proximity: write 49³ = (50−1)³ etc., expand, keep leading terms.</li>
<li>Greatest coefficient vs greatest TERM differ (multiply by powers too).</li>
<li>(1+x)ⁿ differentiated/integrated generates Σr·ⁿC_r = n·2^{n−1} identities.</li>
<li>Multinomial expansion counts (a+b+c)ⁿ via n!/p!q!r!.</li>
<li>Binomial with non-integer/fractional index converges for |x|&lt;1: (1+x)^{-1}=1−x+x²−… — the bridge into infinite series.</li>
</ul>
<div class="trap"><b>Trap.</b> Sum of COEFFICIENTS comes from setting variables to 1; sum with alternating signs sets one to −1. Questions phrase these as "sum of coefficients" vs "sum of terms' values" — read carefully.</div>` },
],
cps: [
{ q: "Number of terms in (a+b)¹²:", o: ["11", "12", "13", "144"], a: 2, e: "n+1 = 13.", after: 0 },
{ q: "Σ r·ⁿC_r over r=0..n equals…", o: ["2ⁿ", "n·2ⁿ", "n·2^{n−1}", "n²"], a: 2, e: "Differentiate (1+x)ⁿ then set x=1.", after: 1 },
],
fl: [
["General binomial term", "ⁿC_r x^{n−r} y^r"],
["Sum of all binomial coefficients", "2ⁿ"],
["Middle-term count", "1 if n even, 2 if n odd"],
],
},

"M-circles": {
mins: 22,
secs: [
{ t: "Circle equations decoded", h: `
<div class="fml"><span class="fx">centre-radius: (x−h)²+(y−k)²=r² · general: x²+y²+2gx+2fy+c=0 ⇒ centre(−g,−f), r=√(g²+f²−c)</span><span class="fd">complete the square both ways</span></div>
<p>Real circle needs g²+f² ≥ c. Circle through three points: solve simultaneous linear equations in g,f,c. Diameter form: ends (x₁,y₁),(x₂,y₂) give (x−x₁)(x−x₂)+(y−y₁)(y−y₂)=0 (right-angle in semicircle!).</p>` },
{ t: "Lines and circles: the interaction table", h: `
<p>Distance d from centre to line decides everything:</p>
<div class="tblw"><table class="tbl">
<tr><th>d vs r</th><th>Relation</th></tr>
<tr><td>d &gt; r</td><td>no intersection</td></tr>
<tr><td>d = r</td><td>tangent (one point)</td></tr>
<tr><td>d &lt; r</td><td>secant (chord), length 2√(r²−d²)</td></tr>
</table></div>
<p>Tangent at point (x₁,y₁) on circle: T=0 rule — replace xx₁, yy₁, (x+x₁)/2 style substitutions in general equation. Tangent slope m through external point leads to quadratic in m; discriminant zero gives tangent condition c² = r²(1+m²) for y=mx+c.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Length of chord cut by line x+y=4 on x²+y²=10? Centre distance first.</div>
<ol class="steps">
<li>Centre (0,0); d = |0+0−4|/√2 = 2√2.</li>
<li>Chord length = 2√(10−8) = 2√2.</li>
</ol>
<div class="exa">2√2 ≈ 2.83 units.</div></div>` },
{ t: "Two circles: radical axes & orthogonality", h: `
<p>Subtracting two circle equations kills quadratics → radical axis (equal-power locus). Intersecting circles: common chord lies on it. Touching: distance between centres = sum (external) or difference (internal). Orthogonal condition: 2(g₁g₂+f₁f₂) = c₁+c₂. Family S₁+λS₂=0 covers all circles through the intersection pair — the λ-trick again!</p>
<div class="trap"><b>Trap.</b> General-equation radius formula needs the SQUARE ROOT of (g²+f²−c) — forgetting the sign check gives imaginary radii silently. Also tangent "at" vs "from": at a known point use T=0; from an external point expect TWO tangents.</div>` },
],
cps: [
{ q: "Centre of x²+y²−4x+6y−3=0:", o: ["(2,−3)", "(−2,3)", "(4,−6)", "(2,3)"], a: 0, e: "(−g,−f) = (2,−3).", after: 0 },
{ q: "Tangency condition for y=mx+c on x²+y²=r²:", o: ["c=r", "c²=r²m²", "c²=r²(1+m²)", "m=c"], a: 2, e: "Distance from origin equals r.", after: 1 },
],
fl: [
["Chord length under line", "2√(r²−d²)"],
["Orthogonality condition", "2(g₁g₂+f₁f₂)=c₁+c₂"],
["Diameter-form circle", "dot product zero"],
],
},

"M-conics": {
mins: 28,
secs: [
{ t: "One definition to unify them all", h: `
<p>Conic = locus where distance to focus ÷ distance to directrix = eccentricity e. Circle e=0; ellipse 0&lt;e&lt;1; parabola e=1; hyperbola e&gt;1. Standard parabola y²=4ax: focus (a,0), directrix x=−a, latus rectum 4a. Parametric (at²,2at) turns every coordinate-geometry problem into algebra on t.</p>
<div class="tblw"><table class="tbl">
<tr><th>Curve</th><th>Standard eq</th><th>Eccentricity</th><th>Foci</th></tr>
<tr><td>Ellipse</td><td>x²/a²+y²/b²=1 (a&gt;b)</td><td>e=√(1−b²/a²)</td><td>(±ae,0)</td></tr>
<tr><td>Hyperbola</td><td>x²/a²−y²/b²=1</td><td>e=√(1+b²/a²)</td><td>(±ae,0)</td></tr>
<tr><td>Rect. hyperbola</td><td>xy=c²</td><td>√2</td><td>rotated frame</td></tr>
</table></div>` },
{ t: "Ellipse essentials", h: `
<p>b²=a²(1−e²); major axis 2a, minor 2b; latus rectum 2b²/a; sum of focal distances = 2a (the gardener's string trick). Auxiliary circle x²+y²=a² parametrises via (acosθ, bsinθ). Tangent at θ: xcosθ/a + ysinθ/b = 1; normal: ax/cosθ − by/sinθ = a²−b². Director circle (locus of perpendicular tangent pairs): x²+y²=a²+b².</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Ellipse with a=5, e=0.6. Find b and foci.</div>
<ol class="steps">
<li>b²=a²(1−e²)=25×0.64=16 ⇒ b=4.</li>
<li>Foci (±ae,0)=(±3,0).</li>
</ol>
<div class="exa">3-4-5 hiding inside an ellipse.</div></div>` },
{ t: "Hyperbola and conjugate twins", h: `
<p>b²=a²(e²−1); difference of focal distances = 2a. Asymptotes y=±(b/a)x guide sketching; conjugate hyperbola swaps axes; rectangular hyperbola has a=b. Parametric (asecθ, btanθ); for xy=c²: (ct, c/t). Tangent: xsecθ/a − ytanθ/b = 1. Focal chord properties and asymptote products (angle subtended = constant) appear in Advanced sets.</p>
<div class="trap"><b>Trap.</b> Ellipse vs hyperbola formulas mirror via b²=a²(1∓e²) — sign discipline prevents half-marks bleeding. Parabola focal distance = distance to directrix always (definition!), often faster than coordinates.</div>` },
{ t: "Parabola problem patterns", h: `
<p>Tangent at t: ty = x + at²; normal: tx + y = 2at + at³. Normal meets curve at up to THREE points (t₁t₂t₃ = −1 relation for concurrent normals). Focal chord endpoints t and −1/t; semi-latus rectum is harmonic mean of focal-chord segments. Reflection property (rays parallel axis → focus) explains satellite dishes — physics crossover questions love it.</p>` },
],
cps: [
{ q: "Latus rectum of y² = 12x:", o: ["3", "6", "12", "24"], a: 2, e: "4a = 12 since 4a=12 ⇒ a=3, LR=12.", after: 0 },
{ q: "For ellipse x²/25 + y²/16 = 1, e =", o: ["3/5", "4/5", "1/5", "5/3"], a: 0, e: "b²=a²(1−e²): 16=25(1−e²) ⇒ e=3/5.", after: 1 },
{ q: "Eccentricity of xy = c²:", o: ["1", "√2", "2", ">1 arbitrary"], a: 1, e: "Rectangular hyperbola: perpendicular asymptotes force √2.", after: 2 },
],
fl: [
["Parabola standard", "y²=4ax"],
["Ellipse focal sum", "2a"],
["Asymptotes of hyperbola", "y=±(b/a)x"],
],
},

"M-limits": {
mins: 26,
secs: [
{ t: "Limit laws and indeterminate forms", h: `
<p>Limits describe approached values; existence requires left = right. Algebra first: factor-cancel, rationalise conjugates. Indeterminate forms 0/0, ∞/∞, 0·∞, ∞−∞, 0⁰, 1^∞, ∞⁰ demand techniques beyond plugging-in.</p>
<div class="tblw"><table class="tbl">
<tr><th>Situation</th><th>Tool</th></tr>
<tr><td>sin kx / x → k</td><td>standard trig limit (x→0)</td></tr>
<tr><td>(1+a/x)ˣ → eᵃ</td><td>exponential form</td></tr>
<tr><td>(aˣ−1)/x → ln a</td><td>logarithmic standard</td></tr>
<tr><td>0/0 polynomial ratio</td><td>factor or L'Hôpital</td></tr>
<tr><td>1^∞</td><td>take log, convert</td></tr>
</table></div>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">lim_{x→0}(1−cosx)/x².</div>
<ol class="steps">
<li>1−cosx = 2sin²(x/2) ⇒ expression = 2sin²(x/2)/x².</li>
<li>= ½[sin(x/2)/(x/2)]² → ½·1² = ½.</li>
</ol>
<div class="exa">1/2.</div></div>` },
{ t: "Continuity and differentiability gatekeeping", h: `
<p>f continuous at a: limit equals value (three checks: exists f(a), exists lim, equal). Piecewise functions join smoothly when both continuity AND derivative-match hold at seams. Differentiability implies continuity; converse fails (|x| at 0). One-sided derivatives expose corners/cusps.</p>
<div class="trap"><b>Trap.</b> Limits can exist without the function being defined there (holes). Continuity ≠ differentiability — the absolute value function is the eternal counterexample.</div>` },
],
cps: [
{ q: "lim_{x→0} sin5x / tan3x =", o: ["5/3", "1", "0", "15"], a: 0, e: "Both ratios →1: sin5x≈5x, tan3x≈3x.", after: 0 },
{ q: "|x| is…", o: ["continuous everywhere, differentiable except 0", "differentiable everywhere", "discontinuous at 0", "nowhere continuous"], a: 0, e: "Corner at origin kills derivative only.", after: 1 },
],
fl: [
["First principles trig limit", "sinx/x → 1"],
["Continuity triple-check", "value, limits, equality"],
],
},

"M-diff": {
mins: 30,
secs: [
{ t: "Derivative rules arsenal", h: `
<div class="tblw"><table class="tbl">
<tr><th>Rule</th><th>Statement</th></tr>
<tr><td>Product</td><td>(uv)′=u′v+uv′</td></tr>
<tr><td>Quotient</td><td>(u/v)′=(u′v−uv′)/v²</td></tr>
<tr><td>Chain</td><td>[f(g(x))]′=f′(g)·g′(x)</td></tr>
<tr><td>Parametric</td><td>dy/dx=(dy/dt)/(dx/dt)</td></tr>
<tr><td>Inverse</td><td>dy/dx=1/(dx/dy) at corresponding points</td></tr>
<tr><td>Logarithmic</td><td>for u^v forms take ln first</td></tr>
</table></div>
<p>Standard derivatives must be reflex-speed: polynomials, sin/cos/tan/sec, eˣ, ln x, aˣ, inverse trigs. Implicit differentiation: differentiate both sides treating y as y(x), collect dy/dx.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Differentiate x^x.</div>
<ol class="steps">
<li>y=x^x ⇒ lny = x lnx.</li>
<li>Differentiate: y′/y = lnx + 1.</li>
<li>y′ = x^x(lnx+1).</li>
</ol>
<div class="exa">Logarithmic differentiation handles variable base AND exponent.</div></div>` },
{ t: "Tangents, normals, rates", h: `
<p>Geometric meaning: dy/dx = tangent slope. Normal slope = −1/(dy/dx). Increasing/decreasing intervals via sign of f′ (critical points f′=0 or undefined). Maxima/minima second-derivative test (f″&lt;0 max, &gt;0 min); first-derivative sign-flip test safer around cusps. Related rates: differentiate constraint w.r.t. time (ladder sliding, balloon inflating, cone draining — draw first, label variables, THEN differentiate).</p>
<div class="ex"><div class="ext">Worked example — related rates</div>
<div class="exq">Cube edge grows at 2 cm/s. Volume rate when edge 3 cm?</div>
<ol class="steps">
<li>V=x³ ⇒ dV/dt = 3x²·dx/dt.</li>
<li>= 3×9×2 = 54 cm³/s.</li>
</ol>
<div class="exa">54 cm³/s.</div></div>` },
{ t: "Mean value tools and approximations", h: `
<p>Rolle: equal endpoint values grant a horizontal tangent inside. Lagrange MVT upgrades: f(b)−f(a)=f′(c)(b−a) — slopes average out somewhere. Applications: proving inequalities (sinx &lt; x for x&gt;0), root-counting via monotonicity, error propagation Δy ≈ f′(x)Δx (the physics-error chapter connection!). Monotonic function ⇒ at most one root per interval — injectivity arguments.</p>
<div class="trap"><b>Trap.</b> Critical point ≠ extremum necessarily (inflection with horizontal tangent, like x³). Always run the sign test; don't trust f′=0 alone.</div>` },
],
cps: [
{ q: "Slope of tangent to y=x² at x=3:", o: ["3", "6", "9", "1/6"], a: 1, e: "2x = 6.", after: 1 },
{ q: "If f′>0 on an interval, f is…", o: ["constant", "increasing", "decreasing", "concave"], a: 1, e: "Positive derivative = rising graph.", after: 1 },
],
fl: [
["Chain rule", "outer′ × inner′"],
["Second-derivative test", "f″<0 max, >0 min"],
["MVT", "f(b)−f(a)=f′(c)(b−a)"],
],
},

"M-vectors": {
mins: 24,
secs: [
{ t: "Vector basics and products", h: `
<p>Vectors carry magnitude+direction: addition triangle/parallelogram, scalar multiple scales. Position vectors make every geometry statement computable. Products split personalities:</p>
<div class="fml"><span class="fx">dot: a⃗·b⃗ = |a||b|cosθ (scalar; projection engine) · cross: |a×b|=|a||b|sinθ (area engine, direction ⊥ plane, right-hand rule)</span><span class="fd">⊥ test dot=0; ∥ test cross=0⃗</span></div>
<p>Component forms: a·b = a₁b₁+a₂b₂+a₃b₃; cross determinant i,j,k expansion. Projection of a on b: (a·b)/|b|. Area of triangle ½|AB×AC|; parallelogram full product; box (scalar triple) volume |[abc]|, coplanar when zero.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Find angle between i+j and j+k.</div>
<ol class="steps">
<li>Dots: 1. Moduli: √2, √2.</li>
<li>cosθ = 1/2 ⇒ θ=60°.</li>
</ol>
<div class="exa">60°.</div></div>` },
{ t: "Section formula and geometric workhorses", h: `
<p>Point dividing PV internally m:n: (nb⃗+ma⃗)/(m+n)? Careful: r = (na+mb)/(m+n) for AP:PB=m:n. Midpoint averages. Centroid of triangle (a+b+c)/3. Collinearity: vectors proportional; coplanarity: scalar triple zero. Work done W=F·d (physics handshake!); torque τ=r×F; moment about axis uses component projections — vector chapters power mechanics directly.</p>
<div class="trap"><b>Trap.</b> Dot commutes, cross ANTIconmutes (a×b=−b×a); distributivity holds for both but cross has no associativity — bracket order matters. Unit vectors along bisectors: (â±b̂) normalised.</div>` },
],
cps: [
{ q: "a⃗·b⃗ = 0 with nonzero vectors means…", o: ["parallel", "perpendicular", "equal", "anti-parallel"], a: 1, e: "cos90°=0.", after: 0 },
{ q: "Area of parallelogram spanned by diagonals-relation: |a×b| gives area of…", o: ["triangle", "parallelogram formed by a,b", "circle", "nothing"], a: 1, e: "Full parallelogram; triangle needs half.", after: 0 },
],
fl: [
["Perpendicularity test", "dot = 0"],
["Scalar triple product zero", "coplanar"],
["Projection formula", "(a·b)/|b|"],
],
},

"M-prob": {
mins: 26,
secs: [
{ t: "Conditional probability and multiplication", h: `
<div class="fml"><span class="fx">P(A|B)=P(A∩B)/P(B) · independence: P(A∩B)=P(A)P(B)</span><span class="fd">condition shrinks the sample space</span></div>
<p>Independent ≠ mutually exclusive (exclusive events with positive probability are dependent!). Chain multiplication extends to sequences; tree diagrams keep branches honest — multiply along paths, add across outcomes.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Two cards drawn without replacement. P(second king | first king)? And unconditional?</div>
<ol class="steps">
<li>Given first king: 3 kings among 51 ⇒ 3/51=1/17.</li>
<li>Unconditional: (4/52)(3/51)=1/221.</li>
</ol>
<div class="exa">1/17 conditional; 1/221 overall — condition changes denominators.</div></div>` },
{ t: "Bayes and total probability", h: `
<p>Partition sample space by causes B₁…Bₙ: P(A)=ΣP(Bᵢ)P(A|Bᵢ) (total probability). Reverse inference uses Bayes: P(Bᵢ|A) = P(Bᵢ)P(A|Bᵢ)/P(A) — updating belief after evidence, the mathematics behind medical tests and spam filters. Base-rate neglect: rare diseases make even accurate tests misleadingly weak — compute, don't intuit.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Bag I: 3R 2B; Bag II: 1R 4B. A red drawn (bag chosen equally). P(from I)?</div>
<ol class="steps">
<li>P(R)=½·3/5 + ½·1/5 = 2/5.</li>
<li>Bayes: P(I|R) = (½·3/5)/(2/5) = 3/4.</li>
</ol>
<div class="exa">3/4 — reds more likely came from bag I.</div></div>` },
{ t: "Random variables, distributions, Bernoulli trials", h: `
<p>Random variable maps outcomes to numbers; probability distribution lists P(X=x) with Σ=1. Mean E(X)=Σxp, variance Σx²p−μ². Binomial: n independent success/fail trials, P(X=k)=C(n,k)p^k q^{n−k}, mean np, variance npq. Poisson approximates binomial for big-n small-p (λ=np). Hypergeometric handles without-replacement draws — know which model matches the story.</p>
<div class="trap"><b>Trap.</b> Variance of binomial is npq NOT npq² — and E(XY)=E(X)E(Y) requires independence, not mere knowledge of individual means.</div>` },
],
cps: [
{ q: "Mutually exclusive events with P(A)=0.3, P(B)=0.4 have P(A∪B)=", o: ["0.7", "0.12", "0.58", "1"], a: 0, e: "Intersection empty ⇒ plain addition.", after: 0 },
{ q: "Binomial mean and variance for n=10, p=0.5:", o: ["5, 5", "5, 2.5", "2.5, 5", "10, 5"], a: 1, e: "np=5, npq=2.5.", after: 2 },
],
fl: [
["Bayes numerator", "P(B)P(A|B)"],
["Binomial distribution law", "C(n,k)pᵏqⁿ⁻ᵏ"],
["Independence test", "P(A∩B)=P(A)P(B)"],
],
},

"M-stats": {
mins: 16,
secs: [
{ t: "Dispersion measures compared", h: `
<div class="tblw"><table class="tbl">
<tr><th>Measure</th><th>Formula essence</th><th>Notes</th></tr>
<tr><td>Range</td><td>max−min</td><td>crude, outlier-sensitive</td></tr>
<tr><td>Mean deviation</td><td>Σ|x−a|/n</td><td>least about median</td></tr>
<tr><td>Variance σ²</td><td>mean of squared deviations</td><td>least about mean</td></tr>
<tr><td>Coefficient of variation</td><td>σ/x̄ ×100%</td><td>compares across units/scales</td></tr>
</table></div>
<p>Shortcut variance for frequency data: σ² = Σfx²/n − (Σfx/n)². Transformations: adding constant shifts nothing in spread; multiplying multiplies σ by |k|.</p>` },
{ t: "Mathematical reasoning: logic gates for marks", h: `
<p>Statements, negations (∼p flips truth), compound connectives: ∧ conjunction (AND), ∨ disjunction (OR), ⇒ implication, ⇔ biconditional. Truth tables decide tautology (always true) vs contradiction (never). Key equivalences: De Morgan ∼(p∧q)=∼p∨∼q; contrapositive (p⇒q ≡ ∼q⇒∼p) preserves truth while converse/inverse don't. Quantifiers ∀ (all) and ∃ (exists): negating flips them — ∼∀x P = ∃x ∼P.</p>
<div class="trap"><b>Trap.</b> An implication is FALSE only when true hypothesis meets false conclusion — every other row is true. This single fact answers most truth-table MCQs instantly.</div>` },
],
cps: [
{ q: "Contrapositive of 'if it rains, the match cancels':", o: ["if no rain, match plays", "if match plays, it didn't rain", "if match cancels, it rained", "rain ⇔ cancellation"], a: 1, e: "Swap AND negate: ∼q ⇒ ∼p.", after: 1 },
{ q: "Multiplying all data by 3 multiplies SD by…", o: ["3", "9", "unchanged", "√3"], a: 0, e: "Linear scaling.", after: 0 },
],
fl: [
["CV meaning", "relative variability %"],
["Implication false case only", "T→F"],
],
},

"M-3dgeo": {
mins: 22,
secs: [
{ t: "Direction cosines and lines", h: `
<p>A line's orientation rides on direction cosines l,m,n with l²+m²+n²=1 (or direction ratios proportional). Line through (x₁,y₁,z₁) with ratios a,b,c: (x−x₁)/a = (y−y₁)/b = (z−z₁)/c. Angle between lines via cosθ = |l₁l₂+m₁m₂+n₁n₂| using ratios directly (normalise not required for the cosine of angle between RATIO vectors — just divide by moduli).</p>
<div class="fml"><span class="fx">⊥ lines: a₁a₂+b₁b₂+c₁c₂=0 · ∥: ratios equal · skew: neither parallel nor intersecting (3D exclusive!)</span><span class="fd">the trio of relations</span></div>` },
{ t: "Planes and their equations", h: `
<div class="tblw"><table class="tbl">
<tr><th>Form</th><th>Equation</th></tr>
<tr><td>Normal form</td><td>r⃗·n̂ = d</td></tr>
<tr><td>Cartesian normal</td><td>a(x−x₁)+b(y−y₁)+c(z−z₁)=0</td></tr>
<tr><td>Intercept</td><td>x/a+y/b+z/c=1</td></tr>
<tr><td>General</td><td>ax+by+cz+d=0</td></tr>
</table></div>
<p>Angle between planes = angle between normals. Point-to-plane distance |ax₁+by₁+cz₁+d|/√(a²+b²+c²). Plane through 3 points: determinant condition or two-vector cross for normal. Family ax+by+cz+d+λ(planar partner) handles passing-through-line constraints.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Distance from (1,2,3) to plane 2x−y+2z=5.</div>
<ol class="steps">
<li>|2−2+6−5|/√(4+1+4) = 1/3.</li>
</ol>
<div class="exa">1/3 unit.</div></div>` },
{ t: "Line–plane interactions", h: `
<p>Substitute parametric line into plane equation: solvable t ⇒ unique intersection; identity ⇒ line lies IN plane; contradiction ⇒ parallel. Foot of perpendicular and image of a point follow the normal-direction march (like 2D images but with z). Shortest distance between skew lines: project connecting vector onto common normal n̂ = (b₁×b₂)/|b₁×b₂|: d = |(a₂−a₁)·(b₁×b₂)|/|b₁×b₂|.</p>
<div class="trap"><b>Trap.</b> In 3D, non-intersecting lines aren't automatically parallel — skewness is the third possibility students forget until Advanced papers remind them.</div>` },
],
cps: [
{ q: "Direction ratios 1,2,2 ⇒ actual direction cosines:", o: ["(1/3,2/3,2/3)", "(1,2,2)", "(1/9,4/9,4/9)", "(1/2,1/2,1/2)"], a: 0, e: "Modulus √9=3 divides each.", after: 0 },
{ q: "Skew lines are…", o: ["intersecting", "non-coplanar non-parallel", "parallel", "perpendicular"], a: 1, e: "The purely-3D relationship.", after: 1 },
],
fl: [
["Line-plane substitution outcome", "unique / contained / parallel"],
["Skew shortest distance", "|(a₂−a₁)·(b₁×b₂)|/|b₁×b₂|"],
],
},

"M-integ": {
mins: 30,
secs: [
{ t: "Antiderivatives: the standard table", h: `
<div class="tblw"><table class="tbl">
<tr><th>f(x)</th><th>∫f dx</th></tr>
<tr><td>xⁿ (n≠−1)</td><td>x^{n+1}/(n+1)</td></tr>
<tr><td>1/x</td><td>ln|x|</td></tr>
<tr><td>eˣ, aˣ</td><td>eˣ, aˣ/ln a</td></tr>
<tr><td>sin, cos</td><td>−cos, sin</td></tr>
<tr><td>sec², cosec²</td><td>tan, −cot</td></tr>
<tr><td>1/(1+x²), 1/√(1−x²)</td><td>tan⁻¹x, sin⁻¹x</td></tr>
<tr><td>1/(x²−a²), 1/√(x²±a²)</td><td>log/artanh forms</td></tr>
</table></div>
<p>Methods ladder: simplification → substitution (spot derivative inside) → by parts (ILATE priority: Inverse, Log, Algebraic, Trig, Exponential) → partial fractions (rational functions) → special forms (√quadratics complete square → shifted standard).</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">∫x eˣ dx.</div>
<ol class="steps">
<li>By parts with u=x, dv=eˣdx: xeˣ − ∫eˣdx.</li>
</ol>
<div class="exa">xeˣ − eˣ + C. (ILATE puts algebraic before exponential.)</div></div>` },
{ t: "Substitution patterns worth spotting", h: `
<ul>
<li>∫f(ax+b)dx ⇒ t=ax+b wholesale.</li>
<li>∫f′(x)/f(x) dx = ln|f(x)| (derivative-on-top signature).</li>
<li>∫ f′·(f)^n dx = f^{n+1}/(n+1).</li>
<li>Trig powers: even cos use half-angle; odd sin peel one off; products use product-to-sum.</li>
<li>1/(a sinx + b cosx): combine amplitude-phase then standard tan-half.</li>
<li>Rational in sin,cos: Weierstrass t=tan(x/2) converts everything to rational algebra.</li>
</ul>
<div class="tipbox"><b>Tip.</b> Definite integral shortcuts: ∫₀^a f(x)dx = ∫₀^a f(a−x)dx (king property); even/odd symmetry halves/kills integrals; periodicity slides windows by period. These three crack most JEE definite-integral MCQs without antideriving anything.</div>` },
{ t: "Partial fractions map", h: `
<div class="tblw"><table class="tbl">
<tr><th>Denominator factor</th><th>Contribution</th></tr>
<tr><td>(x−a)</td><td>A/(x−a)</td></tr>
<tr><td>(x−a)²</td><td>A/(x−a)+B/(x−a)²</td></tr>
<tr><td>irreducible quadratic</td><td>(Ax+B)/quadratic</td></tr>
</table></div>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">∫dx/(x²−1).</div>
<ol class="steps">
<li>Split: ½[1/(x−1) − 1/(x+1)].</li>
<li>Integrate each: ½ln|(x−1)/(x+1)| + C.</li>
</ol>
<div class="exa">Half-log artanh form.</div></div>` },
],
cps: [
{ q: "∫₀^{π/2} sin²x dx =", o: ["π/2", "π/4", "1/2", "π"], a: 1, e: "Average of sin² over quarter period = 1/2 × length π/2 = π/4.", after: 1 },
{ q: "ILATE chooses u by…", o: ["alphabet", "which differentiates cleanly first", "random", "larger exponent"], a: 1, e: "Inverse/log/algebraic differentiate toward simpler forms.", after: 0 },
],
fl: [
["King property", "swap x → a−x in [0,a]"],
["∫f'/f", "= ln|f| + C"],
["Weierstrass substitution", "t = tan(x/2)"],
],
},

"M-defint": {
mins: 26,
secs: [
{ t: "From antiderivative to signed area", h: `
<div class="fml"><span class="fx">∫ₐᵇ f(x)dx = F(b) − F(a) · area interpretation with sign below axis negative</span><span class="fd">FTC part 2</span></div>
<p>Leibnitz rule differentiates parameter-bounded integrals: d/da ∫_φ(a)^ψ(a) f = f(ψ)ψ′ − f(φ)φ′. Limit-as-sum connects to physics totals (work from force curves, charge from current graphs). Odd/even symmetry on [−a,a]: odd integrates to ZERO, even doubles half-interval — instant answers.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">∫_{−2}^{2} (x³ + x² + 1) dx.</div>
<ol class="steps">
<li>x³ odd ⇒ vanishes.</li>
<li>Remaining: 2∫₀²(x²+1)dx = 2[(8/3)+2] = 28/3.</li>
</ol>
<div class="exa">28/3.</div></div>` },
{ t: "Areas under and between curves", h: `
<p>Area = ∫(upper − lower)dx between intersection abscissae (solve f=g first!). With y-axis swap roles or integrate x(y). Curves crossing mid-interval demand splitting. Parametric areas substitute dx = x′(t)dt with new bounds; polar areas ½∫r²dθ.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Area between y=x and y=x².</div>
<ol class="steps">
<li>Intersections x=0,1; upper is line.</li>
<li>∫₀¹(x−x²)dx = ½ − ⅓ = 1/6.</li>
</ol>
<div class="exa">1/6 sq units.</div></div>` },
{ t: "Differential equations preview bridge", h: `
<p>Definite integrals with moving tops define new functions (Fresnel-type), whose derivatives revert via FTC — many "find f′ given integral equation" problems are FTC in costume. Average value of f on [a,b] = integral/(b−a): the continuous cousin of arithmetic mean.</p>
<div class="trap"><b>Trap.</b> Area questions need POSITIVE accumulation: if curve dips below axis, integrate |f| or split at zeros — signed integrals subtract area you still owe.</div>` },
],
cps: [
{ q: "∫_{−1}^{1} x³cos²x dx =", o: ["2", "1/2", "0", "π"], a: 2, e: "Odd function over symmetric interval.", after: 1 },
{ q: "Average value of x² on [0,3]:", o: ["3", "9", "1", "27"], a: 0, e: "(1/3)(27/3)=3.", after: 1 },
],
fl: [
["Even-function shortcut", "double the half-integral"],
["Between-curves area", "integrate upper−lower"],
["Leibnitz rule", "differentiate bounds too"],
],
},

"M-diffeq": {
mins: 24,
secs: [
{ t: "Order, degree, solution anatomy", h: `
<p>Order = highest derivative; degree = its power (after clearing radicals/fractions in derivatives). General solution carries constants = order; particular solutions pin them via conditions. Verification: differentiate and eliminate arbitrary constants backwards — favourite exam reverse-engineering task.</p>` },
{ t: "Variable separable and reducible forms", h: `
<p>Separable: collect all-y with dy, all-x with dx, integrate both sides. Homogeneous dy/dx = F(y/x): substitute y=vx reducing to separable in v. Linear first-order dy/dx+Py=Q: multiply integrating factor e^{∫Pdx}; solution y·IF = ∫Q·IF dx — recognise the LINEAR signature (y plus derivative present, no y² etc.).</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">dy/dx + y/x = x².</div>
<ol class="steps">
<li>IF = e^{∫dx/x} = x.</li>
<li>y·x = ∫x³dx = x⁴/4 + C.</li>
</ol>
<div class="exa">y = x³/4 + C/x.</div></div>` },
{ t: "Growth models and applied setups", h: `
<ul>
<li>Exponential growth/decay: dN/dt = kN ⇒ N = N₀e^{kt} (population, radioactivity link to physics!).</li>
<li>Newton cooling: dT/dt = −k(T−Ts).</li>
<li>Mixed-tank problems track salt mass via rate-in minus rate-out bookkeeping.</li>
<li>Orthogonal trajectories: eliminate parameter, replace dy/dx by −dx/dy, solve anew.</li>
</ul>
<div class="ex"><div class="ext">Worked example — decay</div>
<div class="exq">Substance halves in 10 days. Model N(t)?</div>
<ol class="steps">
<li>k = ln2/10.</li>
</ol>
<div class="exa">N = N₀e^{−(ln2)t/10} = N₀·2^{−t/10}.</div></div>
<div class="trap"><b>Trap.</b> Degree is undefined when derivatives hide under radicals/trig that clearing can't fix — some questions test exactly this edge. And homogeneous ≠ linear: check BOTH definitions independently.</div>` },
],
cps: [
{ q: "Order and degree of (d²y/dx²)³ + (dy/dx)⁴ = 0:", o: ["2, 3", "2, 4", "3, 2", "4, 2"], a: 0, e: "Highest derivative is second; its power is 3.", after: 0 },
{ q: "Integrating factor for dy/dx + 2y = eˣ:", o: ["eˣ", "e²ˣ", "2eˣ", "e^{x²}"], a: 1, e: "IF = e^{∫2dx}.", after: 1 },
],
fl: [
["Linear ODE solution", "y·IF = ∫Q·IF dx"],
["Homogeneous substitution", "y = vx"],
["Radioactive-style growth law", "N=N₀e^{kt}"],
],
},
};