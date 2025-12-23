/**
 * Seed Compliance Atoms (Pillar 6: Regulations)
 *
 * Seeds regulatory atoms into the SKA knowledge graph for:
 * - FDA cosmetic claim regulations (21 CFR 740)
 * - FTC advertising guidelines
 * - EU Cosmetics Regulation claims
 * - Prohibited claim patterns
 * - Safe harbor language templates
 *
 * Also creates Zilliz vector collection for semantic claim matching
 */

import { config } from 'dotenv';
config();

import { AppDataSource } from '../config/database';
import { zillizClient } from '../config/zilliz';
import { batchGenerateEmbeddings } from '../services/openai.service';
import { DataType } from '@zilliz/milvus2-sdk-node';

// Collection name for regulatory atoms in Zilliz
const REGULATORY_COLLECTION = 'jade_regulatory_atoms';

/**
 * Regulatory atom data structure
 */
interface RegulatoryAtomData {
  title: string;
  slug: string;
  regulationCode: string;
  regulationBody: string;
  claimPattern: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  glanceText: string;
  scanText: string;
  studyText: string;
  safeAlternative: string;
  category: string;
}

/**
 * FDA/FTC Regulatory Atoms - Pillar 6 Data
 */
const REGULATORY_ATOMS: RegulatoryAtomData[] = [
  // Disease Claims (CRITICAL)
  {
    title: 'FDA Disease Treatment Claims',
    slug: 'fda-disease-treatment-claims',
    regulationCode: 'FDA 21 CFR 740',
    regulationBody: 'FDA',
    claimPattern: 'cures|treats|heals|prevents disease',
    severity: 'CRITICAL',
    glanceText: 'Cosmetics cannot claim to treat or cure diseases',
    scanText: 'Under FDA regulations, products making disease treatment claims are considered drugs and require FDA approval. Cosmetic products are limited to claims about appearance and beautification.',
    studyText: 'The Federal Food, Drug, and Cosmetic Act defines drugs as articles intended for use in the diagnosis, cure, mitigation, treatment, or prevention of disease. When a cosmetic makes such claims, it crosses into drug territory and requires an approved New Drug Application (NDA) or Abbreviated NDA. Common violations include claims like "cures acne," "treats eczema," or "heals dermatitis." Safe alternatives use appearance-based language: "helps improve the appearance of" or "addresses visible signs of."',
    safeAlternative: 'Replace with "helps improve the appearance of" or "addresses visible signs of"',
    category: 'disease_claims',
  },
  {
    title: 'FDA Disease Prevention Claims',
    slug: 'fda-disease-prevention-claims',
    regulationCode: 'FDA 21 CFR 740.10',
    regulationBody: 'FDA',
    claimPattern: 'prevents|protects against disease|stops',
    severity: 'CRITICAL',
    glanceText: 'Prevention claims require drug approval',
    scanText: 'Claims that a product prevents diseases or conditions elevate it to drug status under FDA regulations. This includes claims about preventing acne, aging diseases, or skin conditions.',
    studyText: 'Disease prevention claims automatically classify a product as a drug under the FD&C Act. Even implying that a product can prevent a disease condition requires substantial evidence and FDA approval. This includes claims about preventing acne breakouts, stopping wrinkle formation, or protecting against sun damage that causes cancer. Acceptable alternatives focus on maintenance: "helps maintain healthy-looking skin" or "supports skin\'s natural defenses."',
    safeAlternative: 'Use "helps maintain" or "supports skin\'s natural" language',
    category: 'disease_claims',
  },

  // Drug Efficacy Claims (CRITICAL)
  {
    title: 'Drug-Like Efficacy Claims',
    slug: 'drug-like-efficacy-claims',
    regulationCode: 'FDA 21 CFR 740.1',
    regulationBody: 'FDA',
    claimPattern: 'eliminates|eradicates|destroys|permanently removes',
    severity: 'CRITICAL',
    glanceText: 'Absolute elimination claims imply drug action',
    scanText: 'Claims using absolute language like "eliminates" or "eradicates" imply drug-like efficacy that cosmetics cannot legally claim without FDA drug approval.',
    studyText: 'When marketing copy uses language suggesting complete elimination of a skin condition, wrinkles, or blemishes, it crosses from cosmetic to drug claims. The FDA distinguishes between "reduces the appearance of" (cosmetic) and "eliminates" (drug). Key violating terms include: eliminate, eradicate, destroy, permanently remove, cure, heal, treat. Safe alternatives: "visibly reduces," "diminishes the appearance of," "helps minimize the look of."',
    safeAlternative: 'Replace with "visibly reduces" or "diminishes the appearance of"',
    category: 'drug_claims',
  },
  {
    title: 'Structural Change Claims',
    slug: 'structural-change-claims',
    regulationCode: 'FDA 21 CFR 740.1(a)',
    regulationBody: 'FDA',
    claimPattern: 'rebuilds collagen|regenerates cells|restores elastin',
    severity: 'CRITICAL',
    glanceText: 'Claims affecting skin structure are drug claims',
    scanText: 'Claiming a product rebuilds, regenerates, or restores skin structures like collagen or elastin implies drug action affecting the body\'s structure.',
    studyText: 'The FD&C Act defines drugs as articles intended to affect the structure or function of the body. Claims about rebuilding collagen, regenerating skin cells, or restoring elastin fibers suggest structural changes that only drugs can legally claim. Cosmetics may claim to "support skin\'s natural collagen," "help maintain elasticity," or "create the appearance of firmer skin" without implying actual structural modification.',
    safeAlternative: 'Use "supports skin\'s natural processes" or "helps maintain"',
    category: 'drug_claims',
  },

  // Unsubstantiated Claims (WARNING)
  {
    title: 'FTC Unsubstantiated Absolute Claims',
    slug: 'ftc-unsubstantiated-absolute-claims',
    regulationCode: 'FTC Act Section 5',
    regulationBody: 'FTC',
    claimPattern: '100%|guaranteed|proven|clinically proven',
    severity: 'WARNING',
    glanceText: 'Absolute claims require scientific substantiation',
    scanText: 'The FTC requires "competent and reliable scientific evidence" for advertising claims. Terms like "100%," "guaranteed," or "proven" without substantiation violate Section 5.',
    studyText: 'Under FTC guidelines, advertisers must have a reasonable basis for claims before making them. Absolute claims like "100% effective," "guaranteed results," or "clinically proven" require rigorous scientific studies. The FTC\'s Substantiation Doctrine requires that the level of evidence match the claim strength. For "clinically proven," this typically means peer-reviewed, double-blind studies. Safe alternatives: "in consumer testing, 90% reported improvement" or "formulated with clinically-studied ingredients."',
    safeAlternative: 'Add substantiation source or use "in testing" qualifiers',
    category: 'substantiation',
  },
  {
    title: 'FTC Time-Based Efficacy Claims',
    slug: 'ftc-time-based-claims',
    regulationCode: 'FTC Act Section 5',
    regulationBody: 'FTC',
    claimPattern: 'instant results|immediate|overnight transformation',
    severity: 'WARNING',
    glanceText: 'Time-based claims need substantiation',
    scanText: 'Claims about instant, immediate, or overnight results require evidence that the claimed timeframe is achievable and typical for consumers.',
    studyText: 'The FTC scrutinizes time-based efficacy claims because they often create unrealistic expectations. "Instant results" or "overnight transformation" claims must be backed by evidence showing these outcomes are typical, not just possible. Consumer perception tests may be required to demonstrate that the claim isn\'t misleading. Safer alternatives specify realistic timeframes: "visible improvement in 4 weeks" or "begins working immediately to hydrate."',
    safeAlternative: 'Specify realistic timeframe or add "visible improvement"',
    category: 'substantiation',
  },

  // Permanence Claims (WARNING)
  {
    title: 'Unsubstantiated Permanence Claims',
    slug: 'unsubstantiated-permanence-claims',
    regulationCode: 'FTC Act Section 5',
    regulationBody: 'FTC',
    claimPattern: 'permanently|forever|lasting|eternal',
    severity: 'WARNING',
    glanceText: 'Permanence claims require long-term evidence',
    scanText: 'Claims about permanent or lasting results require longitudinal studies proving effects persist without continued product use.',
    studyText: 'Permanence claims are particularly scrutinized because cosmetic effects typically require ongoing use. Claiming "permanent wrinkle reduction" or "forever youthful skin" without evidence of lasting effects after discontinuation is deceptive. The FTC and FDA both flag such claims. Safe alternatives acknowledge the need for continued use: "with regular use," "maintains results with continued application," or specify a realistic duration: "visible improvement lasting up to 24 hours."',
    safeAlternative: 'Add "with continued use" or specify realistic duration',
    category: 'permanence',
  },

  // Comparative Claims (INFO)
  {
    title: 'FTC Comparative Advertising Requirements',
    slug: 'ftc-comparative-advertising',
    regulationCode: 'FTC Comparative Advertising Policy',
    regulationBody: 'FTC',
    claimPattern: '#1|best|most effective|superior|better than',
    severity: 'INFO',
    glanceText: 'Comparative claims need substantiation',
    scanText: 'Claims comparing to competitors or claiming market leadership (#1, best, most effective) require substantiation through comparative studies or market data.',
    studyText: 'The FTC permits comparative advertising but requires truthful, non-deceptive comparisons. Claims like "#1 anti-aging serum" need market data supporting leadership. "Better than Brand X" requires head-to-head testing. Superlatives like "best" or "most effective" without qualification may be considered puffery, but specific comparative claims need evidence. Safe approaches: cite specific studies, use qualified language ("one of the leading"), or make comparison to own products.',
    safeAlternative: 'Add substantiation source or use "one of the leading"',
    category: 'comparative',
  },

  // Medical/Drug Terminology (WARNING)
  {
    title: 'Medical Terminology in Cosmetics',
    slug: 'medical-terminology-cosmetics',
    regulationCode: 'FDA 21 CFR 740.1',
    regulationBody: 'FDA',
    claimPattern: 'prescription strength|medical grade|pharmaceutical|therapeutic',
    severity: 'WARNING',
    glanceText: 'Medical terminology implies drug status',
    scanText: 'Using medical or pharmaceutical terminology in cosmetic marketing can mislead consumers into believing the product has drug-like properties.',
    studyText: 'Terms like "prescription strength," "medical grade," "pharmaceutical," or "therapeutic" in cosmetic marketing can be considered misleading because they imply drug status or medical efficacy. The FDA and FTC may challenge such claims as implying the product is more than a cosmetic. Safe alternatives use professional-focused language without medical implications: "professional strength," "salon-grade formula," "advanced formulation," or "dermatologist-recommended."',
    safeAlternative: 'Use "professional strength" or "advanced formula"',
    category: 'terminology',
  },

  // Anti-Aging Specific (WARNING)
  {
    title: 'Age Reversal Claims',
    slug: 'age-reversal-claims',
    regulationCode: 'FDA 21 CFR 740',
    regulationBody: 'FDA',
    claimPattern: 'reverse aging|turn back time|age reversal|younger skin',
    severity: 'WARNING',
    glanceText: 'Reversal claims imply biological change',
    scanText: 'Claims about reversing aging or turning back time suggest structural or biological changes that cosmetics cannot legally claim.',
    studyText: 'Anti-aging is a significant category for cosmetic claims, but "reversal" language crosses into drug territory. Claiming to "reverse aging" or "turn back time" implies actual biological or structural changes to skin. The FDA considers these drug claims because they suggest affecting the body\'s structure. Acceptable anti-aging claims focus on appearance: "reduces the visible signs of aging," "creates a more youthful appearance," "diminishes the look of fine lines."',
    safeAlternative: 'Replace with "reduces visible signs of aging"',
    category: 'anti_aging',
  },

  // EU Regulations
  {
    title: 'EU Cosmetics Regulation Claims',
    slug: 'eu-cosmetics-regulation-claims',
    regulationCode: 'EU Regulation 1223/2009',
    regulationBody: 'EU',
    claimPattern: 'EU cosmetic claim criteria',
    severity: 'INFO',
    glanceText: 'EU has specific cosmetic claim criteria',
    scanText: 'The EU Cosmetics Regulation establishes criteria for cosmetic claims including truthfulness, evidence support, honesty, fairness, and informed decision-making.',
    studyText: 'EU Regulation 1223/2009 and the Common Criteria for Cosmetic Claims (EU 655/2013) establish six principles: legal compliance, truthfulness, evidence support, honesty, fairness, and informed decision-making. Claims must not attribute characteristics the product doesn\'t have, and evidence must be appropriate to the claim type. The EU also prohibits claiming products are "free from" ingredients never used in that product type. Brands selling internationally must comply with both US and EU standards.',
    safeAlternative: 'Review claims against EU Common Criteria principles',
    category: 'international',
  },

  // Safe Harbor Templates
  {
    title: 'FDA Safe Harbor Language',
    slug: 'fda-safe-harbor-language',
    regulationCode: 'FDA Guidance',
    regulationBody: 'FDA',
    claimPattern: 'appearance-based language templates',
    severity: 'INFO',
    glanceText: 'Use appearance-based language for safety',
    scanText: 'The FDA provides guidance on acceptable cosmetic claims that focus on appearance, temporary effects, and beautification rather than treatment or cure.',
    studyText: 'Safe harbor language focuses on appearance and temporary cosmetic effects. Approved patterns include: "Helps reduce THE APPEARANCE OF [condition]," "Designed to ADDRESS THE LOOK OF [concern]," "Creates THE ILLUSION OF [benefit]," "Temporarily SMOOTHS [area]," "VISIBLY reduces [concern]." Key qualifiers: "the appearance of," "the look of," "visible," "temporary," "designed to," "helps," "may help." Avoid: absolute claims, disease references, structural changes, permanent effects.',
    safeAlternative: 'Use provided safe harbor language patterns',
    category: 'safe_harbor',
  },
  {
    title: 'FTC Disclosure Requirements',
    slug: 'ftc-disclosure-requirements',
    regulationCode: 'FTC Endorsement Guides',
    regulationBody: 'FTC',
    claimPattern: 'disclosure and disclaimer requirements',
    severity: 'INFO',
    glanceText: 'Proper disclosures protect against violations',
    scanText: 'The FTC requires clear and conspicuous disclosures for material connections, typical results, and any claims that might otherwise mislead.',
    studyText: 'FTC Endorsement Guides require disclosure of material connections (paid endorsements, free products), atypical results shown in testimonials, and qualifications to claims. Disclosures must be "clear and conspicuous" - not buried in fine print. For digital media, disclosures should be near the claim, in readable font, and viewable without clicking. When showing dramatic before/after results, disclose if results are not typical. Social media influencers must clearly disclose partnerships (#ad, #sponsored).',
    safeAlternative: 'Include clear, conspicuous disclosures',
    category: 'disclosure',
  },

  // Ingredient Claims
  {
    title: 'Active Ingredient Claims',
    slug: 'active-ingredient-claims',
    regulationCode: 'FDA 21 CFR 701.3',
    regulationBody: 'FDA',
    claimPattern: 'active ingredient|medicinal|drug ingredient',
    severity: 'WARNING',
    glanceText: '"Active ingredient" term is drug terminology',
    scanText: 'The term "active ingredient" is specifically defined for drugs. Using it for cosmetics implies drug status and regulated efficacy.',
    studyText: 'In FDA terminology, "active ingredient" has specific meaning for drugs - it\'s the component responsible for therapeutic effect. Using this term in cosmetic marketing implies the product functions as a drug. Cosmetics should instead refer to "key ingredients," "featured ingredients," or "hero ingredients." Exception: OTC drug-cosmetics like sunscreens properly list active ingredients per monograph requirements. For pure cosmetics, avoid "active" terminology.',
    safeAlternative: 'Use "key ingredient" or "featured ingredient"',
    category: 'ingredients',
  },
  {
    title: 'Concentration and Potency Claims',
    slug: 'concentration-potency-claims',
    regulationCode: 'FTC Act Section 5',
    regulationBody: 'FTC',
    claimPattern: 'maximum strength|highest concentration|most potent',
    severity: 'INFO',
    glanceText: 'Concentration claims need substantiation',
    scanText: 'Claims about maximum strength or highest concentration require evidence and must not mislead about safety or efficacy.',
    studyText: 'Concentration and potency claims must be substantiated and not misleading. "Maximum strength" should mean the highest concentration sold by that brand or legally allowed. "Highest concentration" claims need comparative evidence. Potency claims should distinguish between ingredient concentration and formula efficacy. Be cautious with percentage claims - stating "20% Vitamin C" must be accurate and shouldn\'t imply that higher always means better or safer.',
    safeAlternative: 'Specify context or use "high concentration" without superlatives',
    category: 'ingredients',
  },
];

