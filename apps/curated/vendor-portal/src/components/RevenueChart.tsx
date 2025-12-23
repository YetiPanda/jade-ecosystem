import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { RevenueDataPoint, formatCurrency } from '../types/dashboard';
import './RevenueChart.css';

export interface RevenueChartProps {
  data: RevenueDataPoint[];
  loading?: boolean;
  error?: Error;
}

export function RevenueChart({ data, loading, error }: RevenueChartProps) {
  if (loading) {
    return <RevenueChartSkeleton />;
  }

  if (error) {
    return (
      <div className="chart-container">
        <div className="chart-error">
          <p>Failed to load revenue chart</p>
          <p className="chart-error-detail">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-empty">
          <p>No revenue data available for the selected period</p>
        </div>
      </div>
    );
  }

  // Format dates for display (e.g., "Jan 15" or "12/15")
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="chart-tooltip">
          <p className="chart-tooltip-date">{formatDate(data.date)}</p>
          <p className="chart-tooltip-value">
            Revenue: <strong>{formatCurrency(data.revenue)}</strong>
          </p>
          <p className="chart-tooltip-value">
            Orders: <strong>{data.orders}</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  // Format Y-axis values as compact currency (e.g., "$1.2k", "$45k")
  const formatYAxis = (value: number) => {
    const dollars = value / 100;
    if (dollars >= 1000) {
      return `$${(dollars / 1000).toFixed(1)}k`;
    }
    return `$${dollars.toFixed(0)}`;
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Revenue Over Time</h3>
        <p className="chart-subtitle">Daily revenue breakdown</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#646cff" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#646cff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke="#888"
            tick={{ fill: '#888' }}
            style={{ fontSize: '0.75rem' }}
          />
          <YAxis
            tickFormatter={formatYAxis}
            stroke="#888"
            tick={{ fill: '#888' }}
            style={{ fontSize: '0.75rem' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#646cff"
            strokeWidth={2}
            fill="url(#revenueGradient)"
            animationDuration={500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function RevenueChartSkeleton() {
  return (
    <div className="chart-container">
      <div className="chart-header">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-subtitle" />
      </div>
      <div className="chart-skeleton">
        <div className="skeleton skeleton-chart" />
      </div>
    </div>
  );
}
