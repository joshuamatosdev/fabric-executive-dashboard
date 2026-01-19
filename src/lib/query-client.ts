import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long data is considered fresh
      staleTime: 1000 * 60 * 5, // 5 minutes

      // Cache time: how long inactive data stays in cache
      gcTime: 1000 * 60 * 30, // 30 minutes (previously cacheTime)

      // Retry failed queries
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch behavior
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations
      retry: 0,
    },
  },
});

// Query key factory for type-safe query keys
export const queryKeys = {
  // Dashboard keys
  dashboards: {
    all: ['dashboards'] as const,
    lists: () => [...queryKeys.dashboards.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.dashboards.lists(), filters] as const,
    details: () => [...queryKeys.dashboards.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.dashboards.details(), id] as const,
    layouts: () => [...queryKeys.dashboards.all, 'layout'] as const,
    layout: (id: string) => [...queryKeys.dashboards.layouts(), id] as const,
  },

  // Widget keys
  widgets: {
    all: ['widgets'] as const,
    lists: () => [...queryKeys.widgets.all, 'list'] as const,
    list: (filters?: { dashboardId?: string }) =>
      [...queryKeys.widgets.lists(), filters] as const,
    byDashboard: (dashboardId: string) =>
      [...queryKeys.widgets.lists(), { dashboardId }] as const,
    details: () => [...queryKeys.widgets.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.widgets.details(), id] as const,
  },

  // Data client keys (for Fabric data)
  data: {
    all: ['data'] as const,
    datasets: (workspaceId: string) =>
      [...queryKeys.data.all, 'datasets', workspaceId] as const,
    query: (workspaceId: string, datasetId: string, query: string | object) =>
      [...queryKeys.data.all, 'query', workspaceId, datasetId, query] as const,
  },
} as const;
