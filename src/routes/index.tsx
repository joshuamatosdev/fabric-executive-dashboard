import { createFileRoute, Link } from '@tanstack/react-router';
import {
  Card,
  CardHeader,
  CardPreview,
  Text,
  Button,
  Spinner,
  makeStyles,
  tokens,
  shorthands,
} from '@fluentui/react-components';
import { Add24Regular, Grid24Regular } from '@fluentui/react-icons';
import { useDashboards } from '@/api/queries';
import { useCreateDashboard } from '@/api/mutations';
import type { Dashboard } from '@/types/dashboard';

const useStyles = makeStyles({
  container: {
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.padding('24px'),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    ...shorthands.gap('16px'),
  },
  card: {
    cursor: 'pointer',
    ':hover': {
      boxShadow: tokens.shadow8,
    },
  },
  cardPreview: {
    height: '120px',
    backgroundColor: tokens.colorNeutralBackground3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '400px',
    ...shorthands.gap('16px'),
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
  },
  meta: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
});

export const Route = createFileRoute('/')({
  component: DashboardListPage,
});

function DashboardListPage() {
  const styles = useStyles();
  const { data: dashboards, isLoading, error } = useDashboards();
  const createDashboard = useCreateDashboard();

  const handleCreateDashboard = async () => {
    const name = prompt('Enter dashboard name:');
    if (name) {
      await createDashboard.mutateAsync({ name });
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Spinner size="large" label="Loading dashboards..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <Text size={500} weight="semibold">
            Failed to load dashboards
          </Text>
          <Text>{error.message}</Text>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <Grid24Regular />
          <Text size={600} weight="bold">
            Dashboard Builder
          </Text>
        </div>
        <Button
          appearance="primary"
          icon={<Add24Regular />}
          onClick={handleCreateDashboard}
          disabled={createDashboard.isPending}
        >
          New Dashboard
        </Button>
      </div>

      {dashboards && dashboards.length > 0 ? (
        <div className={styles.grid}>
          {dashboards.map((dashboard: Dashboard) => (
            <Link
              key={dashboard.id}
              to="/dashboards/$dashboardId"
              params={{ dashboardId: dashboard.id }}
              style={{ textDecoration: 'none' }}
            >
              <Card className={styles.card}>
                <CardPreview className={styles.cardPreview}>
                  <Grid24Regular style={{ fontSize: 48, opacity: 0.3 }} />
                </CardPreview>
                <CardHeader
                  header={
                    <Text weight="semibold" size={400}>
                      {dashboard.name}
                    </Text>
                  }
                  description={
                    <div>
                      {dashboard.description && (
                        <Text size={200}>{dashboard.description}</Text>
                      )}
                      <Text className={styles.meta} block>
                        Updated: {new Date(dashboard.updatedAt).toLocaleDateString()}
                      </Text>
                    </div>
                  }
                />
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <Grid24Regular style={{ fontSize: 64, opacity: 0.3 }} />
          <Text size={500} weight="semibold">
            No dashboards yet
          </Text>
          <Text>Create your first dashboard to get started</Text>
          <Button
            appearance="primary"
            icon={<Add24Regular />}
            onClick={handleCreateDashboard}
          >
            Create Dashboard
          </Button>
        </div>
      )}
    </div>
  );
}
