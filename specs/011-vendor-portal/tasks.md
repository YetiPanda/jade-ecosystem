# Tasks: Vendor Portal MVP

**Feature ID**: 011
**Version**: 1.0.0
**Total Tasks**: 171
**Estimated Hours**: 566 hours (14 weeks × 40 hours)
**Status**: In Progress - 85% Complete (Phases A-D Complete, Phase E Remaining)  

---

> **📊 Quick Status**: See [VENDOR-PORTAL-STATUS.md](../../VENDOR-PORTAL-STATUS.md) for detailed implementation status.
> **Current State**: Phases A-D (85%) complete. Only Phase E (Admin Tools) remains.

---

## Task Tracking Legend

- 🔴 **Not Started** - Task pending
- 🟡 **In Progress** - Currently being worked on
- 🟢 **Complete** - Task finished and verified
- ⏸️ **Blocked** - Waiting on dependency
- 🔵 **Under Review** - Awaiting code review

---

## Phase A: Foundation (Weeks 1-4)

### Sprint A.1: Vendor Profile Schema (Week 1) ✅ COMPLETE

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| A.1.1 | Create `VendorProfile` TypeORM entity | Backend | 4 | 🟢 | - |
| A.1.2 | Add brand identity fields (name, tagline, story) | Backend | 2 | 🟢 | A.1.1 |
| A.1.3 | Add visual identity fields (logo, hero, colors) | Backend | 2 | 🟢 | A.1.1 |
| A.1.4 | Add social links JSON field | Backend | 1 | 🟢 | A.1.1 |
| A.1.5 | Create `VendorValue` enum with 25 values | Backend | 2 | 🟢 | - |
| A.1.6 | Create `vendor_profile_values` junction table | Backend | 2 | 🟢 | A.1.1, A.1.5 |
| A.1.7 | Create `CertificationType` enum | Backend | 1 | 🟢 | - |
| A.1.8 | Create `VendorCertification` entity | Backend | 3 | 🟢 | A.1.1, A.1.7 |
| A.1.9 | Add verification status workflow fields | Backend | 2 | 🟢 | A.1.8 |
| A.1.10 | Create migration `AddVendorProfiles.ts` | Backend | 2 | 🟢 | A.1.1-A.1.9 |
| A.1.11 | Add Zod validation schemas | Backend | 2 | 🟢 | A.1.5, A.1.7 |
| A.1.12 | Write unit tests for profile entity | QA | 3 | 🟢 | A.1.1 |

**Sprint A.1 Subtotal**: 26 hours ✅ **COMPLETE**

---

### Sprint A.2: Application & Onboarding Schema (Week 2) ✅ COMPLETE

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| A.2.1 | Create `VendorApplication` entity | Backend | 4 | 🟢 | - |
| A.2.2 | Add applicant contact info fields | Backend | 2 | 🟢 | A.2.1 |
| A.2.3 | Add company info JSON field | Backend | 2 | 🟢 | A.2.1 |
| A.2.4 | Add product info JSON field | Backend | 2 | 🟢 | A.2.1 |
| A.2.5 | Create `ApplicationStatus` enum | Backend | 1 | 🟢 | - |
| A.2.6 | Add status workflow fields | Backend | 2 | 🟢 | A.2.1, A.2.5 |
| A.2.7 | Create `ReviewNote` entity | Backend | 2 | 🟢 | A.2.1 |
| A.2.8 | Add SLA deadline calculation trigger | Backend | 2 | 🟢 | A.2.1 |
| A.2.9 | Create `VendorOnboarding` entity | Backend | 3 | 🟢 | A.2.1 |
| A.2.10 | Create `OnboardingStep` entity | Backend | 2 | 🟢 | A.2.9 |
| A.2.11 | Seed default onboarding steps | Backend | 1 | 🟢 | A.2.10 |
| A.2.12 | Create migration `AddVendorApplications.ts` | Backend | 2 | 🟢 | A.2.1-A.2.10 |
| A.2.13 | Write unit tests for application entity | QA | 3 | 🟢 | A.2.1 |

