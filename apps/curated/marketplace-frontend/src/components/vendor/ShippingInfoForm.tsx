/**
 * Shipping Info Form Component
 * Sprint B.4: Order Management
 *
 * Form for vendors to add shipping/fulfillment information to orders.
 * Includes carrier, tracking number, tracking URL, and estimated delivery.
 */

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/label';
import { Card } from '../ui/Card';
import { Truck, Package, Calendar, Link as LinkIcon, XCircle } from 'lucide-react';

export interface ShippingInfo {
  carrier: string;
  trackingNumber: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
}

interface ShippingInfoFormProps {
  orderId: string;
  onSubmit: (orderId: string, shippingInfo: ShippingInfo) => void;
  onCancel?: () => void;
  disabled?: boolean;
}

const COMMON_CARRIERS = [
  'FedEx',
  'UPS',
  'USPS',
  'DHL',
  'Other',
];

export function ShippingInfoForm({
  orderId,
  onSubmit,
  onCancel,
  disabled = false,
}: ShippingInfoFormProps) {
  const [carrier, setCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!carrier.trim()) {
      newErrors.carrier = 'Carrier is required';
    }

    if (!trackingNumber.trim()) {
      newErrors.trackingNumber = 'Tracking number is required';
    } else if (trackingNumber.length < 5) {
      newErrors.trackingNumber = 'Tracking number must be at least 5 characters';
    }

    if (trackingUrl && !isValidUrl(trackingUrl)) {
      newErrors.trackingUrl = 'Please enter a valid URL';
    }

    if (estimatedDelivery) {
      const deliveryDate = new Date(estimatedDelivery);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (deliveryDate < today) {
        newErrors.estimatedDelivery = 'Estimated delivery must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const shippingInfo: ShippingInfo = {
        carrier: carrier.trim(),
        trackingNumber: trackingNumber.trim(),
        ...(trackingUrl && { trackingUrl: trackingUrl.trim() }),
        ...(estimatedDelivery && { estimatedDelivery }),
      };

      await onSubmit(orderId, shippingInfo);

      // Reset form after successful submission
      setCarrier('');
      setTrackingNumber('');
      setTrackingUrl('');
      setEstimatedDelivery('');
      setErrors({});
    } catch (error) {
      console.error('Failed to submit shipping info:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setCarrier('');
    setTrackingNumber('');
    setTrackingUrl('');
    setEstimatedDelivery('');
    setErrors({});
    onCancel?.();
  };

  return (
    <Card className="p-4 border-subtle">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Carrier */}
        <div>
          <Label htmlFor="carrier" className="text-sm font-medium mb-2 block">
            Carrier <span className="text-destructive">*</span>
          </Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                id="carrier"
                type="text"
                placeholder="e.g., FedEx, UPS, USPS"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                disabled={disabled || isSubmitting}
                className={errors.carrier ? 'border-destructive' : ''}
                list="carriers"
              />
              <datalist id="carriers">
                {COMMON_CARRIERS.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <Truck className="h-9 w-5 text-muted-foreground self-center" />
          </div>
          {errors.carrier && (
            <p className="text-xs text-destructive mt-1">{errors.carrier}</p>
          )}
        </div>

        {/* Tracking Number */}
        <div>
          <Label htmlFor="trackingNumber" className="text-sm font-medium mb-2 block">
            Tracking Number <span className="text-destructive">*</span>
          </Label>
          <div className="flex gap-2">
            <Input
              id="trackingNumber"
              type="text"
              placeholder="Enter tracking number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              disabled={disabled || isSubmitting}
              className={`flex-1 font-mono text-sm ${errors.trackingNumber ? 'border-destructive' : ''}`}
            />
            <Package className="h-9 w-5 text-muted-foreground self-center" />
          </div>
          {errors.trackingNumber && (
            <p className="text-xs text-destructive mt-1">{errors.trackingNumber}</p>
          )}
        </div>

        {/* Tracking URL (Optional) */}
        <div>
          <Label htmlFor="trackingUrl" className="text-sm font-medium mb-2 block">
            Tracking URL <span className="text-xs text-muted-foreground">(Optional)</span>
          </Label>
          <div className="flex gap-2">
            <Input
              id="trackingUrl"
              type="text"
              placeholder="https://..."
              value={trackingUrl}
              onChange={(e) => setTrackingUrl(e.target.value)}
              disabled={disabled || isSubmitting}
              className={`flex-1 ${errors.trackingUrl ? 'border-destructive' : ''}`}
            />
            <LinkIcon className="h-9 w-5 text-muted-foreground self-center" />
          </div>
          {errors.trackingUrl && (
            <p className="text-xs text-destructive mt-1">{errors.trackingUrl}</p>
          )}
        </div>

        {/* Estimated Delivery (Optional) */}
        <div>
          <Label htmlFor="estimatedDelivery" className="text-sm font-medium mb-2 block">
            Estimated Delivery <span className="text-xs text-muted-foreground">(Optional)</span>
          </Label>
          <div className="flex gap-2">
            <Input
              id="estimatedDelivery"
              type="date"
              value={estimatedDelivery}
              onChange={(e) => setEstimatedDelivery(e.target.value)}
              disabled={disabled || isSubmitting}
              className={`flex-1 ${errors.estimatedDelivery ? 'border-destructive' : ''}`}
              min={new Date().toISOString().split('T')[0]}
            />
            <Calendar className="h-9 w-5 text-muted-foreground self-center" />
          </div>
          {errors.estimatedDelivery && (
            <p className="text-xs text-destructive mt-1">{errors.estimatedDelivery}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            type="submit"
            disabled={disabled || isSubmitting}
            className="flex-1"
            size="sm"
          >
            {isSubmitting ? (
              <>
                <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Adding...
              </>
            ) : (
              <>
                <Package className="h-4 w-4 mr-2" />
                Add Shipping Info
              </>
            )}
          </Button>
          {onCancel && (
            <Button
              type="button"
              onClick={handleCancel}
              disabled={disabled || isSubmitting}
              variant="outline"
              size="sm"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}

export default ShippingInfoForm;
