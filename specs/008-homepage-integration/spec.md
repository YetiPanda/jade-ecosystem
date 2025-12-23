# Specification: Homepage Integration

**Feature ID**: 008
**Feature Name**: Homepage Integration - Progressive Enhancement Migration
**Version**: 1.0.0
**Status**: APPROVED
**Created**: October 20, 2025
**Approach**: Option A - Progressive Enhancement

---

## Overview

Integrate the faire-starter landing page design patterns into the JADE Spa Marketplace as the primary homepage, adapted to work within JADE's Vite + React SPA architecture while maintaining constitutional compliance and zero disruption to existing features.

---

## Objectives

### Primary Goals

1. Create a visually compelling homepage that showcases spa products
2. Maintain JADE's existing architecture and patterns
3. Ensure zero breaking changes to existing functionality
4. Implement constitutional UI stability protections
5. Achieve optimal performance metrics (< 3s TTI)

### Success Metrics

- Homepage Time to Interactive (TTI) < 3 seconds
- GraphQL query response times < 200ms
- 80% test coverage for new components
- 100% mobile responsive across all breakpoints
- WCAG AA accessibility compliance
- Zero regression in existing features

---

## Technical Specification

### Architecture

#### Framework Compatibility

```typescript
// Source: faire-starter (Next.js 14)
- Server-side rendering
- App Router with async server components
- Next/Image optimization
- File-based routing

// Target: JADE Marketplace (Vite + React SPA)
- Client-side rendering
- React Router v6
- Standard img with lazy loading
- Programmatic routing
```

#### Component Architecture

All components will follow JADE's existing patterns:

1. **Pure presentational components** in `/components/home/`
2. **Container components** in `/pages/`
3. **GraphQL queries** in `/graphql/queries/`
4. **Type definitions** in component files or shared types
5. **Styling** using Tailwind CSS (existing setup)

### Data Layer

#### GraphQL Schema Requirements

The following queries must be supported by the backend:

**Featured Brands Query**
```graphql
query GetFeaturedBrands {
  collections(options: {
    filter: { slug: { eq: "featured-brands" } }
  }) {
    items {
      id
      name
      featuredAsset {
        source
        preview
      }
    }
  }
}
```

**Bestsellers Query**
```graphql
query GetBestsellers {
  products(options: {
    filter: { facetValueIds: { contains: "bestseller" } }
    take: 4
    sort: { createdAt: DESC }
  }) {
    items {
      id
      name
      slug
      description
      featuredAsset {
        source
        preview
      }
      variants {
        id
        price
        currencyCode
      }
    }
  }
}
```

**New Arrivals Query**
```graphql
query GetNewArrivals {
  products(options: {
    take: 4
    sort: { createdAt: DESC }
  }) {
    items {
      id
      name
      slug
      description
      featuredAsset {
        source
        preview
      }
      variants {
        id
        price
        currencyCode
      }
    }
  }
}
```

#### Data Contract Interfaces

```typescript
interface Brand {
  id: string;
  name: string;
  logo: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  price: number;
  currencyCode: string;
}

interface HomepageData {
  featuredBrands: Brand[];
  bestsellers: Product[];
  newArrivals: Product[];
}
```

### Component Specifications

#### 1. HeroSection Component

**Location**: `/apps/marketplace-frontend/src/components/home/HeroSection.tsx`

**Responsibilities**:
- Display hero image with overlay
- Show headline and subheadline
- Render primary CTA button
- Handle responsive layouts

**Props**: None (static content)

**Styling Requirements**:
- Height: 52vh on desktop, adaptive on mobile
- Rounded corners: 3xl (24px)
- Overlay: black at 25% opacity
- Text: white with proper contrast ratios

#### 2. BrandStrip Component

**Location**: `/apps/marketplace-frontend/src/components/home/BrandStrip.tsx`

**Responsibilities**:
- Display horizontal scrollable brand logos
- Provide navigation controls (prev/next)
- Handle hover states (grayscale to color)
- Implement smooth scrolling

**Props**:
```typescript
interface BrandStripProps {
  brands: Brand[];
  title?: string;
}
```

**Interaction**:
- Scroll amount: 200px per click
- Smooth scroll behavior
- Arrow key navigation support

#### 3. ProductGrid Component

**Location**: Reuse existing `/apps/marketplace-frontend/src/components/marketplace/ProductGrid.tsx` or create enhanced version

