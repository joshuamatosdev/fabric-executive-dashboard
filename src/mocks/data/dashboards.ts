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
        { i: 'widget-kpi-1', x: 0, y: 0, w: 2, h: 3, minW: 2, minH: 2 },
        { i: 'widget-kpi-2', x: 2, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
        { i: 'widget-kpi-3', x: 5, y: 0, w: 2, h: 3, minW: 2, minH: 2 },
        { i: 'widget-kpi-4', x: 7, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
        { i: 'widget-kpi-5', x: 10, y: 0, w: 2, h: 3, minW: 2, minH: 2 },
        // Bar Chart Row 1 - 4 charts (taller)
        { i: 'widget-bar-1', x: 0, y: 3, w: 3, h: 4, minW: 2, minH: 3 },
        { i: 'widget-bar-2', x: 3, y: 3, w: 3, h: 4, minW: 2, minH: 3 },
        { i: 'widget-bar-3', x: 6, y: 3, w: 3, h: 4, minW: 2, minH: 3 },
        { i: 'widget-bar-4', x: 9, y: 3, w: 3, h: 4, minW: 2, minH: 3 },
        // Line Chart Row - 4 charts (taller)
        { i: 'widget-line-1', x: 0, y: 7, w: 3, h: 4, minW: 2, minH: 3 },
        { i: 'widget-line-2', x: 3, y: 7, w: 3, h: 4, minW: 2, minH: 3 },
        { i: 'widget-line-3', x: 6, y: 7, w: 3, h: 4, minW: 2, minH: 3 },
        { i: 'widget-line-4', x: 9, y: 7, w: 3, h: 4, minW: 2, minH: 3 },
        // Third Row - 4 more charts (taller)
        { i: 'widget-bar-5', x: 0, y: 11, w: 3, h: 4, minW: 2, minH: 3 },
        { i: 'widget-bar-6', x: 3, y: 11, w: 3, h: 4, minW: 2, minH: 3 },
        { i: 'widget-bar-7', x: 6, y: 11, w: 3, h: 4, minW: 2, minH: 3 },
        { i: 'widget-line-5', x: 9, y: 11, w: 3, h: 4, minW: 2, minH: 3 },
      ],
      md: [
        // KPI Row - 5 cards across on md (10 cols)
        { i: 'widget-kpi-1', x: 0, y: 0, w: 2, h: 3, minW: 2, minH: 2 },
        { i: 'widget-kpi-2', x: 2, y: 0, w: 2, h: 3, minW: 2, minH: 2 },
        { i: 'widget-kpi-3', x: 4, y: 0, w: 2, h: 3, minW: 2, minH: 2 },
        { i: 'widget-kpi-4', x: 6, y: 0, w: 2, h: 3, minW: 2, minH: 2 },
        { i: 'widget-kpi-5', x: 8, y: 0, w: 2, h: 3, minW: 2, minH: 2 },
        // Bar Chart Row - 2x2 (taller)
        { i: 'widget-bar-1', x: 0, y: 3, w: 5, h: 4, minW: 2, minH: 3 },
        { i: 'widget-bar-2', x: 5, y: 3, w: 5, h: 4, minW: 2, minH: 3 },
        { i: 'widget-bar-3', x: 0, y: 7, w: 5, h: 4, minW: 2, minH: 3 },
        { i: 'widget-bar-4', x: 5, y: 7, w: 5, h: 4, minW: 2, minH: 3 },
        // Line Chart Row - 2x2 (taller)
        { i: 'widget-line-1', x: 0, y: 11, w: 5, h: 4, minW: 2, minH: 3 },
        { i: 'widget-line-2', x: 5, y: 11, w: 5, h: 4, minW: 2, minH: 3 },
        { i: 'widget-line-3', x: 0, y: 15, w: 5, h: 4, minW: 2, minH: 3 },
        { i: 'widget-line-4', x: 5, y: 15, w: 5, h: 4, minW: 2, minH: 3 },
        // Third Row - 2x2 (taller)
        { i: 'widget-bar-5', x: 0, y: 19, w: 5, h: 4, minW: 2, minH: 3 },
        { i: 'widget-bar-6', x: 5, y: 19, w: 5, h: 4, minW: 2, minH: 3 },
        { i: 'widget-bar-7', x: 0, y: 23, w: 5, h: 4, minW: 2, minH: 3 },
        { i: 'widget-line-5', x: 5, y: 23, w: 5, h: 4, minW: 2, minH: 3 },
      ],
      sm: [
        // KPI Row - 3 + 2 on sm (6 cols)
        { i: 'widget-kpi-1', x: 0, y: 0, w: 2, h: 3, minW: 2, minH: 2 },
        { i: 'widget-kpi-2', x: 2, y: 0, w: 2, h: 3, minW: 2, minH: 2 },
        { i: 'widget-kpi-3', x: 4, y: 0, w: 2, h: 3, minW: 2, minH: 2 },
        { i: 'widget-kpi-4', x: 0, y: 3, w: 3, h: 3, minW: 2, minH: 2 },
        { i: 'widget-kpi-5', x: 3, y: 3, w: 3, h: 3, minW: 2, minH: 2 },
        // Charts - 2 per row
        { i: 'widget-bar-1', x: 0, y: 6, w: 3, h: 3, minW: 2, minH: 2 },
        { i: 'widget-bar-2', x: 3, y: 6, w: 3, h: 3, minW: 2, minH: 2 },
        { i: 'widget-bar-3', x: 0, y: 9, w: 3, h: 3, minW: 2, minH: 2 },
        { i: 'widget-bar-4', x: 3, y: 9, w: 3, h: 3, minW: 2, minH: 2 },
        { i: 'widget-line-1', x: 0, y: 12, w: 3, h: 3, minW: 2, minH: 2 },
        { i: 'widget-line-2', x: 3, y: 12, w: 3, h: 3, minW: 2, minH: 2 },
        { i: 'widget-line-3', x: 0, y: 15, w: 3, h: 3, minW: 2, minH: 2 },
        { i: 'widget-line-4', x: 3, y: 15, w: 3, h: 3, minW: 2, minH: 2 },
        { i: 'widget-bar-5', x: 0, y: 18, w: 3, h: 3, minW: 2, minH: 2 },
        { i: 'widget-bar-6', x: 3, y: 18, w: 3, h: 3, minW: 2, minH: 2 },
        { i: 'widget-bar-7', x: 0, y: 21, w: 3, h: 3, minW: 2, minH: 2 },
        { i: 'widget-line-5', x: 3, y: 21, w: 3, h: 3, minW: 2, minH: 2 },
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
