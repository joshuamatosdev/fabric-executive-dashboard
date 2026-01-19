import React, { useMemo } from 'react';
import { VegaEmbed } from 'react-vega';
import { makeStyles, Text, tokens } from '@fluentui/react-components';
import type { VegaChartWidgetConfig } from '@/types/widget';
import type { VisualizationSpec } from 'vega-embed';

const useStyles = makeStyles({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: tokens.colorPaletteRedForeground1,
    textAlign: 'center',
  },
});

// Mock data for development
const MOCK_DATA = [
  { name: 'Engineering', value: 45 },
  { name: 'Sales', value: 32 },
  { name: 'Marketing', value: 18 },
  { name: 'Product', value: 24 },
  { name: 'HR', value: 12 },
];

interface VegaChartWidgetProps {
  config: VegaChartWidgetConfig;
  data?: Array<Record<string, unknown>>;
}

export function VegaChartWidget({ config, data }: VegaChartWidgetProps) {
  const styles = useStyles();
  const chartData = data ?? MOCK_DATA;

  // Merge the spec with data and theme settings
  const spec = useMemo<VisualizationSpec>(() => {
    const baseSpec = config.spec as VisualizationSpec;

    return {
      ...baseSpec,
      $schema: baseSpec.$schema || 'https://vega.github.io/schema/vega-lite/v5.json',
      data: { values: chartData },
      background: 'transparent',
      config: {
        view: { stroke: 'transparent' },
        axis: {
          labelColor: '#71717a',
          titleColor: '#71717a',
          gridColor: '#27272a',
          domainColor: '#27272a',
        },
        legend: {
          labelColor: '#a1a1aa',
          titleColor: '#a1a1aa',
        },
        title: {
          color: '#f4f4f5',
        },
        ...(baseSpec as Record<string, unknown>).config,
      },
      autosize: {
        type: 'fit',
        contains: 'padding',
      },
    };
  }, [config.spec, chartData]);

  try {
    return (
      <div className={styles.container}>
        <VegaEmbed
          spec={spec}
          options={{ actions: false }}
        />
      </div>
    );
  } catch (error) {
    return (
      <div className={styles.container}>
        <Text className={styles.error}>
          Error rendering Vega chart: {error instanceof Error ? error.message : 'Unknown error'}
        </Text>
      </div>
    );
  }
}