**Responsibilities**:
- Display products in responsive grid
- Show product images, names, and prices
- Handle click navigation to product detail
- Support loading and error states

**Props**:
```typescript
interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  loading?: boolean;
  error?: Error | null;
}
```

#### 4. EditorialBlock Component

**Location**: `/apps/marketplace-frontend/src/components/home/EditorialBlock.tsx`

**Responsibilities**:
- Display promotional content block
- Support image and text content
- Provide CTA button
- Maintain responsive layout

**Props**:
```typescript
interface EditorialBlockProps {
  title: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}
```

#### 5. HomePage Container

**Location**: `/apps/marketplace-frontend/src/pages/Home.tsx`

**Responsibilities**:
- Orchestrate all homepage sections
- Manage GraphQL data fetching
- Handle loading and error states
- Coordinate section spacing and layout

**State Management**:
- Use Apollo Client's `useQuery` hooks
- Implement proper loading states
- Handle errors gracefully with fallback UI
- Cache responses appropriately

### Routing Integration

Update React Router configuration:

```typescript
// /apps/marketplace-frontend/src/App.tsx
<Routes>
  <Route path="/" element={<HomePage />} />
  {/* Existing routes remain unchanged */}
</Routes>
```

### Performance Specifications

#### Image Optimization

- All images must use `loading="lazy"` attribute
- Implement proper alt text for accessibility
- Consider implementing blur-up placeholders
- Use appropriate image formats (WebP with fallback)

#### Query Optimization

- Implement query result caching (5 minutes TTL)
- Use Apollo Client's cache policies
- Consider prefetching on route navigation
- Implement pagination for large datasets

#### Bundle Optimization

- Ensure no new large dependencies
- Code-split homepage components if needed
- Tree-shake unused code
- Monitor bundle size impact

---

## UI/UX Requirements

### Visual Design

**Color Scheme**:
- Follow existing JADE design tokens
- Maintain brand consistency
- Ensure proper contrast ratios (WCAG AA)

**Typography**:
- Heading: text-4xl (36px) font-semibold
- Subheading: text-xl (20px) font-semibold
- Body: text-base (16px) regular
- Labels: text-sm (14px)

**Spacing**:
- Section gaps: 4rem (64px)
- Component gaps: 1.5rem (24px)
- Element gaps: 0.5rem (8px)

### Responsive Breakpoints

```css
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (md-lg)
- Desktop: > 1024px (xl)
```

**Mobile Adaptations**:
- Hero: Full width, reduced height
- Brand strip: Touch-scroll enabled
- Product grid: 2 columns
- Reduced padding and margins

**Tablet Adaptations**:
- Hero: Maintain aspect ratio
- Product grid: 3 columns
- Balanced spacing

**Desktop**:
- Full design implementation
- Product grid: 4 columns
- Optimal spacing

### Accessibility Requirements

1. **Semantic HTML**: Proper heading hierarchy (h1 → h2 → h3)
2. **ARIA Labels**: All interactive elements labeled
3. **Keyboard Navigation**: Full keyboard support
4. **Focus Management**: Visible focus indicators
5. **Screen Reader**: Proper announcements
6. **Color Contrast**: WCAG AA minimum (4.5:1)

---

## Integration Requirements

### Existing System Integration

**Must Not Break**:
- Navigation header
- Footer
- Authentication flows
- Shopping cart functionality
- Product detail pages
- Checkout process

**Must Integrate With**:
- Existing Apollo Client setup
- Current routing structure
- Shared component library
- Design system tokens
- Analytics tracking

### Backward Compatibility

- All existing routes remain functional
- No changes to prop interfaces of existing components
- GraphQL schema additions only (no removals)
- CSS classes remain scoped (no global conflicts)

---

## Constitutional Compliance

### UI Stability Protection (Amendment 001)

This feature implements the proposed Amendment 001: UI Stability Protection Protocol.

**Component Contracts**:
All new components must define explicit TypeScript interfaces for props, ensuring:
- Type safety
- Clear API contracts
- Deprecation support
- Version tracking

**Change Request Process**:
Any future changes to homepage components must follow:
1. Written specification with impact assessment
2. A/B testing plan
3. Rollback strategy
4. Team approval (2/3 consensus)

**Protected Elements**:
- Navigation structure: No changes
- Route definitions: Additive only
- Component prop interfaces: Backward compatible
- Design system tokens: Consistent usage

---

