import type { WorkspaceId, DatasetId } from '../types/common';

/**
 * Query parameters for executing data queries against Fabric or mock endpoints
 */
export interface QueryParams {
  workspaceId: WorkspaceId;
  datasetId: DatasetId;
  /**
   * Flexible payload: could be a DAX string, or a JSON object describing filters
   */
  query: string | QueryObject;
}

export interface QueryObject {
  table: string;
  columns: string[];
  filters?: QueryFilter[];
  orderBy?: OrderByClause[];
  limit?: number;
}

export interface QueryFilter {
  column: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains';
  value: unknown;
}

export interface OrderByClause {
  column: string;
  direction: 'asc' | 'desc';
}

/**
 * Summary information about a dataset for the discovery UI
 */
export interface DatasetSummary {
  id: DatasetId;
  name: string;
  description?: string;
  tables?: TableSummary[];
}

export interface TableSummary {
  name: string;
  columns: ColumnInfo[];
}

export interface ColumnInfo {
  name: string;
  dataType: 'string' | 'number' | 'boolean' | 'datetime';
}

/**
 * The main data client interface.
 * - MSW mock implementation intercepts HTTP calls in development
 * - FabricDataClient implementation connects to real Fabric in production
 */
export interface IDataClient {
  /**
   * Discovery: List available datasets in a workspace.
   * Used by the "Edit Mode" sidebar to let users pick a dataset.
   */
  getDatasets(workspaceId: WorkspaceId): Promise<DatasetSummary[]>;

  /**
   * Execution: Query data from a dataset.
   * Used by charts and widgets to get actual numbers.
   */
  executeQuery<T = Record<string, unknown>>(params: QueryParams): Promise<T[]>;
}

/**
 * Configuration for the data client
 */
export interface DataClientConfig {
  /**
   * Base URL for the Fabric API
   * Default: https://api.fabric.microsoft.com/v1
   */
  baseUrl?: string;

  /**
   * Function to get the auth token for Fabric API requests
   * Only needed for the Fabric implementation
   */
  getAccessToken?: () => Promise<string>;
}
