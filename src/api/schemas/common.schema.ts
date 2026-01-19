import { z } from 'zod';

// ID schemas
export const dashboardIdSchema = z.string().min(1).brand('DashboardId');
export const widgetIdSchema = z.string().min(1).brand('WidgetId');
export const workspaceIdSchema = z.string().min(1).brand('WorkspaceId');
export const datasetIdSchema = z.string().min(1).brand('DatasetId');

// Common date schema
export const dateStringSchema = z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/));
