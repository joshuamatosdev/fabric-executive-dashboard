import { createFileRoute } from '@tanstack/react-router';
import { Spinner, Text, makeStyles, tokens, shorthands } from '@fluentui/react-components';
import { useDashboardLayout, useWidgetsByDashboard } from '@/api/queries';
import { GridLayout } from '@/components/layout/GridLayout';
import { WidgetRenderer } from '@/components/widgets/base/WidgetRenderer';
import type { DashboardId } from '@/types/common';

const useStyles = makeStyles({
  container: {
    width: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0, // Critical for flex child sizing
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
  },
});

export const Route = createFileRoute('/dashboards/$dashboardId/')({
  component: DashboardViewMode,
});

function DashboardViewMode() {
  const styles = useStyles();
  const { dashboardId } = Route.useParams();
  const typedDashboardId = dashboardId as DashboardId;

  const { data: layout, isLoading: layoutLoading } = useDashboardLayout(typedDashboardId);
  const { data: widgets, isLoading: widgetsLoading } = useWidgetsByDashboard(typedDashboardId);

  if (layoutLoading || widgetsLoading) {
    return (
      <div className={styles.loading}>
        <Spinner size="large" label="Loading dashboard..." />
      </div>
    );
  }

  if (!layout || !layout.layouts.lg || layout.layouts.lg.length === 0) {
    return (
      <div className={styles.empty}>
        <Text size={500} weight="semibold">
          This dashboard is empty
        </Text>
        <Text>Click "Edit" to add widgets</Text>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <GridLayout
        layouts={layout.layouts}
        isEditable={false}
        onLayoutChange={() => {}}
      >
        {layout.layouts.lg?.map((item) => {
          const widget = widgets?.find((w) => w.id === item.i);
          return (
            <div key={item.i}>
              {widget ? (
                <WidgetRenderer widget={widget} isEditing={false} />
              ) : (
                <div>Widget not found</div>
              )}
            </div>
          );
        })}
      </GridLayout>
    </div>
  );
}
