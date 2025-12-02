import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

const VerificationStatus = ({ status, onContinue }) => {
  const statusConfig = {
    NOT_STARTED: {
      icon: AlertCircle,
      title: 'Verification Required',
      message: 'Please complete your document verification to start receiving job requests.',
      buttonText: 'Start Verification',
      buttonAction: () => onContinue('/worker/kyc/form'),
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      borderColor: 'border-red-200'
    },
    PENDING: {
      icon: Clock,
      title: 'Verification Pending',
      message: 'Your documents are being reviewed. This usually takes 24-48 hours.',
      buttonText: 'Check Status',
      buttonAction: () => onContinue('/worker/kyc/status'),
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      borderColor: 'border-yellow-200'
    },
    REJECTED: {
      icon: AlertCircle,
      title: 'Verification Rejected',
      message: 'Your documents were rejected. Please resubmit with correct information.',
      buttonText: 'Resubmit Documents',
      buttonAction: () => onContinue('/worker/kyc/form'),
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      borderColor: 'border-red-200'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className={`max-w-md w-full p-8 text-center ${config.bgColor} ${config.borderColor} border-2`}>
        <div className={`w-16 h-16 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
          <Icon className={`w-8 h-8 ${config.iconColor}`} />
        </div>
        
        <h1 className="text-2xl font-bold mb-4">{config.title}</h1>
        <p className="text-gray-600 mb-8">{config.message}</p>
        
        <Button fullWidth onClick={config.buttonAction}>
          {config.buttonText}
        </Button>
      </Card>
    </div>
  );
};

export default function WorkerVerificationGuard({ children }) {
  const { user, isWorker } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Allow access to KYC-related routes
  const allowedRoutes = ['/worker/kyc/form', '/worker/kyc/status', '/worker/login', '/worker/register'];
  const isAllowedRoute = allowedRoutes.some(route => location.pathname.startsWith(route));

  useEffect(() => {
    if (isWorker() && !isAllowedRoute) {
      const kycStatus = user?.workerProfile?.kycStatus || 'NOT_STARTED';
      
      // If verified, redirect to dashboard if on root worker route
      if (kycStatus === 'VERIFIED' && location.pathname === '/worker') {
        navigate('/worker/dashboard', { replace: true });
      }
    }
  }, [user, isWorker, isAllowedRoute, location.pathname, navigate]);

  // If not a worker or on allowed route, render children
  if (!isWorker() || isAllowedRoute) {
    return children;
  }

  // Check verification status
  const kycStatus = user?.workerProfile?.kycStatus || 'NOT_STARTED';
  
  if (kycStatus === 'VERIFIED') {
    return children;
  }

  // Show verification status screen for unverified workers
  return (
    <VerificationStatus 
      status={kycStatus} 
      onContinue={(path) => navigate(path)}
    />
  );
}