import React, { Suspense, lazy } from 'react';
import { Spinner, Text, makeStyles, tokens, shorthands } from '@fluentui/react-components';
import { WidgetContainer } from './WidgetContainer';
import type { WidgetInstance } from '@/types/widget';

const useStyles = makeStyles({
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  error: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    color: tokens.colorPaletteRedForeground1,
    ...shorthands.gap('8px'),
  },
  // KPI container - no header, max 50px height
  kpiContainer: {
    height: '100%',
    maxHeight: '50px',
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius('8px'),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    ...shorthands.overflow('hidden'),
    ...shorthands.padding('8px', '12px'),
  },
});

// Lazy load widget components for better code splitting
const KPIWidget = lazy(() =>
  import('@/components/widgets/kpi/KPIWidget').then((m) => ({ default: m.KPIWidget }))
);
const BarChartWidget = lazy(() =>
  import('@/components/widgets/charts/recharts/BarChartWidget').then((m) => ({
    default: m.BarChartWidget,
  }))
);
const LineChartWidget = lazy(() =>
  import('@/components/widgets/charts/recharts/LineChartWidget').then((m) => ({
    default: m.LineChartWidget,
  }))
);
const AreaChartWidget = lazy(() =>
  import('@/components/widgets/charts/recharts/AreaChartWidget').then((m) => ({
    default: m.AreaChartWidget,
  }))
);
const ComposedChartWidget = lazy(() =>
  import('@/components/widgets/charts/recharts/ComposedChartWidget').then((m) => ({
    default: m.ComposedChartWidget,
  }))
);
const VegaChartWidget = lazy(() =>
  import('@/components/widgets/charts/vega/VegaChartWidget').then((m) => ({
    default: m.VegaChartWidget,
  }))
);

interface WidgetRendererProps {
  widget: WidgetInstance;
  isEditing?: boolean;
  isSelected?: boolean;
  onSettings?: () => void;
  onDelete?: () => void;
}

export function WidgetRenderer({
  widget,
  isEditing = false,
  isSelected = false,
  onSettings,
  onDelete,
}: WidgetRendererProps) {
  const styles = useStyles();
  const { config } = widget;

  const renderWidget = () => {
    switch (config.type) {
      case 'kpi':
        return <KPIWidget config={config} />;
      case 'bar-chart':
        return <BarChartWidget config={config} />;
      case 'line-chart':
        return <LineChartWidget config={config} />;
      case 'area-chart':
        return <AreaChartWidget config={config} />;
      case 'composed-chart':
        return <ComposedChartWidget config={config} />;
      case 'vega-chart':
        return <VegaChartWidget config={config} />;
      default:
        return (
          <div className={styles.error}>
            <Text>Unknown widget type</Text>
          </div>
        );
    }
  };

  // KPI widgets use a simple container without header
  if (config.type === 'kpi') {
    return (
      <div className={styles.kpiContainer}>
        <Suspense
          fallback={
            <div className={styles.loading}>
              <Spinner size="small" />
            </div>
          }
        >
          <KPIWidget config={config} />
        </Suspense>
      </div>
    );
  }

  // Other widgets use WidgetContainer with header
  return (
    <WidgetContainer
      title={config.title}
      subtitle={config.subtitle}
      isEditing={isEditing}
      isSelected={isSelected}
      onSettings={onSettings}
      onDelete={onDelete}
    >
      <Suspense
        fallback={
          <div className={styles.loading}>
            <Spinner size="small" />
          </div>
        }
      >
        {renderWidget()}
      </Suspense>
    </WidgetContainer>
  );
}