## Testing Requirements

### Unit Tests

**Component Testing**:
```typescript
// HeroSection.test.tsx
- Renders correctly
- Displays proper content
- CTA button navigates correctly
- Responsive behavior works

// BrandStrip.test.tsx
- Renders brand list
- Scroll controls work
- Hover states function
- Handles empty state

// ProductGrid.test.tsx
- Displays products correctly
- Handles loading state
- Handles error state
- Product click navigation works
```

### Integration Tests

```typescript
// Home.test.tsx
- All sections render
- GraphQL queries execute
- Loading states display
- Error states display
- Navigation works end-to-end
```

### E2E Tests

```typescript
// homepage.e2e.test.ts
- Homepage loads successfully
- Hero CTA navigates to products
- Brand logos display
- Products load and display
- Product click navigates to detail
- Mobile responsive behavior
```

### Performance Tests

- Lighthouse CI integration
- TTI < 3 seconds
- First Contentful Paint < 1.5 seconds
- Cumulative Layout Shift < 0.1
- Query response times < 200ms

### Accessibility Tests

- Axe-core automated testing
- Keyboard navigation testing
- Screen reader testing (NVDA/JAWS)
- Color contrast validation

---

## Security Considerations

### Data Handling

- Sanitize all user-generated content
- Validate GraphQL responses
- Handle errors without exposing internals
- Rate limit API requests

### Image Security

- Validate image URLs
- Implement CSP headers
- Use secure protocols (HTTPS)
- Sanitize alt text

---

## Documentation Requirements

### Developer Documentation

1. Component API documentation (JSDoc comments)
2. GraphQL query documentation
3. Integration guide for new sections
4. Troubleshooting guide

### User Documentation

1. Homepage features overview
2. Product browsing guide
3. Brand discovery guide

---

## Rollout Strategy

### Phase 1: Development (Week 1)
- Build components in isolation
- Implement GraphQL queries
- Unit test coverage

### Phase 2: Integration (Week 2)
- Connect to Apollo Client
- Integrate with routing
- Integration testing

### Phase 3: Validation (Week 3)
- E2E testing
- Performance validation
- Accessibility audit
- Staging deployment

### Phase 4: Release
- Feature flag controlled rollout
- Monitor metrics
- Gather feedback
- Production deployment

---

## Risk Mitigation

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| GraphQL schema changes needed | Medium | Medium | Early backend coordination |
| Performance degradation | Low | High | Performance budget monitoring |
| Mobile layout issues | Low | Medium | Mobile-first development |
| Accessibility gaps | Low | High | Automated testing + manual audit |

### Process Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Timeline slippage | Medium | Low | Buffer in schedule |
| Scope creep | Medium | Medium | Strict spec adherence |
| Integration conflicts | Low | Medium | Continuous integration |

---

## Dependencies

### Frontend Dependencies

- React 18+
- React Router v6+
- Apollo Client v3+
- Tailwind CSS
- Lucide React (icons)

### Backend Dependencies

- GraphQL schema updates
- Featured brands collection
- Bestseller facet values
- Product sorting support

### External Dependencies

- Image assets (hero, brands)
- Content for editorial blocks
- Product data seeded

---

## Acceptance Criteria

### Functional Requirements

- [ ] Homepage loads and displays all sections
- [ ] Hero section renders with correct styling
- [ ] Brand strip displays and scrolls
- [ ] Bestsellers grid shows 4 products
- [ ] New arrivals grid shows 4 products
- [ ] All CTAs navigate correctly
- [ ] Loading states display appropriately
- [ ] Error states handle gracefully

### Non-Functional Requirements

- [ ] TTI < 3 seconds on 3G connection
- [ ] GraphQL queries < 200ms response time
- [ ] 80% test coverage minimum
- [ ] WCAG AA compliance verified
- [ ] Mobile responsive on all devices
- [ ] Zero console errors/warnings
- [ ] Bundle size impact < 50KB

### Quality Requirements

- [ ] Code review approved
- [ ] TypeScript strict mode compliant
- [ ] ESLint passes with no warnings
- [ ] Prettier formatting applied
- [ ] Documentation complete
- [ ] All tests passing

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-10-20 | AI Assistant | Initial specification for Option A |

---

## Approval

**Prepared by**: AI Development Assistant
**Approved by**: Jesse Garza
**Date**: October 20, 2025
**Status**: APPROVED - Ready for Implementation
