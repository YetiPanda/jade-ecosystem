/**
 * Performance Bar Chart Component
 * Week 9: Advanced Analytics - Bar chart for comparative metrics
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card } from '../../ui/Card';

interface BarChartData {
  name: string;
  value: number;
  target?: number;
  comparison?: number;
}

interface PerformanceBarChartProps {
  data: BarChartData[];
  title?: string;
  subtitle?: string;
  height?: number;
  showTarget?: boolean;
  showComparison?: boolean;
  valueFormatter?: (value: number) => string;
  layout?: 'vertical' | 'horizontal';
}

export function PerformanceBarChart({
  data,
  title = 'Performance Metrics',
  subtitle,
  height = 300,
  showTarget = false,
  showComparison = false,
  valueFormatter,
  layout = 'horizontal',
}: PerformanceBarChartProps) {
  const formatValue = (value: number) => {
    if (valueFormatter) {
      return valueFormatter(value);
    }
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-medium">{formatValue(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout={layout}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          {layout === 'horizontal' ? (
            <>
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                tickFormatter={formatValue}
              />
            </>
          ) : (
            <>
              <XAxis
                type="number"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                tickFormatter={formatValue}
              />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                width={150}
              />
            </>
          )}
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          <Bar
            dataKey="value"
            fill="#3b82f6"
            name="Current"
            radius={[4, 4, 0, 0]}
          />

          {showComparison && (
            <Bar
              dataKey="comparison"
              fill="#9ca3af"
              name="Previous Period"
              radius={[4, 4, 0, 0]}
            />
          )}

          {showTarget && (
            <Bar
              dataKey="target"
              fill="#10b981"
              name="Target"
              radius={[4, 4, 0, 0]}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
