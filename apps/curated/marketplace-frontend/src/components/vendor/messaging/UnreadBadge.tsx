/**
 * Unread Badge Component
 * Feature 011: Vendor Portal MVP
 * Phase C: Communication
 * Sprint C.2: Messaging UI - Task C.2.2
 *
 * Displays unread message count badge
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';

interface UnreadBadgeProps {
  count: number;
  className?: string;
}

/**
 * UnreadBadge
 *
 * Shows unread message count with visual emphasis
 */
export function UnreadBadge({ count, className = '' }: UnreadBadgeProps) {
  if (count === 0) {
    return null;
  }

  // Cap display at 99+
  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <Badge
      variant="destructive"
      className={`h-5 min-w-[20px] px-1 flex items-center justify-center text-xs font-semibold ${className}`}
    >
      {displayCount}
    </Badge>
  );
}
