import { http, HttpResponse, delay } from 'msw';
import {
  getWidgets,
  getWidgetById,
  getWidgetsByDashboard,
  createWidget,
  updateWidget,
  deleteWidget,
} from '../data/widgets';
import type { DashboardId, WidgetId } from '../../types/common';
import type { WidgetConfig } from '../../types/widget';

const dashboardId = (id: string) => id as DashboardId;
const widgetId = (id: string) => id as WidgetId;

const API_BASE = '/api/v1';

export const widgetHandlers = [
  // List all widgets
  http.get(`${API_BASE}/widgets`, async ({ request }) => {
    await delay(100);
    const url = new URL(request.url);
    const dashId = url.searchParams.get('dashboardId');

    const widgets = dashId
      ? getWidgetsByDashboard(dashboardId(dashId))
      : getWidgets();

    return HttpResponse.json({ widgets });
  }),

  // Get widgets for a dashboard
  http.get(`${API_BASE}/dashboards/:dashboardId/widgets`, async ({ params }) => {
    await delay(100);
    const { dashboardId: id } = params;
    const widgets = getWidgetsByDashboard(dashboardId(id as string));
    return HttpResponse.json({ widgets });
  }),

  // Get single widget
  http.get(`${API_BASE}/widgets/:id`, async ({ params }) => {
    await delay(50);
    const { id } = params;
    const widget = getWidgetById(widgetId(id as string));

    if (!widget) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(widget);
  }),

  // Create widget
  http.post(`${API_BASE}/widgets`, async ({ request }) => {
    await delay(100);
    const body = (await request.json()) as {
      dashboardId: string;
      config: WidgetConfig;
    };
    const widget = createWidget(dashboardId(body.dashboardId), body.config);
    return HttpResponse.json(widget, { status: 201 });
  }),

  // Update widget
  http.patch(`${API_BASE}/widgets/:id`, async ({ params, request }) => {
    await delay(100);
    const { id } = params;
    const body = (await request.json()) as { config: Partial<WidgetConfig> };
    const widget = updateWidget(widgetId(id as string), body.config);

    if (!widget) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(widget);
  }),

  // Delete widget
  http.delete(`${API_BASE}/widgets/:id`, async ({ params }) => {
    await delay(100);
    const { id } = params;
    const deleted = deleteWidget(widgetId(id as string));

    if (!deleted) {
      return new HttpResponse(null, { status: 404 });
    }

    return new HttpResponse(null, { status: 204 });
  }),
];
