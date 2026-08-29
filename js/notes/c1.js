/* Full Notes — Chemistry part 1 (foundation → ionic equilibrium). */

export const CHEM_NOTES_1 = {

"f-matter": {
mins: 12,
secs: [
{ t: "States of matter and the particle picture", h: `
<p>All matter is particles in motion. The state is decided by the tug-of-war between intermolecular forces (holding particles together) and thermal energy (shaking them apart):</p>
<div class="tblw"><table class="tbl">
<tr><th>State</th><th>Forces</th><th>Shape/Volume</th><th>Motion</th></tr>
<tr><td>Solid</td><td>very strong</td><td>fixed/fixed</td><td>vibrate about lattice sites</td></tr>
<tr><td>Liquid</td><td>moderate</td><td>takes container's shape / fixed volume</td><td>slide past neighbours</td></tr>
<tr><td>Gas</td><td>negligible</td><td>fills everything</td><td>free random flight</td></tr>
</table></div>
<p>Plasma (ionised gas) completes the list at extreme temperatures; BEC at the other extreme — beyond syllabus but nice to know.</p>` },
{ t: "Changes of state and latent heat", h: `
<p>Melting ⇌ freezing, boiling ⇌ condensation, sublimation skips the liquid stage (dry ice, naphthalene). During a change, temperature stays constant while heat (latent) breaks or forms interactions:</p>
<div class="fml"><span class="fx">Q = mL_fusion · Q = mL_vapour</span><span class="fd">water: L_f ≈ 334 J/g, L_v ≈ 2260 J/g</span></div>
<div class="tipbox"><b>Tip.</b> Evaporation differs from boiling: it happens at any temperature from the surface only, aided by wind, low humidity, high temperature. Boiling is bulk vaporisation at the liquid's boiling point.</div>` },
{ t: "Evidence for molecular motion", h: `
<ul>
<li><b>Diffusion</b>: perfume spreads across a room; faster for lighter molecules and higher T.</li>
<li><b>Brownian motion</b>: smoke grains jiggle randomly under a microscope — bombardment by invisible molecules.</li>
<li><b>Compressibility</b>: gases compress ~1000× more than solids — mostly empty space between particles.</li>
</ul>
<div class="trap"><b>Trap.</b> Temperature measures average kinetic energy, not total heat content. A bathtub at 30 °C holds far more thermal energy than a cup at 90 °C.</div>` },
],
cps: [
{ q: "Temperature during melting of ice at 1 atm:", o: ["rises steadily", "stays at 0 °C", "falls", "fluctuates"], a: 1, e: "Latent heat goes into breaking the lattice, not raising temperature.", after: 1 },
],
fl: [
["Latent heat of fusion (water)", "≈334 J/g"],
["Brownian motion evidences", "random molecular bombardment"],
],
},

"f-atoms": {
mins: 14,
secs: [
{ t: "Atomic structure in one page", h: `
<p>Nucleus: protons (+) and neutrons (0), nearly all the mass. Electrons (−) orbit in shells, count = proton count for neutral atoms. Notation ᴬZX: Z protons define the element; A − Z neutrons; isotopes differ in neutrons (¹H vs ²H), isotopes share chemistry; isobars share mass number but not element.</p>
<div class="tblw"><table class="tbl">
<tr><th>Particle</th><th>Charge</th><th>Mass (u)</th></tr>
<tr><td>Proton</td><td>+1</td><td>1.007</td></tr>
<tr><td>Neutron</td><td>0</td><td>1.008</td></tr>
<tr><td>Electron</td><td>−1</td><td>0.00055</td></tr>
</table></div>` },
{ t: "Ions and chemical reactions", h: `
<p>Atoms gain/lose electrons to reach stable configurations: cations (+) when losing, anions (−) when gaining. Ionic compounds are lattices of oppositely charged ions; covalent compounds share pairs. Reaction basics:</p>
<ul>
<li><b>Conservation of mass</b>: atoms merely rearrange — balance every equation before any calculation.</li>
<li>Combination, decomposition, displacement, double-displacement, oxidation-reduction cover most reaction types.</li>
<li>Exothermic releases heat (combustion); endothermic absorbs (photosynthesis).</li>
</ul>
<div class="ex"><div class="ext">Worked example — balancing</div>
<div class="exq">Balance Fe + O₂ → Fe₂O₃.</div>
<ol class="steps">
<li>Odd oxygen on product side ⇒ multiply Fe₂O₃ by 2: 4Fe + ?O₂ → 2Fe₂O₃.</li>
<li>Right has 6 O ⇒ left needs 3O₂; iron: 4.</li>
</ol>
<div class="exa">4Fe + 3O₂ → 2Fe₂O₃.</div></div>` },
],
cps: [
{ q: "Isotopes of an element differ in their number of…", o: ["protons", "electrons", "neutrons", "valence"], a: 2, e: "Same Z, different neutron count.", after: 0 },
],
fl: [
["Isotope definition", "same Z, different A"],
["Mass conservation", "atoms rearrange; none created/destroyed"],
],
},

"f-periodic": {
mins: 14,
secs: [
{ t: "Reading the periodic table", h: `
<p>Elements arrange by atomic number into 18 groups (columns) and 7 periods (rows). Same group = same valence electrons = similar chemistry. Big families: alkali metals (Gr 1), alkaline earths (Gr 2), halogens (Gr 17), noble gases (Gr 18), transition metals (centre), lanthanides/actinides (bottom rows).</p>
<p>Electron filling order follows increasing energy: 1s 2s 2p 3s 3p 4s 3d 4p… (n+l rule). Period number = outermost shell; group often equals valence electrons (main groups).</p>` },
{ t: "Trends you must internalise", h: `
<div class="tblw"><table class="tbl">
<tr><th>Trend (left→right)</th><th>Behaviour</th><th>Why</th></tr>
<tr><td>Atomic radius</td><td>shrinks</td><td>more nuclear charge, same shell</td></tr>
<tr><td>Ionisation enthalpy</td><td>rises (with dips)</td><td>harder to remove electron</td></tr>
<tr><td>Metallic character</td><td>falls</td><td>losing e⁻ gets harder</td></tr>
<tr><td>Electronegativity</td><td>rises</td><td>nucleus pulls shared pairs harder</td></tr>
</table></div>
<p>Down a group everything reverses: radius grows (new shells), ionisation falls, metallic character rises — caesium is the most reactive natural metal, fluorine the most electronegative element.</p>
<div class="trap"><b>Trap.</b> Noble gases sit outside the reactivity game (full octet). Second-ionisation jumps are huge for Gr-1 metals (breaking into a full shell) — favourite question.</div>` },
],
cps: [
{ q: "Across a period, atomic radius generally…", o: ["increases", "decreases", "constant", "doubles"], a: 1, e: "Rising nuclear charge contracts the same shell.", after: 1 },
],
fl: [
["Most electronegative element", "fluorine"],
["Group = ", "same valence electrons"],
],
},

"C-mole": {
mins: 24,
secs: [
{ t: "The mole: chemistry's counting unit", h: `
<p>A mole is 6.022×10²³ particles (Avogadro's number N_A) — the number of carbon-12 atoms in exactly 12 g of C-12. Molar mass M (g/mol) numerically equals molecular mass in u. One mole of any ideal gas occupies 22.4 L at STP(0 °C, 1 atm).</p>
<div class="fml"><span class="fx">n = m/M · n = V(L)/22.4 · n = N/N_A</span><span class="fd">three roads into moles: mass, volume, count</span></div>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">How many molecules in 8.8 g CO₂? Atoms total?</div>
<ol class="steps">
<li>M(CO₂) = 44 ⇒ n = 8.8/44 = 0.2 mol.</li>
<li>Molecules = 0.2 × 6.022e23 = 1.204e23.</li>
<li>Atoms ×3 (C + 2O) = 3.6×10²³.</li>
</ol>
<div class="exa">1.2×10²³ molecules, 3.6×10²³ atoms.</div></div>` },
{ t: "Stoichiometry: equations as recipes", h: `
<p>A balanced equation gives mole ratios, not gram ratios. The five-step method never fails:</p>
<ol>
<li>Balance the equation.</li>
<li>Convert given quantity → moles.</li>
<li>Use the coefficient ratio to find required moles.</li>
<li>Convert back to asked units.</li>
<li>Sanity check magnitudes.</li>
</ol>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">What mass of Al reacts completely with 25.2 L HCl gas at STP? 2Al + 6HCl → 2AlCl₃ + 3H₂.</div>
<ol class="steps">
<li>n(HCl) = 25.2/22.4 = 1.125 mol.</li>
<li>Ratio Al:HCl = 2:6 ⇒ n(Al) = 1.125/3 = 0.375 mol.</li>
<li>m = 0.375 × 27 = 10.125 g.</li>
</ol>
<div class="exa">≈10.1 g aluminium.</div></div>` },
{ t: "Limiting reagent and yield", h: `
<p>The <b>limiting reagent</b> runs out first and caps the reaction. Find it by dividing each reactant's moles by its coefficient — smallest quotient loses. Everything else is excess. Percentage yield compares real product with theoretical maximum from the limiting reagent.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">N₂ + 3H₂ → 2NH₃. Start 2 mol N₂, 3 mol H₂. NH₃ made?</div>
<ol class="steps">
<li>Quotients: N₂: 2/1 = 2; H₂: 3/3 = 1 ⇒ H₂ limiting.</li>
<li>H₂ basis: (3→2) ⇒ n(NH₃) = 3×(2/3) = 2 mol.</li>
</ol>
<div class="exa">2 mol NH₃; N₂ leftover 1 mol.</div></div>` },
{ t: "Concentration vocabulary", h: `
<div class="tblw"><table class="tbl">
<tr><th>Term</th><th>Definition</th></tr>
<tr><td>Molarity M</td><td>mol solute / L solution (temperature-sensitive!)</td></tr>
<tr><td>Molality m</td><td>mol solute / kg solvent (temperature-proof)</td></tr>
<tr><td>Mole fraction x</td><td>nᵢ/Σn (no units)</td></tr>
<tr><td>% w/w, % v/v, % w/v</td><td>mass/mass, vol/vol, mass-per-volume conventions</td></tr>
</table></div>
<p>Dilution shortcut M₁V₁ = M₂V₂ (moles unchanged). Mixing two solutions: final M = total moles / total litres.</p>
<div class="ex"><div class="ext">Worked example — dilution</div>
<div class="exq">Make 500 mL of 0.2 M HCl from 2 M stock. Volume needed?</div>
<ol class="steps">
<li>M₁V₁ = M₂V₂ ⇒ 2·V₁ = 0.2×500.</li>
<li>V₁ = 50 mL stock, dilute to mark.</li>
</ol>
<div class="exa">50 mL stock + water up to 500 mL.</div></div>` },
{ t: "Empirical vs molecular formulas & percent composition", h: `
<p>Percent composition → assume 100 g → grams become moles (divide by atomic masses) → smallest whole ratio = empirical formula; multiply to match measured molar mass for the molecular formula.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Compound: 40% C, 6.7% H, 53.3% O; M = 180. Formula?</div>
<ol class="steps">
<li>Moles per 100 g: C 40/12=3.33; H 6.7/1=6.7; O 53.3/16=3.33.</li>
<li>Ratios ÷3.33: C 1 : H 2 : O 1 ⇒ CH₂O (empirical, mass 30).</li>
<li>180/30 = 6 ⇒ multiply through.</li>
</ol>
<div class="exa">C₆H₁₂O₆ — glucose.</div></div>` },
],
cps: [
{ q: "Number of moles in 5.6 L of O₂ at STP:", o: ["0.25", "0.5", "1", "2"], a: 0, e: "5.6/22.4 = 0.25 mol.", after: 0 },
{ q: "Molarity is preferred over molality except when…", o: ["never", "temperature varies", "volume large", "solvent volatile"], a: 1, e: "Volume expands with T so M drifts; molality uses mass only.", after: 3 },
{ q: "In 2A + B → products with 4 mol A and 3 mol B, the limiting reagent is…", o: ["A", "B", "either", "none"], a: 0, e: "Quotients: A: 4/2=2, B: 3/1=3 ⇒ A limits.", after: 2 },
],
fl: [
["Avogadro number", "6.022×10²³ per mole"],
["STP molar volume", "22.4 L/mol"],
["Limiting reagent test", "smallest moles÷coefficient"],
["Dilution law", "M₁V₁ = M₂V₂"],
],
},

"C-atomic": {
mins: 24,
secs: [
{ t: "From Bohr to quantum numbers", h: `
<p>Bohr quantised hydrogen successfully (E_n = −13.6/n² eV) but failed for multi-electron atoms. Quantum mechanics replaces orbits with orbitals — probability clouds described by four quantum numbers:</p>
<div class="tblw"><table class="tbl">
<tr><th>Quantum number</th><th>Symbol</th><th>Allowed values</th><th>Meaning</th></tr>
<tr><td>Principal</td><td>n</td><td>1,2,3,…</td><td>shell, size, energy (H atom)</td></tr>
<tr><td>Azimuthal</td><td>l</td><td>0 … n−1</td><td>subshell shape s,p,d,f</td></tr>
<tr><td>Magnetic</td><td>m_l</td><td>−l … +l</td><td>orientation</td></tr>
<tr><td>Spin</td><td>m_s</td><td>±½</td><td>two electrons max per orbital</td></tr>
</table></div>
<p>Orbital capacities: s 2, p 6, d 10, f 14 electrons.</p>` },
{ t: "Filling rules", h: `
<ul>
<li><b>Aufbau:</b> fill lowest (n+l), ties broken by lower n: order …4s before 3d!</li>
<li><b>Pauli exclusion:</b> no two electrons in one atom share all four quantum numbers.</li>
<li><b>Hund's rule:</b> degenerate orbitals fill singly first, parallel spins, then pair.</li>
</ul>
<p>Half-filled and fully-filled subshells earn extra stability (Cr [Ar]3d⁵4s¹, Cu [Ar]3d¹⁰4s¹) — exceptions worth memorising.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Write configuration of Fe (Z=26).</div>
<ol class="steps">
<li>[Ar] core = 18.</li>
<li>Remaining 8: 4s² then 3d⁶.</li>
</ol>
<div class="exa">[Ar] 3d⁶ 4s².</div></div>` },
{ t: "Photoelectric effect and spectra recap", h: `
<p>Light shows particle behaviour (photoelectric: E = hf − φ instant emission) and wave behaviour (interference/diffraction). Hydrogen line spectra confirmed quantised levels: Lyman UV (→1), Balmer visible (→2), Paschen IR (→3); Rydberg formula 1/λ = R(1/n₁² − 1/n₂²).</p>
<div class="trap"><b>Trap.</b> In the H-atom, energy depends only on n; in multi-electron atoms, subshell splitting (penetration s&lt;p&lt;d&lt;f) matters — that's why 4s fills before 3d there but energies reorder once d is populated.</div>` },
],
cps: [
{ q: "Maximum electrons in a subshell with l = 2:", o: ["2", "6", "10", "14"], a: 2, e: "d subshell: 2(2l+1) = 10.", after: 0 },
{ q: "Which set of quantum numbers is impossible?", o: ["n=3, l=2, m=−2", "n=2, l=0, m=0", "n=2, l=2, m=1", "n=4, l=3, m=+3"], a: 2, e: "l must be ≤ n−1, so l=2 invalid for n=2.", after: 0 },
],
fl: [
["Aufbau order trick", "fill by n+l, lower n wins ties"],
["Pauli principle", "no duplicate four-number sets"],
["H-atom ground energy", "−13.6 eV"],
["Cr configuration anomaly", "[Ar]3d⁵4s¹"],
],
},

"C-bonding": {
mins: 28,
secs: [
{ t: "Octet logic: ionic and covalent bonds", h: `
<p>Atoms bond to drop into noble-gas configurations. Metal + nonmetal transfers electrons → <b>ionic bond</b> (high MP, conduct when molten/aqueous, brittle crystals). Nonmetal + nonmetal shares pairs → <b>covalent</b> (lower MP, poor conductors). Metallic bonding: electron sea around cation cores explains conductivity and malleability.</p>
<p>Ionic character isn't binary — electronegativity difference ΔEN grades it: ΔEN &gt; ~1.7 mostly ionic; small ΔEN covalent. Fajans' rules refine this: small highly-charged cations polarise anions toward covalency (why AgI is covalent-ish).</p>` },
{ t: "Lewis structures and formal charge", h: `
<ol>
<li>Count total valence electrons.</li>
<li>Skeleton with least-electronegative central atom.</li>
<li>Bonds first (pairs), complete octets of outer atoms, leftovers to central atom.</li>
<li>If central lacks octet, make multiple bonds; minimise formal charges.</li>
</ol>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Draw NO₃⁻ Lewis structure; bond order?</div>
<ol class="steps">
<li>Valence e⁻: 5 + 3×6 + 1 = 24.</li>
<li>N centre, three N–O bonds, fill O octets; N short 2 e⁻ ⇒ one double bond.</li>
<li>Resonance over 3 positions equalises bonds.</li>
</ol>
<div class="exa">Bond order each N–O = 1⅓ (delocalised resonance).</div></div>` },
{ t: "VSEPR shapes", h: `
<p>Electron pairs repel: lone-lone &gt; lone-bond &gt; bond-bond. Count steric number SN = σ-bonds + lone pairs on central atom:</p>
<div class="tblw"><table class="tbl">
<tr><th>SN</th><th>Arrangement</th><th>0 lp</th><th>1 lp</th><th>2 lp</th></tr>
<tr><td>2</td><td>linear</td><td>BeCl₂, CO₂</td><td>—</td><td>—</td></tr>
<tr><td>3</td><td>trigonal planar</td><td>BF₃</td><td>bent SO₂</td><td>—</td></tr>
<tr><td>4</td><td>tetrahedral</td><td>CH₄ 109.5°</td><td>pyramidal NH₃ 107°</td><td>bent H₂O 104.5°</td></tr>
<tr><td>5</td><td>trigonal bipyramidal</td><td>PCl₅</td><td>seesaw SF₄</td><td>T-shape ClF₃</td></tr>
<tr><td>6</td><td>octahedral</td><td>SF₆</td><td>square pyramidal BrF₅</td><td>square planar XeF₄</td></tr>
</table></div>
<p>Lone pairs prefer equatorial sites in TBP geometry — memorise where they hide.</p>` },
{ t: "Hybridisation and sigma/pi", h: `
<p>Mixing atomic orbitals makes equivalent hybrids pointing where VSEPR says: sp linear, sp² trigonal (each 120°), sp³ tetrahedral, sp³d TBP, sp³d² octahedral. Sigma bonds (head-on overlap) free-rotate; pi bonds (sideways p-overlap) lock planarity — hence ethane rotates, ethene can't.</p>
<div class="tipbox"><b>Tip.</b> Quick hybridisation = steric number: SN2→sp, 3→sp², 4→sp³, 5→sp³d, 6→sp³d². Works for main-group centres including those with lone pairs.</div>` },
{ t: "MO theory essentials", h: `
<p>Molecular orbital theory beats VSEPR for magnetic behaviour and stability. Order (for O₂, F₂): σ1s σ*1s σ2s σ*2s σ2p_z π2p_x=π2p_y π* π* σ*2p_z. For B₂–N₂ the π2p sits below σ2p (mixing).</p>
<div class="fml"><span class="fx">Bond order = (N_bonding − N_antibonding)/2</span><span class="fd">BO&gt;0 binds; unpaired electrons ⇒ paramagnetic</span></div>
<div class="ex"><div class="ext">Worked example — the famous one</div>
<div class="exq">Predict magnetism of O₂ via MO theory.</div>
<ol class="steps">
<li>O₂ valence MOs: σ2s²σ*2s²σ2p²π2p⁴π*2p².</li>
<li>Two π* electrons stay unpaired (Hund).</li>
</ol>
<div class="exa">Paramagnetic — liquid O₂ clings to a magnet. Bond order = (8−4)/2 = 2 ✓.</div></div>
<div class="trap"><b>Trap.</b> N₂ (BO 3, diamagnetic) vs O₂ (BO 2, paramagnetic): mixing flips σ2p/π2p order between N₂ and O₂ rows — quote the right sequence per molecule.</div>` },
{ t: "Intermolecular forces & hydrogen bonding", h: `
<p>Weakest to strongest: London dispersion (∝ surface area, polarisability) &lt; dipole-dipole &lt; hydrogen bond (H on N/O/F facing lone pair). Consequences: HF's absurdly high bp among halides, ice floating (open H-bond lattice), DNA base pairing, water's giant specific heat. Boiling-point comparisons hinge on spotting H-bond donors first, then surface area.</p>` },
],
cps: [
{ q: "Shape of XeF₄:", o: ["tetrahedral", "square planar", "see-saw", "octahedral"], a: 1, e: "SN 6 with 2 lone pairs opposite ⇒ square planar.", after: 2 },
{ q: "O₂ is paramagnetic because its MO configuration contains…", o: ["no antibonding e⁻", "two unpaired π* electrons", "a half-filled σ2s", "only paired spins"], a: 1, e: "Two unpaired π* electrons give paramagnetism.", after: 3 },
{ q: "Strongest interparticle attraction in HF(l):", o: ["London force", "dipole-dipole only", "hydrogen bond", "covalent bond"], a: 2, e: "H bonded to F donates strong H-bonds between molecules (intramolecular covalent bonds are not 'between molecules').", after: 5 },
],
fl: [
["VSEPR lone-pair hierarchy", "lp-lp > lp-bp > bp-bp repulsion"],
["Hybridisation shortcut", "= steric number (σ + lp)"],
["MO bond order", "(bonding − antibonding)/2"],
["H-bond donors need", "H on N, O or F"],
],
},

"C-gas": {
mins: 20,
secs: [
{ t: "The gas laws as experimental facts", h: `
<div class="tblw"><table class="tbl">
<tr><th>Law</th><th>Statement (fixed n)</th><th>Graph</th></tr>
<tr><td>Boyle</td><td>p ∝ 1/V at constant T</td><td>p vs 1/V straight; p vs V hyperbola</td></tr>
<tr><td>Charles</td><td>V ∝ T(K)</td><td>V–T straight extrapolating to −273 °C</td></tr>
<tr><td>Gay-Lussac</td><td>p ∝ T(K)</td><td>p–T straight line</td></tr>
<tr><td>Avogadro</td><td>V ∝ n</td><td>equal volumes, equal molecules</td></tr>
</table></div>
<p>Merged into the ideal-gas equation pV = nRT, R = 8.314 J/mol·K (= 0.0821 L·atm/mol·K — pick per your unit soup!). Standard conversions: always kelvin for T.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Gas at 27 °C, 1 atm compressed to half volume while heated to 127 °C. New pressure?</div>
<ol class="steps">
<li>p₂ = p₁ × (V₁/V₂) × (T₂/T₁) = 1 × 2 × (400/300).</li>
<li>= 8/3 atm ≈ 2.67 atm.</li>
</ol>
<div class="exa">≈2.67 atm.</div></div>` },
{ t: "Dalton, Graham, kinetic connections", h: `
<p><b>Dalton:</b> total pressure = sum of partial pressures; partial p = mole fraction × total. Collecting gas over water requires subtracting vapour pressure.</p>
<p><b>Graham:</b> rate ∝ 1/√M — effusion/diffusion ratios r₁/r₂ = √(M₂/M₁). Hydrogen escapes 4× faster than oxygen (√32/√2). Isotope separation historically used exactly this.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Unknown gas diffuses 1/4 as fast as He. Molar mass?</div>
<ol class="steps">
<li>r_unknown/r_He = √(4/M) = 1/4.</li>
<li>Square: 4/M = 1/16 ⇒ M = 64 g/mol.</li>
</ol>
<div class="exa">64 g/mol (SO₂!).</div></div>` },
{ t: "Real gases and compressibility", h: `
<p>Ideal assumption fails at high p (molecule volumes matter) and low T (attractions matter). van der Waals corrects both: (p + an²/V²)(V − nb) = nRT. Compressibility factor Z = pV/nRT: Z = 1 ideal; Z &lt; 1 attractions dominate (moderate p); Z &gt; 1 repulsions/volume dominate (very high p). Boyle temperature: where gas behaves ideally over wide range.</p>
<div class="trap"><b>Trap.</b> 'a' tracks attraction (NH₃ ≫ He), 'b' tracks molecule size. Larger a ⇒ easier liquefaction — connects directly to critical temperature trends.</div>` },
],
cps: [
{ q: "At constant T, doubling pressure on an ideal gas halves…", o: ["moles", "volume", "temperature", "density? no—density doubles"], a: 1, e: "Boyle's law: pV constant ⇒ V halves (and density actually doubles).", after: 0 },
{ q: "Rate ratio CH₄ : O₂ diffusion equals…", o: ["2:1", "1:2", "√2:1", "1:√2"], a: 2, e: "√(32/16) = √2 ⇒ CH₄ diffuses √2× faster.", after: 1 },
],
fl: [
["Ideal gas equation", "pV = nRT"],
["Graham's law", "r ∝ 1/√M"],
["Z < 1 means", "attractive forces dominate"],
["Dalton partial pressure", "xᵢ × P_total"],
],
},

"C-thermo": {
mins: 22,
secs: [
{ t: "System, surroundings, and sign discipline", h: `
<p>Thermochemistry tracks energy crossing the boundary. Exothermic ΔH &lt; 0 (heat leaves system); endothermic ΔH &gt; 0. State functions (U, H, S, G) care only about endpoints — path functions (q, w) don't. Enthalpy H = U + pV suits constant-pressure chemistry; ΔH = q_p.</p>
<div class="tipbox"><b>Tip.</b> Flip signs when reversing equations; multiply ΔH when scaling coefficients; Hess's law lets you add/subtract routes freely — the algebra of thermochemistry.</div>` },
{ t: "Enthalpy varieties", h: `
<ul>
<li><b>Formation</b> ΔH_f: 1 mol compound from elements in standard states (ΔH_f of elements = 0).</li>
<li><b>Combustion</b> ΔH_c: burning 1 mol completely in O₂.</li>
<li><b>Bond enthalpy</b>: average energy to break bonds gas-phase; ΔH_rxn = ΣB(broken) − ΣB(formed).</li>
<li><b>Atomisation, sublimation, ionisation, electron gain, lattice</b> — the Born–Haber toolkit for ionic compounds.</li>
</ul>
<div class="fml"><span class="fx">ΔH_rxn = ΣΔH_f(products) − ΣΔH_f(reactants)</span><span class="fd">the workhorse formula</span></div>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">ΔH_f: CO₂ −393, H₂O(l) −286, C₃H₈ −104 kJ/mol. Heat of combustion of propane?</div>
<ol class="steps">
<li>C₃H₈ + 5O₂ → 3CO₂ + 4H₂O.</li>
<li>ΔH = [3(−393) + 4(−286)] − [−104] = (−1179 −1144) + 104 = −2219 kJ/mol.</li>
</ol>
<div class="exa">≈ −2220 kJ/mol.</div></div>` },
{ t: "Calorimetry and specific heat", h: `
<p>q = mcΔT links heat flow to temperature change; coffee-cup calorimeter assumes no loss: heat released = heat absorbed by water+cup. Bomb calorimeter (constant volume) measures ΔU; convert via ΔH = ΔU + Δn_gas RT.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">0.5 g fuel raises 200 g water by 4 °C (c = 4.18). Heat value?</div>
<ol class="steps">
<li>q_water = 200×4.18×4 = 3344 J.</li>
<li>Per gram: 3344/0.5 ≈ 6.7 kJ/g.</li>
</ol>
<div class="exa">≈6.7 kJ/g calorific value.</div></div>` },
{ t: "Entropy and spontaneity (Gibbs)", h: `
<p>Entropy S counts microscopic disorder/spread; ΔS_surroundings = −ΔH/T. Gibbs energy merges both criteria:</p>
<div class="fml"><span class="fx">ΔG = ΔH − TΔS · spontaneous iff ΔG &lt; 0</span><span class="fd">equilibrium when ΔG = 0</span></div>
<div class="tblw"><table class="tbl">
<tr><th>ΔH</th><th>ΔS</th><th>Spontaneous…</th></tr>
<tr><td>−</td><td>+</td><td>always</td></tr>
<tr><td>+</td><td>−</td><td>never</td></tr>
<tr><td>−</td><td>−</td><td>low T only</td></tr>
<tr><td>+</td><td>+</td><td>high T only</td></tr>
</table></div>
<div class="trap"><b>Trap.</b> Spontaneous ≠ fast. Diamond → graphite is thermodynamically favourable yet kinetically frozen for eternity — kinetics is a separate gatekeeper.</div>` },
],
cps: [
{ q: "For an exothermic reaction with positive ΔS, spontaneity is…", o: ["never", "always", "high-T only", "low-T only"], a: 1, e: "ΔH<0 and ΔS>0 make ΔG negative at every T.", after: 3 },
{ q: "ΔU relates to ΔH for a reaction with Δn(gas) as…", o: ["ΔH = ΔU", "ΔH = ΔU + ΔnRT", "ΔH = ΔU − RT", "unrelated"], a: 1, e: "Add the pV work of net gas-mole change.", after: 2 },
],
fl: [
["Gibbs equation", "ΔG = ΔH − TΔS"],
["Hess's law meaning", "ΔH path-independent (state function)"],
["Bond-energy formula", "Σ broken − Σ formed"],
],
},

"C-equil": {
mins: 22,
secs: [
{ t: "Reversible reactions and equilibrium constants", h: `
<p>Reversible reactions settle where forward and reverse rates match — concentrations stop changing though molecules keep reacting (dynamic!). For aA + bB ⇌ cC + dD:</p>
<div class="fml"><span class="fx">K_c = [C]^c[D]^d/[A]^a[B]^b · K_p = K_c(RT)^Δn</span><span class="fd">pure solids/liquids excluded from K expressions</span></div>
<p>K depends only on temperature. Magnitude speaks: K ≫ 1 products dominate, K ≪ 1 reactants. Reaction quotient Q uses the same formula with arbitrary concentrations: Q &lt; K moves forward, Q &gt; K backward, Q = K at rest.</p>` },
{ t: "Le Chatelier's principle", h: `
<p>Disturb the balance and the system shifts to oppose the change:</p>
<ul>
<li><b>Concentration</b>: add reactant → forward shift (consumes it).</li>
<li><b>Pressure</b> (gas phase): squeeze → shifts toward fewer gas moles.</li>
<li><b>Temperature</b>: heating favours endothermic direction — and actually changes K (the only lever that does!).</li>
<li><b>Inert gas</b>: at constant volume nothing changes; at constant pressure everything dilutes (shift like reducing total p).</li>
</ul>
<div class="ex"><div class="ext">Worked example — Haber context</div>
<div class="exq">N₂ + 3H₂ ⇌ 2NH₃, ΔH = −92 kJ. Which conditions favour NH₃?</div>
<ol class="steps">
<li>High pressure: 4 gas mol → 2, compression helps.</li>
<li>Low temperature helps exothermic formation — but slows kinetics; industry compromises (~450 °C) with catalyst.</li>
</ol>
<div class="exa">High p, moderately low T, catalyst for speed.</div></div>` },
{ t: "Calculations: ICE tables", h: `
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">1 mol H₂ + 1 mol I₂ in 1 L; K_c = 4 for H₂ + I₂ ⇌ 2HI. Equilibrium HI?</div>
<ol class="steps">
<li>ICE: [H₂]=[I₂]=1−x, [HI]=2x.</li>
<li>K = (2x)²/(1−x)² = 4 ⇒ 2x/(1−x) = 2 ⇒ x = ½.</li>
</ol>
<div class="exa">[HI] = 1 M; perfect square Ks make clean algebra — spot them.</div></div>
<div class="trap"><b>Trap.</b> Catalysts speed BOTH directions equally: equilibrium arrives sooner, position unchanged. Also never include pure solids/liquids in K.</div>` },
],
cps: [
{ q: "Adding inert gas at constant volume to an equilibrium mixture…", o: ["shifts forward", "shifts backward", "no effect", "changes K"], a: 2, e: "Partial pressures of participants unchanged; Q still equals K.", after: 1 },
{ q: "Only which disturbance changes the value of K?", o: ["pressure", "concentration", "temperature", "catalyst"], a: 2, e: "K is temperature-dependent alone.", after: 1 },
],
fl: [
["Q vs K meaning", "Q<K → forward; Q>K → backward"],
["K_p relation", "K_p = K_c(RT)^Δn"],
["Le Chatelier on T", "heat favours endothermic side"],
],
},

"C-ionic": {
mins: 26,
secs: [
{ t: "Acids, bases and pH arithmetic", h: `
<p>Arrhenius → Brønsted (proton donor/acceptor) → Lewis (electron-pair acceptor/donor): each definition widens the previous. Water autoionises: K_w = [H⁺][OH⁻] = 10⁻¹⁴ at 25 °C, giving pH + pOH = 14.</p>
<div class="fml"><span class="fx">pH = −log[H₃O⁺]</span><span class="fd">each pH unit = 10× acidity change</span></div>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">pH of 0.001 M HCl? Of 0.002 M HCl?</div>
<ol class="steps">
<li>Strong acid fully dissociates: [H⁺]=10⁻³ ⇒ pH 3.</li>
<li>2×10⁻³ ⇒ pH = 3 − log2 ≈ 2.7.</li>
</ol>
<div class="exa">pH 3; ≈2.7. (log2 ≈ 0.3 — the constant you'll reuse forever.)</div></div>` },
{ t: "Weak acids/bases: Ka, Kb and Ostwald", h: `
<p>Weak electrolytes partially ionise; Ka measures acid strength (pKa = −logKa, smaller pKa stronger). For HA concentration C with degree α: Ka = Cα²/(1−α) ≈ Cα² for tiny α (Ostwald dilution law — α grows on dilution).</p>
<div class="fml"><span class="fx">[H⁺] = √(Ka·C) for weak acids</span><span class="fd">square-root dependence — 100× concentration only 10× [H⁺]</span></div>
<p>Conjugate pairs multiply to Kw: Ka(HAc)·Kb(Ac⁻) = 10⁻¹⁴. Stronger acid ⇌ weaker conjugate base.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">pH of 0.1 M acetic acid (Ka = 1.8×10⁻⁵)?</div>
<ol class="steps">
<li>[H⁺] = √(1.8×10⁻⁵×0.1) = √(1.8×10⁻⁶) ≈ 1.34×10⁻³.</li>
<li>pH ≈ 2.87.</li>
</ol>
<div class="exa">≈2.9 — far above the 1.0 a strong acid would give.</div></div>` },
{ t: "Salt hydrolysis: predicting pH without computing", h: `
<div class="tblw"><table class="tbl">
<tr><th>Salt from</th><th>Example</th><th>Solution pH</th></tr>
<tr><td>strong acid + strong base</td><td>NaCl</td><td>neutral 7</td></tr>
<tr><td>weak acid + strong base</td><td>CH₃COONa</td><td>&gt;7 basic (anion hydrolyses)</td></tr>
<tr><td>strong acid + weak base</td><td>NH₄Cl</td><td>&lt;7 acidic</td></tr>
<tr><td>weak + weak</td><td>CH₃COONH₄</td><td>depends on Ka vs Kb comparison</td></tr>
</table></div>
<div class="fml"><span class="fx">weak-acid salt: pH = 7 + ½(pKa + log C) · weak-base salt: pH = 7 − ½(pKb + log C)</span><span class="fd">hydrolysis shortcuts</span></div>` },
{ t: "Buffers and indicators", h: `
<p>A buffer = weak acid + its conjugate base resists pH change on dilution/small additions. Henderson–Hasselbalch:</p>
<div class="fml"><span class="fx">pH = pKa + log([salt]/[acid])</span><span class="fd">equal amounts ⇒ pH = pKa; capacity peaks there</span></div>
<p>Blood bicarbonate buffer locks pH near 7.4. Indicators are themselves weak acids whose colour flips within ±1 of their pKa (phenolphthalein 8.3–10, methyl orange 3.1–4.4) — match indicator range to equivalence-point pH: strong acid-base any indicator; weak acid-strong base use phenolphthalein; strong acid-weak base methyl orange.</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Buffer with 0.2 M acetate + 0.02 M acetic acid. pH? (pKa = 4.74)</div>
<ol class="steps">
<li>pH = 4.74 + log(0.2/0.02) = 4.74 + 1.</li>
</ol>
<div class="exa">5.74.</div></div>
<div class="trap"><b>Trap.</b> Diluting a buffer changes neither ratio nor pH (both concentrations fall equally) — but capacity shrinks. Common true/false trap.</div>` },
{ t: "Solubility product Ksp", h: `
<p>Sparingly soluble salts obey Ksp = product of ion concentrations (powers = coefficients). Precipitation starts when ionic product exceeds Ksp; common ion suppresses solubility (AgCl in NaCl solution drops drastically); pH affects salts of weak acids (carbonates dissolve in acid).</p>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Ksp(AgCl)=1.8×10⁻¹⁰. Solubility in pure water and in 0.01 M NaCl.</div>
<ol class="steps">
<li>Pure: s = √Ksp = 1.34×10⁻⁵ M.</li>
<li>With common ion: Ksp = s×0.01 ⇒ s = 1.8×10⁻⁸ M — suppressed 750×!</li>
</ol>
<div class="exa">Common-ion effect quantified.</div></div>` },
],
cps: [
{ q: "pH of 10⁻⁸ M HCl (careful!)…", o: ["8", "slightly below 7", "6", "cannot exist"], a: 1, e: "Water's own 10⁻⁷ dominates: total ≈1.05×10⁻⁷ ⇒ pH ≈ 6.98, slightly acidic.", after: 0 },
{ q: "Buffer pH equals pKa when…", o: ["[salt]>[acid]", "[salt]=[acid]", "acid strong", "always"], a: 1, e: "log(1) = 0.", after: 3 },
{ q: "Which salt solution is basic?", o: ["NH₄Cl", "NaCl", "CH₃COONa", "CuSO₄"], a: 2, e: "Weak-acid/strong-base salt: acetate grabs protons.", after: 2 },
],
fl: [
["pH + pOH", "14 (25 °C)"],
["Ka·Kb of conjugate pair", "= Kw = 10⁻¹⁴"],
["Henderson–Hasselbalch", "pH = pKa + log(salt/acid)"],
["Precipitation condition", "ionic product > Ksp"],
],
},
};