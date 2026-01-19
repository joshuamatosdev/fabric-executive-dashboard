import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { LineChartWidgetConfig } from '@/types/widget';

// Mock data for development
const MOCK_DATA = [
  { name: 'Jan', actual: 400, predicted: null },
  { name: 'Feb', actual: 450, predicted: null },
  { name: 'Mar', actual: 420, predicted: null },
  { name: 'Apr', actual: 480, predicted: null },
  { name: 'May', actual: 510, predicted: null },
  { name: 'Jun', actual: 540, predicted: 540 },
  { name: 'Jul', actual: 500, predicted: 580 },
  { name: 'Aug', actual: 460, predicted: 620 },
];

// Default colors for series
const DEFAULT_COLORS = ['#7dd3fc', '#d83b01', '#107c10', '#ffb900', '#0078d4'];

interface LineChartWidgetProps {
  config: LineChartWidgetConfig;
  data?: Array<Record<string, unknown>>;
}

export function LineChartWidget({ config, data }: LineChartWidgetProps) {
  const chartData = data ?? MOCK_DATA;

  const tooltipStyle = {
    backgroundColor: '#18181b',
    border: '1px solid #27272a',
    borderRadius: '4px',
    fontSize: '11px',
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        {config.showGrid !== false && (
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
        )}
        <XAxis
          dataKey={config.xAxis.dataKey}
          stroke="#71717a"
          fontSize={9}
          tickLine={false}
          axisLine={false}
        />
        <YAxis stroke="#71717a" fontSize={9} tickLine={false} axisLine={false} />
        {config.showTooltip !== false && <Tooltip contentStyle={tooltipStyle} />}
        {config.showLegend && <Legend />}
        {config.series.map((series, index) => (
          <Line
            key={series.dataKey}
            name={series.name ?? series.dataKey}
            type={series.type ?? 'monotone'}
            dataKey={series.dataKey}
            stroke={series.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
            strokeWidth={series.strokeWidth ?? 1.5}
            strokeDasharray={series.strokeDasharray}
            dot={{ r: series.dotRadius ?? 2 }}
            connectNulls={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
