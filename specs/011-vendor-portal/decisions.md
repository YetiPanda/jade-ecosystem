# Feature 011: Vendor Portal - Decisions & Open Items

**Feature ID**: 011  
**Status**: Design Complete  
**Last Updated**: December 20, 2025

---

## Decisions Made

### 1. Messaging Moderation ✅

**Decision**: Implement high-level moderation with value focus

**What "Moderated" Means**:
Messages are scanned for policy violations that could harm the marketplace ecosystem. Flagged messages are held for human review before delivery.

**Moderation Categories** (high-level, no proprietary details):
- **Off-platform transactions**: Attempts to bypass marketplace for direct deals
- **Spam/excessive promotion**: Unsolicited marketing outside normal communication
- **Abusive language**: Inappropriate or harmful content
- **Premature contact sharing**: Contact info shared before trust threshold met
- **Competitor solicitation**: Attempts to redirect to competing platforms

**User Experience**:
- Most messages delivered instantly (auto-approved)
- Flagged messages show "Under Review" status to sender
- Vendors can edit and resubmit rejected messages
- Clear explanation of why moderation exists (trust & safety)
- 24-hour review SLA for flagged messages

**Value Proposition** (for both vendors and spas):
- Protects vendors from fraudulent spa accounts
- Protects spas from spam and aggressive sales tactics
- Maintains marketplace integrity for all participants
- Builds trust in platform communications

---

### 2. Discovery Algorithm Transparency ✅

**Decision**: High-level visibility without proprietary details

**What Vendors See**:
- **Visibility Score** (0-100): Overall discoverability health
- **Score Factors** (4 categories, equal weight):
  - Profile completeness (25%)
  - Verified certifications (25%)
  - Product catalog quality (25%)
  - Engagement rate (25%)
- **Values Performance**: Rank within each value filter (e.g., "#2 of 15 Vegan brands")
- **Impression Sources**: Where traffic comes from (search, browse, values, recommendations, direct)
- **Actionable Recommendations**: Specific steps to improve visibility

**What Vendors DON'T See**:
- Proprietary ranking algorithm weights
- Competitor-specific ranking data
- Real-time algorithm adjustments
- Behavioral signal details (CTR, dwell time internals)
- A/B test participation or variants

**Rationale**:
This approach provides genuine value to vendors (they can improve their visibility) without exposing competitive intelligence that could be gamed or shared with competitors.

---

### 3. Spa Data Sharing ✅

**Decision**: Vendors see high-level sales data for their own brand products only

**What Vendors Can See**:
| Data Point | Visibility |
|------------|------------|
| Spa name & location | ✅ Yes (for ordering spas) |
| Orders for vendor's products | ✅ Yes (their own sales) |
| Revenue from vendor's products | ✅ Yes (their own revenue) |
| Reorder frequency | ✅ Yes (their own metrics) |
| Top products per spa | ✅ Yes (their own products) |
| Lifetime value | ✅ Yes (their own LTV) |

**What Vendors CANNOT See**:
| Data Point | Visibility |
|------------|------------|
| Spa's purchases from other vendors | ❌ No |
| Spa's total spend on platform | ❌ No |
| Spa's product preferences (other brands) | ❌ No |
| Spa's browsing/search behavior | ❌ No |
| Spa's contact list/staff details | ❌ No |
| Other vendors selling to same spa | ❌ No |

**Privacy Boundary**:
Vendors operate in their own "data silo" - they see comprehensive data about *their own* business relationships but nothing about the broader spa or marketplace activity.

---

### 4. Certification Verification ✅

**Decision**: Human-in-the-loop verification for final decision

**Workflow**:
```
Vendor Uploads Certificate
        ↓
Automated Pre-Check (format, readability)
        ↓
Added to Verification Queue
        ↓
Human Reviewer Verifies:
  ☐ Certificate appears authentic
  ☐ Brand name matches vendor
  ☐ Certificate number visible/legible
  ☐ Expiration date valid
  ☐ Cross-reference with issuing body (if possible)
        ↓
Decision: Approve | Reject | Request Clearer Document
        ↓
Vendor Notified via Email
```

**SLA**: Certification review within 3 business days

**Rationale**:
Certifications are trust signals that directly impact spa purchasing decisions. Human verification ensures accuracy and prevents fraudulent claims. This is a differentiator for the platform.

---

### 5. Platform Scope ✅

**Decision**: Web-responsive (desktop-first, mobile-friendly)

**Responsive Strategy**:
- **Reference design**: 1440px (desktop)
- **Tablet breakpoint**: 768px
- **Mobile breakpoint**: 375px

**Critical Mobile Flows** (must work well on mobile):
- Dashboard overview (metrics cards)
- Order list and status updates
- Messaging (inbox and chat)
- Notifications

**Desktop-Optimized Flows** (primarily desktop):
- Brand profile editor
- Product catalog management
- Discovery analytics
- Onboarding checklist

**Future Consideration**:
Native mobile app could be Phase 2 if vendor feedback indicates strong demand for on-the-go order management.

---

## Artifacts Created

### Specifications
| File | Purpose | Status |
|------|---------|--------|
| `spec.md` | Full requirements with data models | ✅ Complete |
| `plan.md` | 14-week implementation plan | ✅ Complete |
| `tasks.md` | 171 detailed tasks by sprint | ✅ Complete |
| `checklist.md` | Pre-development checklist | ✅ Complete |

### Design
| File | Purpose | Status |
|------|---------|--------|
| `wireframes.md` | ASCII wireframes for all screens | ✅ Complete |

### Contracts
| File | Purpose | Status |
|------|---------|--------|
| `contracts/vendor.graphql` | Vendor-facing GraphQL API | ✅ Complete |
| `contracts/vendor-admin.graphql` | Admin tools GraphQL API | ✅ Complete |

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| Total UI Components | 54 |
| GraphQL Queries | 15 |
| GraphQL Mutations | 18 |
| GraphQL Subscriptions | 3 |
| Enums Defined | 24 |
| Input Types | 22 |
| Object Types | 62 |
| Implementation Weeks | 14 |
| Estimated Hours | 560 |

---

## Next Steps

1. **Design Review**: Schedule wireframe review with design lead
2. **Contract Review**: Engineering review of GraphQL schema
3. **Security Review**: Privacy/compliance review of data sharing policies
4. **Sprint Planning**: Break Phase A into sprint 1 tasks
5. **Environment Setup**: Ensure Feature 010 dependencies are on track

---

**Document Owner**: Jesse Garza  
**Last Updated**: December 20, 2025
