/**
 * Sidebar Component
 *
 * Side navigation for app pages
 * Organized to showcase the 4 Pillars Architecture
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  ShoppingCart,
  Users,
  Brain,
  Search,
  LayoutDashboard,
  Settings,
  Compass,
} from 'lucide-react';

export interface SidebarItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  sections?: SidebarSection[];
}

// 4 Pillars + Tools organized for customer demos
const defaultSections: SidebarSection[] = [
  {
    items: [
      { label: 'Ecosystem Overview', path: '/app/ecosystem', icon: <Compass className="h-4 w-4" /> },
    ],
  },
  {
    title: '4 PILLARS',
    items: [
      { label: 'Aura', path: '/app/aura', icon: <Home className="h-4 w-4" /> },
      { label: 'Curated', path: '/app/marketplace', icon: <ShoppingCart className="h-4 w-4" /> },
      { label: 'Sanctuary', path: '/app/sanctuary', icon: <Users className="h-4 w-4" /> },
      { label: 'Intelligence', path: '/app/admin/business-intelligence', icon: <Brain className="h-4 w-4" /> },
    ],
  },
  {
    title: 'TOOLS',
    items: [
      { label: 'Skincare Search', path: '/app/skincare-search', icon: <Search className="h-4 w-4" /> },
      { label: 'Vendor Dashboard', path: '/app/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
      { label: 'Settings', path: '/app/settings', icon: <Settings className="h-4 w-4" /> },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ sections = defaultSections }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <aside className="w-56 border-r border-border bg-background">
      <nav className="flex flex-col gap-1 p-3">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className={sectionIndex > 0 ? 'mt-4' : ''}>
            {section.title && (
              <div className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground tracking-wider uppercase">
                {section.title}
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${
                      isActive(item.path)
                        ? 'bg-primary text-white'
                        : 'text-foreground hover:bg-muted'
                    }
                  `}
                >
                  {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
