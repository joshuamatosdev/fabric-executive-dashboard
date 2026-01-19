import React from 'react';
import { makeStyles, tokens, shorthands, Text } from '@fluentui/react-components';
import {
  ArrowUpRight24Regular,
  ArrowDownRight24Regular,
  People24Regular,
  Money24Regular,
  Gauge24Regular,
  TargetArrow24Regular,
} from '@fluentui/react-icons';
import type { KPIWidgetConfig } from '@/types/widget';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    ...shorthands.overflow('hidden'),
  },
  iconContainer: {
    marginBottom: 'clamp(4px, 0.5vh, 8px)',
    '& svg': {
      width: 'clamp(16px, 2vw, 24px)',
      height: 'clamp(16px, 2vw, 24px)',
    },
  },
  value: {
    fontSize: 'clamp(20px, 3vw, 36px)',
    fontWeight: tokens.fontWeightBold,
    lineHeight: 1.1,
    color: tokens.colorNeutralForeground1,
    ...shorthands.overflow('hidden'),
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  trendContainer: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap',
    ...shorthands.gap('2px'),
    marginTop: 'clamp(2px, 0.3vh, 6px)',
    '& svg': {
      width: '12px',
      height: '12px',
      flexShrink: 0,
    },
  },
  trendPositive: {
    color: tokens.colorPaletteGreenForeground1,
    fontSize: '10px',
    flexShrink: 0,
  },
  trendNegative: {
    color: tokens.colorPaletteRedForeground1,
    fontSize: '10px',
    flexShrink: 0,
  },
  trendLabel: {
    color: tokens.colorNeutralForeground3,
    fontSize: '9px',
    ...shorthands.overflow('hidden'),
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

// Icon mapping
const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Users: People24Regular,
  UserMinus: People24Regular,
  Activity: Gauge24Regular,
  DollarSign: Money24Regular,
  TrendingUp: ArrowUpRight24Regular,
  Target: TargetArrow24Regular,
};

interface KPIWidgetProps {
  config: KPIWidgetConfig;
  data?: { value: number; previousValue?: number; change?: number };
}

// Mock data based on KPI title
const MOCK_KPI_VALUES: Record<string, { value: number; previousValue: number; change: number }> = {
  'Personnel Recruiting': { value: 1248, previousValue: 1109, change: 12.5 },
  'Personnel Retention': { value: 94.2, previousValue: 96.3, change: -2.1 },
  'Readiness Index': { value: 87, previousValue: 84.9, change: 2.4 },
  'Earnings (YTD)': { value: 4200000, previousValue: 3863400, change: 8.7 },
  'Operating Expenses': { value: 1800000, previousValue: 1821600, change: -1.2 },
};

export function KPIWidget({ config, data }: KPIWidgetProps) {
  const styles = useStyles();

  // Get mock data based on the title, or use default
  const mockData = MOCK_KPI_VALUES[config.title] ?? {
    value: 1248,
    previousValue: 1109,
    change: 12.5,
  };

  const displayData = data ?? mockData;
  const change = displayData.change ?? 0;
  const isPositive = change >= 0;

  // Format the value based on config
  const formatValue = (val: number): string => {
    switch (config.format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          notation: val >= 1000000 ? 'compact' : 'standard',
          maximumFractionDigits: val >= 1000000 ? 1 : 0,
        }).format(val);
      case 'percent':
        return `${val.toFixed(1)}%`;
      case 'score':
        return `${Math.round(val)}/100`;
      default:
        return new Intl.NumberFormat('en-US').format(val);
    }
  };

  const IconComponent = config.icon ? ICON_MAP[config.icon] : null;

  return (
    <div className={styles.container}>
      {IconComponent && (
        <div className={styles.iconContainer}>
          <IconComponent style={{ color: config.color ?? tokens.colorBrandForeground1 }} />
        </div>
      )}
      <Text className={styles.value}>{formatValue(displayData.value)}</Text>
      <div className={styles.trendContainer}>
        {isPositive ? (
          <ArrowUpRight24Regular className={styles.trendPositive} />
        ) : (
          <ArrowDownRight24Regular className={styles.trendNegative} />
        )}
        <Text className={isPositive ? styles.trendPositive : styles.trendNegative}>
          {Math.abs(change).toFixed(1)}%
        </Text>
        {config.trendLabel && (
          <Text className={styles.trendLabel}>{config.trendLabel}</Text>
        )}
      </div>
    </div>
  );
}
