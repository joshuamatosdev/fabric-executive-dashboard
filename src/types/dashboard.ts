import type { DashboardId, WidgetId } from './common';
import type { Layouts } from 'react-grid-layout';

export interface Dashboard {
  id: DashboardId;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}

export interface DashboardLayout {
  dashboardId: DashboardId;
  layouts: Layouts;
  widgets: WidgetId[];
}

export interface CreateDashboardDto {
  name: string;
  description?: string;
}

export interface UpdateDashboardDto {
  name?: string;
  description?: string;
}
