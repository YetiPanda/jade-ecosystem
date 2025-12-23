# Specification: JADE Vendor Portal & Discovery System

**Feature ID**: 011  
**Feature Name**: Vendor Portal MVP - Supporting Marketing Claims  
**Version**: 1.0.0  
**Status**: REQUIREMENTS GATHERING  
**Created**: December 20, 2025  
**Parent Spec**: 010-ska-mach-evolution  
**Branch**: `feature/011-vendor-portal`  

---

## Executive Summary

This specification addresses the **gap between marketing claims and technical implementation** for the Jade vendor-facing features. An audit of the vendor landing page and pitch deck revealed that while the backend intelligence infrastructure (SKA, feedback loops, ranking) is well-specified in Feature 010, the **vendor-specific user interface, workflows, and data models are unspecified**.

### The Problem (Analogy)

Think of it like building a restaurant:
- **Feature 010** specifies the kitchen equipment, ingredient sourcing, and recipe algorithms
- **Feature 011** specifies the dining room, menu boards, and host stand—the parts customers actually see and interact with

We've built a sophisticated kitchen but haven't designed the front-of-house yet.

---

## Marketing Claims Audit

### Claims from Vendor Landing Page & Pitch Deck

| Marketing Claim | Specified? | Gap Severity |
|-----------------|------------|--------------|
| Brand Profile Control ("your story, your values, your imagery") | ❌ Not Specified | 🔴 Critical |
| Unlimited Product Catalog | ✅ Vendure Core | 🟢 Covered |
| Values-Based Discovery (organic, vegan, BIPOC-owned, etc.) | ❌ Not Specified | 🔴 Critical |
| 24/7/365 Availability | ✅ Infrastructure | 🟢 Covered |
| Real-Time Order Management | ⚠️ Vendure Core (no vendor UI) | 🟡 Partial |
| Spa Analytics (reorders, par levels, champions) | ❌ Not Specified | 🔴 Critical |
| Direct Messaging with Spas | ❌ Not Specified | 🔴 Critical |
| Discovery Optimization ("see how spas find you") | ❌ Not Specified | 🔴 Critical |
| ~3 Day Application Review | ❌ No SLA/workflow specified | 🟡 Partial |
| Application → First Order in 2 weeks | ❌ No onboarding workflow | 🟡 Partial |

### Gap Summary

| Category | Status |
|----------|--------|
| Backend Intelligence (SKA, matching) | ✅ Specified in 010 |
| Backend Feedback Loops | ✅ Specified in 010 |
| Vendor Database Schema | ⚠️ Basic Vendure, needs extension |
| **Vendor Portal UI** | ❌ **NOT SPECIFIED** |
| **Vendor Analytics Dashboard** | ❌ **NOT SPECIFIED** |
| **Values/Certification Taxonomy** | ❌ **NOT SPECIFIED** |
| **Vendor Messaging System** | ❌ **NOT SPECIFIED** |
| **Vendor Onboarding Workflow** | ❌ **NOT SPECIFIED** |
| **Discovery Insights for Vendors** | ❌ **NOT SPECIFIED** |

---

## Requirements by Feature Area

### 1. Vendor Brand Profile System

**Marketing Claim**: "Your story, your values, your imagery—presented to spas looking for brands like yours"

#### 1.1 Data Model Requirements

```typescript
// New: VendorProfile entity extension
interface VendorProfile {
  // Identity
  vendorId: string;                    // FK to Vendure Seller
  brandName: string;
  tagline: string;                     // "Clean beauty for sensitive souls"
  
  // Brand Story
  founderStory: string;                // Rich text, 2000 char limit
  missionStatement: string;            // 500 char limit
  brandVideo?: string;                 // YouTube/Vimeo embed URL
  
  // Visual Identity
  logoUrl: string;
  heroImageUrl: string;
  brandColorPrimary: string;           // Hex color
  brandColorSecondary: string;
  galleryImages: string[];             // Up to 10 images
  
  // Contact & Links
  websiteUrl: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    linkedin?: string;
  };
  
  // Certifications & Values (searchable)
  certifications: VendorCertification[];
  values: VendorValue[];
  
  // Business Info
  foundedYear: number;
  headquarters: string;                // City, State/Country
  teamSize: 'solo' | '2-10' | '11-50' | '51-200' | '200+';
  
  // Profile Completeness
  completenessScore: number;           // 0-100, affects discovery
  lastUpdated: Date;
}
```

#### 1.2 Values & Certifications Taxonomy