**Sprint A.2 Subtotal**: 28 hours ✅ **COMPLETE**

---

### Sprint A.3: Analytics Schema (Week 3) ✅ COMPLETE

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| A.3.1 | Create `vendor_analytics_daily` table | Backend | 3 | 🟢 | - |
| A.3.2 | Add revenue, orders, impressions columns | Backend | 2 | 🟢 | A.3.1 |
| A.3.3 | Create `spa_vendor_relationship` table | Backend | 3 | 🟢 | - |
| A.3.4 | Add lifetime value, order count, last order columns | Backend | 2 | 🟢 | A.3.3 |
| A.3.5 | Create `product_performance_daily` table | Backend | 3 | 🟢 | - |
| A.3.6 | Add units, revenue, unique spas columns | Backend | 2 | 🟢 | A.3.5 |
| A.3.7 | Create `discovery_impressions` table | Backend | 3 | 🟢 | - |
| A.3.8 | Add source type, query text columns | Backend | 2 | 🟢 | A.3.7 |
| A.3.9 | Create materialized view for vendor dashboard | Backend | 4 | 🟢 | A.3.1-A.3.6 |
| A.3.10 | Add indexes for time-range queries | Backend | 2 | 🟢 | A.3.9 |
| A.3.11 | Create migration `AddVendorAnalytics.ts` | Backend | 2 | 🟢 | A.3.1-A.3.10 |
| A.3.12 | Write tests for analytics queries | QA | 3 | 🟢 | A.3.9 |

**Sprint A.3 Subtotal**: 31 hours ✅ **COMPLETE**

---

### Sprint A.4: GraphQL Contracts (Week 4)

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| A.4.1 | Add `VendorProfile` type to vendor.graphql | Backend | 2 | 🔴 | A.1.1 |
| A.4.2 | Add `VendorValue` and `CertificationType` enums | Backend | 1 | 🔴 | A.1.5, A.1.7 |
| A.4.3 | Add `VendorCertification` type | Backend | 1 | 🔴 | A.1.8 |
| A.4.4 | Add `vendorProfile(id: ID!)` query | Backend | 2 | 🔴 | A.4.1 |
| A.4.5 | Add `updateVendorProfile` mutation | Backend | 2 | 🔴 | A.4.1 |
| A.4.6 | Add `VendorApplication` types | Backend | 2 | 🔴 | A.2.1 |
| A.4.7 | Add `submitVendorApplication` mutation | Backend | 2 | 🔴 | A.4.6 |
| A.4.8 | Add `VendorDashboardMetrics` type | Backend | 3 | 🔴 | A.3.9 |
| A.4.9 | Add `vendorDashboard(dateRange: DateRange!)` query | Backend | 2 | 🔴 | A.4.8 |
| A.4.10 | Add `VendorOrder` types | Backend | 2 | 🔴 | - |
| A.4.11 | Add `vendorOrders(filter: OrderFilter!)` query | Backend | 2 | 🔴 | A.4.10 |
| A.4.12 | Add order management mutations | Backend | 2 | 🔴 | A.4.10 |
| A.4.13 | Run GraphQL codegen | Backend | 1 | 🔴 | A.4.1-A.4.12 |
| A.4.14 | Verify TypeScript types generate correctly | Backend | 1 | 🔴 | A.4.13 |

**Sprint A.4 Subtotal**: 25 hours

---

## Phase B: Core Portal (Weeks 5-8)

