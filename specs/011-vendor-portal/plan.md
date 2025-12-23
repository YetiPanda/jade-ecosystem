# Implementation Plan: Vendor Portal MVP

**Feature ID**: 011  
**Version**: 1.0.0  
**Status**: Planning  
**Total Duration**: 14 weeks  
**Estimated Hours**: 560 hours  

---

## Executive Summary

This plan outlines the implementation of vendor-facing features required to support the marketing claims made in the Jade vendor landing page and pitch deck. The work is structured in 5 phases, prioritizing features that directly validate marketing promises.

### Priority Framework

**P0 - Marketing Claim Validation**: Features explicitly promised to vendors  
**P1 - User Experience**: Features that significantly improve usability  
**P2 - Nice to Have**: Features that enhance but aren't promised  

---

## Phase A: Foundation (Weeks 1-4)

**Goal**: Establish data models, database schema, and API contracts

### Week 1: Data Models & Schema

| Day | Task | Hours | Priority |
|-----|------|-------|----------|
| Mon | Create VendorProfile entity with all fields | 6 | P0 |
| Tue | Create VendorValue and CertificationType enums | 4 | P0 |
| Wed | Create VendorCertification entity | 4 | P0 |
| Thu | Create database migration for vendor_profiles | 4 | P0 |
| Fri | Create database migration for certifications | 4 | P0 |

**Week 1 Subtotal**: 22 hours

### Week 2: Application & Onboarding Schema

| Day | Task | Hours | Priority |
|-----|------|-------|----------|
| Mon | Create VendorApplication entity | 6 | P0 |
| Tue | Create ApplicationStatus enum and workflow | 4 | P0 |
| Wed | Create VendorOnboarding entity | 4 | P0 |
| Thu | Create OnboardingStep entity | 4 | P0 |
| Fri | Create migrations for application tables | 4 | P0 |

**Week 2 Subtotal**: 22 hours

### Week 3: Analytics Schema

| Day | Task | Hours | Priority |
|-----|------|-------|----------|
| Mon | Create vendor_analytics_daily table | 4 | P0 |
| Tue | Create spa_vendor_relationship table | 4 | P0 |
| Wed | Create product_performance table | 4 | P0 |
| Thu | Create discovery_impressions table | 4 | P1 |
| Fri | Create indexes and materialized views | 6 | P0 |

**Week 3 Subtotal**: 22 hours

### Week 4: GraphQL Contracts

| Day | Task | Hours | Priority |
|-----|------|-------|----------|
| Mon | Define VendorProfile types in vendor.graphql | 4 | P0 |
| Tue | Define VendorApplication types | 4 | P0 |
| Wed | Define VendorDashboard query types | 4 | P0 |
| Thu | Define VendorOrder types | 4 | P0 |
| Fri | Define mutations and generate TypeScript types | 6 | P0 |

**Week 4 Subtotal**: 22 hours

**Phase A Total**: 88 hours

---

## Phase B: Core Portal (Weeks 5-8)

**Goal**: Deliver essential vendor-facing features

### Week 5: Vendor Dashboard - Metrics

| Task | Hours | Priority | Component |
|------|-------|----------|-----------|
| Create VendorDashboard page layout | 4 | P0 | VendorDashboard |
| Implement MetricCard component | 3 | P0 | MetricCard |
| Create dashboard service for metrics API | 6 | P0 | - |
| Implement revenue overview card | 4 | P0 | MetricCard |
| Implement orders overview card | 4 | P0 | MetricCard |
| Implement active spas overview card | 4 | P0 | MetricCard |
| Unit tests for dashboard service | 4 | P0 | - |

**Week 5 Subtotal**: 29 hours

### Week 6: Vendor Dashboard - Charts & Insights

| Task | Hours | Priority | Component |
|------|-------|----------|-----------|
| Implement RevenueChart (time-series) | 6 | P0 | RevenueChart |
| Implement OrdersChart (time-series) | 4 | P0 | OrdersChart |
| Implement DateRangePicker | 4 | P0 | DateRangePicker |
| Create SpaLeaderboard component | 6 | P0 | SpaLeaderboard |
| Implement ProductPerformanceTable | 6 | P0 | ProductPerformanceTable |
| Integration tests for charts | 4 | P1 | - |