/**
 * Initialize regulatory atoms Zilliz collection
 */
async function initRegulatoryCollection(): Promise<void> {
  console.log('\n📚 Initializing regulatory atoms Zilliz collection...');

  try {
    // Check if collection exists
    const hasCollection = await zillizClient.hasCollection({
      collection_name: REGULATORY_COLLECTION,
    });

    if (hasCollection.value) {
      console.log(`  Collection "${REGULATORY_COLLECTION}" already exists, dropping...`);
      await zillizClient.dropCollection({
        collection_name: REGULATORY_COLLECTION,
      });
    }

    // Create collection schema
    await zillizClient.createCollection({
      collection_name: REGULATORY_COLLECTION,
      description: 'JADE regulatory atoms for compliance scoring',
      fields: [
        {
          name: 'id',
          data_type: DataType.VarChar,
          is_primary_key: true,
          max_length: 36,
        },
        {
          name: 'title',
          data_type: DataType.VarChar,
          max_length: 255,
        },
        {
          name: 'regulation_code',
          data_type: DataType.VarChar,
          max_length: 100,
        },
        {
          name: 'regulation_body',
          data_type: DataType.VarChar,
          max_length: 50,
        },
        {
          name: 'severity',
          data_type: DataType.VarChar,
          max_length: 20,
        },
        {
          name: 'claim_pattern',
          data_type: DataType.VarChar,
          max_length: 500,
        },
        {
          name: 'description',
          data_type: DataType.VarChar,
          max_length: 2000,
        },
        {
          name: 'safe_alternative',
          data_type: DataType.VarChar,
          max_length: 500,
        },
        {
          name: 'category',
          data_type: DataType.VarChar,
          max_length: 100,
        },
        {
          name: 'embedding',
          data_type: DataType.FloatVector,
          dim: 768,
        },
      ],
      enableDynamicField: true,
    });

    console.log('  ✓ Collection created');

    // Create vector index
    await zillizClient.createIndex({
      collection_name: REGULATORY_COLLECTION,
      index_name: 'regulatory_embedding_index',
      field_name: 'embedding',
      metric_type: 'COSINE',
      index_type: 'IVF_FLAT',
      params: { nlist: 128 },
    });

    console.log('  ✓ Vector index created');

    // Load collection
    await zillizClient.loadCollection({
      collection_name: REGULATORY_COLLECTION,
    });

    console.log('  ✓ Collection loaded');

  } catch (error) {
    console.error('  ✗ Failed to initialize regulatory collection:', error);
    throw error;
  }
}

