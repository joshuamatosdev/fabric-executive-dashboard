import type { DashboardId, WidgetId, DatasetId, WorkspaceId } from './common';

// Widget types available in the system
export type WidgetType =
  | 'kpi'
  | 'bar-chart'
  | 'line-chart'
  | 'area-chart'
  | 'composed-chart'
  | 'vega-chart';

// Base widget configuration shared by all widgets
export interface BaseWidgetConfig {
  title: string;
  subtitle?: string;
  dataSource?: DataSourceConfig;
}

// Data source configuration for connecting to Fabric
export interface DataSourceConfig {
  workspaceId: WorkspaceId;
  datasetId: DatasetId;
  query: string | QueryObject;
  refreshInterval?: number; // in seconds
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

// KPI Widget Configuration
export interface KPIWidgetConfig extends BaseWidgetConfig {
  type: 'kpi';
  valueKey: string;
  previousValueKey?: string;
  changeKey?: string;
  format?: 'number' | 'currency' | 'percent' | 'score';
  icon?: string;
  color?: string;
  trendLabel?: string;
}

// Chart axis configuration
export interface AxisConfig {
  dataKey: string;
  label?: string;
  hide?: boolean;
  domain?: [number | 'auto', number | 'auto'];
}

// Bar Chart Configuration
export interface BarChartWidgetConfig extends BaseWidgetConfig {
  type: 'bar-chart';
  xAxis: AxisConfig;
  yAxis: AxisConfig;
  orientation?: 'vertical' | 'horizontal';
  stacked?: boolean;
  colors?: string[];
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  showReferenceLine?: boolean;
  referenceLineValue?: number | 'average';
}

// Line Chart Configuration
export interface LineChartWidgetConfig extends BaseWidgetConfig {
  type: 'line-chart';
  xAxis: AxisConfig;
  series: SeriesConfig[];
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
}

export interface SeriesConfig {
  dataKey: string;
  name?: string;
  color?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  dotRadius?: number;
  type?: 'monotone' | 'linear' | 'step' | 'stepBefore' | 'stepAfter';
}

// Area Chart Configuration
export interface AreaChartWidgetConfig extends BaseWidgetConfig {
  type: 'area-chart';
  xAxis: AxisConfig;
  series: AreaSeriesConfig[];
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
}

export interface AreaSeriesConfig extends SeriesConfig {
  fillOpacity?: number;
  gradientId?: string;
}

// Composed Chart Configuration
export interface ComposedChartWidgetConfig extends BaseWidgetConfig {
  type: 'composed-chart';
  xAxis: AxisConfig;
  yAxis: AxisConfig;
  elements: ChartElement[];
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
}

export interface ChartElement {
  type: 'bar' | 'line' | 'area';
  dataKey: string;
  name?: string;
  color?: string;
  stackId?: string;
  lineType?: SeriesConfig['type'];
}

// Vega Chart Configuration
export interface VegaChartWidgetConfig extends BaseWidgetConfig {
  type: 'vega-chart';
  spec: object; // Vega-Lite specification
}

// Union type for all widget configurations
export type WidgetConfig =
  | KPIWidgetConfig
  | BarChartWidgetConfig
  | LineChartWidgetConfig
  | AreaChartWidgetConfig
  | ComposedChartWidgetConfig
  | VegaChartWidgetConfig;

// Widget instance with position in the grid
export interface WidgetInstance {
  id: WidgetId;
  dashboardId: DashboardId;
  config: WidgetConfig;
  createdAt: string;
  updatedAt: string;
}

// Create/Update DTOs
export interface CreateWidgetDto {
  dashboardId: DashboardId;
  config: WidgetConfig;
  layout: GridItemLayout;
}

export interface UpdateWidgetDto {
  config?: Partial<WidgetConfig>;
}

// Grid layout for a single widget
export interface GridItemLayout {
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  static?: boolean;
}
