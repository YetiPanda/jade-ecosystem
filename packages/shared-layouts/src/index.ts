/**
 * @jade/shared-layouts
 *
 * Shared layout components with unified 4-pillar navigation
 *
 * This package provides the core layout infrastructure for all JADE apps,
 * ensuring a consistent navigation experience across the ecosystem.
 *
 * Components:
 * - Header (with 4-pillar navigation: Aura, Curated, Sanctuary, Vendor)
 * - Footer
 * - Sidebar
 * - UserMenu
 * - MainLayout
 * - AuthLayout
 * - AppBreadcrumb
 */

// Layout Components
export * from './components/Header';
export * from './components/Footer';
export * from './components/Sidebar';
export * from './components/UserMenu';
export * from './components/MainLayout';
export * from './components/AuthLayout';
export * from './components/AppBreadcrumb';

// Context Providers
export { AuthProvider, useAuth } from './contexts/AuthContext';
export type { User } from './contexts/AuthContext';
