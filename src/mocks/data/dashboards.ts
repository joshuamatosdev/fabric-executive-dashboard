import type { Dashboard, DashboardLayout } from '../../types/dashboard';
import type { DashboardId, WidgetId, createDashboardId, createWidgetId } from '../../types/common';

// Helper to create branded IDs in mock data
const dashboardId = (id: string) => id as DashboardId;
const widgetId = (id: string) => id as WidgetId;

export const mockDashboards: Dashboard[] = [
  {
    id: dashboardId('dashboard-1'),
    name: 'Executive Overview',
    description: 'High-level KPIs and trends for executive leadership',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z',
  },
  {
    id: dashboardId('dashboard-2'),
    name: 'Recruiting Analytics',
    description: 'Detailed recruiting metrics and pipeline analysis',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-06-18T11:00:00Z',
  },
  {
    id: dashboardId('dashboard-3'),
    name: 'Financial Performance',
    description: 'Revenue, expenses, and financial health indicators',
    createdAt: '2024-03-10T08:30:00Z',
    updatedAt: '2024-06-19T16:45:00Z',
  },
];

export const mockDashboardLayouts: Record<string, DashboardLayout> = {
  'dashboard-1': {
    dashboardId: dashboardId('dashboard-1'),
    widgets: [
      widgetId('widget-kpi-1'),
      widgetId('widget-kpi-2'),
      widgetId('widget-kpi-3'),
      widgetId('widget-kpi-4'),
      widgetId('widget-kpi-5'),
      widgetId('widget-bar-1'),
      widgetId('widget-bar-2'),
      widgetId('widget-bar-3'),
      widgetId('widget-bar-4'),
      widgetId('widget-line-1'),
      widgetId('widget-line-2'),
      widgetId('widget-line-3'),
      widgetId('widget-line-4'),
      widgetId('widget-bar-5'),
      widgetId('widget-bar-6'),
      widgetId('widget-bar-7'),
      widgetId('widget-line-5'),
    ],
    layouts: {
      lg: [
        // KPI Row - 5 cards across (12 columns, so approx 2.4 each, round to fit)
        { i: 'widget-kpi-1', x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 1 },
        { i: 'widget-kpi-2', x: 2, y: 0, w: 3, h: 2, minW: 2, minH: 1 },
        { i: 'widget-kpi-3', x: 5, y: 0, w: 2, h: 2, minW: 2, minH: 1 },
        { i: 'widget-kpi-4', x: 7, y: 0, w: 3, h: 2, minW: 2, minH: 1 },
        { i: 'widget-kpi-5', x: 10, y: 0, w: 2, h: 2, minW: 2, minH: 1 },
        // Bar Chart Row 1 - 4 charts
        { i: 'widget-bar-1', x: 0, y: 2, w: 3, h: 3, minW: 2, minH: 2 },
        { i: 'widget-bar-2', x: 3, y: 2, w: 3, h: 3, minW: 2, minH: 2 },
        { i: 'widget-bar-3', x: 6, y: 2, w: 3, h: 3, minW: 2, minH: 2 },
        { i: 'widget-bar-4', x: 9, y: 2, w: 3, h: 3, minW: 2, minH: 2 },
        // Line Chart Row - 4 charts
        { i: 'widget-line-1', x: 0, y: 5, w: 3, h: 3, minW: 2, minH: 2 },
        { i: 'widget-line-2', x: 3, y: 5, w: 3, h: 3, minW: 2, minH: 2 },
        { i: 'widget-line-3', x: 6, y: 5, w: 3, h: 3, minW: 2, minH: 2 },
        { i: 'widget-line-4', x: 9, y: 5, w: 3, h: 3, minW: 2, minH: 2 },
        // Third Row - 4 more charts
        { i: 'widget-bar-5', x: 0, y: 8, w: 3, h: 3, minW: 2, minH: 2 },
        { i: 'widget-bar-6', x: 3, y: 8, w: 3, h: 3, minW: 2, minH: 2 },
        { i: 'widget-bar-7', x: 6, y: 8, w: 3, h: 3, minW: 2, minH: 2 },
        { i: 'widget-line-5', x: 9, y: 8, w: 3, h: 3, minW: 2, minH: 2 },
      ],
      md: [
        // KPI Row - 3 + 2 on md
        { i: 'widget-kpi-1', x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
        { i: 'widget-kpi-2', x: 2, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
        { i: 'widget-kpi-3', x: 4, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
        { i: 'widget-kpi-4', x: 0, y: 2, w: 2, h: 2, minW: 2, minH: 2 },
        { i: 'widget-kpi-5', x: 2, y: 2, w: 2, h: 2, minW: 2, minH: 2 },
        // Bar Chart Row - 2x2
        { i: 'widget-bar-1', x: 0, y: 4, w: 3, h: 4, minW: 2, minH: 3 },
        { i: 'widget-bar-2', x: 3, y: 4, w: 3, h: 4, minW: 2, minH: 3 },
        { i: 'widget-bar-3', x: 0, y: 8, w: 3, h: 4, minW: 2, minH: 3 },
        { i: 'widget-bar-4', x: 3, y: 8, w: 3, h: 4, minW: 2, minH: 3 },
        // Line Chart Row - 2x2
        { i: 'widget-line-1', x: 0, y: 12, w: 3, h: 4, minW: 2, minH: 3 },
        { i: 'widget-line-2', x: 3, y: 12, w: 3, h: 4, minW: 2, minH: 3 },
        { i: 'widget-line-3', x: 0, y: 16, w: 3, h: 4, minW: 2, minH: 3 },
        { i: 'widget-line-4', x: 3, y: 16, w: 3, h: 4, minW: 2, minH: 3 },
      ],
      sm: [
        // Single column layout for small screens
        { i: 'widget-kpi-1', x: 0, y: 0, w: 4, h: 2, minW: 2, minH: 2 },
        { i: 'widget-kpi-2', x: 0, y: 2, w: 4, h: 2, minW: 2, minH: 2 },
        { i: 'widget-kpi-3', x: 0, y: 4, w: 4, h: 2, minW: 2, minH: 2 },
        { i: 'widget-kpi-4', x: 0, y: 6, w: 4, h: 2, minW: 2, minH: 2 },
        { i: 'widget-kpi-5', x: 0, y: 8, w: 4, h: 2, minW: 2, minH: 2 },
        { i: 'widget-bar-1', x: 0, y: 10, w: 4, h: 4, minW: 2, minH: 3 },
        { i: 'widget-bar-2', x: 0, y: 14, w: 4, h: 4, minW: 2, minH: 3 },
        { i: 'widget-bar-3', x: 0, y: 18, w: 4, h: 4, minW: 2, minH: 3 },
        { i: 'widget-bar-4', x: 0, y: 22, w: 4, h: 4, minW: 2, minH: 3 },
        { i: 'widget-line-1', x: 0, y: 26, w: 4, h: 4, minW: 2, minH: 3 },
        { i: 'widget-line-2', x: 0, y: 30, w: 4, h: 4, minW: 2, minH: 3 },
        { i: 'widget-line-3', x: 0, y: 34, w: 4, h: 4, minW: 2, minH: 3 },
        { i: 'widget-line-4', x: 0, y: 38, w: 4, h: 4, minW: 2, minH: 3 },
      ],
    },
  },
  'dashboard-2': {
    dashboardId: dashboardId('dashboard-2'),
    widgets: [widgetId('widget-recruiting-bar'), widgetId('widget-recruiting-trend')],
    layouts: {
      lg: [
        { i: 'widget-recruiting-bar', x: 0, y: 0, w: 6, h: 5, minW: 3, minH: 3 },
        { i: 'widget-recruiting-trend', x: 6, y: 0, w: 6, h: 5, minW: 3, minH: 3 },
      ],
    },
  },
  'dashboard-3': {
    dashboardId: dashboardId('dashboard-3'),
    widgets: [widgetId('widget-financial-bar'), widgetId('widget-earnings-trend')],
    layouts: {
      lg: [
        { i: 'widget-financial-bar', x: 0, y: 0, w: 6, h: 5, minW: 3, minH: 3 },
        { i: 'widget-earnings-trend', x: 6, y: 0, w: 6, h: 5, minW: 3, minH: 3 },
      ],
    },
  },
};

// In-memory storage for mutations
let dashboardsDb = [...mockDashboards];
let layoutsDb = { ...mockDashboardLayouts };

export const getDashboards = () => [...dashboardsDb];
export const getDashboardById = (id: DashboardId) => dashboardsDb.find((d) => d.id === id);
export const getDashboardLayout = (id: DashboardId) => layoutsDb[id];

export const createDashboard = (data: { name: string; description?: string }): Dashboard => {
  const now = new Date().toISOString();
  const newDashboard: Dashboard = {
    id: dashboardId(`dashboard-${Date.now()}`),
    name: data.name,
    description: data.description,
    createdAt: now,
    updatedAt: now,
  };
  dashboardsDb.push(newDashboard);
  layoutsDb[newDashboard.id] = {
    dashboardId: newDashboard.id,
    widgets: [],
    layouts: { lg: [], md: [], sm: [] },
  };
  return newDashboard;
};

export const updateDashboard = (
  id: DashboardId,
  data: { name?: string; description?: string }
): Dashboard | undefined => {
  const index = dashboardsDb.findIndex((d) => d.id === id);
  if (index === -1) return undefined;

  dashboardsDb[index] = {
    ...dashboardsDb[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  return dashboardsDb[index];
};

export const updateDashboardLayout = (
  id: DashboardId,
  layouts: DashboardLayout['layouts']
): void => {
  if (layoutsDb[id]) {
    layoutsDb[id] = {
      ...layoutsDb[id],
      layouts,
    };
  }
};

export const deleteDashboard = (id: DashboardId): boolean => {
  const index = dashboardsDb.findIndex((d) => d.id === id);
  if (index === -1) return false;
  dashboardsDb.splice(index, 1);
  delete layoutsDb[id];
  return true;
};

// Reset function for testing
export const resetDashboardsDb = () => {
  dashboardsDb = [...mockDashboards];
  layoutsDb = { ...mockDashboardLayouts };
};
