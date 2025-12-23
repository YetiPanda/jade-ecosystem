/**
 * SKA Ingredient Seed Script
 * Seeds 100+ skincare ingredients with relationships, tensors, and goldilocks parameters
 *
 * Run: pnpm --filter @jade/vendure-backend ts-node src/scripts/seed-ska-ingredients.ts
 */

import { AppDataSource } from '../config/database';

/**
 * Interface for ingredient data structure
 */
interface IngredientData {
  title: string;
  slug: string;
  inciName: string;
  casNumber: string;
  glanceText: string;
  scanText: string;
  studyText: string;
  causesPurging: boolean;
  purgingDurationWeeks?: number;
  purgingDescription?: string;
  tensor: {
    hydrationIndex: number;
    sebumRegulation: number;
    antiAgingPotency: number;
    brighteningEfficacy: number;
    antiInflammatory: number;
    barrierRepair: number;
    exfoliationStrength: number;
    antioxidantCapacity: number;
    collagenStimulation: number;
    sensitivityRisk: number;
    photosensitivity: number;
    phDependency: number;
    molecularPenetration: number;
    stabilityRating: number;
    compatibilityScore: number;
    clinicalEvidenceLevel: number;
    marketSaturation: number;
  };
  goldilocks: Array<{
    name: string;
    unit: string;
    optMin: number;
    optMax: number;
    absMin: number;
    absMax: number;
    context: string;
    skinType: string;
  }>;
}

