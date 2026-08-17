import React from 'react';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, children, className = '', action }) => {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 transform p-5 md:p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold text-gray-800 dark:text-slate-100">{title}</h3>
        {action && <div>{action}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default DashboardCard;
