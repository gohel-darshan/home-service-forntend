import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Camera, User, CreditCard, FileText } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { useAuth } from '../../../context/AuthContext';
import { workersAPI } from '../../../lib/api';
import toast from 'react-hot-toast';

const FileUpload = ({ label, icon: Icon, file, onFileSelect, required = true }) => (
  <Card className="p-4 border-2 border-dashed border-gray-300 hover:border-primary transition-colors">
    <div className="flex flex-col items-center text-center">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-gray-600" />
      </div>
      <h3 className="font-medium mb-1">{label}</h3>
      {required && <p className="text-xs text-red-500 mb-3">Required</p>}
      
      {file ? (
        <div className="w-full">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
            <p className="text-sm text-green-700 font-medium">{file.name}</p>
            <p className="text-xs text-green-600">File uploaded successfully</p>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => document.getElementById(`file-${label.replace(/\s+/g, '-').toLowerCase()}`).click()}
          >
            Change File
          </Button>
        </div>
      ) : (
        <Button 
          size="sm"
          onClick={() => document.getElementById(`file-${label.replace(/\s+/g, '-').toLowerCase()}`).click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload File
        </Button>
      )}
      
      <input
        id={`file-${label.replace(/\s+/g, '-').toLowerCase()}`}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFileSelect(e.target.files[0])}
      />
    </div>
  </Card>
);

export default function KycForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState({
    aadharCard: null,
    panCard: null,
    profilePhoto: null
  });

  const handleFileSelect = (type, file) => {
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
    }
  };

  const handleSubmit = async () => {
    if (!files.aadharCard || !files.panCard || !files.profilePhoto) {
      toast.error('Please upload all required documents');
      return;
    }

    setLoading(true);
    try {
      // In a real implementation, you would upload files to cloud storage first
      // For demo, we'll simulate file URLs
      const kycData = {
        userId: user.id,
        aadharCard: `aadhar_${user.id}_${Date.now()}.jpg`,
        panCard: `pan_${user.id}_${Date.now()}.jpg`,
        profilePhoto: `profile_${user.id}_${Date.now()}.jpg`
      };

      await workersAPI.submitKyc(kycData);
      
      toast.success('Documents submitted successfully!');
      navigate('/worker/kyc/status');
    } catch (error) {
      toast.error('Failed to submit documents');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white p-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-lg">Complete Verification</h1>
      </header>

      <div className="p-6 max-w-md mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="font-medium text-blue-900 mb-2">Document Verification Required</h2>
          <p className="text-sm text-blue-700">
            Please upload clear photos of your documents to get verified and start receiving job requests.
          </p>
        </div>

        <div className="space-y-6">
          <FileUpload
            label="Aadhar Card"
            icon={CreditCard}
            file={files.aadharCard}
            onFileSelect={(file) => handleFileSelect('aadharCard', file)}
          />

          <FileUpload
            label="PAN Card"
            icon={FileText}
            file={files.panCard}
            onFileSelect={(file) => handleFileSelect('panCard', file)}
          />

          <FileUpload
            label="Profile Photo"
            icon={User}
            file={files.profilePhoto}
            onFileSelect={(file) => handleFileSelect('profilePhoto', file)}
          />
        </div>

        <div className="mt-8">
          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={loading || !files.aadharCard || !files.panCard || !files.profilePhoto}
          >
            {loading ? 'Submitting...' : 'Submit for Verification'}
          </Button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Your documents will be reviewed within 24-48 hours
          </p>
        </div>
      </div>
    </div>
  );
}