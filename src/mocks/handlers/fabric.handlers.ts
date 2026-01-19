import { http, HttpResponse, delay } from 'msw';
import { getDatasets, getDatasetById } from '../data/datasets';
import { getMockData } from '../data/chart-data';
import type { DatasetId } from '../../types/common';

const datasetId = (id: string) => id as DatasetId;

// Fabric API base URL
const FABRIC_API_BASE = 'https://api.fabric.microsoft.com/v1';

export const fabricHandlers = [
  // List datasets in a workspace
  http.get(`${FABRIC_API_BASE}/workspaces/:workspaceId/datasets`, async () => {
    await delay(100);
    const datasets = getDatasets();
    return HttpResponse.json({ datasets });
  }),

  // Get dataset details
  http.get(
    `${FABRIC_API_BASE}/workspaces/:workspaceId/datasets/:datasetId`,
    async ({ params }) => {
      await delay(50);
      const { datasetId: id } = params;
      const dataset = getDatasetById(datasetId(id as string));

      if (!dataset) {
        return HttpResponse.json(
          { error: { code: 'DatasetNotFound', message: 'Dataset not found' } },
          { status: 404 }
        );
      }

      return HttpResponse.json(dataset);
    }
  ),

  // Execute query against a dataset
  http.post(
    `${FABRIC_API_BASE}/workspaces/:workspaceId/datasets/:datasetId/executeQueries`,
    async ({ params, request }) => {
      await delay(150);
      const { datasetId: id } = params;
      const body = (await request.json()) as {
        queries: Array<{ query: string }>;
      };

      // Parse the query to determine what data to return
      const queryString = body.queries?.[0]?.query ?? '';
      let tableName = 'default';

      // Try to parse as JSON query object
      try {
        const queryObj = JSON.parse(queryString);
        if (queryObj.table) {
          tableName = queryObj.table;
        }
      } catch {
        // If not JSON, check if it's a DAX-like query mentioning a table
        const tableMatch = queryString.match(/FROM\s+['"]?(\w+)['"]?/i);
        if (tableMatch) {
          tableName = tableMatch[1];
        } else if (queryString.includes('recruiting')) {
          tableName = 'recruiting';
        } else if (queryString.includes('retention')) {
          tableName = 'retention';
        } else if (queryString.includes('readiness')) {
          tableName = 'readiness';
        } else if (queryString.includes('earnings')) {
          tableName = 'earnings';
        } else if (queryString.includes('expenses')) {
          tableName = 'expenses';
        } else if (queryString.includes('financial')) {
          tableName = 'financial';
        } else if (queryString.includes('cloud_ga')) {
          tableName = 'cloud_ga';
        } else if (queryString.includes('compliance')) {
          tableName = 'compliance';
        }
      }

      const rows = getMockData(id as string, tableName);

      // Return data in Fabric's nested response format
      return HttpResponse.json({
        results: [
          {
            tables: [
              {
                rows,
              },
            ],
          },
        ],
      });
    }
  ),

  // Alternative simpler query endpoint (for convenience)
  http.post(
    `${FABRIC_API_BASE}/workspaces/:workspaceId/datasets/:datasetId/query`,
    async ({ params, request }) => {
      await delay(100);
      const { datasetId: id } = params;
      const body = (await request.json()) as {
        query: string | { table: string; columns?: string[]; filters?: unknown[] };
      };

      let tableName = 'default';

      if (typeof body.query === 'object' && body.query.table) {
        tableName = body.query.table;
      } else if (typeof body.query === 'string') {
        // Simple string query - try to extract table name
        const tableMatch = body.query.match(/FROM\s+['"]?(\w+)['"]?/i);
        if (tableMatch) {
          tableName = tableMatch[1];
        }
      }

      const rows = getMockData(id as string, tableName);

      return HttpResponse.json({ rows });
    }
  ),
];
