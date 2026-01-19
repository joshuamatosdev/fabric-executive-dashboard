
export interface KPIData {
  id: string;
  title: string;
  value: string;
  trend: number;
  trendLabel: string;
  icon: string;
  color: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  value2?: number;
}

export interface ComparisonData {
  category: string;
  actual: number;
  target: number;
}
