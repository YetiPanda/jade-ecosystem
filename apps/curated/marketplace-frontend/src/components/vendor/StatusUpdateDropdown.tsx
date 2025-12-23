/**
 * Status Update Dropdown Component
 * Sprint B.4: Order Management
 *
 * Allows vendors to update order status with optional notes.
 * Displays only valid status transitions based on current status.
 */

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import { OrderStatus } from '../../graphql/generated';
import { OrderStatusBadge } from './OrderStatusBadge';
import { CheckCircle, XCircle } from 'lucide-react';

interface StatusUpdateDropdownProps {
  orderId: string;
  currentStatus: OrderStatus;
  onStatusUpdate: (orderId: string, status: OrderStatus, note?: string) => void;
  disabled?: boolean;
}

/**
 * Define valid status transitions based on order lifecycle
 */
const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.Pending]: [OrderStatus.Confirmed, OrderStatus.Cancelled],
  [OrderStatus.Confirmed]: [OrderStatus.Processing, OrderStatus.Cancelled],
  [OrderStatus.Processing]: [OrderStatus.Shipped, OrderStatus.Cancelled],
  [OrderStatus.Shipped]: [OrderStatus.Delivered, OrderStatus.Returned],
  [OrderStatus.Delivered]: [OrderStatus.Returned, OrderStatus.Disputed],
  [OrderStatus.Cancelled]: [], // Terminal state
  [OrderStatus.Returned]: [OrderStatus.Disputed],
  [OrderStatus.Disputed]: [], // Terminal state
};

/**
 * Get human-readable labels for status values
 */
function getStatusLabel(status: OrderStatus): string {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function StatusUpdateDropdown({
  orderId,
  currentStatus,
  onStatusUpdate,
  disabled = false,
}: StatusUpdateDropdownProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');
  const [note, setNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const availableTransitions = STATUS_TRANSITIONS[currentStatus] || [];
  const hasAvailableTransitions = availableTransitions.length > 0;

  const handleSubmit = async () => {
    if (!selectedStatus || selectedStatus === currentStatus) return;

    setIsUpdating(true);
    try {
      await onStatusUpdate(orderId, selectedStatus, note.trim() || undefined);
      // Reset form after successful update
      setSelectedStatus('');
      setNote('');
    } catch (error) {
      // Error handling is done by parent component
      console.error('Status update failed:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setSelectedStatus('');
    setNote('');
  };

  if (!hasAvailableTransitions) {
    return (
      <Card className="p-4 border-subtle bg-muted/30">
        <div className="flex items-center text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4 mr-2" />
          <span>
            No status updates available. Order is in {getStatusLabel(currentStatus)} state.
          </span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 border-subtle space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Update Status</label>
        <Select
          value={selectedStatus}
          onValueChange={(value) => setSelectedStatus(value as OrderStatus)}
          disabled={disabled || isUpdating}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select new status..." />
          </SelectTrigger>
          <SelectContent>
            {availableTransitions.map((status) => (
              <SelectItem key={status} value={status}>
                <div className="flex items-center gap-2">
                  <OrderStatusBadge status={status} className="text-xs" />
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedStatus && (
        <>
          <div>
            <label htmlFor="status-note" className="text-sm font-medium mb-2 block">
              Note (Optional)
            </label>
            <Textarea
              id="status-note"
              placeholder="Add a note about this status change..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={disabled || isUpdating}
              className="min-h-[80px] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {note.length}/500 characters
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleSubmit}
              disabled={disabled || isUpdating || !selectedStatus}
              className="flex-1"
              size="sm"
            >
              {isUpdating ? (
                <>
                  <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Update Status
                </>
              )}
            </Button>
            <Button
              onClick={handleCancel}
              disabled={disabled || isUpdating}
              variant="outline"
              size="sm"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}

export default StatusUpdateDropdown;
