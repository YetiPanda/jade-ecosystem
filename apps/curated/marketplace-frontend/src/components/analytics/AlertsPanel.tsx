/**
 * AlertsPanel Component
 *
 * Displays business alerts with severity badges and acknowledge functionality
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  AlertCircle,
  AlertTriangle,
  Info,
  Bell,
  BellOff,
  Check,
  Clock,
  ChevronDown,
  ChevronUp,
  Filter,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';

type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';
type AlertCategory = 'REVENUE' | 'INVENTORY' | 'CUSTOMER' | 'SYSTEM' | 'COMPLIANCE' | 'OPPORTUNITY';

interface BusinessAlert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  category: AlertCategory;
  timestamp: string;
  affectedMetrics: string[];
  thresholdValue?: number;
  currentValue?: number;
  recommendedActions: string[];
  acknowledged: boolean;
  acknowledgedAt?: string;
}

interface AlertsPanelProps {
  alerts?: BusinessAlert[];
  loading?: boolean;
  onAcknowledge?: (alertId: string) => void;
  compact?: boolean;
}

const SeverityIcon = ({ severity }: { severity: AlertSeverity }) => {
  switch (severity) {
    case 'CRITICAL':
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case 'WARNING':
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case 'INFO':
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

const SeverityBadge = ({ severity }: { severity: AlertSeverity }) => (
  <span
    className={cn(
      'text-xs font-medium px-2 py-0.5 rounded-full',
      severity === 'CRITICAL' && 'bg-red-100 text-red-700',
      severity === 'WARNING' && 'bg-amber-100 text-amber-700',
      severity === 'INFO' && 'bg-blue-100 text-blue-700'
    )}
  >
    {severity}
  </span>
);

const CategoryBadge = ({ category }: { category: AlertCategory }) => (
  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
    {category}
  </span>
);

function formatTimeAgo(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function AlertsPanel({
  alerts,
  loading,
  onAcknowledge,
  compact = false,
}: AlertsPanelProps) {
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<AlertSeverity | 'ALL'>('ALL');
  const [showAcknowledged, setShowAcknowledged] = useState(false);

  if (loading) {
    return <AlertsPanelSkeleton />;
  }

  if (!alerts || alerts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          <BellOff className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          No active alerts
        </CardContent>
      </Card>
    );
  }

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    if (filterSeverity !== 'ALL' && alert.severity !== filterSeverity) return false;
    if (!showAcknowledged && alert.acknowledged) return false;
    return true;
  });

  // Sort by severity (CRITICAL first) then by timestamp (newest first)
  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    const severityOrder = { CRITICAL: 0, WARNING: 1, INFO: 2 };
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  if (compact) {
    return <CompactAlertsPanel alerts={sortedAlerts} onAcknowledge={onAcknowledge} />;
  }

  const criticalCount = alerts.filter((a) => a.severity === 'CRITICAL' && !a.acknowledged).length;
  const warningCount = alerts.filter((a) => a.severity === 'WARNING' && !a.acknowledged).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-600" />
            Business Alerts
            {(criticalCount > 0 || warningCount > 0) && (
              <span className="flex items-center gap-1 ml-2">
                {criticalCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {criticalCount}
                  </span>
                )}
                {warningCount > 0 && (
                  <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {warningCount}
                  </span>
                )}
              </span>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value as AlertSeverity | 'ALL')}
                className="text-sm border-none bg-transparent focus:ring-0 pr-6"
              >
                <option value="ALL">All</option>
                <option value="CRITICAL">Critical</option>
                <option value="WARNING">Warning</option>
                <option value="INFO">Info</option>
              </select>
            </div>
            <label className="flex items-center gap-1 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={showAcknowledged}
                onChange={(e) => setShowAcknowledged(e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              Show resolved
            </label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sortedAlerts.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No alerts match your filters</p>
        ) : (
          <div className="space-y-3">
            {sortedAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                expanded={expandedAlertId === alert.id}
                onToggle={() =>
                  setExpandedAlertId(expandedAlertId === alert.id ? null : alert.id)
                }
                onAcknowledge={onAcknowledge}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AlertCard({
  alert,
  expanded,
  onToggle,
  onAcknowledge,
}: {
  alert: BusinessAlert;
  expanded: boolean;
  onToggle: () => void;
  onAcknowledge?: (alertId: string) => void;
}) {
  return (
    <div
      className={cn(
        'border rounded-lg overflow-hidden transition-all',
        alert.severity === 'CRITICAL' && !alert.acknowledged && 'border-red-300 bg-red-50',
        alert.severity === 'WARNING' && !alert.acknowledged && 'border-amber-300 bg-amber-50',
        alert.severity === 'INFO' && !alert.acknowledged && 'border-blue-300 bg-blue-50',
        alert.acknowledged && 'border-gray-200 bg-gray-50 opacity-60'
      )}
    >
      <div
        className="flex items-start justify-between p-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-start gap-3">
          <SeverityIcon severity={alert.severity} />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className={cn(
                'font-medium',
                alert.acknowledged && 'line-through text-gray-500'
              )}>
                {alert.title}
              </p>
              <SeverityBadge severity={alert.severity} />
              <CategoryBadge category={alert.category} />
            </div>
            <p className="text-sm text-gray-600 mt-1 line-clamp-1">
              {alert.description}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                {formatTimeAgo(alert.timestamp)}
              </span>
              {alert.acknowledged && alert.acknowledgedAt && (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <Check className="h-3 w-3" />
                  Resolved {formatTimeAgo(alert.acknowledgedAt)}
                </span>
              )}
            </div>
          </div>
        </div>
        <button className="p-1 hover:bg-gray-200 rounded">
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-200/50">
          {alert.thresholdValue !== undefined && alert.currentValue !== undefined && (
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div className="p-2 bg-white/50 rounded">
                <p className="text-gray-500">Threshold</p>
                <p className="font-semibold">{alert.thresholdValue.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-white/50 rounded">
                <p className="text-gray-500">Current Value</p>
                <p className={cn(
                  'font-semibold',
                  alert.severity === 'CRITICAL' && 'text-red-600',
                  alert.severity === 'WARNING' && 'text-amber-600'
                )}>
                  {alert.currentValue.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {alert.affectedMetrics && alert.affectedMetrics.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">Affected Metrics</p>
              <div className="flex flex-wrap gap-1">
                {alert.affectedMetrics.map((metric, idx) => (
                  <span key={idx} className="text-xs px-2 py-0.5 bg-white/50 rounded">
                    {metric}
                  </span>
                ))}
              </div>
            </div>
          )}

          {alert.recommendedActions && alert.recommendedActions.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Recommended Actions</p>
              <ul className="space-y-1">
                {alert.recommendedActions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-gray-400">•</span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!alert.acknowledged && onAcknowledge && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAcknowledge(alert.id);
              }}
              className="w-full"
            >
              <Check className="h-4 w-4 mr-2" />
              Mark as Resolved
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function CompactAlertsPanel({
  alerts,
  onAcknowledge,
}: {
  alerts: BusinessAlert[];
  onAcknowledge?: (alertId: string) => void;
}) {
  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged).slice(0, 3);

  if (unacknowledgedAlerts.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 text-center text-gray-500">
          <Check className="h-6 w-6 mx-auto mb-1 text-green-500" />
          <p className="text-sm">All clear!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Alerts ({unacknowledgedAlerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {unacknowledgedAlerts.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              'flex items-center gap-2 p-2 rounded text-sm',
              alert.severity === 'CRITICAL' && 'bg-red-50',
              alert.severity === 'WARNING' && 'bg-amber-50',
              alert.severity === 'INFO' && 'bg-blue-50'
            )}
          >
            <SeverityIcon severity={alert.severity} />
            <p className="flex-1 line-clamp-1">{alert.title}</p>
            {onAcknowledge && (
              <button
                onClick={() => onAcknowledge(alert.id)}
                className="p-1 hover:bg-gray-200 rounded"
                title="Dismiss"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function AlertsPanelSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
      </CardHeader>
      <CardContent className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />
        ))}
      </CardContent>
    </Card>
  );
}

export default AlertsPanel;
