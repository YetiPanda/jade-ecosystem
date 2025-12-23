/**
 * Seed Sanctuary Community Data
 *
 * Creates sample members, posts, comments, and events for testing
 * Run with: npx ts-node src/scripts/seed-sanctuary-data.ts
 */

import { config } from 'dotenv';
config();

import { AppDataSource } from '../config/database';

interface SeedMember {
  display_name: string;
  bio: string;
  expertise_areas: string[];
  certifications: string[];
  years_experience: number;
  is_verified: boolean;
  reputation_score: number;
}

interface SeedPost {
  title: string;
  content: string;
  post_type: string;
  category: string;
  tags: string[];
  ska_atom_ids: string[];
  is_featured?: boolean;
  is_pinned?: boolean;
}

interface SeedEvent {
  title: string;
  description: string;
  event_type: string;
  format: string;
  location?: string;
  virtual_link?: string;
  start_time: Date;
  end_time?: Date;
  max_attendees?: number;
  price_cents: number;
  ska_topic_ids: string[];
}

const seedMembers: SeedMember[] = [
  {
    display_name: 'Dr. Sarah Chen',
    bio: 'Board-certified dermatologist with 15 years of experience specializing in cosmetic dermatology and anti-aging treatments. Passionate about educating spa professionals on evidence-based skincare.',
    expertise_areas: ['Anti-aging', 'Cosmetic Dermatology', 'Acne Treatment', 'Chemical Peels'],
    certifications: ['MD - Dermatology', 'FAAD', 'Cosmetic Dermatology Fellowship'],
    years_experience: 15,
    is_verified: true,
    reputation_score: 2500,
  },
  {
    display_name: 'Maria Rodriguez, LE',
    bio: 'Licensed esthetician and spa owner with a focus on holistic skincare approaches. I believe in combining traditional techniques with modern innovations.',
    expertise_areas: ['Holistic Skincare', 'Facials', 'Sensitive Skin', 'Natural Ingredients'],
    certifications: ['Licensed Esthetician', 'Holistic Skincare Certification', 'Aromatherapy'],
    years_experience: 12,
    is_verified: true,
    reputation_score: 1850,
  },
  {
    display_name: 'James Park',
    bio: 'Skincare formulator and educator. I help spa professionals understand ingredient science and create customized treatment protocols.',
    expertise_areas: ['Ingredient Science', 'Product Formulation', 'Treatment Protocols', 'Retinoids'],
    certifications: ['Cosmetic Chemist', 'CIDESCO Diploma'],
    years_experience: 10,
    is_verified: true,
    reputation_score: 2100,
  },
  {
    display_name: 'Lisa Thompson',
    bio: 'Spa manager and business consultant helping estheticians grow their practices. Sharing tips on client retention and service menu optimization.',
    expertise_areas: ['Spa Management', 'Business Development', 'Client Retention', 'Marketing'],
    certifications: ['Licensed Esthetician', 'Business Management Certificate'],
    years_experience: 8,
    is_verified: false,
    reputation_score: 950,
  },
  {
    display_name: 'Dr. Michael Okonkwo',
    bio: 'Dermatologist specializing in skin of color and hyperpigmentation treatments. Advocating for inclusive skincare education.',
    expertise_areas: ['Skin of Color', 'Hyperpigmentation', 'Melasma', 'Laser Treatments'],
    certifications: ['MD - Dermatology', 'FAAD', 'Laser Medicine Fellowship'],
    years_experience: 12,
    is_verified: true,
    reputation_score: 1750,
  },
  {
    display_name: 'Emma Williams',
    bio: 'Newly licensed esthetician eager to learn from experienced professionals. Currently focusing on building my acne treatment expertise.',
    expertise_areas: ['Acne Treatment', 'Teen Skincare'],
    certifications: ['Licensed Esthetician'],
    years_experience: 2,
    is_verified: false,
    reputation_score: 150,
  },
  {
    display_name: 'David Kim, NMD',
    bio: 'Naturopathic doctor with expertise in integrative approaches to skin health. I focus on the gut-skin connection and internal factors affecting skin.',
    expertise_areas: ['Integrative Medicine', 'Gut-Skin Axis', 'Nutrition', 'Inflammation'],
    certifications: ['NMD', 'Integrative Dermatology Certificate'],
    years_experience: 9,
    is_verified: true,
    reputation_score: 1200,
  },
  {
    display_name: 'Rachel Green',
    bio: 'Master esthetician specializing in advanced facial treatments and LED therapy. I love sharing protocols that deliver real results.',
    expertise_areas: ['LED Therapy', 'Microcurrent', 'Advanced Facials', 'Device-Based Treatments'],
    certifications: ['Master Esthetician', 'LED Certification', 'Microcurrent Certification'],
    years_experience: 7,
    is_verified: false,
    reputation_score: 680,
  },
];

