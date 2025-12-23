/**
 * Pending Actions Component
 * Week 4 Day 3: Displays vendor actions requiring attention
 */

import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import type { PendingAction } from '../../hooks/useVendor';

interface PendingActionsProps {
  actions: PendingAction[];
  onActionClick?: (action: PendingAction) => void;
  className?: string;
}

export function PendingActions({ actions, onActionClick, className }: PendingActionsProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return '⚠️';
      case 'MEDIUM':
        return '⚡';
      case 'LOW':
        return 'ℹ️';
      default:
        return '•';
    }
  };

  if (actions.length === 0) {
    return (
      <Card className={cn('p-6', className)}>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">✓</div>
          <h3 className="text-lg font-semibold text-gray-900">All Caught Up!</h3>
          <p className="text-sm text-gray-500 mt-1">
            You have no pending actions at this time.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('p-6', className)}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Actions</h3>
      <div className="space-y-3">
        {actions.map((action) => (
          <div
            key={action.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{getPriorityIcon(action.priority)}</span>
                  <h4 className="font-semibold text-gray-900">{action.title}</h4>
                  <span
                    className={cn(
                      'text-xs px-2 py-1 rounded-full border',
                      getPriorityColor(action.priority)
                    )}
                  >
                    {action.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                {action.dueDate && (
                  <p className="text-xs text-gray-500 mt-2">
                    Due: {new Date(action.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              {(action.actionUrl || onActionClick) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (onActionClick) {
                      onActionClick(action);
                    } else if (action.actionUrl) {
                      window.location.href = action.actionUrl;
                    }
                  }}
                  className="ml-4"
                >
                  Take Action
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
