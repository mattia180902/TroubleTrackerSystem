import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
    text: string;
  };
  borderColor: string;
}

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  iconBgColor, 
  iconColor, 
  trend,
  borderColor 
}: StatsCardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 border-l-4 ${borderColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${iconBgColor}`}>
          <span className={`material-icons ${iconColor}`}>{icon}</span>
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-3 text-xs">
          <span className={`${trend.isPositive ? 'text-success' : 'text-error'} flex items-center`}>
            <span className="material-icons text-xs mr-1">
              {trend.isPositive ? 'arrow_upward' : 'arrow_downward'}
            </span>
            {trend.value}
          </span>
          <span className="ml-2 text-gray-600">{trend.text}</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
