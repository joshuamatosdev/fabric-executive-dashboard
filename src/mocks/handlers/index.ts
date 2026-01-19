import { dashboardHandlers } from './dashboard.handlers';
import { widgetHandlers } from './widget.handlers';
import { fabricHandlers } from './fabric.handlers';

export const handlers = [
  ...dashboardHandlers,
  ...widgetHandlers,
  ...fabricHandlers,
];
