/**
 * Mock chart data for MSW handlers.
 * This data is returned by the IDataClient.executeQuery() method when MSW intercepts the requests.
 */

// KPI Data
export const MOCK_KPI_DATA = {
  recruiting: { value: 1248, previousValue: 1109, change: 12.5 },
  retention: { value: 94.2, previousValue: 96.3, change: -2.1 },
  readiness: { value: 87, previousValue: 84.9, change: 2.4 },
  earnings: { value: 4200000, previousValue: 3863.4, change: 8.7 },
  expenses: { value: 1800000, previousValue: 1821.6, change: -1.2 },
};

// Bar Chart Data
export const MOCK_BAR_DATA_BY_CATEGORY = {
  recruiting: [
    { name: 'Engineering', value: 45 },
    { name: 'Sales', value: 32 },
    { name: 'Marketing', value: 18 },
    { name: 'Product', value: 24 },
    { name: 'HR', value: 12 },
  ],
  retention: [
    { name: 'Q1', value: 92 },
    { name: 'Q2', value: 95 },
    { name: 'Q3', value: 94 },
    { name: 'Q4', value: 96 },
  ],
  readiness: [
    { name: 'Infra', value: 85 },
    { name: 'Talent', value: 92 },
    { name: 'Ops', value: 78 },
    { name: 'Fiscal', value: 88 },
  ],
  financial: [
    { name: 'North America', value: 1200 },
    { name: 'Europe', value: 800 },
    { name: 'Asia', value: 1100 },
    { name: 'LATAM', value: 450 },
  ],
};

// Trend Data with Predictions
export const MOCK_RECRUITING_TREND_DATA = [
  { name: 'Jan', actual: 400, predicted: null },
  { name: 'Feb', actual: 450, predicted: null },
  { name: 'Mar', actual: 420, predicted: null },
  { name: 'Apr', actual: 480, predicted: null },
  { name: 'May', actual: 510, predicted: null },
  { name: 'Jun', actual: 540, predicted: 540 },
  { name: 'Jul', actual: 500, predicted: 580 },
  { name: 'Aug', actual: 460, predicted: 620 },
];

export const MOCK_EARNINGS_TREND_DATA = [
  { name: 'Jan', actual: 300, predicted: null },
  { name: 'Feb', actual: 310, predicted: null },
  { name: 'Mar', actual: 305, predicted: null },
  { name: 'Apr', actual: 420, predicted: null },
  { name: 'May', actual: 540, predicted: null },
  { name: 'Jun', actual: 610, predicted: 610 },
  { name: 'Jul', actual: 450, predicted: 680 },
  { name: 'Aug', actual: 380, predicted: 750 },
];

export const MOCK_CLOUD_GA_DATA = [
  { name: 'Jan', value: 12 },
  { name: 'Feb', value: 15 },
  { name: 'Mar', value: 14 },
  { name: 'Apr', value: 22 },
  { name: 'May', value: 28 },
  { name: 'Jun', value: 35 },
  { name: 'Jul', value: 42 },
];

export const MOCK_COMPLIANCE_DATA = [
  { name: 'Jan', value: 88 },
  { name: 'Feb', value: 89 },
  { name: 'Mar', value: 87 },
  { name: 'Apr', value: 92 },
  { name: 'May', value: 94 },
  { name: 'Jun', value: 96 },
  { name: 'Jul', value: 98 },
];

// Composed Chart Data
export const MOCK_CHART_DATA = [
  { name: 'Jan', value: 400, value2: 240 },
  { name: 'Feb', value: 300, value2: 139 },
  { name: 'Mar', value: 200, value2: 980 },
  { name: 'Apr', value: 278, value2: 390 },
  { name: 'May', value: 189, value2: 480 },
  { name: 'Jun', value: 239, value2: 380 },
  { name: 'Jul', value: 349, value2: 430 },
];

// Dataset mappings for MSW handlers
export const DATASET_TO_DATA_MAP: Record<string, Record<string, unknown[]>> = {
  'kpi-dataset': {
    recruiting: [MOCK_KPI_DATA.recruiting],
    retention: [MOCK_KPI_DATA.retention],
    readiness: [MOCK_KPI_DATA.readiness],
    earnings: [MOCK_KPI_DATA.earnings],
    expenses: [MOCK_KPI_DATA.expenses],
  },
  'bar-chart-dataset': {
    recruiting: MOCK_BAR_DATA_BY_CATEGORY.recruiting,
    retention: MOCK_BAR_DATA_BY_CATEGORY.retention,
    readiness: MOCK_BAR_DATA_BY_CATEGORY.readiness,
    financial: MOCK_BAR_DATA_BY_CATEGORY.financial,
  },
  'trend-dataset': {
    recruiting: MOCK_RECRUITING_TREND_DATA,
    earnings: MOCK_EARNINGS_TREND_DATA,
    cloud_ga: MOCK_CLOUD_GA_DATA,
    compliance: MOCK_COMPLIANCE_DATA,
  },
  'composed-dataset': {
    default: MOCK_CHART_DATA,
  },
};

// Helper to get data based on dataset and table
export function getMockData(datasetId: string, table: string): unknown[] {
  const dataset = DATASET_TO_DATA_MAP[datasetId];
  if (!dataset) return [];
  return dataset[table] ?? dataset['default'] ?? [];
}
