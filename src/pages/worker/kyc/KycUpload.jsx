import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud, Check } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useWorker } from '../../../context/WorkerContext';

const UploadBox = ({ label, done, onClick }) => (
  <div 
    onClick={onClick}
    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
      done ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-primary hover:bg-blue-50'
    }`}
  >
    {done ? <Check className="w-8 h-8 text-green-600" /> : <UploadCloud className="w-8 h-8 text-gray-400" />}
    <span className={`font-medium text-sm ${done ? 'text-green-700' : 'text-gray-500'}`}>
      {done ? 'Uploaded' : `Upload ${label}`}
    </span>
  </div>
);

export default function KycUpload() {
  const navigate = useNavigate();
  const { updateKycStatus } = useWorker();
  const [uploads, setUploads] = useState({ aadhaar: false, pan: false, selfie: false });

  const handleUpload = (type) => {
    // Simulate upload
    setUploads(prev => ({ ...prev, [type]: true }));
  };

  const handleSubmit = () => {
    updateKycStatus('pending');
    navigate('/worker/kyc/status');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white p-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)}><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="font-bold text-lg">KYC Verification</h1>
      </header>

      <div className="p-6 flex-1 space-y-6">
        <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800">
          Please upload clear photos of your documents to get verified.
        </div>

        <div className="space-y-4">
          <UploadBox label="Aadhaar Card" done={uploads.aadhaar} onClick={() => handleUpload('aadhaar')} />
          <UploadBox label="PAN Card" done={uploads.pan} onClick={() => handleUpload('pan')} />
          <UploadBox label="Selfie" done={uploads.selfie} onClick={() => handleUpload('selfie')} />
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <Button 
          fullWidth 
          disabled={!uploads.aadhaar || !uploads.pan || !uploads.selfie} 
          onClick={handleSubmit}
        >
          Submit for Verification
        </Button>
      </div>
    </div>
  );
}
