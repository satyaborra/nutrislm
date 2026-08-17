import React from 'react';

interface ProfileCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  colorClass?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ title, value, subtitle, icon, colorClass = 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-4">
      {icon && (
        <div className={`p-3 rounded-xl ${colorClass}`}>
          {icon}
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
        {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

export default ProfileCard;
