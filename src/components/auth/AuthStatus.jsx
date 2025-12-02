import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const AuthStatus = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="text-sm text-gray-600">
      <span className="font-medium">{user.name}</span>
      <span className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">
        {user.role}
      </span>
    </div>
  );
};