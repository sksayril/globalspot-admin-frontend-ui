import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend, color }) => {
  const colorClasses = {
    blue: 'bg-sky-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-all duration-200 hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">{title}</p>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 truncate">{value}</p>
          {trend && (
            <p className={`text-xs sm:text-sm mt-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'} truncate`}>
              {trend.isPositive ? '↗' : '↘'} {trend.value}
            </p>
          )}
        </div>
        <div className={`${colorClasses[color]} rounded-full p-2 sm:p-3 ml-3 flex-shrink-0`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;