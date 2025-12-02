import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

export const RouteGuard = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      const currentPath = location.pathname;
      
      // Define role-based default routes
      const roleRoutes = {
        CUSTOMER: '/customer',
        WORKER: '/worker', 
        ADMIN: '/admin'
      };

      // If user is on root path, redirect to their dashboard
      if (currentPath === '/') {
        navigate(roleRoutes[user.role] || '/');
        return;
      }

      // Check if user is accessing wrong role area
      const userRole = user.role;
      if (userRole === 'CUSTOMER' && currentPath.startsWith('/worker')) {
        navigate('/customer');
        return;
      }
      if (userRole === 'CUSTOMER' && currentPath.startsWith('/admin')) {
        navigate('/customer');
        return;
      }
      if (userRole === 'WORKER' && currentPath.startsWith('/customer')) {
        navigate('/worker');
        return;
      }
      if (userRole === 'WORKER' && currentPath.startsWith('/admin')) {
        navigate('/worker');
        return;
      }
      if (userRole === 'ADMIN' && currentPath.startsWith('/customer')) {
        navigate('/admin');
        return;
      }
      if (userRole === 'ADMIN' && currentPath.startsWith('/worker')) {
        navigate('/admin');
        return;
      }
    }
  }, [user, loading, isAuthenticated, navigate, location.pathname]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return children;
};