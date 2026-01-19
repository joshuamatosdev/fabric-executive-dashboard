
import React from 'react';
import { Users, UserMinus, Activity, DollarSign, TrendingUp, Gauge, ShieldAlert, Target } from 'lucide-react';

export const COLORS = {
  microsoftBlue: '#0078d4',
  microsoftRed: '#d83b01',
  microsoftGreen: '#107c10',
  microsoftYellow: '#ffb900',
  trendBlue: '#7dd3fc', // light blue for trend lines
  predictionPurple: '#a855f7', // prediction line color
  bgDark: '#09090b',
  cardBg: '#18181b',
  border: '#27272a',
};

export const DIVISIONS = [
  "All Divisions",
  "BusinessAI",
  "Central Cloud + AI Platform",
  "China Cloud Group",
  "Cloud Operations + Innovation",
  "Health and Life Sciences",
  "Microsoft Cloud for Industry",
  "Microsoft Specialized Clouds (MSC)",
  "AHSi",
  "Azure Core",
  "Azure CTO",
  "Azure CXP",
  "Azure Data",
  "Azure Legacy"
];

export const PILL_CONFIG = [
  { label: 'Operational Efficiency Score', value: '92.4', icon: <Gauge className="w-3.5 h-3.5" />, color: COLORS.microsoftBlue },
  { label: 'Projected Readiness (Q4)', value: '89/100', icon: <Target className="w-3.5 h-3.5" />, color: COLORS.microsoftGreen },
  { label: 'Major Risk Flags', value: '3', icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />, color: COLORS.microsoftRed },
];

export const KPI_CONFIG = [
  { id: 'recruiting', title: 'Personnel Recruiting', value: '1,248', trend: 12.5, trendLabel: 'vs last month', icon: <Users className="w-5 h-5" />, color: COLORS.microsoftBlue },
  { id: 'retention', title: 'Personnel Retention', value: '94.2%', trend: -2.1, trendLabel: 'vs last month', icon: <UserMinus className="w-5 h-5" />, color: COLORS.microsoftGreen },
  { id: 'readiness', title: 'Readiness Index', value: '87/100', trend: 2.4, trendLabel: 'improving', icon: <Activity className="w-5 h-5" />, color: COLORS.microsoftYellow },
  { id: 'earnings', title: 'Earnings (YTD)', value: '$4.2M', trend: 8.7, trendLabel: 'vs target', icon: <DollarSign className="w-5 h-5" />, color: COLORS.microsoftBlue },
  { id: 'expenses', title: 'Operating Expenses', value: '$1.8M', trend: -1.2, trendLabel: 'reduction', icon: <TrendingUp className="w-5 h-5" />, color: COLORS.microsoftRed },
];

export const MOCK_CHART_DATA = [
  { name: 'Jan', value: 400, value2: 240 },
  { name: 'Feb', value: 300, value2: 139 },
  { name: 'Mar', value: 200, value2: 980 },
  { name: 'Apr', value: 278, value2: 390 },
  { name: 'May', value: 189, value2: 480 },
  { name: 'Jun', value: 239, value2: 380 },
  { name: 'Jul', value: 349, value2: 430 },
];

export const MOCK_RECRUITING_TREND_DATA = [
  { name: 'Jan', actual: 400, predicted: null },
  { name: 'Feb', actual: 450, predicted: null },
  { name: 'Mar', actual: 420, predicted: null },
  { name: 'Apr', actual: 480, predicted: null },
  { name: 'May', actual: 510, predicted: null },
  { name: 'Jun', actual: 540, predicted: 540 },
  { name: 'Jul', actual: 500, predicted: 580 },
  { name: 'Aug', actual: 460, predicted: 620 },
];

export const MOCK_EARNINGS_TREND_DATA = [
  { name: 'Jan', actual: 300, predicted: null },
  { name: 'Feb', actual: 310, predicted: null },
  { name: 'Mar', actual: 305, predicted: null },
  { name: 'Apr', actual: 420, predicted: null }, 
  { name: 'May', actual: 540, predicted: null },
  { name: 'Jun', actual: 610, predicted: 610 }, 
  { name: 'Jul', actual: 450, predicted: 680 }, 
  { name: 'Aug', actual: 380, predicted: 750 }, 
];

export const MOCK_CLOUD_GA_DATA = [
  { name: 'Jan', value: 12 },
  { name: 'Feb', value: 15 },
  { name: 'Mar', value: 14 },
  { name: 'Apr', value: 22 },
  { name: 'May', value: 28 },
  { name: 'Jun', value: 35 },
  { name: 'Jul', value: 42 },
];

export const MOCK_COMPLIANCE_DATA = [
  { name: 'Jan', value: 88 },
  { name: 'Feb', value: 89 },
  { name: 'Mar', value: 87 },
  { name: 'Apr', value: 92 },
  { name: 'May', value: 94 },
  { name: 'Jun', value: 96 },
  { name: 'Jul', value: 98 },
];

export const MOCK_TREND_PREDICTION_DATA = [
  { name: 'Jan', actual: 400, predicted: null },
  { name: 'Feb', actual: 450, predicted: null },
  { name: 'Mar', actual: 420, predicted: null },
  { name: 'Apr', actual: 480, predicted: null },
  { name: 'May', actual: 510, predicted: null },
  { name: 'Jun', actual: 540, predicted: 540 },
  { name: 'Jul', actual: null, predicted: 580 },
  { name: 'Aug', actual: null, predicted: 620 },
];

export const MOCK_BAR_DATA_BY_CATEGORY = {
  recruiting: [
    { name: 'Engineering', value: 45 },
    { name: 'Sales', value: 32 },
    { name: 'Marketing', value: 18 },
    { name: 'Product', value: 24 },
    { name: 'HR', value: 12 },
  ],
  retention: [
    { name: 'Q1', value: 92 },
    { name: 'Q2', value: 95 },
    { name: 'Q3', value: 94 },
    { name: 'Q4', value: 96 },
  ],
  readiness: [
    { name: 'Infra', value: 85 },
    { name: 'Talent', value: 92 },
    { name: 'Ops', value: 78 },
    { name: 'Fiscal', value: 88 },
  ],
  financial: [
    { name: 'North America', value: 1200 },
    { name: 'Europe', value: 800 },
    { name: 'Asia', value: 1100 },
    { name: 'LATAM', value: 450 },
  ],
};

export const calculateAverage = (data: { value: number }[]) => {
  const sum = data.reduce((acc, curr) => acc + curr.value, 0);
  return sum / data.length;
};
