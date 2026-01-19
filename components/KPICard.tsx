
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  trend: number;
  trendLabel: string;
  icon: React.ReactNode;
  color: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, trend, trendLabel, icon, color }) => {
  const isPositive = trend > 0;

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg flex flex-col justify-between shadow-sm hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between mb-1">
        <div className="p-1.5 rounded-md bg-zinc-800" style={{ color }}>
          {/* Fix: cast icon to React.ReactElement<any> to satisfy TypeScript when using React.cloneElement with className */}
          {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-4 h-4' })}
        </div>
        <div className={`flex items-center text-[10px] font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isPositive ? <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" /> : <ArrowDownRight className="w-2.5 h-2.5 mr-0.5" />}
          {Math.abs(trend)}%
        </div>
      </div>
      <div>
        <h3 className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider mb-0.5">{title}</h3>
        <div className="text-xl font-bold text-zinc-100 leading-tight">{value}</div>
        <div className="text-zinc-600 text-[9px] mt-0.5 font-medium">{trendLabel}</div>
      </div>
    </div>
  );
};

export default KPICard;