// Ingredient categories for organized seeding
const INGREDIENTS: Record<string, IngredientData[]> = {
  // ============================================
  // RETINOIDS (Anti-aging powerhouses)
  // ============================================
  retinoids: [
    {
      title: 'Tretinoin',
      slug: 'tretinoin',
      inciName: 'Tretinoin',
      casNumber: '302-79-4',
      glanceText: 'Prescription-strength retinoid, the gold standard for anti-aging and acne treatment.',
      scanText: 'Tretinoin (all-trans retinoic acid) is the active form of vitamin A that directly binds to retinoic acid receptors. Unlike OTC retinoids, it doesn\'t require conversion in the skin. FDA-approved for acne and photoaging. Significantly more potent than retinol but also more irritating.',
      studyText: 'Tretinoin is a first-generation retinoid that has been studied extensively since the 1960s. It works by binding to RAR (retinoic acid receptor) and RXR (retinoid X receptor) nuclear receptors, modulating gene expression for over 300 genes involved in cell proliferation, differentiation, and apoptosis. Clinical studies show: 68% improvement in fine wrinkles at 48 weeks, significant increase in dermal collagen I/III, and 70% reduction in comedones for acne. Available in 0.025%, 0.05%, and 0.1% concentrations. Formulation advances include microsphere technology (Retin-A Micro) for reduced irritation.',
      causesPurging: true,
      purgingDurationWeeks: 6,
      purgingDescription: 'Tretinoin significantly accelerates cell turnover, bringing microcomedones to the surface faster. Purging typically peaks at weeks 2-4 and resolves by week 8-12.',
      tensor: { hydrationIndex: 0.15, sebumRegulation: 0.55, antiAgingPotency: 0.98, brighteningEfficacy: 0.75, antiInflammatory: 0.25, barrierRepair: 0.40, exfoliationStrength: 0.90, antioxidantCapacity: 0.35, collagenStimulation: 0.95, sensitivityRisk: 0.85, photosensitivity: 0.90, phDependency: 0.50, molecularPenetration: 0.80, stabilityRating: 0.25, compatibilityScore: 0.50, clinicalEvidenceLevel: 0.99, marketSaturation: 0.60 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 0.025, optMax: 0.1, absMin: 0.01, absMax: 0.3, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Retinaldehyde',
      slug: 'retinaldehyde',
      inciName: 'Retinal',
      casNumber: '116-31-4',
      glanceText: 'Vitamin A aldehyde, one step closer to tretinoin than retinol, with faster results and antibacterial properties.',
      scanText: 'Retinaldehyde (retinal) is only one enzymatic conversion away from retinoic acid, making it more effective than retinol while remaining OTC. Unique antibacterial properties against P. acnes make it excellent for acne-prone skin. Less irritating than tretinoin with comparable efficacy at higher concentrations.',
      studyText: 'Retinaldehyde is converted to retinoic acid by retinal dehydrogenase enzymes in the skin. Studies show 0.05% retinaldehyde produces similar anti-aging effects to 0.05% tretinoin with significantly less irritation. Its antibacterial activity (MIC of 4 μg/mL against P. acnes) makes it unique among retinoids. The aldehyde form also has direct antioxidant properties. Stability is better than retinol but still requires protection from light and air. Concentration range: 0.05-0.1% in most formulations.',
      causesPurging: true,
      purgingDurationWeeks: 4,
      purgingDescription: 'Similar to retinol but faster onset. Purging typically resolves within 3-4 weeks.',
      tensor: { hydrationIndex: 0.20, sebumRegulation: 0.60, antiAgingPotency: 0.90, brighteningEfficacy: 0.70, antiInflammatory: 0.35, barrierRepair: 0.45, exfoliationStrength: 0.85, antioxidantCapacity: 0.45, collagenStimulation: 0.88, sensitivityRisk: 0.70, photosensitivity: 0.80, phDependency: 0.45, molecularPenetration: 0.75, stabilityRating: 0.35, compatibilityScore: 0.55, clinicalEvidenceLevel: 0.85, marketSaturation: 0.35 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 0.05, optMax: 0.1, absMin: 0.025, absMax: 0.2, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Adapalene',
      slug: 'adapalene',
      inciName: 'Adapalene',
      casNumber: '106685-40-9',
      glanceText: 'Third-generation synthetic retinoid, FDA-approved for acne, now available OTC in 0.1% strength.',
      scanText: 'Adapalene is a synthetic retinoid that selectively binds to RAR-β and RAR-γ receptors. More stable than tretinoin, less irritating, and equally effective for acne. The 0.1% OTC formulation (Differin) democratized prescription-strength retinoid access.',
      studyText: 'Adapalene\'s naphthoic acid derivative structure provides superior photostability and chemical stability compared to natural retinoids. It selectively targets the RAR subtypes most relevant to keratinocyte differentiation while avoiding RAR-α (linked to irritation). Clinical trials show comparable efficacy to tretinoin for acne with 50% less irritation. Less effective for photoaging than tretinoin but excellent tolerability makes it ideal for retinoid beginners or those with sensitive skin.',
      causesPurging: true,
      purgingDurationWeeks: 6,
      purgingDescription: 'Adapalene purging is typically milder than tretinoin. Expect initial worsening weeks 2-6, improvement by week 12.',
      tensor: { hydrationIndex: 0.20, sebumRegulation: 0.70, antiAgingPotency: 0.65, brighteningEfficacy: 0.50, antiInflammatory: 0.45, barrierRepair: 0.50, exfoliationStrength: 0.75, antioxidantCapacity: 0.30, collagenStimulation: 0.60, sensitivityRisk: 0.55, photosensitivity: 0.40, phDependency: 0.30, molecularPenetration: 0.70, stabilityRating: 0.85, compatibilityScore: 0.65, clinicalEvidenceLevel: 0.95, marketSaturation: 0.70 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 0.1, optMax: 0.3, absMin: 0.1, absMax: 0.3, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Bakuchiol',
      slug: 'bakuchiol',
      inciName: 'Bakuchiol',
      casNumber: '10309-37-2',
      glanceText: 'Plant-derived retinol alternative from Psoralea corylifolia, suitable for pregnancy and sensitive skin.',
      scanText: 'Bakuchiol is a meroterpene extracted from the babchi plant. While structurally different from retinoids, it activates similar gene expression pathways. Studies show comparable anti-aging results to 0.5% retinol without the irritation, photosensitivity, or pregnancy contraindications.',
      studyText: 'Bakuchiol functions as a functional analog of retinol, upregulating types I, III, and IV collagen while downregulating MMP-1 and MMP-3. A 12-week split-face study comparing 0.5% bakuchiol to 0.5% retinol showed comparable improvement in wrinkles, pigmentation, and photodamage, with significantly less scaling and stinging in the bakuchiol group. Unlike retinoids, bakuchiol has antioxidant and anti-inflammatory properties. It\'s stable, compatible with most actives, and safe during pregnancy.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.40, sebumRegulation: 0.45, antiAgingPotency: 0.70, brighteningEfficacy: 0.55, antiInflammatory: 0.65, barrierRepair: 0.60, exfoliationStrength: 0.25, antioxidantCapacity: 0.70, collagenStimulation: 0.75, sensitivityRisk: 0.15, photosensitivity: 0.05, phDependency: 0.20, molecularPenetration: 0.55, stabilityRating: 0.80, compatibilityScore: 0.90, clinicalEvidenceLevel: 0.70, marketSaturation: 0.45 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 0.5, optMax: 2.0, absMin: 0.25, absMax: 3.0, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Granactive Retinoid',
      slug: 'granactive-retinoid',
      inciName: 'Hydroxypinacolone Retinoate',
      casNumber: '893412-73-2',
      glanceText: 'Ester of all-trans retinoic acid that provides retinoid benefits with minimal irritation.',
      scanText: 'Hydroxypinacolone Retinoate (HPR) is a retinyl ester that binds directly to retinoid receptors without requiring conversion. This makes it highly effective yet gentle. Used in The Ordinary\'s Granactive Retinoid line.',
      studyText: 'HPR is unique among retinoid esters because it doesn\'t require enzymatic conversion to retinoic acid—it binds directly to cellular retinoic acid-binding proteins. Studies show it\'s 10x less irritating than retinol while providing comparable gene expression changes. It\'s also more stable than retinol and retinaldehyde. Effective concentration range is 0.2-2%, often combined with retinol for enhanced efficacy.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.35, sebumRegulation: 0.50, antiAgingPotency: 0.75, brighteningEfficacy: 0.60, antiInflammatory: 0.55, barrierRepair: 0.55, exfoliationStrength: 0.50, antioxidantCapacity: 0.40, collagenStimulation: 0.70, sensitivityRisk: 0.30, photosensitivity: 0.45, phDependency: 0.35, molecularPenetration: 0.60, stabilityRating: 0.70, compatibilityScore: 0.80, clinicalEvidenceLevel: 0.65, marketSaturation: 0.50 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 0.5, optMax: 2.0, absMin: 0.1, absMax: 5.0, context: 'facial', skinType: 'all' }]
    },
  ],

  // ============================================
  // AHAs (Alpha Hydroxy Acids)
  // ============================================
  ahas: [
    {
      title: 'Glycolic Acid',
      slug: 'glycolic-acid',
      inciName: 'Glycolic Acid',
      casNumber: '79-14-1',
      glanceText: 'Smallest AHA molecule, derived from sugarcane, provides the deepest penetration and strongest exfoliation.',
      scanText: 'Glycolic acid\'s small molecular weight (76 Da) allows superior penetration compared to other AHAs. It works by dissolving the bonds between dead skin cells, stimulating cell turnover, and promoting collagen synthesis. Effective at pH 3-4.',
      studyText: 'Glycolic acid is the most studied AHA with decades of clinical research. Its mechanism involves weakening ionic bonds in the stratum corneum, promoting desquamation. At higher concentrations and lower pH, it also stimulates fibroblast proliferation and collagen synthesis. pH is critical: below 3.5 provides optimal free acid activity, but increases irritation. Buffered formulas (pH 3.5-4.5) offer a balance. Concentration ranges: 5-10% daily use, 30-70% professional peels.',
      causesPurging: true,
      purgingDurationWeeks: 4,
      purgingDescription: 'Accelerates cell turnover, pushing existing clogs to the surface. Usually resolves within 4-6 weeks.',
      tensor: { hydrationIndex: 0.45, sebumRegulation: 0.40, antiAgingPotency: 0.75, brighteningEfficacy: 0.80, antiInflammatory: 0.20, barrierRepair: 0.30, exfoliationStrength: 0.95, antioxidantCapacity: 0.15, collagenStimulation: 0.70, sensitivityRisk: 0.70, photosensitivity: 0.60, phDependency: 0.95, molecularPenetration: 0.95, stabilityRating: 0.80, compatibilityScore: 0.50, clinicalEvidenceLevel: 0.95, marketSaturation: 0.85 },
      goldilocks: [
        { name: 'concentration', unit: '%', optMin: 5, optMax: 10, absMin: 2, absMax: 30, context: 'facial', skinType: 'all' },
        { name: 'pH', unit: 'pH', optMin: 3.0, optMax: 4.0, absMin: 2.5, absMax: 5.0, context: 'facial', skinType: 'all' }
      ]
    },
    {
      title: 'Lactic Acid',
      slug: 'lactic-acid',
      inciName: 'Lactic Acid',
      casNumber: '50-21-5',
      glanceText: 'Gentler AHA derived from milk, provides exfoliation plus hydration through natural moisturizing factor stimulation.',
      scanText: 'Lactic acid is larger than glycolic (90 Da) so penetrates more slowly, resulting in less irritation. It also functions as a humectant and stimulates ceramide production. Ideal for sensitive skin and those new to chemical exfoliation.',
      studyText: 'Lactic acid offers unique dual functionality: AHA exfoliation plus hydration. It stimulates ceramide synthesis in the stratum corneum, improving barrier function while exfoliating. Research shows it increases skin thickness more than glycolic acid at equivalent concentrations. Also inhibits tyrosinase for mild brightening effects. The L-lactic acid isomer is preferred over D-lactic acid. Concentration range: 5-12% for daily use.',
      causesPurging: true,
      purgingDurationWeeks: 3,
      purgingDescription: 'Milder purging than glycolic acid due to slower penetration. Usually resolves in 2-4 weeks.',
      tensor: { hydrationIndex: 0.65, sebumRegulation: 0.35, antiAgingPotency: 0.65, brighteningEfficacy: 0.70, antiInflammatory: 0.35, barrierRepair: 0.55, exfoliationStrength: 0.75, antioxidantCapacity: 0.10, collagenStimulation: 0.60, sensitivityRisk: 0.50, photosensitivity: 0.50, phDependency: 0.90, molecularPenetration: 0.75, stabilityRating: 0.85, compatibilityScore: 0.60, clinicalEvidenceLevel: 0.90, marketSaturation: 0.80 },
      goldilocks: [
        { name: 'concentration', unit: '%', optMin: 5, optMax: 12, absMin: 2, absMax: 30, context: 'facial', skinType: 'all' },
        { name: 'pH', unit: 'pH', optMin: 3.5, optMax: 4.5, absMin: 3.0, absMax: 5.5, context: 'facial', skinType: 'sensitive' }
      ]
    },
    {
      title: 'Mandelic Acid',
      slug: 'mandelic-acid',
      inciName: 'Mandelic Acid',
      casNumber: '90-64-2',
      glanceText: 'Largest AHA molecule from almonds, gentlest option with antibacterial properties, excellent for darker skin tones.',
      scanText: 'Mandelic acid\'s large molecular size (152 Da) means very slow, even penetration—making it the least irritating AHA. Its structure also provides antibacterial and anti-inflammatory effects. Particularly safe for Fitzpatrick skin types IV-VI due to low PIH risk.',
      studyText: 'Mandelic acid\'s lipophilic nature and large size result in slow, controlled penetration with minimal irritation. Studies show significant improvement in acne, hyperpigmentation, and photoaging with lower PIH risk than glycolic acid in darker skin tones. Its antibacterial activity against P. acnes and S. aureus adds acne-fighting benefits. Often combined with salicylic acid for acne treatment. Effective at 10-20% concentrations.',
      causesPurging: true,
      purgingDurationWeeks: 3,
      purgingDescription: 'Very mild purging due to slow penetration. Typically resolves within 2-3 weeks.',
      tensor: { hydrationIndex: 0.35, sebumRegulation: 0.45, antiAgingPotency: 0.55, brighteningEfficacy: 0.65, antiInflammatory: 0.50, barrierRepair: 0.45, exfoliationStrength: 0.55, antioxidantCapacity: 0.15, collagenStimulation: 0.50, sensitivityRisk: 0.30, photosensitivity: 0.35, phDependency: 0.85, molecularPenetration: 0.45, stabilityRating: 0.85, compatibilityScore: 0.70, clinicalEvidenceLevel: 0.75, marketSaturation: 0.55 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 10, optMax: 20, absMin: 5, absMax: 40, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Azelaic Acid',
      slug: 'azelaic-acid',
      inciName: 'Azelaic Acid',
      casNumber: '123-99-9',
      glanceText: 'Dicarboxylic acid with antibacterial, anti-inflammatory, and tyrosinase-inhibiting properties. Safe for pregnancy.',
      scanText: 'Azelaic acid is a multifunctional ingredient: keratolytic, antibacterial against P. acnes, anti-inflammatory, and brightening via tyrosinase inhibition. FDA-approved for rosacea (15-20%) and acne. One of few actives safe during pregnancy.',
      studyText: 'Azelaic acid\'s mechanism is multifaceted: it normalizes keratinization, kills acne-causing bacteria (competitive inhibitor of dihydrotestosterone), reduces inflammation, and inhibits tyrosinase for hyperpigmentation treatment. Studies show 20% azelaic acid is as effective as 0.05% tretinoin for acne and comparable to 4% hydroquinone for melasma—without the side effects of either. Its safety profile makes it unique among actives for pregnant/nursing patients. Available OTC up to 10%, prescription at 15-20%.',
      causesPurging: true,
      purgingDurationWeeks: 4,
      purgingDescription: 'Mild purging possible due to keratolytic effects. Usually subsides within 4 weeks.',
      tensor: { hydrationIndex: 0.25, sebumRegulation: 0.55, antiAgingPotency: 0.50, brighteningEfficacy: 0.80, antiInflammatory: 0.75, barrierRepair: 0.40, exfoliationStrength: 0.45, antioxidantCapacity: 0.30, collagenStimulation: 0.35, sensitivityRisk: 0.25, photosensitivity: 0.10, phDependency: 0.60, molecularPenetration: 0.55, stabilityRating: 0.90, compatibilityScore: 0.85, clinicalEvidenceLevel: 0.95, marketSaturation: 0.65 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 10, optMax: 20, absMin: 5, absMax: 20, context: 'facial', skinType: 'all' }]
    },
  ],

  // ============================================
  // VITAMIN C DERIVATIVES
  // ============================================
  vitaminC: [
    {
      title: 'L-Ascorbic Acid',
      slug: 'l-ascorbic-acid',
      inciName: 'Ascorbic Acid',
      casNumber: '50-81-7',
      glanceText: 'Pure vitamin C, the most potent form with the strongest antioxidant and collagen-boosting effects.',
      scanText: 'L-ascorbic acid is the bioactive form of vitamin C. It neutralizes free radicals, inhibits melanogenesis, and is essential for collagen synthesis. Requires low pH (below 3.5) for penetration. Highly unstable—degrades with light, air, and heat.',
      studyText: 'L-ascorbic acid is a water-soluble antioxidant that scavenges reactive oxygen species, regenerates vitamin E, and serves as a cofactor for prolyl and lysyl hydroxylase in collagen synthesis. Studies show topical application increases collagen I and III mRNA expression by 200-400%. For penetration, pH must be below the pKa of 4.2, with optimal absorption at pH 2.5-3.0. Concentration sweet spot is 10-20%; higher doesn\'t improve efficacy but increases irritation. Combining with vitamin E and ferulic acid increases stability and efficacy 8-fold.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.30, sebumRegulation: 0.25, antiAgingPotency: 0.85, brighteningEfficacy: 0.90, antiInflammatory: 0.45, barrierRepair: 0.35, exfoliationStrength: 0.20, antioxidantCapacity: 0.98, collagenStimulation: 0.90, sensitivityRisk: 0.55, photosensitivity: 0.05, phDependency: 0.95, molecularPenetration: 0.70, stabilityRating: 0.15, compatibilityScore: 0.45, clinicalEvidenceLevel: 0.98, marketSaturation: 0.90 },
      goldilocks: [
        { name: 'concentration', unit: '%', optMin: 10, optMax: 20, absMin: 5, absMax: 30, context: 'facial', skinType: 'all' },
        { name: 'pH', unit: 'pH', optMin: 2.5, optMax: 3.5, absMin: 2.0, absMax: 4.0, context: 'facial', skinType: 'all' }
      ]
    },
    {
      title: 'Sodium Ascorbyl Phosphate',
      slug: 'sodium-ascorbyl-phosphate',
      inciName: 'Sodium Ascorbyl Phosphate',
      casNumber: '66170-10-3',
      glanceText: 'Stable, water-soluble vitamin C derivative with proven antibacterial activity against acne.',
      scanText: 'SAP is a phosphate ester of ascorbic acid that\'s converted to L-ascorbic acid by skin phosphatases. More stable and less irritating than pure vitamin C. Uniquely effective against P. acnes at 5% concentration.',
      studyText: 'Sodium ascorbyl phosphate demonstrates superior stability compared to L-ascorbic acid, maintaining potency in aqueous formulations at neutral pH. Studies show 5% SAP is as effective as 5% benzoyl peroxide for inflammatory acne with less irritation. It also provides antioxidant protection, though less potent than L-ascorbic acid. Effective pH range is 6-7, making it easy to formulate and gentle on skin.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.35, sebumRegulation: 0.35, antiAgingPotency: 0.55, brighteningEfficacy: 0.65, antiInflammatory: 0.55, barrierRepair: 0.40, exfoliationStrength: 0.10, antioxidantCapacity: 0.70, collagenStimulation: 0.55, sensitivityRisk: 0.20, photosensitivity: 0.05, phDependency: 0.30, molecularPenetration: 0.50, stabilityRating: 0.85, compatibilityScore: 0.85, clinicalEvidenceLevel: 0.75, marketSaturation: 0.60 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 5, optMax: 10, absMin: 1, absMax: 20, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Ascorbyl Glucoside',
      slug: 'ascorbyl-glucoside',
      inciName: 'Ascorbyl Glucoside',
      casNumber: '129499-78-1',
      glanceText: 'Gentle, stable vitamin C bound to glucose, released slowly in skin for sustained brightening benefits.',
      scanText: 'Ascorbyl glucoside is L-ascorbic acid bound to glucose via an alpha-glycosidic bond. Skin glucosidases release the active vitamin C over time. Highly stable, water-soluble, and well-tolerated at pH 5-7.',
      studyText: 'Ascorbyl glucoside offers exceptional stability due to its glucose moiety protecting the ascorbic acid portion. Conversion to L-ascorbic acid occurs via alpha-glucosidase enzymes in the epidermis. While less potent than pure vitamin C, its stability and gentle nature make it suitable for sensitive skin and clean beauty formulations. Studies show significant improvement in skin brightness and evening of skin tone at 2-5% concentrations.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.40, sebumRegulation: 0.25, antiAgingPotency: 0.50, brighteningEfficacy: 0.70, antiInflammatory: 0.50, barrierRepair: 0.45, exfoliationStrength: 0.05, antioxidantCapacity: 0.60, collagenStimulation: 0.45, sensitivityRisk: 0.10, photosensitivity: 0.05, phDependency: 0.20, molecularPenetration: 0.40, stabilityRating: 0.95, compatibilityScore: 0.90, clinicalEvidenceLevel: 0.70, marketSaturation: 0.70 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 2, optMax: 5, absMin: 0.5, absMax: 10, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Tetrahexyldecyl Ascorbate',
      slug: 'tetrahexyldecyl-ascorbate',
      inciName: 'Tetrahexyldecyl Ascorbate',
      casNumber: '183476-82-6',
      glanceText: 'Oil-soluble vitamin C ester that penetrates deeply and remains stable in anhydrous formulations.',
      scanText: 'THD Ascorbate is a lipophilic vitamin C derivative that can penetrate the lipid matrix of the stratum corneum more effectively than water-soluble forms. Stable in oils and anhydrous products. Converted to L-ascorbic acid intracellularly.',
      studyText: 'Tetrahexyldecyl ascorbate\'s lipophilic structure (8 carbon chains on each of 4 hydroxyl groups) allows penetration through the stratum corneum lipid barrier, reaching the dermis where collagen synthesis occurs. Studies show it increases collagen production and reduces melanin synthesis comparably to L-ascorbic acid. Its stability in anhydrous formulations makes it popular in luxury serums and oils. Effective at 1-3% concentrations.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.30, sebumRegulation: 0.30, antiAgingPotency: 0.70, brighteningEfficacy: 0.75, antiInflammatory: 0.40, barrierRepair: 0.50, exfoliationStrength: 0.05, antioxidantCapacity: 0.75, collagenStimulation: 0.70, sensitivityRisk: 0.15, photosensitivity: 0.05, phDependency: 0.10, molecularPenetration: 0.85, stabilityRating: 0.90, compatibilityScore: 0.85, clinicalEvidenceLevel: 0.70, marketSaturation: 0.50 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 1, optMax: 3, absMin: 0.5, absMax: 10, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Ethyl Ascorbic Acid',
      slug: 'ethyl-ascorbic-acid',
      inciName: '3-O-Ethyl Ascorbic Acid',
      casNumber: '86404-04-8',
      glanceText: 'Highly stable vitamin C derivative with excellent skin penetration and direct free radical scavenging.',
      scanText: 'Ethyl ascorbic acid is unique among derivatives because it can act as an antioxidant directly without conversion to L-ascorbic acid. Stable across a wide pH range and penetrates well due to its small size.',
      studyText: '3-O-Ethyl ascorbic acid maintains the antioxidant activity of the ascorbyl moiety even before enzymatic conversion. This gives it dual-action capability: immediate free radical scavenging plus sustained vitamin C benefits. Studies show significant reduction in melanin synthesis and improvement in skin brightness. Stable at pH 4-6, compatible with niacinamide and most actives.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.35, sebumRegulation: 0.30, antiAgingPotency: 0.65, brighteningEfficacy: 0.80, antiInflammatory: 0.45, barrierRepair: 0.40, exfoliationStrength: 0.05, antioxidantCapacity: 0.80, collagenStimulation: 0.60, sensitivityRisk: 0.20, photosensitivity: 0.05, phDependency: 0.40, molecularPenetration: 0.75, stabilityRating: 0.85, compatibilityScore: 0.88, clinicalEvidenceLevel: 0.75, marketSaturation: 0.55 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 1, optMax: 3, absMin: 0.5, absMax: 10, context: 'facial', skinType: 'all' }]
    },
  ],

  // ============================================
  // HYDRATORS & HUMECTANTS
  // ============================================
  hydrators: [
    {
      title: 'Glycerin',
      slug: 'glycerin',
      inciName: 'Glycerin',
      casNumber: '56-81-5',
      glanceText: 'Classic humectant that draws water to skin, present in natural moisturizing factor (NMF).',
      scanText: 'Glycerin is one of the most effective and well-studied humectants. It\'s a component of natural skin lipids and works by attracting water from the dermis and environment to the stratum corneum. Also strengthens barrier function.',
      studyText: 'Glycerin (glycerol) is a polyol humectant that improves skin hydration through multiple mechanisms: water binding in the stratum corneum, protection of stratum corneum lipid structure, and enhancement of desmosome degradation for proper desquamation. Studies show even at 3% concentration, glycerin significantly improves skin hydration and barrier function. At higher concentrations (10%+), it provides excellent moisturization without occlusion. Compatible with virtually all ingredients.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.95, sebumRegulation: 0.10, antiAgingPotency: 0.35, brighteningEfficacy: 0.15, antiInflammatory: 0.30, barrierRepair: 0.65, exfoliationStrength: 0.00, antioxidantCapacity: 0.05, collagenStimulation: 0.15, sensitivityRisk: 0.05, photosensitivity: 0.00, phDependency: 0.05, molecularPenetration: 0.80, stabilityRating: 0.98, compatibilityScore: 0.98, clinicalEvidenceLevel: 0.98, marketSaturation: 0.95 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 3, optMax: 10, absMin: 1, absMax: 30, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Squalane',
      slug: 'squalane',
      inciName: 'Squalane',
      casNumber: '111-01-3',
      glanceText: 'Stable, saturated form of squalene naturally found in sebum. Excellent emollient that mimics skin\'s own oils.',
      scanText: 'Squalane is the hydrogenated (stable) form of squalene, a lipid that makes up about 13% of human sebum. It\'s lightweight, non-comedogenic, and helps restore the skin\'s lipid barrier without greasiness.',
      studyText: 'Squalane is biomimetic—it closely resembles the squalene naturally produced by human sebocytes. This structural similarity allows excellent compatibility and absorption. Unlike squalene, the hydrogenated form is stable and won\'t oxidize. It provides emollience by filling gaps between corneocytes and enhancing skin flexibility. Derived from olives or sugarcane (plant-based) or shark liver (marine). Effective as 5-100% of oil phase in formulations.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.75, sebumRegulation: 0.60, antiAgingPotency: 0.40, brighteningEfficacy: 0.10, antiInflammatory: 0.35, barrierRepair: 0.80, exfoliationStrength: 0.00, antioxidantCapacity: 0.30, collagenStimulation: 0.20, sensitivityRisk: 0.05, photosensitivity: 0.00, phDependency: 0.00, molecularPenetration: 0.70, stabilityRating: 0.95, compatibilityScore: 0.95, clinicalEvidenceLevel: 0.85, marketSaturation: 0.85 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 5, optMax: 30, absMin: 1, absMax: 100, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Ceramides',
      slug: 'ceramides',
      inciName: 'Ceramide NP',
      casNumber: '100403-19-8',
      glanceText: 'Lipids that make up 50% of skin barrier, essential for moisture retention and protection.',
      scanText: 'Ceramides are sphingolipids that form the "mortar" between corneocyte "bricks" in the stratum corneum. They\'re crucial for barrier function, preventing transepidermal water loss, and protecting against environmental damage.',
      studyText: 'Ceramides comprise about 50% of stratum corneum lipids by mass. There are 12 different ceramide classes in human skin, with ceramides 1, 3, and 6-II being most important for barrier function. Topical ceramides have been shown to repair barrier damage, reduce TEWL, and improve conditions like eczema and dermatitis. Most effective when combined with cholesterol and free fatty acids in a 3:1:1 ratio, mimicking the natural lipid matrix.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.85, sebumRegulation: 0.30, antiAgingPotency: 0.55, brighteningEfficacy: 0.15, antiInflammatory: 0.60, barrierRepair: 0.98, exfoliationStrength: 0.00, antioxidantCapacity: 0.25, collagenStimulation: 0.30, sensitivityRisk: 0.02, photosensitivity: 0.00, phDependency: 0.05, molecularPenetration: 0.60, stabilityRating: 0.75, compatibilityScore: 0.90, clinicalEvidenceLevel: 0.95, marketSaturation: 0.80 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 0.5, optMax: 3, absMin: 0.1, absMax: 5, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Panthenol',
      slug: 'panthenol',
      inciName: 'Panthenol',
      casNumber: '81-13-0',
      glanceText: 'Provitamin B5 that deeply hydrates, reduces inflammation, and accelerates wound healing.',
      scanText: 'Panthenol (provitamin B5) is converted to pantothenic acid in the skin, a component of coenzyme A crucial for lipid synthesis. It hydrates, reduces itching and inflammation, and promotes epithelial healing.',
      studyText: 'Panthenol readily penetrates the stratum corneum where keratinocytes convert it to pantothenic acid. This vitamin is essential for coenzyme A synthesis, supporting lipid metabolism and barrier function. Studies show panthenol reduces TEWL, increases stratum corneum hydration, and activates fibroblast proliferation for wound healing. Its anti-inflammatory effects come from stabilization of lysosomal membranes. Effective at 1-5% concentrations.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.85, sebumRegulation: 0.20, antiAgingPotency: 0.40, brighteningEfficacy: 0.20, antiInflammatory: 0.70, barrierRepair: 0.75, exfoliationStrength: 0.00, antioxidantCapacity: 0.15, collagenStimulation: 0.35, sensitivityRisk: 0.02, photosensitivity: 0.00, phDependency: 0.10, molecularPenetration: 0.75, stabilityRating: 0.90, compatibilityScore: 0.95, clinicalEvidenceLevel: 0.90, marketSaturation: 0.85 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 1, optMax: 5, absMin: 0.5, absMax: 10, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Urea',
      slug: 'urea',
      inciName: 'Urea',
      casNumber: '57-13-6',
      glanceText: 'Component of natural moisturizing factor with concentration-dependent effects: hydrating at low %, exfoliating at high %.',
      scanText: 'Urea is a key component of NMF that provides hygroscopic (water-attracting) properties. At 2-10%, it hydrates; at 20-40%, it gently exfoliates by breaking bonds between corneocytes. Also enhances penetration of other ingredients.',
      studyText: 'Urea\'s mechanism is concentration-dependent. At low concentrations (2-10%), it acts as a humectant and helps maintain stratum corneum water content. At higher concentrations (20-40%), it has keratolytic effects, disrupting hydrogen bonds between keratin proteins. Studies show urea also increases skin permeability, enhancing delivery of other actives. Particularly effective for very dry skin conditions and hyperkeratotic disorders.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.90, sebumRegulation: 0.15, antiAgingPotency: 0.30, brighteningEfficacy: 0.25, antiInflammatory: 0.35, barrierRepair: 0.60, exfoliationStrength: 0.50, antioxidantCapacity: 0.05, collagenStimulation: 0.15, sensitivityRisk: 0.25, photosensitivity: 0.00, phDependency: 0.20, molecularPenetration: 0.85, stabilityRating: 0.85, compatibilityScore: 0.80, clinicalEvidenceLevel: 0.95, marketSaturation: 0.65 },
      goldilocks: [
        { name: 'concentration', unit: '%', optMin: 5, optMax: 10, absMin: 2, absMax: 40, context: 'facial', skinType: 'dry' },
        { name: 'concentration', unit: '%', optMin: 20, optMax: 40, absMin: 10, absMax: 50, context: 'body', skinType: 'all' }
      ]
    },
  ],

  // ============================================
  // PEPTIDES
  // ============================================
  peptides: [
    {
      title: 'Matrixyl (Palmitoyl Pentapeptide-4)',
      slug: 'matrixyl',
      inciName: 'Palmitoyl Pentapeptide-4',
      casNumber: '214047-00-4',
      glanceText: 'Signal peptide that stimulates collagen and extracellular matrix production for visible wrinkle reduction.',
      scanText: 'Matrixyl is a lipopeptide that mimics the collagen fragment KTTKS, signaling fibroblasts to produce more collagen, fibronectin, and elastin. Clinical studies show wrinkle reduction comparable to retinol without irritation.',
      studyText: 'Palmitoyl pentapeptide-4 (Pal-KTTKS) is a signal peptide derived from procollagen I. The KTTKS sequence is released during collagen degradation and acts as a wound-healing signal. When applied topically, it stimulates TGF-β production and subsequent synthesis of collagen types I, III, IV, fibronectin, and glycosaminoglycans. A double-blind study showed significant reduction in wrinkle depth and volume after 4 months. Effective at 0.001-0.0025% (4-10 ppm).',
      causesPurging: false,
      tensor: { hydrationIndex: 0.45, sebumRegulation: 0.15, antiAgingPotency: 0.80, brighteningEfficacy: 0.30, antiInflammatory: 0.35, barrierRepair: 0.50, exfoliationStrength: 0.00, antioxidantCapacity: 0.20, collagenStimulation: 0.90, sensitivityRisk: 0.05, photosensitivity: 0.00, phDependency: 0.25, molecularPenetration: 0.55, stabilityRating: 0.75, compatibilityScore: 0.90, clinicalEvidenceLevel: 0.85, marketSaturation: 0.75 },
      goldilocks: [{ name: 'concentration', unit: 'ppm', optMin: 4, optMax: 10, absMin: 2, absMax: 50, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Argireline (Acetyl Hexapeptide-3)',
      slug: 'argireline',
      inciName: 'Acetyl Hexapeptide-3',
      casNumber: '616204-22-9',
      glanceText: '"Botox in a bottle" - neurotransmitter-inhibiting peptide that reduces expression lines.',
      scanText: 'Argireline is a fragment of SNAP-25, a protein essential for neurotransmitter release. By competing with SNAP-25, it reduces acetylcholine release and muscle contraction, softening expression lines without injections.',
      studyText: 'Acetyl hexapeptide-3 works by inhibiting SNARE complex formation, which is necessary for vesicle-membrane fusion and neurotransmitter release. Studies show 10% Argireline reduced wrinkle depth by 30% after 30 days. Unlike Botox, effects are limited to the application area and are fully reversible. Best results are seen with consistent use on expression lines (forehead, crow\'s feet). Effective at 5-10% concentration.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.30, sebumRegulation: 0.10, antiAgingPotency: 0.75, brighteningEfficacy: 0.15, antiInflammatory: 0.25, barrierRepair: 0.30, exfoliationStrength: 0.00, antioxidantCapacity: 0.10, collagenStimulation: 0.35, sensitivityRisk: 0.05, photosensitivity: 0.00, phDependency: 0.30, molecularPenetration: 0.45, stabilityRating: 0.70, compatibilityScore: 0.85, clinicalEvidenceLevel: 0.75, marketSaturation: 0.70 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 5, optMax: 10, absMin: 2, absMax: 15, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Copper Peptides (GHK-Cu)',
      slug: 'copper-peptides',
      inciName: 'Copper Tripeptide-1',
      casNumber: '49557-75-7',
      glanceText: 'Wound-healing peptide complex that stimulates collagen, promotes healing, and has antioxidant effects.',
      scanText: 'GHK-Cu is a naturally occurring tripeptide with high affinity for copper(II). It\'s released during tissue injury and promotes wound healing, collagen synthesis, glycosaminoglycan production, and fibroblast proliferation.',
      studyText: 'GHK-Cu (glycyl-L-histidyl-L-lysine:copper(II)) was discovered in human plasma and is released during tissue remodeling. The copper ion is essential for many enzyme activities including lysyl oxidase (collagen crosslinking) and superoxide dismutase (antioxidant). Studies show GHK-Cu increases collagen and elastin synthesis, attracts immune cells for wound healing, and reduces inflammation. It also has anti-aging effects on gene expression, resetting skin cells toward a younger pattern.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.50, sebumRegulation: 0.20, antiAgingPotency: 0.85, brighteningEfficacy: 0.35, antiInflammatory: 0.60, barrierRepair: 0.75, exfoliationStrength: 0.05, antioxidantCapacity: 0.65, collagenStimulation: 0.88, sensitivityRisk: 0.15, photosensitivity: 0.00, phDependency: 0.45, molecularPenetration: 0.60, stabilityRating: 0.60, compatibilityScore: 0.70, clinicalEvidenceLevel: 0.80, marketSaturation: 0.60 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 0.5, optMax: 2, absMin: 0.1, absMax: 5, context: 'facial', skinType: 'all' }]
    },
  ],

  // ============================================
  // ANTIOXIDANTS
  // ============================================
  antioxidants: [
    {
      title: 'Vitamin E (Tocopherol)',
      slug: 'vitamin-e',
      inciName: 'Tocopherol',
      casNumber: '59-02-9',
      glanceText: 'Lipid-soluble antioxidant that protects cell membranes from free radical damage and enhances vitamin C stability.',
      scanText: 'Vitamin E is the primary lipid-phase antioxidant in skin. Alpha-tocopherol is the most active form. It scavenges free radicals, prevents lipid peroxidation, and works synergistically with vitamin C.',
      studyText: 'Alpha-tocopherol protects cell membranes by neutralizing lipid peroxyl radicals, terminating chain reactions of lipid peroxidation. When oxidized, vitamin E can be regenerated by vitamin C, creating a synergistic antioxidant system. Studies show topical vitamin E provides photoprotection, reduces UV-induced erythema, and improves skin hydration. Natural d-alpha tocopherol is more bioactive than synthetic dl-alpha-tocopherol. Effective at 1-5% concentration.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.55, sebumRegulation: 0.30, antiAgingPotency: 0.65, brighteningEfficacy: 0.30, antiInflammatory: 0.55, barrierRepair: 0.60, exfoliationStrength: 0.00, antioxidantCapacity: 0.90, collagenStimulation: 0.45, sensitivityRisk: 0.10, photosensitivity: 0.00, phDependency: 0.10, molecularPenetration: 0.65, stabilityRating: 0.50, compatibilityScore: 0.80, clinicalEvidenceLevel: 0.90, marketSaturation: 0.90 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 1, optMax: 5, absMin: 0.5, absMax: 10, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Ferulic Acid',
      slug: 'ferulic-acid',
      inciName: 'Ferulic Acid',
      casNumber: '1135-24-6',
      glanceText: 'Plant-derived antioxidant that dramatically enhances the stability and efficacy of vitamins C and E.',
      scanText: 'Ferulic acid is a phenolic compound found in plant cell walls. When combined with vitamins C and E, it doubles photoprotection and stabilizes the notoriously unstable L-ascorbic acid.',
      studyText: 'Ferulic acid\'s phenolic structure allows it to neutralize free radicals and absorb UV light. The landmark 2005 Pinnell study showed that adding 1% ferulic acid to a 15% vitamin C + 1% vitamin E formula increased its photoprotection 8-fold. The mechanism involves synergistic radical scavenging and improved chemical stability of ascorbic acid. Ferulic acid also has anti-melanogenic properties.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.25, sebumRegulation: 0.20, antiAgingPotency: 0.70, brighteningEfficacy: 0.55, antiInflammatory: 0.50, barrierRepair: 0.35, exfoliationStrength: 0.05, antioxidantCapacity: 0.92, collagenStimulation: 0.50, sensitivityRisk: 0.15, photosensitivity: 0.00, phDependency: 0.70, molecularPenetration: 0.70, stabilityRating: 0.75, compatibilityScore: 0.75, clinicalEvidenceLevel: 0.85, marketSaturation: 0.70 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 0.5, optMax: 1, absMin: 0.1, absMax: 2, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Resveratrol',
      slug: 'resveratrol',
      inciName: 'Resveratrol',
      casNumber: '501-36-0',
      glanceText: 'Polyphenol from grapes and berries with potent antioxidant and sirtuin-activating anti-aging effects.',
      scanText: 'Resveratrol is a stilbenoid that gained fame for its potential longevity benefits. It activates sirtuins, scavenges free radicals, inhibits melanogenesis, and has anti-inflammatory properties.',
      studyText: 'Resveratrol is a potent antioxidant that activates SIRT1, a sirtuin associated with cellular longevity. It also inhibits NF-κB (anti-inflammatory), COX enzymes, and tyrosinase (anti-melanogenic). Studies show topical resveratrol reduces UV-induced damage, improves skin texture, and has anti-cancer properties. Challenges include poor stability (degrades with light) and solubility. Encapsulation technologies have improved delivery.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.30, sebumRegulation: 0.25, antiAgingPotency: 0.75, brighteningEfficacy: 0.50, antiInflammatory: 0.70, barrierRepair: 0.40, exfoliationStrength: 0.00, antioxidantCapacity: 0.88, collagenStimulation: 0.55, sensitivityRisk: 0.10, photosensitivity: 0.00, phDependency: 0.30, molecularPenetration: 0.55, stabilityRating: 0.30, compatibilityScore: 0.70, clinicalEvidenceLevel: 0.75, marketSaturation: 0.55 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 0.5, optMax: 2, absMin: 0.1, absMax: 5, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Green Tea Extract (EGCG)',
      slug: 'green-tea-extract',
      inciName: 'Camellia Sinensis Leaf Extract',
      casNumber: '989-51-5',
      glanceText: 'Polyphenol-rich extract with antioxidant, anti-inflammatory, and photoprotective benefits.',
      scanText: 'Green tea\'s primary active, EGCG (epigallocatechin gallate), is a powerful antioxidant that also reduces sebum, soothes inflammation, and provides mild sun protection.',
      studyText: 'EGCG is a catechin polyphenol with exceptional antioxidant capacity—more potent than vitamins C and E by some measures. It scavenges ROS, chelates metal ions, inhibits 5-alpha reductase (reducing sebum), and has anti-inflammatory effects via NF-κB and AP-1 inhibition. Studies show topical EGCG provides photoprotection, reduces UV-induced immunosuppression, and improves acne. Stability is a challenge; look for liposomal or encapsulated forms.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.40, sebumRegulation: 0.55, antiAgingPotency: 0.60, brighteningEfficacy: 0.35, antiInflammatory: 0.70, barrierRepair: 0.45, exfoliationStrength: 0.05, antioxidantCapacity: 0.88, collagenStimulation: 0.45, sensitivityRisk: 0.10, photosensitivity: 0.00, phDependency: 0.30, molecularPenetration: 0.50, stabilityRating: 0.45, compatibilityScore: 0.80, clinicalEvidenceLevel: 0.80, marketSaturation: 0.80 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 0.5, optMax: 5, absMin: 0.1, absMax: 10, context: 'facial', skinType: 'all' }]
    },
  ],

  // ============================================
  // BRIGHTENING AGENTS
  // ============================================
  brightening: [
    {
      title: 'Arbutin',
      slug: 'arbutin',
      inciName: 'Arbutin',
      casNumber: '497-76-7',
      glanceText: 'Natural hydroquinone glycoside from bearberry that inhibits tyrosinase for gentle skin brightening.',
      scanText: 'Arbutin releases hydroquinone slowly through enzymatic hydrolysis in the skin, providing melanin-inhibiting effects with less irritation and cytotoxicity than pure hydroquinone.',
      studyText: 'Arbutin exists as alpha and beta isomers. Alpha-arbutin is more stable and 10x more effective for tyrosinase inhibition. The glucose moiety protects the hydroquinone portion, allowing controlled release. Studies show 2-4% arbutin reduces melanin synthesis by 40-60% without melanocyte cytotoxicity. It\'s gentler than hydroquinone but slower acting, typically requiring 2-3 months for visible results.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.35, sebumRegulation: 0.15, antiAgingPotency: 0.35, brighteningEfficacy: 0.85, antiInflammatory: 0.30, barrierRepair: 0.25, exfoliationStrength: 0.05, antioxidantCapacity: 0.40, collagenStimulation: 0.20, sensitivityRisk: 0.15, photosensitivity: 0.10, phDependency: 0.50, molecularPenetration: 0.55, stabilityRating: 0.75, compatibilityScore: 0.80, clinicalEvidenceLevel: 0.80, marketSaturation: 0.75 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 2, optMax: 4, absMin: 0.5, absMax: 7, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Kojic Acid',
      slug: 'kojic-acid',
      inciName: 'Kojic Acid',
      casNumber: '501-30-4',
      glanceText: 'Fungal metabolite that chelates copper required for tyrosinase activity, brightening skin.',
      scanText: 'Kojic acid is produced by fungi during fermentation. It inhibits melanin synthesis by chelating the copper cofactor of tyrosinase. Effective but can be sensitizing.',
      studyText: 'Kojic acid (5-hydroxy-2-hydroxymethyl-4H-pyran-4-one) inhibits tyrosinase by removing the copper ion essential for its catalytic activity. Studies show 1-4% kojic acid is as effective as 2% hydroquinone for melasma treatment. However, it can cause contact sensitization in some individuals and is unstable, oxidizing to brown-colored compounds. Dipalmitate ester forms offer improved stability.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.20, sebumRegulation: 0.20, antiAgingPotency: 0.30, brighteningEfficacy: 0.85, antiInflammatory: 0.15, barrierRepair: 0.15, exfoliationStrength: 0.15, antioxidantCapacity: 0.45, collagenStimulation: 0.15, sensitivityRisk: 0.45, photosensitivity: 0.25, phDependency: 0.70, molecularPenetration: 0.60, stabilityRating: 0.35, compatibilityScore: 0.60, clinicalEvidenceLevel: 0.80, marketSaturation: 0.65 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 1, optMax: 2, absMin: 0.5, absMax: 4, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Tranexamic Acid',
      slug: 'tranexamic-acid',
      inciName: 'Tranexamic Acid',
      casNumber: '1197-18-8',
      glanceText: 'Synthetic lysine derivative that reduces melanin by inhibiting UV-induced plasmin activity.',
      scanText: 'Tranexamic acid is a plasmin inhibitor that interrupts the UV-pigmentation pathway. Originally used to treat heavy menstrual bleeding, it\'s now a star ingredient for stubborn hyperpigmentation.',
      studyText: 'Tranexamic acid inhibits plasmin and plasminogen activator, reducing the release of arachidonic acid and prostaglandins that stimulate melanogenesis. It also prevents UV-induced keratinocyte-melanocyte interaction. Studies show significant improvement in melasma with both topical (2-5%) and oral forms. It works particularly well for melasma resistant to other treatments. Few side effects and no photosensitivity risk.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.25, sebumRegulation: 0.15, antiAgingPotency: 0.30, brighteningEfficacy: 0.88, antiInflammatory: 0.45, barrierRepair: 0.20, exfoliationStrength: 0.05, antioxidantCapacity: 0.20, collagenStimulation: 0.15, sensitivityRisk: 0.10, photosensitivity: 0.05, phDependency: 0.40, molecularPenetration: 0.65, stabilityRating: 0.90, compatibilityScore: 0.90, clinicalEvidenceLevel: 0.88, marketSaturation: 0.60 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 2, optMax: 5, absMin: 0.5, absMax: 10, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Alpha Arbutin',
      slug: 'alpha-arbutin',
      inciName: 'Alpha-Arbutin',
      casNumber: '84380-01-8',
      glanceText: 'Pure alpha isomer of arbutin, 10x more effective for tyrosinase inhibition than beta-arbutin.',
      scanText: 'Alpha-arbutin is a biosynthetic ingredient made by enzymatic conversion. The alpha configuration provides superior stability and tyrosinase inhibition compared to plant-derived beta-arbutin.',
      studyText: 'Alpha-arbutin\'s alpha-glucoside linkage makes it more resistant to hydrolysis and provides better affinity for tyrosinase. Studies comparing alpha vs beta isomers show alpha-arbutin has 10x greater inhibitory activity. It also has better stability in formulations. Effective at 0.5-2% concentration, often combined with other brightening agents for synergistic effects.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.35, sebumRegulation: 0.15, antiAgingPotency: 0.35, brighteningEfficacy: 0.90, antiInflammatory: 0.30, barrierRepair: 0.25, exfoliationStrength: 0.05, antioxidantCapacity: 0.40, collagenStimulation: 0.20, sensitivityRisk: 0.10, photosensitivity: 0.05, phDependency: 0.40, molecularPenetration: 0.60, stabilityRating: 0.85, compatibilityScore: 0.85, clinicalEvidenceLevel: 0.82, marketSaturation: 0.70 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 0.5, optMax: 2, absMin: 0.2, absMax: 4, context: 'facial', skinType: 'all' }]
    },
  ],

  // ============================================
  // SOOTHING / ANTI-INFLAMMATORY
  // ============================================
  soothing: [
    {
      title: 'Centella Asiatica',
      slug: 'centella-asiatica',
      inciName: 'Centella Asiatica Extract',
      casNumber: '84696-21-9',
      glanceText: 'K-beauty favorite "Cica" that heals wounds, calms inflammation, and strengthens skin barrier.',
      scanText: 'Centella asiatica contains four key actives: asiaticoside, madecassoside, asiatic acid, and madecassic acid. Together they promote collagen synthesis, reduce inflammation, and accelerate wound healing.',
      studyText: 'Centella asiatica\'s triterpene saponins (especially asiaticoside) stimulate type I collagen synthesis and wound healing by activating fibroblasts. Madecassoside has strong anti-inflammatory effects, inhibiting NF-κB and reducing TNF-α and IL-6. Studies show improved healing of burns, surgical wounds, and acne scars. The "TECA" complex (titrated extract) standardizes active content. Popular in K-beauty as "cica" products.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.60, sebumRegulation: 0.30, antiAgingPotency: 0.50, brighteningEfficacy: 0.25, antiInflammatory: 0.90, barrierRepair: 0.85, exfoliationStrength: 0.00, antioxidantCapacity: 0.60, collagenStimulation: 0.70, sensitivityRisk: 0.05, photosensitivity: 0.00, phDependency: 0.15, molecularPenetration: 0.50, stabilityRating: 0.75, compatibilityScore: 0.95, clinicalEvidenceLevel: 0.85, marketSaturation: 0.85 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 0.1, optMax: 1, absMin: 0.01, absMax: 5, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Allantoin',
      slug: 'allantoin',
      inciName: 'Allantoin',
      casNumber: '97-59-6',
      glanceText: 'Purine derivative that soothes irritation, promotes cell regeneration, and enhances keratolytic effects.',
      scanText: 'Allantoin is found in comfrey root and has been used for centuries for wound healing. It soothes irritated skin, stimulates epithelial growth, and can enhance the effects of other keratolytic ingredients.',
      studyText: 'Allantoin promotes wound healing by stimulating fibroblast proliferation and extracellular matrix synthesis. It also has keratolytic properties, helping remove dead cells. Studies show it reduces skin irritation from other actives (like AHAs or retinoids) when included in formulations. Very well-tolerated with virtually no sensitization potential. Typical concentration: 0.5-2%.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.55, sebumRegulation: 0.15, antiAgingPotency: 0.30, brighteningEfficacy: 0.15, antiInflammatory: 0.75, barrierRepair: 0.65, exfoliationStrength: 0.20, antioxidantCapacity: 0.15, collagenStimulation: 0.40, sensitivityRisk: 0.02, photosensitivity: 0.00, phDependency: 0.10, molecularPenetration: 0.70, stabilityRating: 0.95, compatibilityScore: 0.98, clinicalEvidenceLevel: 0.80, marketSaturation: 0.80 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 0.5, optMax: 2, absMin: 0.1, absMax: 5, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Bisabolol',
      slug: 'bisabolol',
      inciName: 'Bisabolol',
      casNumber: '515-69-5',
      glanceText: 'Chamomile-derived terpene alcohol with anti-inflammatory, anti-irritant, and antimicrobial properties.',
      scanText: 'Alpha-bisabolol is the active compound in chamomile responsible for its soothing effects. It inhibits inflammation, speeds wound healing, and has mild antibacterial and antifungal activity.',
      studyText: 'Alpha-bisabolol inhibits cyclooxygenase and 5-lipoxygenase pathways, reducing prostaglandin and leukotriene production. It also penetrates well due to its lipophilic nature, delivering anti-inflammatory effects to deeper skin layers. Studies show it accelerates healing and reduces irritation from other cosmetic ingredients. Additionally, it has modest antimicrobial activity and can enhance the penetration of other actives.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.45, sebumRegulation: 0.25, antiAgingPotency: 0.30, brighteningEfficacy: 0.20, antiInflammatory: 0.85, barrierRepair: 0.55, exfoliationStrength: 0.00, antioxidantCapacity: 0.35, collagenStimulation: 0.30, sensitivityRisk: 0.03, photosensitivity: 0.00, phDependency: 0.05, molecularPenetration: 0.75, stabilityRating: 0.80, compatibilityScore: 0.95, clinicalEvidenceLevel: 0.80, marketSaturation: 0.75 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 0.2, optMax: 1, absMin: 0.1, absMax: 2, context: 'facial', skinType: 'all' }]
    },
  ],

  // ============================================
  // ACNE FIGHTERS
  // ============================================
  acneFighters: [
    {
      title: 'Benzoyl Peroxide',
      slug: 'benzoyl-peroxide',
      inciName: 'Benzoyl Peroxide',
      casNumber: '94-36-0',
      glanceText: 'Powerful bactericidal agent that kills P. acnes without causing antibiotic resistance.',
      scanText: 'Benzoyl peroxide releases oxygen radicals in the follicle, killing anaerobic P. acnes bacteria. Unlike antibiotics, bacteria cannot develop resistance to this oxidative mechanism.',
      studyText: 'Benzoyl peroxide\'s bactericidal action comes from releasing reactive oxygen species that overwhelm bacterial defenses. It reduces P. acnes populations by 90% within days. The lack of resistance development makes it superior to topical antibiotics for long-term use. Side effects include dryness, peeling, and bleaching of fabrics. Lower concentrations (2.5%) are as effective as higher (10%) with less irritation.',
      causesPurging: true,
      purgingDurationWeeks: 4,
      purgingDescription: 'Initial increase in breakouts as bacteria die and inflammation occurs. Usually subsides within 4-6 weeks.',
      tensor: { hydrationIndex: 0.05, sebumRegulation: 0.55, antiAgingPotency: 0.10, brighteningEfficacy: 0.25, antiInflammatory: 0.25, barrierRepair: 0.10, exfoliationStrength: 0.50, antioxidantCapacity: 0.10, collagenStimulation: 0.05, sensitivityRisk: 0.70, photosensitivity: 0.25, phDependency: 0.40, molecularPenetration: 0.65, stabilityRating: 0.70, compatibilityScore: 0.40, clinicalEvidenceLevel: 0.98, marketSaturation: 0.80 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 2.5, optMax: 5, absMin: 2.5, absMax: 10, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Sulfur',
      slug: 'sulfur',
      inciName: 'Sulfur',
      casNumber: '7704-34-9',
      glanceText: 'Ancient acne remedy with keratolytic and antimicrobial properties, especially effective for fungal acne.',
      scanText: 'Sulfur has been used for skin conditions for millennia. It works by reacting with cysteine in the stratum corneum to soften keratin, and has antibacterial and antifungal properties.',
      studyText: 'Sulfur acts as a keratolytic by breaking disulfide bonds in keratin, promoting desquamation. It\'s also bacteriostatic against P. acnes and antifungal against Malassezia (pityrosporum). This makes it uniquely effective for fungal acne/Malassezia folliculitis, which doesn\'t respond to antibacterial treatments. The distinctive odor and potential for dryness are drawbacks. Often combined with other actives to offset limitations.',
      causesPurging: true,
      purgingDurationWeeks: 2,
      purgingDescription: 'Mild purging possible due to keratolytic effects. Usually brief.',
      tensor: { hydrationIndex: 0.05, sebumRegulation: 0.65, antiAgingPotency: 0.10, brighteningEfficacy: 0.20, antiInflammatory: 0.40, barrierRepair: 0.15, exfoliationStrength: 0.60, antioxidantCapacity: 0.10, collagenStimulation: 0.05, sensitivityRisk: 0.50, photosensitivity: 0.10, phDependency: 0.30, molecularPenetration: 0.55, stabilityRating: 0.90, compatibilityScore: 0.55, clinicalEvidenceLevel: 0.75, marketSaturation: 0.50 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 3, optMax: 10, absMin: 1, absMax: 10, context: 'facial', skinType: 'all' }]
    },
  ],

  // ============================================
  // SUNSCREEN ACTIVES
  // ============================================
  sunscreens: [
    {
      title: 'Zinc Oxide',
      slug: 'zinc-oxide',
      inciName: 'Zinc Oxide',
      casNumber: '1314-13-2',
      glanceText: 'Physical/mineral UV filter that reflects and scatters UV rays, providing broad-spectrum protection.',
      scanText: 'Zinc oxide is a mineral sunscreen that sits on the skin surface and physically blocks UV radiation. It provides true broad-spectrum protection including UVA1. Generally well-tolerated and reef-safe.',
      studyText: 'Zinc oxide works via scattering, reflection, and absorption of UV rays. Unlike chemical filters, it doesn\'t penetrate skin or degrade with UV exposure. It provides excellent protection against UVA1 (340-400nm)—the "aging" rays that penetrate deeply. Modern micronized and nanoparticle forms reduce the white cast. However, nano particles raise concerns about systemic absorption, though current evidence suggests they remain in the stratum corneum.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.15, sebumRegulation: 0.30, antiAgingPotency: 0.50, brighteningEfficacy: 0.15, antiInflammatory: 0.40, barrierRepair: 0.30, exfoliationStrength: 0.00, antioxidantCapacity: 0.20, collagenStimulation: 0.10, sensitivityRisk: 0.10, photosensitivity: 0.00, phDependency: 0.05, molecularPenetration: 0.10, stabilityRating: 0.98, compatibilityScore: 0.75, clinicalEvidenceLevel: 0.98, marketSaturation: 0.85 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 15, optMax: 25, absMin: 5, absMax: 25, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Titanium Dioxide',
      slug: 'titanium-dioxide',
      inciName: 'Titanium Dioxide',
      casNumber: '13463-67-7',
      glanceText: 'Physical UV filter particularly effective against UVB rays, often combined with zinc oxide for broad-spectrum protection.',
      scanText: 'Titanium dioxide is a mineral filter that primarily protects against UVB rays. It\'s less effective in the UVA range than zinc oxide, so they\'re often combined for complete protection.',
      studyText: 'Titanium dioxide provides excellent UVB protection through scattering and reflection. Its absorption spectrum peaks around 300nm with weaker protection above 350nm. Coated forms (with silica, alumina, or silicones) improve dispersibility and reduce photocatalytic activity. Like zinc oxide, modern formulations use smaller particles to reduce white cast. Typically combined with zinc oxide or chemical filters for adequate UVA coverage.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.10, sebumRegulation: 0.25, antiAgingPotency: 0.40, brighteningEfficacy: 0.10, antiInflammatory: 0.25, barrierRepair: 0.20, exfoliationStrength: 0.00, antioxidantCapacity: 0.15, collagenStimulation: 0.05, sensitivityRisk: 0.08, photosensitivity: 0.00, phDependency: 0.05, molecularPenetration: 0.05, stabilityRating: 0.98, compatibilityScore: 0.80, clinicalEvidenceLevel: 0.98, marketSaturation: 0.80 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 5, optMax: 15, absMin: 2, absMax: 25, context: 'facial', skinType: 'all' }]
    },
  ],

  // ============================================
  // BHAs (Beta Hydroxy Acids)
  // ============================================
  bhas: [
    {
      title: 'Salicylic Acid',
      slug: 'salicylic-acid',
      inciName: 'Salicylic Acid',
      casNumber: '69-72-7',
      glanceText: 'Oil-soluble BHA that penetrates pores to clear blackheads and prevent breakouts.',
      scanText: 'Salicylic acid is the only true BHA used in skincare. Its oil solubility allows it to penetrate sebum-filled pores, making it ideal for acne-prone and oily skin. It also has anti-inflammatory properties.',
      studyText: 'Salicylic acid is derived from willow bark and belongs to the aspirin family. At pH 3-4, it has keratolytic effects, dissolving the "glue" between corneocytes. Its lipophilic nature allows it to concentrate in the pilosebaceous unit. Beyond exfoliation, it has direct anti-inflammatory effects via COX inhibition. Concentrations: 0.5-2% OTC, up to 30% for professional peels.',
      causesPurging: true,
      purgingDurationWeeks: 4,
      purgingDescription: 'Clears pores of existing comedones, bringing them to the surface. Typically 2-4 weeks.',
      tensor: { hydrationIndex: 0.20, sebumRegulation: 0.85, antiAgingPotency: 0.45, brighteningEfficacy: 0.55, antiInflammatory: 0.60, barrierRepair: 0.25, exfoliationStrength: 0.80, antioxidantCapacity: 0.20, collagenStimulation: 0.35, sensitivityRisk: 0.55, photosensitivity: 0.40, phDependency: 0.90, molecularPenetration: 0.85, stabilityRating: 0.85, compatibilityScore: 0.55, clinicalEvidenceLevel: 0.95, marketSaturation: 0.90 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 0.5, optMax: 2, absMin: 0.5, absMax: 30, context: 'facial', skinType: 'oily' }]
    },
    {
      title: 'Betaine Salicylate',
      slug: 'betaine-salicylate',
      inciName: 'Betaine Salicylate',
      casNumber: '17671-53-3',
      glanceText: 'Gentler salicylic acid derivative popular in Korean skincare for sensitive acne-prone skin.',
      scanText: 'Betaine salicylate is a compound of salicylic acid and betaine, a natural amino acid derivative. It provides similar pore-clearing benefits with less irritation potential.',
      studyText: 'Betaine salicylate releases salicylic acid gradually, reducing peak concentration irritation. The betaine portion adds humectant properties. Popular in K-beauty formulations like COSRX products. Provides exfoliation suitable for sensitive skin types that cannot tolerate traditional salicylic acid.',
      causesPurging: true,
      purgingDurationWeeks: 3,
      purgingDescription: 'Gentler purging than salicylic acid, typically 2-3 weeks.',
      tensor: { hydrationIndex: 0.35, sebumRegulation: 0.70, antiAgingPotency: 0.35, brighteningEfficacy: 0.45, antiInflammatory: 0.55, barrierRepair: 0.35, exfoliationStrength: 0.65, antioxidantCapacity: 0.15, collagenStimulation: 0.25, sensitivityRisk: 0.35, photosensitivity: 0.30, phDependency: 0.80, molecularPenetration: 0.70, stabilityRating: 0.80, compatibilityScore: 0.70, clinicalEvidenceLevel: 0.70, marketSaturation: 0.45 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 1, optMax: 4, absMin: 0.5, absMax: 5, context: 'facial', skinType: 'sensitive' }]
    },
  ],

  // ============================================
  // PHAs (Polyhydroxy Acids)
  // ============================================
  phas: [
    {
      title: 'Gluconolactone',
      slug: 'gluconolactone',
      inciName: 'Gluconolactone',
      casNumber: '90-80-2',
      glanceText: 'Gentle PHA exfoliant with antioxidant properties, ideal for sensitive and rosacea-prone skin.',
      scanText: 'Gluconolactone is a PHA with a larger molecular size than AHAs, resulting in slower penetration and less irritation. It also has humectant and antioxidant properties.',
      studyText: 'Gluconolactone provides exfoliation comparable to glycolic acid but with significantly less irritation. Its multiple hydroxyl groups give it strong humectant properties. Studies show it doesn\'t increase sun sensitivity like AHAs. Additionally, it chelates iron, providing antioxidant benefits and gel-strengthening properties in formulations.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.55, sebumRegulation: 0.30, antiAgingPotency: 0.55, brighteningEfficacy: 0.50, antiInflammatory: 0.45, barrierRepair: 0.50, exfoliationStrength: 0.55, antioxidantCapacity: 0.50, collagenStimulation: 0.45, sensitivityRisk: 0.20, photosensitivity: 0.15, phDependency: 0.70, molecularPenetration: 0.45, stabilityRating: 0.85, compatibilityScore: 0.80, clinicalEvidenceLevel: 0.75, marketSaturation: 0.40 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 4, optMax: 10, absMin: 2, absMax: 15, context: 'facial', skinType: 'sensitive' }]
    },
    {
      title: 'Lactobionic Acid',
      slug: 'lactobionic-acid',
      inciName: 'Lactobionic Acid',
      casNumber: '96-82-2',
      glanceText: 'Advanced PHA with powerful antioxidant activity and moisturizing benefits, derived from lactose.',
      scanText: 'Lactobionic acid is a disaccharide acid (sugar acid) with eight hydroxyl groups. It provides gentle exfoliation while delivering strong antioxidant and moisturizing effects.',
      studyText: 'Lactobionic acid has the largest molecular size among common hydroxy acids, making it the gentlest. Its multiple hydroxyl groups provide exceptional water-binding capacity. Strong chelation of iron ions reduces oxidative damage. Studies show effectiveness comparable to glycolic acid for photoaging with virtually no stinging or irritation. Used in organ preservation solutions due to antioxidant properties.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.70, sebumRegulation: 0.20, antiAgingPotency: 0.60, brighteningEfficacy: 0.55, antiInflammatory: 0.50, barrierRepair: 0.55, exfoliationStrength: 0.45, antioxidantCapacity: 0.75, collagenStimulation: 0.50, sensitivityRisk: 0.10, photosensitivity: 0.05, phDependency: 0.60, molecularPenetration: 0.30, stabilityRating: 0.80, compatibilityScore: 0.85, clinicalEvidenceLevel: 0.75, marketSaturation: 0.30 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 5, optMax: 10, absMin: 2, absMax: 15, context: 'facial', skinType: 'sensitive' }]
    },
  ],

  // ============================================
  // BOTANICAL EXTRACTS
  // ============================================
  botanicals: [
    {
      title: 'Licorice Root Extract',
      slug: 'licorice-root-extract',
      inciName: 'Glycyrrhiza Glabra Root Extract',
      casNumber: '68916-91-6',
      glanceText: 'Multi-functional botanical that brightens, soothes inflammation, and evens skin tone.',
      scanText: 'Licorice extract contains glabridin and liquiritin, which inhibit tyrosinase and have anti-inflammatory effects. It\'s effective for hyperpigmentation without the irritation of hydroquinone.',
      studyText: 'Glabridin inhibits tyrosinase activity and melanin synthesis while having antioxidant effects. Liquiritin disperses existing melanin. Studies show significant improvement in melasma and PIH. The glycyrrhizic acid component has anti-inflammatory effects comparable to hydrocortisone without side effects. Generally well-tolerated, though rare sensitization is possible.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.40, sebumRegulation: 0.30, antiAgingPotency: 0.45, brighteningEfficacy: 0.80, antiInflammatory: 0.75, barrierRepair: 0.40, exfoliationStrength: 0.05, antioxidantCapacity: 0.70, collagenStimulation: 0.30, sensitivityRisk: 0.10, photosensitivity: 0.00, phDependency: 0.20, molecularPenetration: 0.50, stabilityRating: 0.70, compatibilityScore: 0.90, clinicalEvidenceLevel: 0.75, marketSaturation: 0.70 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 1, optMax: 5, absMin: 0.5, absMax: 10, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Sea Buckthorn Oil',
      slug: 'sea-buckthorn-oil',
      inciName: 'Hippophae Rhamnoides Oil',
      casNumber: '90106-68-6',
      glanceText: 'Nutrient-rich oil with high carotenoid content that promotes skin regeneration and elasticity.',
      scanText: 'Sea buckthorn oil is exceptionally rich in vitamins, carotenoids, and essential fatty acids. It promotes wound healing, reduces inflammation, and supports skin barrier function.',
      studyText: 'Sea buckthorn contains over 190 bioactive compounds including vitamins C, E, A, and rare palmitoleic acid (omega-7). Its high carotenoid content gives it a distinctive orange color. Studies show accelerated wound healing, reduced UV damage, and improved skin elasticity. The balanced omega fatty acid profile supports barrier repair. The oil can temporarily tint skin orange if used in high concentrations.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.65, sebumRegulation: 0.35, antiAgingPotency: 0.60, brighteningEfficacy: 0.45, antiInflammatory: 0.60, barrierRepair: 0.75, exfoliationStrength: 0.00, antioxidantCapacity: 0.85, collagenStimulation: 0.55, sensitivityRisk: 0.15, photosensitivity: 0.05, phDependency: 0.10, molecularPenetration: 0.55, stabilityRating: 0.50, compatibilityScore: 0.75, clinicalEvidenceLevel: 0.65, marketSaturation: 0.40 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 1, optMax: 5, absMin: 0.5, absMax: 10, context: 'facial', skinType: 'dry' }]
    },
    {
      title: 'Rosehip Seed Oil',
      slug: 'rosehip-seed-oil',
      inciName: 'Rosa Canina Seed Oil',
      casNumber: '84603-93-0',
      glanceText: 'Lightweight oil rich in vitamin A and essential fatty acids, excellent for scars and aging skin.',
      scanText: 'Rosehip oil is pressed from the seeds of wild rose bushes. It contains natural tretinoin, linoleic acid, and vitamin E, making it effective for anti-aging and scar reduction.',
      studyText: 'Rosehip seed oil contains trans-retinoic acid (tretinoin) at low levels, along with high concentrations of linoleic and linolenic acids. Studies show improvement in photoaging, surgical scars, and stretch marks. Its high linoleic acid content benefits acne-prone skin. Being a dry oil, it absorbs quickly without greasiness. Quality varies significantly; cold-pressed oil retains more bioactive compounds.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.60, sebumRegulation: 0.40, antiAgingPotency: 0.65, brighteningEfficacy: 0.50, antiInflammatory: 0.45, barrierRepair: 0.70, exfoliationStrength: 0.10, antioxidantCapacity: 0.60, collagenStimulation: 0.50, sensitivityRisk: 0.10, photosensitivity: 0.15, phDependency: 0.05, molecularPenetration: 0.50, stabilityRating: 0.40, compatibilityScore: 0.80, clinicalEvidenceLevel: 0.70, marketSaturation: 0.70 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 5, optMax: 100, absMin: 1, absMax: 100, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Jojoba Oil',
      slug: 'jojoba-oil',
      inciName: 'Simmondsia Chinensis Seed Oil',
      casNumber: '61789-91-1',
      glanceText: 'Technically a liquid wax ester similar to human sebum, excellent for all skin types including oily.',
      scanText: 'Jojoba oil is not actually an oil but a liquid wax ester. Its composition closely resembles human sebum, allowing it to regulate oil production while providing non-comedogenic moisture.',
      studyText: 'Jojoba\'s unique wax ester structure (primarily esters of long-chain fatty acids and alcohols) makes it remarkably similar to human sebum. This allows it to "trick" sebaceous glands into producing less oil. It has a comedogenic rating of 2 and is generally well-tolerated. Studies show anti-inflammatory effects and enhancement of topical drug absorption. Its stability and long shelf life make it an excellent carrier oil.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.55, sebumRegulation: 0.70, antiAgingPotency: 0.35, brighteningEfficacy: 0.20, antiInflammatory: 0.45, barrierRepair: 0.65, exfoliationStrength: 0.00, antioxidantCapacity: 0.45, collagenStimulation: 0.25, sensitivityRisk: 0.08, photosensitivity: 0.00, phDependency: 0.05, molecularPenetration: 0.45, stabilityRating: 0.95, compatibilityScore: 0.90, clinicalEvidenceLevel: 0.75, marketSaturation: 0.85 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 5, optMax: 100, absMin: 1, absMax: 100, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Marula Oil',
      slug: 'marula-oil',
      inciName: 'Sclerocarya Birrea Seed Oil',
      casNumber: '225234-03-7',
      glanceText: 'African "miracle oil" rich in oleic acid and antioxidants, fast-absorbing with anti-aging benefits.',
      scanText: 'Marula oil is pressed from the kernels of the marula fruit from Southern Africa. It\'s exceptionally high in antioxidants and oleic acid, with excellent stability and absorption.',
      studyText: 'Marula oil contains 70-78% oleic acid and high levels of antioxidants including tocopherols, flavonoids, and procyanidins. Its antioxidant content is 4x higher than argan oil. Studies show improved skin hydration, reduced transepidermal water loss, and decreased inflammation. The high oleic acid content makes it deeply moisturizing but may not suit acne-prone skin. It has exceptional oxidative stability.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.70, sebumRegulation: 0.30, antiAgingPotency: 0.55, brighteningEfficacy: 0.25, antiInflammatory: 0.55, barrierRepair: 0.70, exfoliationStrength: 0.00, antioxidantCapacity: 0.80, collagenStimulation: 0.40, sensitivityRisk: 0.10, photosensitivity: 0.00, phDependency: 0.05, molecularPenetration: 0.55, stabilityRating: 0.90, compatibilityScore: 0.80, clinicalEvidenceLevel: 0.65, marketSaturation: 0.55 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 5, optMax: 100, absMin: 1, absMax: 100, context: 'facial', skinType: 'dry' }]
    },
    {
      title: 'Tamanu Oil',
      slug: 'tamanu-oil',
      inciName: 'Calophyllum Inophyllum Seed Oil',
      casNumber: '8007-90-9',
      glanceText: 'Polynesian healing oil known for wound healing, scar reduction, and anti-inflammatory effects.',
      scanText: 'Tamanu oil has been used traditionally in the Pacific Islands for skin healing. It contains unique compounds like calophyllolide that promote tissue regeneration.',
      studyText: 'Tamanu oil contains novel compounds including calophyllolide, a non-steroidal anti-inflammatory, and lactone that promotes new tissue formation. Studies document accelerated wound healing, reduced scarring, and improvement in acne scars. It has antimicrobial activity against several bacteria. The thick, dark green oil has a distinctive scent. Unlike many oils, it can be applied to open wounds.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.55, sebumRegulation: 0.35, antiAgingPotency: 0.50, brighteningEfficacy: 0.35, antiInflammatory: 0.80, barrierRepair: 0.75, exfoliationStrength: 0.00, antioxidantCapacity: 0.55, collagenStimulation: 0.55, sensitivityRisk: 0.15, photosensitivity: 0.00, phDependency: 0.05, molecularPenetration: 0.50, stabilityRating: 0.75, compatibilityScore: 0.75, clinicalEvidenceLevel: 0.60, marketSaturation: 0.35 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 5, optMax: 30, absMin: 1, absMax: 100, context: 'facial', skinType: 'all' }]
    },
  ],

  // ============================================
  // ADDITIONAL PEPTIDES
  // ============================================
  additionalPeptides: [
    {
      title: 'Palmitoyl Tripeptide-1',
      slug: 'palmitoyl-tripeptide-1',
      inciName: 'Palmitoyl Tripeptide-1',
      casNumber: '147732-56-7',
      glanceText: 'Signal peptide that stimulates collagen synthesis by mimicking the breakdown products of collagen.',
      scanText: 'Part of the Matrixyl 3000 complex, this peptide mimics collagen fragments, tricking skin into producing more collagen and other matrix proteins.',
      studyText: 'Palmitoyl tripeptide-1 (GHK fragment) is a lipopeptide that penetrates skin and activates wound healing pathways without actual tissue damage. Studies show it stimulates synthesis of collagen I, III, IV, and glycosaminoglycans. When combined with palmitoyl tetrapeptide-7, synergistic effects double collagen production. Clinical studies show significant wrinkle reduction after 2 months of use.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.40, sebumRegulation: 0.20, antiAgingPotency: 0.80, brighteningEfficacy: 0.35, antiInflammatory: 0.40, barrierRepair: 0.55, exfoliationStrength: 0.00, antioxidantCapacity: 0.30, collagenStimulation: 0.88, sensitivityRisk: 0.08, photosensitivity: 0.00, phDependency: 0.30, molecularPenetration: 0.55, stabilityRating: 0.70, compatibilityScore: 0.85, clinicalEvidenceLevel: 0.80, marketSaturation: 0.65 },
      goldilocks: [{ name: 'concentration', unit: 'ppm', optMin: 100, optMax: 500, absMin: 50, absMax: 1000, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Palmitoyl Tetrapeptide-7',
      slug: 'palmitoyl-tetrapeptide-7',
      inciName: 'Palmitoyl Tetrapeptide-7',
      casNumber: '221227-05-0',
      glanceText: 'Anti-inflammatory peptide that reduces IL-6 to minimize chronic inflammation and skin aging.',
      scanText: 'This peptide suppresses IL-6 production, reducing chronic low-grade inflammation (inflammaging) that contributes to premature skin aging.',
      studyText: 'Palmitoyl tetrapeptide-7 targets inflammaging by inhibiting IL-6 secretion. IL-6 is a pro-inflammatory cytokine that increases with age and UV exposure, accelerating matrix degradation. Combined with palmitoyl tripeptide-1 as Matrixyl 3000, it provides comprehensive anti-aging: building new matrix while protecting existing structures from inflammatory damage.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.35, sebumRegulation: 0.20, antiAgingPotency: 0.75, brighteningEfficacy: 0.30, antiInflammatory: 0.80, barrierRepair: 0.50, exfoliationStrength: 0.00, antioxidantCapacity: 0.40, collagenStimulation: 0.70, sensitivityRisk: 0.05, photosensitivity: 0.00, phDependency: 0.25, molecularPenetration: 0.50, stabilityRating: 0.70, compatibilityScore: 0.90, clinicalEvidenceLevel: 0.75, marketSaturation: 0.55 },
      goldilocks: [{ name: 'concentration', unit: 'ppm', optMin: 100, optMax: 500, absMin: 50, absMax: 1000, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Hexapeptide-11',
      slug: 'hexapeptide-11',
      inciName: 'Hexapeptide-11',
      casNumber: '959610-30-1',
      glanceText: 'Yeast-derived peptide that increases keratinocyte growth factor for enhanced skin renewal.',
      scanText: 'Derived from yeast fermentation, this peptide stimulates keratinocyte growth factor (KGF), promoting faster skin cell turnover and improved barrier function.',
      studyText: 'Hexapeptide-11 increases expression of keratinocyte growth factor (KGF/FGF-7), which regulates epithelial cell proliferation and differentiation. Studies show improved skin firmness, elasticity, and texture. It also enhances the skin\'s ability to retain moisture. Unlike some peptides, it remains active over a wide pH range.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.50, sebumRegulation: 0.25, antiAgingPotency: 0.70, brighteningEfficacy: 0.40, antiInflammatory: 0.35, barrierRepair: 0.60, exfoliationStrength: 0.15, antioxidantCapacity: 0.30, collagenStimulation: 0.65, sensitivityRisk: 0.08, photosensitivity: 0.00, phDependency: 0.25, molecularPenetration: 0.45, stabilityRating: 0.75, compatibilityScore: 0.85, clinicalEvidenceLevel: 0.70, marketSaturation: 0.35 },
      goldilocks: [{ name: 'concentration', unit: 'ppm', optMin: 100, optMax: 1000, absMin: 50, absMax: 2000, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Acetyl Dipeptide-1',
      slug: 'acetyl-dipeptide-1',
      inciName: 'Acetyl Dipeptide-1 Cetyl Ester',
      casNumber: '196604-48-5',
      glanceText: 'Beta-endorphin-like peptide that reduces sensitivity and increases skin comfort threshold.',
      scanText: 'This synthetic peptide mimics beta-endorphin to reduce skin sensitivity and the perception of discomfort, making it excellent for reactive and sensitive skin.',
      studyText: 'Acetyl dipeptide-1 cetyl ester activates opioid receptors in skin, mimicking the calming effects of natural endorphins. Studies show significant reduction in perceived skin discomfort, stinging, and tightness. It raises the threshold for irritation from environmental stressors and other cosmetic ingredients. Particularly beneficial for rosacea-prone skin.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.40, sebumRegulation: 0.15, antiAgingPotency: 0.30, brighteningEfficacy: 0.15, antiInflammatory: 0.70, barrierRepair: 0.45, exfoliationStrength: 0.00, antioxidantCapacity: 0.20, collagenStimulation: 0.20, sensitivityRisk: 0.02, photosensitivity: 0.00, phDependency: 0.20, molecularPenetration: 0.55, stabilityRating: 0.75, compatibilityScore: 0.95, clinicalEvidenceLevel: 0.70, marketSaturation: 0.30 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 0.5, optMax: 2, absMin: 0.1, absMax: 5, context: 'facial', skinType: 'sensitive' }]
    },
    {
      title: 'Tripeptide-29',
      slug: 'tripeptide-29',
      inciName: 'Tripeptide-29',
      casNumber: '1237521-87-1',
      glanceText: 'Collagen sequence peptide that provides amino acids for collagen synthesis in their native sequence.',
      scanText: 'This peptide provides the Gly-Pro-Hyp sequence found in collagen, acting as both a building block and a signal for collagen production.',
      studyText: 'Tripeptide-29 (Gly-Pro-Hyp) represents the most common tripeptide sequence in collagen. When applied topically, it provides ready-to-use amino acids for collagen synthesis while also signaling fibroblasts to produce more collagen. Studies show improvements in skin firmness and wrinkle depth. Works synergistically with vitamin C and other collagen-boosting ingredients.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.40, sebumRegulation: 0.15, antiAgingPotency: 0.70, brighteningEfficacy: 0.25, antiInflammatory: 0.30, barrierRepair: 0.45, exfoliationStrength: 0.00, antioxidantCapacity: 0.20, collagenStimulation: 0.80, sensitivityRisk: 0.05, photosensitivity: 0.00, phDependency: 0.30, molecularPenetration: 0.50, stabilityRating: 0.70, compatibilityScore: 0.85, clinicalEvidenceLevel: 0.70, marketSaturation: 0.40 },
      goldilocks: [{ name: 'concentration', unit: 'ppm', optMin: 100, optMax: 500, absMin: 50, absMax: 1000, context: 'facial', skinType: 'all' }]
    },
  ],

  // ============================================
  // CHEMICAL SUNSCREENS
  // ============================================
  chemicalSunscreens: [
    {
      title: 'Avobenzone',
      slug: 'avobenzone',
      inciName: 'Butyl Methoxydibenzoylmethane',
      casNumber: '70356-09-1',
      glanceText: 'Primary UVA filter in US sunscreens, provides excellent UVA1 protection but requires stabilization.',
      scanText: 'Avobenzone absorbs across the entire UVA spectrum including UVA1. However, it photodegrades rapidly unless stabilized by other ingredients like octocrylene or Tinosorb.',
      studyText: 'Avobenzone is one of few FDA-approved filters with strong UVA1 absorption (peak 360nm). Its dibenzoylmethane structure undergoes photo-induced keto-enol tautomerism, leading to rapid degradation. Modern formulations use stabilizers: octocrylene donates energy, while Tinosorb S and M quench excited states. Concerns about photodegradation products have prompted development of newer UVA filters in other markets.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.10, sebumRegulation: 0.15, antiAgingPotency: 0.55, brighteningEfficacy: 0.20, antiInflammatory: 0.10, barrierRepair: 0.15, exfoliationStrength: 0.00, antioxidantCapacity: 0.10, collagenStimulation: 0.10, sensitivityRisk: 0.30, photosensitivity: 0.05, phDependency: 0.40, molecularPenetration: 0.40, stabilityRating: 0.35, compatibilityScore: 0.55, clinicalEvidenceLevel: 0.90, marketSaturation: 0.80 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 2, optMax: 3, absMin: 0.5, absMax: 3, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Octinoxate',
      slug: 'octinoxate',
      inciName: 'Ethylhexyl Methoxycinnamate',
      casNumber: '5466-77-3',
      glanceText: 'Common UVB filter with elegant feel, but facing restrictions due to coral reef concerns.',
      scanText: 'Octinoxate provides strong UVB protection with a pleasant cosmetic feel. However, it\'s been restricted in Hawaii and Palau due to potential coral bleaching effects.',
      studyText: 'Octinoxate is a cinnamate derivative that absorbs UVB radiation (peak 311nm) through its conjugated double bond system. It\'s one of the most cosmetically elegant UV filters. However, studies have linked it to coral bleaching and endocrine disruption. It also degrades avobenzone, so they shouldn\'t be combined without stabilizers. Many brands are phasing it out in favor of reef-safe alternatives.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.10, sebumRegulation: 0.20, antiAgingPotency: 0.35, brighteningEfficacy: 0.10, antiInflammatory: 0.05, barrierRepair: 0.10, exfoliationStrength: 0.00, antioxidantCapacity: 0.05, collagenStimulation: 0.05, sensitivityRisk: 0.25, photosensitivity: 0.10, phDependency: 0.35, molecularPenetration: 0.55, stabilityRating: 0.70, compatibilityScore: 0.50, clinicalEvidenceLevel: 0.85, marketSaturation: 0.75 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 3, optMax: 7.5, absMin: 1, absMax: 7.5, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Octocrylene',
      slug: 'octocrylene',
      inciName: 'Octocrylene',
      casNumber: '6197-30-4',
      glanceText: 'UVB filter that also stabilizes avobenzone, though it can accumulate benzophenone over time.',
      scanText: 'Octocrylene absorbs UVB and short UVA rays while stabilizing avobenzone. Recent concerns about benzophenone contamination have affected its reputation.',
      studyText: 'Octocrylene is a cinnamate derivative that absorbs UV radiation and acts as a photostabilizer for other filters, particularly avobenzone. It converts UV energy to heat. However, studies have shown it can generate benzophenone (a potential carcinogen) as a degradation product, especially in aged products. The EU requires specific benzophenone limits. Its occlusive feel is another drawback.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.15, sebumRegulation: 0.10, antiAgingPotency: 0.40, brighteningEfficacy: 0.10, antiInflammatory: 0.05, barrierRepair: 0.15, exfoliationStrength: 0.00, antioxidantCapacity: 0.10, collagenStimulation: 0.05, sensitivityRisk: 0.35, photosensitivity: 0.05, phDependency: 0.30, molecularPenetration: 0.35, stabilityRating: 0.80, compatibilityScore: 0.70, clinicalEvidenceLevel: 0.85, marketSaturation: 0.75 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 5, optMax: 10, absMin: 2, absMax: 10, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Tinosorb S',
      slug: 'tinosorb-s',
      inciName: 'Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine',
      casNumber: '187393-00-6',
      glanceText: 'Advanced broad-spectrum filter popular in Europe and Asia, provides excellent UVA and UVB protection.',
      scanText: 'Tinosorb S is a photostable broad-spectrum UV filter approved in most countries except the US. It absorbs and reflects UV radiation while stabilizing other filters.',
      studyText: 'Tinosorb S (BEMT) is a triazine derivative that provides true broad-spectrum protection through a unique combination of UV absorption and light conversion. It\'s extremely photostable and also stabilizes avobenzone. Its large molecular size prevents skin penetration. Not FDA-approved due to ongoing safety review (since 2002). Widely used in European and Asian sunscreens.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.10, sebumRegulation: 0.15, antiAgingPotency: 0.60, brighteningEfficacy: 0.15, antiInflammatory: 0.10, barrierRepair: 0.20, exfoliationStrength: 0.00, antioxidantCapacity: 0.15, collagenStimulation: 0.10, sensitivityRisk: 0.15, photosensitivity: 0.00, phDependency: 0.20, molecularPenetration: 0.15, stabilityRating: 0.95, compatibilityScore: 0.85, clinicalEvidenceLevel: 0.90, marketSaturation: 0.45 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 2, optMax: 10, absMin: 1, absMax: 10, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Uvinul A Plus',
      slug: 'uvinul-a-plus',
      inciName: 'Diethylamino Hydroxybenzoyl Hexyl Benzoate',
      casNumber: '302776-68-7',
      glanceText: 'Highly photostable UVA filter that doesn\'t degrade avobenzone, excellent for US formulations.',
      scanText: 'Uvinul A Plus provides strong UVA protection and is compatible with avobenzone without destabilizing it. It\'s one of the few advanced UVA filters approved for US use.',
      studyText: 'Uvinul A Plus (DHHB) is an aminobenzoate derivative with excellent UVA absorption and outstanding photostability. Unlike octinoxate, it doesn\'t destabilize avobenzone. FDA-approved up to 10%. Its oil-soluble nature makes formulation straightforward. Studies show no significant skin penetration or endocrine activity. One of the better options for US formulations lacking access to Tinosorb filters.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.10, sebumRegulation: 0.15, antiAgingPotency: 0.55, brighteningEfficacy: 0.15, antiInflammatory: 0.10, barrierRepair: 0.15, exfoliationStrength: 0.00, antioxidantCapacity: 0.10, collagenStimulation: 0.10, sensitivityRisk: 0.18, photosensitivity: 0.00, phDependency: 0.25, molecularPenetration: 0.25, stabilityRating: 0.92, compatibilityScore: 0.80, clinicalEvidenceLevel: 0.85, marketSaturation: 0.40 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 3, optMax: 10, absMin: 1, absMax: 10, context: 'facial', skinType: 'all' }]
    },
  ],

  // ============================================
  // ENZYMES
  // ============================================
  enzymes: [
    {
      title: 'Papain',
      slug: 'papain',
      inciName: 'Papain',
      casNumber: '9001-73-4',
      glanceText: 'Papaya enzyme that gently digests dead skin proteins for chemical-free exfoliation.',
      scanText: 'Papain is a proteolytic enzyme from papaya that breaks down keratin protein in dead skin cells. It provides gentle exfoliation without the pH requirements of AHAs.',
      studyText: 'Papain hydrolyzes peptide bonds in proteins, specifically targeting dead cells with damaged keratin. Unlike acid exfoliants, it works at neutral pH, making it gentler. It also has anti-inflammatory and antimicrobial properties. Studies show effective exfoliation with less irritation than AHAs. Can cause sensitization in some individuals, especially those with latex allergy (cross-reactivity).',
      causesPurging: false,
      tensor: { hydrationIndex: 0.25, sebumRegulation: 0.30, antiAgingPotency: 0.40, brighteningEfficacy: 0.55, antiInflammatory: 0.45, barrierRepair: 0.25, exfoliationStrength: 0.65, antioxidantCapacity: 0.20, collagenStimulation: 0.25, sensitivityRisk: 0.35, photosensitivity: 0.20, phDependency: 0.40, molecularPenetration: 0.40, stabilityRating: 0.45, compatibilityScore: 0.65, clinicalEvidenceLevel: 0.70, marketSaturation: 0.55 },
      goldilocks: [{ name: 'activity', unit: 'PU/mg', optMin: 500, optMax: 2000, absMin: 100, absMax: 6000, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Bromelain',
      slug: 'bromelain',
      inciName: 'Bromelain',
      casNumber: '37189-34-7',
      glanceText: 'Pineapple enzyme with exfoliating and anti-inflammatory properties, gentler than papain.',
      scanText: 'Bromelain is extracted from pineapple stems and fruit. Like papain, it\'s a proteolytic enzyme, but with additional anti-inflammatory and debriding properties.',
      studyText: 'Bromelain is a mixture of proteolytic enzymes from pineapple. Beyond exfoliation, it has documented anti-inflammatory, anti-edema, and wound healing properties. Studies show it reduces bruising and swelling post-surgery. In skincare, it provides gentle exfoliation and can help with acne-related inflammation. Generally considered gentler than papain with less sensitization potential.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.25, sebumRegulation: 0.25, antiAgingPotency: 0.35, brighteningEfficacy: 0.50, antiInflammatory: 0.60, barrierRepair: 0.30, exfoliationStrength: 0.55, antioxidantCapacity: 0.25, collagenStimulation: 0.25, sensitivityRisk: 0.25, photosensitivity: 0.15, phDependency: 0.35, molecularPenetration: 0.40, stabilityRating: 0.50, compatibilityScore: 0.70, clinicalEvidenceLevel: 0.65, marketSaturation: 0.40 },
      goldilocks: [{ name: 'activity', unit: 'GDU/g', optMin: 1000, optMax: 3000, absMin: 500, absMax: 6000, context: 'facial', skinType: 'all' }]
    },
  ],

  // ============================================
  // FERMENTED INGREDIENTS
  // ============================================
  fermented: [
    {
      title: 'Galactomyces Ferment Filtrate',
      slug: 'galactomyces-ferment-filtrate',
      inciName: 'Galactomyces Ferment Filtrate',
      casNumber: '68876-77-7',
      glanceText: 'SK-II\'s signature ingredient, a yeast ferment that brightens and improves skin texture.',
      scanText: 'This yeast ferment filtrate contains vitamins, minerals, amino acids, and organic acids that improve skin clarity, texture, and radiance. Made famous by SK-II\'s Facial Treatment Essence.',
      studyText: 'Galactomyces ferment filtrate (Pitera) is produced by fermenting sake (rice wine) with the yeast Saccharomyces. It contains over 50 micronutrients including vitamins, amino acids, minerals, and organic acids. Studies show it increases skin clarity, reduces spots and redness, improves texture, and enhances barrier function. The exact mechanism involves multiple pathways including antioxidant activity and improved cellular metabolism.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.60, sebumRegulation: 0.40, antiAgingPotency: 0.55, brighteningEfficacy: 0.70, antiInflammatory: 0.40, barrierRepair: 0.55, exfoliationStrength: 0.10, antioxidantCapacity: 0.55, collagenStimulation: 0.40, sensitivityRisk: 0.15, photosensitivity: 0.00, phDependency: 0.30, molecularPenetration: 0.45, stabilityRating: 0.80, compatibilityScore: 0.90, clinicalEvidenceLevel: 0.75, marketSaturation: 0.55 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 50, optMax: 95, absMin: 10, absMax: 100, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Bifida Ferment Lysate',
      slug: 'bifida-ferment-lysate',
      inciName: 'Bifida Ferment Lysate',
      casNumber: '96507-89-0',
      glanceText: 'Probiotic-derived ingredient that strengthens skin barrier and protects against environmental damage.',
      scanText: 'This lysate from Bifidobacterium (probiotic bacteria) helps repair skin barrier, increases resistance to stressors, and supports the skin microbiome.',
      studyText: 'Bifida ferment lysate contains the cellular contents of probiotic bacteria after controlled lysis. Studies show it reduces skin sensitivity, strengthens barrier function, and protects against UV and pollution damage. It influences the skin microbiome positively and reduces inflammatory cytokines. Particularly effective for sensitive and reactive skin. Estee Lauder\'s Advanced Night Repair features this ingredient.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.55, sebumRegulation: 0.30, antiAgingPotency: 0.60, brighteningEfficacy: 0.40, antiInflammatory: 0.55, barrierRepair: 0.75, exfoliationStrength: 0.00, antioxidantCapacity: 0.55, collagenStimulation: 0.45, sensitivityRisk: 0.08, photosensitivity: 0.00, phDependency: 0.25, molecularPenetration: 0.40, stabilityRating: 0.75, compatibilityScore: 0.90, clinicalEvidenceLevel: 0.75, marketSaturation: 0.60 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 5, optMax: 50, absMin: 1, absMax: 80, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Lactobacillus Ferment',
      slug: 'lactobacillus-ferment',
      inciName: 'Lactobacillus Ferment',
      casNumber: '96507-88-9',
      glanceText: 'Lactic acid bacteria ferment that supports microbiome balance and gentle exfoliation.',
      scanText: 'This ferment from Lactobacillus bacteria provides postbiotic benefits including lactic acid for gentle exfoliation and compounds that support healthy skin microbiome.',
      studyText: 'Lactobacillus ferments contain lactic acid (for mild exfoliation), bacteriocins (antimicrobial peptides), and metabolites that support commensal bacteria. Studies show improved skin hydration, reduced sensitivity, and better microbiome diversity. The lactic acid provides gentle exfoliation while other components strengthen barrier function. Particularly beneficial for skin with disrupted microbiome.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.50, sebumRegulation: 0.35, antiAgingPotency: 0.45, brighteningEfficacy: 0.45, antiInflammatory: 0.50, barrierRepair: 0.60, exfoliationStrength: 0.35, antioxidantCapacity: 0.35, collagenStimulation: 0.30, sensitivityRisk: 0.12, photosensitivity: 0.15, phDependency: 0.55, molecularPenetration: 0.45, stabilityRating: 0.70, compatibilityScore: 0.85, clinicalEvidenceLevel: 0.70, marketSaturation: 0.50 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 5, optMax: 30, absMin: 1, absMax: 50, context: 'facial', skinType: 'all' }]
    },
  ],

  // ============================================
  // AMINO ACIDS & DERIVATIVES
  // ============================================
  aminoAcids: [
    {
      title: 'N-Acetyl Glucosamine',
      slug: 'n-acetyl-glucosamine',
      inciName: 'N-Acetyl Glucosamine',
      casNumber: '7512-17-6',
      glanceText: 'Amino sugar that inhibits melanin production and supports hyaluronic acid synthesis.',
      scanText: 'NAG is a building block for hyaluronic acid and also inhibits tyrosinase. It provides brightening benefits while supporting skin hydration and barrier function.',
      studyText: 'N-Acetyl Glucosamine (NAG) is an amino sugar that serves as a precursor to hyaluronic acid synthesis. It also inhibits tyrosinase through a different mechanism than hydroquinone or arbutin. Studies show 2% NAG combined with niacinamide provides significant brightening, comparable to hydroquinone. It also improves skin hydration and may reduce appearance of fine lines through HA synthesis support.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.60, sebumRegulation: 0.20, antiAgingPotency: 0.45, brighteningEfficacy: 0.65, antiInflammatory: 0.30, barrierRepair: 0.50, exfoliationStrength: 0.15, antioxidantCapacity: 0.20, collagenStimulation: 0.35, sensitivityRisk: 0.08, photosensitivity: 0.00, phDependency: 0.30, molecularPenetration: 0.55, stabilityRating: 0.85, compatibilityScore: 0.90, clinicalEvidenceLevel: 0.80, marketSaturation: 0.55 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 2, optMax: 5, absMin: 1, absMax: 10, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Sodium PCA',
      slug: 'sodium-pca',
      inciName: 'Sodium PCA',
      casNumber: '28874-51-3',
      glanceText: 'Natural moisturizing factor component with exceptional water-binding capacity.',
      scanText: 'Sodium PCA (pyrrolidone carboxylic acid) is the sodium salt of PCA, a key component of skin\'s natural moisturizing factor. It attracts and binds water to the stratum corneum.',
      studyText: 'PCA is the most abundant component of the skin\'s natural moisturizing factor (NMF), comprising about 12% of NMF. Sodium PCA is highly hygroscopic, capable of absorbing moisture from the air. Studies show it\'s more effective than glycerin at low humidity. It penetrates the stratum corneum readily and integrates with existing NMF. Particularly effective in low-humidity environments.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.85, sebumRegulation: 0.15, antiAgingPotency: 0.30, brighteningEfficacy: 0.15, antiInflammatory: 0.20, barrierRepair: 0.45, exfoliationStrength: 0.00, antioxidantCapacity: 0.10, collagenStimulation: 0.15, sensitivityRisk: 0.05, photosensitivity: 0.00, phDependency: 0.15, molecularPenetration: 0.65, stabilityRating: 0.85, compatibilityScore: 0.95, clinicalEvidenceLevel: 0.80, marketSaturation: 0.65 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 2, optMax: 5, absMin: 0.5, absMax: 10, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Ectoin',
      slug: 'ectoin',
      inciName: 'Ectoin',
      casNumber: '96702-03-3',
      glanceText: 'Extremophile-derived amino acid derivative that protects cells from environmental stress.',
      scanText: 'Ectoin is produced by bacteria living in extreme environments. It forms a protective water shell around cells, shielding them from UV damage, pollution, and dryness.',
      studyText: 'Ectoin is a cyclic amino acid derivative from extremophilic bacteria. It creates a hydration shell around proteins and cell membranes, protecting them from environmental stressors. Studies show it reduces UV-induced cell damage, inhibits inflammation from air pollution particles, and prevents water loss. It also protects Langerhans cells (skin immune cells) from UV damage. Particularly effective for urban dwellers.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.70, sebumRegulation: 0.20, antiAgingPotency: 0.55, brighteningEfficacy: 0.25, antiInflammatory: 0.60, barrierRepair: 0.65, exfoliationStrength: 0.00, antioxidantCapacity: 0.60, collagenStimulation: 0.30, sensitivityRisk: 0.05, photosensitivity: 0.00, phDependency: 0.20, molecularPenetration: 0.50, stabilityRating: 0.90, compatibilityScore: 0.95, clinicalEvidenceLevel: 0.75, marketSaturation: 0.40 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 0.5, optMax: 2, absMin: 0.1, absMax: 5, context: 'facial', skinType: 'all' }]
    },
  ],

  // ============================================
  // ESSENTIAL RETINOIDS & VITAMINS (BASICS)
  // ============================================
  essentialVitamins: [
    {
      title: 'Retinol',
      slug: 'retinol',
      inciName: 'Retinol',
      casNumber: '68-26-8',
      glanceText: 'Gold standard vitamin A derivative for anti-aging, available OTC in various strengths.',
      scanText: 'Retinol is a potent vitamin A derivative that must be converted to retinoic acid in skin. It boosts collagen, speeds cell turnover, and fades dark spots. Start low (0.25%) and build tolerance.',
      studyText: 'Retinol undergoes a two-step conversion: first to retinaldehyde, then to retinoic acid (tretinoin). This conversion is rate-limited, providing gentler but slower effects than prescription retinoids. Clinical studies show 0.5% retinol improves fine wrinkles, mottled pigmentation, and skin roughness after 12 weeks. Higher concentrations (1%) work faster but increase irritation. Encapsulated forms improve stability and tolerability.',
      causesPurging: true,
      purgingDurationWeeks: 6,
      purgingDescription: 'Retinol accelerates cell turnover, bringing existing microcomedones to the surface. Purging typically resolves within 4-8 weeks.',
      tensor: { hydrationIndex: 0.20, sebumRegulation: 0.50, antiAgingPotency: 0.85, brighteningEfficacy: 0.70, antiInflammatory: 0.30, barrierRepair: 0.45, exfoliationStrength: 0.75, antioxidantCapacity: 0.40, collagenStimulation: 0.85, sensitivityRisk: 0.70, photosensitivity: 0.75, phDependency: 0.45, molecularPenetration: 0.70, stabilityRating: 0.30, compatibilityScore: 0.55, clinicalEvidenceLevel: 0.95, marketSaturation: 0.95 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 0.25, optMax: 1.0, absMin: 0.1, absMax: 2.0, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Vitamin K',
      slug: 'vitamin-k',
      inciName: 'Phytonadione',
      casNumber: '84-80-0',
      glanceText: 'Fat-soluble vitamin that helps reduce dark circles by improving blood clotting and capillary health.',
      scanText: 'Vitamin K (phytonadione) supports coagulation and vascular health. Applied topically, it may help reduce bruising and dark under-eye circles caused by visible blood vessels.',
      studyText: 'Vitamin K plays a key role in coagulation cascade and vascular integrity. Topical application studies show modest improvement in bruising, spider veins, and dark circles when used consistently. Often combined with retinol or vitamin C for enhanced effects on periorbital pigmentation. More research is needed, but it remains popular in eye creams due to its safety profile.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.25, sebumRegulation: 0.15, antiAgingPotency: 0.35, brighteningEfficacy: 0.45, antiInflammatory: 0.40, barrierRepair: 0.30, exfoliationStrength: 0.00, antioxidantCapacity: 0.30, collagenStimulation: 0.25, sensitivityRisk: 0.08, photosensitivity: 0.00, phDependency: 0.15, molecularPenetration: 0.45, stabilityRating: 0.60, compatibilityScore: 0.85, clinicalEvidenceLevel: 0.55, marketSaturation: 0.45 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 0.5, optMax: 2, absMin: 0.1, absMax: 5, context: 'periorbital', skinType: 'all' }]
    },
    {
      title: 'Vitamin B12',
      slug: 'vitamin-b12',
      inciName: 'Cyanocobalamin',
      casNumber: '68-19-9',
      glanceText: 'Essential B vitamin with anti-inflammatory properties, showing promise for eczema and skin inflammation.',
      scanText: 'Vitamin B12 (cyanocobalamin) has anti-inflammatory effects when applied topically. Studies show it can help reduce eczema symptoms and skin redness, likely through nitric oxide modulation.',
      studyText: 'Topical vitamin B12 inhibits nitric oxide synthase, reducing the inflammatory nitric oxide that contributes to eczema and dermatitis. Clinical trials show significant improvement in eczema severity comparable to mild topical steroids, without side effects. The distinctive pink color can temporarily tint skin. Particularly useful for maintenance therapy in atopic dermatitis.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.40, sebumRegulation: 0.20, antiAgingPotency: 0.30, brighteningEfficacy: 0.25, antiInflammatory: 0.75, barrierRepair: 0.55, exfoliationStrength: 0.00, antioxidantCapacity: 0.35, collagenStimulation: 0.20, sensitivityRisk: 0.05, photosensitivity: 0.00, phDependency: 0.20, molecularPenetration: 0.45, stabilityRating: 0.70, compatibilityScore: 0.90, clinicalEvidenceLevel: 0.70, marketSaturation: 0.30 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 0.07, optMax: 0.1, absMin: 0.01, absMax: 0.5, context: 'facial', skinType: 'sensitive' }]
    },
  ],

  // ============================================
  // SPECIALTY INGREDIENTS
  // ============================================
  specialty: [
    {
      title: 'Snail Mucin',
      slug: 'snail-mucin',
      inciName: 'Snail Secretion Filtrate',
      casNumber: '90243-13-1',
      glanceText: 'K-beauty staple containing natural hyaluronic acid, glycoproteins, and copper peptides for hydration and healing.',
      scanText: 'Snail secretion filtrate is a complex mixture of hyaluronic acid, glycoprotein enzymes, copper peptides, and antimicrobial peptides. It hydrates, promotes wound healing, and has antioxidant properties.',
      studyText: 'Snail mucin (Cryptomphalus aspersa secretion) contains a unique combination of allantoin, glycolic acid, collagen, elastin, and antimicrobial peptides. Studies show accelerated wound healing, reduced scar formation, and improved skin texture. The glycoprotein components stimulate fibroblast proliferation and extracellular matrix production. Popular in Korean skincare for its multi-functional benefits and safety profile.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.80, sebumRegulation: 0.30, antiAgingPotency: 0.55, brighteningEfficacy: 0.40, antiInflammatory: 0.55, barrierRepair: 0.70, exfoliationStrength: 0.15, antioxidantCapacity: 0.50, collagenStimulation: 0.55, sensitivityRisk: 0.10, photosensitivity: 0.00, phDependency: 0.25, molecularPenetration: 0.50, stabilityRating: 0.70, compatibilityScore: 0.90, clinicalEvidenceLevel: 0.65, marketSaturation: 0.60 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 80, optMax: 96, absMin: 30, absMax: 100, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Epidermal Growth Factor (EGF)',
      slug: 'epidermal-growth-factor',
      inciName: 'sh-Oligopeptide-1',
      casNumber: '62253-63-8',
      glanceText: 'Bioengineered growth factor that stimulates cell renewal and wound healing at the molecular level.',
      scanText: 'EGF is a signaling protein that binds to EGF receptors, triggering cell proliferation and wound healing. Bioengineered versions are used in premium anti-aging products.',
      studyText: 'Epidermal Growth Factor binds to EGFR receptors, activating signaling cascades that promote keratinocyte proliferation and migration. Originally developed for wound healing, it\'s now used in anti-aging formulations. Clinical studies show improvements in fine wrinkles and skin texture. Concerns about promoting abnormal cell growth are addressed by its inability to penetrate past the epidermis. Best results when combined with other growth factors.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.40, sebumRegulation: 0.25, antiAgingPotency: 0.80, brighteningEfficacy: 0.35, antiInflammatory: 0.40, barrierRepair: 0.65, exfoliationStrength: 0.10, antioxidantCapacity: 0.25, collagenStimulation: 0.75, sensitivityRisk: 0.12, photosensitivity: 0.00, phDependency: 0.40, molecularPenetration: 0.35, stabilityRating: 0.45, compatibilityScore: 0.75, clinicalEvidenceLevel: 0.75, marketSaturation: 0.35 },
      goldilocks: [{ name: 'concentration', unit: 'ppm', optMin: 1, optMax: 10, absMin: 0.1, absMax: 50, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Madecassoside',
      slug: 'madecassoside',
      inciName: 'Madecassoside',
      casNumber: '34540-22-2',
      glanceText: 'Purified triterpene from Centella asiatica with powerful wound healing and anti-inflammatory properties.',
      scanText: 'Madecassoside is one of the key active compounds in Centella asiatica. It promotes collagen synthesis, reduces inflammation, and accelerates wound healing.',
      studyText: 'Madecassoside is a triterpenoid saponin that stimulates type I collagen synthesis via the TGF-β pathway. It also inhibits inflammatory cytokines and promotes wound healing. Studies show it\'s particularly effective for post-procedure healing and sensitive skin. Unlike crude Centella extract, the purified compound is more potent and less likely to cause sensitization.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.45, sebumRegulation: 0.25, antiAgingPotency: 0.55, brighteningEfficacy: 0.30, antiInflammatory: 0.85, barrierRepair: 0.75, exfoliationStrength: 0.00, antioxidantCapacity: 0.55, collagenStimulation: 0.70, sensitivityRisk: 0.05, photosensitivity: 0.00, phDependency: 0.20, molecularPenetration: 0.50, stabilityRating: 0.80, compatibilityScore: 0.95, clinicalEvidenceLevel: 0.80, marketSaturation: 0.45 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 0.1, optMax: 1, absMin: 0.05, absMax: 2, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Asiaticoside',
      slug: 'asiaticoside',
      inciName: 'Asiaticoside',
      casNumber: '16830-15-2',
      glanceText: 'Another key Centella triterpene that boosts collagen, reduces scars, and calms inflammation.',
      scanText: 'Asiaticoside works synergistically with madecassoside in Centella asiatica. It enhances collagen production and has documented wound-healing and anti-scarring properties.',
      studyText: 'Asiaticoside stimulates collagen synthesis by increasing procollagen I and III production. It also increases tensile strength of healing wounds and reduces hypertrophic scarring. Clinical studies show improvement in keloid scars and stretch marks. Often used together with madecassoside for comprehensive Centella benefits.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.40, sebumRegulation: 0.20, antiAgingPotency: 0.55, brighteningEfficacy: 0.30, antiInflammatory: 0.80, barrierRepair: 0.70, exfoliationStrength: 0.00, antioxidantCapacity: 0.50, collagenStimulation: 0.75, sensitivityRisk: 0.08, photosensitivity: 0.00, phDependency: 0.20, molecularPenetration: 0.45, stabilityRating: 0.75, compatibilityScore: 0.92, clinicalEvidenceLevel: 0.80, marketSaturation: 0.40 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 0.1, optMax: 1, absMin: 0.05, absMax: 2, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Propolis Extract',
      slug: 'propolis-extract',
      inciName: 'Propolis Extract',
      casNumber: '8028-66-8',
      glanceText: 'Bee-derived resinous mixture with antimicrobial, anti-inflammatory, and wound-healing properties.',
      scanText: 'Propolis is a resin collected and processed by bees. It contains flavonoids, phenolic compounds, and antimicrobial agents that benefit acne-prone and damaged skin.',
      studyText: 'Propolis contains over 300 compounds including flavonoids, phenolic acids, and caffeic acid phenethyl ester (CAPE). It has documented antibacterial, antifungal, antiviral, and anti-inflammatory activities. Studies show accelerated wound healing, reduced acne lesions, and improved barrier function. Popular in Korean skincare. Note: those with bee allergies should avoid.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.45, sebumRegulation: 0.45, antiAgingPotency: 0.45, brighteningEfficacy: 0.35, antiInflammatory: 0.70, barrierRepair: 0.65, exfoliationStrength: 0.05, antioxidantCapacity: 0.75, collagenStimulation: 0.45, sensitivityRisk: 0.25, photosensitivity: 0.00, phDependency: 0.30, molecularPenetration: 0.50, stabilityRating: 0.75, compatibilityScore: 0.80, clinicalEvidenceLevel: 0.70, marketSaturation: 0.55 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 5, optMax: 50, absMin: 1, absMax: 80, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Bee Venom',
      slug: 'bee-venom',
      inciName: 'Bee Venom',
      casNumber: '91-07-6',
      glanceText: 'Apitoxin that "tricks" skin into healing mode, stimulating collagen production and circulation.',
      scanText: 'Bee venom (apitoxin) causes a mild inflammatory response that signals skin to produce collagen and increase blood flow, creating a natural "lifting" effect.',
      studyText: 'Bee venom contains melittin, apamin, and other peptides that stimulate blood circulation and collagen/elastin production through a controlled inflammatory response. Clinical studies show improvement in wrinkle count, total wrinkle area, and skin elasticity. The "sting" effect tightens skin. Must be ethically sourced without harming bees. Contraindicated for those with bee allergies.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.30, sebumRegulation: 0.35, antiAgingPotency: 0.70, brighteningEfficacy: 0.30, antiInflammatory: 0.20, barrierRepair: 0.45, exfoliationStrength: 0.05, antioxidantCapacity: 0.35, collagenStimulation: 0.75, sensitivityRisk: 0.45, photosensitivity: 0.00, phDependency: 0.25, molecularPenetration: 0.55, stabilityRating: 0.65, compatibilityScore: 0.70, clinicalEvidenceLevel: 0.65, marketSaturation: 0.35 },
      goldilocks: [{ name: 'concentration', unit: 'ppm', optMin: 100, optMax: 1000, absMin: 50, absMax: 3000, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Royal Jelly',
      slug: 'royal-jelly',
      inciName: 'Royal Jelly Extract',
      casNumber: '8031-67-2',
      glanceText: 'Nutrient-rich bee secretion containing proteins, vitamins, and fatty acids for skin nourishment.',
      scanText: 'Royal jelly is a secretion from worker bees used to feed queen bees. It contains unique proteins (royalactin), B vitamins, amino acids, and 10-HDA fatty acid with skin benefits.',
      studyText: 'Royal jelly contains 10-hydroxy-2-decenoic acid (10-HDA), a unique fatty acid with collagen-boosting and antimicrobial properties. Studies show it increases procollagen production and has antioxidant effects. The protein royalactin promotes cell proliferation. Traditionally used for skin rejuvenation. Must be freshly preserved as it degrades quickly.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.55, sebumRegulation: 0.30, antiAgingPotency: 0.55, brighteningEfficacy: 0.35, antiInflammatory: 0.50, barrierRepair: 0.60, exfoliationStrength: 0.00, antioxidantCapacity: 0.55, collagenStimulation: 0.60, sensitivityRisk: 0.20, photosensitivity: 0.00, phDependency: 0.25, molecularPenetration: 0.45, stabilityRating: 0.40, compatibilityScore: 0.80, clinicalEvidenceLevel: 0.60, marketSaturation: 0.40 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 1, optMax: 10, absMin: 0.5, absMax: 20, context: 'facial', skinType: 'all' }]
    },
  ],

  // ============================================
  // ADDITIONAL ACTIVES
  // ============================================
  additionalActives: [
    {
      title: 'Hydroquinone',
      slug: 'hydroquinone',
      inciName: 'Hydroquinone',
      casNumber: '123-31-9',
      glanceText: 'Most potent tyrosinase inhibitor for hyperpigmentation, available by prescription in most countries.',
      scanText: 'Hydroquinone is the most effective skin lightening agent, directly inhibiting tyrosinase enzyme. Due to safety concerns with long-term use, it\'s restricted to prescription in many countries.',
      studyText: 'Hydroquinone inhibits tyrosinase by competing with tyrosine as a substrate. At 2-4% concentration, it\'s the most effective depigmenting agent available. However, long-term use risks ochronosis (paradoxical darkening) and potential carcinogenicity concerns have led to OTC bans in EU, Japan, and Australia. US allows 2% OTC, 4% Rx. Use should be limited to 3-6 months with breaks.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.15, sebumRegulation: 0.15, antiAgingPotency: 0.35, brighteningEfficacy: 0.98, antiInflammatory: 0.10, barrierRepair: 0.10, exfoliationStrength: 0.15, antioxidantCapacity: 0.20, collagenStimulation: 0.10, sensitivityRisk: 0.55, photosensitivity: 0.65, phDependency: 0.50, molecularPenetration: 0.75, stabilityRating: 0.30, compatibilityScore: 0.45, clinicalEvidenceLevel: 0.98, marketSaturation: 0.50 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 2, optMax: 4, absMin: 1, absMax: 4, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Idebenone',
      slug: 'idebenone',
      inciName: 'Idebenone',
      casNumber: '58186-27-9',
      glanceText: 'Synthetic CoQ10 analog with superior antioxidant activity, protecting against oxidative stress.',
      scanText: 'Idebenone is a synthetic derivative of CoQ10 with more potent antioxidant properties. It protects mitochondria from free radical damage and has the highest Environmental Protection Factor (EPF).',
      studyText: 'Idebenone scored the highest Environmental Protection Factor (EPF = 95) in comparative antioxidant studies, outperforming vitamin C, E, CoQ10, and lipoic acid. It protects against UV and pollution-induced oxidative damage at the mitochondrial level. Studies show reduction in fine lines, improvement in skin roughness, and protection against infrared radiation damage. Used in premium anti-aging formulations.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.35, sebumRegulation: 0.20, antiAgingPotency: 0.75, brighteningEfficacy: 0.40, antiInflammatory: 0.50, barrierRepair: 0.45, exfoliationStrength: 0.00, antioxidantCapacity: 0.95, collagenStimulation: 0.50, sensitivityRisk: 0.15, photosensitivity: 0.00, phDependency: 0.30, molecularPenetration: 0.60, stabilityRating: 0.75, compatibilityScore: 0.80, clinicalEvidenceLevel: 0.80, marketSaturation: 0.30 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 0.5, optMax: 1, absMin: 0.1, absMax: 2, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Coenzyme Q10',
      slug: 'coenzyme-q10',
      inciName: 'Ubiquinone',
      casNumber: '303-98-0',
      glanceText: 'Essential cellular antioxidant that decreases with age, supporting energy production and protection.',
      scanText: 'CoQ10 is naturally present in cells but declines with age. Applied topically, it provides antioxidant protection and supports cellular energy production in skin.',
      studyText: 'Ubiquinone (CoQ10) is essential for mitochondrial electron transport and ATP production. Its levels in skin decline by about 30% by age 30 and 40% by age 40. Topical application replenishes levels, reduces oxidative damage, and decreases wrinkle depth in clinical studies. Works synergistically with vitamin E. The oxidized form (ubiquinol) may penetrate better.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.40, sebumRegulation: 0.25, antiAgingPotency: 0.65, brighteningEfficacy: 0.30, antiInflammatory: 0.45, barrierRepair: 0.45, exfoliationStrength: 0.00, antioxidantCapacity: 0.80, collagenStimulation: 0.45, sensitivityRisk: 0.08, photosensitivity: 0.00, phDependency: 0.25, molecularPenetration: 0.45, stabilityRating: 0.60, compatibilityScore: 0.85, clinicalEvidenceLevel: 0.75, marketSaturation: 0.70 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 0.05, optMax: 0.3, absMin: 0.01, absMax: 1, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Lipoic Acid',
      slug: 'lipoic-acid',
      inciName: 'Alpha Lipoic Acid',
      casNumber: '1077-28-7',
      glanceText: 'Universal antioxidant that works in both water and fat, regenerating other antioxidants.',
      scanText: 'Alpha lipoic acid is unique in being both water and fat soluble, allowing it to work throughout the cell. It also regenerates vitamins C and E, extending their activity.',
      studyText: 'Alpha lipoic acid is a universal antioxidant that recycles vitamins C, E, and glutathione. Studies show it reduces fine lines, improves skin texture, and shrinks pore size. Its ability to chelate metals adds to its anti-aging effects. However, it can sting upon application and may be photosensitizing. Best used in PM routines.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.30, sebumRegulation: 0.40, antiAgingPotency: 0.70, brighteningEfficacy: 0.45, antiInflammatory: 0.55, barrierRepair: 0.40, exfoliationStrength: 0.15, antioxidantCapacity: 0.85, collagenStimulation: 0.55, sensitivityRisk: 0.35, photosensitivity: 0.25, phDependency: 0.40, molecularPenetration: 0.70, stabilityRating: 0.50, compatibilityScore: 0.70, clinicalEvidenceLevel: 0.75, marketSaturation: 0.45 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 0.5, optMax: 1, absMin: 0.1, absMax: 5, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Carnosine',
      slug: 'carnosine',
      inciName: 'Carnosine',
      casNumber: '305-84-0',
      glanceText: 'Dipeptide that fights glycation and protects proteins from sugar-induced damage and aging.',
      scanText: 'Carnosine is a naturally occurring dipeptide that prevents glycation—the process where sugars attach to proteins, causing stiffness and wrinkles. It also has antioxidant properties.',
      studyText: 'Carnosine (beta-alanyl-L-histidine) inhibits advanced glycation end products (AGEs) that cause collagen cross-linking and skin stiffening. It also has antioxidant and metal-chelating properties. Studies show it can reverse some existing glycation damage. Particularly important for diabetics and those with high-sugar diets, as glycation accelerates skin aging.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.35, sebumRegulation: 0.15, antiAgingPotency: 0.65, brighteningEfficacy: 0.25, antiInflammatory: 0.40, barrierRepair: 0.40, exfoliationStrength: 0.00, antioxidantCapacity: 0.70, collagenStimulation: 0.55, sensitivityRisk: 0.05, photosensitivity: 0.00, phDependency: 0.30, molecularPenetration: 0.55, stabilityRating: 0.70, compatibilityScore: 0.90, clinicalEvidenceLevel: 0.70, marketSaturation: 0.30 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 0.5, optMax: 2, absMin: 0.1, absMax: 5, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Niacinamide',
      slug: 'niacinamide',
      inciName: 'Niacinamide',
      casNumber: '98-92-0',
      glanceText: 'Vitamin B3 powerhouse that addresses multiple skin concerns: pores, oil, wrinkles, and pigmentation.',
      scanText: 'Niacinamide is a versatile form of vitamin B3 that strengthens skin barrier, reduces sebum production, minimizes pores, fades pigmentation, and has anti-inflammatory properties.',
      studyText: 'Niacinamide increases ceramide and fatty acid synthesis, strengthening the skin barrier. It inhibits melanosome transfer (not tyrosinase), reducing hyperpigmentation without the risks of tyrosinase inhibitors. At 2-5%, it regulates sebum production and improves pore appearance. Studies show it\'s as effective as 2% hydroquinone for brightening with better safety. Works well with virtually all other actives.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.55, sebumRegulation: 0.75, antiAgingPotency: 0.60, brighteningEfficacy: 0.70, antiInflammatory: 0.65, barrierRepair: 0.80, exfoliationStrength: 0.05, antioxidantCapacity: 0.50, collagenStimulation: 0.45, sensitivityRisk: 0.10, photosensitivity: 0.00, phDependency: 0.35, molecularPenetration: 0.60, stabilityRating: 0.90, compatibilityScore: 0.95, clinicalEvidenceLevel: 0.95, marketSaturation: 0.95 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 2, optMax: 10, absMin: 1, absMax: 20, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'DMAE',
      slug: 'dmae',
      inciName: 'Dimethyl MEA',
      casNumber: '108-01-0',
      glanceText: 'Membrane-stabilizing compound that provides instant skin firming through muscle tonicity effects.',
      scanText: 'DMAE (dimethylaminoethanol) is a precursor to acetylcholine that produces immediate firming effects by affecting muscle cell membrane potential.',
      studyText: 'DMAE stabilizes cell membranes and increases acetylcholine production. Studies show rapid improvement in skin firmness and neck sagging, with effects visible within 30 minutes. The mechanism involves vacuolization of fibroblasts and keratinocytes, essentially "plumping" cells temporarily. Used in instant-lift serums. Effects are partially temporary but cumulative with regular use.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.30, sebumRegulation: 0.20, antiAgingPotency: 0.60, brighteningEfficacy: 0.15, antiInflammatory: 0.25, barrierRepair: 0.35, exfoliationStrength: 0.00, antioxidantCapacity: 0.35, collagenStimulation: 0.40, sensitivityRisk: 0.20, photosensitivity: 0.00, phDependency: 0.35, molecularPenetration: 0.65, stabilityRating: 0.70, compatibilityScore: 0.75, clinicalEvidenceLevel: 0.70, marketSaturation: 0.40 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 1, optMax: 3, absMin: 0.5, absMax: 5, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'MSM (Methylsulfonylmethane)',
      slug: 'msm',
      inciName: 'Dimethyl Sulfone',
      casNumber: '67-71-0',
      glanceText: 'Organic sulfur compound that supports keratin and collagen synthesis for stronger skin and hair.',
      scanText: 'MSM provides bioavailable sulfur needed for the disulfide bonds in keratin and collagen. It also has anti-inflammatory effects and improves skin permeability.',
      studyText: 'Methylsulfonylmethane is a source of organic sulfur essential for structural proteins. Sulfur is needed for the disulfide bridges in keratin (hair, nails) and collagen (skin). Studies show MSM improves skin smoothness, reduces roughness, and enhances the penetration of other ingredients. Its anti-inflammatory properties benefit acne and rosacea.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.45, sebumRegulation: 0.25, antiAgingPotency: 0.45, brighteningEfficacy: 0.20, antiInflammatory: 0.55, barrierRepair: 0.50, exfoliationStrength: 0.00, antioxidantCapacity: 0.35, collagenStimulation: 0.55, sensitivityRisk: 0.08, photosensitivity: 0.00, phDependency: 0.20, molecularPenetration: 0.65, stabilityRating: 0.85, compatibilityScore: 0.90, clinicalEvidenceLevel: 0.65, marketSaturation: 0.35 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 2, optMax: 5, absMin: 1, absMax: 15, context: 'facial', skinType: 'all' }]
    },
  ],

  // ============================================
  // MORE NATURAL EXTRACTS
  // ============================================
  naturalExtracts: [
    {
      title: 'Willow Bark Extract',
      slug: 'willow-bark-extract',
      inciName: 'Salix Alba Bark Extract',
      casNumber: '84082-82-6',
      glanceText: 'Natural source of salicin that converts to salicylic acid in skin, providing gentle exfoliation.',
      scanText: 'Willow bark contains salicin, which converts to salicylic acid in the skin. It provides natural, gentler exfoliation along with anti-inflammatory and antibacterial benefits.',
      studyText: 'Willow bark extract contains salicin (1-2%), tannins, and flavonoids. The salicin hydrolyzes to salicyl alcohol and is further oxidized to salicylic acid in skin, providing a sustained-release BHA effect. The additional compounds provide antioxidant and anti-inflammatory benefits not found in pure salicylic acid. Popular for natural/clean beauty formulations.',
      causesPurging: true,
      purgingDurationWeeks: 3,
      purgingDescription: 'Mild purging possible due to salicylic acid conversion. Generally gentler than synthetic BHA.',
      tensor: { hydrationIndex: 0.30, sebumRegulation: 0.60, antiAgingPotency: 0.40, brighteningEfficacy: 0.45, antiInflammatory: 0.55, barrierRepair: 0.30, exfoliationStrength: 0.55, antioxidantCapacity: 0.45, collagenStimulation: 0.25, sensitivityRisk: 0.30, photosensitivity: 0.25, phDependency: 0.60, molecularPenetration: 0.55, stabilityRating: 0.70, compatibilityScore: 0.70, clinicalEvidenceLevel: 0.65, marketSaturation: 0.55 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 1, optMax: 5, absMin: 0.5, absMax: 10, context: 'facial', skinType: 'oily' }]
    },
    {
      title: 'Sake (Rice Ferment)',
      slug: 'sake-rice-ferment',
      inciName: 'Aspergillus/Rice Ferment Filtrate',
      casNumber: 'N/A',
      glanceText: 'Traditional Japanese ferment rich in kojic acid, amino acids, and organic acids for brightening.',
      scanText: 'Sake ferment (Aspergillus oryzae) naturally produces kojic acid, lactic acid, and amino acids. It brightens skin and provides gentle exfoliation with hydrating benefits.',
      studyText: 'Rice fermented with Aspergillus oryzae produces multiple beneficial compounds: kojic acid (tyrosinase inhibitor), lactic acid (gentle AHA), ferulic acid (antioxidant), and amino acids (NMF components). Traditional Japanese sake brewers are known for their remarkably smooth, white hands. The filtrate provides multi-functional benefits similar to galactomyces ferment.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.55, sebumRegulation: 0.35, antiAgingPotency: 0.50, brighteningEfficacy: 0.70, antiInflammatory: 0.40, barrierRepair: 0.50, exfoliationStrength: 0.25, antioxidantCapacity: 0.50, collagenStimulation: 0.35, sensitivityRisk: 0.12, photosensitivity: 0.10, phDependency: 0.45, molecularPenetration: 0.50, stabilityRating: 0.70, compatibilityScore: 0.85, clinicalEvidenceLevel: 0.65, marketSaturation: 0.40 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 30, optMax: 90, absMin: 10, absMax: 100, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Turmeric Extract',
      slug: 'turmeric-extract',
      inciName: 'Curcuma Longa Root Extract',
      casNumber: '84775-52-0',
      glanceText: 'Anti-inflammatory spice extract with antioxidant and brightening properties, though it can stain.',
      scanText: 'Turmeric contains curcumin, a powerful anti-inflammatory and antioxidant. It can help with acne, reduce hyperpigmentation, and protect against oxidative damage.',
      studyText: 'Curcumin, the active compound in turmeric, inhibits NF-κB, reducing inflammation and melanin production. Studies show improvement in acne, hyperpigmentation, and oxidative stress markers. However, pure turmeric can temporarily stain skin yellow-orange. Tetrahydrocurcumin (colorless derivative) provides similar benefits without staining.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.35, sebumRegulation: 0.40, antiAgingPotency: 0.55, brighteningEfficacy: 0.65, antiInflammatory: 0.80, barrierRepair: 0.45, exfoliationStrength: 0.05, antioxidantCapacity: 0.80, collagenStimulation: 0.40, sensitivityRisk: 0.20, photosensitivity: 0.15, phDependency: 0.30, molecularPenetration: 0.45, stabilityRating: 0.55, compatibilityScore: 0.75, clinicalEvidenceLevel: 0.70, marketSaturation: 0.50 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 0.5, optMax: 2, absMin: 0.1, absMax: 5, context: 'facial', skinType: 'all' }]
    },
  ],

  // ============================================
  // FINAL ESSENTIALS (to reach 100+)
  // ============================================
  finalEssentials: [
    {
      title: 'Aloe Vera',
      slug: 'aloe-vera',
      inciName: 'Aloe Barbadensis Leaf Juice',
      casNumber: '85507-69-3',
      glanceText: 'Universal soothing gel rich in polysaccharides for hydration, healing, and calming irritation.',
      scanText: 'Aloe vera contains acemannan and other polysaccharides that soothe, hydrate, and promote wound healing. It\'s one of the most versatile and well-tolerated skincare ingredients.',
      studyText: 'Aloe vera gel contains over 75 bioactive compounds including polysaccharides (acemannan), vitamins, enzymes, and amino acids. Studies show accelerated wound healing, reduced inflammation, and antimicrobial activity. It increases hyaluronic acid and collagen in treated skin.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.75, sebumRegulation: 0.25, antiAgingPotency: 0.30, brighteningEfficacy: 0.20, antiInflammatory: 0.70, barrierRepair: 0.55, exfoliationStrength: 0.05, antioxidantCapacity: 0.45, collagenStimulation: 0.35, sensitivityRisk: 0.05, photosensitivity: 0.00, phDependency: 0.15, molecularPenetration: 0.45, stabilityRating: 0.50, compatibilityScore: 0.95, clinicalEvidenceLevel: 0.80, marketSaturation: 0.95 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 10, optMax: 99, absMin: 1, absMax: 100, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Tea Tree Oil',
      slug: 'tea-tree-oil',
      inciName: 'Melaleuca Alternifolia Leaf Oil',
      casNumber: '68647-73-4',
      glanceText: 'Powerful antimicrobial essential oil effective against acne-causing bacteria and fungi.',
      scanText: 'Tea tree oil contains terpinen-4-ol, which has broad-spectrum antimicrobial activity. At 5% concentration, it\'s as effective as benzoyl peroxide for acne with less irritation.',
      studyText: 'Tea tree oil\'s antimicrobial activity comes primarily from terpinen-4-ol (minimum 30% in quality oils). Studies show 5% tea tree oil is comparable to 5% benzoyl peroxide for acne with fewer side effects.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.10, sebumRegulation: 0.65, antiAgingPotency: 0.15, brighteningEfficacy: 0.20, antiInflammatory: 0.55, barrierRepair: 0.20, exfoliationStrength: 0.10, antioxidantCapacity: 0.40, collagenStimulation: 0.10, sensitivityRisk: 0.40, photosensitivity: 0.10, phDependency: 0.20, molecularPenetration: 0.60, stabilityRating: 0.65, compatibilityScore: 0.60, clinicalEvidenceLevel: 0.80, marketSaturation: 0.75 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 1, optMax: 5, absMin: 0.5, absMax: 15, context: 'facial', skinType: 'oily' }]
    },
    {
      title: 'Shea Butter',
      slug: 'shea-butter',
      inciName: 'Butyrospermum Parkii Butter',
      casNumber: '91080-23-8',
      glanceText: 'Rich African nut butter high in fatty acids and vitamins for deep moisturization.',
      scanText: 'Shea butter is rich in stearic and oleic acids plus vitamins A, E, and F. It provides excellent occlusion and emollience, especially for dry skin and barrier repair.',
      studyText: 'Shea butter contains unsaponifiable fractions (5-17%) including cinnamic acid esters, triterpenes, and phytosterols that provide anti-inflammatory and antioxidant benefits beyond simple emollience.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.75, sebumRegulation: 0.15, antiAgingPotency: 0.40, brighteningEfficacy: 0.15, antiInflammatory: 0.50, barrierRepair: 0.80, exfoliationStrength: 0.00, antioxidantCapacity: 0.45, collagenStimulation: 0.30, sensitivityRisk: 0.15, photosensitivity: 0.00, phDependency: 0.05, molecularPenetration: 0.35, stabilityRating: 0.85, compatibilityScore: 0.85, clinicalEvidenceLevel: 0.70, marketSaturation: 0.80 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 5, optMax: 30, absMin: 1, absMax: 100, context: 'facial', skinType: 'dry' }]
    },
    {
      title: 'Calendula Extract',
      slug: 'calendula-extract',
      inciName: 'Calendula Officinalis Flower Extract',
      casNumber: '84776-23-8',
      glanceText: 'Gentle healing flower extract known for wound healing and soothing sensitive, irritated skin.',
      scanText: 'Calendula (marigold) contains flavonoids and triterpenes that promote wound healing and reduce inflammation. It\'s gentle enough for babies and sensitive skin.',
      studyText: 'Calendula\'s wound-healing properties come from triterpene glycosides and flavonoids that stimulate granulation tissue formation and epithelialization. Clinical studies show accelerated wound healing.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.50, sebumRegulation: 0.20, antiAgingPotency: 0.30, brighteningEfficacy: 0.20, antiInflammatory: 0.75, barrierRepair: 0.65, exfoliationStrength: 0.00, antioxidantCapacity: 0.50, collagenStimulation: 0.40, sensitivityRisk: 0.05, photosensitivity: 0.00, phDependency: 0.15, molecularPenetration: 0.40, stabilityRating: 0.70, compatibilityScore: 0.95, clinicalEvidenceLevel: 0.75, marketSaturation: 0.65 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 1, optMax: 10, absMin: 0.5, absMax: 30, context: 'facial', skinType: 'sensitive' }]
    },
    {
      title: 'Chamomile Extract',
      slug: 'chamomile-extract',
      inciName: 'Chamomilla Recutita Flower Extract',
      casNumber: '84649-86-5',
      glanceText: 'Calming flower extract with anti-inflammatory and antioxidant properties for sensitive skin.',
      scanText: 'German chamomile contains bisabolol, chamazulene, and apigenin that soothe irritation and reduce inflammation. Excellent for reactive and rosacea-prone skin.',
      studyText: 'Chamomile\'s anti-inflammatory effects come from alpha-bisabolol, chamazulene, and the flavonoid apigenin. Studies show it reduces skin roughness and calms inflammation comparable to hydrocortisone.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.50, sebumRegulation: 0.25, antiAgingPotency: 0.35, brighteningEfficacy: 0.25, antiInflammatory: 0.80, barrierRepair: 0.55, exfoliationStrength: 0.00, antioxidantCapacity: 0.55, collagenStimulation: 0.30, sensitivityRisk: 0.10, photosensitivity: 0.00, phDependency: 0.15, molecularPenetration: 0.45, stabilityRating: 0.65, compatibilityScore: 0.90, clinicalEvidenceLevel: 0.75, marketSaturation: 0.75 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 1, optMax: 5, absMin: 0.5, absMax: 20, context: 'facial', skinType: 'sensitive' }]
    },
    {
      title: 'Argan Oil',
      slug: 'argan-oil',
      inciName: 'Argania Spinosa Kernel Oil',
      casNumber: '223747-87-3',
      glanceText: 'Moroccan "liquid gold" rich in vitamin E and fatty acids for dry skin and hair.',
      scanText: 'Argan oil is pressed from Moroccan argan tree nuts. It\'s rich in oleic acid, linoleic acid, and vitamin E, providing excellent moisturization without heaviness.',
      studyText: 'Argan oil contains about 80% unsaturated fatty acids (oleic and linoleic), vitamin E (tocopherols), squalene, and sterols. Studies show improved skin elasticity and enhanced barrier function.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.65, sebumRegulation: 0.45, antiAgingPotency: 0.50, brighteningEfficacy: 0.25, antiInflammatory: 0.45, barrierRepair: 0.70, exfoliationStrength: 0.00, antioxidantCapacity: 0.65, collagenStimulation: 0.35, sensitivityRisk: 0.08, photosensitivity: 0.00, phDependency: 0.05, molecularPenetration: 0.50, stabilityRating: 0.75, compatibilityScore: 0.85, clinicalEvidenceLevel: 0.70, marketSaturation: 0.80 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 5, optMax: 100, absMin: 1, absMax: 100, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Olive Squalane',
      slug: 'olive-squalane',
      inciName: 'Squalane',
      casNumber: '111-01-3',
      glanceText: 'Stable, plant-derived version of natural skin lipid that hydrates without clogging pores.',
      scanText: 'Squalane is the stable, hydrogenated form of squalene—a lipid naturally found in human sebum. It provides lightweight, non-comedogenic moisture that mimics skin\'s own oils.',
      studyText: 'Squalane is a stable emollient that\'s naturally present in human sebum (12% of skin surface lipids). It penetrates quickly and is non-comedogenic. Suitable for all skin types including acne-prone.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.65, sebumRegulation: 0.55, antiAgingPotency: 0.40, brighteningEfficacy: 0.15, antiInflammatory: 0.35, barrierRepair: 0.70, exfoliationStrength: 0.00, antioxidantCapacity: 0.30, collagenStimulation: 0.25, sensitivityRisk: 0.03, photosensitivity: 0.00, phDependency: 0.05, molecularPenetration: 0.60, stabilityRating: 0.95, compatibilityScore: 0.95, clinicalEvidenceLevel: 0.80, marketSaturation: 0.80 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 5, optMax: 100, absMin: 1, absMax: 100, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Colloidal Oatmeal',
      slug: 'colloidal-oatmeal',
      inciName: 'Avena Sativa Kernel Flour',
      casNumber: '84012-26-0',
      glanceText: 'FDA-recognized skin protectant with anti-itch and barrier-supporting properties.',
      scanText: 'Colloidal oatmeal is finely ground oat flour recognized by FDA as a skin protectant. It contains beta-glucan, avenanthramides, and lipids that soothe, protect, and repair skin.',
      studyText: 'Colloidal oatmeal contains beta-glucan (moisturizing), avenanthramides (antioxidant, anti-inflammatory), saponins (cleansing), and lipids. FDA-approved as a skin protectant for eczema and dry skin.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.65, sebumRegulation: 0.20, antiAgingPotency: 0.30, brighteningEfficacy: 0.20, antiInflammatory: 0.75, barrierRepair: 0.80, exfoliationStrength: 0.05, antioxidantCapacity: 0.55, collagenStimulation: 0.25, sensitivityRisk: 0.05, photosensitivity: 0.00, phDependency: 0.15, molecularPenetration: 0.40, stabilityRating: 0.85, compatibilityScore: 0.95, clinicalEvidenceLevel: 0.90, marketSaturation: 0.75 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 1, optMax: 3, absMin: 0.5, absMax: 5, context: 'facial', skinType: 'sensitive' }]
    },
    {
      title: 'Honey',
      slug: 'honey',
      inciName: 'Mel Extract',
      casNumber: '8028-66-8',
      glanceText: 'Natural humectant with antimicrobial and wound-healing properties, especially Manuka variety.',
      scanText: 'Honey is a natural humectant with antimicrobial activity from hydrogen peroxide and methylglyoxal (in Manuka). It draws moisture to skin and promotes wound healing.',
      studyText: 'Honey\'s benefits come from its high sugar content (humectant), hydrogen peroxide production, low pH, and in Manuka honey, methylglyoxal. Studies show accelerated wound healing and improved skin hydration.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.70, sebumRegulation: 0.25, antiAgingPotency: 0.35, brighteningEfficacy: 0.30, antiInflammatory: 0.55, barrierRepair: 0.60, exfoliationStrength: 0.10, antioxidantCapacity: 0.50, collagenStimulation: 0.35, sensitivityRisk: 0.10, photosensitivity: 0.00, phDependency: 0.25, molecularPenetration: 0.40, stabilityRating: 0.90, compatibilityScore: 0.85, clinicalEvidenceLevel: 0.80, marketSaturation: 0.70 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 5, optMax: 30, absMin: 1, absMax: 100, context: 'facial', skinType: 'all' }]
    },
    {
      title: 'Caffeine',
      slug: 'caffeine',
      inciName: 'Caffeine',
      casNumber: '58-08-2',
      glanceText: 'Stimulant that constricts blood vessels to reduce puffiness and dark circles under eyes.',
      scanText: 'Caffeine topically constricts blood vessels, reducing puffiness. It also has antioxidant properties and can temporarily reduce the appearance of cellulite.',
      studyText: 'Caffeine inhibits phosphodiesterase, increasing cAMP and causing vasoconstriction. This reduces under-eye puffiness and dark circles caused by blood pooling. It also has antioxidant activity.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.20, sebumRegulation: 0.35, antiAgingPotency: 0.40, brighteningEfficacy: 0.45, antiInflammatory: 0.35, barrierRepair: 0.25, exfoliationStrength: 0.00, antioxidantCapacity: 0.55, collagenStimulation: 0.25, sensitivityRisk: 0.12, photosensitivity: 0.00, phDependency: 0.25, molecularPenetration: 0.70, stabilityRating: 0.80, compatibilityScore: 0.85, clinicalEvidenceLevel: 0.75, marketSaturation: 0.75 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 1, optMax: 5, absMin: 0.5, absMax: 10, context: 'periorbital', skinType: 'all' }]
    },
    {
      title: 'Zinc PCA',
      slug: 'zinc-pca',
      inciName: 'Zinc PCA',
      casNumber: '15454-75-8',
      glanceText: 'Zinc salt that regulates sebum production, fights acne bacteria, and reduces inflammation.',
      scanText: 'Zinc PCA combines the sebum-regulating properties of zinc with the hydrating properties of PCA. It\'s effective for oily, acne-prone skin without over-drying.',
      studyText: 'Zinc PCA is the zinc salt of L-pyrrolidone carboxylic acid. The zinc inhibits 5-alpha reductase (reducing sebum) and has antimicrobial activity, while PCA provides hydration.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.50, sebumRegulation: 0.80, antiAgingPotency: 0.30, brighteningEfficacy: 0.30, antiInflammatory: 0.55, barrierRepair: 0.45, exfoliationStrength: 0.05, antioxidantCapacity: 0.35, collagenStimulation: 0.25, sensitivityRisk: 0.10, photosensitivity: 0.00, phDependency: 0.30, molecularPenetration: 0.55, stabilityRating: 0.85, compatibilityScore: 0.85, clinicalEvidenceLevel: 0.75, marketSaturation: 0.50 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 0.5, optMax: 2, absMin: 0.1, absMax: 4, context: 'facial', skinType: 'oily' }]
    },
    {
      title: 'Kaolin Clay',
      slug: 'kaolin-clay',
      inciName: 'Kaolin',
      casNumber: '1332-58-7',
      glanceText: 'Gentle white clay that absorbs excess oil and impurities without over-drying.',
      scanText: 'Kaolin is a gentle clay that absorbs sebum and impurities. It\'s the mildest clay option, suitable for sensitive and normal skin types.',
      studyText: 'Kaolin is a hydrated aluminum silicate clay. It absorbs oil and impurities through adsorption while being gentle enough for regular use. Does not provide minerals—purely physical action.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.15, sebumRegulation: 0.75, antiAgingPotency: 0.15, brighteningEfficacy: 0.20, antiInflammatory: 0.25, barrierRepair: 0.20, exfoliationStrength: 0.20, antioxidantCapacity: 0.10, collagenStimulation: 0.10, sensitivityRisk: 0.10, photosensitivity: 0.00, phDependency: 0.10, molecularPenetration: 0.20, stabilityRating: 0.98, compatibilityScore: 0.85, clinicalEvidenceLevel: 0.70, marketSaturation: 0.70 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 5, optMax: 30, absMin: 1, absMax: 50, context: 'facial', skinType: 'oily' }]
    },
    {
      title: 'Activated Charcoal',
      slug: 'activated-charcoal',
      inciName: 'Charcoal Powder',
      casNumber: '7440-44-0',
      glanceText: 'Highly porous carbon that binds impurities and excess oil, popular in cleansing products.',
      scanText: 'Activated charcoal has a massive surface area that binds dirt, oil, and impurities. It\'s used in cleansers and masks for deep cleansing.',
      studyText: 'Activated charcoal\'s porous structure gives it an enormous surface area (3000 m²/g) that adsorbs oils, dirt, and toxins. Best used in wash-off products.',
      causesPurging: false,
      tensor: { hydrationIndex: 0.05, sebumRegulation: 0.80, antiAgingPotency: 0.10, brighteningEfficacy: 0.15, antiInflammatory: 0.15, barrierRepair: 0.10, exfoliationStrength: 0.25, antioxidantCapacity: 0.10, collagenStimulation: 0.05, sensitivityRisk: 0.25, photosensitivity: 0.00, phDependency: 0.10, molecularPenetration: 0.15, stabilityRating: 0.98, compatibilityScore: 0.70, clinicalEvidenceLevel: 0.50, marketSaturation: 0.65 },
      goldilocks: [{ name: 'concentration', unit: '%', optMin: 1, optMax: 5, absMin: 0.5, absMax: 10, context: 'facial', skinType: 'oily' }]
    },
  ],
};

// Relationship definitions
const RELATIONSHIPS = [
  // Retinoid synergies and conflicts
  { from: 'retinol', to: 'niacinamide', type: 'SYNERGIZES_WITH', strength: 0.85, evidence: 'Niacinamide reduces retinol irritation while both provide complementary anti-aging benefits' },
  { from: 'retinol', to: 'hyaluronic-acid', type: 'SYNERGIZES_WITH', strength: 0.90, evidence: 'Hyaluronic acid counteracts retinol-induced dryness without interference' },
  { from: 'retinol', to: 'ceramides', type: 'SYNERGIZES_WITH', strength: 0.88, evidence: 'Ceramides repair barrier disruption caused by retinoid use' },
  { from: 'salicylic-acid', to: 'retinol', type: 'CONFLICTS_WITH', strength: 0.60, evidence: 'Using together can increase irritation; best used at different times of day' },
  { from: 'glycolic-acid', to: 'retinol', type: 'CONFLICTS_WITH', strength: 0.70, evidence: 'Combined use significantly increases irritation risk; alternate nights recommended' },
  { from: 'benzoyl-peroxide', to: 'retinol', type: 'CONFLICTS_WITH', strength: 0.80, evidence: 'Benzoyl peroxide can oxidize and degrade retinol; never layer together' },
  { from: 'l-ascorbic-acid', to: 'retinol', type: 'CONFLICTS_WITH', strength: 0.45, evidence: 'Different optimal pH ranges; use vitamin C in AM and retinol in PM' },
  { from: 'tretinoin', to: 'retinol', type: 'REPLACES', strength: 0.95, evidence: 'Tretinoin is more effective; no need to use both' },

  // Vitamin C combinations
  { from: 'l-ascorbic-acid', to: 'vitamin-e', type: 'SYNERGIZES_WITH', strength: 0.95, evidence: 'Vitamin E regenerates oxidized vitamin C; combined efficacy exceeds individual use' },
  { from: 'l-ascorbic-acid', to: 'ferulic-acid', type: 'SYNERGIZES_WITH', strength: 0.98, evidence: 'Ferulic acid doubles photoprotection and stabilizes ascorbic acid' },
  { from: 'l-ascorbic-acid', to: 'niacinamide', type: 'SYNERGIZES_WITH', strength: 0.70, evidence: 'Despite old myths, modern research shows they work well together at skin-relevant pH' },

  // AHA interactions
  { from: 'glycolic-acid', to: 'lactic-acid', type: 'CONFLICTS_WITH', strength: 0.50, evidence: 'Using multiple AHAs increases irritation without added benefit' },
  { from: 'glycolic-acid', to: 'salicylic-acid', type: 'SYNERGIZES_WITH', strength: 0.75, evidence: 'AHA+BHA combo provides comprehensive exfoliation; use cautiously' },
  { from: 'glycolic-acid', to: 'niacinamide', type: 'SYNERGIZES_WITH', strength: 0.80, evidence: 'Niacinamide buffers irritation while enhancing brightening effects' },

  // Hydration synergies
  { from: 'hyaluronic-acid', to: 'glycerin', type: 'SYNERGIZES_WITH', strength: 0.90, evidence: 'Different humectant mechanisms provide complementary hydration' },
  { from: 'ceramides', to: 'panthenol', type: 'SYNERGIZES_WITH', strength: 0.85, evidence: 'Both support barrier repair through different mechanisms' },
  { from: 'ceramides', to: 'squalane', type: 'SYNERGIZES_WITH', strength: 0.88, evidence: 'Together recreate natural skin lipid composition' },

  // Peptide combinations
  { from: 'matrixyl', to: 'argireline', type: 'SYNERGIZES_WITH', strength: 0.85, evidence: 'Different mechanisms (collagen stimulation vs. muscle relaxation) for comprehensive anti-aging' },
  { from: 'copper-peptides', to: 'l-ascorbic-acid', type: 'CONFLICTS_WITH', strength: 0.75, evidence: 'Copper ions can oxidize vitamin C; use at different times' },
  { from: 'copper-peptides', to: 'ahas', type: 'CONFLICTS_WITH', strength: 0.65, evidence: 'Low pH can destabilize copper peptides' },

  // Brightening combinations
  { from: 'arbutin', to: 'niacinamide', type: 'SYNERGIZES_WITH', strength: 0.85, evidence: 'Multiple melanin-inhibiting pathways for enhanced brightening' },
  { from: 'tranexamic-acid', to: 'alpha-arbutin', type: 'SYNERGIZES_WITH', strength: 0.90, evidence: 'Complementary mechanisms for stubborn hyperpigmentation' },
  { from: 'kojic-acid', to: 'azelaic-acid', type: 'SYNERGIZES_WITH', strength: 0.80, evidence: 'Multiple tyrosinase inhibition pathways' },

  // Acne treatment interactions
  { from: 'benzoyl-peroxide', to: 'salicylic-acid', type: 'SYNERGIZES_WITH', strength: 0.75, evidence: 'BP kills bacteria while SA keeps pores clear; use at different times' },
  { from: 'azelaic-acid', to: 'niacinamide', type: 'SYNERGIZES_WITH', strength: 0.88, evidence: 'Both address acne through different mechanisms with minimal irritation' },
  { from: 'adapalene', to: 'benzoyl-peroxide', type: 'SYNERGIZES_WITH', strength: 0.92, evidence: 'FDA-approved combination (Epiduo); highly effective for acne' },

  // Soothing combinations
  { from: 'centella-asiatica', to: 'niacinamide', type: 'SYNERGIZES_WITH', strength: 0.90, evidence: 'Both strengthen barrier and reduce inflammation' },
  { from: 'bisabolol', to: 'allantoin', type: 'SYNERGIZES_WITH', strength: 0.85, evidence: 'Complementary soothing mechanisms' },

  // Sunscreen combinations
  { from: 'zinc-oxide', to: 'titanium-dioxide', type: 'SYNERGIZES_WITH', strength: 0.90, evidence: 'Combined coverage of full UV spectrum' },
  { from: 'zinc-oxide', to: 'l-ascorbic-acid', type: 'SYNERGIZES_WITH', strength: 0.85, evidence: 'Antioxidants enhance UV protection' },
];

async function seedIngredients() {
  console.log('🌱 Starting SKA ingredient seeding...\n');

  // Get pillar IDs
  const pillars = await AppDataSource.query(
    'SELECT id, number, name FROM jade.skincare_pillars'
  );

  const ingredientPillar = pillars.find((p: any) => p.number === 3);
  if (!ingredientPillar) {
    throw new Error('Ingredient Intelligence pillar not found');
  }

  console.log(`📚 Using pillar: ${ingredientPillar.name} (${ingredientPillar.id})\n`);

  let totalIngredients = 0;
  let totalTensors = 0;
  let totalGoldilocks = 0;

  // Seed all ingredient categories
  for (const [category, ingredients] of Object.entries(INGREDIENTS)) {
    console.log(`\n📦 Seeding ${category}...`);

    for (const ing of ingredients) {
      // Check if ingredient already exists
      const existing = await AppDataSource.query(
        'SELECT id FROM jade.skincare_atoms WHERE slug = $1',
        [ing.slug]
      );

      if (existing.length > 0) {
        console.log(`  ⏭️  ${ing.title} already exists, skipping`);
        continue;
      }

      // Insert ingredient atom
      const atomResult = await AppDataSource.query(
        `INSERT INTO jade.skincare_atoms (
          pillar_id, atom_type, title, slug, inci_name, cas_number,
          glance_text, scan_text, study_text,
          causes_purging, purging_duration_weeks, purging_description,
          fda_approved, eu_compliant, cruelty_free, featured
        ) VALUES ($1, 'INGREDIENT', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true, true, true, false)
        RETURNING id`,
        [
          ingredientPillar.id,
          ing.title,
          ing.slug,
          ing.inciName,
          ing.casNumber,
          ing.glanceText,
          ing.scanText,
          ing.studyText,
          ing.causesPurging,
          ing.purgingDurationWeeks || null,
          ing.purgingDescription || null,
        ]
      );

      const atomId = atomResult[0].id;
      totalIngredients++;
      console.log(`  ✅ ${ing.title}`);

      // Insert tensor if present
      if (ing.tensor) {
        await AppDataSource.query(
          `INSERT INTO jade.skincare_atom_tensors (
            atom_id, hydration_index, sebum_regulation, anti_aging_potency,
            brightening_efficacy, anti_inflammatory, barrier_repair,
            exfoliation_strength, antioxidant_capacity, collagen_stimulation,
            sensitivity_risk, photosensitivity, ph_dependency,
            molecular_penetration, stability_rating, compatibility_score,
            clinical_evidence_level, market_saturation
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
          [
            atomId,
            ing.tensor.hydrationIndex,
            ing.tensor.sebumRegulation,
            ing.tensor.antiAgingPotency,
            ing.tensor.brighteningEfficacy,
            ing.tensor.antiInflammatory,
            ing.tensor.barrierRepair,
            ing.tensor.exfoliationStrength,
            ing.tensor.antioxidantCapacity,
            ing.tensor.collagenStimulation,
            ing.tensor.sensitivityRisk,
            ing.tensor.photosensitivity,
            ing.tensor.phDependency,
            ing.tensor.molecularPenetration,
            ing.tensor.stabilityRating,
            ing.tensor.compatibilityScore,
            ing.tensor.clinicalEvidenceLevel,
            ing.tensor.marketSaturation,
          ]
        );
        totalTensors++;
      }

      // Insert goldilocks parameters
      if (ing.goldilocks) {
        for (const g of ing.goldilocks) {
          await AppDataSource.query(
            `INSERT INTO jade.goldilocks_parameters (
              atom_id, parameter_name, parameter_unit, optimal_min, optimal_max,
              absolute_min, absolute_max, context, skin_type, evidence_level
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'clinical_trial')
            ON CONFLICT (atom_id, parameter_name, context, skin_type) DO NOTHING`,
            [atomId, g.name, g.unit, g.optMin, g.optMax, g.absMin, g.absMax, g.context, g.skinType]
          );
          totalGoldilocks++;
        }
      }
    }
  }

  console.log(`\n📊 Ingredient seeding complete:`);
  console.log(`   - ${totalIngredients} new ingredients added`);
  console.log(`   - ${totalTensors} tensor profiles created`);
  console.log(`   - ${totalGoldilocks} goldilocks parameters added`);

  return { totalIngredients, totalTensors, totalGoldilocks };
}

async function seedRelationships() {
  console.log('\n🔗 Seeding relationships...\n');

  let created = 0;
  let skipped = 0;

  for (const rel of RELATIONSHIPS) {
    // Get atom IDs
    const fromAtom = await AppDataSource.query(
      'SELECT id FROM jade.skincare_atoms WHERE slug = $1',
      [rel.from]
    );
    const toAtom = await AppDataSource.query(
      'SELECT id FROM jade.skincare_atoms WHERE slug = $1',
      [rel.to]
    );

    if (fromAtom.length === 0 || toAtom.length === 0) {
      console.log(`  ⏭️  Skipping ${rel.from} → ${rel.to}: atom not found`);
      skipped++;
      continue;
    }

    // Check if relationship exists
    const existing = await AppDataSource.query(
      `SELECT id FROM jade.skincare_relationships
       WHERE from_atom_id = $1 AND to_atom_id = $2 AND relationship_type = $3`,
      [fromAtom[0].id, toAtom[0].id, rel.type]
    );

    if (existing.length > 0) {
      skipped++;
      continue;
    }

    // Create relationship
    await AppDataSource.query(
      `INSERT INTO jade.skincare_relationships (
        from_atom_id, to_atom_id, relationship_type, strength, evidence_description
      ) VALUES ($1, $2, $3, $4, $5)`,
      [fromAtom[0].id, toAtom[0].id, rel.type, rel.strength, rel.evidence]
    );

    console.log(`  ✅ ${rel.from} ${rel.type} ${rel.to}`);
    created++;
  }

  console.log(`\n📊 Relationship seeding complete:`);
  console.log(`   - ${created} new relationships created`);
  console.log(`   - ${skipped} skipped (already exist or atom not found)`);

  return { created, skipped };
}

async function main() {
  try {
    // Initialize database connection
    console.log('🔌 Connecting to database...');
    await AppDataSource.initialize();
    console.log('✅ Connected!\n');

    // Seed ingredients
    const ingredientStats = await seedIngredients();

    // Seed relationships
    const relationshipStats = await seedRelationships();

    // Final stats
    const finalStats = await AppDataSource.query(`
      SELECT
        (SELECT COUNT(*) FROM jade.skincare_atoms) as total_atoms,
        (SELECT COUNT(*) FROM jade.skincare_atoms WHERE atom_type = 'INGREDIENT') as ingredients,
        (SELECT COUNT(*) FROM jade.skincare_relationships) as relationships,
        (SELECT COUNT(*) FROM jade.skincare_atom_tensors) as tensors,
        (SELECT COUNT(*) FROM jade.goldilocks_parameters) as goldilocks
    `);

    console.log('\n' + '='.repeat(50));
    console.log('🎉 SKA SEEDING COMPLETE');
    console.log('='.repeat(50));
    console.log(`\n📊 Database totals:`);
    console.log(`   Total atoms: ${finalStats[0].total_atoms}`);
    console.log(`   Ingredients: ${finalStats[0].ingredients}`);
    console.log(`   Relationships: ${finalStats[0].relationships}`);
    console.log(`   Tensor profiles: ${finalStats[0].tensors}`);
    console.log(`   Goldilocks params: ${finalStats[0].goldilocks}`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

main();