**Week 6 Subtotal**: 30 hours

### Week 7: Brand Profile Editor

| Task | Hours | Priority | Component |
|------|-------|----------|-----------|
| Create VendorProfileEditor page | 4 | P0 | VendorProfileEditor |
| Implement BrandStorySection (rich text) | 6 | P0 | BrandStorySection |
| Implement ValuesBadgePicker | 6 | P0 | ValuesBadgePicker |
| Implement CertificationUploader | 6 | P0 | CertificationUploader |
| Implement GalleryManager | 6 | P1 | GalleryManager |
| Create profile update mutations | 4 | P0 | - |

**Week 7 Subtotal**: 32 hours

### Week 8: Order Management

| Task | Hours | Priority | Component |
|------|-------|----------|-----------|
| Create OrderList page with pagination | 6 | P0 | OrderList |
| Implement OrderSearchFilter | 4 | P0 | OrderSearchFilter |
| Implement OrderDetailPanel | 6 | P0 | OrderDetailPanel |
| Implement StatusUpdateDropdown | 4 | P0 | StatusUpdateDropdown |
| Implement ShippingInfoForm | 4 | P0 | ShippingInfoForm |
| Create order management mutations | 4 | P0 | - |
| Implement OrderStatusBadge | 2 | P0 | OrderStatusBadge |

**Week 8 Subtotal**: 30 hours

**Phase B Total**: 121 hours

---

## Phase C: Communication (Weeks 9-10)

**Goal**: Enable direct vendor-spa communication

### Week 9: Messaging Backend

| Task | Hours | Priority | Component |
|------|-------|----------|-----------|
| Create Conversation entity | 4 | P0 | - |
| Create Message entity | 4 | P0 | - |
| Create messaging service | 8 | P0 | - |
| Implement WebSocket connection for real-time | 8 | P0 | - |
| Create messaging GraphQL mutations | 4 | P0 | - |
| Unit tests for messaging service | 4 | P0 | - |

**Week 9 Subtotal**: 32 hours

### Week 10: Messaging UI

| Task | Hours | Priority | Component |
|------|-------|----------|-----------|
| Create ConversationList component | 6 | P0 | ConversationList |
| Create ChatPanel component | 8 | P0 | ChatPanel |
| Create MessageComposer component | 6 | P0 | MessageComposer |
| Implement UnreadBadge | 2 | P0 | UnreadBadge |
| Implement ConversationSearch | 4 | P1 | ConversationSearch |
| Create NotificationSettings | 4 | P1 | NotificationSettings |
| Integration tests | 4 | P0 | - |

**Week 10 Subtotal**: 34 hours

**Phase C Total**: 66 hours

---

## Phase D: Discovery & Optimization (Weeks 11-12)

**Goal**: Provide visibility insights and recommendations

### Week 11: Discovery Analytics Backend

| Task | Hours | Priority | Component |
|------|-------|----------|-----------|
| Create discovery analytics service | 8 | P1 | - |
| Implement impression tracking | 6 | P1 | - |
| Implement search query analytics | 6 | P1 | - |
| Implement values performance calculation | 6 | P1 | - |
| Create recommendation engine | 8 | P1 | - |
| Unit tests | 4 | P1 | - |

**Week 11 Subtotal**: 38 hours

### Week 12: Discovery Analytics UI

| Task | Hours | Priority | Component |
|------|-------|----------|-----------|
| Create DiscoveryDashboard page | 4 | P1 | DiscoveryDashboard |
| Implement ImpressionsChart | 6 | P1 | ImpressionsChart |
| Implement SearchQueryTable | 6 | P1 | SearchQueryTable |
| Implement ValuesPerformanceChart | 6 | P1 | ValuesPerformanceChart |
| Implement RecommendationCard | 4 | P1 | RecommendationCard |
| Create ProfileCompletenessWidget | 4 | P1 | ProfileCompletenessWidget |
| Integration tests | 4 | P1 | - |

**Week 12 Subtotal**: 34 hours

**Phase D Total**: 72 hours

---

## Phase E: Admin & Onboarding (Weeks 13-14)

**Goal**: Internal tooling and vendor onboarding flow

### Week 13: Application & Onboarding

