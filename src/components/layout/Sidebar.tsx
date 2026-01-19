import React from 'react';
import {
  makeStyles,
  tokens,
  shorthands,
  Card,
  CardHeader,
  Text,
  Button,
  Tab,
  TabList,
  Divider,
} from '@fluentui/react-components';
import {
  Dismiss24Regular,
  NumberSymbol24Regular,
  ChartMultiple24Regular,
  DataLine24Regular,
  DataArea24Regular,
  DataPie24Regular,
  Code24Regular,
} from '@fluentui/react-icons';
import { useUIStore, useEditorStore } from '@/stores';
import { useCreateWidget } from '@/api/mutations';
import type { DashboardId } from '@/types/common';
import type { WidgetConfig, WidgetType } from '@/types/widget';

const useStyles = makeStyles({
  container: {
    height: '100%',
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius('8px'),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.padding('12px', '16px'),
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke1),
  },
  content: {
    flex: 1,
    ...shorthands.padding('16px'),
    overflowY: 'auto',
  },
  widgetGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    ...shorthands.gap('8px'),
  },
  widgetCard: {
    cursor: 'pointer',
    textAlign: 'center',
    ...shorthands.padding('12px'),
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3Hover,
    },
  },
  widgetIcon: {
    fontSize: '24px',
    marginBottom: '8px',
    color: tokens.colorBrandForeground1,
  },
  configPanel: {
    ...shorthands.padding('16px'),
    ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke1),
  },
});

// Widget type definitions for the palette
const WIDGET_TYPES: Array<{
  type: WidgetType;
  label: string;
  icon: React.ReactNode;
  defaultConfig: Partial<WidgetConfig>;
}> = [
  {
    type: 'kpi',
    label: 'KPI Card',
    icon: <NumberSymbol24Regular />,
    defaultConfig: {
      type: 'kpi',
      title: 'New KPI',
      valueKey: 'value',
      format: 'number',
    },
  },
  {
    type: 'bar-chart',
    label: 'Bar Chart',
    icon: <ChartMultiple24Regular />,
    defaultConfig: {
      type: 'bar-chart',
      title: 'New Bar Chart',
      xAxis: { dataKey: 'name' },
      yAxis: { dataKey: 'value' },
    },
  },
  {
    type: 'line-chart',
    label: 'Line Chart',
    icon: <DataLine24Regular />,
    defaultConfig: {
      type: 'line-chart',
      title: 'New Line Chart',
      xAxis: { dataKey: 'name' },
      series: [{ dataKey: 'value' }],
    },
  },
  {
    type: 'area-chart',
    label: 'Area Chart',
    icon: <DataArea24Regular />,
    defaultConfig: {
      type: 'area-chart',
      title: 'New Area Chart',
      xAxis: { dataKey: 'name' },
      series: [{ dataKey: 'value' }],
    },
  },
  {
    type: 'composed-chart',
    label: 'Composed',
    icon: <DataPie24Regular />,
    defaultConfig: {
      type: 'composed-chart',
      title: 'New Composed Chart',
      xAxis: { dataKey: 'name' },
      yAxis: { dataKey: 'value' },
      elements: [{ type: 'bar', dataKey: 'value' }],
    },
  },
  {
    type: 'vega-chart',
    label: 'Vega Chart',
    icon: <Code24Regular />,
    defaultConfig: {
      type: 'vega-chart',
      title: 'New Vega Chart',
      spec: {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        mark: 'bar',
        encoding: {
          x: { field: 'name', type: 'nominal' },
          y: { field: 'value', type: 'quantitative' },
        },
      },
    },
  },
];

interface SidebarProps {
  dashboardId: DashboardId;
}

export function Sidebar({ dashboardId }: SidebarProps) {
  const styles = useStyles();
  const { sidebarTab, setSidebarTab, closeSidebar } = useUIStore();
  const { selectedWidgetId } = useEditorStore();
  const createWidget = useCreateWidget();

  const handleAddWidget = async (widgetType: typeof WIDGET_TYPES[number]) => {
    await createWidget.mutateAsync({
      dashboardId,
      config: widgetType.defaultConfig as WidgetConfig,
      layout: {
        x: 0,
        y: Infinity, // Will be placed at the bottom
        w: widgetType.type === 'kpi' ? 2 : 3,
        h: widgetType.type === 'kpi' ? 2 : 4,
        minW: 2,
        minH: 2,
      },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text weight="semibold">
          {selectedWidgetId ? 'Configure Widget' : 'Add Widget'}
        </Text>
        <Button
          appearance="subtle"
          icon={<Dismiss24Regular />}
          onClick={closeSidebar}
          size="small"
        />
      </div>

      <TabList
        selectedValue={sidebarTab}
        onTabSelect={(_, data) => setSidebarTab(data.value as any)}
        style={{ padding: '0 16px' }}
      >
        <Tab value="widgets">Widgets</Tab>
        <Tab value="settings">Settings</Tab>
        <Tab value="data">Data</Tab>
      </TabList>

      <div className={styles.content}>
        {sidebarTab === 'widgets' && (
          <div className={styles.widgetGrid}>
            {WIDGET_TYPES.map((widget) => (
              <Card
                key={widget.type}
                className={styles.widgetCard}
                onClick={() => handleAddWidget(widget)}
              >
                <div className={styles.widgetIcon}>{widget.icon}</div>
                <Text size={200}>{widget.label}</Text>
              </Card>
            ))}
          </div>
        )}

        {sidebarTab === 'settings' && (
          <div>
            {selectedWidgetId ? (
              <Text>Widget configuration form will go here</Text>
            ) : (
              <Text style={{ color: tokens.colorNeutralForeground3 }}>
                Select a widget to configure its settings
              </Text>
            )}
          </div>
        )}

        {sidebarTab === 'data' && (
          <div>
            <Text style={{ color: tokens.colorNeutralForeground3 }}>
              Data source configuration will go here
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}