```typescript
// Searchable values that spas can filter by
enum VendorValue {
  // Ingredient Philosophy
  CLEAN_BEAUTY = 'clean_beauty',
  ORGANIC = 'organic',
  NATURAL = 'natural',
  VEGAN = 'vegan',
  CRUELTY_FREE = 'cruelty_free',
  FRAGRANCE_FREE = 'fragrance_free',
  PARABEN_FREE = 'paraben_free',
  SULFATE_FREE = 'sulfate_free',
  
  // Sustainability
  SUSTAINABLE = 'sustainable',
  ECO_PACKAGING = 'eco_packaging',
  REFILLABLE = 'refillable',
  ZERO_WASTE = 'zero_waste',
  CARBON_NEUTRAL = 'carbon_neutral',
  REEF_SAFE = 'reef_safe',
  
  // Founder Identity
  WOMAN_FOUNDED = 'woman_founded',
  BIPOC_OWNED = 'bipoc_owned',
  LGBTQ_OWNED = 'lgbtq_owned',
  VETERAN_OWNED = 'veteran_owned',
  FAMILY_OWNED = 'family_owned',
  SMALL_BATCH = 'small_batch',
  
  // Specialization
  MEDICAL_GRADE = 'medical_grade',
  ESTHETICIAN_DEVELOPED = 'esthetician_developed',
  DERMATOLOGIST_TESTED = 'dermatologist_tested',
  CLINICAL_RESULTS = 'clinical_results',
  PROFESSIONAL_ONLY = 'professional_only',
}

// Official certifications requiring verification
interface VendorCertification {
  type: CertificationType;
  certificateNumber?: string;
  issuingBody: string;
  expirationDate?: Date;
  verificationStatus: 'pending' | 'verified' | 'expired' | 'rejected';
  documentUrl?: string;              // Uploaded proof
}

enum CertificationType {
  USDA_ORGANIC = 'usda_organic',
  ECOCERT = 'ecocert',
  LEAPING_BUNNY = 'leaping_bunny',
  PETA_CERTIFIED = 'peta_certified',
  B_CORP = 'b_corp',
  MADE_SAFE = 'made_safe',
  EWG_VERIFIED = 'ewg_verified',
  FSC_CERTIFIED = 'fsc_certified',
  COSMOS_ORGANIC = 'cosmos_organic',
  COSMOS_NATURAL = 'cosmos_natural',
  FAIR_TRADE = 'fair_trade',
  WOMEN_OWNED_WBENC = 'women_owned_wbenc',
  MINORITY_OWNED_NMSDC = 'minority_owned_nmsdc',
}
```

#### 1.3 UI Components Required

| Component | Purpose | Priority |
|-----------|---------|----------|
| `VendorProfileEditor` | CRUD for brand profile | P0 |
| `BrandStorySection` | Rich text editor for founder story | P0 |
| `ValuesBadgePicker` | Multi-select for values with icons | P0 |
| `CertificationUploader` | File upload + verification status | P0 |
| `ProfileCompletenessWidget` | Progress indicator with suggestions | P1 |
| `ProfilePreview` | "See how spas see you" preview | P1 |
| `GalleryManager` | Drag-drop image gallery editor | P1 |

---

### 2. Vendor Dashboard & Analytics

**Marketing Claim**: "See reorders, par levels, and client portal sales. Know which spas are your champions."

#### 2.1 Dashboard Metrics Requirements

```typescript
interface VendorDashboardMetrics {
  // Overview Metrics
  overview: {
    totalOrders: number;
    totalRevenue: number;
    activeSpas: number;              // Spas who ordered in last 90 days
    averageOrderValue: number;
    reorderRate: number;             // % of spas who reorder
  };
  
  // Time-Series Data
  trends: {
    ordersOverTime: TimeSeriesData[];
    revenueOverTime: TimeSeriesData[];
    newSpasOverTime: TimeSeriesData[];
  };
  
  // Spa Insights (The "Champions" feature)
  spaInsights: {
    topSpas: SpaPerformance[];       // Ranked by revenue
    growingSpas: SpaPerformance[];   // Highest growth rate
    atRiskSpas: SpaPerformance[];    // Declining orders
    newSpas: SpaPerformance[];       // First order in last 30 days
  };
  
  // Product Performance
  productInsights: {
    topProducts: ProductPerformance[];
    risingProducts: ProductPerformance[];
    decliningProducts: ProductPerformance[];
    neverOrdered: ProductPerformance[];  // In catalog but 0 orders
  };
  
  // Discovery Insights (see section 5)
  discoveryInsights: DiscoveryAnalytics;
}

interface SpaPerformance {
  spaId: string;
  spaName: string;
  spaLocation: string;
  totalOrders: number;
  totalRevenue: number;
  lastOrderDate: Date;
  reorderFrequencyDays: number;      // Average days between orders
  topProducts: string[];             // Top 3 product names
  growthTrend: 'growing' | 'stable' | 'declining';
  lifetimeValue: number;
  // Par Level Data (if spa shares)
  parLevelData?: {
    productId: string;
    currentStock: number;
    parLevel: number;
    daysUntilReorder: number;
  }[];
}

interface ProductPerformance {
  productId: string;
  productName: string;
  sku: string;
  totalUnits: number;
  totalRevenue: number;
  uniqueSpas: number;                // Number of spas who ordered
  reorderRate: number;
  averageRating?: number;
  trendDirection: 'up' | 'flat' | 'down';
}
```

