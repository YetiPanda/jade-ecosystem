/**
 * AppBreadcrumb Component
 *
 * Auto-generating breadcrumbs with pillar-aware branding
 * Uses the base Breadcrumb components from shadcn/ui
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@jade/ui-components';
import { getPillarByRoute, type PillarConfig } from '../lib/pillars';

export interface AppBreadcrumbProps {
  className?: string;
  showHome?: boolean;
  pillarBranding?: boolean;
}

interface BreadcrumbSegment {
  label: string;
  href: string;
}

const LABEL_MAP: Record<string, string> = {
  app: 'Home',
  ecosystem: 'Ecosystem',
  aura: 'Aura',
  marketplace: 'Curated',
  sanctuary: 'Sanctuary',
  admin: 'Admin',
  'business-intelligence': 'Intelligence',
  'skincare-search': 'Skincare Search',
  dashboard: 'Dashboard',
  settings: 'Settings',
  products: 'Products',
  vendors: 'Vendors',
  orders: 'Orders',
  community: 'Community',
  members: 'Members',
  events: 'Events',
};

function generateBreadcrumbs(pathname: string): BreadcrumbSegment[] {
  const segments = pathname.split('/').filter(Boolean);
  const items: BreadcrumbSegment[] = [];
  let currentPath = '';

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;

    // Skip 'app' prefix
    if (segment === 'app') continue;

    // Skip 'admin' if next segment exists
    if (segment === 'admin' && segments[i + 1]) continue;

    const label = LABEL_MAP[segment] ||
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

    items.push({ label, href: currentPath });
  }

  return items;
}

export const AppBreadcrumb: React.FC<AppBreadcrumbProps> = ({
  className,
  showHome = true,
  pillarBranding = true,
}) => {
  const location = useLocation();
  const breadcrumbs = generateBreadcrumbs(location.pathname);
  const pillar = pillarBranding ? getPillarByRoute(location.pathname) : null;

  if (breadcrumbs.length === 0) return null;

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {showHome && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/app/ecosystem" className="flex items-center">
                  <Home className="h-4 w-4" />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs.length > 0 && <BreadcrumbSeparator />}
          </>
        )}

        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isPillarPage = pillar && (
            item.label.toLowerCase() === pillar.id ||
            item.label === 'Intelligence' ||
            item.label === 'Curated' ||
            item.label === 'Sanctuary' ||
            item.label === 'Aura'
          );

          return (
            <React.Fragment key={item.href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage
                    style={isPillarPage && pillar ? { color: pillar.color } : undefined}
                  >
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AppBreadcrumb;
