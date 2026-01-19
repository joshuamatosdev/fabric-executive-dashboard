import React from 'react';
import { makeStyles, tokens, shorthands } from '@fluentui/react-components';
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
    justifyContent: 'space-between',
    ...shorthands.overflow('hidden'),
  },
  topRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '4px',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.padding('6px'),
    ...shorthands.borderRadius('6px'),
    backgroundColor: tokens.colorNeutralBackground3,
    '& svg': {
      width: '16px',
      height: '16px',
    },
  },
  trendBadge: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('2px'),
    '& svg': {
      width: '10px',
      height: '10px',
      flexShrink: 0,
    },
  },
  trendTextPositive: {
    color: tokens.colorPaletteGreenForeground1,
    fontSize: '10px',
    fontWeight: tokens.fontWeightBold,
    lineHeight: 1,
  },
  trendTextNegative: {
    color: tokens.colorPaletteRedForeground1,
    fontSize: '10px',
    fontWeight: tokens.fontWeightBold,
    lineHeight: 1,
  },
  bottomSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '9px',
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: tokens.colorNeutralForeground3,
    marginBottom: '2px',
    lineHeight: 1,
  },
  value: {
    fontSize: 'clamp(18px, 2.5vw, 24px)',
    fontWeight: tokens.fontWeightBold,
    lineHeight: 1.1,
    color: tokens.colorNeutralForeground1,
    ...shorthands.overflow('hidden'),
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  trendLabel: {
    color: tokens.colorNeutralForeground4,
    fontSize: '9px',
    fontWeight: tokens.fontWeightMedium,
    marginTop: '2px',
    lineHeight: 1,
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
      {/* Top row: Icon on left, trend badge on right */}
      <div className={styles.topRow}>
        {IconComponent && (
          <div className={styles.iconContainer}>
            <IconComponent style={{ color: config.color ?? tokens.colorBrandForeground1 }} />
          </div>
        )}
        <div className={styles.trendBadge}>
          {isPositive ? (
            <ArrowUpRight24Regular className={styles.trendTextPositive} />
          ) : (
            <ArrowDownRight24Regular className={styles.trendTextNegative} />
          )}
          <span className={isPositive ? styles.trendTextPositive : styles.trendTextNegative}>
            {Math.abs(change).toFixed(1)}%
          </span>
        </div>
      </div>
      {/* Bottom section: label, value, trend label */}
      <div className={styles.bottomSection}>
        <span className={styles.label}>{config.title}</span>
        <span className={styles.value}>{formatValue(displayData.value)}</span>
        {config.trendLabel && (
          <span className={styles.trendLabel}>{config.trendLabel}</span>
        )}
      </div>
    </div>
  );
}
