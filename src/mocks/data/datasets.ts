import type { DatasetSummary } from '../../services/IDataClient';
import type { DatasetId } from '../../types/common';

const datasetId = (id: string) => id as DatasetId;

/**
 * Mock datasets for the discovery UI.
 * These are returned by IDataClient.getDatasets() when MSW intercepts the request.
 */
export const mockDatasets: DatasetSummary[] = [
  {
    id: datasetId('kpi-dataset'),
    name: 'Executive KPIs',
    description: 'Key performance indicators for executive dashboards',
    tables: [
      {
        name: 'recruiting',
        columns: [
          { name: 'value', dataType: 'number' },
          { name: 'previousValue', dataType: 'number' },
          { name: 'change', dataType: 'number' },
        ],
      },
      {
        name: 'retention',
        columns: [
          { name: 'value', dataType: 'number' },
          { name: 'previousValue', dataType: 'number' },
          { name: 'change', dataType: 'number' },
        ],
      },
      {
        name: 'readiness',
        columns: [
          { name: 'value', dataType: 'number' },
          { name: 'previousValue', dataType: 'number' },
          { name: 'change', dataType: 'number' },
        ],
      },
      {
        name: 'earnings',
        columns: [
          { name: 'value', dataType: 'number' },
          { name: 'previousValue', dataType: 'number' },
          { name: 'change', dataType: 'number' },
        ],
      },
      {
        name: 'expenses',
        columns: [
          { name: 'value', dataType: 'number' },
          { name: 'previousValue', dataType: 'number' },
          { name: 'change', dataType: 'number' },
        ],
      },
    ],
  },
  {
    id: datasetId('bar-chart-dataset'),
    name: 'Category Metrics',
    description: 'Bar chart data by category',
    tables: [
      {
        name: 'recruiting',
        columns: [
          { name: 'name', dataType: 'string' },
          { name: 'value', dataType: 'number' },
        ],
      },
      {
        name: 'retention',
        columns: [
          { name: 'name', dataType: 'string' },
          { name: 'value', dataType: 'number' },
        ],
      },
      {
        name: 'readiness',
        columns: [
          { name: 'name', dataType: 'string' },
          { name: 'value', dataType: 'number' },
        ],
      },
      {
        name: 'financial',
        columns: [
          { name: 'name', dataType: 'string' },
          { name: 'value', dataType: 'number' },
        ],
      },
    ],
  },
  {
    id: datasetId('trend-dataset'),
    name: 'Trend Analytics',
    description: 'Time series data with predictions',
    tables: [
      {
        name: 'recruiting',
        columns: [
          { name: 'name', dataType: 'string' },
          { name: 'actual', dataType: 'number' },
          { name: 'predicted', dataType: 'number' },
        ],
      },
      {
        name: 'earnings',
        columns: [
          { name: 'name', dataType: 'string' },
          { name: 'actual', dataType: 'number' },
          { name: 'predicted', dataType: 'number' },
        ],
      },
      {
        name: 'cloud_ga',
        columns: [
          { name: 'name', dataType: 'string' },
          { name: 'value', dataType: 'number' },
        ],
      },
      {
        name: 'compliance',
        columns: [
          { name: 'name', dataType: 'string' },
          { name: 'value', dataType: 'number' },
        ],
      },
    ],
  },
  {
    id: datasetId('composed-dataset'),
    name: 'Comparison Data',
    description: 'Data for composed and comparison charts',
    tables: [
      {
        name: 'default',
        columns: [
          { name: 'name', dataType: 'string' },
          { name: 'value', dataType: 'number' },
          { name: 'value2', dataType: 'number' },
        ],
      },
    ],
  },
];

export const getDatasets = () => [...mockDatasets];
export const getDatasetById = (id: DatasetId) => mockDatasets.find((d) => d.id === id);
