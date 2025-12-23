import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { RevenueDataPoint } from '../types/dashboard';
import './RevenueChart.css';

export interface OrdersChartProps {
  data: RevenueDataPoint[];
  loading?: boolean;
  error?: Error;
}

export function OrdersChart({ data, loading, error }: OrdersChartProps) {
  if (loading) {
    return <OrdersChartSkeleton />;
  }

  if (error) {
    return (
      <div className="chart-container">
        <div className="chart-error">
          <p>Failed to load orders chart</p>
          <p className="chart-error-detail">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-empty">
          <p>No order data available for the selected period</p>
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
            Orders: <strong>{data.orders}</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate max value for better Y-axis scaling
  const maxOrders = Math.max(...data.map((d) => d.orders));
  const yAxisMax = Math.ceil(maxOrders * 1.1);

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Orders Over Time</h3>
        <p className="chart-subtitle">Daily order volume</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke="#888"
            tick={{ fill: '#888' }}
            style={{ fontSize: '0.75rem' }}
          />
          <YAxis
            domain={[0, yAxisMax]}
            stroke="#888"
            tick={{ fill: '#888' }}
            style={{ fontSize: '0.75rem' }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="orders"
            fill="#22c55e"
            radius={[4, 4, 0, 0]}
            animationDuration={500}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.orders > maxOrders * 0.7 ? '#22c55e' : '#646cff'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function OrdersChartSkeleton() {
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