/**
 * Seed regulatory atoms to PostgreSQL
 */
async function seedRegulatoryAtomsToDB(): Promise<string[]> {
  console.log('\n📝 Seeding regulatory atoms to PostgreSQL...');

  const atomIds: string[] = [];

  // First, ensure Pillar 6 exists
  const pillarResult = await AppDataSource.query(
    `INSERT INTO jade.skincare_pillars (number, name, slug, description, hex_color, display_order)
     VALUES (6, 'Regulations & Compliance', 'regulations-compliance',
             'FDA, FTC, EU cosmetic regulations and marketing compliance guidelines',
             '#DC2626', 6)
     ON CONFLICT (number) DO UPDATE SET
       name = EXCLUDED.name,
       description = EXCLUDED.description,
       updated_at = NOW()
     RETURNING id`
  );
  const pillarId = pillarResult[0].id;
  console.log(`  ✓ Pillar 6 ready (ID: ${pillarId})`);

  // Insert each regulatory atom
  for (const atom of REGULATORY_ATOMS) {
    try {
      const result = await AppDataSource.query(
        `INSERT INTO jade.skincare_atoms (
          pillar_id, atom_type, title, slug,
          glance_text, scan_text, study_text,
          metadata, fda_approved, eu_compliant
        ) VALUES ($1, 'REGULATION', $2, $3, $4, $5, $6, $7, true, true)
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          glance_text = EXCLUDED.glance_text,
          scan_text = EXCLUDED.scan_text,
          study_text = EXCLUDED.study_text,
          metadata = EXCLUDED.metadata,
          updated_at = NOW()
        RETURNING id`,
        [
          pillarId,
          atom.title,
          atom.slug,
          atom.glanceText,
          atom.scanText,
          atom.studyText,
          JSON.stringify({
            regulationCode: atom.regulationCode,
            regulationBody: atom.regulationBody,
            claimPattern: atom.claimPattern,
            severity: atom.severity,
            safeAlternative: atom.safeAlternative,
            category: atom.category,
          }),
        ]
      );
      atomIds.push(result[0].id);
      console.log(`  ✓ ${atom.title}`);
    } catch (error) {
      console.error(`  ✗ Failed to insert ${atom.title}:`, error);
    }
  }

  console.log(`\n  Total: ${atomIds.length} regulatory atoms seeded`);
  return atomIds;
}