const seedPosts: SeedPost[] = [
  {
    title: 'Best Practices for Treating Melasma in Darker Skin Tones',
    content: `I've been seeing an increase in clients with melasma, particularly those with Fitzpatrick skin types IV-VI. I wanted to share some protocols that have worked well in my practice and get your input.

**Key Considerations:**
1. Always start with a thorough sun protection regimen before any treatment
2. Avoid aggressive treatments that can cause PIH
3. Consider the role of hormonal factors

**My Current Protocol:**
- Tyrosinase inhibitors (arbutin, kojic acid) as first line
- Low-strength retinoids (0.025% tretinoin) introduced slowly
- Azelaic acid 15-20% for maintenance
- Monthly gentle chemical peels with lactic acid

**What I'm Curious About:**
- Has anyone had success with tranexamic acid (topical or oral)?
- What's your experience with laser treatments for melasma in darker skin?

I'd love to hear what's working in your practices!`,
    post_type: 'discussion',
    category: 'Treatment Protocols',
    tags: ['melasma', 'hyperpigmentation', 'skin-of-color', 'treatment-protocols'],
    ska_atom_ids: [],
    is_featured: true,
    is_pinned: false,
  },
  {
    title: 'Question: How do you handle clients who want results faster than realistic?',
    content: `I have a new client who came in for acne treatment and expects clear skin within 2 weeks. I've explained that treating acne properly takes 8-12 weeks minimum, but she's already talking about trying more aggressive treatments.

How do you manage client expectations? Do you have any scripts or educational materials you share?

I want to keep her as a client but also maintain professional standards.`,
    post_type: 'question',
    category: 'Client Management',
    tags: ['client-expectations', 'acne', 'communication', 'professional-development'],
    ska_atom_ids: [],
    is_featured: false,
    is_pinned: false,
  },
  {
    title: 'The Science Behind Niacinamide: Why It Should Be in Every Protocol',
    content: `Let's talk about one of the most versatile ingredients in skincare: niacinamide (vitamin B3).

## Why Niacinamide?

This ingredient has robust clinical evidence for multiple skin benefits:

### 1. Barrier Function
Niacinamide increases ceramide and fatty acid production, strengthening the skin barrier. Studies show a 67% increase in ceramide levels after 4 weeks of 2% niacinamide use.

### 2. Anti-Inflammatory
It inhibits NF-κB pathway activation, reducing inflammatory cytokines. This makes it excellent for rosacea, acne, and sensitive skin conditions.

### 3. Sebum Regulation
At 2-4% concentration, niacinamide reduces sebum excretion rate by up to 25% over 4 weeks—perfect for oily and acne-prone skin.

### 4. Pigmentation
It inhibits melanosome transfer (not melanin production), making it safe for long-term use in hyperpigmentation protocols.

### 5. Anti-Aging
Stimulates collagen production and reduces fine lines when used at 4-5% concentration.

## Formulation Considerations

- Optimal pH: 5-7
- Concentration: 2-10% (higher isn't always better)
- Compatible with most actives except pure vitamin C at low pH
- Stable ingredient that doesn't require special storage

## Clinical Tips

- Start at 5% for most skin types
- Can be used AM and PM
- Pairs well with hyaluronic acid, peptides, and retinoids
- For sensitive skin, start at 2%

What's your favorite niacinamide product for professional treatments?`,
    post_type: 'article',
    category: 'Ingredient Science',
    tags: ['niacinamide', 'ingredients', 'science', 'formulation'],
    ska_atom_ids: [],
    is_featured: true,
    is_pinned: true,
  },
  {
    title: 'Case Study: Resolving Persistent Adult Acne with Holistic Approach',
    content: `**Client Profile:**
- 32-year-old female
- Hormonal acne (jawline and chin)
- Previous treatments: Benzoyl peroxide, salicylic acid, antibiotics
- Sensitive, dehydrated skin with compromised barrier

**Initial Assessment:**
The client had been over-treating her acne with multiple harsh products, leading to a damaged moisture barrier. Her acne was primarily inflammatory with occasional cysts around her period.

**Treatment Plan:**

**Phase 1: Barrier Repair (Weeks 1-4)**
- Simplified routine: gentle cleanser, hydrating serum, barrier cream
- No actives except niacinamide
- Weekly hydrating facials
- Result: Reduced sensitivity, improved hydration

**Phase 2: Gentle Acne Treatment (Weeks 5-12)**
- Introduced azelaic acid 15% at night
- Continued barrier support
- Bi-weekly facials with gentle extractions
- Added blue LED therapy
- Result: 50% reduction in inflammatory lesions

**Phase 3: Maintenance (Weeks 13-24)**
- Added low-dose retinol (0.3%)
- Monthly maintenance facials
- Continued azelaic acid
- Result: 80% improvement, rare breakouts

**Key Learnings:**
1. Sometimes less is more—healing the barrier first was crucial
2. Blue LED was a game-changer for this client
3. Addressing the hormonal component (referred to her doctor) helped significantly
4. Patience and education were as important as the treatments

Happy to answer any questions about this case!`,
    post_type: 'case_study',
    category: 'Treatment Protocols',
    tags: ['acne', 'case-study', 'adult-acne', 'barrier-repair', 'holistic'],
    ska_atom_ids: [],
    is_featured: false,
    is_pinned: false,
  },
  {
    title: 'Retinoid Strength Guide: Matching Products to Client Needs',
    content: `I see a lot of confusion about retinoid strengths and when to use what. Here's a quick guide I use with my team:

## Retinoid Hierarchy (weakest to strongest)

1. **Retinyl Palmitate** (0.1-1%)
   - Gentlest option
   - Good for: Sensitive skin, retinoid beginners, maintenance
   - Expect: Minimal irritation, subtle results over time

2. **Retinol** (0.1-1%)
   - Must convert to retinoic acid in skin
   - Good for: Most clients, anti-aging focus
   - Start at 0.25%, work up to 0.5-1%

3. **Retinaldehyde** (0.05-0.1%)
   - One conversion step from retinoic acid
   - Good for: Clients who want faster results but can't tolerate tretinoin
   - Similar efficacy to low-dose tretinoin with less irritation

4. **Adapalene** (0.1-0.3%)
   - Synthetic retinoid, more stable
   - Good for: Acne-prone skin specifically
   - Less irritating than tretinoin at equivalent efficacy

5. **Tretinoin** (0.025-0.1%)
   - Prescription only, gold standard
   - Good for: Clients committed to the process
   - Start at 0.025%, can increase after 3-6 months

## My Protocol for New Retinoid Users

**Week 1-2:** Apply every 3rd night
**Week 3-4:** Apply every other night
**Week 5-8:** Apply 5 nights/week
**Week 9+:** Nightly if tolerated

Always buffer with moisturizer initially!

What's your go-to retinoid product line?`,
    post_type: 'article',
    category: 'Ingredient Science',
    tags: ['retinoids', 'retinol', 'tretinoin', 'anti-aging', 'protocol'],
    ska_atom_ids: [],
    is_featured: false,
    is_pinned: false,
  },
  {
    title: 'Anyone using the new Dermalogica Pro line?',
    content: `Just got training on the new Dermalogica professional line and I'm curious if anyone has started using it yet.

The IonActive serums look promising—especially the retinol one with their "age reversal complex."

Thoughts? Worth the investment for the backbar?`,
    post_type: 'discussion',
    category: 'Products & Brands',
    tags: ['dermalogica', 'professional-products', 'backbar', 'product-review'],
    ska_atom_ids: [],
    is_featured: false,
    is_pinned: false,
  },
  {
    title: 'Question: Best approach for rosacea clients during summer?',
    content: `Summer is always tricky for my rosacea clients. The heat, humidity, and sun seem to trigger flares no matter what we do.

Current protocol:
- Calming facials with centella and green tea
- Azelaic acid for home care
- Mineral SPF

But I feel like I'm missing something. Does anyone have summer-specific tips for rosacea management?

Particularly interested in:
- LED therapy timing/frequency
- Cooling techniques during facials
- Product layering in humid weather`,
    post_type: 'question',
    category: 'Treatment Protocols',
    tags: ['rosacea', 'summer-skincare', 'sensitive-skin', 'inflammation'],
    ska_atom_ids: [],
    is_featured: false,
    is_pinned: false,
  },
  {
    title: 'Building a Successful Membership Model for Your Spa',
    content: `After years of per-service pricing, we switched to a membership model last year. Here's what we learned:

## The Model

**Tier 1: Essential - $99/month**
- One signature facial per month
- 10% off retail
- Priority booking

**Tier 2: Premium - $179/month**
- One advanced facial per month
- 15% off retail
- One add-on service included
- Priority booking + last-minute availability

**Tier 3: VIP - $299/month**
- Two treatments per month (any service)
- 20% off retail
- All add-ons included
- Priority everything + quarterly skin consultations

## Results After 12 Months

- Revenue increased 35%
- Client retention improved from 60% to 85%
- Retail sales up 50% (members shop more!)
- Booking consistency improved dramatically

## Keys to Success

1. **Clear value proposition** - Members save 20-30% compared to paying per visit
2. **Flexibility** - Allow service swaps, pause options
3. **Exclusive perks** - Early access to new treatments, member-only events
4. **Easy cancellation** - 30-day notice, no fees (builds trust)

## Challenges

- Initial cash flow dip while building membership base
- Some clients preferred à la carte
- Had to train staff on membership sales

Would love to hear from others who've tried this model!`,
    post_type: 'article',
    category: 'Business & Marketing',
    tags: ['business', 'membership-model', 'spa-management', 'revenue', 'client-retention'],
    ska_atom_ids: [],
    is_featured: true,
    is_pinned: false,
  },
];

