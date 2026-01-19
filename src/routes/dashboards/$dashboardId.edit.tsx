import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useCallback } from 'react';
import {
  Spinner,
  Text,
  makeStyles,
  tokens,
  shorthands,
  Button,
} from '@fluentui/react-components';
import { Add24Regular } from '@fluentui/react-icons';
import type { Layouts, Layout } from 'react-grid-layout';
import { useDashboardLayout, useWidgetsByDashboard } from '@/api/queries';
import { useUpdateDashboardLayout } from '@/api/mutations';
import { GridLayout } from '@/components/layout/GridLayout';
import { WidgetRenderer } from '@/components/widgets/base/WidgetRenderer';
import { Sidebar } from '@/components/layout/Sidebar';
import { useEditorStore, useUIStore, useLayoutStore } from '@/stores';
import { useDebouncedLayoutSave } from '@/hooks/useDebouncedLayoutSave';
import type { DashboardId } from '@/types/common';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    width: '100%',
    flex: 1,
    minHeight: 0, // Critical for flex child sizing
    ...shorthands.gap('16px'),
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
  },
  sidebar: {
    width: '280px',
    flexShrink: 0,
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '400px',
    ...shorthands.gap('16px'),
    color: tokens.colorNeutralForeground3,
    ...shorthands.border('2px', 'dashed', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius('8px'),
  },
});

export const Route = createFileRoute('/dashboards/$dashboardId/edit')({
  component: DashboardEditMode,
});

function DashboardEditMode() {
  const styles = useStyles();
  const { dashboardId } = Route.useParams();
  const typedDashboardId = dashboardId as DashboardId;

  const { data: serverLayout, isLoading: layoutLoading } = useDashboardLayout(typedDashboardId);
  const { data: widgets, isLoading: widgetsLoading } = useWidgetsByDashboard(typedDashboardId);
  const updateLayout = useUpdateDashboardLayout();

  const {
    setEditMode,
    pushUndoState,
    selectedWidgetId,
    selectWidget,
    setDragging,
    setResizing,
    setUnsavedChanges,
  } = useEditorStore();

  const { isSidebarOpen, openSidebar } = useUIStore();
  const { getOptimisticLayout, setOptimisticLayout, setLastSavedLayout } = useLayoutStore();

  // Get the current layout (optimistic or server)
  const optimisticLayout = getOptimisticLayout(typedDashboardId);
  const currentLayouts = optimisticLayout ?? serverLayout?.layouts ?? {};

  // Initialize the debounced save hook
  const { save: debouncedSave, flush: flushSave } = useDebouncedLayoutSave(typedDashboardId);

  // Set edit mode on mount, clear on unmount
  useEffect(() => {
    setEditMode(true);
    if (serverLayout?.layouts) {
      setLastSavedLayout(typedDashboardId, serverLayout.layouts);
    }
    return () => {
      setEditMode(false);
      flushSave(); // Save any pending changes when leaving edit mode
    };
  }, [typedDashboardId, serverLayout, setEditMode, setLastSavedLayout, flushSave]);

  // Handle layout changes from react-grid-layout
  const handleLayoutChange = useCallback(
    (newLayouts: Layouts) => {
      // Push current state to undo stack before updating
      if (currentLayouts.lg) {
        pushUndoState(currentLayouts.lg);
      }

      // Update optimistic layout immediately
      setOptimisticLayout(typedDashboardId, newLayouts);
      setUnsavedChanges(true);

      // Debounced save to server
      debouncedSave(newLayouts);
    },
    [typedDashboardId, currentLayouts, pushUndoState, setOptimisticLayout, setUnsavedChanges, debouncedSave]
  );

  const handleDragStart = useCallback(() => {
    setDragging(true);
  }, [setDragging]);

  const handleDragStop = useCallback(() => {
    setDragging(false);
  }, [setDragging]);

  const handleResizeStart = useCallback(() => {
    setResizing(true);
  }, [setResizing]);

  const handleResizeStop = useCallback(() => {
    setResizing(false);
  }, [setResizing]);

  const handleWidgetClick = useCallback(
    (widgetId: string) => {
      selectWidget(widgetId as any);
      openSidebar();
    },
    [selectWidget, openSidebar]
  );

  if (layoutLoading || widgetsLoading) {
    return (
      <div className={styles.loading}>
        <Spinner size="large" label="Loading dashboard..." />
      </div>
    );
  }

  const layoutItems = currentLayouts.lg ?? [];

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        {layoutItems.length > 0 ? (
          <GridLayout
            layouts={currentLayouts}
            isEditable={true}
            onLayoutChange={handleLayoutChange}
            onDragStart={handleDragStart}
            onDragStop={handleDragStop}
            onResizeStart={handleResizeStart}
            onResizeStop={handleResizeStop}
          >
            {layoutItems.map((item: Layout) => {
              const widget = widgets?.find((w) => w.id === item.i);
              return (
                <div key={item.i} onClick={() => handleWidgetClick(item.i)}>
                  {widget ? (
                    <WidgetRenderer
                      widget={widget}
                      isEditing={true}
                      isSelected={selectedWidgetId === item.i}
                    />
                  ) : (
                    <div>Widget not found</div>
                  )}
                </div>
              );
            })}
          </GridLayout>
        ) : (
          <div className={styles.empty}>
            <Text size={500} weight="semibold">
              Add widgets to get started
            </Text>
            <Text>Drag widgets from the sidebar or click the button below</Text>
            <Button appearance="primary" icon={<Add24Regular />} onClick={openSidebar}>
              Add Widget
            </Button>
          </div>
        )}
      </div>

      {isSidebarOpen && (
        <div className={styles.sidebar}>
          <Sidebar dashboardId={typedDashboardId} />
        </div>
      )}
    </div>
  );
}
