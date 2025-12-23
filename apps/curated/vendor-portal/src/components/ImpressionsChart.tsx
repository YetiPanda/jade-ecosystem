import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TimeSeriesDataPoint } from '../types/discovery';
import './ImpressionsChart.css';

export interface ImpressionsChartProps {
  data: TimeSeriesDataPoint[];
  loading?: boolean;
}

export function ImpressionsChart({ data, loading }: ImpressionsChartProps) {
  if (loading) {
    return <ImpressionsChartSkeleton />;
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toString();
  };

  return (
    <div className="impressions-chart-container">
      <div className="chart-header">
        <h3>Discovery Trends</h3>
        <div className="chart-legend-custom">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#646cff' }} />
            <span className="legend-label">Impressions</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#22c55e' }} />
            <span className="legend-label">Clicks</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#f59e0b' }} />
            <span className="legend-label">Orders</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke="#666"
            style={{ fontSize: '0.75rem' }}
          />
          <YAxis tickFormatter={formatYAxis} stroke="#666" style={{ fontSize: '0.75rem' }} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="impressions"
            stroke="#646cff"
            strokeWidth={2}
            dot={{ fill: '#646cff', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="clicks"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ fill: '#22c55e', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ fill: '#f59e0b', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const date = new Date(label || '');
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="custom-tooltip">
      <div className="tooltip-date">{formattedDate}</div>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="tooltip-item">
          <span className="tooltip-label" style={{ color: entry.color }}>
            {entry.name.charAt(0).toUpperCase() + entry.name.slice(1)}:
          </span>
          <span className="tooltip-value">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

function ImpressionsChartSkeleton() {
  return (
    <div className="impressions-chart-container skeleton-chart">
      <div className="chart-header">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-legend" />
      </div>
      <div className="skeleton skeleton-chart-area" />
    </div>
  );
}
