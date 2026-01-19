import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../lib/query-client';
import type { WidgetInstance } from '../../types/widget';
import type { DashboardId, WidgetId } from '../../types/common';

const API_BASE = '/api/v1';

// Fetch functions
async function fetchWidgets(dashboardId?: DashboardId): Promise<WidgetInstance[]> {
  const url = dashboardId
    ? `${API_BASE}/dashboards/${dashboardId}/widgets`
    : `${API_BASE}/widgets`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch widgets');
  }
  const data = await response.json();
  return data.widgets;
}

async function fetchWidget(id: WidgetId): Promise<WidgetInstance> {
  const response = await fetch(`${API_BASE}/widgets/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch widget');
  }
  return response.json();
}

// Query hooks
export function useWidgets(dashboardId?: DashboardId) {
  return useQuery({
    queryKey: dashboardId
      ? queryKeys.widgets.byDashboard(dashboardId)
      : queryKeys.widgets.lists(),
    queryFn: () => fetchWidgets(dashboardId),
  });
}

export function useWidgetsByDashboard(dashboardId: DashboardId | undefined) {
  return useQuery({
    queryKey: queryKeys.widgets.byDashboard(dashboardId ?? ''),
    queryFn: () => fetchWidgets(dashboardId!),
    enabled: !!dashboardId,
  });
}

export function useWidget(id: WidgetId | undefined) {
  return useQuery({
    queryKey: queryKeys.widgets.detail(id ?? ''),
    queryFn: () => fetchWidget(id!),
    enabled: !!id,
  });
}
