import { OrderStatus, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../types/orders';
import './OrderStatusBadge.css';

export interface OrderStatusBadgeProps {
  status: OrderStatus;
  showIcon?: boolean;
}

const STATUS_ICONS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: '⏳',
  [OrderStatus.CONFIRMED]: '✓',
  [OrderStatus.PROCESSING]: '⚙️',
  [OrderStatus.PACKED]: '📦',
  [OrderStatus.SHIPPED]: '🚚',
  [OrderStatus.DELIVERED]: '✅',
  [OrderStatus.CANCELLED]: '❌',
  [OrderStatus.REFUNDED]: '💰',
};

export function OrderStatusBadge({ status, showIcon = true }: OrderStatusBadgeProps) {
  const color = ORDER_STATUS_COLORS[status];
  const label = ORDER_STATUS_LABELS[status];
  const icon = STATUS_ICONS[status];

  return (
    <span
      className="order-status-badge"
      style={{
        backgroundColor: `${color}20`,
        borderColor: color,
        color: color,
      }}
    >
      {showIcon && <span className="order-status-icon">{icon}</span>}
      <span className="order-status-label">{label}</span>
    </span>
  );
}
