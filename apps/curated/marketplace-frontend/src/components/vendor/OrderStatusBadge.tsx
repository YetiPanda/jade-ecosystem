/**
 * Order Status Badge Component
 * Sprint B.4: Order Management
 *
 * Reusable badge component for displaying order status with consistent styling
 */

import { Badge } from '../ui/badge';
import { OrderStatus } from '../../graphql/generated';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

/**
 * Get the appropriate Tailwind color classes for each order status
 */
function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.Pending:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case OrderStatus.Confirmed:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case OrderStatus.Processing:
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case OrderStatus.Shipped:
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case OrderStatus.Delivered:
      return 'bg-green-100 text-green-800 border-green-200';
    case OrderStatus.Cancelled:
      return 'bg-red-100 text-red-800 border-red-200';
    case OrderStatus.Returned:
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case OrderStatus.Disputed:
      return 'bg-rose-100 text-rose-800 border-rose-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function OrderStatusBadge({ status, className = '' }: OrderStatusBadgeProps) {
  const colorClasses = getStatusColor(status);

  return (
    <Badge className={`${colorClasses} ${className}`}>
      {status}
    </Badge>
  );
}

export default OrderStatusBadge;
