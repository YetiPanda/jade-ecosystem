/**
 * Vendor Navigation Component
 * Shared navigation across all vendor portal pages
 *
 * Fixed: Removed duplicate paths, added Submit Product button
 */

import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', path: '/app/vendor/dashboard' },
  { id: 'orders', label: 'Orders', path: '/app/vendor/orders' },
  { id: 'training', label: 'Training', path: '/app/vendor/training' },
  { id: 'analytics', label: 'Analytics', path: '/app/vendor/analytics' },
];

export function VendorNavigation() {
  const location = useLocation();

  return (
    <div className="flex items-center gap-2 overflow-x-auto">
      {/* Navigation Pills */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0',
                isActive
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Submit Product Button */}
      <Link to="/app/vendor/submit-product">
        <Button size="sm" className="whitespace-nowrap">
          + Submit Product
        </Button>
      </Link>
    </div>
  );
}
