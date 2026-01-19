import type { WidgetInstance, WidgetConfig } from '../../types/widget';
import type { DashboardId, WidgetId, WorkspaceId, DatasetId } from '../../types/common';

// Helper to create branded IDs in mock data
const dashboardId = (id: string) => id as DashboardId;
const widgetId = (id: string) => id as WidgetId;
const workspaceId = (id: string) => id as WorkspaceId;
const datasetId = (id: string) => id as DatasetId;

// Mock widget instances for the Executive Overview dashboard
export const mockWidgets: WidgetInstance[] = [
  // KPI Widgets
  {
    id: widgetId('widget-kpi-1'),
    dashboardId: dashboardId('dashboard-1'),
    config: {
      type: 'kpi',
      title: 'Personnel Recruiting',
      subtitle: 'Monthly hires',
      valueKey: 'value',
      previousValueKey: 'previousValue',
      changeKey: 'change',
      format: 'number',
      icon: 'Users',
      color: '#0078d4',
      trendLabel: 'vs last month',
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z',
  },
  {
    id: widgetId('widget-kpi-2'),
    dashboardId: dashboardId('dashboard-1'),
    config: {
      type: 'kpi',
      title: 'Personnel Retention',
      subtitle: 'Retention rate',
      valueKey: 'value',
      changeKey: 'change',
      format: 'percent',
      icon: 'UserMinus',
      color: '#107c10',
      trendLabel: 'vs last month',
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z',
  },
  {
    id: widgetId('widget-kpi-3'),
    dashboardId: dashboardId('dashboard-1'),
    config: {
      type: 'kpi',
      title: 'Readiness Index',
      subtitle: 'Core score',
      valueKey: 'value',
      changeKey: 'change',
      format: 'number',
      icon: 'Activity',
      color: '#ffb900',
      trendLabel: 'improving',
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z',
  },
  {
    id: widgetId('widget-kpi-4'),
    dashboardId: dashboardId('dashboard-1'),
    config: {
      type: 'kpi',
      title: 'Earnings (YTD)',
      subtitle: 'Year to date',
      valueKey: 'value',
      changeKey: 'change',
      format: 'currency',
      icon: 'DollarSign',
      color: '#0078d4',
      trendLabel: 'vs target',
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z',
  },
  {
    id: widgetId('widget-kpi-5'),
    dashboardId: dashboardId('dashboard-1'),
    config: {
      type: 'kpi',
      title: 'Operating Expenses',
      subtitle: 'Current period',
      valueKey: 'value',
      changeKey: 'change',
      format: 'currency',
      icon: 'TrendingUp',
      color: '#d83b01',
      trendLabel: 'reduction',
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z',
  },

  // Bar Chart Widgets
  {
    id: widgetId('widget-bar-1'),
    dashboardId: dashboardId('dashboard-1'),
    config: {
      type: 'bar-chart',
      title: 'Recruitment',
      subtitle: 'Monthly hires',
      xAxis: { dataKey: 'name' },
      yAxis: { dataKey: 'value' },
      colors: ['#0078d4'],
      showGrid: true,
      showTooltip: true,
      showReferenceLine: true,
      referenceLineValue: 'average',
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z',
  },
  {
    id: widgetId('widget-bar-2'),
    dashboardId: dashboardId('dashboard-1'),
    config: {
      type: 'bar-chart',
      title: 'Retention',
      subtitle: 'By Quarter (%)',
      xAxis: { dataKey: 'name' },
      yAxis: { dataKey: 'value', domain: [80, 100] },
      colors: ['#107c10'],
      showGrid: true,
      showTooltip: true,
      showReferenceLine: true,
      referenceLineValue: 'average',
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z',
  },
  {
    id: widgetId('widget-bar-3'),
    dashboardId: dashboardId('dashboard-1'),
    config: {
      type: 'bar-chart',
      title: 'Readiness',
      subtitle: 'Core Score (0-100)',
      xAxis: { dataKey: 'name' },
      yAxis: { dataKey: 'value' },
      colors: ['#ffb900'],
      showGrid: true,
      showTooltip: true,
      showReferenceLine: true,
      referenceLineValue: 'average',
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z',
  },
  {
    id: widgetId('widget-bar-4'),
    dashboardId: dashboardId('dashboard-1'),
    config: {
      type: 'bar-chart',
      title: 'Regional Revenue',
      subtitle: 'In thousands (USD)',
      xAxis: { dataKey: 'name' },
      yAxis: { dataKey: 'value' },
      colors: ['#0078d4'],
      showGrid: true,
      showTooltip: true,
      showReferenceLine: true,
      referenceLineValue: 'average',
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z',
  },

  // Line Chart Widgets
  {
    id: widgetId('widget-line-1'),
    dashboardId: dashboardId('dashboard-1'),
    config: {
      type: 'line-chart',
      title: 'Recruiting Trend',
      subtitle: 'Actuals vs Forecast',
      xAxis: { dataKey: 'name' },
      series: [
        {
          dataKey: 'actual',
          name: 'Actual',
          color: '#7dd3fc',
          strokeWidth: 1.5,
          strokeDasharray: '4 4',
          dotRadius: 2,
          type: 'monotone',
        },
        {
          dataKey: 'predicted',
          name: 'Forecast',
          color: '#d83b01',
          strokeWidth: 1.5,
          dotRadius: 2,
          type: 'monotone',
        },
      ],
      showGrid: true,
      showTooltip: true,
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z',
  },
  {
    id: widgetId('widget-line-2'),
    dashboardId: dashboardId('dashboard-1'),
    config: {
      type: 'line-chart',
      title: 'Cloud GA Readiness',
      subtitle: 'Air-Gap Cloud Sync Count',
      xAxis: { dataKey: 'name' },
      series: [
        {
          dataKey: 'value',
          color: '#7dd3fc',
          strokeWidth: 1.5,
          strokeDasharray: '4 4',
          dotRadius: 2,
          type: 'monotone',
        },
      ],
      showGrid: true,
      showTooltip: true,
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z',
  },
  {
    id: widgetId('widget-line-3'),
    dashboardId: dashboardId('dashboard-1'),
    config: {
      type: 'line-chart',
      title: 'Earnings Growth',
      subtitle: 'Performance Projection',
      xAxis: { dataKey: 'name' },
      series: [
        {
          dataKey: 'actual',
          name: 'Actual',
          color: '#7dd3fc',
          strokeWidth: 1.5,
          strokeDasharray: '4 4',
          dotRadius: 2,
          type: 'monotone',
        },
        {
          dataKey: 'predicted',
          name: 'Forecast',
          color: '#ffb900',
          strokeWidth: 1.5,
          dotRadius: 2,
          type: 'monotone',
        },
      ],
      showGrid: true,
      showTooltip: true,
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z',
  },
  {
    id: widgetId('widget-line-4'),
    dashboardId: dashboardId('dashboard-1'),
    config: {
      type: 'line-chart',
      title: 'Compliance Health',
      subtitle: 'Security Standard Alignment',
      xAxis: { dataKey: 'name' },
      series: [
        {
          dataKey: 'value',
          color: '#7dd3fc',
          strokeWidth: 1.5,
          strokeDasharray: '4 4',
          dotRadius: 2,
          type: 'monotone',
        },
      ],
      showGrid: true,
      showTooltip: true,
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z',
  },
];

// In-memory storage for mutations
let widgetsDb = [...mockWidgets];

export const getWidgets = () => [...widgetsDb];
export const getWidgetById = (id: WidgetId) => widgetsDb.find((w) => w.id === id);
export const getWidgetsByDashboard = (dashboardId: DashboardId) =>
  widgetsDb.filter((w) => w.dashboardId === dashboardId);

export const createWidget = (
  dashboardId: DashboardId,
  config: WidgetConfig
): WidgetInstance => {
  const now = new Date().toISOString();
  const newWidget: WidgetInstance = {
    id: widgetId(`widget-${Date.now()}`),
    dashboardId,
    config,
    createdAt: now,
    updatedAt: now,
  };
  widgetsDb.push(newWidget);
  return newWidget;
};

export const updateWidget = (
  id: WidgetId,
  config: Partial<WidgetConfig>
): WidgetInstance | undefined => {
  const index = widgetsDb.findIndex((w) => w.id === id);
  if (index === -1) return undefined;

  widgetsDb[index] = {
    ...widgetsDb[index],
    config: { ...widgetsDb[index].config, ...config } as WidgetConfig,
    updatedAt: new Date().toISOString(),
  };
  return widgetsDb[index];
};

export const deleteWidget = (id: WidgetId): boolean => {
  const index = widgetsDb.findIndex((w) => w.id === id);
  if (index === -1) return false;
  widgetsDb.splice(index, 1);
  return true;
};

// Reset function for testing
export const resetWidgetsDb = () => {
  widgetsDb = [...mockWidgets];
};
