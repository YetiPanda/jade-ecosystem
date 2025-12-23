import './MetricCard.css';

export type TrendDirection = 'up' | 'down' | 'neutral';

export interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    direction: TrendDirection;
    period?: string;
  };
  icon?: string;
  loading?: boolean;
}

export function MetricCard({ label, value, trend, icon, loading }: MetricCardProps) {
  if (loading) {
    return <MetricCardSkeleton />;
  }

  const trendClass = trend
    ? trend.direction === 'up'
      ? 'metric-trend-positive'
      : trend.direction === 'down'
        ? 'metric-trend-negative'
        : 'metric-trend-neutral'
    : '';

  const trendIcon = trend
    ? trend.direction === 'up'
      ? '↑'
      : trend.direction === 'down'
        ? '↓'
        : '→'
    : '';

  return (
    <div className="metric-card">
      <div className="metric-card-header">
        <span className="metric-label">{label}</span>
        {icon && <span className="metric-icon">{icon}</span>}
      </div>

      <div className="metric-value">{value}</div>

      {trend && (
        <div className={`metric-trend ${trendClass}`}>
          <span className="trend-icon">{trendIcon}</span>
          <span className="trend-value">
            {Math.abs(trend.value)}%
          </span>
          {trend.period && (
            <span className="trend-period"> from {trend.period}</span>
          )}
        </div>
      )}
    </div>
  );
}

function MetricCardSkeleton() {
  return (
    <div className="metric-card metric-card-skeleton">
      <div className="skeleton skeleton-label"></div>
      <div className="skeleton skeleton-value"></div>
      <div className="skeleton skeleton-trend"></div>
    </div>
  );
}
