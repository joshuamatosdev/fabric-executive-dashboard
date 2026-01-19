import { createFileRoute, Outlet, Link, useNavigate } from '@tanstack/react-router';
import {
  makeStyles,
  tokens,
  shorthands,
  Button,
  Text,
  Spinner,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  Tooltip,
} from '@fluentui/react-components';
import {
  ArrowLeft24Regular,
  Edit24Regular,
  Save24Regular,
  ArrowUndo24Regular,
  ArrowRedo24Regular,
  Delete24Regular,
  Settings24Regular,
} from '@fluentui/react-icons';
import { useDashboard, useDashboardLayout } from '@/api/queries';
import { useDeleteDashboard } from '@/api/mutations';
import { useEditorStore } from '@/stores';
import type { DashboardId } from '@/types/common';

const useStyles = makeStyles({
  container: {
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.padding('12px', '24px'),
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke1),
    backgroundColor: tokens.colorNeutralBackground2,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
  content: {
    flex: 1,
    ...shorthands.padding('16px', '24px'),
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
  },
  error: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '400px',
    ...shorthands.gap('16px'),
  },
  editIndicator: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    ...shorthands.padding('4px', '12px'),
    ...shorthands.borderRadius('4px'),
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
  },
});

export const Route = createFileRoute('/dashboards/$dashboardId')({
  component: DashboardShell,
});

function DashboardShell() {
  const styles = useStyles();
  const navigate = useNavigate();
  const { dashboardId } = Route.useParams();
  const typedDashboardId = dashboardId as DashboardId;

  const { data: dashboard, isLoading: dashboardLoading, error: dashboardError } = useDashboard(typedDashboardId);
  const { isLoading: layoutLoading } = useDashboardLayout(typedDashboardId);
  const deleteDashboard = useDeleteDashboard();

  const {
    isEditMode,
    setEditMode,
    hasUnsavedChanges,
    canUndo,
    canRedo,
    undo,
    redo,
  } = useEditorStore();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this dashboard?')) {
      await deleteDashboard.mutateAsync(typedDashboardId);
      navigate({ to: '/' });
    }
  };

  const handleToggleEdit = () => {
    if (isEditMode) {
      // Exiting edit mode - navigate to view mode
      navigate({ to: '/dashboards/$dashboardId', params: { dashboardId } });
    } else {
      // Entering edit mode - navigate to edit route
      navigate({ to: '/dashboards/$dashboardId/edit', params: { dashboardId } });
    }
    setEditMode(!isEditMode);
  };

  if (dashboardLoading || layoutLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Spinner size="large" label="Loading dashboard..." />
        </div>
      </div>
    );
  }

  if (dashboardError || !dashboard) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <Text size={500} weight="semibold">
            Dashboard not found
          </Text>
          <Link to="/">
            <Button appearance="primary">Back to Dashboards</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link to="/">
            <Button appearance="subtle" icon={<ArrowLeft24Regular />} />
          </Link>
          <div>
            <Text size={500} weight="bold">
              {dashboard.name}
            </Text>
            {dashboard.description && (
              <Text size={200} block style={{ color: tokens.colorNeutralForeground3 }}>
                {dashboard.description}
              </Text>
            )}
          </div>
          {isEditMode && <span className={styles.editIndicator}>Edit Mode</span>}
          {hasUnsavedChanges && (
            <span style={{ color: tokens.colorPaletteYellowForeground1, fontSize: '12px' }}>
              (Unsaved changes)
            </span>
          )}
        </div>

        <div className={styles.headerRight}>
          {isEditMode && (
            <Toolbar>
              <Tooltip content="Undo (Ctrl+Z)" relationship="label">
                <ToolbarButton
                  icon={<ArrowUndo24Regular />}
                  disabled={!canUndo()}
                  onClick={() => undo()}
                />
              </Tooltip>
              <Tooltip content="Redo (Ctrl+Y)" relationship="label">
                <ToolbarButton
                  icon={<ArrowRedo24Regular />}
                  disabled={!canRedo()}
                  onClick={() => redo()}
                />
              </Tooltip>
              <ToolbarDivider />
              <Tooltip content="Save" relationship="label">
                <ToolbarButton icon={<Save24Regular />} disabled={!hasUnsavedChanges} />
              </Tooltip>
              <ToolbarDivider />
              <Tooltip content="Dashboard Settings" relationship="label">
                <ToolbarButton icon={<Settings24Regular />} />
              </Tooltip>
              <Tooltip content="Delete Dashboard" relationship="label">
                <ToolbarButton
                  icon={<Delete24Regular />}
                  onClick={handleDelete}
                  disabled={deleteDashboard.isPending}
                />
              </Tooltip>
            </Toolbar>
          )}
          <Button
            appearance={isEditMode ? 'secondary' : 'primary'}
            icon={<Edit24Regular />}
            onClick={handleToggleEdit}
          >
            {isEditMode ? 'Exit Edit' : 'Edit'}
          </Button>
        </div>
      </header>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
