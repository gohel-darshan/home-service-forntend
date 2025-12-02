import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

export const DashboardRedirect = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (isAuthenticated && user) {
    switch (user.role) {
      case 'CUSTOMER':
        return <Navigate to="/customer" replace />;
      case 'WORKER':
        // Check if worker is verified
        const kycStatus = user?.workerProfile?.kycStatus || 'NOT_STARTED';
        if (kycStatus === 'VERIFIED') {
          return <Navigate to="/worker/dashboard" replace />;
        } else {
          return <Navigate to="/worker" replace />;
        }
      case 'ADMIN':
        return <Navigate to="/admin" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <Navigate to="/" replace />;
};