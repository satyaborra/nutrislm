import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface HealthStatsProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: 'emerald' | 'blue' | 'amber' | 'indigo' | 'rose';
}

const colorMap = {
  emerald: 'bg-emerald-100 text-emerald-600',
  blue: 'bg-blue-100 text-blue-600',
  amber: 'bg-amber-100 text-amber-600',
  indigo: 'bg-indigo-100 text-indigo-600',
  rose: 'bg-rose-100 text-rose-600',
};

const HealthStats: React.FC<HealthStatsProps> = ({ 
  title, value, unit, icon: Icon, trend, trendUp = true, color = 'emerald'
}) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
      <div className={`p-3 rounded-xl ${colorMap[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          {unit && <span className="text-sm font-medium text-gray-500">{unit}</span>}
        </div>
        {trend && (
          <p className={`text-xs mt-1 font-medium flex items-center gap-1 ${trendUp ? 'text-emerald-600' : 'text-rose-500'}`}>
            {trend}
          </p>
        )}
      </div>
    </div>
  );
};

export default HealthStats;
