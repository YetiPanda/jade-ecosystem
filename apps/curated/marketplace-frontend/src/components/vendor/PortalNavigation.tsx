/**
 * Portal Navigation Component
 * Feature 011: Vendor Portal MVP
 * Phase 1: Unified Navigation
 *
 * Tabbed navigation bar matching Figma design
 */

import React from 'react';
import { cn } from '../../lib/utils';
import { useVendorPortal, VendorPortalTab } from '../../contexts/VendorPortalContext';

interface TabConfig {
  id: VendorPortalTab;
  label: string;
  enabled: boolean;
  badge?: string | number;
}

const TABS: TabConfig[] = [
  { id: 'overview', label: 'Overview', enabled: true },
  { id: 'products', label: 'Products', enabled: true },
  { id: 'inventory', label: 'Inventory', enabled: true },
  { id: 'orders', label: 'Orders', enabled: true },
  { id: 'events', label: 'Events', enabled: true },
  { id: 'analytics', label: 'Analytics', enabled: true },
];

export function PortalNavigation() {
  const { activeTab, navigateToTab } = useVendorPortal();

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex space-x-8">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => navigateToTab(tab.id)}
                disabled={!tab.enabled}
                className={cn(
                  'relative py-4 px-1 text-sm font-medium transition-colors',
                  'border-b-2 -mb-px',
                  isActive
                    ? 'border-[#2E8B57] text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300',
                  !tab.enabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {tab.label}

                {tab.badge && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#2E8B57] text-white">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