| Task | Hours | Priority | Component |
|------|-------|----------|-----------|
| Create public ApplicationForm wizard | 8 | P0 | ApplicationForm |
| Create ApplicationStatusTracker | 4 | P0 | ApplicationStatusTracker |
| Create OnboardingChecklist component | 6 | P0 | OnboardingChecklist |
| Create StepCompletionForm | 4 | P0 | StepCompletionForm |
| Implement OnboardingProgressBar | 2 | P0 | OnboardingProgressBar |
| Create onboarding mutations | 4 | P0 | - |
| Create email templates (approval, reminders) | 4 | P1 | - |

**Week 13 Subtotal**: 32 hours

### Week 14: Admin Tools

| Task | Hours | Priority | Component |
|------|-------|----------|-----------|
| Create AdminApplicationQueue | 6 | P0 | AdminApplicationQueue |
| Create ApplicationDetailView | 6 | P0 | ApplicationDetailView |
| Create ApprovalActionsPanel | 4 | P0 | ApprovalActionsPanel |
| Implement RiskAssessmentCard | 4 | P1 | RiskAssessmentCard |
| Create SLA monitoring dashboard | 4 | P1 | - |
| Integration tests for admin flow | 4 | P0 | - |
| Documentation and training materials | 4 | P1 | - |

**Week 14 Subtotal**: 32 hours

**Phase E Total**: 64 hours

---

## Summary

| Phase | Weeks | Hours | Focus |
|-------|-------|-------|-------|
| A: Foundation | 1-4 | 88 | Data models, schema, contracts |
| B: Core Portal | 5-8 | 121 | Dashboard, profile, orders |
| C: Communication | 9-10 | 66 | Messaging system |
| D: Discovery | 11-12 | 72 | Analytics & optimization |
| E: Admin | 13-14 | 64 | Onboarding & internal tools |
| **Total** | **14** | **411** | |

*Note: 411 hours represents core development. Add ~35% buffer for testing, bug fixes, and iteration = **~560 total hours**.*

---

## Milestones & Deliverables

| Milestone | Week | Deliverable | Validates Claim |
|-----------|------|-------------|-----------------|
| M1 | 4 | GraphQL contracts complete | - |
| M2 | 6 | Dashboard MVP functional | "Full analytics" |
| M3 | 8 | Profile + Orders complete | "Brand control", "Order management" |
| M4 | 10 | Messaging live | "Direct relationships" |
| M5 | 12 | Discovery insights live | "See how spas find you" |
| M6 | 14 | Full MVP launch-ready | All claims validated |

---

## Resource Requirements

### Team

| Role | Allocation | Phase Focus |
|------|------------|-------------|
| Backend Engineer | 100% | A, C, D backend |
| Frontend Engineer | 100% | B, C, D, E UI |
| Full-Stack Engineer | 50% | Integration, testing |
| Product Designer | 25% | Wireframes, review |
| QA Engineer | 25% | Testing phases |

### Infrastructure

- [ ] Real-time messaging service (Pusher/Ably)
- [ ] Email service (SendGrid/SES)
- [ ] File storage (S3)
- [ ] Charting library (Recharts/Chart.js)
- [ ] Rich text editor (Lexical/TipTap)

---

## Risk Register

| Risk | Probability | Impact | Mitigation | Owner |
|------|-------------|--------|------------|-------|
| Feature 010 dependencies delayed | Medium | High | Start with mocked data | Eng Lead |
| Real-time messaging complexity | Medium | Medium | Use managed service (Pusher) | Backend |
| Design iteration delays | Medium | Medium | Ship with minimal styling first | Design |
| Scope creep | High | Medium | Strict P0-only first pass | PM |

---

## Success Criteria

### MVP Launch Criteria

- [ ] All P0 components implemented and tested
- [ ] Marketing claims validated (see checklist.md)
- [ ] Performance targets met (dashboard < 2s load)
- [ ] Security review passed
- [ ] 3 beta vendors successfully onboarded
- [ ] Documentation complete

### Post-Launch (30 days)

- [ ] > 80% vendor profile completion rate
- [ ] > 60% weekly dashboard engagement
- [ ] < 4 hour median message response time
- [ ] > 95% application SLA compliance

---

**Plan Owner**: Jesse Garza  
**Last Updated**: December 20, 2025  
**Next Review**: Week 1 kickoff