#### 2.2 UI Components Required

| Component | Purpose | Priority |
|-----------|---------|----------|
| `VendorDashboard` | Main dashboard container | P0 |
| `MetricCard` | KPI display with trend indicator | P0 |
| `RevenueChart` | Time-series revenue visualization | P0 |
| `OrdersChart` | Time-series orders visualization | P0 |
| `SpaLeaderboard` | Ranked list of top spas | P0 |
| `ChampionSpaBadge` | Visual indicator for top performers | P1 |
| `AtRiskSpaAlert` | Warning for declining spa relationships | P1 |
| `ProductPerformanceTable` | Sortable product analytics table | P0 |
| `ParLevelIndicator` | Stock level visualization | P2 |
| `DateRangePicker` | Filter analytics by time period | P0 |
| `ExportButton` | CSV/PDF export of analytics | P2 |

---

### 3. Real-Time Order Management

**Marketing Claim**: "Track orders, manage fulfillment, and handle spa communications—all in one place."

#### 3.1 Order Management Requirements

```typescript
interface VendorOrder {
  orderId: string;
  orderNumber: string;               // Human-readable (e.g., ORD-2025-00123)
  
  // Spa Info
  spaId: string;
  spaName: string;
  spaContact: {
    name: string;
    email: string;
    phone?: string;
  };
  shippingAddress: Address;
  
  // Order Details
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  
  // Status
  status: OrderStatus;
  statusHistory: StatusChange[];
  
  // Fulfillment
  fulfillment: {
    carrier?: string;
    trackingNumber?: string;
    estimatedDelivery?: Date;
    actualDelivery?: Date;
  };
  
  // Communication
  messages: OrderMessage[];          // Thread with spa
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

enum OrderStatus {
  PENDING = 'pending',               // Awaiting vendor confirmation
  CONFIRMED = 'confirmed',           // Vendor accepted
  PROCESSING = 'processing',         // Being prepared
  SHIPPED = 'shipped',               // In transit
  DELIVERED = 'delivered',           // Confirmed delivery
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
  DISPUTED = 'disputed',
}
```

#### 3.2 UI Components Required

| Component | Purpose | Priority |
|-----------|---------|----------|
| `OrderList` | Paginated order list with filters | P0 |
| `OrderDetailPanel` | Full order details view | P0 |
| `OrderStatusBadge` | Visual status indicator | P0 |
| `StatusUpdateDropdown` | Change order status | P0 |
| `ShippingInfoForm` | Enter tracking details | P0 |
| `OrderTimeline` | Visual status history | P1 |
| `BulkActionBar` | Multi-select order actions | P1 |
| `OrderSearchFilter` | Search by order#, spa, date | P0 |
| `QuickReplyTemplates` | Pre-written message templates | P2 |

---

### 4. Vendor Messaging System

**Marketing Claim**: "Build relationships directly with spa buyers. Answer questions and nurture partnerships."

#### 4.1 Messaging Requirements

```typescript
interface VendorConversation {
  conversationId: string;
  
  // Participants
  vendorId: string;
  spaId: string;
  spaName: string;
  spaContactName: string;
  
  // Context (optional link to order/product)
  context?: {
    type: 'order' | 'product' | 'general';
    referenceId?: string;
    referenceName?: string;
  };
  
  // Messages
  messages: Message[];
  
  // Status
  status: 'active' | 'archived' | 'blocked';
  unreadCount: number;
  lastMessageAt: Date;
  
  // Metadata
  createdAt: Date;
}

interface Message {
  messageId: string;
  senderId: string;
  senderType: 'vendor' | 'spa';
  content: string;                   // Plain text or markdown
  attachments?: Attachment[];
  readAt?: Date;
  createdAt: Date;
}

interface Attachment {
  type: 'image' | 'document' | 'product_link';
  url: string;
  name: string;
  size?: number;
}
```