const seedEvents: SeedEvent[] = [
  {
    title: 'Advanced Chemical Peel Certification Workshop',
    description: `Join us for an intensive hands-on workshop covering advanced chemical peel techniques.

**What You'll Learn:**
- Combination peel protocols
- Managing peel complications
- Client selection and contraindications
- Building profitable peel programs

**Includes:**
- Certification upon completion
- Sample products to try
- Lunch and refreshments

**Prerequisites:** Must be a licensed esthetician with at least 1 year of experience.`,
    event_type: 'workshop',
    format: 'in_person',
    location: 'JADE Training Center, Los Angeles, CA',
    start_time: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    end_time: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), // 8 hours later
    max_attendees: 20,
    price_cents: 34900,
    ska_topic_ids: [],
  },
  {
    title: 'Webinar: Understanding Skin Barrier Function',
    description: `A deep dive into the science of skin barrier function and how to optimize it in your treatments.

**Topics Covered:**
- Anatomy of the stratum corneum
- Key lipids and their functions
- Barrier damage: causes and signs
- Evidence-based repair strategies
- Product selection for barrier support

**Speaker:** Dr. Sarah Chen, Board-Certified Dermatologist

Free for JADE Sanctuary members!`,
    event_type: 'webinar',
    format: 'virtual',
    virtual_link: 'https://zoom.us/j/example',
    start_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000), // 1.5 hours later
    max_attendees: 500,
    price_cents: 0,
    ska_topic_ids: [],
  },
  {
    title: 'LA Estheticians Networking Meetup',
    description: `Connect with fellow skincare professionals in the Los Angeles area!

Join us for an evening of networking, learning, and fun. Light refreshments provided.

**Agenda:**
- 6:00 PM: Networking & Refreshments
- 7:00 PM: Quick presentations from local spa owners
- 7:30 PM: Open discussion
- 8:30 PM: Wrap up

Bring your business cards!`,
    event_type: 'meetup',
    format: 'in_person',
    location: 'The Skincare Lounge, Santa Monica, CA',
    start_time: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
    end_time: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours later
    max_attendees: 50,
    price_cents: 1500,
    ska_topic_ids: [],
  },
  {
    title: 'Skincare Innovations Conference 2025',
    description: `The premier event for skincare professionals featuring the latest in ingredient science, treatment technologies, and business strategies.

**Day 1: Science & Ingredients**
- Keynote: The Future of Anti-Aging
- Breakout sessions on peptides, growth factors, and exosomes
- Product showcase from leading brands

**Day 2: Treatments & Technology**
- Hands-on workshops
- Device demonstrations
- Panel: Combining treatments for optimal results

**Day 3: Business & Growth**
- Marketing in the digital age
- Building a million-dollar practice
- Networking lunch

Early bird pricing available until January 15th!`,
    event_type: 'conference',
    format: 'hybrid',
    location: 'Hilton Los Angeles, Downtown',
    virtual_link: 'https://zoom.us/j/conference',
    start_time: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    end_time: new Date(Date.now() + 62 * 24 * 60 * 60 * 1000), // 3 days later
    max_attendees: 300,
    price_cents: 79900,
    ska_topic_ids: [],
  },
  {
    title: 'Lunch & Learn: LED Therapy Protocols',
    description: `A casual virtual session exploring LED therapy applications for different skin conditions.

We'll cover:
- Red light for anti-aging
- Blue light for acne
- Near-infrared for healing
- Combination protocols
- Home device recommendations for clients

Bring your lunch and your questions!`,
    event_type: 'webinar',
    format: 'virtual',
    virtual_link: 'https://zoom.us/j/led-therapy',
    start_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    end_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000), // 1 hour later
    max_attendees: 100,
    price_cents: 0,
    ska_topic_ids: [],
  },
];

