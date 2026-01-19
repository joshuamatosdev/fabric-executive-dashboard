
import React from 'react';

interface ChartWrapperProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

const ChartWrapper: React.FC<ChartWrapperProps> = ({ title, subtitle, children, className = "" }) => {
  return (
    <div className={`bg-zinc-900 border border-zinc-800 p-3 rounded-lg flex flex-col shadow-sm ${className}`}>
      <div className="mb-2">
        <h3 className="text-zinc-200 text-xs font-bold leading-none">{title}</h3>
        {subtitle && <p className="text-zinc-600 text-[9px] mt-1 font-medium leading-none">{subtitle}</p>}
      </div>
      <div className="flex-1 min-h-0 w-full">
        {children}
      </div>
    </div>
  );
};

export default ChartWrapper;
