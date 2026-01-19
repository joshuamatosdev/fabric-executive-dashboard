import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../lib/query-client';
import type { WidgetInstance, WidgetConfig, CreateWidgetDto } from '../../types/widget';
import type { DashboardId, WidgetId } from '../../types/common';

const API_BASE = '/api/v1';

// Mutation functions
async function createWidget(data: CreateWidgetDto): Promise<WidgetInstance> {
  const response = await fetch(`${API_BASE}/widgets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create widget');
  }
  return response.json();
}

async function updateWidget(
  id: WidgetId,
  config: Partial<WidgetConfig>
): Promise<WidgetInstance> {
  const response = await fetch(`${API_BASE}/widgets/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ config }),
  });
  if (!response.ok) {
    throw new Error('Failed to update widget');
  }
  return response.json();
}

async function deleteWidget(id: WidgetId): Promise<void> {
  const response = await fetch(`${API_BASE}/widgets/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete widget');
  }
}

// Mutation hooks
export function useCreateWidget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWidget,
    onSuccess: (widget) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.widgets.byDashboard(widget.dashboardId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboards.layout(widget.dashboardId),
      });
    },
  });
}

export function useUpdateWidget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      config,
      dashboardId,
    }: {
      id: WidgetId;
      config: Partial<WidgetConfig>;
      dashboardId: DashboardId;
    }) => updateWidget(id, config),
    onSuccess: (_, { id, dashboardId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.widgets.detail(id) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.widgets.byDashboard(dashboardId),
      });
    },
  });
}

export function useDeleteWidget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: WidgetId; dashboardId: DashboardId }) =>
      deleteWidget(id),
    onSuccess: (_, { id, dashboardId }) => {
      queryClient.removeQueries({ queryKey: queryKeys.widgets.detail(id) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.widgets.byDashboard(dashboardId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboards.layout(dashboardId),
      });
    },
  });
}
