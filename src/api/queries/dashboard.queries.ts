import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../lib/query-client';
import type { Dashboard, DashboardLayout } from '../../types/dashboard';
import type { DashboardId } from '../../types/common';

const API_BASE = '/api/v1';

// Fetch functions
async function fetchDashboards(): Promise<Dashboard[]> {
  const response = await fetch(`${API_BASE}/dashboards`);
  if (!response.ok) {
    throw new Error('Failed to fetch dashboards');
  }
  const data = await response.json();
  return data.dashboards;
}

async function fetchDashboard(id: DashboardId): Promise<Dashboard> {
  const response = await fetch(`${API_BASE}/dashboards/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard');
  }
  return response.json();
}

async function fetchDashboardLayout(id: DashboardId): Promise<DashboardLayout> {
  const response = await fetch(`${API_BASE}/dashboards/${id}/layout`);
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard layout');
  }
  return response.json();
}

// Query hooks
export function useDashboards() {
  return useQuery({
    queryKey: queryKeys.dashboards.lists(),
    queryFn: fetchDashboards,
  });
}

export function useDashboard(id: DashboardId | undefined) {
  return useQuery({
    queryKey: queryKeys.dashboards.detail(id ?? ''),
    queryFn: () => fetchDashboard(id!),
    enabled: !!id,
  });
}

export function useDashboardLayout(id: DashboardId | undefined) {
  return useQuery({
    queryKey: queryKeys.dashboards.layout(id ?? ''),
    queryFn: () => fetchDashboardLayout(id!),
    enabled: !!id,
  });
}
