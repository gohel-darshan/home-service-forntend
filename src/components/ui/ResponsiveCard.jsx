import React from 'react';
import { Card } from './Card';

export const ResponsiveCard = ({ children, className = '', hover = true, padding = 'default', ...props }) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3 sm:p-4',
    default: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8'
  };
  
  return (
    <Card 
      className={`${paddingClasses[padding]} ${hover ? 'hover:shadow-md transition-all duration-200' : ''} ${className}`} 
      {...props}
    >
      {children}
    </Card>
  );
};

export const StatCard = ({ icon: Icon, title, value, subtitle, color = 'primary', size = 'default' }) => {
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    green: 'text-green-600 bg-green-100',
    blue: 'text-blue-600 bg-blue-100',
    yellow: 'text-yellow-600 bg-yellow-100',
    purple: 'text-purple-600 bg-purple-100',
    red: 'text-red-600 bg-red-100',
    orange: 'text-orange-600 bg-orange-100'
  };
  
  const sizeClasses = {
    sm: {
      icon: 'w-8 h-8',
      iconSize: 'w-4 h-4',
      value: 'text-lg sm:text-xl',
      title: 'text-xs',
      subtitle: 'text-xs'
    },
    default: {
      icon: 'w-10 h-10 sm:w-12 sm:h-12',
      iconSize: 'w-5 h-5 sm:w-6 sm:h-6',
      value: 'text-xl sm:text-2xl lg:text-3xl',
      title: 'text-sm',
      subtitle: 'text-sm'
    },
    lg: {
      icon: 'w-14 h-14 sm:w-16 sm:h-16',
      iconSize: 'w-7 h-7 sm:w-8 sm:h-8',
      value: 'text-2xl sm:text-3xl lg:text-4xl',
      title: 'text-base',
      subtitle: 'text-base'
    }
  };
  
  const currentSize = sizeClasses[size];

  return (
    <ResponsiveCard hover>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className={`${currentSize.title} text-gray-600 mb-1 truncate`}>{title}</p>
          <p className={`${currentSize.value} font-bold text-gray-900 truncate`}>{value}</p>
          {subtitle && <p className={`${currentSize.subtitle} text-gray-500 mt-1 truncate`}>{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`${currentSize.icon} rounded-full flex items-center justify-center flex-shrink-0 ml-3 ${colorClasses[color]}`}>
            <Icon className={currentSize.iconSize} />
          </div>
        )}
      </div>
    </ResponsiveCard>
  );
};

export const MobileCard = ({ children, className = '', ...props }) => (
  <Card 
    className={`p-3 sm:p-4 rounded-lg sm:rounded-xl ${className}`} 
    {...props}
  >
    {children}
  </Card>
);

export const ActionCard = ({ children, onClick, className = '', disabled = false }) => (
  <Card 
    className={`p-4 sm:p-6 cursor-pointer transition-all duration-200 ${
      disabled 
        ? 'opacity-50 cursor-not-allowed' 
        : 'hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
    } ${className}`}
    onClick={disabled ? undefined : onClick}
  >
    {children}
  </Card>
);