const seedComments: { postIndex: number; content: string; memberIndex: number }[] = [
  {
    postIndex: 0,
    memberIndex: 4,
    content: `Great protocol, Dr. Chen! I've had excellent results with oral tranexamic acid for my melasma patients. I typically prescribe 250mg twice daily for 3-6 months along with topical therapy.

Key considerations:
- Rule out contraindications (history of clots, smokers)
- Monitor for any adverse effects
- Results usually visible by week 8-12

For laser, I'm very cautious with melasma in darker skin. If using it at all, I prefer picosecond lasers at very conservative settings, but honestly topicals + oral TXA have given me better results with less risk.`,
  },
  {
    postIndex: 0,
    memberIndex: 2,
    content: `Adding to this discussion—I've been formulating with cysteamine lately and seeing great results for hyperpigmentation in all skin types. It's a naturally occurring amino acid that inhibits melanin synthesis through a different pathway than traditional tyrosinase inhibitors.

The only downside is the smell during application, but it dissipates quickly. Might be worth incorporating into your protocols!`,
  },
  {
    postIndex: 0,
    memberIndex: 1,
    content: `Thank you both for the insights! I've been hesitant about oral TXA but this gives me more confidence to discuss it with my dermatologist colleagues for referrals.

For my holistic clients who prefer natural approaches, I've had some success combining topical vitamin C, arbutin, and licorice root extract with strict sun avoidance. Results are slower but clients appreciate the gentler approach.`,
  },
  {
    postIndex: 1,
    memberIndex: 3,
    content: `This is such a common challenge! Here's what works for me:

**During consultation:**
"I understand you want results quickly—so do I! Here's what I've learned after treating hundreds of clients: rushing treatment often leads to worse outcomes like scarring or prolonged breakouts. My goal is to get you the best, longest-lasting results, and that requires patience."

**I also:**
- Show before/after photos with realistic timelines
- Give them a "skin journey" document with week-by-week expectations
- Schedule follow-ups at 4 weeks (so they see progress before the 8-week mark)
- Celebrate small wins along the way

The clients who can't handle this timeline usually aren't great long-term fits anyway.`,
  },
  {
    postIndex: 1,
    memberIndex: 0,
    content: `Lisa's advice is spot-on. I'd add that having educational materials—whether printed handouts or an email series—helps reinforce the message. Clients hear a lot during consultations and often forget the details.

I also find that explaining the *why* helps: "Your skin cells take about 28 days to turn over. We're essentially training your skin over multiple cycles to behave differently."`,
  },
  {
    postIndex: 2,
    memberIndex: 1,
    content: `James, this is such a comprehensive breakdown! I'm bookmarking this for my team.

One thing I'd add—niacinamide is fantastic for post-inflammatory erythema (PIE), those red marks left after acne. I've seen great results combining 5% niacinamide with azelaic acid for this.

For professional products, I really like the Paula's Choice Clinical line for backbar, and The Ordinary's 10% for retail recommendations on a budget.`,
  },
  {
    postIndex: 3,
    memberIndex: 6,
    content: `Love this case study! The barrier-first approach is something I advocate strongly from an integrative perspective. I'd be curious if you also addressed gut health? I've found that for persistent adult acne, especially the hormonal type, there's often a gut component.

Simple additions like probiotics, reducing inflammatory foods, and supporting liver detoxification can really complement topical treatments.`,
  },
  {
    postIndex: 3,
    memberIndex: 5,
    content: `This is so helpful for a newer esthetician like me! I tend to want to throw everything at acne right away. The phased approach makes so much sense though—I've definitely seen clients whose barriers were destroyed from overtreatment.

Question: How do you explain the "less is more" concept to clients who expect lots of products?`,
  },
  {
    postIndex: 3,
    memberIndex: 1,
    content: `@Emma - Great question! I usually say something like: "Your skin is like a garden. Right now, it's stressed and depleted. Before we can plant new flowers (active treatments), we need to restore the soil (your skin barrier). Once we have healthy soil, everything we plant will grow better."

Analogies really help clients understand why we're simplifying!`,
  },
  {
    postIndex: 6,
    memberIndex: 7,
    content: `For summer rosacea, I've had great success with:

1. **Cooling globes** - Keep them in the freezer between clients
2. **LED immediately after any treatment** - Red light helps calm inflammation
3. **Thermal water mists** - La Roche-Posay or Avene throughout the day
4. **Zinc-based SPF** - Better tolerated than chemical filters

For product layering, I tell clients to let each layer dry completely before the next. In humidity, I switch them to gel-based products and skip the occlusive at night.`,
  },
  {
    postIndex: 7,
    memberIndex: 3,
    content: `This is exactly what I've been researching! We're considering implementing a membership model next year.

Question: How did you handle the transition period? Did you grandfather existing clients into special rates? I'm worried about alienating our loyal clients who've been paying per service.`,
  },
  {
    postIndex: 7,
    memberIndex: 1,
    content: `We offered our existing clients a "Founding Member" discount—lifetime 10% off membership rates if they signed up in the first month. About 40% converted immediately, which gave us a solid base.

The key was framing it as a benefit: "We created this to reward our most loyal clients like you."`,
  },
];

