import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LogoutButton = ({ className = '', showIcon = true, children }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors ${className}`}
    >
      {showIcon && <LogOut className="w-4 h-4" />}
      {children || 'Logout'}
    </button>
  );
};