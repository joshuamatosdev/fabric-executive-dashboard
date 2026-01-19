import { z } from 'zod';
import { dashboardIdSchema, widgetIdSchema, dateStringSchema } from './common.schema';

// Dashboard schema
export const dashboardSchema = z.object({
  id: dashboardIdSchema,
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
  thumbnail: z.string().url().optional(),
});

// Grid layout item schema
export const gridItemSchema = z.object({
  i: z.string(), // widget id
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

// Layouts for different breakpoints
export const layoutsSchema = z.object({
  lg: z.array(gridItemSchema).optional(),
  md: z.array(gridItemSchema).optional(),
  sm: z.array(gridItemSchema).optional(),
  xs: z.array(gridItemSchema).optional(),
  xxs: z.array(gridItemSchema).optional(),
});

// Dashboard layout schema
export const dashboardLayoutSchema = z.object({
  dashboardId: dashboardIdSchema,
  layouts: layoutsSchema,
  widgets: z.array(widgetIdSchema),
});

// Create/Update DTOs
export const createDashboardDtoSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export const updateDashboardDtoSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
});

// Type exports
export type DashboardSchema = z.infer<typeof dashboardSchema>;
export type GridItemSchema = z.infer<typeof gridItemSchema>;
export type LayoutsSchema = z.infer<typeof layoutsSchema>;
export type DashboardLayoutSchema = z.infer<typeof dashboardLayoutSchema>;
export type CreateDashboardDtoSchema = z.infer<typeof createDashboardDtoSchema>;
export type UpdateDashboardDtoSchema = z.infer<typeof updateDashboardDtoSchema>;

// Validation functions
export function validateDashboard(data: unknown) {
  return dashboardSchema.safeParse(data);
}

export function validateDashboardLayout(data: unknown) {
  return dashboardLayoutSchema.safeParse(data);
}

export function validateCreateDashboard(data: unknown) {
  return createDashboardDtoSchema.safeParse(data);
}

export function validateUpdateDashboard(data: unknown) {
  return updateDashboardDtoSchema.safeParse(data);
}
