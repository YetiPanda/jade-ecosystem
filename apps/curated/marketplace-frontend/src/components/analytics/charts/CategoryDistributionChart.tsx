/**
 * Category Distribution Chart Component
 * Week 9: Advanced Analytics - Pie/Donut chart for category breakdown
 */

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Card } from '../../ui/Card';

interface CategoryData {
  name: string;
  value: number;
  percentage?: number;
}

interface CategoryDistributionChartProps {
  data: CategoryData[];
  title?: string;
  subtitle?: string;
  type?: 'pie' | 'donut';
  height?: number;
  showPercentage?: boolean;
}

const COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#6366f1', // indigo
  '#f97316', // orange
  '#14b8a6', // teal
];

export function CategoryDistributionChart({
  data,
  title = 'Category Distribution',
  subtitle,
  type = 'donut',
  height = 300,
  showPercentage = true,
}: CategoryDistributionChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const dataWithPercentage = data.map((item) => ({
    ...item,
    percentage: (item.value / total) * 100,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            {formatCurrency(data.value)}
          </p>
          {showPercentage && (
            <p className="text-sm text-gray-500">
              {data.percentage.toFixed(1)}%
            </p>
          )}
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
        <PieChart>
          <Pie
            data={dataWithPercentage}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) =>
              showPercentage ? `${name} (${percentage.toFixed(1)}%)` : name
            }
            outerRadius={type === 'donut' ? 100 : 120}
            innerRadius={type === 'donut' ? 60 : 0}
            fill="#8884d8"
            dataKey="value"
          >
            {dataWithPercentage.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry: any) => {
              const item = dataWithPercentage.find((d) => d.name === value);
              return `${value}: ${formatCurrency(item?.value || 0)}`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
