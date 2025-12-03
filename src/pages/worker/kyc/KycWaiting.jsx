import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

export default function KycWaiting() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const kycStatus = user?.workerProfile?.kycStatus || 'PENDING';

  // Auto redirect to dashboard when KYC is verified
  useEffect(() => {
    if (kycStatus === 'VERIFIED') {
      toast.success('KYC Approved! Welcome to your dashboard');
      navigate('/worker');
    }
  }, [kycStatus, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <Clock className="w-12 h-12 text-yellow-600" />
      </div>
      
      <h1 className="text-2xl font-bold mb-2">Waiting for Admin Approval</h1>
      <p className="text-gray-600 mb-4">
        Your documents have been submitted successfully!
      </p>
      <p className="text-sm text-gray-500 mb-8">
        We are reviewing your documents. This usually takes 24-48 hours.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-sm">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">Documents Submitted</span>
        </div>
        <p className="text-xs text-blue-700">
          You will be automatically redirected once approved
        </p>
      </div>
    </div>
  );
}