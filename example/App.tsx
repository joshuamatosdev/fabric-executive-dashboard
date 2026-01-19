
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, ComposedChart, ReferenceLine 
} from 'recharts';
import { 
  KPI_CONFIG, COLORS, MOCK_CHART_DATA, MOCK_BAR_DATA_BY_CATEGORY, 
  MOCK_RECRUITING_TREND_DATA, MOCK_EARNINGS_TREND_DATA, MOCK_CLOUD_GA_DATA, 
  MOCK_COMPLIANCE_DATA, calculateAverage, PILL_CONFIG, DIVISIONS 
} from './constants';
import KPICard from './components/KPICard';
import ChartWrapper from './components/ChartWrapper';
import { LayoutGrid, Filter, ChevronDown } from 'lucide-react';

const App: React.FC = () => {
  const [selectedDivision, setSelectedDivision] = useState(DIVISIONS[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Re-calculate averages (in a real app, these would be derived from filtered data)
  const recruitingAvg = calculateAverage(MOCK_BAR_DATA_BY_CATEGORY.recruiting);
  const retentionAvg = calculateAverage(MOCK_BAR_DATA_BY_CATEGORY.retention);
  const readinessAvg = calculateAverage(MOCK_BAR_DATA_BY_CATEGORY.readiness);
  const financialAvg = calculateAverage(MOCK_BAR_DATA_BY_CATEGORY.financial);

  useEffect(() => {
    if (selectedDivision !== DIVISIONS[0]) {
      setIsRefreshing(true);
      const timer = setTimeout(() => setIsRefreshing(false), 600);
      return () => clearTimeout(timer);
    }
  }, [selectedDivision]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-8">
      {/* Simplified Top Navigation */}
      <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <LayoutGrid className="w-5 h-5 text-blue-500" />
            <h1 className="text-md font-bold tracking-tight">Fabric Executive Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4 text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">
            <div className="flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
              API Connected
            </div>
            <div className="flex items-center">
              <div className={`w-1.5 h-1.5 rounded-full ${isRefreshing ? 'bg-yellow-500 animate-pulse' : 'bg-blue-500'} mr-1.5 shadow-[0_0_6px_rgba(59,130,246,0.4)]`} />
              {isRefreshing ? 'Refreshing...' : 'Sync: 2m ago'}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 pt-2 space-y-4">
        {/* Header Section: Pills and Division Filter */}
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-zinc-900">
          <div className="flex flex-wrap items-center gap-2">
            {PILL_CONFIG.map((pill, idx) => (
              <div key={idx} className="flex items-center bg-zinc-900/40 border border-zinc-800/50 rounded-full px-3 py-1 shadow-sm">
                <div className="mr-2 p-0.5 rounded-full bg-zinc-800" style={{ color: pill.color }}>
                  {pill.icon}
                </div>
                <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-tight mr-2">{pill.label}</span>
                <span className="text-xs font-bold text-zinc-100">{pill.value}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Filter className="w-3.5 h-3.5 text-zinc-500" />
              </div>
              <select 
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="appearance-none bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px] font-semibold rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-9 pr-10 py-1.5 transition-all hover:border-zinc-700 cursor-pointer"
              >
                {DIVISIONS.map(div => (
                  <option key={div} value={div}>{div}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Content Container with Refreshing Overlay */}
        <div className={`transition-all duration-500 ${isRefreshing ? 'opacity-40 scale-[0.995] blur-[1px]' : 'opacity-100 scale-100 blur-0'}`}>
          {/* Row 1: KPI Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {KPI_CONFIG.map((kpi) => (
              <KPICard 
                key={kpi.id}
                title={kpi.title}
                value={kpi.value}
                trend={kpi.trend}
                trendLabel={kpi.trendLabel}
                icon={kpi.icon}
                color={kpi.color}
              />
            ))}
          </section>

          {/* Row 2: Bar Charts (Categories) */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 h-[240px] mt-4">
            <ChartWrapper title="Recruitment" subtitle="Monthly hires">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_BAR_DATA_BY_CATEGORY.recruiting}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={9} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '4px', fontSize: '10px' }}
                    itemStyle={{ color: COLORS.microsoftBlue }}
                  />
                  <ReferenceLine y={recruitingAvg} stroke="#ef4444" strokeDasharray="3 3" />
                  <Bar dataKey="value" fill={COLORS.microsoftBlue} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>

            <ChartWrapper title="Retention" subtitle="By Quarter (%)">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_BAR_DATA_BY_CATEGORY.retention}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={9} tickLine={false} axisLine={false} domain={[80, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '4px' }} />
                  <ReferenceLine y={retentionAvg} stroke="#ef4444" strokeDasharray="3 3" />
                  <Bar dataKey="value" fill={COLORS.microsoftGreen} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>

            <ChartWrapper title="Readiness" subtitle="Core Score (0-100)">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_BAR_DATA_BY_CATEGORY.readiness}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={9} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '4px' }} />
                  <ReferenceLine y={readinessAvg} stroke="#ef4444" strokeDasharray="3 3" />
                  <Bar dataKey="value" fill={COLORS.microsoftYellow} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>

            <ChartWrapper title="Regional Revenue" subtitle="In thousands (USD)">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_BAR_DATA_BY_CATEGORY.financial}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={9} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '4px' }} />
                  <ReferenceLine y={financialAvg} stroke="#ef4444" strokeDasharray="3 3" />
                  <Bar dataKey="value" fill={COLORS.microsoftBlue} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </section>

          {/* Row 3: Trend Lines */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 h-[240px] mt-4">
            <ChartWrapper title="Recruiting Trend" subtitle="Actuals vs Forecast">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_RECRUITING_TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={9} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={9} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '4px' }} />
                  <Line name="Actual" type="monotone" dataKey="actual" stroke={COLORS.trendBlue} strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 2 }} />
                  <Line name="Forecast" type="monotone" dataKey="predicted" stroke={COLORS.microsoftRed} strokeWidth={1.5} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartWrapper>

            <ChartWrapper title="Cloud GA Readiness" subtitle="Air-Gap Cloud Sync Count">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_CLOUD_GA_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={9} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={9} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '4px' }} />
                  <Line type="monotone" dataKey="value" stroke={COLORS.trendBlue} strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartWrapper>

            <ChartWrapper title="Earnings Growth" subtitle="Performance Projection">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_EARNINGS_TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={9} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={9} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '4px' }} />
                  <Line name="Actual" type="monotone" dataKey="actual" stroke={COLORS.trendBlue} strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 2 }} />
                  <Line name="Forecast" type="monotone" dataKey="predicted" stroke={COLORS.microsoftYellow} strokeWidth={1.5} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartWrapper>

            <ChartWrapper title="Compliance Health" subtitle="Security Standard Alignment">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_COMPLIANCE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={9} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={9} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '4px' }} />
                  <Line type="monotone" dataKey="value" stroke={COLORS.trendBlue} strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </section>

          {/* Row 4: Comparison Mixed Charts */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 h-[280px] mt-4">
            <ChartWrapper title="Recruiting vs Attrition" subtitle="Talent Flow">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={MOCK_CHART_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={8} />
                  <YAxis stroke="#71717a" fontSize={8} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '4px' }} />
                  <Bar name="Hires" dataKey="value" fill={COLORS.microsoftBlue} radius={[2, 2, 0, 0]} />
                  <Line name="Attr" type="monotone" dataKey="value2" stroke={COLORS.microsoftRed} strokeWidth={1.5} dot={{ r: 2 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartWrapper>

            <ChartWrapper title="Financial Overview" subtitle="Earnings vs Costs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_CHART_DATA}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.microsoftBlue} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={COLORS.microsoftBlue} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.microsoftYellow} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={COLORS.microsoftYellow} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={8} />
                  <YAxis stroke="#71717a" fontSize={8} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '4px' }} />
                  <Area name="Rev" type="monotone" dataKey="value" stroke={COLORS.microsoftBlue} fillOpacity={1} fill="url(#colorValue)" />
                  <Area name="Exp" type="monotone" dataKey="value2" stroke={COLORS.microsoftYellow} fillOpacity={1} fill="url(#colorValue2)" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartWrapper>

            <ChartWrapper title="System Reliability" subtitle="Uptime vs Capacity">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={MOCK_CHART_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={8} />
                  <YAxis stroke="#71717a" fontSize={8} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '4px' }} />
                  <Bar name="Cap" dataKey="value" fill={COLORS.microsoftGreen} radius={[2, 2, 0, 0]} />
                  <Line name="Up%" type="step" dataKey="value2" stroke={COLORS.microsoftYellow} strokeWidth={1.5} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartWrapper>

            <ChartWrapper title="Satisfaction Correlation" subtitle="Satis vs Reten">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_CHART_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={8} />
                  <YAxis stroke="#71717a" fontSize={8} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '4px' }} />
                  <Line name="Satis" type="monotone" dataKey="value" stroke={COLORS.microsoftBlue} strokeWidth={1.5} dot={{ r: 3 }} />
                  <Line name="Reten" type="monotone" dataKey="value2" stroke={COLORS.microsoftGreen} strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;
