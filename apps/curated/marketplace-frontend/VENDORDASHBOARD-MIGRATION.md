# VendorDashboard Migration Guide

**Date**: December 22, 2025
**Status**: Migration Required
**Impact**: Medium - Affects vendor dashboard routes

## Overview

The old `VendorDashboard` component and its associated GraphQL query have been deprecated in favor of Feature 011's new implementation. This document tracks the migration status and provides guidance.

---

## Component Inventory

### ✅ Already Using New Implementation (Feature 011)

| File | Component | GraphQL Query | Status |
|------|-----------|---------------|--------|
| `pages/Dashboard.tsx` | `VendorDashboard` from `components/dashboard/vendor` | DashboardContext (no deprecated query) | ✅ OK |
| `pages/vendor/VendorPortalDashboard.tsx` | `VendorPortalDashboard` | `useVendorPortalDashboard()` with dateRange | ✅ OK |
| Route: `/app/vendor/portal` | `VendorPortalDashboard` | Feature 011 implementation | ✅ OK |

### ❌ Using Deprecated Implementation

| File | Component | Issue | Migration Required |
|------|-----------|-------|-------------------|
| `components/vendor/VendorDashboard.tsx` | OLD VendorDashboard | Uses deprecated `useVendorDashboard()` hook | ❌ DEPRECATED |
| `pages/vendor/VendorDashboardPage.tsx` | Wrapper for OLD VendorDashboard | Imports deprecated component | ❌ NEEDS MIGRATION |
| Route: `/app/vendor/dashboard` | `VendorDashboardPage` | Uses deprecated component | ❌ NEEDS UPDATE |

### 🔍 Neutral/Supporting Files

| File | Purpose | Action |
|------|---------|--------|
| `hooks/useVendor.ts` | Hook definitions | ✅ Already deprecated `useVendorDashboard()` |
| `graphql/vendor.queries.ts` | Query definitions | ✅ Already commented out `GET_VENDOR_DASHBOARD` |
| `graphql/generated.ts` | Auto-generated types | ℹ️ No action needed |
| `components/dashboard/vendor/index.ts` | Barrel export | ℹ️ Check exports |

---

## Migration Strategy

### Phase 1: Route Migration ✅ RECOMMENDED

**Goal**: Update `/app/vendor/dashboard` to use the new Feature 011 implementation

**Changes**:
1. Update `router/index.tsx`:
   ```tsx
   // OLD
   {
     path: 'dashboard',
     element: <VendorDashboardPage />,
   }

   // NEW
   {
     path: 'dashboard',
     element: <VendorPortalDashboard />,
   }
   ```

2. Remove import of `VendorDashboardPage`
3. Keep `VendorPortalDashboard` import (already exists)

**Benefits**:
- ✅ Minimal code changes
- ✅ Users get Feature 011 improvements immediately
- ✅ No component rewrites needed

**Risks**:
- ⚠️ If `/app/vendor/dashboard` and `/app/vendor/portal` need to be different, this won't work

---

### Phase 2: Component Cleanup

**Goal**: Remove deprecated files after route migration

**Files to Remove**:
1. `pages/vendor/VendorDashboardPage.tsx` (if not used elsewhere)
2. `components/vendor/VendorDashboard.tsx` (deprecated component)

**Files to Keep**:
- ✅ `components/dashboard/vendor/VendorDashboard.tsx` (different implementation, still used)
- ✅ `pages/vendor/VendorPortalDashboard.tsx` (Feature 011)
- ✅ `hooks/useVendorPortalDashboard.ts` (Feature 011)

---

## Alternative: Hybrid Approach

If `/app/vendor/dashboard` and `/app/vendor/portal` need to serve different purposes:

### Option A: Rewrite VendorDashboard Component
- Update `components/vendor/VendorDashboard.tsx` to use `useVendorPortalDashboard()`
- Keep both routes pointing to different components
- **Effort**: Medium (component rewrite)

### Option B: Deprecate /dashboard Route
- Add redirect from `/app/vendor/dashboard` to `/app/vendor/portal`
- Remove old route entirely
- **Effort**: Low (route change only)

---

## Schema Differences

### Old Schema (REMOVED)
```graphql
query GetVendorDashboard {
  vendorDashboard {
    profile { ... }
    statistics { ... }
    recentSubmissions { ... }
    trainingProgress { ... }
    qualityScore
    pendingActions { ... }  # ❌ Field removed
  }
}
```

### New Schema (Feature 011)
```graphql
query GetVendorDashboard($dateRange: DateRangeInput!) {
  vendorDashboard(dateRange: $dateRange) {
    dateRange { startDate, endDate }
    revenue { ... }
    orders { ... }
    spas { ... }
    impressions { ... }
    topProducts { ... }
    topCustomers { ... }
    revenueTimeSeries { ... }
    ordersTimeSeries { ... }
  }
}
```

**Key Changes**:
- ✅ Requires `dateRange` parameter
- ✅ Returns `VendorDashboardMetrics` (different structure)
- ❌ No longer includes: `profile`, `statistics`, `pendingActions`
- ✅ New fields: `revenue`, `spas`, `impressions`, time series data

---

## Migration Checklist

- [x] Deprecate old `GET_VENDOR_DASHBOARD` query
- [x] Deprecate `useVendorDashboard()` hook
- [x] Add deprecation notice to old `VendorDashboard` component
- [ ] Update `/app/vendor/dashboard` route
- [ ] Test dashboard functionality with new implementation
- [ ] Remove `VendorDashboardPage.tsx`
- [ ] Remove `components/vendor/VendorDashboard.tsx`
- [ ] Update any documentation referencing old routes

---

## Testing Plan

After migration:

1. **Route Test**: Navigate to `/app/vendor/dashboard`
   - Should display Feature 011 dashboard
   - Should have date range picker
   - Should show revenue, orders, spa metrics

2. **Functionality Test**:
   - Date range selection works
   - Metrics update correctly
   - Charts render properly
   - No GraphQL errors in console

3. **Regression Test**:
   - Check `/app/vendor/portal` still works
   - Check `pages/Dashboard.tsx` still works (uses different component)

---

## Recommended Next Steps

1. **Immediate**: Update route in `router/index.tsx` (Phase 1)
2. **Test**: Verify `/app/vendor/dashboard` works with new component
3. **Cleanup**: Remove deprecated files (Phase 2)
4. **Document**: Update any user-facing documentation

---

## Questions to Resolve

1. ❓ Should `/app/vendor/dashboard` and `/app/vendor/portal` be the same page?
2. ❓ Are there any external links pointing to `/app/vendor/dashboard`?
3. ❓ Is the old component used in any tests that need updating?

---

## References

- New Implementation: `apps/marketplace-frontend/src/pages/vendor/VendorPortalDashboard.tsx`
- New Hook: `apps/marketplace-frontend/src/hooks/useVendorPortalDashboard.ts`
- New Query: `apps/marketplace-frontend/src/graphql/queries/vendor-dashboard.graphql`
- Feature Spec: `specs/011-vendor-portal/spec.md`
