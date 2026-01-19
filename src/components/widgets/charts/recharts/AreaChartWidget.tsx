import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { AreaChartWidgetConfig } from '@/types/widget';

// Mock data for development
const MOCK_DATA = [
  { name: 'Jan', value: 400, value2: 240 },
  { name: 'Feb', value: 300, value2: 139 },
  { name: 'Mar', value: 200, value2: 980 },
  { name: 'Apr', value: 278, value2: 390 },
  { name: 'May', value: 189, value2: 480 },
  { name: 'Jun', value: 239, value2: 380 },
  { name: 'Jul', value: 349, value2: 430 },
];

// Default colors for series
const DEFAULT_COLORS = ['#0078d4', '#ffb900', '#107c10', '#d83b01', '#7dd3fc'];

interface AreaChartWidgetProps {
  config: AreaChartWidgetConfig;
  data?: Array<Record<string, unknown>>;
}

export function AreaChartWidget({ config, data }: AreaChartWidgetProps) {
  const chartData = data ?? MOCK_DATA;

  const tooltipStyle = {
    backgroundColor: '#18181b',
    border: 'none',
    borderRadius: '4px',
    fontSize: '11px',
  };

  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
      <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <defs>
          {config.series.map((series, index) => {
            const color = series.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length];
            const gradientId = series.gradientId ?? `gradient-${series.dataKey}`;
            return (
              <linearGradient key={gradientId} id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            );
          })}
        </defs>
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
        {config.series.map((series, index) => {
          const color = series.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length];
          const gradientId = series.gradientId ?? `gradient-${series.dataKey}`;
          return (
            <Area
              key={series.dataKey}
              name={series.name ?? series.dataKey}
              type={series.type ?? 'monotone'}
              dataKey={series.dataKey}
              stroke={color}
              strokeWidth={series.strokeWidth ?? 1.5}
              fillOpacity={series.fillOpacity ?? 1}
              fill={`url(#${gradientId})`}
            />
          );
        })}
      </AreaChart>
    </ResponsiveContainer>
  );
}
