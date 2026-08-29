/* Full Notes — Chemistry part 2 (redox → surface chemistry). */

export const CHEM_NOTES_2 = {

"C-redox": {
mins: 18,
secs: [
{ t: "Oxidation numbers as bookkeeping", h: `
<p>Oxidation = loss of electrons (ON rises); reduction = gain (ON falls). Assign oxidation numbers by hierarchy:</p>
<ol>
<li>Free elements: 0. Simple ions: their charge.</li>
<li>O: −2 (peroxides −1, OF₂ +2). H: +1 with nonmetals, −1 with metals.</li>
<li>F always −1; halogens usually −1.</li>
<li>Sum equals total charge of species.</li>
</ol>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Find ON of Cr in Cr₂O₇²⁻ and Fe in Fe₃O₄.</div>
<ol class="steps">
<li>2x + 7(−2) = −2 ⇒ x = +6.</li>
<li>Mixed oxide: one Fe(II) + two Fe(III): average +8/3.</li>
</ol>
<div class="exa">Cr +6; Fe averages +8/3 — fractional ONs signal mixed valence.</div></div>` },
{ t: "Balancing redox equations", h: `
<p>Ion-electron (half-reaction) method for acidic/basic media:</p>
<ol>
<li>Split into oxidation and reduction halves.</li>
<li>Balance atoms other than O,H; then O with H₂O; then H with H⁺.</li>
<li>Balance charge with electrons; equalise e⁻ count; add halves.</li>
<li>In base, add OH⁻ to kill H⁺ (forming water on both sides).</li>
</ol>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Balance MnO₄⁻ + Fe²⁺ → Mn²⁺ + Fe³⁺ (acidic).</div>
<ol class="steps">
<li>MnO₄⁻ → Mn²⁺: add 4H₂O, then 8H⁺, then 5e⁻ (reduction).</li>
<li>Fe²⁺ → Fe³⁺ + e⁻ ×5.</li>
<li>Add: MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O.</li>
</ol>
<div class="exa">Five irons per permanganate — the titration ratio to remember.</div></div>` },
{ t: "Oxidising/reducing strength and applications", h: `
<p>Standard electrode potentials rank agents: more positive E° ⇒ stronger oxidant (F₂ tops the list); more negative ⇒ stronger reductant (Li, K…). Displacement reactions follow the series (Zn displaces Cu²⁺). Redox titrations exploit stoichiometric electron exchange: n-factor = electrons per formula unit; equivalents tie chapters together (normality = molarity × n-factor).</p>
<div class="trap"><b>Trap.</b> Oxidation number ≠ formal charge ≠ valency. KMnO₄'s Mn is +7 but the ion carries −1 overall. Also disproportionation (same element oxidised AND reduced, e.g., Cl₂ → Cl⁻ + ClO⁻) needs both half-reactions from one reactant.</div>` },
],
cps: [
{ q: "In the reaction 2Na + Cl₂ → 2NaCl, sodium is…", o: ["reduced", "oxidised", "catalyst", "spectator"], a: 1, e: "Na loses an electron: ON 0 → +1, oxidation.", after: 0 },
{ q: "Electrons transferred per MnO₄⁻ in acidic medium:", o: ["3", "4", "5", "7"], a: 2, e: "+7 → +2 takes 5 electrons.", after: 1 },
],
fl: [
["Oxidation means", "electron loss, ON increase"],
["Permanganate n-factor (acid)", "5"],
["Strongest common reductant", "Li (most negative E°)"],
],
},

"C-sblock": {
mins: 16,
secs: [
{ t: "Group 1 & 2 character at a glance", h: `
<p>s-block metals are soft, low-density, highly reactive reducing agents. Reactivity rises down each group as ionisation energy falls. Key contrasts:</p>
<div class="tblw"><table class="tbl">
<tr><th>Property</th><th>Alkali (Gr 1)</th><th>Alkaline earth (Gr 2)</th></tr>
<tr><td>Charge</td><td>+1</td><td>+2</td></tr>
<tr><td>Hardness</td><td>very soft</td><td>harder</td></tr>
<tr><td>Flame colours</td><td>Li crimson, Na yellow, K lilac</td><td>Ca brick-red, Sr crimson, Ba apple-green</td></tr>
<tr><td>Carbonate solubility</td><td>all soluble</td><td>falls down group (BaCO₃ insoluble)</td></tr>
<tr><td>Sulphate solubility</td><td>high</td><td>falls down group</td></tr>
<tr><td>Hydroxide solubility</td><td>all soluble, strongly basic</td><td>rises down group</td></tr>
</table></div>
<p>Diagonal relationships soften group lines: Li↔Mg and Be↔Al share properties (similar charge/size ratios).</p>` },
{ t: "Industrial stars", h: `
<ul>
<li><b>Sodium carbonate</b> (Solvay): NH₃ recycled, CaCl₂ by-product; glass, soap industries.</li>
<li><b>Sodium hydroxide</b>: chlor-alkali electrolysis of brine gives NaOH + Cl₂ + H₂ simultaneously.</li>
<li><b>Plaster of Paris</b>: CaSO₄·½H₂O sets to gypsum with expansion — casts and fractures splints.</li>
<li><b>Cement chemistry</b>: limestone + clay roasted; setting involves hydration silicates.</li>
</ul>
<div class="trap"><b>Trap.</b> Li anomalies everywhere: Li₂CO₃ decomposes on heating (others don't), LiNO₃ gives NO₂ + O₂ (others give nitrites), Li burns to normal oxide not peroxide/superoxide. Be compounds covalent-ish (small, high polarising power).</div>` },
],
cps: [
{ q: "Which alkali metal carbonate decomposes on heating?", o: ["Na₂CO₃", "K₂CO₃", "Li₂CO₃", "Rb₂CO₃"], a: 2, e: "Li⁺'s high polarising power destabilises its carbonate.", after: 1 },
{ q: "Down group 2, sulphate solubility…", o: ["rises", "falls", "constant", "peaks mid-group"], a: 1, e: "Lattice enthalpy wins over hydration trend downward.", after: 0 },
],
fl: [
["Na flame colour", "golden yellow"],
["Plaster of Paris formula", "CaSO₄·½H₂O"],
["Diagonal pairs", "Li–Mg, Be–Al"],
],
},

"C-orgbasic": {
mins: 26,
secs: [
{ t: "Nomenclature without tears", h: `
<p>IUPAC name = prefix(es) + parent chain + suffix. Longest chain bearing the principal functional group is the parent; numbering gives lowest locators, priority: COOH > SO₃H > ester > acid chloride > amide > CN > CHO > ketone > alcohol > amine > alkene > alkyne > alkyl/halo. Common roots: meth, eth, prop, but…; unsaturation -ene/-yne before -ol etc.? No — suffix order: en-yne-ol-one-oic acid per priority list above.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Name CH₃–CH(OH)–CH₂–CHO.</div>
<ol class="steps">
<li>CHO outranks OH ⇒ parent butanal, CHO gets C1.</li>
<li>OH on C3: substituent hydroxy? Actually OH is a prefix here: 3-hydroxybutanal.</li>
</ol>
<div class="exa">3-hydroxybutanal.</div></div>` },
{ t: "Isomerism map", h: `
<div class="tblw"><table class="tbl">
<tr><th>Type</th><th>Kinds</th><th>Example pair</th></tr>
<tr><td rowspan="2">Structural</td><td>chain, position, functional, metamerism, tautomerism</td><td>n-pentane/isopentane; propan-1-ol/propan-2-ol; keto-enol</td></tr>
<tr><td colspan="2"></td></tr>
<tr><td>Stereoisomerism</td><td>geometrical (cis/trans), optical (R/S)</td><td>but-2-ene cis/trans; lactic acid enantiomers</td></tr>
</table></div>
<p>Chirality test: carbon with four different groups (stereocentre) ⇒ enantiomers possible; plane-polarised light rotated equally/oppositely; racemic mix cancel. E/Z extends cis/trans when priorities differ.</p>
<div class="trap"><b>Trap.</b> Tautomerism (keto⇌enol) is dynamic equilibrium, not resonance — atoms move! Resonance only shuffles electrons.</div>` },
{ t: "Electronic effects: the language of mechanisms", h: `
<ul>
<li><b>Inductive (±I)</b>: σ-bond electron pull, fades over ~3 bonds. −I: NO₂, CN, F… +I: alkyls.</li>
<li><b>Resonance (±R/M)</b>: π/lone-pair delocalisation; stabilises charges, dictates directing effects. −R: NO₂, COOH; +R: OH, OR, NH₂, halogens (mixed behaviour!).</li>
<li><b>Hyperconjugation</b>: "no-bond resonance" with adjacent C–H σ; explains alkene stability order (more substituted = stabler) and carbocation stability 3°&gt;2°&gt;1°.</li>
</ul>
<div class="fml"><span class="fx">carbocation stability: 3° > 2° > 1° > CH₃⁺ · carbanion reverses · radical mirrors cation</span><span class="fd">hyperconjugation + induction together</span></div>` },
{ t: "Reaction intermediates and types", h: `
<div class="tblw"><table class="tbl">
<tr><th>Intermediate</th><th>Nature</th><th>Formed by</th></tr>
<tr><td>Carbocation</td><td>e⁻-deficient, planar sp²</td><td>heterolysis toward C+ (SN1, E1)</td></tr>
<tr><td>Carbanion</td><td>lone pair, pyramidal</td><td>bond break leaving e⁻ on C</td></tr>
<tr><td>Free radical</td><td>odd e⁻, planar-ish</td><td>homolysis (UV, peroxides)</td></tr>
<tr><td>Carbene</td><td>divalent C (:CH₂)</td><td>diazomethane etc.</td></tr>
</table></div>
<p>Reactions classify as substitution, addition, elimination, rearrangement; conditions decide mechanism: polar protic solvents + weak nucleophile favour SN1; strong nucleophile + primary substrate favours SN2 (backside attack, inversion); bulky base pushes elimination.</p>
<div class="tipbox"><b>Tip.</b> Nucleophile loves nucleus (e⁻ rich), electrophile accepts electrons. Acid-catalysed reactions usually begin with electrophile generation (H⁺ activating double bond or carbonyl).</div>` },
{ t: "Purification and qualitative tests", h: `
<ul>
<li><b>Sublimation/distillation/crystallisation/chromatography</b> separate by volatility, bp difference, solubility, adsorption respectively.</li>
<li>Lassaigne's test detects N (Prussian blue), S (violet with nitroprusside), halogens (AgX colours) after sodium fusion.</li>
<li>Duma/Carius methods quantify N/halogens; estimation underpins empirical formulas.</li>
</ul>` },
],
cps: [
{ q: "Most stable carbocation:", o: ["CH₃⁺", "primary", "secondary", "tertiary"], a: 3, e: "Hyperconjugation + induction crown 3°.", after: 2 },
{ q: "SN2 reactions proceed with…", o: ["racemisation", "inversion of configuration", "retention", "no stereochemistry"], a: 1, e: "Backside attack flips the centre like an umbrella.", after: 3 },
{ q: "Which shows keto-enol tautomerism?", o: ["ethanol", "acetaldehyde", "acetone", "both acetaldehyde and acetone"], a: 3, e: "Any carbonyl with α-H enolises; both do.", after: 1 },
],
fl: [
["+R groups", "OH, OR, NH₂ (lone-pair donors)"],
["Stability order alkenes", "more substituted = hyperconjugation"],
["Lassaigne Prussian blue", "nitrogen present"],
["SN1 rate law", "depends on substrate only"],
],
},

"C-pblock": {
mins: 24,
secs: [
{ t: "Group 13–14: boron and carbon families", h: `
<p><b>Boron family (+3)</b>: inert-pair effect grows down the group so Tl⁺ beats Tl³⁺ stability. Borax, boric acid, diborane B₂H₆ (banana bonds, electron-deficient!) are exam staples. Aluminium: amphoteric, protected by Al₂O₃ skin, extracted via Hall–Héroult from bauxite with cryolite lowering melt temperature.</p>
<p><b>Carbon family (+4)</b>: catenation peaks at carbon, declines with size (C ≫ Si ≫ Ge…). Allotropes: diamond (sp³ network, hardest), graphite (sp² layers, conductor along sheets), fullerene C₆₀. Silicones (Si–O backbone) and silicates (SiO₄ tetrahedra sharing corners — ortho/pyo/chain/sheet/3D classification) matter industrially. CO toxic via haemoglobin binding; CO₂ greenhouse.</p>` },
{ t: "Group 15: nitrogen and phosphorus", h: `
<p>N₂'s triple bond (941 kJ) makes it inert — Haber breaks it brutally. Ammonia: trigonal pyramidal, Lewis basic, manufactured by Haber process. Nitric acid (Ostwald): NH₃ → NO → NO₂ → HNO₃; strong oxidiser, passivates Al/Fe conc. Phosphorus allotropes: white (toxic, P₄, waxy, glows) vs red (polymeric, safe). Oxoacid ladder: hypophosphorous H₃PO₂ (monobasic, reducing!), phosphorous H₃PO₃ (dibasic), phosphoric H₃PO₄ (tribasic) — basicity = OH-bearing P count, not H count!</p>
<div class="trap"><b>Trap.</b> H₃PO₃ is DIBASIC though three H exist — one H sits directly on P. Count –OH groups for basicity every time.</div>` },
{ t: "Groups 16–18 quick strikes", h: `
<ul>
<li><b>Oxygen family</b>: O₂ vs O₃ (allotrope, UV shield); H₂O₂ structure (open book), bleaching, storage in wax-lined plastic; SO₂ reducing, H₂SO₄ king chemical (dehydrating, oxidising conc., viscous H-bonded).</li>
<li><b>Halogens</b>: F₂ strongest oxidant; interhalogens (ClF₃) hyper-reactive; bleaching powder Cl₂ chemistry; halogen oxoacid strength HOCl < HOClO? Order by extra O: HClO < HClO₂ < HClO₃ < HClO₄ (more O stabilises anion).</li>
<li><b>Noble gases</b>: Xe compounds only (XeF₂ linear, XeF₄ square planar, XeF₆ distorted) — Kr barely, He/Ne none. Radon radioactivity.</li>
</ul>
<div class="fml"><span class="fx">oxoacid strength: same element, more O ⇒ stronger (HClO₄ ≫ HClO)</span><span class="fd">anion delocalisation argument</span></div>` },
],
cps: [
{ q: "Basicity of H₃PO₃ is…", o: ["3", "2", "1", "0"], a: 1, e: "Only two OH groups; third H sits on phosphorus.", after: 1 },
{ q: "Shape of XeF₄:", o: ["tetrahedral", "square planar", "linear", "see-saw"], a: 1, e: "Six electron domains? SN=6 with two lone pairs trans ⇒ square planar.", after: 2 },
{ q: "Diborane contains which unusual bonding?", o: ["double bonds", "3-centre-2-electron bridges", "ionic bonds", "metallic"], a: 1, e: "Banana B–H–B bridge bonds, electron-deficient.", after: 0 },
],
fl: [
["Inert pair effect", "lower oxidation state gains stability down p-block"],
["White vs red P", "P₄ discrete toxic / polymeric stable"],
["HClO₄ vs HClO", "perchloric far stronger"],
],
},

"C-hydrocarbons": {
mins: 26,
secs: [
{ t: "Alkanes: conformations and reactions", h: `
<p>Saturated chains, sp³, free rotation (conformations: staggered lower energy than eclipsed; anti most stable). Sources: natural gas, petroleum fractions. Reactions:</p>
<ul>
<li><b>Free-radical halogenation</b> (hv): initiation-propagation-termination; selectivity 3° &gt; 2° &gt; 1° H (BDE order).</li>
<li><b>Combustion</b>: complete gives CO₂ + H₂O; limited oxygen yields deadly CO.</li>
<li><b>Isomerisation/aromatization</b> upgrade octane ratings industrially.</li>
</ul>
<div class="tblw"><table class="tbl">
<tr><th>Preparation route</th><th>Reaction</th></tr>
<tr><td>Wurtz</td><td>2RX + 2Na → R−R (dry ether) — symmetrical alkanes only</td></tr>
<tr><td>Kolbe electrolysis</td><td>carboxylate → dimer (anodic)</td></tr>
<tr><td>Decarboxylation</td><td>RCOONa + NaOH(CaO, Δ) → RH + Na₂CO₃</td></tr>
<tr><td>Hydrogenation</td><td>alkene/alkyne + H₂/Ni</td></tr>
</table></div>` },
{ t: "Alkenes: the addition playground", h: `
<p>sp² planarity makes them nucleophilic. Electrophilic additions follow Markovnikov: H⁺ lands where more H already exists, positive intermediate on substituted carbon (stable cation). Anti-Markovnikov route: HBr + peroxides (free-radical mechanism, works ONLY for HBr!).</p>
<div class="tblw"><table class="tbl">
<tr><th>Reagent</th><th>Gives</th><th>Stereochemistry</th></tr>
<tr><td>X₂ /CCl₄ (decolourises Br₂!)</td><td>vic-dihalide</td><td>anti addition</td></tr>
<tr><td>cold dilute KMnO₄ (Baeyer)</td><td>vic-diol</td><td>syn</td></tr>
<tr><td>O₃ then Zn/H₂O</td><td>carbonyls at cleaved C=C</td><td>diagnostic tool</td></tr>
<tr><td>H₂/Ni</td><td>alkane</td><td>syn</td></tr>
</table></div>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Propene + HBr (a) alone (b) with peroxide. Products?</div>
<ol class="steps">
<li>(a) Markovnikov: Br to middle C ⇒ 2-bromopropane.</li>
<li>(b) Radical anti-Markovnikov ⇒ 1-bromopropane.</li>
</ol>
<div class="exa">Same alkene, opposite regiochemistry — peroxide effect is HBr-exclusive.</div></div>` },
{ t: "Alkynes and acidity", h: `
<p>Triple bond sp: 50% s-character pulls electrons, making terminal ≡C–H acidic (pKa≈25 — reacts with NaNH₂, Ag⁺/NH₃ red precipitate distinguishes terminal alkynes). Additions proceed twice (partial hydrogenation with Lindlar gives CIS alkene; Na/NH₃(l) gives TRANS). Ozonolysis cleaves to carboxylic acids (vs aldehydes/ketones for alkenes — differentiator!).</p>
<p><b>Aromaticity</b> closes the chapter: cyclic, planar, fully conjugated, (4n+2)π electrons = aromatic (benzene 6, naphthalene 10); 4nπ = antiaromatic (cyclobutadiene); non-planar = non-aromatic. Benzene resists addition, prefers EAS (electrophilic aromatic substitution): NO₂⁺, SO₃, R⁺, X⁺ attack → sigma complex → deprotonation restores aromaticity.</p>
<div class="trap"><b>Trap.</b> Lindlar vs Na/NH₃ stereochemistry is a guaranteed question somewhere every year. And "decolourises bromine" ≠ aromatic — benzene does NOT decolourise Br₂ without catalyst.</div>` },
],
cps: [
{ q: "Propene + HBr/peroxide major product:", o: ["2-bromopropane", "1-bromopropane", "propane", "1,2-dibromopropane"], a: 1, e: "Radical anti-Markovnikov path puts Br on terminal carbon.", after: 1 },
{ q: "Terminal alkynes react with Ag(NH₃)₂⁺ giving…", o: ["gas", "white precipitate", "red/brown precipitate", "nothing"], a: 2, e: "Silver acetylide precipitate — acidity test.", after: 2 },
{ q: "Cyclobutadiene is…", o: ["aromatic", "antiaromatic", "non-aromatic", "aliphatic"], a: 1, e: "Planar conjugated 4n (n=1) ⇒ antiaromatic.", after: 2 },
],
fl: [
["Markovnikov rule", "H adds to C already richer in H"],
["Peroxide effect scope", "only HBr"],
["Lindlar product", "cis-alkene"],
["Aromaticity criteria", "planar cyclic conjugated 4n+2 π"],
],
},

"C-kinetics": {
mins: 22,
secs: [
{ t: "Rate vocabulary", h: `
<p>Rate = −Δ[R]/Δt = +Δ[P]/Δt (divide by coefficients for general reactions). Instantaneous rate is slope of tangent; average over interval. Units: mol L⁻¹ s⁻¹ (concentration/time). Factors: concentration, temperature, catalyst, surface area (heterogeneous), light (photochemical).</p>
<div class="fml"><span class="fx">rate = k[A]^m[B]^n — exponents found EXPERIMENTALLY, never from stoichiometry (except elementary steps)</span><span class="fd">order = m+n, can be 0, fraction, negative!</span></div>` },
{ t: "Order-by-order toolkit", h: `
<div class="tblw"><table class="tbl">
<tr><th>Order</th><th>Integrated law</th><th>Half-life</th><th>Units of k</th><th>Straight line plot</th></tr>
<tr><td>0</td><td>[A] = [A]₀ − kt</td><td>[A]₀/2k</td><td>conc/time</td><td>[A] vs t</td></tr>
<tr><td>1</td><td>ln[A] = ln[A]₀ − kt</td><td>ln2/k (concentration-independent!)</td><td>time⁻¹</td><td>ln[A] vs t</td></tr>
<tr><td>2</td><td>1/[A] = 1/[A]₀ + kt</td><td>1/(k[A]₀)</td><td>conc⁻¹time⁻¹</td><td>1/[A] vs t</td></tr>
</table></div>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">First-order reaction 75% complete in 60 min. Rate constant?</div>
<ol class="steps">
<li>75% done ⇒ remaining 25% = (1/2)² ⇒ two half-lives elapsed.</li>
<li>t½ = 30 min ⇒ k = ln2/30 ≈ 0.0231 min⁻¹.</li>
</ol>
<div class="exa">k ≈ 2.31×10⁻² min⁻¹.</div></div>` },
{ t: "Arrhenius equation and activation energy", h: `
<div class="fml"><span class="fx">k = A e^(−Ea/RT) · ln(k₂/k₁) = Ea/R (1/T₁ − 1/T₂)</span><span class="fd">temperature sensitivity set by Ea</span></div>
<p>Plotting ln k against 1/T gives slope −Ea/R. Rule-of-thumb: 10 °C rise roughly doubles rate near room temperature (because the Boltzmann tail above Ea grows exponentially). Catalysts provide a lower-Ea path WITHOUT changing ΔG, ΔH or K — they speed forward and reverse equally.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Rate doubles between 300 K and 310 K. Estimate Ea.</div>
<ol class="steps">
<li>ln2 = Ea/8.314 × (1/300 − 1/310) = Ea/8.314 × (10/93000).</li>
<li>Ea = 0.693 × 8.314 × 9300 ≈ 53.6 kJ/mol.</li>
</ol>
<div class="exa">≈54 kJ/mol — textbook magnitude.</div></div>` },
{ t: "Mechanisms: molecularity vs order", h: `
<p>A mechanism is a sequence of elementary steps; slowest step (rate-determining) controls observed rate. Molecularity counts molecules colliding in ONE elementary step (1, 2, occasionally 3 — never zero or fractional) while overall order is experimental and may be anything. Intermediates appear between steps but cancel in the net equation; steady-state approximation handles their maths.</p>
<div class="trap"><b>Trap.</b> For elementary steps only, order = molecularity. Overall reaction order NEVER comes from the balanced equation unless it's a single elementary step.</div>` },
],
cps: [
{ q: "Half-life of a first-order reaction depends on…", o: ["initial concentration", "rate constant only", "pressure", "volume"], a: 1, e: "t½ = ln2/k — concentration-free signature of first order.", after: 1 },
{ q: "A catalyst changes…", o: ["ΔH", "K_eq", "activation energy", "position of equilibrium"], a: 2, e: "It lowers Ea only; thermodynamics untouched.", after: 2 },
{ q: "Zero-order k units:", o: ["s⁻¹", "mol L⁻¹ s⁻¹", "L mol⁻¹ s⁻¹", "dimensionless"], a: 1, e: "Rate itself has conc/time units when order 0.", after: 1 },
],
fl: [
["First-order integrated law", "ln([A]₀/[A]) = kt"],
["Arrhenius slope meaning", "−Ea/R on ln k vs 1/T"],
["Rate-determining step", "slowest elementary step"],
],
},

"C-solutions": {
mins: 20,
secs: [
{ t: "Concentration measures revisited", h: `
<p>Molarity (per litre solution) shifts with temperature; molality (per kg solvent), mole fraction and mass % don't — colligative work prefers molality. Conversions between them need density. Henry's law governs gas dissolution: p_gas = K_H·x — higher pressure forces more gas in (soda bottles), higher temperature drives it out (warm soda flat; thermal pollution kills fish via low O₂).</p>` },
{ t: "Raoult's law and ideal solutions", h: `
<p>Vapour pressure of solution components scale with mole fraction: p_i = x_i·p_i°. Ideal solutions obey throughout (benzene-toluene): ΔH_mix = 0, ΔV_mix = 0. Deviations:</p>
<ul>
<li><b>Negative deviation</b> (stronger A-B than A-A/B-B): vapour pressure dips below Raoult line — HNO₃+water, acetone+chloroform (H-bonding across pair!).</li>
<li><b>Positive deviation</b> (weaker cross-attraction): bulges above — ethanol+acetone, CS₂+acetone.</li>
</ul>
<p>Azeotropes form at deviations extreme enough: constant-boiling mixtures unbreakable by distillation (95.6% ethanol-water, minimum bp; HNO₃-water 68%, maximum).</p>` },
{ t: "Colligative properties: four tools, one idea", h: `
<p>They count PARTICLES, not identity. With i (van't Hoff factor = particles per formula unit):</p>
<div class="tblw"><table class="tbl">
<tr><th>Property</th><th>Law</th><th>i examples</th></tr>
<tr><td>Relative lowering of VP</td><td>Δp/p° = x_solute</td><td>—</td></tr>
<tr><td>Elevation of bp</td><td>ΔT_b = i·K_b·m</td><td>K_b water 0.52</td></tr>
<tr><td>Depression of fp</td><td>ΔT_f = i·K_f·m</td><td>K_f water 1.86</td></tr>
<tr><td>Osmotic pressure</td><td>π = i·CRT</td><td>best for macromolecules</td></tr>
</table></div>
<p>Non-volatile solutes raise bp / depress fp because solute lowers solvent VP — the pure solvent curve must be heated/cooled further to match external pressure. Salt on icy roads, antifreeze ethylene glycol, desalination reverse osmosis (applied π) all live here.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">1.8 g glucose (180 g/mol) in 100 g water. Freezing point?</div>
<ol class="steps">
<li>m = (1.8/180)/0.100 = 0.1 mol/kg.</li>
<li>ΔT_f = 1×1.86×0.1 = 0.186 °C.</li>
</ol>
<div class="exa">Freezes at −0.186 °C.</div></div>
<div class="trap"><b>Trap.</b> Electrolytes dissociate (i&gt;1: NaCl→2, CaCl₂→3, K₄[Fe(CN)₆]→5) while associating solutes dimerise (i&lt;1: benzoic acid in benzene i≈½). Isotonic comparisons need i-matched calculations.</div>` },
],
cps: [
{ q: "Which concentration unit survives temperature change?", o: ["molarity", "molality", "% v/v", "normality"], a: 1, e: "Mass-based units don't expand with heat.", after: 0 },
{ q: "0.1 M solutions ranked by freezing point depression (most depressed first):", o: ["glucose > NaCl > CaCl₂", "CaCl₂ > NaCl > glucose", "NaCl > CaCl₂ > glucose", "equal"], a: 1, e: "Particles: 3 > 2 > 1.", after: 2 },
],
fl: [
["van't Hoff factor", "particles per dissolved unit"],
["Raoult deviation cause (negative)", "cross-species attraction stronger"],
["Osmotic pressure law", "π = iCRT"],
],
},

"C-electro": {
mins: 26,
secs: [
{ t: "Galvanic cells: chemistry as current", h: `
<p>Spontaneous redox split into half-cells: oxidation at ANODE (−), reduction at CATHODE (+), salt bridge maintains neutrality. Cell notation Zn|Zn²⁺||Cu²⁺|Cu reads anode left. EMF E°cell = E°cathode − E°anode (always subtract, reduction potentials both sides!). Positive E°cell ⇒ spontaneous ⇒ ΔG° = −nFE°cell &lt; 0.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Daniell cell: E°(Zn²⁺/Zn)=−0.76, E°(Cu²⁺/Cu)=+0.34 V. EMF?</div>
<ol class="steps">
<li>E°cell = 0.34 − (−0.76) = 1.10 V.</li>
<li>n=2 ⇒ ΔG° = −2×96500×1.1 ≈ −212 kJ/mol.</li>
</ol>
<div class="exa">1.10 V; strongly spontaneous.</div></div>` },
{ t: "Nernst equation and concentration cells", h: `
<div class="fml"><span class="fx">E = E° − (0.059/n)·log Q (298 K)</span><span class="fd">Q = product/reactant activities</span></div>
<p>As the cell runs, Q grows, E falls — dead battery at E = 0 ⇌ equilibrium, Q = K! Concentration cells run on gradient alone (same electrodes, different concentrations; E° = 0). pH meters are hydrogen concentration cells in disguise.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Zn|Zn²⁺(0.1M)||Zn²⁺(1M)|Zn. EMF at 298 K?</div>
<ol class="steps">
<li>E = 0 − (0.059/2)log(0.1/1) = (0.059/2)×1.</li>
</ol>
<div class="exa">≈0.03 V — small gradients buy small volts.</div></div>` },
{ t: "Electrolysis and Faraday's laws", h: `
<p>Non-spontaneous reactions forced by external supply: anode becomes (+), cathode (−) — reversed polarity versus galvanic! Faraday: mass deposited m = (E·Q)/F where E = M/n-factor equivalent mass; 1 F = 96485 C deposits one equivalent.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Current 2 A through CuSO₄ for 965 s. Copper deposited? (Cu²⁺ + 2e⁻)</div>
<ol class="steps">
<li>Q = 1930 C = 0.02 F ⇒ 0.01 mol Cu.</li>
<li>m = 0.01×63.5 = 0.635 g.</li>
</ol>
<div class="exa">0.635 g.</div></div>
<p>Products depend on competing reductions at cathode (Na⁺ vs H₂O in brine: H₂ wins on Hg? actually Na wins on mercury cathode — amalgam trick) and overpotential quirks (O₂ sluggish, hence Cl₂ from brine at anode despite E° tables suggesting otherwise).</p>` },
{ t: "Batteries and corrosion", h: `
<ul>
<li><b>Dry cell</b>: Zn casing anode, MnO₂+C cathode paste, NH₄Cl electrolyte.</li>
<li><b>Lead-acid</b>: Pb/PbSO₄ ↔ PbO₂/PbSO₄ in H₂SO₄; rechargeable, density of acid reports charge state.</li>
<li><b>Ni-Cd, Li-ion</b>: modern portables; Li-ion wins on mass-specific energy.</li>
<li><b>Fuel cells</b>: H₂ + O₂ → H₂O direct electricity (Apollo!), no recharge cycle needed.</li>
</ul>
<p>Corrosion = unwanted electrochemistry: iron rusts via O₂ + moisture microcells; protection by sacrificial anodes (Mg/Zn) or electroplating — galvanic series predicts victims.</p>
<div class="trap"><b>Trap.</b> In electrolysis problems identify electrode signs FIRST (they flip vs galvanic), then apply E° competition including overpotentials. Memorise: AN OX / RED CAT holds in both worlds.</div>` },
],
cps: [
{ q: "At equilibrium of a cell reaction, EMF is…", o: ["maximum", "zero", "negative", "E°"], a: 1, e: "No driving force remains; Q = K, E = 0.", after: 1 },
{ q: "Charge to deposit 1 mol Al from Al³⁺:", o: ["96500 C", "1.5 F", "289500 C", "3 F"], a: 2, e: "3 electrons per ion ⇒ 3×96485 C.", after: 2 },
{ q: "During discharge of lead-acid battery, H₂SO₄ concentration…", o: ["rises", "falls", "constant", "irrelevant"], a: 1, e: "Acid consumed forming PbSO₄ — hydrometer reads the fall.", after: 3 },
],
fl: [
["EMF calculation", "E°cell = E°cathode − E°anode"],
["Nernst (25 °C)", "E = E° − (0.059/n)log Q"],
["Faraday constant", "≈96485 C/mol e⁻"],
["ΔG° link", "ΔG° = −nFE°cell"],
],
},

"C-surface": {
mins: 14,
secs: [
{ t: "Adsorption vs absorption", h: `
<p><b>Adsorption</b> accumulates particles at a surface (unbalanced surface forces); absorption soaks INTO the bulk. Sorption covers both. Physisorption: van der Waals, low heat (~20–40 kJ), multilayer, reversible, drops with temperature. Chemisorption: chemical bonds, high heat (80–240 kJ), monolayer, often irreversible, needs activation — specificity high.</p>
<div class="fml"><span class="fx">Freundlich: x/m = k·p^(1/n) (0<n≤1) · Langmuir: monolayer saturation model</span><span class="fd">quantifying surfaces</span></div>
<p>Applications: activated charcoal masks (large area), catalysis (intermediates formed on surface), gas masks, vacuum creation (charcoal traps), chromatography separations.</p>` },
{ t: "Colloids: the in-between world", h: `
<p>Particle size 1–1000 nm — too big for true solution, too small to settle. Classifications: sols (solid-in-liquid), aerosols, emulsions (oil/water need emulsifier!), gels. Lyophilic (solvent-loving, reversible, self-stabilised: gum, starch) vs lyophobic (need stabilisers, irreversible: gold sol, As₂S₃ sol).</p>
<div class="tblw"><table class="tbl">
<tr><th>Effect</th><th>Meaning</th><th>Use</th></tr>
<tr><td>Tyndall</td><td>scatters light beam visibly</td><td>detect colloids</td></tr>
<tr><td>Brownian</td><td>random jiggling</td><td>stability evidence</td></tr>
<tr><td>Electrophoresis</td><td>particles migrate in field</td><td>charge determination</td></tr>
<tr><td>Coagulation</td><td>precipitation by electrolytes</td><td>Hardy-Schulze: higher charge ion wins</td></tr>
</table></div>
<div class="tipbox"><b>Tip.</b> Gold sols (purple of Cassius), blood (colloid!), milk (emulsion), fog, cheese (gel) — everyday colloid identification questions are easy marks if you remember the size window.</div>` },
{ t: "Emulsions and micelles", h: `
<p>Emulsions need emulsifiers (soap, protein) lowering interfacial tension; demulsification by centrifugation/heating. Soaps form micelles above critical micelle concentration: hydrophobic tails inward trapping grease, heads outward facing water — cleansing explained. Colloidal medicine: Argyrol antiseptic, milk of magnesia stomach coating.</p>` },
],
cps: [
{ q: "Chemisorption typically forms…", o: ["multilayers", "a single molecular layer", "no layer", "crystals"], a: 1, e: "Bond formation saturates specific sites — monolayer cap.", after: 0 },
{ q: "Coagulating power for a negative sol follows…", o: ["Na⁺ < Ba²⁺ < Al³⁺", "Al³⁺ < Ba²⁺ < Na⁺", "equal", "anion-dependent"], a: 0, e: "Hardy-Schulze: counter-ion charge rules; trivalent aluminium strongest.", after: 1 },
],
fl: [
["Physisorption vs chemisorption heat", "~20–40 vs ~80–240 kJ/mol"],
["Tyndall effect proves", "colloidal particle size"],
["Hardy-Schulze rule", "higher counter-ion charge coagulates faster"],
],
},
};