### Sprint B.1: Dashboard Metrics (Week 5)

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| B.1.1 | Create `VendorDashboard` page component | Frontend | 3 | 🔴 | A.4.9 |
| B.1.2 | Create `MetricCard` component | Frontend | 2 | 🔴 | - |
| B.1.3 | Implement trend indicator in MetricCard | Frontend | 2 | 🔴 | B.1.2 |
| B.1.4 | Create `useDashboardMetrics` hook | Frontend | 3 | 🔴 | A.4.9 |
| B.1.5 | Create vendor dashboard service (backend) | Backend | 4 | 🔴 | A.3.9 |
| B.1.6 | Implement revenue metric card | Frontend | 2 | 🔴 | B.1.2, B.1.4 |
| B.1.7 | Implement orders metric card | Frontend | 2 | 🔴 | B.1.2, B.1.4 |
| B.1.8 | Implement active spas metric card | Frontend | 2 | 🔴 | B.1.2, B.1.4 |
| B.1.9 | Implement reorder rate metric card | Frontend | 2 | 🔴 | B.1.2, B.1.4 |
| B.1.10 | Add loading states and skeletons | Frontend | 2 | 🔴 | B.1.1 |
| B.1.11 | Write unit tests for MetricCard | QA | 2 | 🔴 | B.1.2 |
| B.1.12 | Write integration tests for dashboard | QA | 3 | 🔴 | B.1.1 |

**Sprint B.1 Subtotal**: 29 hours

---

### Sprint B.2: Dashboard Charts & Tables (Week 6)

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| B.2.1 | Install and configure chart library | Frontend | 2 | 🔴 | - |
| B.2.2 | Create `RevenueChart` component | Frontend | 4 | 🔴 | B.2.1 |
| B.2.3 | Create `OrdersChart` component | Frontend | 3 | 🔴 | B.2.1 |
| B.2.4 | Create `DateRangePicker` component | Frontend | 3 | 🔴 | - |
| B.2.5 | Integrate date range with dashboard queries | Frontend | 2 | 🔴 | B.2.4 |
| B.2.6 | Create `SpaLeaderboard` component | Frontend | 4 | 🔴 | - |
| B.2.7 | Add spa detail expandable row | Frontend | 2 | 🔴 | B.2.6 |
| B.2.8 | Create `ProductPerformanceTable` component | Frontend | 4 | 🔴 | - |
| B.2.9 | Add sortable columns to performance table | Frontend | 2 | 🔴 | B.2.8 |
| B.2.10 | Implement chart responsiveness | Frontend | 2 | 🔴 | B.2.2, B.2.3 |
| B.2.11 | Write tests for chart components | QA | 3 | 🔴 | B.2.2, B.2.3 |

**Sprint B.2 Subtotal**: 31 hours

---

### Sprint B.3: Brand Profile Editor (Week 7)

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| B.3.1 | Create `VendorProfileEditor` page | Frontend | 3 | 🔴 | A.4.5 |
| B.3.2 | Create form sections layout | Frontend | 2 | 🔴 | B.3.1 |
| B.3.3 | Install rich text editor library | Frontend | 1 | 🔴 | - |
| B.3.4 | Create `BrandStorySection` component | Frontend | 4 | 🔴 | B.3.3 |
| B.3.5 | Create `ValuesBadgePicker` component | Frontend | 4 | 🔴 | A.4.2 |
| B.3.6 | Add value icons/badges | Frontend | 2 | 🔴 | B.3.5 |
| B.3.7 | Create `CertificationUploader` component | Frontend | 4 | 🔴 | A.4.3 |
| B.3.8 | Integrate S3 upload for certifications | Backend | 3 | 🔴 | B.3.7 |
| B.3.9 | Create `GalleryManager` component | Frontend | 4 | 🔴 | - |
| B.3.10 | Integrate S3 upload for gallery images | Backend | 2 | 🔴 | B.3.9 |
| B.3.11 | Create profile update mutation resolver | Backend | 3 | 🔴 | A.4.5 |
| B.3.12 | Add form validation with Zod | Frontend | 2 | 🔴 | B.3.1 |
| B.3.13 | Write tests for profile editor | QA | 3 | 🔴 | B.3.1 |

