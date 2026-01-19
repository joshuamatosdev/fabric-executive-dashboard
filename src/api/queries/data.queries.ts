import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../lib/query-client';
import { getDataClient } from '../../services';
import type { QueryParams, DatasetSummary } from '../../services/IDataClient';
import type { WorkspaceId } from '../../types/common';

// Query hooks for IDataClient

export function useDatasets(workspaceId: WorkspaceId | undefined) {
  return useQuery({
    queryKey: queryKeys.data.datasets(workspaceId ?? ''),
    queryFn: async (): Promise<DatasetSummary[]> => {
      const client = getDataClient();
      return client.getDatasets(workspaceId!);
    },
    enabled: !!workspaceId,
  });
}

export function useDataQuery<T = Record<string, unknown>>(
  params: QueryParams | undefined,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) {
  return useQuery({
    queryKey: queryKeys.data.query(
      params?.workspaceId ?? '',
      params?.datasetId ?? '',
      params?.query ?? ''
    ),
    queryFn: async (): Promise<T[]> => {
      const client = getDataClient();
      return client.executeQuery<T>(params!);
    },
    enabled: options?.enabled !== false && !!params?.workspaceId && !!params?.datasetId,
    refetchInterval: options?.refetchInterval,
  });
}

// Convenience hook for widget data
export function useWidgetData<T = Record<string, unknown>>(
  dataSource: {
    workspaceId: WorkspaceId;
    datasetId: string;
    query: string | object;
    refreshInterval?: number;
  } | undefined
) {
  const params: QueryParams | undefined = dataSource
    ? {
        workspaceId: dataSource.workspaceId,
        datasetId: dataSource.datasetId as any,
        query: dataSource.query,
      }
    : undefined;

  return useDataQuery<T>(params, {
    enabled: !!dataSource,
    refetchInterval: dataSource?.refreshInterval
      ? dataSource.refreshInterval * 1000
      : undefined,
  });
}
