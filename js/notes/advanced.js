/* Full Notes — Advanced tier (Level 4, JEE Advanced depth).
   Covers all 15 advanced/concept chapters: the 7 A-* Advanced chapters,
   C-metallurgy, and the 7 A-chapters (organic through combinatorics).
   Each sec entry keeps h: template literal closed on the same line to avoid JS parse errors. */

export const ADVANCED_NOTES = {

"A-mech": {
  mins: 28,
  secs: [
    { t: "Centre of mass for continuous bodies", h: `<p>CM via integrals r_cm = (1/M)∫ρ r dV. Variable density multiplies integrand by radial factor. Hole trick: subtract hole as negative mass: CM = (Σmᵢrᵢ − m_hole r_hole)/(Σmᵢ − m_hole).</p>` },
    { t: "Collisions & restitution", h: `<p>Coefficient of restitution e applies only along line of impact normal; tangential unchanged. Angular momentum conserved about fixed axis. <div class="trap">Trap: apply restitution only to normal component, not full velocity vector.</div></p>` },
    { t: "Variable mass, gyroscopes", h: `<p>Rocket Δv = v_rel ln(m₀/m); thrust F = v_rel·dm/dt. Gyroscope precession Ω = τ/L; larger spin (L) → slower precession. Tennis-racket: intermediate axis rotation unstable.</p>` },
  ],
  cps: [
    { q: "Elastic 1-D collision relative velocity…", o: ["reverses sign","stays same","halves","depends on masses"], a: 0, e: "v₂'−v₁' = −(v₂−v₁).", after: 1 },
    { q: "Gyroscope precession Ω=τ/L → faster precession with…", o: ["more spin","smaller L","weaker spin","stronger support"], a: 1, e: "Smaller L → faster precession.", after: 1 },
  ],
  fl: [["CM hole trick","subtract hole as negative mass"],["Gyroscope precession","Ω = τ/L"]],
},

"A-thermo": {
  mins: 26,
  secs: [
    { t: "Thermodynamic potentials & Maxwell relations", h: `<p>Natural: U(S,V), H(S,p), F(T,V), G(T,p); dG = −SdT + Vdp selects equilibrium. Maxwell: (∂S/∂V)_T = (∂P/∂T)_V. Joule-Thomson μ = (∂T/∂P)_H; inversion temp separates cooling/heating. <div class="trap">Trap: efficiency needs absolute kelvin.</div></p>` },
    { t: "Kinetic theory & transport", h: `<p>Peak v_p=√(2kT/m), mean 〈v〉=√(8kT/πm), rms √(3kT/m). Mean free path λ=1/(√2 πσ²n); η=⅓ρ〈v〉λ ∝ √T. Diffusion D=⅓〈v〉λ.</p>` },
    { t: "Phase equilibrium & Clausius-Clapeyron", h: `<p>dP/dT = L/(TΔV); ln(P₂/P₁)=−(L/R)(1/T₂−1/T₁). Critical temp merges phases; Ehrenfest: first-order has latent heat.</p>` },
  ],
  cps: [
    { q: "Clausius-Clapeyron assumes…", o: ["ideal gas vapor","constant latent heat","both","liquid incompressibility"], a: 2, e: "Both ΔV≈V_gas and L constant over range.", after: 1 },
    { q: "Debye low-T C_V varies as…", o: ["T","T²","T³","constant"], a: 2, e: "C_V ∝ T³ from acoustic phonon spectrum.", after: 0 },
  ],
  fl: [["Joule-Thomson μ","(∂T/∂P)_H"],["Debye law","C_V ∝ T³"],["Maxwell (T,V↔p,S)","(∂T/∂V)_S=−(∂p/∂S)_V"]],
},

"A-fluids": {
  mins: 24,
  secs: [
    { t: "Kinematics of fluids & complex potential", h: `<p>W=φ+iψ; streamlines ψ=const, equipotentials φ=const. Continuity ∇·v=0; irrotational → ∇²φ=0. Bernoulli p+½ρv²+ρgz=const along streamlines.</p>` },
    { t: "Viscous flow: Poiseuille, Couette", h: `<p>Plane Poiseuille u(y)=G/2μ(h²−y²), mean Gh²/3μ. Reynolds Re=ρvL/μ; pipe laminar<2000. BL δ≈5√(νx/U). <div class="trap">d'Alembert's paradox: ideal fluids give zero drag — add viscosity.</div></p>` },
    { t: "Turbulence & drag", h: `<p>Turbulence onset Re≈4000. Drag C_D vs Re sphere: 0.5→0.2 (crisis at Re≈3×10⁵). Surface roughness shifts critical Re. Sphere crisis drops wake drag.</p>` },
  ],
  cps: [
    { q: "Boundary layer separation driven by…", o: ["favourable gradient","adverse gradient","zero gradient","curvature alone"], a: 1, e: "Adverse (decelerating) pressure gradient reverses near-wall flow.", after: 0 },
    { q: "Mean plane Poiseuille velocity is fraction of centre:", o: ["1/2","2/3","3/4","1"], a: 1, e: "Integrate parabola; mean=2/3 of centre.", after: 1 },
  ],
  fl: [["Reynolds number","ρvL/μ"],["Plane Poiseuille mean","Gh²/3μ"],["Boundary layer scale","√(νx/U)"]],
},

"A-optics": {
  mins: 28,
  secs: [
    { t: "Coherence & interference engineering", h: `<p>Coherence length L_c=λ²/Δλ; white light short. Spatial coherence area ~λz/L limits pinholes. Thin films: 2nt cosθ + (λ/2 if one reflection) — soap colours, AR coatings. <div class="trap">Fringe width β=λD/d SHRINKS underwater (λ/n).</div></p>` },
    { t: "Diffraction & Bragg", h: `<p>Single slit min a sinθ=mλ. Grating: d sinθ=mλ, resolving power R=mN, dispersion dθ/dλ=m/(d cosθ). Bragg nλ=2d sinθ links X-rays to crystal planes.</p>` },
    { t: "Polarisation & instruments", h: `<p>Brewster tanθ_B=n; Malus I=I₀cos²θ. Microscope M=(L/f_o)(D/f_e); telescope M=f_o/f_e. Aberrations: spherical/coma/astigmatism/chromatic — stop down or achromatise. NA=n sinθ sets d_min=λ/(2NA).</p>` },
  ],
  cps: [
    { q: "Fringe spacing underwater SHRINKS because…", o: ["λ shrinks","D shrinks","d shrinks","f shrinks"], a: 0, e: "β∝λ_medium = λ/n.", after: 0 },
    { q: "Resolving power R of grating =", o: ["λ/Δλ","m/N","mN","N/m"], a: 2, e: "R = mN (order×slits).", after: 1 },
  ],
  fl: [["AR coating refractive index","√n_glass"],["Bragg law","nλ=2d sinθ"],["Aperture stop","stops down→less aberration"]],
},

"A-em": {
  mins: 28,
  secs: [
    { t: "Maxwell's equations & EM waves", h: `<p>∇·E=ρ/ε₀, ∇·B=0, ∇×E=−∂B/∂t, ∇×B=μ₀J+μ₀ε₀∂E/∂t. Wave speed c=1/√(μ₀ε₀); E⊥B⊥k. Displacement current fixes charging. <div class="trap">H is A/m (surface-current-like), not Tesla; B is Tesla.</div></p>` },
    { t: "Energy, polarization, materials", h: `<p>u_E=½ε₀E², u_B=B²/2μ₀ (equal in wave). P=χ_eε₀E, κ=1+χ_e. Bound σ_b=P·n̂. Paramagnetic χ∝1/T; ferromagnetic domains below Tc; hysteresis loses energy in transformers — laminate cores.</p>` },
    { t: "AC circuits, resonance", h: `<p>Z=R+i(X_L−X_C); |Z|=√(R²+ΔX²), tanφ=ΔX/R. Resonance X_L=X_C: Z_min=R, V_L=V_C>>V_source (Q amplification). Bandwidth Δω=ω₀/Q. <div class="ex"><div class="ext">Q example</div><div class="exq">R=10Ω, L=1mH, C, ω₀=10⁶. Q?</div><ol class="steps"><li>C=1/(ω₀²L)=1nF.</li><li>Q=ω₀L/R=100.</li></ol><div class="exa">Q=100 sharp bandpass.</div></div></p>` },
  ],
  cps: [
    { q: "Displacement current enforces…", o: ["charge conservation","magnetic monopoles","energy flow","closed field lines"], a: 0, e: "∇·(∇×B)=μ₀∇·J+μ₀ε₀∂(∇·E)/∂t ⟹ continuity ∂ρ/∂t+∇·J=0.", after: 0 },
    { q: "In EM wave energy density E vs B:", o: ["E dominates","B dominates","equal","c² ratio"], a: 2, e: "u_E=u_B since B=E/c.", after: 2 },
  ],
  fl: [["Ampère-Maxwell correction","ε₀∂E/∂t"],["Wave relation","E=cB"],["RLC damping","α² vs ω₀²"]],
},

"A-circuits": {
  mins: 26,
  secs: [
    { t: "Network theorems & transforms", h: `<p>Thevenin V_th+R_th. Norton I_N||R_th. R_th=V_th/I_N. Superposition: one source active at a time, others killed. Mutual inductance: dotted terminal polarity; v=M di/dt. Dot convention.</p>` },
    { t: "AC power & resonance", h: `<p>S=VI*; P=VIcosφ; Q=VIsinφ. PF correction: shunt C supplies leading VARs. Series resonance sharp, parallel peaks impedance. Loaded Q degrades cascaded. <div class="trap">Without bleeder resistor, op-amp integrator cap charges to rail.</div></p>` },
    { t: "Op-amps & stability", h: `<p>Slew rate limits dV/dt; GBP constant. Miller C_in = C(1−A) huge at high gain. Compensation: dominant-pole stabilises, ensures phase margin >45°. Integrator needs bleeder R across C.</p>` },
  ],
  cps: [
    { q: "Max power transfer R_load =", o: ["R_th","V_th","2R_th","0"], a: 0, e: "R_load = R_th; efficiency only 50%.", after: 0 },
    { q: "CMOS static power ideally…", o: ["CV²f","zero static","I_b²R","always zero"], a: 1, e: "Switching only; static ideally nil.", after: 1 },
  ],
  fl: [["Thevenin/Norton duality","V_th/R_th ↔ I_N·R_th"],["Miller C","C(1−A_v)"],["Barkhausen","|T|=1, angle 0°"]],
},

"A-modern": {
  mins: 26,
  secs: [
    { t: "Decay chains & dating", h: `<p>Secular equilibrium λ_A N_A=λ_B N_B (long-lived parent). Age=(1/λ)ln(1+D/P). α=He⁴, β⁻=e⁻+´, β⁺/EC, γ=de-excitation. <div class="trap">Ni-62 technically highest binding; Fe-56 lowest mass-per-nucleon.</div></p>` },
    { t: "Nuclear models & binding", h: `<p>Weizsäcker B=a_V A−a_S A^{2/3}−a_C Z²/A^{1/3}−a_A(N−Z)²/A±a_P A^{−3/4}. Magic numbers 2,8,20,28,50,82,126. Fusion+ fission release energy toward Fe/Ni peak.</p>` },
    { t: "Standard Model & particles", h: `<p>Quarks (udcsbt) confined; leptons (e,μ,τ,ν). Gauge bosons (γ,W,Z,gluon,Higgs). Higgs vev~246GeV. CP violation in kaon/B systems. B and L conserved separately; S/C/B approximate.</p>` },
  ],
  cps: [
    { q: "Carbon dating works because C-14 half-life ~5730 y.", o: ["short enough","long enough for civilized times","no C-exchange","no cosmic rays"], a: 1, e: "Spans useful archaeological range.", after: 0 },
    { q: "Both fusion and fission release energy because…", o: ["both exothermic","products near iron binding peak","mass differs","neutrons emitted"], a: 1, e: "Both climb toward Fe/Ni binding max.", after: 1 },
  ],
  fl: [["Liquid-drop coeffs","volume>surface>Coulomb>asymmetry>pairing"],["Higgs vev","~246 GeV"],["CP violation","kaon/B-meson decays"]],
},

"C-metallurgy": {
  mins: 20,
  secs: [
    { t: "Extraction & reactivity series", h: `<p>Metals below H (Na→Fe): need carbon/electrolysis. Above H (Cu,Ag,Au): direct. Very reactive (Na–Al): molten-salt electrolysis. <table class="tbl"><tr><th>Metal</th><th>Route</th></tr><tr><td>Na,K,Al</td><td>molten salt electrolysis</td></tr><tr><td>Fe,Zn,Pb</td><td>carbon reduction furnace</td></tr><tr><td>Cu,Ag</td><td>direct heating/oxidation</td></tr></table></p>` },
    { t: "Iron & steelmaking", h: `<p>Blast furnace: coke burns, CO₂→CO shift, CO reduces Fe₂O₃→Fe (~2000°C). Pig iron Si/Mn/P/C → brittle. Bessemer: O₂ oxidises Si/Mn first (slag), then C. LD+vacuum for precision. <div class="trap">Pig iron ≠ steel: Si,Mn,P impurities make brittle.</div></p>` },
    { t: "Aluminium: Hall-Héroult", h: `<p>Bayer: Al₂O₃ from bauxite via NaOH. Dissolve in molten cryolite Na₃AlF₆ (drops T_m 2070→950°C). Voltage 4–5V; carbon anode consumed: C+½O₂→CO/CO₂. Energy intense ~15MJ/kg. <div class="tipbox">Anode effect: gas blanket, voltage spike, perfluorocarbon emissions.</div></p>` },
    { t: "Copper refining & environment", h: `<p>Blister Cu→fire refine→electrolytic: impure anode, pure cathode, anode slimes drop Ag/Au/Pt. Ti/Zr use Kroll (Mg reduction, vacuum) due passivation. Env cost: red mud alkaline tailings, 2t CO₂/t steel, acid mine drainage. H₂-DRI steel, EA-furn scrap, SXEW Cu, bioleaching.</p>` },
  ],
  cps: [
    { q: "Most reactive metals extracted by…", o: ["carbon","molten salt electrolysis","direct heating","CO"], a: 1, e: "Aluminium/sodium need electrolysis.", after: 1 },
    { q: "Bessemer blows O₂ to oxidise…", o: ["excess Al","Si and Mn first","carbon only","phosphorus"], a: 1, e: "Silicon and manganese burn first (slag), then carbon.", after: 0 },
  ],
  fl: [["Al Hall-Héroult","molten Al₂O₃+cryolite"],["Iron extracted via","carbon reduction"],["Pig vs steel","Si,Mn,P impurities brittle"]],
},

"A-org": {
  mins: 28,
  secs: [
    { t: "Aromatic stability & electrophilic substitution", h: `<p>4n+2 π cyclic conjugated planar = aromatic. Substitution dominates (not addition). Activating groups (NH₂,OH,OR,alkyl) → ortho/para directing, accelerate; deactivating (NO₂,CN,COOR) meta, slow. Halogens deactivating yet o/p (resonance beats induction). <div class="trap">Halogen deactivating but o/p-directing — exception to deactivating=meta.</div></p>` },
    { t: "EAS mechanisms & directing", h: `<p>Rate-limiting electrophile generation (NO₂⁺ from HNO₃/H₂SO₄, acylium from RC(O)Cl/AlCl₃). Wheland σ-complex. Nitration: toluene ~10⁵× benzene. Friedel-Crafts alkyl rearrangement (carbocation shifts); acylation no rearrangement (acylium). <div class="trap">NO₂ meta always, even on activated rings.</div></p>` },
    { t: "SNAr & benzyne", h: `<p>SNAr needs LG (Cl) + strong EWG ortho/para → Meisenheimer complex. Unactivated aryl chlorides → benzyne (NaNH₂ eliminates HX → triple bond → re-add). Sandmeyer diazonium route for halides.</p>` },
    { t: "Diels-Alder & cycloadditions", h: `<p>[4+2] diene(s-cis)+dienophile → 6-membered TS, stereospecific, endo-selective. Electron-rich diene + electron-poor dienophile. 4n+2 thermal allowed (suprafacial); 4n photochemical. Retro-DA at 200–300°C.</p>` },
  ],
  cps: [
    { q: "NO₂ on benzene directs further substituents to…", o: ["ortho/para","meta","random","para only"], a: 1, e: "Strong EWG; meta director.", after: 0 },
    { q: "Friedel-Crafts acylation avoids…", o: ["rearrangement","deprotonation","polymerisation","nitration"], a: 0, e: "Acylium ion can't rearrange like carbocation.", after: 1 },
  ],
  fl: [["Aromaticity","4n+2 π cyclic conjugated planar"],["NH₂ directs","ortho/para, activating"],["SNAr requirement","EWG+LG"],["DA endo rule","substituents inside TS"]],
},

"A-physchem": {
  mins: 26,
  secs: [
    { t: "Equilibrium & chemical thermodynamics", h: `<p>Q vs K drives direction. Nernst E = E°−(RT/nF)lnQ links to ΔG=−nFE. Activity a_i=γ_i(C_i/C°); Debye-Hückel log γ_i=−0.51z_i²√I. Gibbs phase rule F=C−P+2. <div class="ex"><div class="ext">Nernst</div><div class="exq">Cu²⁺/Cu 0.01M vs 1M at 25°C, E°=0.34V.</div><ol class="steps"><li>E=0.34−(0.0592/2)log(0.01)=0.399V.</li></ol></div></p>` },
    { t: "Kinetics: mechanisms & rates", h: `<p>Overall order experimental; elementary = stoichiometric coeff. Chain reactions: init→propagate→terminate; photochemistry huge quantum yields. RDS governs. Pre-equilibrium: substitute K=[I]/[reactants]. Lindemann-Hinshelwood fall-off.</p>` },
    { t: "Colloids & surface chemistry", h: `<p>EDL (Stern + diffuse), ζ potential. DLVO: van der Waals attraction vs EDL repulsion. CCC ∝ 1/z³ (Schulze-Hardy). Surfactants → micelle > CMC. Heterogeneous (Langmuir-Hinshelwood) vs homogeneous catalysis.</p>` },
    { t: "Coordination & p-block extremes", h: `<p>d-splitting Δ_oct<Δ_tet; strong-field ligands pair. CFSE=−0.4Δ·(#t2g)+0.6Δ·(#eg). Magic numbers, Jahn-Teller (Cu²⁺ axial). Hydrides NH₃ vs B₂H₆; allotropes O₂ paramagnetic, O₃ bent; oxides acidic/basic/amphoteric. Contact process 2SO₂+O₂⇌2SO₃ (V₂O₅).</p>` },
  ],
  cps: [
    { q: "Clausius-Clapeyron assumes…", o: ["ideal gas vapor","constant L","both","liquid incompressibility"], a: 2, e: "Both ΔV≈V_gas and L constant over range.", after: 1 },
    { q: "CCC ∝ 1/z³ because…", o: ["monovalent only","valence cubed","ionic strength","surface charge"], a: 1, e: "Schulze-Hardy: multivalent counterions more effective.", after: 0 },
  ],
  fl: [["Nernst equation","E=E°−(RT/nF)lnQ"],["CCC","∝ 1/z³"],["CFSE","−0.4Δ·n_t2g+0.6Δ·n_eg"]],
},

"A-inorg": {
  mins: 26,
  secs: [
    { t: "Crystal field & ligand field", h: `<p>Octahedral Δ_oct, tetrahedral Δ_tet (Δ_tet=4/9Δ_oct). Spectrochemical series: weak field (I⁻<Br⁻)→strong (CO, CN⁻). High vs low spin by pairing energy P vs Δ. Colors from d–d transitions; intensities from Laporte-forbidden (weak) vs vibronic. LFSE includes covalency via π-backbonding (CO, CN⁻).</p>` },
    { t: "p-Block hydrides & allotropes", h: `<p>Hydrides: ionic (NaH), metallic (AlH₃ polymer), covalent (CH₄, NH₃). N₂ triple bond → Haber (Fe, 200atm, 450°C). O₂ triplet ground state paramagnetic → O₃ bent; peroxides/superoxides. Halogens: F₂ strongest oxidiser; interhalogens I₃⁻, BrF₃, ICl. Acidic oxides → oxyacids (H₂SO₄, HNO₃);</p>` },
    { t: "Transition metals & bioinorganic", h: `<p>Variable oxidation states; 3d,4s ordering. Ligand field stabilisation drives complex colour. EDTA hexadentate; porphyrins Fe in hemoglobin (O₂ binding), Fe/Cu in cytochromes, Zn in carbonic anhydrase. Industrial: catalytic cracking (zeolite), water-gas shift (Fe/Cr), Oxo-process (hydroformylation, Co/Rh).</p>` },
    { t: "Environmental & applications", h: `<p>Acid rain: SO₂/NOₓ → H₂SO₄/HNO₃; damage buildings, lakes. Fluorocarbons:CFCs UV-absorb → ozone depletion; Montreal Protocol phased out, HF replacement. Nitrogen cycle: N₂→NO (Haber) for fertilizers, eutrophication from run-off. Chelate therapy (EDTA/deferoxamine). Water treatment: coagulation, reverse osmosis.</p>` },
  ],
  cps: [
    { q: "Δ_tet compared to Δ_oct:", o: ["larger","smaller","equal","uncomparable"], a: 1, e: "Δ_tet = 4/9 Δ_oct.", after: 0 },
    { q: "Highest oxidation state usually in…", o: ["+3","+5","+7","variable"], a: 2, e: "Highest oxidation state matches group number — e.g., Mn can go +7 (KMnO₄).", after: 1 },
  ],
  fl: [["CFT splitting","Δ_oct > Δ_tet"],["Haber","N₂+3H₂⇌2NH₃, Fe catalyst"],["Oxo-process","hydroformylation, Co/Rh"]],
},

"A-calc": {
  mins: 22,
  secs: [
    { t: "Multivariable calculus", h: `<p>Partial derivatives ∂f/∂x; gradient ∇f points uphill. Chain rule for composite f(g(t)). Implicit differentiation. Tangent plane z−z₀=∇f·(x−x₀,y−y₀). Lagrange multipliers for constrained extrema: ∇f=λ∇g.</p>` },
    { t: "Multiple integrals & vector calculus", h: `<p>Double integral∬f dA = ∬f r dr dθ (polar). Triple V=∭r²sinφ dr dφ dθ (spherical). Jacobian ∂(x,y)/∂(u,v). Green's ∮Pdx+Qdy=∬(∂Q/∂x−∂P/∂y)dA. Stokes ∫∫(∇×F)·n dS = ∮F·dr. Divergence ∫∫∫∇·F dV=∮F·n dS.</p>` },
    { t: "ODE series & transforms", h: `<p>First-order linear dy/dx+P(x)y=Q(x): IF=e^{∫Pdx}. Homogeneous y''+py'+qy=0 via characteristic ar²+br+c=0. Cauchy-Euler x²y''+bxy'+cy=0: substitute x=e^t. Laplace ℒ{f'}=sℒ{f}−f(0); convolution theorem.</p>` },
  ],
  cps: [
    { q: "Gradient ∇f direction is…", o: ["level curve","steepest ascent","downhill","tangential"], a: 1, e: "∇f points in direction of steepest ascent.", after: 0 },
    { q: "Jacobian gives…", o: ["area scaling","volume scaling","rate of change","slope"], a: 0, e: "Jacobian determinant = area/volume scale factor under substitution.", after: 1 },
  ],
  fl: [["Gradient","∇f = ⟨∂f/∂x,∂f/∂y,∂f/∂z⟩"],["Stokes theorem","∫∫(∇×F)·n dS = ∮F·dr"],["Laplace transform","ℒ{f'}=sℒ{f}−f(0)"]],
},

"A-algebra": {
  mins: 22,
  secs: [
    { t: "Groups, rings & fields", h: `<p>Group (G,*) : closure, associativity, identity, inverse. Order = |G|. Subgroup H<G. Lagrange |H| divides |G|. Cyclic group generated by one element. Ring (R,+,×): additive abelian group + multiplication associativity + distributive. Field: commutative ring where nonzero elements form multiplicative group.</p>` },
    { t: "Galois theory & polynomials", h: `<p>Field extension E/F. Minimal polynomial of α: monic irreducible f ∈ F[x] with f(α)=0. Degree [E:F]. Splitting field of f: smallest field containing all roots. Automorphism permutes roots. Galois group Gal(E/F). Solvable by radicals ⟺ Galois group solvable. Quintic generic unsolvable (S₅ not solvable).</p>` },
    { t: "Linear algebra: vectors & matrices", h: `<p>Vector space V over F: addition + scalar mult axioms. Basis: linearly independent spanning set; dim V=cardinality. Matrix rank = dim column space. Eigenvalues Av=λv; char poly det(A−λI)=0. Diagonalizable if n distinct eigenvalues or geometric mult=alg mult. Symmetric→orthogonally diagonalizable.</p>` },
    { t: "Abstract vector spaces & operators", h: `<p>Linear transformation T:V→W linear. Kernel nullity, image rank; rank-nullity dim V=rank+nullity. Dual space V*=Hom(V,F). Inner product ⟨u,v⟩: symmetric positive-definite bilinear form. Self-adjoint T=T*; normal TT*=T*T; unitarily diagonalizable. Spectral theorem: real symmetric matrices have real eigenvalues and orthogonal eigenbasis.</p>` },
  ],
  cps: [
    { q: "Lagrange’s theorem: order of subgroup…", o: ["any",">group","divides group order","is prime"], a: 2, e: "|H| divides |G|.", after: 0 },
    { q: "A matrix with n distinct eigenvalues…", o: ["always singular","diagonalizable","no inverse","nilpotent"], a: 1, e: "n distinct eigenvalues → diagonalizable.", after: 1 },
  ],
  fl: [["Lagrange","|H||G|"],["Rank-nullity","dim V=rank+nullity"],["Spectral theorem","symmetric→real eig, orth basis"],["Galois solvable","⟺ solvable by radicals"]],
},

"A-geom": {
  mins: 24,
  secs: [
    { t: "Coordinate & analytic geometry", h: `<p>Distance d=√[(x₂−x₁)²+(y₂−y₁)²]. Section formula internal (mx₂+nx₁)/(m+n). Slope m=(y₂−y₁)/(x₂−x₁). Locus: equation satisfied by variable point. Straight line y=mx+c, ax+by+c=0; angle tanθ=(m₂−m₁)/(1+m₁m₂). Circle x²+y²+2gx+2fy+c=0, centre(−g,−f), r=√(g²+f²−c). Tangent at (x₁,y₁): T=0.</p>` },
    { t: "Conics & their properties", h: `<p>Parabola y²=4ax: focus (a,0), directrix x=−a. Ellipse x²/a²+y²/b²=1, b²=a²(1−e²), foci (±ae,0). Hyperbola x²/a²−y²/b²=1, b²=a²(e²−1), foci(±ae,0), asymptotes y=±(b/a)x. Director circle; latus rectum length. Parametric (a secθ, b tanθ for hyperbola).</p>` },
    { t: "3D geometry & vectors", h: `<p>3D distance √[(x₂−x₁)²+(y₂−y₁)²+(z₂−z₁)²]. Direction ratios (a,b,c), direction cosines cosα,cosβ,cosγ with l²+m²+n²=1. Plane ax+by+cz+d=0; line (x−x₁)/l=(y−y₁)/m=(z−z₁)/n. Angle between lines cosθ=(l₁l₂+m₁m₂+n₁n₂)/√Σl²√Σm². Shortest distance between skew lines; intercept form x/a+y/b+z/c=1.</p>` },
    { t: "Transformations & projective ideas", h: `<p>Translation by vector (h,k): x'=x+h,y'=y+k. Rotation about origin by θ: x'=x cosθ−y sinθ, y'=x sinθ+y cosθ. Reflection in line y=mx: matrix. Isometry preserves distances; orthogonal matrices det=±1. Homothety scaling; shear. Projective: duality point↔line, cross-ratio (AB,CD) invariant under projection. Conics as conic sections: ellipse (plane cuts one nappe, angle<cone), parabola (parallel to slant), hyperbola (cuts both nappes).</p>` },
  ],
  cps: [
    { q: "Angle between two lines cosθ =", o: ["m₁m₂","m₁+m₂","(m₂−m₁)/(1+m₁m₂)","l₁l₂+m₁m₂+n₁n₂"], a: 3, e: "cosθ=(l₁l₂+m₁m₂+n₁n₂)/(√Σl²√Σm²).", after: 0 },
    { q: "Parabola y²=4ax latus rectum length =", o: ["a","2a","4a","8a"], a: 2, e: "LR=4a.", after: 1 },
  ],
  fl: [["Ellipse eccentricity","b²=a²(1−e²)"],["Hyperbola asymptotes","y=±(b/a)x"],["Cross ratio","invariant under projection"],["Direction cosines","l²+m²+n²=1"]],
},

"A-combin": {
  mins: 22,
  secs: [
    { t: "Counting fundamentals", h: `<p>Addition: m+n disjoint. Multiplication: m×n sequential. Permutation nPr=n!/(n−r)! order matters. Combination nCr=n!/[r!(n−r)!] selection. Circular (n−1)!. With repetition: n^r sequences, C(n+r−1,r) selections. Inclusion-exclusion |A∪B|=|A|+|B|−|A∩B|; derangements !n=n!(1−1/1!+1/2!−…+1/n!).</p>` },
    { t: "Binomial & generating functions", h: `<p>(x+y)^n=ΣC(n,k)x^{n−k}y^k; C(n,k)=C(n,n−k). Pascal identity C(n,k)=C(n−1,k)+C(n−1,k−1). GF: Σa_n x^n; (1+x)^n generates C(n,k). Partition: distinct parts = odd parts (Euler). Catalan C_n=C(2n,n)/(n+1): parenthesizations, Catalan numbers via recurrence C_n=ΣC_k C_{n−1−k}. Exponential GF for labelled structures.</p>` },
    { t: "Recurrence & difference", h: `<p>Linear recurrence a_n = c₁a_{n−1} + c₂a_{n−2} + … + F(n). Homogeneous char eqn roots; distinct→C₁r₁^n; repeated→(C₁+C₂n)r^n. Particular for F(n). Master theorem T(n)=aT(n/b)+f(n): compare n^{log_b a} with f(n). Fibonacci generating fn; T(n)=2T(n/2)+n → O(n log n).</p>` },
    { t: "Graph theory & Polya", h: `<p>Graph: vertices edges. Degree sum=2|E|. Handshaking odd-degree vertices even. Trees: n vertices, n−1 edges, connected acyclic. Euler circuit: every vertex even degree; Hamiltonian cycle visits each once. Isomorphism: same degree sequence necessary not sufficient. Planar: e≤3v−6; Kuratowski K₅,K_{3,3}. Chromatic number: greedy ≤Δ+1.</p>` },
  ],
  cps: [
    { q: "C(n,0)+C(n,1)+…+C(n,n) =", o: ["n","n²","2^n","n!"], a: 2, e: "Sum of row n in Pascal’s triangle = 2^n.", after: 0 },
    { q: "Number of derangements !n grows like…", o: ["n!","n!/2","n!/e","2^n"], a: 2, e: "!n ≈ n!/e (nearest integer).", after: 1 },
  ],
  fl: [["Pascal identity","C(n,k)=C(n−1,k)+C(n−1,k−1)"],["Euler’s formula planar","v−e+f=2"],["Catalan recurrence","C_n=Σ_{k=0}^{n−1}C_k C_{n−1−k}"],["Inclusion-exclusion","|A∪B|=|A|+|B|−|A∩B|"]],
},

};
