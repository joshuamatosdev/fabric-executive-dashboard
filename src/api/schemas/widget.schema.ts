import { z } from 'zod';
import {
  widgetIdSchema,
  dashboardIdSchema,
  workspaceIdSchema,
  datasetIdSchema,
  dateStringSchema,
} from './common.schema';

// Chart data validation
export const chartDataPointSchema = z.object({
  name: z.string(),
  value: z.number(),
  value2: z.number().optional(),
});

export const chartDataSchema = z.array(chartDataPointSchema);

// KPI data validation
export const kpiDataSchema = z.object({
  value: z.number(),
  previousValue: z.number().optional(),
  change: z.number().optional(),
});

// Query filter schema
export const queryFilterSchema = z.object({
  column: z.string(),
  operator: z.enum(['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'in', 'contains']),
  value: z.unknown(),
});

// Order by clause schema
export const orderByClauseSchema = z.object({
  column: z.string(),
  direction: z.enum(['asc', 'desc']),
});

// Query object schema
export const queryObjectSchema = z.object({
  table: z.string(),
  columns: z.array(z.string()),
  filters: z.array(queryFilterSchema).optional(),
  orderBy: z.array(orderByClauseSchema).optional(),
  limit: z.number().positive().optional(),
});

// Data source configuration schema
export const dataSourceConfigSchema = z.object({
  workspaceId: workspaceIdSchema,
  datasetId: datasetIdSchema,
  query: z.union([z.string(), queryObjectSchema]),
  refreshInterval: z.number().positive().optional(),
});

// Axis configuration schema
export const axisConfigSchema = z.object({
  dataKey: z.string(),
  label: z.string().optional(),
  hide: z.boolean().optional(),
  domain: z
    .tuple([z.union([z.number(), z.literal('auto')]), z.union([z.number(), z.literal('auto')])])
    .optional(),
});

// Series configuration schema
export const seriesConfigSchema = z.object({
  dataKey: z.string(),
  name: z.string().optional(),
  color: z.string().optional(),
  strokeWidth: z.number().optional(),
  strokeDasharray: z.string().optional(),
  dotRadius: z.number().optional(),
  type: z.enum(['monotone', 'linear', 'step', 'stepBefore', 'stepAfter']).optional(),
});

// Area series configuration schema
export const areaSeriesConfigSchema = seriesConfigSchema.extend({
  fillOpacity: z.number().min(0).max(1).optional(),
  gradientId: z.string().optional(),
});

// Chart element schema
export const chartElementSchema = z.object({
  type: z.enum(['bar', 'line', 'area']),
  dataKey: z.string(),
  name: z.string().optional(),
  color: z.string().optional(),
  stackId: z.string().optional(),
  lineType: z.enum(['monotone', 'linear', 'step', 'stepBefore', 'stepAfter']).optional(),
});

// Base widget configuration schema
const baseWidgetConfigSchema = z.object({
  title: z.string().min(1).max(100),
  subtitle: z.string().max(200).optional(),
  dataSource: dataSourceConfigSchema.optional(),
});

// KPI widget configuration schema
export const kpiWidgetConfigSchema = baseWidgetConfigSchema.extend({
  type: z.literal('kpi'),
  valueKey: z.string(),
  previousValueKey: z.string().optional(),
  changeKey: z.string().optional(),
  format: z.enum(['number', 'currency', 'percent']).optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  trendLabel: z.string().optional(),
});

// Bar chart widget configuration schema
export const barChartWidgetConfigSchema = baseWidgetConfigSchema.extend({
  type: z.literal('bar-chart'),
  xAxis: axisConfigSchema,
  yAxis: axisConfigSchema,
  orientation: z.enum(['vertical', 'horizontal']).optional().default('vertical'),
  stacked: z.boolean().optional().default(false),
  colors: z.array(z.string()).optional().default(['#0078d4']),
  showGrid: z.boolean().optional().default(true),
  showTooltip: z.boolean().optional().default(true),
  showLegend: z.boolean().optional().default(false),
  showReferenceLine: z.boolean().optional().default(false),
  referenceLineValue: z.union([z.number(), z.literal('average')]).optional(),
});

// Line chart widget configuration schema
export const lineChartWidgetConfigSchema = baseWidgetConfigSchema.extend({
  type: z.literal('line-chart'),
  xAxis: axisConfigSchema,
  series: z.array(seriesConfigSchema),
  showGrid: z.boolean().optional().default(true),
  showTooltip: z.boolean().optional().default(true),
  showLegend: z.boolean().optional().default(false),
});

// Area chart widget configuration schema
export const areaChartWidgetConfigSchema = baseWidgetConfigSchema.extend({
  type: z.literal('area-chart'),
  xAxis: axisConfigSchema,
  series: z.array(areaSeriesConfigSchema),
  showGrid: z.boolean().optional().default(true),
  showTooltip: z.boolean().optional().default(true),
  showLegend: z.boolean().optional().default(false),
});

// Composed chart widget configuration schema
export const composedChartWidgetConfigSchema = baseWidgetConfigSchema.extend({
  type: z.literal('composed-chart'),
  xAxis: axisConfigSchema,
  yAxis: axisConfigSchema,
  elements: z.array(chartElementSchema),
  showGrid: z.boolean().optional().default(true),
  showTooltip: z.boolean().optional().default(true),
  showLegend: z.boolean().optional().default(false),
});

// Vega chart widget configuration schema
export const vegaChartWidgetConfigSchema = baseWidgetConfigSchema.extend({
  type: z.literal('vega-chart'),
  spec: z.object({}).passthrough(), // Allow any Vega-Lite spec
});

// Union of all widget configurations
export const widgetConfigSchema = z.discriminatedUnion('type', [
  kpiWidgetConfigSchema,
  barChartWidgetConfigSchema,
  lineChartWidgetConfigSchema,
  areaChartWidgetConfigSchema,
  composedChartWidgetConfigSchema,
  vegaChartWidgetConfigSchema,
]);

// Widget instance schema
export const widgetInstanceSchema = z.object({
  id: widgetIdSchema,
  dashboardId: dashboardIdSchema,
  config: widgetConfigSchema,
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
});

// Grid item layout schema
export const gridItemLayoutSchema = z.object({
  x: z.number().min(0),
  y: z.number().min(0),
  w: z.number().min(1),
  h: z.number().min(1),
  minW: z.number().min(1).optional(),
  minH: z.number().min(1).optional(),
  maxW: z.number().optional(),
  maxH: z.number().optional(),
  static: z.boolean().optional(),
});

// Create/Update DTOs
export const createWidgetDtoSchema = z.object({
  dashboardId: dashboardIdSchema,
  config: widgetConfigSchema,
  layout: gridItemLayoutSchema,
});

export const updateWidgetDtoSchema = z.object({
  config: widgetConfigSchema.partial().optional(),
});

// Type exports
export type ChartDataPointSchema = z.infer<typeof chartDataPointSchema>;
export type ChartDataSchema = z.infer<typeof chartDataSchema>;
export type KPIDataSchema = z.infer<typeof kpiDataSchema>;
export type WidgetConfigSchema = z.infer<typeof widgetConfigSchema>;
export type WidgetInstanceSchema = z.infer<typeof widgetInstanceSchema>;
export type CreateWidgetDtoSchema = z.infer<typeof createWidgetDtoSchema>;
export type UpdateWidgetDtoSchema = z.infer<typeof updateWidgetDtoSchema>;

// Validation functions
export function validateChartData(data: unknown) {
  return chartDataSchema.safeParse(data);
}

export function validateKPIData(data: unknown) {
  return kpiDataSchema.safeParse(data);
}

export function validateWidgetConfig(data: unknown) {
  return widgetConfigSchema.safeParse(data);
}

export function validateWidgetInstance(data: unknown) {
  return widgetInstanceSchema.safeParse(data);
}

export function validateCreateWidget(data: unknown) {
  return createWidgetDtoSchema.safeParse(data);
}

export function validateUpdateWidget(data: unknown) {
  return updateWidgetDtoSchema.safeParse(data);
}