#### 4.2 UI Components Required

| Component | Purpose | Priority |
|-----------|---------|----------|
| `ConversationList` | Inbox with spa conversations | P0 |
| `ChatPanel` | Message thread view | P0 |
| `MessageComposer` | Text input with attachments | P0 |
| `UnreadBadge` | Unread message indicator | P0 |
| `ConversationSearch` | Search message history | P1 |
| `QuickProductShare` | Insert product link in message | P1 |
| `NotificationSettings` | Email/push notification prefs | P1 |
| `ConversationArchive` | Archive/restore conversations | P2 |

---

### 5. Discovery Optimization

**Marketing Claim**: "See how spas find you and get recommendations to improve your visibility."

#### 5.1 Discovery Analytics Requirements

```typescript
interface DiscoveryAnalytics {
  // Traffic Sources
  impressions: {
    total: number;
    bySource: {
      search: number;                // Found via search
      browse: number;                // Found via category browse
      values: number;                // Found via values filter
      recommendation: number;        // Shown as recommendation
      direct: number;                // Direct profile visit
    };
    trend: 'up' | 'flat' | 'down';
  };
  
  // Search Insights
  searchInsights: {
    queriesLeadingToYou: SearchQuery[];   // What spas search to find you
    missedQueries: SearchQuery[];          // Relevant queries you don't rank for
    competitorQueries: SearchQuery[];      // Queries where competitors outrank
  };
  
  // Values Performance
  valuesPerformance: {
    value: VendorValue;
    impressions: number;
    clicks: number;
    conversions: number;
    rank: number;                    // Your rank within this value filter
  }[];
  
  // Profile Engagement
  profileEngagement: {
    profileViews: number;
    avgTimeOnProfile: number;        // Seconds
    catalogBrowses: number;
    productClicks: number;
    contactClicks: number;
    bounceRate: number;
  };
  
  // Recommendations
  recommendations: DiscoveryRecommendation[];
}

interface SearchQuery {
  query: string;
  volume: number;                    // Search frequency
  yourPosition?: number;             // Your rank (null if not ranking)
  topCompetitor?: string;            // Who ranks #1
}

interface DiscoveryRecommendation {
  type: 'profile' | 'values' | 'products' | 'content';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionLabel: string;
  actionRoute: string;               // Deep link to fix
  potentialImpact: string;           // e.g., "+15% visibility"
}
```

#### 5.2 UI Components Required

| Component | Purpose | Priority |
|-----------|---------|----------|
| `DiscoveryDashboard` | Overview of discovery metrics | P1 |
| `ImpressionsChart` | Traffic sources visualization | P1 |
| `SearchQueryTable` | Queries leading to profile | P1 |
| `ValuesPerformanceChart` | Ranking by value filters | P1 |
| `ProfileEngagementStats` | Engagement metrics cards | P1 |
| `RecommendationCard` | Actionable optimization tip | P1 |
| `VisibilityScoreGauge` | Overall discovery health score | P2 |
| `CompetitorComparisonWidget` | Anonymous competitive insights | P2 |

---

### 6. Vendor Application & Onboarding

**Marketing Claim**: "Our curation team reviews every application within 3 business days. From application to first order in as little as 2 weeks."

#### 6.1 Application Workflow Requirements