**Sprint B.3 Subtotal**: 37 hours

---

### Sprint B.4: Order Management (Week 8)

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| B.4.1 | Create `OrderList` page component | Frontend | 4 | 🔴 | A.4.11 |
| B.4.2 | Add pagination to order list | Frontend | 2 | 🔴 | B.4.1 |
| B.4.3 | Create `OrderSearchFilter` component | Frontend | 3 | 🔴 | - |
| B.4.4 | Add filter by status, date, spa | Frontend | 2 | 🔴 | B.4.3 |
| B.4.5 | Create `OrderDetailPanel` component | Frontend | 4 | 🔴 | A.4.10 |
| B.4.6 | Create `OrderStatusBadge` component | Frontend | 2 | 🔴 | - |
| B.4.7 | Create `StatusUpdateDropdown` component | Frontend | 3 | 🔴 | A.4.12 |
| B.4.8 | Create `ShippingInfoForm` component | Frontend | 3 | 🔴 | A.4.12 |
| B.4.9 | Create order status update resolver | Backend | 3 | 🔴 | A.4.12 |
| B.4.10 | Add order status change notifications | Backend | 2 | 🔴 | B.4.9 |
| B.4.11 | Write tests for order management | QA | 3 | 🔴 | B.4.1 |

**Sprint B.4 Subtotal**: 31 hours

---

## Phase C: Communication (Weeks 9-10)

### Sprint C.1: Messaging Backend (Week 9)

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| C.1.1 | Create `Conversation` entity | Backend | 3 | 🔴 | - |
| C.1.2 | Create `Message` entity | Backend | 3 | 🔴 | C.1.1 |
| C.1.3 | Add context linking (order/product) | Backend | 2 | 🔴 | C.1.1 |
| C.1.4 | Create messaging service | Backend | 4 | 🔴 | C.1.1, C.1.2 |
| C.1.5 | Add conversation types to vendor.graphql | Backend | 2 | 🔴 | C.1.1 |
| C.1.6 | Add `vendorConversations` query | Backend | 2 | 🔴 | C.1.5 |
| C.1.7 | Add `sendMessage` mutation | Backend | 2 | 🔴 | C.1.5 |
| C.1.8 | Set up WebSocket server | Backend | 4 | 🔴 | - |
| C.1.9 | Implement real-time message push | Backend | 4 | 🔴 | C.1.8 |
| C.1.10 | Add unread count tracking | Backend | 2 | 🔴 | C.1.2 |
| C.1.11 | Create migration `AddMessaging.ts` | Backend | 2 | 🔴 | C.1.1, C.1.2 |
| C.1.12 | Write unit tests for messaging service | QA | 4 | 🔴 | C.1.4 |

**Sprint C.1 Subtotal**: 34 hours

---

### Sprint C.2: Messaging UI (Week 10)

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| C.2.1 | Create `ConversationList` component | Frontend | 4 | 🔴 | C.1.6 |
| C.2.2 | Create `UnreadBadge` component | Frontend | 1 | 🔴 | C.1.10 |
| C.2.3 | Create `ChatPanel` component | Frontend | 5 | 🔴 | C.1.2 |
| C.2.4 | Implement message bubbles | Frontend | 2 | 🔴 | C.2.3 |
| C.2.5 | Implement auto-scroll to bottom | Frontend | 1 | 🔴 | C.2.3 |
| C.2.6 | Create `MessageComposer` component | Frontend | 4 | 🔴 | C.1.7 |
| C.2.7 | Add file attachment support | Frontend | 3 | 🔴 | C.2.6 |
| C.2.8 | Integrate WebSocket for real-time | Frontend | 4 | 🔴 | C.1.9 |
| C.2.9 | Create `ConversationSearch` component | Frontend | 3 | 🔴 | - |
| C.2.10 | Create `NotificationSettings` component | Frontend | 3 | 🔴 | - |
| C.2.11 | Add email notification triggers | Backend | 2 | 🔴 | C.1.7 |
| C.2.12 | Write tests for messaging UI | QA | 3 | 🔴 | C.2.1-C.2.6 |

