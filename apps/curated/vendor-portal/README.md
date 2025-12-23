# JADE Vendor Portal

**Feature 011: Vendor Portal MVP**

Vendor-facing application for managing brand profiles, orders, analytics, and communication with spa customers.

## Overview

The Vendor Portal provides vendors with a comprehensive self-service interface to:
- Manage brand identity and values
- Track orders and fulfillment
- View analytics and discovery insights
- Communicate with spa customers
- Monitor product performance

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Routing**: React Router DOM v6
- **GraphQL Client**: Apollo Client
- **UI Components**: @jade/ui (shared design system)
- **Feature Flags**: @jade/feature-flags

## Development

### Prerequisites

- Node.js 20+
- pnpm 8.15+

### Installation

```bash
# From repository root
pnpm install

# From this directory
cd apps/curated/vendor-portal
pnpm install
```

### Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure the following variables:

- `VITE_GRAPHQL_URL` - GraphQL API endpoint (default: http://localhost:3000/graphql)

### Running Locally

```bash
# Start development server
pnpm dev

# Server will start at http://localhost:5174
```

### Building

```bash
# Type check
pnpm typecheck

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```
src/
├── components/          # Reusable components
│   └── ProtectedRoute.tsx
├── contexts/            # React contexts
│   └── AuthContext.tsx
├── layouts/             # Layout components
│   └── DashboardLayout.tsx
├── lib/                 # Utilities and configurations
│   └── apollo-client.ts
├── pages/               # Page components
│   ├── DashboardPage.tsx
│   ├── ProfilePage.tsx
│   ├── OrdersPage.tsx
│   ├── ProductsPage.tsx
│   ├── AnalyticsPage.tsx
│   ├── MessagesPage.tsx
│   ├── SettingsPage.tsx
│   ├── LoginPage.tsx
│   └── NotFoundPage.tsx
├── App.tsx              # Main app component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## Features by Sprint

### ✅ Sprint 0: Application Scaffold (COMPLETE)
- Vite + React + TypeScript setup
- Routing with React Router
- Apollo Client configuration
- Authentication context
- Protected routes
- Dashboard layout with navigation
- Placeholder pages

### 🔜 Sprint B.1: Dashboard Metrics (Week 5)
- MetricCard component
- useDashboardMetrics hook
- Revenue, orders, active spas, reorder rate metrics
- Loading states and skeletons

### 🔜 Sprint B.2: Dashboard Charts & Tables (Week 6)
- Chart library integration (Recharts)
- RevenueChart and OrdersChart components
- DateRangePicker component
- SpaLeaderboard table
- ProductPerformanceTable

### 🔜 Sprint B.3: Profile Management (Week 7)
- Profile form components
- Brand identity editor
- Values selector
- Certification upload and verification
- Image upload handling

### 🔜 Sprint B.4: Order Management (Week 8)
- Order list with filtering
- Order detail view
- Status update actions
- Fulfillment workflow

### 🔜 Sprint C.1-C.2: Messaging (Weeks 9-10)
- Conversation list
- Message thread view
- Real-time updates via GraphQL subscriptions
- Message composition

### 🔜 Sprint D.1-D.3: Discovery Analytics (Weeks 11-12)
- Discovery sources visualization
- Search queries table
- Values performance metrics
- Visibility score dashboard

## Authentication

Currently uses mock authentication for development. In production, this will integrate with:
- Vendure authentication
- JWT token management
- Role-based access control

**Mock Credentials (Development)**:
- Email: any valid email
- Password: any non-empty password

## GraphQL Schema

The vendor portal uses the following GraphQL operations:

**Queries**:
- `vendorProfile` - Get current vendor's profile
- `vendorDashboard(dateRange)` - Get dashboard metrics
- `vendorOrders(filter, sort, pagination)` - Get orders
- `discoveryAnalytics(dateRange)` - Get discovery insights
- `productPerformance(dateRange, productIds)` - Get product metrics
- `vendorConversations(filter)` - Get message conversations

**Mutations**:
- `updateVendorProfile(input)` - Update brand profile
- `updateOrderStatus(orderId, status)` - Update order status
- `sendMessage(conversationId, content)` - Send message

See `apps/curated/vendure-backend/src/schema/vendor-portal.graphql` for full schema.

## Contributing

This application follows the JADE Ecosystem contribution guidelines:

1. Work on feature branches
2. Write tests for new components (80% coverage minimum)
3. Follow TypeScript strict mode
4. Use shared components from @jade/ui when available
5. Follow the Constitutional constraints (UI Stability Protection)

See [CONTRIBUTING.md](../../../CONTRIBUTING.md) for full guidelines.

## Related Specifications

- Feature 011 Spec: `specs/011-vendor-portal/spec.md`
- Tasks: `specs/011-vendor-portal/tasks.md`
- GraphQL Contracts: `specs/011-vendor-portal/contracts/vendor.graphql`

## Status

**Current**: Application scaffold complete
**Next**: Sprint B.1 - Dashboard Metrics implementation
**Progress**: Foundation phase (Sprint A.1-A.4) complete on backend