```typescript
interface VendorApplication {
  applicationId: string;
  
  // Applicant Info
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;                    // "Founder", "Sales Director", etc.
  };
  
  // Company Info
  companyInfo: {
    brandName: string;
    legalName: string;
    website: string;
    yearFounded: number;
    headquarters: string;
    employeeCount: string;
    annualRevenue?: string;          // Optional range
  };
  
  // Product Info
  productInfo: {
    productCategories: string[];
    skuCount: string;                // Range: "1-10", "11-50", etc.
    priceRange: string;              // "$", "$$", "$$$", "$$$$"
    targetMarket: string[];          // "Day Spas", "Med Spas", etc.
    currentDistribution: string[];   // Existing channels
  };
  
  // Values & Certifications
  values: VendorValue[];
  certifications: CertificationType[];
  
  // Why Jade
  whyJade: string;                   // Free text, why they want to join
  
  // Documents
  documents: {
    productCatalog?: string;         // URL
    lineSheet?: string;              // URL
    insuranceCertificate?: string;   // URL
    businessLicense?: string;        // URL
  };
  
  // Internal Processing
  status: ApplicationStatus;
  assignedReviewer?: string;
  reviewNotes: ReviewNote[];
  riskScore?: number;                // Automated risk assessment
  
  // Timestamps
  submittedAt: Date;
  reviewStartedAt?: Date;
  decidedAt?: Date;
  slaDeadline: Date;                 // submittedAt + 3 business days
}

enum ApplicationStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  ADDITIONAL_INFO_REQUESTED = 'additional_info_requested',
  APPROVED = 'approved',
  CONDITIONALLY_APPROVED = 'conditionally_approved',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

interface ReviewNote {
  reviewerId: string;
  reviewerName: string;
  note: string;
  category: 'general' | 'risk' | 'quality' | 'fit';
  createdAt: Date;
}
```

#### 6.2 Onboarding Workflow Requirements

```typescript
interface VendorOnboarding {
  vendorId: string;
  applicationId: string;
  
  // Checklist Steps
  steps: OnboardingStep[];
  
  // Overall Progress
  completedSteps: number;
  totalSteps: number;
  percentComplete: number;
  
  // Timeline
  startedAt: Date;
  targetCompletionDate: Date;        // 2 weeks from approval
  completedAt?: Date;
  
  // Support
  assignedSuccessManager?: string;
  supportThreadId?: string;
}

interface OnboardingStep {
  stepId: string;
  name: string;
  description: string;
  order: number;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  required: boolean;
  helpArticleUrl?: string;
  completedAt?: Date;
}

// Default Onboarding Steps
const DEFAULT_ONBOARDING_STEPS = [
  { name: 'Complete Brand Profile', required: true },
  { name: 'Upload Product Catalog', required: true },
  { name: 'Set Pricing & Minimums', required: true },
  { name: 'Configure Shipping', required: true },
  { name: 'Add Bank Account', required: true },
  { name: 'Review & Accept Terms', required: true },
  { name: 'Schedule Launch Call', required: false },
  { name: 'Upload Brand Assets', required: false },
];
```

#### 6.3 UI Components Required

| Component | Purpose | Priority |
|-----------|---------|----------|
| `ApplicationForm` | Multi-step application wizard | P0 |
| `ApplicationStatusTracker` | Applicant-facing status view | P0 |
| `AdminApplicationQueue` | Reviewer queue with SLA indicators | P0 |
| `ApplicationDetailView` | Reviewer application deep-dive | P0 |
| `RiskAssessmentCard` | Automated risk factors display | P1 |
| `ApprovalActionsPanel` | Approve/reject with notes | P0 |
| `OnboardingChecklist` | Vendor-facing onboarding progress | P0 |
| `StepCompletionForm` | Individual step completion UI | P0 |
| `OnboardingProgressBar` | Visual progress indicator | P0 |
| `WelcomeEmailTemplate` | Approval email content | P1 |

---

## Integration with Feature 010

### Dependencies on SKA MACH Evolution

| Feature 011 Component | Depends On (Feature 010) |
|-----------------------|--------------------------|
| Values-based Search | Feedback Loop B (outcome events) |
| Discovery Analytics | Segment-level Metrics (Sprint 3.1) |
| Product Performance | Interaction Events (Sprint 1.3) |
| Spa Champions | Behavioral Signals (Sprint 2.3) |
| Profile Completeness | Data Quality Metrics (Sprint 3.2) |

### New Data Flows Required

```
Vendor Profile Update → EventBridge → Intelligence Service (reindex values)
                                   → Analytics Service (track changes)

Order Completed → EventBridge → Vendor Dashboard (update metrics)
                            → Discovery Analytics (conversion tracking)

Spa Views Vendor → Feedback Service → Discovery Analytics (impression tracking)
```

---

## UI/UX Design System Requirements

### New Design Tokens

```scss
// Vendor Portal Color Palette
$vendor-primary: #2d5a47;        // Jade green (from brand)
$vendor-accent: #b8926a;         // Gold accent
$vendor-success: #4a8068;        // Growth/positive
$vendor-warning: #d4936a;        // Attention needed
$vendor-danger: #d4736a;         // Decline/risk

// Status Colors
$status-pending: #f0ad4e;
$status-confirmed: #5bc0de;
$status-processing: #0275d8;
$status-shipped: #5cb85c;
$status-delivered: #28a745;
$status-cancelled: #d9534f;

// Discovery Health
$discovery-excellent: #28a745;
$discovery-good: #5cb85c;
$discovery-needs-work: #f0ad4e;
$discovery-poor: #d9534f;
```