**Sprint C.2 Subtotal**: 35 hours

---

## Phase D: Discovery & Optimization (Weeks 11-12)

### Sprint D.1: Discovery Analytics Backend (Week 11)

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| D.1.1 | Create discovery analytics service | Backend | 4 | 🔴 | A.3.7 |
| D.1.2 | Implement impression aggregation by source | Backend | 3 | 🔴 | D.1.1 |
| D.1.3 | Implement search query tracking | Backend | 4 | 🔴 | D.1.1 |
| D.1.4 | Link queries to vendor impressions | Backend | 3 | 🔴 | D.1.3 |
| D.1.5 | Implement values performance calculation | Backend | 4 | 🔴 | D.1.1 |
| D.1.6 | Calculate vendor rank per value filter | Backend | 3 | 🔴 | D.1.5 |
| D.1.7 | Implement profile engagement tracking | Backend | 3 | 🔴 | D.1.1 |
| D.1.8 | Create recommendation engine | Backend | 6 | 🔴 | D.1.1 |
| D.1.9 | Define recommendation rules | Backend | 3 | 🔴 | D.1.8 |
| D.1.10 | Add `discoveryAnalytics` query to GraphQL | Backend | 2 | 🔴 | D.1.1 |
| D.1.11 | Write tests for discovery analytics | QA | 4 | 🔴 | D.1.1 |

**Sprint D.1 Subtotal**: 39 hours

---

### Sprint D.2: Discovery Analytics UI (Week 12)

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| D.2.1 | Create `DiscoveryDashboard` page | Frontend | 3 | 🔴 | D.1.10 |
| D.2.2 | Create `ImpressionsChart` (by source) | Frontend | 4 | 🔴 | D.1.2 |
| D.2.3 | Create `SearchQueryTable` component | Frontend | 4 | 🔴 | D.1.4 |
| D.2.4 | Add "queries you rank for" section | Frontend | 2 | 🔴 | D.2.3 |
| D.2.5 | Add "missed opportunities" section | Frontend | 2 | 🔴 | D.2.3 |
| D.2.6 | Create `ValuesPerformanceChart` | Frontend | 4 | 🔴 | D.1.6 |
| D.2.7 | Create `ProfileEngagementStats` | Frontend | 3 | 🔴 | D.1.7 |
| D.2.8 | Create `RecommendationCard` component | Frontend | 3 | 🔴 | D.1.9 |
| D.2.9 | Create `ProfileCompletenessWidget` | Frontend | 3 | 🔴 | - |
| D.2.10 | Calculate completeness score | Backend | 2 | 🔴 | A.1.1 |
| D.2.11 | Write tests for discovery UI | QA | 3 | 🔴 | D.2.1 |

**Sprint D.2 Subtotal**: 33 hours

---

## Phase E: Admin & Onboarding (Weeks 13-14)

### Sprint E.1: Application & Onboarding (Week 13)

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| E.1.1 | Create `ApplicationForm` wizard | Frontend | 6 | 🔴 | A.4.7 |
| E.1.2 | Implement step 1: Contact info | Frontend | 2 | 🔴 | E.1.1 |
| E.1.3 | Implement step 2: Company info | Frontend | 2 | 🔴 | E.1.1 |
| E.1.4 | Implement step 3: Product info | Frontend | 2 | 🔴 | E.1.1 |
| E.1.5 | Implement step 4: Values & certifications | Frontend | 2 | 🔴 | E.1.1 |
| E.1.6 | Implement step 5: Review & submit | Frontend | 2 | 🔴 | E.1.1 |
| E.1.7 | Create `ApplicationStatusTracker` | Frontend | 3 | 🔴 | A.2.5 |
| E.1.8 | Create `OnboardingChecklist` component | Frontend | 4 | 🔴 | A.2.10 |
| E.1.9 | Create `StepCompletionForm` component | Frontend | 3 | 🔴 | E.1.8 |
| E.1.10 | Create `OnboardingProgressBar` | Frontend | 2 | 🔴 | E.1.8 |
| E.1.11 | Create approval email template | Backend | 2 | 🔴 | - |
| E.1.12 | Create reminder email templates | Backend | 2 | 🔴 | - |
| E.1.13 | Write tests for application form | QA | 3 | 🔴 | E.1.1 |

