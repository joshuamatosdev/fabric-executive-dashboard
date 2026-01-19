import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { LineChartWidgetConfig } from '@/types/widget';
import { SafeResponsiveContainer } from './SafeResponsiveContainer';

// Mock data for development - includes actual/predicted, value, and value2 keys
const MOCK_DATA = [
  { name: 'Jan', actual: 400, predicted: null, value: 400, value2: 380 },
  { name: 'Feb', actual: 450, predicted: null, value: 450, value2: 420 },
  { name: 'Mar', actual: 420, predicted: null, value: 420, value2: 440 },
  { name: 'Apr', actual: 480, predicted: null, value: 480, value2: 460 },
  { name: 'May', actual: 510, predicted: null, value: 510, value2: 490 },
  { name: 'Jun', actual: 540, predicted: 540, value: 540, value2: 520 },
  { name: 'Jul', actual: 500, predicted: 580, value: 580, value2: 550 },
  { name: 'Aug', actual: 460, predicted: 620, value: 620, value2: 600 },
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
    <SafeResponsiveContainer>
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
    </SafeResponsiveContainer>
  );
}
