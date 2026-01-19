import React from 'react';
import { makeStyles, tokens, shorthands } from '@fluentui/react-components';
import {
  Gauge24Regular,
  TargetArrow24Regular,
  ShieldError24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
  pill: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(39, 39, 42, 0.4)',
    ...shorthands.border('1px', 'solid', 'rgba(63, 63, 70, 0.5)'),
    ...shorthands.borderRadius('9999px'),
    ...shorthands.padding('4px', '12px'),
    boxShadow: tokens.shadow2,
  },
  iconContainer: {
    marginRight: '8px',
    ...shorthands.padding('2px'),
    ...shorthands.borderRadius('9999px'),
    backgroundColor: tokens.colorNeutralBackground3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& svg': {
      width: '14px',
      height: '14px',
    },
  },
  label: {
    fontSize: '10px',
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.025em',
    marginRight: '8px',
  },
  value: {
    fontSize: '12px',
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
  },
});

interface PillConfig {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const COLORS = {
  microsoftBlue: '#0078d4',
  microsoftGreen: '#107c10',
  microsoftRed: '#d83b01',
};

const PILL_CONFIG: PillConfig[] = [
  {
    label: 'Operational Efficiency Score',
    value: '92.4',
    icon: <Gauge24Regular />,
    color: COLORS.microsoftBlue,
  },
  {
    label: 'Projected Readiness (Q4)',
    value: '89/100',
    icon: <TargetArrow24Regular />,
    color: COLORS.microsoftGreen,
  },
  {
    label: 'Major Risk Flags',
    value: '3',
    icon: <ShieldError24Regular />,
    color: COLORS.microsoftRed,
  },
];

export function MetricPills() {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      {PILL_CONFIG.map((pill, idx) => (
        <div key={idx} className={styles.pill}>
          <div className={styles.iconContainer} style={{ color: pill.color }}>
            {pill.icon}
          </div>
          <span className={styles.label}>{pill.label}</span>
          <span className={styles.value}>{pill.value}</span>
        </div>
      ))}
    </div>
  );
}
