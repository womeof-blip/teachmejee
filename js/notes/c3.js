/* Full Notes — Chemistry part 3 (d-block → biomolecules). */

export const CHEM_NOTES_3 = {

"C-dblock": {
mins: 20,
secs: [
{ t: "Transition element signatures", h: `
<p>d-block elements fill (n−1)d orbitals; true transitions have partly-filled d in atoms OR ions. Consequences cascade from that one fact:</p>
<ul>
<li>Variable oxidation states (Mn: +2 to +7) — d electrons participate.</li>
<li>Coloured ions — d–d transitions absorb visible light (Cu²⁺ blue, MnO₄⁻ purple via charge transfer).</li>
<li>Paramagnetism — unpaired d electrons; magnetic moment μ = √(n(n+2)) BM.</li>
<li>Catalysis — variable states let them shuttle redox steps (Fe in Haber, V₂O₅ in contact process).</li>
<li>Complex formation, alloying, interstitial compounds — small d orbitals fit small atoms (steel!).</li>
</ul>
<div class="trap"><b>Trap.</b> Zn, Cd, Hg (d¹⁰ both atom & ion) aren't 'true' transitions — colourless, diamagnetic, fixed +2 mostly.</div>` },
{ t: "Trends and the famous anomalies", h: `
<p>Across a period, atomic radii shrink slowly then stabilise; density rises to mid-series maxima. Melting points peak near Cr/Mo/W (half-filled d bonding). Second/third-row metals resemble EACH OTHER more than the first row — lanthanide contraction squeezes 4d/5d pairs to identical sizes (Zr≈Hf, Nb≈Ta).</p>
<p><b>Lanthanide contraction:</b> poor 4f shielding shrinks Ln³⁺ steadily La→Lu, pulling later elements' radii down. Consequences: Y with heavy lanthanides, similar separation difficulty, 5d contraction effects.</p>` },
{ t: "Potassium dichromate and permanganate", h: `
<div class="tblw"><table class="tbl">
<tr><th>Compound</th><th>Key chemistry</th></tr>
<tr><td>K₂Cr₂O₇</td><td>orange; oxidant in acid: Cr₂O₇²⁻ +14H⁺ +6e⁻ → 2Cr³⁺ +7H₂O; chromate-dichromate pH equilibrium (yellow↔orange)</td></tr>
<tr><td>KMnO₄</td><td>purple; acid n=5 (colourless Mn²⁺), neutral n=3 (brown MnO₂), basic n=1 (green MnO₄²⁻)</td></tr>
</table></div>
<p>Both prepared from pyrolusite MnO₂ / chromite ore; volumetric workhorses whose n-factors you must recall instantly.</p>` },
],
cps: [
{ q: "Magnetic moment for Fe³⁺ (5 unpaired):", o: ["1.73 BM", "2.83 BM", "5.92 BM", "zero"], a: 2, e: "√(5×7)=√35≈5.92 BM.", after: 0 },
{ q: "Lanthanide contraction mainly results from…", o: ["relativistic effects", "poor f-orbital shielding", "increasing nuclear stability", "orbital hybridisation"], a: 1, e: "4f electrons shield poorly; effective nuclear charge creeps up.", after: 1 },
],
fl: [
["Colour origin", "d–d transitions"],
["μ formula", "√(n(n+2)) BM"],
["KMnO₄ n-factor (acid/neutral/basic)", "5 / 3 / 1"],
["Cause of Zr≈Hf", "lanthanide contraction"],
],
},

"C-coord": {
mins: 26,
secs: [
{ t: "Anatomy of coordination compounds", h: `
<p>Central metal + ligands (Lewis bases donating lone pairs) = complex. Coordination number counts donor atoms; chelating ligands (en, oxalate, EDTA) bite with 2+ teeth — chelate effect boosts stability entropically. Naming rules: ligands alphabetical first, then metal with oxidation state in Roman numerals; anionic complexes end -ate.</p>
<div class="tblw"><table class="tbl">
<tr><th>Complex</th><th>Parsed meaning</th></tr>
<tr><td>K₄[Fe(CN)₆]</td><td>potassium hexacyanidoferrate(II); CN⁻ strong field, low spin? For Fe²⁺ d⁶: yes, low-spin</td></tr>
<tr><td>[Cu(NH₃)₄]SO₄</td><td>tetraamminecopper(II) sulphate; deep blue complex</td></tr>
<tr><td>[Co(NH₃)₆]Cl₃</td><td>hexaamminecobalt(III) chloride; Co³⁺ counterbalanced by 3 Cl⁻ outside sphere</td></tr>
</table></div>` },
{ t: "Isomerism: coordination's rich variety", h: `
<ul>
<li><b>Ionisation</b>: [CoBr(NH₃)₅]SO₄ vs [CoSO₄(NH₃)₅]Br — different precipitating ions.</li>
<li><b>Linkage</b>: ambidentate NO₂⁻ via N (nitro) or O (nitrito); SCN⁻ S/N ends.</li>
<li><b>Coordination</b>: counter-ion swaps into sphere ([Cr(NH₃)₆][Co(CN)₆]).</li>
<li><b>Solvate/hydrate</b>: CrCl₃·6H₂O violet/green variants by water placement.</li>
<li><b>Geometrical</b> (cis/trans in MA₄B₂ octahedral, square planar) & <b>optical</b> (chiral, e.g., [Co(en)₃]³⁺, cis-MA₂B₂(en)).</li>
</ul>
<div class="trap"><b>Trap.</b> Tetrahedral MA₂B₂ has no cis/trans (all positions adjacent); square planar does. Octahedral [M(AA)₃] is ALWAYS optically active.</div>` },
{ t: "Bonding theories: VBT to CFT", h: `
<p>Valence bond theory uses hybrids: inner-orbital (d²sp³ low-spin, e.g., [Co(NH₃)₆]³⁺) vs outer-orbital (sp³d² high-spin [CoF₆]³⁻), judged by magnetic moment measurements. Crystal field theory explains colours properly: ligands split the five d orbitals into t₂g (lower) + e_g (higher) sets separated by Δ₀:</p>
<ul>
<li>Strong-field ligands (CN⁻, CO, NH₃) big Δ₀ ⇒ pair electrons ⇒ LOW spin.</li>
<li>Weak fields (F⁻, Cl⁻, H₂O borderline) small Δ₀ ⇒ HIGH spin (Hund wins).</li>
<li>d⁴–d⁷ configurations differ between spins — CFSE calculations decide stability.</li>
</ul>
<div class="fml"><span class="fx">spectrochemical series: I⁻ < Br⁻ < Cl⁻ < F⁻ < OH⁻ < H₂O < NH₃ < en < CN⁻ ≈ CO</span><span class="fd">memorise this ladder cold</span></div>
<div class="ex"><div class="ext">Worked example</div>
<div class="exq">Predict magnetism of [Fe(CN)₆]³⁻ vs [Fe(H₂O)₆]³⁺.</div>
<ol class="steps">
<li>Both Fe³⁺ d⁵. CN⁻ strong field: t₂g⁵ ⇒ ONE unpaired (low spin).</li>
<li>H₂O weak: all five singly occupied (high spin) ⇒ 5 unpaired.</li>
</ol>
<div class="exa">Low-spin nearly diamagnetic-ish (μ≈1.7) vs strongly paramagnetic (μ≈5.9).</div></div>` },
{ t: "Applications", h: `
<p>Analytical chemistry runs on complexes: Ni-DMG red precipitate, Fe-SCN blood-red test, EDTA titrations for water hardness. Biology: haemoglobin (Fe), chlorophyll (Mg), B₁₂ (Co) — metal centres doing electron/ligand chemistry. Metallurgy: MacArthur-Forrest cyanide process leaches gold as [Au(CN)₂]⁻; Mond purifies Ni as Ni(CO)₄. Medicine: cis-platin anticancer, EDTA chelation for lead poisoning.</p>` },
],
cps: [
{ q: "[Co(NH₃)₆]³⁺ is…", o: ["outer orbital, paramagnetic", "inner orbital, diamagnetic", "sp³d² hybridised", "tetrahedral"], a: 1, e: "Strong-field NH₃ pairs d⁶ fully: t₂g⁶, d²sp³, zero unpaired.", after: 2 },
{ q: "Which shows optical isomerism?", o: ["trans-[Co(NH₃)₄Cl₂]⁺", "[Co(en)₃]³⁺", "cis-[Pt(NH₃)₂Cl₂]", "none"], a: 1, e: "Tris-chelate propeller is inherently chiral.", after: 1 },
{ q: "EDTA is preferred in hard-water titration because it is…", o: ["coloured", "hexadentate chelator", "cheap", "volatile"], a: 1, e: "Six donor atoms wrap Ca²⁺/Mg²⁺ completely.", after: 0 },
],
fl: [
["Chelate effect driver", "entropy (more free particles)"],
["Spectrochemical top/bottom", "CO/CN⁻ strongest; I⁻ weakest"],
["Coordination isomerism needs", "both cation & anion complexes"],
],
},

"C-halo": {
mins: 20,
secs: [
{ t: "Nature and preparation of haloalkanes", h: `
<p>R−X classification 1°/2°/3° by the carbon bearing X. C–X bond polar yet insoluble in water; bp rises down halogens, branched lowers. Preparations:</p>
<ul>
<li>Alcohol + HX/SOCl₂/PBr₃ (SOCl₂ cleanest: gaseous by-products escape).</li>
<li>Free-radical halogenation (alkanes) — mixtures, low selectivity.</li>
<li>Addition to alkenes (HX, X₂).</li>
<li>Hunsdiecker: RCOOAg + Br₂/CCl₄ → RBr (one carbon shorter!); Sandmeyer: diazonium + CuX for aryl-X.</li>
</ul>` },
{ t: "SN1 vs SN2: the central showdown", h: `
<div class="tblw"><table class="tbl">
<tr><th>Feature</th><th>SN1</th><th>SN2</th></tr>
<tr><td>Steps/mechanism</td><td>two; carbocation intermediate; possible rearrangement!</td><td>one concerted backside attack</td></tr>
<tr><td>Rate law</td><td>k[RX]</td><td>k[RX][Nu⁻]</td></tr>
<tr><td>Substrate preference</td><td>3° > 2° (cation stability)</td><td>1° > 2° (steric crowding)</td></tr>
<tr><td>Stereochemistry</td><td>racemisation</td><td>Walden inversion</td></tr>
<tr><td>Solvent</td><td>polar protic (stabilises ions)</td><td>polar aprotic (DMF/DMSO boost Nu⁻)</td></tr>
<tr><td>Nucleophile</td><td>weak OK (H₂O)</td><td>strong needed</td></tr>
</table></div>
<p>Aryl halides resist substitution: resonance strengthens C–X, sp² blocks SN2, phenyl cation absurd. Their reactions need harsh conditions (dow process) or activation (NO₂ ortho/para enabling nucleophilic aromatic substitution via Meisenheimer adducts).</p>` },
{ t: "Elimination and the decision tree", h: `
<p>E2: single step, anti-periplanar H+X leave together, rate k[RX][Base], favours strong bases; Zaitsev product (more substituted alkene) usually dominates — except bulky bases (t-BuOK) give Hofmann (least substituted). E1 shares SN1's cation; heat promotes elimination over substitution (ΔS favourable).</p>
<div class="tipbox"><b>Tip.</b> Decision flow: 3° substrate + weak nucleophile/protic → SN1/E1 (heat tips E1); any substrate + strong base/concentrated → E2; primary + good nucleophile weak base → SN2; primary + bulky base → E2 Hofmann.</div>
<div class="trap"><b>Trap.</b> Saytzeff vs Hofmann depends on BASE bulk, not substrate. Also watch rearrangements in SN1/E1 (hydride/methyl shifts to stabler cations).</div>` },
{ t: "Polyhalogen stars & environmental notes", h: `
<p>CHCl₃ stored dark (phosgene risk + ethanol stabiliser); CHI₃ iodoform antiseptic; DDT pesticide banned (biomagnification); freons ozone-depleting phased out; Teflon −(CF₂CF₂)n− inert polymer. Freon-CFC mechanism: UV cleaves C–Cl, radicals eat O₃ chain-wise — one radical destroys ~10⁵ ozone molecules.</p>` },
],
cps: [
{ q: "Tertiary butyl bromide hydrolysis in water proceeds via…", o: ["SN2 with inversion", "SN1 through stable cation", "E2 only", "radical"], a: 1, e: "3° + weak nucleophile water = textbook SN1 racemisation.", after: 1 },
{ q: "Bulky base tert-butoxide with 2-bromobutane gives predominantly…", o: ["Zaitsev 2-butene", "Hofmann 1-butene", "substitution", "no reaction"], a: 1, e: "Steric hindrance steers abstraction to less crowded β-H.", after: 2 },
],
fl: [
["SN2 stereochemistry", "inversion (Walden)"],
["Polar aprotic solvents favour", "SN2"],
["Sandmeyer reagents", "CuX on diazonium salts"],
],
},

"C-alcohol": {
mins: 22,
secs: [
{ t: "Preparation routes", h: `
<ul>
<li><b>Hydration of alkenes</b>: acid (Markovnikov), oxymercuration (no rearrange!), hydroboration-oxidation (anti-Markovnikov, syn).</li>
<li><b>Grignard + carbonyl</b>: formaldehyde→1° alcohol (+1C), other aldehydes→2°, ketones→3° — the construction kit.</li>
<li><b>Reduction</b>: aldehydes/ketones/acids/esters → alcohols (LiAlH₄ full, NaBH₄ mild selective for CHO/ketone).</li>
<li><b>Fermentation</b>: glucose --zymase--> ethanol + CO₂ (~95% cap by yeast death; rectified spirit 95.6%; absolute via azeotrope-breaking).</li>
</ul>` },
{ t: "Reactions: substitution and elimination", h: `
<p>OH⁻ is a terrible leaving group — protonation or conversion activates it:</p>
<div class="tblw"><table class="tbl">
<tr><th>To convert R–OH to</th><th>Reagent</th><th>Note</th></tr>
<tr><td>R–Cl</td><td>SOCl₂ (or PCl₅, HCl/ZnCl₂)</td><td>Lucas reagent distinguishes 1°/2°/3° by turbidity speed (3° instant)</td></tr>
<tr><td>R–Br</td><td>PBr₃ or HBr</td><td>inversion with PBr₃</td></tr>
<tr><td>alkene</td><td>conc. H₂SO₄, heat</td><td>Zaitsev; 3° easiest (cation route)</td></tr>
</table></div>
<p>Dehydration ease: 3° > 2° > 1° mirrors cation stability. Oxidation ladder: 1° alcohol → aldehyde → acid (K₂Cr₂O₇/H⁺); stop at aldehyde with PCC; 3° resists (no α-H on carbinol carbon!). Iodoform test spots CH₃CH(OH)– units.</p>
<div class="ex"><div class="ext">Worked example — distinguish three alcohols</div>
<div class="exq">Butan-1-ol, butan-2-ol, tert-butanol — one test?</div>
<ol class="steps">
<li>Lucas (conc HCl/ZnCl₂) at RT.</li>
<li>Turbidity: immediate = tert; minutes = sec; none until heated = primary.</li>
</ol>
<div class="exa">Carbocation-based kinetics separate all three.</div></div>` },
{ t: "Phenols: acidity and ring activation", h: `
<p>Phenol pKa ≈ 10 (ethanol 16!) — the phenoxide anion delocalises charge into the ring. Electron-withdrawing groups (NO₂) boost acidity hugely (picric acid ≈ strong mineral acids); EDGs weaken it. Phenol's OH donates by +R: ortho/para director, activates EAS so bromination gives 2,4,6-tribromophenol instantly even without catalyst.</p>
<p>Distinctive tests: FeCl₃ violet complex; Reimer-Tiemann (CHO ortho via :CCl₂); Kolbe-Schmitt (salicylic acid → aspirin precursor); coupling with diazonium (azo dyes). Phenol doesn't react with NaHCO₃ while COOH does — the separation trick.</p>
<div class="trap"><b>Trap.</b> Phenols do NOT esterify directly with RCOOH easily (need acid chloride/anhydride) and resist oxidation differently (quinone formation).</div>` },
{ t: "Ethers: the quiet connectors", h: `
<p>R–O–R′: chemically inert sweethearts — excellent solvents (THF, diethyl ether for Grignard). Williamson synthesis builds them: RX + R′ONa (use primary halides only; aryl halides fail, so make diphenyl ether via sodium phenoxide + activated aryl halide or Ullmann). Cleavage by excess HI: smaller group takes the iodine; with excess heat, phenol survives as phenol + RI. Ether peroxides form on air exposure — distillation hazard, FeSO₄ test.</p>` },
],
cps: [
{ q: "Which converts 1° alcohols to aldehydes without over-oxidation?", o: ["K₂Cr₂O₇/H⁺", "PCC", "KMnO₄", "NaBH₄"], a: 1, e: "PCC stops cleanly at aldehyde stage.", after: 1 },
{ q: "Anti-Markovnikov hydration uses…", o: ["H₂SO₄", "oxymercuration", "hydroboration-oxidation", "Grignard"], a: 2, e: "BH₃ adds anti-Markovnikov/syn; H₂O₂/NaOH replaces B with OH.", after: 0 },
{ q: "Williamson synthesis fails when using…", o: ["primary RX", "tertiary RX", "methyl iodide", "phenoxide + primary RX"], a: 1, e: "3° halides eliminate instead of substituting.", after: 3 },
],
fl: [
["Lucas test order", "3° instant, 2° slow, 1° heat needed"],
["Dehydration ease", "3° > 2° > 1°"],
["Phenol acidity source", "phenoxide resonance"],
["Ether cleavage with HI", "smaller alkyl gets I"],
],
},

"C-carbonyl": {
mins: 26,
secs: [
{ t: "The carbonyl group: polarity rules everything", h: `
<p>C=O polarises (O pulls electrons), making carbon electrophilic — every carbonyl reaction starts with Nu⁻ attacking that carbon. Aldehydes are MORE reactive than ketones: steric openness + weaker +I donation. Formaldehyde tops reactivity. Aromatic aldehydes lag (conjugation stabilises).</p>
<div class="fml"><span class="fx">reactivity: HCHO > RCHO > ArCHO > RCOR′ > ArCOAr</span><span class="fd">sterics + electronics combined</span></div>` },
{ t: "Preparations", h: `
<ul>
<li>Ozonolysis of alkenes (with Zn dust reductive workup).</li>
<li>Oxidation: PCC on 1° alcohols → aldehydes; strong oxidants overshoot to acids.</li>
<li>Acid chloride + Pd/BaSO₄ (Rosenmund) → aldehyde.</li>
<li>Nitrile + SnCl₂/HCl (Stephen) or DIBAL-H → aldehyde; Grignard + HCN then hydrolysis → aldehyde homologue? (actually gives ketone from nitrile + RMgX).</li>
<li>Benzaldehyde specifics: Etard (toluene + CrO₂Cl₂), Gattermann-Koch (CO + HCl/AlCl₃-CuCl).</li>
</ul>` },
{ t: "Nucleophilic addition gallery", h: `
<div class="tblw"><table class="tbl">
<tr><th>Nucleophile</th><th>Product</th><th>Test value</th></tr>
<tr><td>HCN</td><td>cyanohydrin</td><td>chain extension</td></tr>
<tr><td>NaHSO₃</td><td>bisulphite adduct crystals</td><td>purification/separation</td></tr>
<tr><td>RMgX</td><td>alcohol (after H₃O⁺)</td><td>C–C construction</td></tr>
<tr><td>alcohol + H⁺</td><td>hemiacetal → acetal</td><td>protecting groups</td></tr>
<tr><td>NH₂OH</td><td>oxime</td><td>characterisation mp</td></tr>
<tr><td>hydrazine/2,4-DNP</td><td>hydrazone/orange ppt</td><td>THE carbonyl test</td></tr>
</table></div>
<p>All are reversible EXCEPT hydrazine-family condensations essentially complete — equilibrium driven by water removal (acetal formation likewise).</p>` },
{ t: "The famous named tests", h: `
<ul>
<li><b>Tollens</b> (ammoniacal AgNO₃): silver mirror — ALDEHYDES only among common cases (α-hydroxy ketones too).</li>
<li><b>Fehling</b> (Cu²⁺ tartrate): brick-red Cu₂O — aliphatic aldehydes; aromatic aldehydes negative!</li>
<li><b>Iodoform</b> (I₂/NaOH): yellow CHI₃ — methyl ketones COCH₃ AND CH₃CH(OH)– oxidisable units.</li>
<li><b>Cannizzaro</b>: no α-H + conc base → disproportionate (benzaldehyde → benzyl alcohol + benzoate).</li>
<li><b>Aldol</b>: α-H + dilute base → β-hydroxycarbonyl (then crotonisation on heating).</li>
</ul>
<div class="trap"><b>Trap.</b> Benzaldehyde: positive Tollens, NEGATIVE Fehling, does aldol? NO — lacks α-H so gives Cannizzaro instead. Three-way discrimination is a guaranteed exam point.</div>` },
{ t: "Carboxylic acids: acidity ladder", h: `
<p>Resonance-stabilised carboxylate makes acids far stronger than alcohols/phenols. Substituents tune pKa: EWG (Cl, NO₂) strengthen; EDG weaken. Dichloroacetic > chloroacetic > acetic. Benzoic acid (pKa 4.2) beats acetic (4.76) despite conjugation myths — the phenyl's −I wins.</p>
<p>Reactions: reduction (LiAlH₄) to 1° alcohol; Hell-Volhard-Zelinsky α-halogenation; decarboxylation (soda lime) losing CO₂; esterification Fischer (acid-catalysed, reversible — remove water to drive); acid chlorides via SOCl₂ gate the whole derivative family (amide, anhydride, ester reactivity order: acyl chloride > anhydride > ester > amide).</p>
<div class="ex"><div class="ext">Worked example — separating mixture</div>
<div class="exq">Separate benzoic acid + phenol + toluene.</div>
<ol class="steps">
<li>NaHCO₃ extracts ONLY benzoic acid (CO₂ fizz); re-acidify.</li>
<li>NaOH extracts phenol (phenoxide); re-acidify.</li>
<li>Toluene remains organic.</li>
</ol>
<div class="exa">pKa differences turned into a clean three-way split.</div></div>` },
],
cps: [
{ q: "Which compound gives BOTH Tollens and iodoform positive?", o: ["acetaldehyde", "acetone", "benzaldehyde", "ethanol"], a: 0, e: "CH₃CHO: aldehyde (mirror) + CH₃CO– skeleton (iodoform). Acetone fails Tollens.", after: 2 },
{ q: "Most reactive toward nucleophilic addition:", o: ["acetone", "benzophenone", "formaldehyde", "benzaldehyde"], a: 2, e: "Least hindered, least donated.", after: 0 },
{ q: "Cannizzaro reaction requires…", o: ["α-hydrogen", "no α-hydrogen + strong base", "acid catalyst", "peroxide"], a: 1, e: "Disproportionation of non-enolisable aldehydes.", after: 2 },
],
fl: [
["2,4-DNP detects", "any aldehyde/ketone (orange ppt)"],
["Fehling negative for", "aromatic aldehydes"],
["HVZ reaction halogenates", "the α-position of acids"],
["Ester hydrolysis reverse", "saponification (base, irreversible)"],
],
},

"C-amines": {
mins: 22,
secs: [
{ t: "Amines: basicity rankings", h: `
<p>Nitrogen lone pair grabs protons. Gas-phase basicity: 3° > 2° > 1° (induction). Water complicates: solvation penalises bulk, so aqueous order becomes 2° > 1° > 3° > NH₃ (for aliphatic). Aniline drops below ammonia (lone pair delocalised into ring); EWG ring substituents weaken further; para-NO₂ aniline weakest of the common set.</p>
<div class="fml"><span class="fx">aqueous basicity: (C₂H₅)₂NH > C₂H₅NH₂ > (C₂H₅)₃N > NH₃ > C₆H₅NH₂</span><span class="fd">induction vs solvation tug-of-war</span></div>` },
{ t: "Preparation toolkit", h: `
<ul>
<li><b>Ammonolysis</b> of RX (NH₃ excess avoids quaternary salt mess).</li>
<li><b>Reduction</b> of nitro compounds (H₂/Pd, Sn/HCl) or nitriles/isocyanides.</li>
<li><b>Gabriel phthalimide</b>: pure PRIMARY amines only (aryl-NH₂ impossible — SN2 blocked).</li>
<li><b>Hofmann bromamide</b>: RCONH₂ + Br₂/KOH → RNH₂ (ONE carbon fewer! amide migration).</li>
<li><b>Diazotisation</b>: aryl amines + NaNO₂/HCl at 0–5 °C → diazonium salts, the gateway to the whole benzene family (Sandmeyer X/SCN, phenol via warm water, iodo directly KI, azo dyes via coupling, deamination H₃PO₂).</li>
</ul>
<div class="trap"><b>Trap.</b> Aliphatic diazonium salts explode/decompose instantly (give alcohols); only ARYL ones survive cold solution — that's why the dye industry is aromatic.</div>` },
{ t: "Tests distinguishing 1°/2°/3°", h: `
<ul>
<li><b>Hinsberg</b> (benzenesulphonyl chloride): 1° gives precipitate dissolving in KOH; 2° gives insoluble product; 3° untouched (no N–H).</li>
<li><b>Nitrous acid</b>: 1° aliphatic → N₂ bubbles (quantitative Van Slyke); 1° aryl → diazonium (coupling test); 2° → yellow oily nitrosamine; 3° → soluble nitrite salt.</li>
<li><b>Carbylamine</b>: 1° only + CHCl₃/KOH → foul isocyanide smell (diagnostic, avoid inhaling!).</li>
</ul>` },
{ t: "Diazonium chemistry: the synthetic highway", h: `
<div class="tblw"><table class="tbl">
<tr><th>Target</th><th>Route from ArN₂⁺</th></tr>
<tr><td>ArCl/ArBr</td><td>+CuCl/CuBr (Sandmeyer)</td></tr>
<tr><td>ArI</td><td>+KI directly</td></tr>
<tr><td>ArCN</td><td>+CuCN/KCN</td></tr>
<tr><td>ArOH</td><td>warm water (300 K)</td></tr>
<tr><td>ArH</td><td>+H₃PO₂ (reductive deamination)</td></tr>
<tr><td>azo dye</td><td>+activated ring (phenol/aniline) alkaline</td></tr>
</table></div>
<p>Methyl orange and orange-red p-hydroxyazobenzene come from coupling — electrophilic azo⁺ attacking the activated ring para/ortho.</p>` },
{ t: "Cyanides vs isocyanides", h: `
<p>KCN attacks through carbon (RCN main product); AgCN through nitrogen (RNC). Isocyanides smell vile, hydrolyse to amines + formic acid, reduce to secondary methylamines — the N-end attachment changes everything downstream. Nitro compounds: tautomeric forms (aci-nitro), reductions staged (nitroso → hydroxylamine → amine) in neutral medium.</p>` },
],
cps: [
{ q: "Hofmann bromamide degradation shortens the chain by…", o: ["zero carbons", "one carbon", "two carbons", "half"], a: 1, e: "Carbonyl carbon leaves as carbonate; amine keeps R minus the C=O.", after: 1 },
{ q: "Gabriel synthesis cannot prepare…", o: ["ethylamine", "propylamine", "aniline", "benzylamine"], a: 2, e: "Aryl halides refuse SN2 with phthalimide anion.", after: 1 },
{ q: "Yellow oily product with nitrous acid indicates…", o: ["primary amine", "secondary amine", "tertiary amine", "amide"], a: 1, e: "N-nitrosamine formation.", after: 2 },
],
fl: [
["Basic aqueous order (Et)", "(Et)₂NH > EtNH₂ > (Et)₃N > NH₃"],
["Carbylamine test scope", "primary amines only"],
["Diazotisation temperature", "0–5 °C"],
],
},

"C-bio": {
mins: 20,
secs: [
{ t: "Carbohydrates: energy architecture", h: `
<p>Polyhydroxy aldehydes/ketones. Monosaccharides (glucose, fructose — cannot hydrolyse further), disaccharides (sucrose = glucose+fructose non-reducing since BOTH anomeric carbons bonded; maltose/lactose reducing), polysaccharides (starch α-linkage digestible; cellulose β-linkage not — cows manage via symbionts).</p>
<ul>
<li>Glucose tests: Tollens/Fehling positive (open-chain fraction), Br₂ water decolourised (aldose vs fructose negative), pentaacetate confirms cyclic hemiacetal majority.</li>
<li>Glycosidic bonds join units; hydrolysis reverses them.</li>
<li>D/L refers to configuration vs glyceraldehyde, NOT rotation sign (+/− measured separately!).</li>
</ul>
<div class="trap"><b>Trap.</b> D-glucose is dextrorotatory but D ≠ dextro generally — D-fructose levorotates. Two independent labels.</div>` },
{ t: "Proteins: twenty letters, infinite sentences", h: `
<p>Amino acids (NH₂-CH(R)-COOH) link via peptide (amide) bonds losing water. Essential ones can't be biosynthesised (lysine, tryptophan…) — diet supplies. Structure hierarchy:</p>
<div class="tblw"><table class="tbl">
<tr><th>Level</th><th>Held by</th><th>Example feature</th></tr>
<tr><td>Primary</td><td>covalent sequence</td><td>mutation changes here propagate</td></tr>
<tr><td>Secondary</td><td>H-bonds backbone</td><td>α-helix, β-sheet</td></tr>
<tr><td>Tertiary</td><td>full 3D fold forces</td><td>active site geometry</td></tr>
<tr><td>Quaternary</td><td>subunit assembly</td><td>haemoglobin α₂β₂</td></tr>
</table></div>
<p>Zwitterions dominate at isoelectric point (net charge zero, min solubility — electrophoresis basis). Denaturation (heat/pH) kills 2°+ structure leaving sequence intact — boiled egg logic. Enzymes: globular biocatalysts, lock-and-key/induced-fit specificity, turnover numbers astronomic.</p>` },
{ t: "Vitamins, nucleic acids and hormones", h: `
<p>Vitamins: fat-soluble A,D,E,K (store, overdose possible) vs water-soluble B,C (excrete, daily need). Deficiency map: A night-blindness, B1 beriberi, C scurvy, D rickets, K clotting failure.</p>
<p>Nucleic acids: nucleotide = base + sugar (ribose/deoxyribose) + phosphate. DNA bases A,T,G,C with Watson-Crick pairing (A=T two H-bonds; G≡C three) storing heredity antiparallel double helix; RNA single-stranded, uracil swaps for thymine, ribose extra OH makes it fragile/multifunctional. Central dogma: DNA → RNA → protein. Hormones: chemical messengers (adrenaline fight-flight, insulin glucose uptake, thyroxine metabolic rate — iodine!).</p>
<div class="tipbox"><b>Tip.</b> Biomolecules chapters reward table-learning: deficiency diseases, linkage types, base-pair counts (A=T, G=C ⇒ %A=%T etc.), essential amino acid list. Pure recall marks in JEE Main.</div>` },
],
cps: [
{ q: "Sucrose is non-reducing because…", o: ["it lacks glucose", "both glycosidic carbons engaged", "fructose reduces nothing", "too large"], a: 1, e: "No free anomeric OH remains to open into aldehyde form.", after: 0 },
{ q: "Protein secondary structure is stabilised mainly by…", o: ["disulphide bonds", "backbone hydrogen bonds", "ionic bridges", "van der Waals"], a: 1, e: "α-helix/β-sheet run on regular N–H···O=C H-bonding.", after: 1 },
{ q: "In DNA, if adenine is 30%, guanine is…", o: ["20%", "30%", "70%", "40%"], a: 0, e: "A=T=30% ⇒ total 60%; remaining 40% split G=C ⇒ 20% each.", after: 2 },
],
fl: [
["Starch vs cellulose linkage", "α vs β-glycosidic"],
["Isoelectric point property", "zero net charge, minimal solubility"],
["Watson-Crick pairs", "A=T (2 H-bonds), G≡C (3)"],
["Fat-soluble vitamins", "A, D, E, K"],
],
},
};