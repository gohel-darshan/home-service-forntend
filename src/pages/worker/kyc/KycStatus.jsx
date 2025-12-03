import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../context/AuthContext';
import { workersAPI } from '../../../lib/api';
import toast from 'react-hot-toast';

export default function KycStatus() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const kycStatus = user?.workerProfile?.kycStatus || 'NOT_STARTED';

  // Auto redirect to dashboard when KYC is verified
  useEffect(() => {
    if (kycStatus === 'VERIFIED') {
      toast.success('KYC Approved! Welcome to your dashboard');
      navigate('/worker');
    }
  }, [kycStatus, navigate]);

  // Simulation helper for demo
  const simulateApproval = async () => {
    try {
      // In real app, this would be done by admin
      // The useEffect will handle the redirect automatically
      toast.success('KYC Approved! (Demo)');
    } catch (error) {
      toast.error('Failed to approve KYC');
    }
  };

  const renderStatus = () => {
    switch (kycStatus) {
      case 'PENDING':
        return (
          <>
            <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Clock className="w-12 h-12 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Verification Pending</h1>
            <p className="text-gray-600 mb-8">
              We are reviewing your documents. This usually takes 24-48 hours.
            </p>
            <div className="space-y-3">
              <Button variant="ghost" onClick={simulateApproval}>
                Simulate Admin Approval (Demo)
              </Button>
              <Button variant="outline" onClick={() => navigate('/worker/kyc/form')}>
                Update Documents
              </Button>
            </div>
          </>
        );

      case 'VERIFIED':
        return (
          <>
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">You are Verified!</h1>
            <p className="text-gray-600 mb-8">
              Your profile is now active. You can start receiving job requests.
            </p>
            <Button fullWidth onClick={() => navigate('/worker')}>
              Go to Dashboard
            </Button>
          </>
        );

      case 'REJECTED':
        return (
          <>
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Verification Rejected</h1>
            <p className="text-gray-600 mb-8">
              Your documents were rejected. Please resubmit with correct information.
            </p>
            <Button fullWidth onClick={() => navigate('/worker/kyc/form')}>
              Resubmit Documents
            </Button>
          </>
        );

      default:
        return (
          <>
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-12 h-12 text-gray-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Verification Required</h1>
            <p className="text-gray-600 mb-8">
              Please complete your document verification to start receiving jobs.
            </p>
            <Button fullWidth onClick={() => navigate('/worker/kyc/form')}>
              Start Verification
            </Button>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white p-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-lg">Verification Status</h1>
      </header>
      
      <div className="flex flex-col items-center justify-center p-6 text-center min-h-[calc(100vh-80px)]">
        {renderStatus()}
      </div>
    </div>
  );
}
