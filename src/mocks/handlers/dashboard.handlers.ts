import { http, HttpResponse, delay } from 'msw';
import {
  getDashboards,
  getDashboardById,
  getDashboardLayout,
  createDashboard,
  updateDashboard,
  updateDashboardLayout,
  deleteDashboard,
} from '../data/dashboards';
import type { DashboardId } from '../../types/common';

const dashboardId = (id: string) => id as DashboardId;

const API_BASE = '/api/v1';

export const dashboardHandlers = [
  // List all dashboards
  http.get(`${API_BASE}/dashboards`, async () => {
    await delay(100);
    const dashboards = getDashboards();
    return HttpResponse.json({ dashboards });
  }),

  // Get single dashboard
  http.get(`${API_BASE}/dashboards/:id`, async ({ params }) => {
    await delay(50);
    const { id } = params;
    const dashboard = getDashboardById(dashboardId(id as string));

    if (!dashboard) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(dashboard);
  }),

  // Get dashboard layout
  http.get(`${API_BASE}/dashboards/:id/layout`, async ({ params }) => {
    await delay(50);
    const { id } = params;
    const layout = getDashboardLayout(dashboardId(id as string));

    if (!layout) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(layout);
  }),

  // Create dashboard
  http.post(`${API_BASE}/dashboards`, async ({ request }) => {
    await delay(100);
    const body = (await request.json()) as { name: string; description?: string };
    const dashboard = createDashboard(body);
    return HttpResponse.json(dashboard, { status: 201 });
  }),

  // Update dashboard
  http.patch(`${API_BASE}/dashboards/:id`, async ({ params, request }) => {
    await delay(100);
    const { id } = params;
    const body = (await request.json()) as { name?: string; description?: string };
    const dashboard = updateDashboard(dashboardId(id as string), body);

    if (!dashboard) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(dashboard);
  }),

  // Update dashboard layout
  http.put(`${API_BASE}/dashboards/:id/layout`, async ({ params, request }) => {
    await delay(50);
    const { id } = params;
    const body = (await request.json()) as { layouts: Record<string, unknown[]> };
    updateDashboardLayout(dashboardId(id as string), body.layouts);
    return new HttpResponse(null, { status: 204 });
  }),

  // Delete dashboard
  http.delete(`${API_BASE}/dashboards/:id`, async ({ params }) => {
    await delay(100);
    const { id } = params;
    const deleted = deleteDashboard(dashboardId(id as string));

    if (!deleted) {
      return new HttpResponse(null, { status: 404 });
    }

    return new HttpResponse(null, { status: 204 });
  }),
];
