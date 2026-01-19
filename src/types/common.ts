// Branded types for type-safe IDs
declare const brand: unique symbol;

type Brand<T, B> = T & { [brand]: B };

export type DashboardId = Brand<string, 'DashboardId'>;
export type WidgetId = Brand<string, 'WidgetId'>;
export type WorkspaceId = Brand<string, 'WorkspaceId'>;
export type DatasetId = Brand<string, 'DatasetId'>;

// Helper functions to create branded IDs
export const createDashboardId = (id: string): DashboardId => id as DashboardId;
export const createWidgetId = (id: string): WidgetId => id as WidgetId;
export const createWorkspaceId = (id: string): WorkspaceId => id as WorkspaceId;
export const createDatasetId = (id: string): DatasetId => id as DatasetId;

// Generate unique IDs
export const generateId = (): string => {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
};

export const generateDashboardId = (): DashboardId => createDashboardId(generateId());
export const generateWidgetId = (): WidgetId => createWidgetId(generateId());
