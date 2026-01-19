import type {
  IDataClient,
  DataClientConfig,
  QueryParams,
  DatasetSummary,
} from './IDataClient';
import type { WorkspaceId } from '../types/common';

const DEFAULT_BASE_URL = 'https://api.fabric.microsoft.com/v1';

/**
 * HTTP-based data client that makes fetch calls to the Fabric API.
 * In development, MSW intercepts these calls and returns mock data.
 * In production, this connects to the real Fabric API.
 */
export class HttpDataClient implements IDataClient {
  private baseUrl: string;
  private getAccessToken?: () => Promise<string>;

  constructor(config: DataClientConfig = {}) {
    this.baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
    this.getAccessToken = config.getAccessToken;
  }

  async getDatasets(workspaceId: WorkspaceId): Promise<DatasetSummary[]> {
    const url = `${this.baseUrl}/workspaces/${workspaceId}/datasets`;
    const response = await this.fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch datasets: ${response.statusText}`);
    }

    const data = await response.json();
    return data.datasets ?? data;
  }

  async executeQuery<T = Record<string, unknown>>(params: QueryParams): Promise<T[]> {
    const { workspaceId, datasetId, query } = params;
    const url = `${this.baseUrl}/workspaces/${workspaceId}/datasets/${datasetId}/executeQueries`;

    const body = {
      queries: [
        {
          query: typeof query === 'string' ? query : JSON.stringify(query),
        },
      ],
    };

    const response = await this.fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Query execution failed: ${response.statusText}`);
    }

    const data = await response.json();
    return this.transformResponse<T>(data);
  }

  private async fetch(url: string, options: RequestInit = {}): Promise<Response> {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    // Add auth header if we have a token getter (production mode)
    if (this.getAccessToken) {
      const token = await this.getAccessToken();
      headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, {
      ...options,
      headers,
    });
  }

  /**
   * Transform Fabric's complex response into simple rows for charts.
   * Fabric often returns data in a nested "results[0].tables[0].rows" format.
   */
  private transformResponse<T>(raw: unknown): T[] {
    // Handle the standard Fabric response format
    if (
      raw &&
      typeof raw === 'object' &&
      'results' in raw &&
      Array.isArray((raw as { results: unknown[] }).results)
    ) {
      const results = (raw as { results: { tables?: { rows?: T[] }[] }[] }).results;
      if (results[0]?.tables?.[0]?.rows) {
        return results[0].tables[0].rows;
      }
    }

    // Handle direct array response (MSW mock format)
    if (Array.isArray(raw)) {
      return raw as T[];
    }

    // Handle { rows: [...] } format
    if (raw && typeof raw === 'object' && 'rows' in raw) {
      return (raw as { rows: T[] }).rows;
    }

    // Fallback: wrap single object in array
    if (raw && typeof raw === 'object') {
      return [raw as T];
    }

    return [];
  }
}