### Component Library Extensions

| Component | Variant | Usage |
|-----------|---------|-------|
| `Badge` | `value-badge` | Display vendor values with icons |
| `Card` | `metric-card` | Dashboard KPI display |
| `Card` | `spa-card` | Spa relationship summary |
| `Table` | `sortable-analytics` | Performance tables |
| `Chart` | `trend-line` | Time-series with comparison |
| `Progress` | `onboarding-step` | Checklist progress |
| `Alert` | `recommendation` | Actionable optimization tip |

---

## Success Metrics

### Feature 011 Specific Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Vendor profile completion rate | > 80% | % of vendors at 100% completeness |
| Time to complete onboarding | < 10 days | Median days from approval |
| Dashboard daily active usage | > 60% | % of vendors using dashboard weekly |
| Message response time | < 4 hours | Median vendor response time |
| Discovery recommendation action rate | > 30% | % of recommendations acted on |
| Application SLA compliance | > 95% | % reviewed within 3 business days |

### Validation of Marketing Claims

| Claim | Validation Method | Target |
|-------|-------------------|--------|
| "24/7 Discovery" | Uptime monitoring | 99.9% availability |
| "Direct Relationships" | Message thread count | > 5 spa conversations per vendor |
| "Know Your Champions" | Dashboard engagement | > 70% vendors view spa insights weekly |
| "Full Analytics" | Feature usage | > 80% vendors export analytics monthly |
| "~3 Day Review" | SLA tracking | 95% within 3 business days |
| "2 Weeks to First Order" | Onboarding tracking | 60% complete onboarding in 14 days |

---

## Implementation Phases

### Phase A: Foundation (Weeks 1-4)

**Focus**: Data models, database schema, API contracts

- [ ] VendorProfile entity and migrations
- [ ] Values/Certifications taxonomy
- [ ] Application workflow entities
- [ ] GraphQL contracts for vendor.graphql
- [ ] EventBridge event definitions

### Phase B: Core Portal (Weeks 5-8)

**Focus**: Essential vendor-facing features

- [ ] Vendor Dashboard (metrics + charts)
- [ ] Order Management UI
- [ ] Brand Profile Editor
- [ ] Application Form (public-facing)

### Phase C: Communication (Weeks 9-10)

**Focus**: Messaging and notifications

- [ ] Messaging system backend
- [ ] Chat UI components
- [ ] Notification preferences
- [ ] Email templates

### Phase D: Discovery & Optimization (Weeks 11-12)

**Focus**: Advanced analytics and recommendations

- [ ] Discovery Analytics dashboard
- [ ] Recommendation engine
- [ ] Profile completeness scoring
- [ ] Visibility insights

### Phase E: Admin & Operations (Week 13-14)

**Focus**: Internal tooling

- [ ] Application review queue
- [ ] Onboarding management
- [ ] Vendor support tools
- [ ] SLA monitoring dashboard

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Scope creep into P2 features | High | Medium | Strict MVP scope enforcement |
| Integration complexity with 010 | Medium | High | Contract-first development |
| UI component library gaps | Medium | Medium | Design system audit first |
| Analytics data availability | Medium | High | Seed with synthetic data for demo |
| Messaging abuse/spam | Low | Medium | Rate limiting + moderation tools |

---

## Open Questions

1. **Messaging Moderation**: Should vendor-spa messages be moderated? Real-time or async review?

2. **Discovery Algorithm Transparency**: How much of the discovery algorithm should we expose to vendors?

3. **Spa Data Sharing**: What spa data can vendors see? Need privacy review.

4. **Certification Verification**: Manual review or automated verification service?

5. **Mobile App**: Is vendor mobile app in scope or web-responsive only?

---

## Appendix: Wireframe References

*To be added after design review*

- [ ] Vendor Dashboard wireframes
- [ ] Brand Profile Editor wireframes
- [ ] Order Management wireframes
- [ ] Messaging UI wireframes
- [ ] Discovery Analytics wireframes
- [ ] Application Flow wireframes

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-12-20 | Claude AI | Initial requirements from marketing audit |

---

**Prepared by**: Claude AI Development Assistant  
**Review required by**: Jesse Garza  
**Design review required by**: TBD  
**Decision deadline**: TBD