async function seedSanctuaryData(): Promise<void> {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  JADE - Seeding Spa-ce Sanctuary Community Data');
  console.log('═══════════════════════════════════════════════════════════════');

  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✓ Database connected');
    }

    // Check if sanctuary tables exist
    const tableCheck = await AppDataSource.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'jade' AND table_name = 'sanctuary_member'
      );
    `);

    if (!tableCheck[0].exists) {
      console.log('✗ Sanctuary tables do not exist. Run the migration first.');
      console.log('  npx ts-node src/scripts/run-sanctuary-migration.ts');
      process.exit(1);
    }

    // Check if data already exists
    const existingMembers = await AppDataSource.query(`
      SELECT COUNT(*) FROM jade.sanctuary_member;
    `);

    if (parseInt(existingMembers[0].count) > 0) {
      console.log(`\n⚠️  Found ${existingMembers[0].count} existing members.`);
      console.log('   To reseed, clear existing data first:');
      console.log('   npx ts-node src/scripts/seed-sanctuary-data.ts --clear');

      if (process.argv.includes('--clear')) {
        console.log('\n🗑️  Clearing existing sanctuary data...');
        await AppDataSource.query(`DELETE FROM jade.event_registration;`);
        await AppDataSource.query(`DELETE FROM jade.community_event;`);
        await AppDataSource.query(`DELETE FROM jade.comment_like;`);
        await AppDataSource.query(`DELETE FROM jade.post_like;`);
        await AppDataSource.query(`DELETE FROM jade.community_comment;`);
        await AppDataSource.query(`DELETE FROM jade.community_post;`);
        await AppDataSource.query(`DELETE FROM jade.sanctuary_member;`);
        console.log('✓ Existing data cleared');
      } else {
        process.exit(0);
      }
    }

    // Seed members
    console.log('\n📦 Creating sanctuary members...');
    const memberIds: string[] = [];

    for (const member of seedMembers) {
      const result = await AppDataSource.query(
        `
        INSERT INTO jade.sanctuary_member (
          display_name, bio, expertise_areas, certifications,
          years_experience, is_verified, reputation_score
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id;
      `,
        [
          member.display_name,
          member.bio,
          member.expertise_areas,
          member.certifications,
          member.years_experience,
          member.is_verified,
          member.reputation_score,
        ]
      );
      memberIds.push(result[0].id);
      console.log(`  ✓ Created member: ${member.display_name}`);
    }
    console.log(`✓ Created ${memberIds.length} members`);

    // Seed posts
    console.log('\n📦 Creating community posts...');
    const postIds: string[] = [];

    for (let i = 0; i < seedPosts.length; i++) {
      const post = seedPosts[i];
      // Assign posts to different members
      const authorId = memberIds[i % memberIds.length];

      const result = await AppDataSource.query(
        `
        INSERT INTO jade.community_post (
          member_id, title, content, post_type, category,
          tags, ska_atom_ids, is_featured, is_pinned
        )
        VALUES ($1, $2, $3, $4::jade.post_type, $5, $6, $7, $8, $9)
        RETURNING id;
      `,
        [
          authorId,
          post.title,
          post.content,
          post.post_type,
          post.category,
          post.tags,
          post.ska_atom_ids,
          post.is_featured || false,
          post.is_pinned || false,
        ]
      );
      postIds.push(result[0].id);
      console.log(`  ✓ Created post: "${post.title.substring(0, 50)}..."`);
    }
    console.log(`✓ Created ${postIds.length} posts`);

    // Seed comments
    console.log('\n📦 Creating comments...');
    let commentCount = 0;

    for (const comment of seedComments) {
      const postId = postIds[comment.postIndex];
      const memberId = memberIds[comment.memberIndex];

      await AppDataSource.query(
        `
        INSERT INTO jade.community_comment (post_id, member_id, content)
        VALUES ($1, $2, $3);
      `,
        [postId, memberId, comment.content]
      );
      commentCount++;
    }
    console.log(`✓ Created ${commentCount} comments`);

    // Seed some likes
    console.log('\n📦 Creating post likes...');
    let likeCount = 0;

    // Add likes to posts (random distribution)
    for (let i = 0; i < postIds.length; i++) {
      const numLikes = Math.floor(Math.random() * 6) + 2; // 2-7 likes per post
      const likers = [...memberIds].sort(() => Math.random() - 0.5).slice(0, numLikes);

      for (const likerId of likers) {
        try {
          await AppDataSource.query(
            `
            INSERT INTO jade.post_like (post_id, member_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING;
          `,
            [postIds[i], likerId]
          );
          likeCount++;
        } catch {
          // Ignore duplicates
        }
      }
    }
    console.log(`✓ Created ${likeCount} post likes`);

    // Update view counts
    console.log('\n📦 Updating view counts...');
    for (const postId of postIds) {
      const views = Math.floor(Math.random() * 500) + 50;
      await AppDataSource.query(
        `
        UPDATE jade.community_post SET view_count = $1 WHERE id = $2;
      `,
        [views, postId]
      );
    }
    console.log('✓ View counts updated');

    // Seed events
    console.log('\n📦 Creating community events...');
    const eventIds: string[] = [];

    for (let i = 0; i < seedEvents.length; i++) {
      const event = seedEvents[i];
      // Assign events to verified members
      const organizerId = memberIds[i % 5]; // Use first 5 members (more experienced)

      const result = await AppDataSource.query(
        `
        INSERT INTO jade.community_event (
          organizer_id, title, description, event_type, format,
          location, virtual_link, start_time, end_time,
          max_attendees, price_cents, ska_topic_ids
        )
        VALUES ($1, $2, $3, $4::jade.event_type, $5::jade.event_format, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id;
      `,
        [
          organizerId,
          event.title,
          event.description,
          event.event_type,
          event.format,
          event.location || null,
          event.virtual_link || null,
          event.start_time,
          event.end_time || null,
          event.max_attendees || null,
          event.price_cents,
          event.ska_topic_ids,
        ]
      );
      eventIds.push(result[0].id);
      console.log(`  ✓ Created event: "${event.title.substring(0, 50)}..."`);
    }
    console.log(`✓ Created ${eventIds.length} events`);

    // Add some event registrations
    console.log('\n📦 Creating event registrations...');
    let registrationCount = 0;

    for (const eventId of eventIds) {
      const numRegistrations = Math.floor(Math.random() * 8) + 3; // 3-10 registrations
      const attendees = [...memberIds].sort(() => Math.random() - 0.5).slice(0, numRegistrations);

      for (const attendeeId of attendees) {
        try {
          await AppDataSource.query(
            `
            INSERT INTO jade.event_registration (event_id, member_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING;
          `,
            [eventId, attendeeId]
          );
          registrationCount++;
        } catch {
          // Ignore duplicates
        }
      }
    }
    console.log(`✓ Created ${registrationCount} event registrations`);

    // Summary
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  ✅ Sanctuary seed data complete!');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`
  Summary:
  - ${memberIds.length} members created
  - ${postIds.length} posts created
  - ${commentCount} comments created
  - ${likeCount} post likes created
  - ${eventIds.length} events created
  - ${registrationCount} event registrations created

  Test the data with:
    - GraphQL: communityPosts(limit: 10)
    - GraphQL: communityEvents(upcoming: true)
    - GraphQL: topContributors(limit: 5)
`);
  } catch (error) {
    console.error('✗ Seed failed:', error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

seedSanctuaryData().catch(console.error);
