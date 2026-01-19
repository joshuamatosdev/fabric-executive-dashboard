import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';
import { tokens } from '@fluentui/react-components';
import type { BarChartWidgetConfig } from '@/types/widget';

// Mock data for development
const MOCK_DATA = [
  { name: 'Engineering', value: 45 },
  { name: 'Sales', value: 32 },
  { name: 'Marketing', value: 18 },
  { name: 'Product', value: 24 },
  { name: 'HR', value: 12 },
];

interface BarChartWidgetProps {
  config: BarChartWidgetConfig;
  data?: Array<Record<string, unknown>>;
}

export function BarChartWidget({ config, data }: BarChartWidgetProps) {
  const chartData = data ?? MOCK_DATA;
  const colors = config.colors ?? ['#0078d4'];

  // Calculate average for reference line
  const average =
    config.showReferenceLine && config.referenceLineValue === 'average'
      ? chartData.reduce((sum, item) => sum + (Number(item[config.yAxis.dataKey]) || 0), 0) /
        chartData.length
      : config.referenceLineValue;

  const tooltipStyle = {
    backgroundColor: '#18181b',
    border: '1px solid #27272a',
    borderRadius: '4px',
    fontSize: '11px',
  };

  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
      <BarChart
        data={chartData}
        layout={config.orientation === 'horizontal' ? 'vertical' : 'horizontal'}
        margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
      >
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
        <YAxis
          dataKey={config.yAxis.dataKey}
          stroke="#71717a"
          fontSize={9}
          tickLine={false}
          axisLine={false}
          domain={config.yAxis.domain as [number, number] | undefined}
        />
        {config.showTooltip !== false && (
          <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: colors[0] }} />
        )}
        {config.showLegend && <Legend />}
        {config.showReferenceLine && average !== undefined && typeof average === 'number' && (
          <ReferenceLine y={average} stroke="#ef4444" strokeDasharray="3 3" />
        )}
        <Bar
          dataKey={config.yAxis.dataKey}
          fill={colors[0]}
          radius={[2, 2, 0, 0]}
          stackId={config.stacked ? 'stack' : undefined}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
