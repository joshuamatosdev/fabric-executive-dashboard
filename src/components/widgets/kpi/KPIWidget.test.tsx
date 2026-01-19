import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { KPIWidget } from './KPIWidget';
import type { KPIWidgetConfig } from '@/types/widget';

describe('KPIWidget', () => {
  const baseConfig: KPIWidgetConfig = {
    type: 'kpi',
    title: 'Test KPI',
    subtitle: 'Test subtitle',
    format: 'number',
    icon: 'Users',
  };

  it('renders the formatted value', () => {
    render(
      <KPIWidget
        config={baseConfig}
        data={{ value: 1248, previousValue: 1109, change: 12.5 }}
      />
    );

    expect(screen.getByText('1,248')).toBeInTheDocument();
  });

  it('displays positive trend with up arrow', () => {
    render(
      <KPIWidget
        config={baseConfig}
        data={{ value: 100, change: 5.5 }}
      />
    );

    expect(screen.getByText('5.5%')).toBeInTheDocument();
  });

  it('displays negative trend with down arrow', () => {
    render(
      <KPIWidget
        config={baseConfig}
        data={{ value: 100, change: -3.2 }}
      />
    );

    expect(screen.getByText('3.2%')).toBeInTheDocument();
  });

  it('formats currency values correctly', () => {
    render(
      <KPIWidget
        config={{ ...baseConfig, format: 'currency' }}
        data={{ value: 4200000, change: 8.7 }}
      />
    );

    expect(screen.getByText('$4.2M')).toBeInTheDocument();
  });

  it('formats percentage values correctly', () => {
    render(
      <KPIWidget
        config={{ ...baseConfig, format: 'percent' }}
        data={{ value: 94.2, change: -2.1 }}
      />
    );

    expect(screen.getByText('94.2%')).toBeInTheDocument();
  });

  it('formats score values correctly', () => {
    render(
      <KPIWidget
        config={{ ...baseConfig, format: 'score' }}
        data={{ value: 87, change: 2.4 }}
      />
    );

    expect(screen.getByText('87/100')).toBeInTheDocument();
  });

  it('displays trend label when provided', () => {
    render(
      <KPIWidget
        config={{ ...baseConfig, trendLabel: 'vs last month' }}
        data={{ value: 100, change: 10 }}
      />
    );

    expect(screen.getByText('vs last month')).toBeInTheDocument();
  });

  it('uses mock data when no data prop provided', () => {
    render(
      <KPIWidget
        config={{ ...baseConfig, title: 'Personnel Recruiting' }}
      />
    );

    // Should use MOCK_KPI_VALUES for 'Personnel Recruiting'
    expect(screen.getByText('1,248')).toBeInTheDocument();
    expect(screen.getByText('12.5%')).toBeInTheDocument();
  });
});
