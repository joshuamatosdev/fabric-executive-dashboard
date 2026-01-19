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
  Dropdown,
  Option,
} from '@fluentui/react-components';
import {
  ArrowLeft24Regular,
  Edit24Regular,
  Save24Regular,
  ArrowUndo24Regular,
  ArrowRedo24Regular,
  Delete24Regular,
  Settings24Regular,
  PlugConnected20Regular,
  ArrowSync20Regular,
} from '@fluentui/react-icons';
import { useDashboard, useDashboardLayout } from '@/api/queries';
import { useDeleteDashboard } from '@/api/mutations';
import { useEditorStore } from '@/stores';
import { MetricPills } from '@/components/common/MetricPills';
import type { DashboardId } from '@/types/common';

const useStyles = makeStyles({
  container: {
    minHeight: '100vh',
    maxHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.overflow('hidden'),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.padding('8px', '16px'),
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke1),
    backgroundColor: tokens.colorNeutralBackground2,
    flexShrink: 0,
    '@media (min-width: 768px)': {
      ...shorthands.padding('12px', '24px'),
    },
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    minWidth: 0,
    flex: 1,
    '@media (min-width: 768px)': {
      ...shorthands.gap('12px'),
    },
  },
  headerTitle: {
    minWidth: 0,
    ...shorthands.overflow('hidden'),
  },
  headerTitleText: {
    fontSize: 'clamp(14px, 2vw, 20px)',
    fontWeight: tokens.fontWeightBold,
    ...shorthands.overflow('hidden'),
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'block',
  },
  headerSubtitle: {
    fontSize: 'clamp(10px, 1.5vw, 12px)',
    color: tokens.colorNeutralForeground3,
    ...shorthands.overflow('hidden'),
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'block',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('4px'),
    flexShrink: 0,
    '@media (min-width: 768px)': {
      ...shorthands.gap('8px'),
    },
  },
  content: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    minHeight: 0, // Critical for flex child to shrink properly
    ...shorthands.overflow('hidden'),
  },
  contentInner: {
    width: '100%',
    maxWidth: '1400px',
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.padding('12px'),
    '@media (min-width: 768px)': {
      ...shorthands.padding('16px', '24px'),
    },
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
  pillsSection: {
    display: 'flex',
    justifyContent: 'center',
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke1),
    backgroundColor: tokens.colorNeutralBackground1,
    flexShrink: 0,
  },
  pillsInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '1400px',
    ...shorthands.padding('8px', '12px'),
    '@media (min-width: 768px)': {
      ...shorthands.padding('10px', '24px'),
    },
  },
  pillsLeft: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },
  pillsRight: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('16px'),
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('4px'),
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
  },
  statusConnected: {
    color: tokens.colorPaletteGreenForeground1,
  },
  dropdown: {
    minWidth: '140px',
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
            <Button appearance="subtle" icon={<ArrowLeft24Regular />} size="small" />
          </Link>
          <div className={styles.headerTitle}>
            <Text className={styles.headerTitleText}>
              {dashboard.name}
            </Text>
            {dashboard.description && (
              <Text className={styles.headerSubtitle}>
                {dashboard.description}
              </Text>
            )}
          </div>
          {isEditMode && <span className={styles.editIndicator}>Edit Mode</span>}
          {hasUnsavedChanges && (
            <span style={{ color: tokens.colorPaletteYellowForeground1, fontSize: '10px' }}>
              (Unsaved)
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

      <section className={styles.pillsSection}>
        <div className={styles.pillsInner}>
          <div className={styles.pillsLeft}>
            <Dropdown
              className={styles.dropdown}
              placeholder="Select Division"
              defaultValue="All Divisions"
              size="small"
            >
              <Option value="all">All Divisions</Option>
              <Option value="engineering">Engineering</Option>
              <Option value="sales">Sales</Option>
              <Option value="marketing">Marketing</Option>
              <Option value="product">Product</Option>
              <Option value="hr">HR</Option>
            </Dropdown>
            <MetricPills />
          </div>
          <div className={styles.pillsRight}>
            <div className={`${styles.statusIndicator} ${styles.statusConnected}`}>
              <PlugConnected20Regular />
              <span>API Connected</span>
            </div>
            <div className={styles.statusIndicator}>
              <ArrowSync20Regular />
              <span>Sync: 2m ago</span>
            </div>
          </div>
        </div>
      </section>

      <main className={styles.content}>
        <div className={styles.contentInner}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
