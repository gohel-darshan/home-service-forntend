import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

export const CustomerRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/auth/user" state={{ from: location }} replace />;
  }

  if (user?.role !== 'CUSTOMER') {
    const redirectPath = user?.role === 'WORKER' ? '/worker' : user?.role === 'ADMIN' ? '/admin' : '/auth/user';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export const WorkerRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/auth/worker" state={{ from: location }} replace />;
  }

  if (user?.role !== 'WORKER') {
    const redirectPath = user?.role === 'CUSTOMER' ? '/customer' : user?.role === 'ADMIN' ? '/admin' : '/auth/worker';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'ADMIN') {
    const redirectPath = user?.role === 'CUSTOMER' ? '/customer' : user?.role === 'WORKER' ? '/worker' : '/admin/login';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

// Public route that redirects authenticated users to their dashboard
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  if (isAuthenticated && user) {
    const dashboardPath = 
      user.role === 'CUSTOMER' ? '/customer' : 
      user.role === 'WORKER' ? '/worker' : 
      user.role === 'ADMIN' ? '/admin' : '/';
    return <Navigate to={dashboardPath} replace />;
  }
  
  return children;
};
