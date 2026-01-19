import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { ComposedChartWidgetConfig, ChartElement } from '@/types/widget';
import { SafeResponsiveContainer } from './SafeResponsiveContainer';

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

// Default colors for elements
const DEFAULT_COLORS = ['#0078d4', '#d83b01', '#107c10', '#ffb900', '#7dd3fc'];

interface ComposedChartWidgetProps {
  config: ComposedChartWidgetConfig;
  data?: Array<Record<string, unknown>>;
}

export function ComposedChartWidget({ config, data }: ComposedChartWidgetProps) {
  const chartData = data ?? MOCK_DATA;

  const tooltipStyle = {
    backgroundColor: '#18181b',
    border: 'none',
    borderRadius: '4px',
    fontSize: '11px',
  };

  const renderElement = (element: ChartElement, index: number) => {
    const color = element.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length];

    switch (element.type) {
      case 'bar':
        return (
          <Bar
            key={`${element.type}-${element.dataKey}`}
            name={element.name ?? element.dataKey}
            dataKey={element.dataKey}
            fill={color}
            radius={[2, 2, 0, 0]}
            stackId={element.stackId}
          />
        );
      case 'line':
        return (
          <Line
            key={`${element.type}-${element.dataKey}`}
            name={element.name ?? element.dataKey}
            type={element.lineType ?? 'monotone'}
            dataKey={element.dataKey}
            stroke={color}
            strokeWidth={1.5}
            dot={{ r: 2 }}
          />
        );
      case 'area':
        return (
          <Area
            key={`${element.type}-${element.dataKey}`}
            name={element.name ?? element.dataKey}
            type={element.lineType ?? 'monotone'}
            dataKey={element.dataKey}
            stroke={color}
            fill={color}
            fillOpacity={0.2}
            stackId={element.stackId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeResponsiveContainer>
      <ComposedChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        {config.showGrid !== false && (
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
        )}
        <XAxis
          dataKey={config.xAxis.dataKey}
          stroke="#71717a"
          fontSize={8}
          tickLine={false}
          axisLine={false}
        />
        <YAxis stroke="#71717a" fontSize={8} tickLine={false} axisLine={false} />
        {config.showTooltip !== false && <Tooltip contentStyle={tooltipStyle} />}
        {config.showLegend && <Legend />}
        {config.elements.map((element, index) => renderElement(element, index))}
      </ComposedChart>
    </SafeResponsiveContainer>
  );
}