**Sprint E.1 Subtotal**: 35 hours

---

### Sprint E.2: Admin Tools (Week 14)

| ID | Task | Owner | Hours | Status | Dependencies |
|----|------|-------|-------|--------|--------------|
| E.2.1 | Create `AdminApplicationQueue` page | Frontend | 4 | 🔴 | A.2.1 |
| E.2.2 | Add SLA status indicators | Frontend | 2 | 🔴 | E.2.1 |
| E.2.3 | Add assignee filtering | Frontend | 2 | 🔴 | E.2.1 |
| E.2.4 | Create `ApplicationDetailView` | Frontend | 5 | 🔴 | A.2.1 |
| E.2.5 | Display all application sections | Frontend | 2 | 🔴 | E.2.4 |
| E.2.6 | Create `ApprovalActionsPanel` | Frontend | 3 | 🔴 | A.2.6 |
| E.2.7 | Implement approve with notes | Frontend | 2 | 🔴 | E.2.6 |
| E.2.8 | Implement reject with reason | Frontend | 2 | 🔴 | E.2.6 |
| E.2.9 | Create `RiskAssessmentCard` | Frontend | 3 | 🔴 | - |
| E.2.10 | Implement automated risk scoring | Backend | 4 | 🔴 | A.2.1 |
| E.2.11 | Create SLA monitoring dashboard | Frontend | 3 | 🔴 | A.2.8 |
| E.2.12 | Write admin workflow tests | QA | 4 | 🔴 | E.2.1 |
| E.2.13 | Create admin documentation | Docs | 3 | 🔴 | - |

**Sprint E.2 Subtotal**: 39 hours

---

## Summary

| Phase | Sprints | Tasks | Hours |
|-------|---------|-------|-------|
| A: Foundation | 4 | 52 | 110 |
| B: Core Portal | 4 | 47 | 128 |
| C: Communication | 2 | 24 | 69 |
| D: Discovery | 2 | 22 | 72 |
| E: Admin | 2 | 26 | 74 |
| **Total** | **14** | **171** | **453** |

*Base estimate: 453 hours. With 25% buffer for testing, bugs, iteration: **~566 hours***

---

## Critical Path

The following tasks are on the critical path (blocking downstream work):

1. **A.1.1** VendorProfile entity → All profile features
2. **A.3.9** Materialized view → All dashboard features
3. **A.4.9** Dashboard query → B.1.* dashboard UI
4. **C.1.8** WebSocket server → All real-time messaging
5. **D.1.1** Discovery service → All discovery UI

---

## Dependencies on Feature 010

| Feature 011 Task | Requires Feature 010 Task | Notes |
|------------------|---------------------------|-------|
| D.1.3 (Search query tracking) | 1.3.2 (Interaction events) | Needs interaction table |
| D.1.5 (Values performance) | 2.3.* (Behavioral signals) | Needs CTR data |
| D.2.9 (Profile completeness) | 3.2.* (Data quality metrics) | Pattern reuse |

If Feature 010 tasks are not complete, Feature 011 can proceed with:
- Mocked analytics data for dashboard
- Simplified discovery without behavioral signals
- Manual completeness calculation

---

**Task assignments will be updated during sprint planning.**  
**Last Updated**: December 20, 2025
