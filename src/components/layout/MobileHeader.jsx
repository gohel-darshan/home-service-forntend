import React from 'react';
import { ArrowLeft, Menu, Bell, Search, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Flex } from './ResponsiveLayout';

export const MobileHeader = ({ 
  title, 
  subtitle, 
  showBack = false, 
  showMenu = false, 
  showNotifications = false,
  showSearch = false,
  showMore = false,
  onMenuClick,
  onNotificationClick,
  onSearchClick,
  onMoreClick,
  className = '',
  variant = 'default',
  actions = []
}) => {
  const navigate = useNavigate();
  
  const variants = {
    default: 'bg-white shadow-sm border-b border-gray-200',
    primary: 'bg-primary text-white shadow-lg',
    transparent: 'bg-transparent',
    gradient: 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg'
  };
  
  const textColor = variant === 'primary' || variant === 'gradient' ? 'text-white' : 'text-gray-900';
  const subtitleColor = variant === 'primary' || variant === 'gradient' ? 'text-white/80' : 'text-gray-600';
  const buttonHover = variant === 'primary' || variant === 'gradient' ? 'hover:bg-white/10' : 'hover:bg-gray-100';
  const iconColor = variant === 'primary' || variant === 'gradient' ? 'text-white' : 'text-gray-600';

  return (
    <header className={`sticky top-0 z-40 ${variants[variant]} ${className}`}>
      <div className="px-4 py-3 sm:px-6 sm:py-4">
        <Flex justify="between" align="center">
          <Flex align="center" className="gap-3 flex-1 min-w-0">
            {showBack && (
              <button 
                onClick={() => navigate(-1)}
                className={`p-2 -ml-2 ${buttonHover} rounded-full transition-colors`}
              >
                <ArrowLeft className={`w-5 h-5 ${iconColor}`} />
              </button>
            )}
            <div className="flex-1 min-w-0">
              <h1 className={`text-lg sm:text-xl font-bold ${textColor} truncate`}>{title}</h1>
              {subtitle && <p className={`text-sm ${subtitleColor} truncate`}>{subtitle}</p>}
            </div>
          </Flex>
          
          <Flex align="center" className="gap-1 sm:gap-2 flex-shrink-0">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`p-2 ${buttonHover} rounded-full transition-colors relative`}
                title={action.title}
              >
                <action.icon className={`w-5 h-5 ${iconColor}`} />
                {action.badge && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                    {action.badge > 9 ? '9+' : action.badge}
                  </span>
                )}
              </button>
            ))}
            
            {showSearch && (
              <button 
                onClick={onSearchClick}
                className={`p-2 ${buttonHover} rounded-full transition-colors`}
              >
                <Search className={`w-5 h-5 ${iconColor}`} />
              </button>
            )}
            
            {showNotifications && (
              <button 
                onClick={onNotificationClick}
                className={`p-2 ${buttonHover} rounded-full transition-colors relative`}
              >
                <Bell className={`w-5 h-5 ${iconColor}`} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
            )}
            
            {showMore && (
              <button 
                onClick={onMoreClick}
                className={`p-2 ${buttonHover} rounded-full transition-colors`}
              >
                <MoreVertical className={`w-5 h-5 ${iconColor}`} />
              </button>
            )}
            
            {showMenu && (
              <button 
                onClick={onMenuClick}
                className={`p-2 ${buttonHover} rounded-full transition-colors sm:hidden`}
              >
                <Menu className={`w-5 h-5 ${iconColor}`} />
              </button>
            )}
          </Flex>
        </Flex>
      </div>
    </header>
  );
};

export const StickyHeader = ({ children, className = '' }) => (
  <div className={`sticky top-0 z-40 ${className}`}>
    {children}
  </div>
);

export const HeaderSection = ({ children, className = '' }) => (
  <div className={`px-4 sm:px-6 py-4 sm:py-6 ${className}`}>
    {children}
  </div>
);