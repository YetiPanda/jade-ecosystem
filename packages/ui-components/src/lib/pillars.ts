/**
 * 4 Pillars Configuration
 *
 * Centralized configuration for JADE's 4 Pillars Architecture
 * Used for consistent branding across the application
 */

import { Home, ShoppingCart, Users, Brain, type LucideIcon } from 'lucide-react';

export type PillarId = 'aura' | 'curated' | 'sanctuary' | 'intelligence';

export interface PillarConfig {
  id: PillarId;
  name: string;
  subtitle: string;
  description: string;
  color: string;
  colorLight: string;
  colorDark: string;
  icon: LucideIcon;
  route: string;
}

export const PILLARS: Record<PillarId, PillarConfig> = {
  aura: {
    id: 'aura',
    name: 'Aura by Jade',
    subtitle: 'Operational Heart',
    description: 'All-in-one software solution for scheduling, client management, and point-of-sale.',
    color: '#2E8B57',      // Sea Green
    colorLight: '#E8F5EE', // Light green bg
    colorDark: '#1F5C3B',  // Dark green
    icon: Home,
    route: '/app/aura',
  },
  curated: {
    id: 'curated',
    name: 'Curated by Jade',
    subtitle: 'Vetted Marketplace',
    description: 'Curated marketplace for skincare vendors to sell directly to professionals.',
    color: '#6F4E37',      // Coffee Brown
    colorLight: '#F5F0EB', // Light brown bg
    colorDark: '#4A3525',  // Dark brown
    icon: ShoppingCart,
    route: '/app/marketplace',
  },
  sanctuary: {
    id: 'sanctuary',
    name: 'Spa-ce Sanctuary',
    subtitle: 'Professional Community',
    description: 'Virtual community for continuous learning, networking, and support.',
    color: '#8B9A6B',      // Sage Green
    colorLight: '#F2F4ED', // Light sage bg
    colorDark: '#5E6948',  // Dark sage
    icon: Users,
    route: '/app/sanctuary',
  },
  intelligence: {
    id: 'intelligence',
    name: 'Intelligence',
    subtitle: 'Business Analytics & AI',
    description: 'AI-powered analytics, causal chain insights, and evidence-based recommendations.',
    color: '#7C3AED',      // Violet/Purple
    colorLight: '#F3E8FF', // Light purple bg
    colorDark: '#5B21B6',  // Dark purple
    icon: Brain,
    route: '/app/admin/business-intelligence',
  },
};

export const PILLAR_LIST = Object.values(PILLARS);

/**
 * Get pillar config by route path
 */
export function getPillarByRoute(pathname: string): PillarConfig | null {
  return PILLAR_LIST.find(p => pathname.startsWith(p.route)) || null;
}

/**
 * Get pillar config by ID
 */
export function getPillar(id: PillarId): PillarConfig {
  return PILLARS[id];
}
