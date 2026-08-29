/* Full Notes — Maths part 1 (foundation → P&C). */

export const MATH_NOTES_1 = {

"f-numbers": {
mins: 10,
secs: [
{ t: "The number family tree", h: `
<p>Natural ⊂ whole ⊂ integers ⊂ rationals ⊂ reals ⊂ complex. Rationals are p/q with terminating or repeating decimals; irrationals (√2, π, e) never repeat. Density: between any two reals sits another real (and infinitely many). Key operations:</p>
<div class="tblw"><table class="tbl">
<tr><th>Rule</th><th>Statement</th></tr>
<tr><td>Exponent laws</td><td>aᵐ·aⁿ=aᵐ⁺ⁿ; aᵐ/aⁿ=aᵐ⁻ⁿ; (aᵐ)ⁿ=aᵐⁿ; a⁰=1</td></tr>
<tr><td>Negative exponents</td><td>a⁻ⁿ=1/aⁿ</td></tr>
<tr><td>Rationalise</td><td>1/(√a+√b) = (√a−√b)/(a−b)</td></tr>
<tr><td>Modulus</td><td>|x| = x (x≥0), −x (x&lt;0); distance from 0</td></tr>
</table></div>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Simplify (√5+√3)/(√5−√3).</div>
<ol class="steps">
<li>Multiply top & bottom by conjugate (√5+√3): numerator (5+2√15+3)=8+2√15.</li>
<li>Denominator 5−3=2 ⇒ answer 4+√15.</li>
</ol>
<div class="exa">4 + √15.</div></div>` },
],
cps: [
{ q: "Which is irrational?", o: ["22/7", "0.333…", "π", "0.1010…"], a: 2, e: "π never repeats; 22/7 merely approximates it.", after: 0 },
],
fl: [
["Rationalising factor of a+b√c", "a−b√c"],
["|x| meaning", "distance from zero on number line"],
],
},

"f-arithmetic": {
mins: 12,
secs: [
{ t: "Percentages, ratios and their JEE disguises", h: `
<p>Percent change: new = old(1 ± r/100). Successive changes MULTIPLY: +10% then −10% nets −1% (0.9×1.1=0.99) — the classic trap. Ratio problems reduce to one unknown via parts.</p>
<div class="tblw"><table class="tbl">
<tr><th>Tool</th><th>Formula</th></tr>
<tr><td>Speed</td><td>v = d/t; average = total d/total t</td></tr>
<tr><td>Profit %</td><td>(SP−CP)/CP ×100</td></tr>
<tr><td>Simple interest</td><td>PRT/100</td></tr>
<tr><td>Alligation</td><td>cheap:dear ratio = |M−C₁| : |C₂−M|</td></tr>
</table></div>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Mix 20% and 50% acid to get 30%. Ratio?</div>
<ol class="steps">
<li>|30−20| : |50−30| = 10 : 20 = 1:2.</li>
<li>So cheap:dear = 2:1 (heavier weight on cheaper side!).</li>
</ol>
<div class="exa">2 parts weak : 1 part strong.</div></div>` },
],
cps: [
{ q: "A price rises 25% then falls 20%. Net change?", o: ["+5%", "no change", "−5%", "+45%"], a: 1, e: "1.25×0.8 = 1 exactly.", after: 0 },
],
fl: [
["Successive change", "multiply factors, don't add percentages"],
["Alligation ratio", "distances from mean price"],
],
},

"f-algebra": {
mins: 14,
secs: [
{ t: "Identities that pay rent forever", h: `
<div class="fml"><span class="fx">(a±b)² = a²±2ab+b² · a²−b²=(a−b)(a+b) · (a+b)³=a³+3a²b+3ab²+b³ · a³±b³=(a±b)(a²∓ab+b²)</span><span class="fd">the permanent toolkit</span></div>
<p>Linear systems ax+by=c solved by elimination/substitution; graphical view: intersecting lines = unique solution, parallel = none, coincident = infinite (consistency conditions via ratios a₁/a₂ vs b₁/b₂ vs c₁/c₂).</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Factorise x³ − 8.</div>
<ol class="steps">
<li>Difference of cubes: a³−b³ = (a−b)(a²+ab+b²) with b=2.</li>
</ol>
<div class="exa">(x−2)(x²+2x+4).</div></div>` },
],
cps: [
{ q: "If a+b=5, ab=6, find a²+b²:", o: ["13", "25", "37", "11"], a: 0, e: "25 − 2×6 = 13.", after: 0 },
],
fl: [
["a³+b³ factorisation", "(a+b)(a²−ab+b²)"],
],
},

"f-geometry": {
mins: 14,
secs: [
{ t: "Triangle facts that resurface in conics & optics", h: `
<ul>
<li>Angle sum 180°; exterior angle = sum of remote interiors.</li>
<li>Pythagoras a²+b²=c²; converse identifies right angles.</li>
<li>Similar triangles (AA enough) give proportional sides — basis of shadow/mirror problems.</li>
<li>Congruence shortcuts SAS, ASA, SSS, RHS.</li>
<li>Centroid divides medians 2:1 from vertex; circumcentre/incentre/orthocentre existences matter later for coordinate geometry.</li>
</ul>
<p>Circle essentials: tangent ⊥ radius at contact; equal chords equidistant from centre; angle in semicircle = 90°; alternate segment theorem (tangent-chord angle equals opposite interior). Two-circle tangency: d = r₁+r₂ external touch, |r₁−r₂| internal.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Ladder 5 m leans on wall, base 3 m out. Height reached?</div>
<ol class="steps">
<li>h = √(25−9) = 4 m.</li>
</ol>
<div class="exa">4 m — the 3-4-5 triple hiding in plain sight.</div></div>` },
],
cps: [
{ q: "Angle between tangent and chord through contact equals…", o: ["90°", "angle in alternate segment", "central angle", "zero"], a: 1, e: "Alternate segment theorem.", after: 0 },
],
fl: [
["Centroid division of median", "2:1 from vertex"],
["Tangent-radius angle", "90°"],
],
},

"f-mensuration": {
mins: 14,
secs: [
{ t: "The formula bank", h: `
<div class="tblw"><table class="tbl">
<tr><th>Solid</th><th>Volume</th><th>Surface area</th></tr>
<tr><td>Cylinder</td><td>πr²h</td><td>2πr(r+h)</td></tr>
<tr><td>Cone</td><td>⅓πr²h</td><td>πr(l+r), l=slant</td></tr>
<tr><td>Sphere</td><td>4⁄3πr³</td><td>4πr²</td></tr>
<tr><td>Hemisphere</td><td>⅔πr³</td><td>3πr² (closed)</td></tr>
<tr><td>Cuboid</td><td>lbh</td><td>2(lb+bh+hl)</td></tr>
</table></div>
<p>2D: circle πr², sector θ/360·πr², triangle ½bh or ½ab·sinC, trapezium ½(a+b)h, rhombus ½d₁d₂. Composite solids: add volumes, subtract hidden areas — read carefully whether "surface" means total, curved, or exposed after placement.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Cone melted into sphere of double radius? Find relation between cone's r,h and sphere R.</div>
<ol class="steps">
<li>⅓πr²h = 4⁄3π(2r)³ ⇒ r²h = 32r³.</li>
</ol>
<div class="exa">h = 32r.</div></div>` },
],
cps: [
{ q: "Sector angle doubled: area becomes…", o: ["same", "double", "quadruple", "half"], a: 1, e: "Area ∝ θ.", after: 0 },
],
fl: [
["Sphere volume", "(4/3)πr³"],
],
},

"f-trig": {
mins: 16,
secs: [
{ t: "Ratios, values, identities", h: `
<div class="tblw"><table class="tbl">
<tr><th>θ</th><th>sin</th><th>cos</th><th>tan</th></tr>
<tr><td>0°</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>30°</td><td>½</td><td>√3/2</td><td>1/√3</td></tr>
<tr><td>45°</td><td>1/√2</td><td>1/√2</td><td>1</td></tr>
<tr><td>60°</td><td>√3/2</td><td>½</td><td>√3</td></tr>
<tr><td>90°</td><td>1</td><td>0</td><td>∞</td></tr>
</table></div>
<div class="fml"><span class="fx">sin²+cos²=1 · 1+tan²=sec² · sin(90−θ)=cosθ · tanθ=sin/cos</span><span class="fd">the survival set</span></div>
<p>Heights & distances template: draw right triangle, mark elevation angle at observer, opposite = height sought, adjacent = horizontal distance: tan(elevation) = h/d. Angle of depression mirrors from cliff tops downward.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Tower casts shadow when sun elevates 30°; shadow 20 m. Height?</div>
<ol class="steps">
<li>tan30° = h/20 ⇒ h = 20/√3 ≈ 11.55 m.</li>
</ol>
<div class="exa">≈11.5 m.</div></div>` },
],
cps: [
{ q: "If sinθ = 3/5 (acute), cosθ =", o: ["4/5", "3/4", "5/4", "5/3"], a: 0, e: "3-4-5 triangle; acute keeps cosine positive.", after: 0 },
],
fl: [
["sin30°", "1/2"],
["Pythagorean identity", "sin²θ+cos²θ=1"],
],
},

"f-stats": {
mins: 12,
secs: [
{ t: "Averages and spread", h: `
<p>Mean Σx/n shifts when every value shifts (add c → mean adds c; multiply by k → multiplies by k). Median robust to outliers; mode needs frequency. For grouped data use class marks × frequencies.</p>
<div class="fml"><span class="fx">variance σ² = Σ(x−x̄)²/n · σ = √σ²</span><span class="fd">spread about the mean</span></div>
<p>Probability foundations: P(E) = favourable/total ∈ [0,1]; complement P(not E)=1−P(E); independent events multiply; mutually exclusive events add. Empirical probability approaches theoretical as trials grow (law of large numbers intuition).</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Two fair dice. Probability sum is 8?</div>
<ol class="steps">
<li>Favourable pairs: (2,6),(3,5),(4,4),(5,3),(6,2) = 5.</li>
<li>P = 5/36.</li>
</ol>
<div class="exa">5/36 ≈ 0.139.</div></div>` },
],
cps: [
{ q: "Adding 5 to every data point changes standard deviation by…", o: ["+5", "nothing", "×5", "/5"], a: 1, e: "Shifts don't affect spread.", after: 0 },
],
fl: [
["Variance units", "(units)² — square of data units"],
],
},

"M-sets": {
mins: 18,
secs: [
{ t: "Sets: notation and counting", h: `
<p>Union ∪, intersection ∩, difference A−B, complement A′, symmetric difference Δ. De Morgan: (A∪B)′ = A′∩B′. Counting principle:</p>
<div class="fml"><span class="fx">n(A∪B) = n(A)+n(B)−n(A∩B) · three sets: add pairwise corrections twice-subtracted centre once more</span><span class="fd">inclusion-exclusion</span></div>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Class: 40 like maths, 30 physics, 20 both. How many like at least one?</div>
<ol class="steps">
<li>n(M∪P) = 40+30−20 = 50.</li>
</ol>
<div class="exa">50 students.</div></div>` },
{ t: "Relations and functions", h: `
<p>A×B ordered pairs; relation R ⊆ A×B with domain/range. Types: reflexive (aRa), symmetric (aRb⇒bRa), transitive (aRb,bRc⇒aRc); equivalence relations carry all three and partition the set into classes.</p>
<p>Functions assign exactly one output per input. Injective (one-one): f(x₁)=f(x₂)⇒x₁=x₂; surjective (onto): range = codomain; bijective = both ⇌ invertible. Composition (g∘f)(x)=g(f(x)) — apply f first! Number of functions from m-set to n-set: nᵐ total, injections nPm style counts, bijections only if sizes match (m!).</p>
<div class="trap"><b>Trap.</b> f(x)=x² is NOT injective on ℝ but IS on [0,∞) — domains decide properties, not formulas alone.</div>` },
],
cps: [
{ q: "An equivalence relation must be…", o: ["reflexive only", "symmetric only", "all three properties", "transitive + symmetric only"], a: 2, e: "Reflexive + symmetric + transitive.", after: 1 },
{ q: "Number of onto functions from {1,2} to {a}: ", o: ["0", "1", "2", "infinite"], a: 1, e: "Both elements must map to a: exactly one function.", after: 1 },
],
fl: [
["Inclusion-exclusion (2 sets)", "|A∪B|=|A|+|B|−|A∩B|"],
["Bijection requires", "equal finite cardinalities"],
],
},

"M-quad": {
mins: 24,
secs: [
{ t: "Roots, discriminant, nature", h: `
<p>For ax²+bx+c=0: roots α,β = (−b ± √D)/2a with D=b²−4ac. Nature: D&gt;0 real distinct; D=0 real equal; D&lt;0 conjugate complex pair. Sum/product:</p>
<div class="fml"><span class="fx">α+β = −b/a · αβ = c/a · any symmetric function reduces via these two</span><span class="fd">e.g. α²+β² = (α+β)²−2αβ</span></div>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Form equation whose roots are 3 and −2.</div>
<ol class="steps">
<li>Sum 1, product −6 ⇒ x² − (sum)x + product = 0.</li>
</ol>
<div class="exa">x² − x − 6 = 0.</div></div>` },
{ t: "Common roots and transformation", h: `
<p>Two quadratics sharing a root: eliminate x by cross-combination ((c₁a₂−c₂a₁)x² terms cancel trick) or solve simultaneously. One common root condition: (c₁a₂−c₂a₁)² = (b₁c₂−b₂c₁)(a₁b₂−a₂b₁). Both roots common ⇒ proportional coefficients.</p>
<p>Root transformations build new equations instantly: roots 1/α,1/β ⇒ flip coefficients (cx²+bx+a=0); roots α+k,β+k ⇒ substitute x→x−k; squares ⇒ use sum/product algebra.</p>` },
{ t: "Quadratic expressions and inequalities", h: `
<p>f(x)=ax²+bx+c is an upward parabola (a&gt;0): sign chart via roots. f(x)&gt;0 outside roots; &lt;0 between (for a&gt;0). Range: min = −D/4a at vertex x=−b/2a. Location-of-roots problems (both roots positive, roots straddle a point…) combine: D≥0, vertex position, f(k) signs systematically.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">For which k does x² + kx + 9 = 0 have real roots?</div>
<ol class="steps">
<li>D ≥ 0: k² − 36 ≥ 0 ⇒ k ≤ −6 or k ≥ 6.</li>
</ol>
<div class="exa">k ∈ (−∞,−6] ∪ [6,∞).</div></div>
<div class="trap"><b>Trap.</b> Dividing by x (assuming x≠0) can drop the root x=0 — check it separately. Also 'real roots' needs D≥0 including the equal case.</div>` },
],
cps: [
{ q: "If roots are reciprocal of each other, coefficients satisfy…", o: ["a=c", "b=0", "a=b", "c=0"], a: 0, e: "Product αβ=1 ⇒ c/a=1.", after: 0 },
{ q: "Vertex x-coordinate of y=ax²+bx+c:", o: ["−b/2a", "−b/a", "b/2a", "−c/2a"], a: 0, e: "Axis of symmetry location.", after: 2 },
],
fl: [
["Discriminant nature test", "D>0 distinct, =0 equal, <0 complex"],
["Range of quadratic (a>0)", "[−D/4a, ∞)"],
],
},

"M-complex": {
mins: 26,
secs: [
{ t: "The plane z = x + iy", h: `
<p>i² = −1 extends ℝ to ℂ; Argand diagram plots z as point/vector (x,y). Modulus |z|=√(x²+y²); argument θ=tan⁻¹(y/x) with quadrant care. Conjugate z̄=x−iy reflects across real axis; zz̄=|z|² rationalises denominators. Powers of i cycle i,−1,−i,1.</p>
<div class="fml"><span class="fx">z = r(cosθ + i sinθ) = re^{iθ} · |z₁z₂|=|z₁||z₂| · arg(z₁z₂)=arg z₁+arg z₂</span><span class="fd">polar/exponential form powers cleanly</span></div>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Compute (1+i)/(1−i).</div>
<ol class="steps">
<li>Multiply by conjugate of denominator: (1+i)²/(1+1) = (2i)/2.</li>
</ol>
<div class="exa">= i. (Geometrically: rotating by 90°.)</div></div>` },
{ t: "De Moivre and roots of unity", h: `
<div class="fml"><span class="fx">(cosθ+isinθ)ⁿ = cos nθ + i sin nθ</span><span class="fd">De Moivre — the engine of trig identities too</span></div>
<p>nth roots of unity: e^(2kπi/n), k=0…n−1, forming a regular polygon on unit circle summing to ZERO. Cube roots of unity {1,ω,ω²} obey 1+ω+ω²=0, ω³=1 — the favourite constants of JEE algebra. nth root of any complex has n equally-spaced answers (arguments differ 2π/n).</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Evaluate ω¹⁰⁰ + ω²⁰⁰ where ω = cube root of unity ≠1.</div>
<ol class="steps">
<li>Reduce exponents mod 3: 100≡1, 200≡2.</li>
<li>ω + ω² = −1.</li>
</ol>
<div class="exa">−1.</div></div>` },
{ t: "Geometry of complex numbers", h: `
<p>Rotation by angle φ about origin: multiply by e^{iφ}. Distance |z₁−z₂|; collinearity via arg((z₃−z₁)/(z₂−z₁)) ∈ {0,π}; circle |z−z₀|=r; perpendicularity arg ratio = π/2. Locus questions translate English ("equidistant from two points") straight into equations (perpendicular bisector).</p>
<div class="trap"><b>Trap.</b> Principal argument lives in (−π,π]; adding 2π gives same point different branch. Quadrant errors in atan(y/x) are the #1 slip — check signs of x and y separately.</div>` },
],
cps: [
{ q: "Modulus of (3+4i):", o: ["5", "7", "25", "√7"], a: 0, e: "√(9+16)=5.", after: 0 },
{ q: "Sum of all cube roots of unity:", o: ["1", "0", "3", "i"], a: 1, e: "Vertices of equilateral triangle balance at origin.", after: 1 },
],
fl: [
["Euler identity", "e^{iθ}=cosθ+i sinθ"],
["Cube-root-of-unity sums", "1+ω+ω²=0"],
["zz̄ equals", "|z|²"],
],
},

"M-seq": {
mins: 22,
secs: [
{ t: "AP: constant differences", h: `
<div class="fml"><span class="fx">aₙ = a+(n−1)d · Sₙ = n/2[2a+(n−1)d] = n(a+l)/2</span><span class="fd">arithmetic progression core</span></div>
<p>Properties: middle term = average of neighbours; three terms shortcut a−d, a, a+d; sum of AP of odd count = count × middle term. Inserting k AMs between a,b: d = (b−a)/(k+1).</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Sum of first 20 naturals?</div>
<ol class="steps">
<li>S = 20×21/2 = 210.</li>
</ol>
<div class="exa">210.</div></div>` },
{ t: "GP: constant ratios", h: `
<div class="fml"><span class="fx">aₙ = ar^{n−1} · Sₙ = a(rⁿ−1)/(r−1) · S_∞ = a/(1−r) (|r|&lt;1)</span><span class="fd">geometric progression core</span></div>
<p>Three GP terms: a/r, a, ar. AM ≥ GM ≥ HM with equality iff all equal — inequality goldmine. AGP (arithmetic-geometric mix, like 1+2x+3x²+…) solved by multiplying by x and subtracting telescoping-style.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Sum 1 + 1/3 + 1/9 + … ∞</div>
<ol class="steps">
<li>a=1, r=1/3 ⇒ S = 1/(2/3) = 3/2.</li>
</ol>
<div class="exa">1.5.</div></div>` },
{ t: "Special series and telescoping", h: `
<div class="fml"><span class="fx">Σn = n(n+1)/2 · Σn² = n(n+1)(2n+1)/6 · Σn³ = [n(n+1)/2]²</span><span class="fd">memorise cold — appear inside integrals & sums</span></div>
<p>Telescoping: write term as difference f(k)−f(k+1); middle terms annihilate. V_{n} method for sequences with polynomial times geometric parts uses repeated subtraction to reveal pattern — powerful for finding closed forms.</p>
<div class="trap"><b>Trap.</b> GP sum formula fails at r=1 (division by zero!) — fall back to Sₙ=na. And S_∞ exists ONLY for |r|&lt;1.</div>` },
],
cps: [
{ q: "AM of two numbers exceeds GM by 2; numbers differ by 12. The numbers are…", o: ["4,16", "2,14", "6,18", "3,15"], a: 0, e: "Classic setup: numbers a−6,a+6; GM=√(a²−36), AM=a; a−√(a²−36)=2 ⇒ a=10 ⇒ 4,16.", after: 1 },
{ q: "Σn³ for first 5 naturals:", o: ["225", "125", "15", "55"], a: 0, e: "[15]² = 225.", after: 2 },
],
fl: [
["Infinite GP sum", "a/(1−r), |r|<1"],
["Σn² formula", "n(n+1)(2n+1)/6"],
["AM-GM equality case", "all quantities equal"],
],
},

"M-trig": {
mins: 28,
secs: [
{ t: "Compound angles and transformations", h: `
<div class="fml"><span class="fx">sin(A±B)=sinAcosB±cosAsinB · cos(A±B)=cosAcosB∓sinAsinB · tan(A±B)=(tanA±tanB)/(1∓tanAtanB)</span><span class="fd">the compound-angle quartet</span></div>
<p>Doubles follow (put B=A): sin2A=2sinAcosA=2tanA/(1+tan²A); cos2A=cos²−sin²=1−2sin²=2cos²−1; tan2A=2t/(1−t²). Triples from de Moivre. Product-to-sum converts products for telescoping; sum-to-product (sinC±sinD forms) solves conditional-identity proofs. sin75° = sin(45+30) = (√6+√2)/4 — derive, don't memorise.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Prove sin20°sin40°sin80° = √3/8.</div>
<ol class="steps">
<li>Pair 20°,80° via product-to-sum: ½[cos60°−cos100°].</li>
<li>Multiply by sin40°, convert again, collect: result collapses to √3/8 using cos100°=−cos80° symmetries.</li>
</ol>
<div class="exa">Standard identity — practise the two-step conversion flow.</div></div>` },
{ t: "General solutions", h: `
<div class="tblw"><table class="tbl">
<tr><th>Equation</th><th>General solution</th></tr>
<tr><td>sinθ=sinα</td><td>θ=nπ+(−1)ⁿα</td></tr>
<tr><td>cosθ=cosα</td><td>θ=2nπ±α</td></tr>
<tr><td>tanθ=tanα</td><td>θ=nπ+α</td></tr>
</table></div>
<p>Method: reduce everything to single trig of single angle, quote pattern. Squaring can inject extraneous roots — verify candidates. a sinθ + b cosθ = c solvable via amplitude-phase: √(a²+b²) sin(θ+φ), requiring |c| ≤ √(a²+b²) else no solution.</p>` },
{ t: "Inverse trigonometry discipline", h: `
<p>Principal branches: sin⁻¹:[−1,1]→[−π/2,π/2]; cos⁻¹:[−1,1]→[0,π]; tan⁻¹:ℝ→(−π/2,π/2). Identities with care: sin⁻¹x+cos⁻¹x=π/2 ALWAYS; tan⁻¹x+tan⁻¹y=tan⁻¹((x+y)/(1−xy)) valid xy&lt;1 (else adjust by π). Substitution table unlocks proofs: x=sinθ etc., choosing θ in principal range.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Evaluate tan⁻¹(1/2) + tan⁻¹(1/3).</div>
<ol class="steps">
<li>xy=1/6&lt;1 ⇒ combined = tan⁻¹((1/2+1/3)/(1−1/6)).</li>
<li>= tan⁻¹((5/6)/(5/6)) = tan⁻¹1 = π/4.</li>
</ol>
<div class="exa">π/4 — a classic worth internalising.</div></div>` },
],
cps: [
{ q: "sin⁻¹x + cos⁻¹x equals…", o: ["0", "π/2 always", "depends on x", "π"], a: 1, e: "Complementary branches sum to π/2 for all valid x.", after: 2 },
{ q: "General solution of cosθ = 0:", o: ["nπ", "(2n+1)π/2", "nπ/2", "2nπ"], a: 1, e: "Odd multiples of π/2.", after: 1 },
],
fl: [
["cos2A triple form", "2cos²A−1 = 1−2sin²A"],
["tan⁻¹ addition validity", "xy < 1 (adjust by π otherwise)"],
["Amplitude of a sinθ+b cosθ", "√(a²+b²)"],
],
},

"M-lines": {
mins: 22,
secs: [
{ t: "Every line equation form", h: `
<div class="tblw"><table class="tbl">
<tr><th>Form</th><th>Equation</th><th>Best for</th></tr>
<tr><td>Slope-intercept</td><td>y = mx+c</td><td>sketching</td></tr>
<tr><td>Point-slope</td><td>y−y₁=m(x−x₁)</td><td>construction</td></tr>
<tr><td>Two-point</td><td>(y−y₁)/(y₂−y₁)=(x−x₁)/(x₂−x₁)</td><td>given points</td></tr>
<tr><td>Intercept</td><td>x/a+y/b=1</td><td>axes cuts</td></tr>
<tr><td>Normal</td><td>x cosα + y sinα = p</td><td>distance work</td></tr>
<tr><td>General</td><td>ax+by+c=0</td><td>everything</td></tr>
</table></div>
<div class="fml"><span class="fx">slope m = −a/b · distance from point: |ax₁+by₁+c|/√(a²+b²) · angle between lines: tanθ=|(m₁−m₂)/(1+m₁m₂)|</span><span class="fd">the daily drivers</span></div>
<p>Parallel ⇒ equal slopes; perpendicular ⇒ m₁m₂ = −1. Foot of perpendicular & image of a point in a line: parametrise along normal direction — image = P − 2·(signed distance)·unit-normal.</p>` },
{ t: "Concurrency, bisectors, families", h: `
<p>Three lines concurrent ⇌ determinant of coefficient rows vanishes (or solve two, verify third). Angle bisectors of a₁x+b₁y+c₁=0, a₂x+b₂y+c₂=0: equidistance gives two lines (a₁x+b₁y+c₁)/√(a₁²+b₁²) = ±(same for line 2) — pick plus/minus by checking which region contains origin for internal bisector.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Line through (2,3) perpendicular to 2x+y=5.</div>
<ol class="steps">
<li>Given slope −2 ⇒ need slope ½.</li>
<li>y−3 = ½(x−2) ⇒ x − 2y + 4 = 0.</li>
</ol>
<div class="exa">x − 2y + 4 = 0.</div></div>
<div class="tipbox"><b>Tip.</b> Family of lines through intersection of L₁,L₂: L₁+λL₂=0 — kills coordinate-solving entirely when a second condition appears.</div>` },
],
cps: [
{ q: "Lines 3x+4y=5 and 6x+ky=10 coincide when k=", o: ["8", "6", "12", "any"], a: 0, e: "Proportional coefficients: 3/6=4/k ⇒ k=8.", after: 0 },
{ q: "Distance of (0,0) from x+y+1=0:", o: ["1/√2", "1", "√2", "2"], a: 0, e: "|1|/√2.", after: 0 },
],
fl: [
["Perpendicular slopes", "m₁m₂ = −1"],
["Point-line distance", "|ax₁+by₁+c|/√(a²+b²)"],
["Family through L₁∩L₂", "L₁ + λL₂ = 0"],
],
},

"M-perm": {
mins: 24,
secs: [
{ t: "Counting foundations", h: `
<p>Multiplication principle: stages multiply. Permutations = arrangements (order matters): ⁿP_r = n!/(n−r)!; combinations = selections: ⁿC_r = n!/r!(n−r)!; relationship ⁿP_r = r!·ⁿC_r. Circular arrangements: (n−1)! fixing rotation; necklace/garland halves again for reflection (/2). Zero-factorial = 1; factorial growth beats exponentials eventually.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">How many 4-digit numbers from digits 1–7 without repetition?</div>
<ol class="steps">
<li>⁷P₄ = 7×6×5×4 = 840.</li>
</ol>
<div class="exa">840.</div></div>` },
{ t: "Constraint patterns", h: `
<ul>
<li><b>Together</b>: bundle block(s) then permute bundle contents (×k!).</li>
<li><b>Never together</b>: total − together (complementary counting saves pain).</li>
<li><b>Repetitions</b>: MISSISSIPPI-type = 11!/(4!4!2!).</li>
<li><b>Selections with repetition</b>: n types choose r = C(n+r−1, r) (stars & bars).</li>
<li><b>At least/at most</b>: split cases or complement.</li>
<li><b>Derangements</b> (none fixed): !n = n!(1 − 1/1! + 1/2! − … ) — !4=9, !5=44 worth knowing.</li>
</ul>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Committee of 5 from 6 men 4 women with ≥2 women. Count?</div>
<ol class="steps">
<li>Cases: W2M3: C(4,2)C(6,3)=120; W3M2: 4×15=60; W4M1: 1×6=6.</li>
<li>Total 186.</li>
</ol>
<div class="exa">186 committees. (Complement method also works.)</div></div>` },
{ t: "Distribution models", h: `
<p>Distinct objects into distinct boxes: n^m ways. Identical into distinct (non-empty): C(m−1, n−1) stars-and-bars; allowing empty: C(m+n−1, n−1). These templates cover integer solutions of x₁+x₂+x₃=10 type questions — recognise the disguise!</p>
<div class="trap"><b>Trap.</b> "Arrange letters of a word" divides by repeated-letter factorials; "words with vowels together" bundles vowels as ONE item then un-bundles internally. Mixing up selection vs arrangement doubles/halves answers wrongly — ask "does swapping two picks create a new outcome?"</div>` },
],
cps: [
{ q: "⁸C₂ equals…", o: ["56", "28", "64", "16"], a: 1, e: "8·7/2 = 28 selections.", after: 0 },
{ q: "Circular arrangements of 6 people:", o: ["720", "120", "360", "60"], a: 1, e: "(6−1)!=120.", after: 0 },
],
fl: [
["nP r vs nCr bridge", "multiply by r!"],
["Circular permutations", "(n−1)!"],
["Stars and bars (positive)", "C(m−1, n−1)"],
],
},
};