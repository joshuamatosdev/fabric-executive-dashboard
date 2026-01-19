import { create } from 'zustand';
import type { Layouts, Layout } from 'react-grid-layout';
import type { DashboardId, WidgetId } from '../types/common';

interface LayoutState {
  // Optimistic layouts by dashboard ID
  optimisticLayouts: Map<DashboardId, Layouts>;

  // Pending saves (layouts that are being saved)
  pendingSaves: Set<DashboardId>;

  // Last saved layouts (for rollback on error)
  lastSavedLayouts: Map<DashboardId, Layouts>;

  // Actions
  setOptimisticLayout: (dashboardId: DashboardId, layouts: Layouts) => void;
  getOptimisticLayout: (dashboardId: DashboardId) => Layouts | undefined;

  markAsPending: (dashboardId: DashboardId) => void;
  clearPending: (dashboardId: DashboardId) => void;
  isPending: (dashboardId: DashboardId) => boolean;

  setLastSavedLayout: (dashboardId: DashboardId, layouts: Layouts) => void;
  rollbackToLastSaved: (dashboardId: DashboardId) => Layouts | undefined;

  addWidgetToLayout: (
    dashboardId: DashboardId,
    widgetId: WidgetId,
    layout: Omit<Layout, 'i'>
  ) => void;
  removeWidgetFromLayout: (dashboardId: DashboardId, widgetId: WidgetId) => void;
  updateWidgetLayout: (
    dashboardId: DashboardId,
    widgetId: WidgetId,
    updates: Partial<Layout>
  ) => void;

  clearDashboardState: (dashboardId: DashboardId) => void;
  clearAllState: () => void;
}

// Default breakpoints for react-grid-layout
const BREAKPOINTS = ['lg', 'md', 'sm', 'xs', 'xxs'] as const;

export const useLayoutStore = create<LayoutState>((set, get) => ({
  optimisticLayouts: new Map(),
  pendingSaves: new Set(),
  lastSavedLayouts: new Map(),

  // Optimistic layout management
  setOptimisticLayout: (dashboardId, layouts) => {
    set((state) => {
      const newLayouts = new Map(state.optimisticLayouts);
      newLayouts.set(dashboardId, layouts);
      return { optimisticLayouts: newLayouts };
    });
  },

  getOptimisticLayout: (dashboardId) => {
    return get().optimisticLayouts.get(dashboardId);
  },

  // Pending save management
  markAsPending: (dashboardId) => {
    set((state) => {
      const newPending = new Set(state.pendingSaves);
      newPending.add(dashboardId);
      return { pendingSaves: newPending };
    });
  },

  clearPending: (dashboardId) => {
    set((state) => {
      const newPending = new Set(state.pendingSaves);
      newPending.delete(dashboardId);
      return { pendingSaves: newPending };
    });
  },

  isPending: (dashboardId) => {
    return get().pendingSaves.has(dashboardId);
  },

  // Last saved layout management
  setLastSavedLayout: (dashboardId, layouts) => {
    set((state) => {
      const newLastSaved = new Map(state.lastSavedLayouts);
      newLastSaved.set(dashboardId, layouts);
      return { lastSavedLayouts: newLastSaved };
    });
  },

  rollbackToLastSaved: (dashboardId) => {
    const lastSaved = get().lastSavedLayouts.get(dashboardId);
    if (lastSaved) {
      set((state) => {
        const newLayouts = new Map(state.optimisticLayouts);
        newLayouts.set(dashboardId, lastSaved);
        return { optimisticLayouts: newLayouts };
      });
    }
    return lastSaved;
  },

  // Widget layout operations
  addWidgetToLayout: (dashboardId, widgetId, layout) => {
    set((state) => {
      const currentLayouts = state.optimisticLayouts.get(dashboardId) ?? {};
      const newLayouts: Layouts = {};

      for (const breakpoint of BREAKPOINTS) {
        const currentBreakpointLayout = currentLayouts[breakpoint] ?? [];
        newLayouts[breakpoint] = [
          ...currentBreakpointLayout,
          { ...layout, i: widgetId },
        ];
      }

      const newOptimisticLayouts = new Map(state.optimisticLayouts);
      newOptimisticLayouts.set(dashboardId, newLayouts);
      return { optimisticLayouts: newOptimisticLayouts };
    });
  },

  removeWidgetFromLayout: (dashboardId, widgetId) => {
    set((state) => {
      const currentLayouts = state.optimisticLayouts.get(dashboardId);
      if (!currentLayouts) return state;

      const newLayouts: Layouts = {};

      for (const breakpoint of BREAKPOINTS) {
        const currentBreakpointLayout = currentLayouts[breakpoint] ?? [];
        newLayouts[breakpoint] = currentBreakpointLayout.filter(
          (item) => item.i !== widgetId
        );
      }

      const newOptimisticLayouts = new Map(state.optimisticLayouts);
      newOptimisticLayouts.set(dashboardId, newLayouts);
      return { optimisticLayouts: newOptimisticLayouts };
    });
  },

  updateWidgetLayout: (dashboardId, widgetId, updates) => {
    set((state) => {
      const currentLayouts = state.optimisticLayouts.get(dashboardId);
      if (!currentLayouts) return state;

      const newLayouts: Layouts = {};

      for (const breakpoint of BREAKPOINTS) {
        const currentBreakpointLayout = currentLayouts[breakpoint] ?? [];
        newLayouts[breakpoint] = currentBreakpointLayout.map((item) =>
          item.i === widgetId ? { ...item, ...updates } : item
        );
      }

      const newOptimisticLayouts = new Map(state.optimisticLayouts);
      newOptimisticLayouts.set(dashboardId, newLayouts);
      return { optimisticLayouts: newOptimisticLayouts };
    });
  },

  // Cleanup
  clearDashboardState: (dashboardId) => {
    set((state) => {
      const newOptimisticLayouts = new Map(state.optimisticLayouts);
      const newPendingSaves = new Set(state.pendingSaves);
      const newLastSavedLayouts = new Map(state.lastSavedLayouts);

      newOptimisticLayouts.delete(dashboardId);
      newPendingSaves.delete(dashboardId);
      newLastSavedLayouts.delete(dashboardId);

      return {
        optimisticLayouts: newOptimisticLayouts,
        pendingSaves: newPendingSaves,
        lastSavedLayouts: newLastSavedLayouts,
      };
    });
  },

  clearAllState: () => {
    set({
      optimisticLayouts: new Map(),
      pendingSaves: new Set(),
      lastSavedLayouts: new Map(),
    });
  },
}));
