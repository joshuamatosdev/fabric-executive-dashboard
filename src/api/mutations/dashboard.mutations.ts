import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../lib/query-client';
import type { Dashboard, CreateDashboardDto, UpdateDashboardDto } from '../../types/dashboard';
import type { DashboardId } from '../../types/common';
import type { Layouts } from 'react-grid-layout';

const API_BASE = '/api/v1';

// Mutation functions
async function createDashboard(data: CreateDashboardDto): Promise<Dashboard> {
  const response = await fetch(`${API_BASE}/dashboards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create dashboard');
  }
  return response.json();
}

async function updateDashboard(
  id: DashboardId,
  data: UpdateDashboardDto
): Promise<Dashboard> {
  const response = await fetch(`${API_BASE}/dashboards/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update dashboard');
  }
  return response.json();
}

async function updateDashboardLayout(
  id: DashboardId,
  layouts: Layouts
): Promise<void> {
  const response = await fetch(`${API_BASE}/dashboards/${id}/layout`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ layouts }),
  });
  if (!response.ok) {
    throw new Error('Failed to update dashboard layout');
  }
}

async function deleteDashboard(id: DashboardId): Promise<void> {
  const response = await fetch(`${API_BASE}/dashboards/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete dashboard');
  }
}

// Mutation hooks
export function useCreateDashboard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDashboard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboards.lists() });
    },
  });
}

export function useUpdateDashboard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: DashboardId; data: UpdateDashboardDto }) =>
      updateDashboard(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboards.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboards.lists() });
    },
  });
}

export function useUpdateDashboardLayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, layouts }: { id: DashboardId; layouts: Layouts }) =>
      updateDashboardLayout(id, layouts),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboards.layout(id) });
    },
  });
}

export function useDeleteDashboard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDashboard,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboards.lists() });
      queryClient.removeQueries({ queryKey: queryKeys.dashboards.detail(id) });
      queryClient.removeQueries({ queryKey: queryKeys.dashboards.layout(id) });
    },
  });
}