/**
 * Generate and insert embeddings to Zilliz
 */
async function seedRegulatoryEmbeddings(atomIds: string[]): Promise<void> {
  console.log('\n🧠 Generating embeddings for regulatory atoms...');

  // Fetch atoms from database
  const atoms = await AppDataSource.query(
    `SELECT id, title, glance_text, scan_text, metadata
     FROM jade.skincare_atoms
     WHERE id = ANY($1::uuid[])`,
    [atomIds]
  );

  // Prepare texts for embedding
  const texts = atoms.map((atom: any) => {
    const metadata = typeof atom.metadata === 'string'
      ? JSON.parse(atom.metadata)
      : atom.metadata;
    return `${atom.title}. ${metadata.claimPattern}. ${atom.glance_text}. ${atom.scan_text}`;
  });

  console.log(`  Generating ${texts.length} embeddings...`);

  // Generate embeddings in batch
  const embeddings = await batchGenerateEmbeddings(texts);

  console.log('  ✓ Embeddings generated');

  // Prepare data for Zilliz
  const vectorData = atoms.map((atom: any, index: number) => {
    const metadata = typeof atom.metadata === 'string'
      ? JSON.parse(atom.metadata)
      : atom.metadata;
    return {
      id: atom.id,
      title: atom.title,
      regulation_code: metadata.regulationCode || '',
      regulation_body: metadata.regulationBody || '',
      severity: metadata.severity || 'INFO',
      claim_pattern: metadata.claimPattern || '',
      description: atom.scan_text || '',
      safe_alternative: metadata.safeAlternative || '',
      category: metadata.category || '',
      embedding: embeddings[index],
    };
  });

  // Insert into Zilliz
  await zillizClient.insert({
    collection_name: REGULATORY_COLLECTION,
    data: vectorData,
  });

  console.log(`  ✓ ${vectorData.length} embeddings inserted to Zilliz`);
}

/**
 * Main seed function
 */
async function main(): Promise<void> {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  JADE SKA - Seeding Pillar 6: Regulations & Compliance');
  console.log('═══════════════════════════════════════════════════════════════');

  try {
    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✓ Database connected');
    }

    // Initialize Zilliz collection
    await initRegulatoryCollection();

    // Seed atoms to PostgreSQL
    const atomIds = await seedRegulatoryAtomsToDB();

    // Generate and seed embeddings to Zilliz
    if (atomIds.length > 0) {
      await seedRegulatoryEmbeddings(atomIds);
    }

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  ✅ Pillar 6 seeding complete!');
    console.log(`  Total regulatory atoms: ${atomIds.length}`);
    console.log('═══════════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n✗ Seeding failed:', error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Run if called directly
main().catch(console.error);
