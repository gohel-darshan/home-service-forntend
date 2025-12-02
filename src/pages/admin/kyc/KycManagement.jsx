import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, User, Phone, Mail, Calendar } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { adminAPI } from '../../../lib/api';
import toast from 'react-hot-toast';

export default function KycManagement() {
  const [pendingKyc, setPendingKyc] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingKyc();
  }, []);

  const loadPendingKyc = async () => {
    try {
      const response = await adminAPI.getPendingKyc();
      setPendingKyc(response.data);
    } catch (error) {
      toast.error('Failed to load KYC requests');
    } finally {
      setLoading(false);
    }
  };

  const handleKycAction = async (workerId, status) => {
    try {
      await adminAPI.updateKycStatus(workerId, { status });
      toast.success(`KYC ${status.toLowerCase()} successfully`);
      loadPendingKyc();
    } catch (error) {
      toast.error(`Failed to ${status.toLowerCase()} KYC`);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">KYC Management</h1>
        <p className="text-gray-600">Review and approve worker verification documents</p>
      </div>

      {pendingKyc.length === 0 ? (
        <Card className="p-8 text-center">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending KYC Requests</h3>
          <p className="text-gray-500">All KYC requests have been processed</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingKyc.map((worker) => (
            <Card key={worker.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{worker.user.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-4 h-4" />
                        <span>{worker.user.email}</span>
                      </div>
                      {worker.user.phone && (
                        <div className="flex items-center space-x-1">
                          <Phone className="w-4 h-4" />
                          <span>{worker.user.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Badge variant="warning">
                  <Clock className="w-3 h-3 mr-1" />
                  Pending Review
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Aadhar Card</h4>
                  <div className="text-sm text-gray-600">
                    {worker.aadharCard ? (
                      <span className="text-green-600">✓ Uploaded</span>
                    ) : (
                      <span className="text-red-600">✗ Not uploaded</span>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">PAN Card</h4>
                  <div className="text-sm text-gray-600">
                    {worker.panCard ? (
                      <span className="text-green-600">✓ Uploaded</span>
                    ) : (
                      <span className="text-red-600">✗ Not uploaded</span>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Profile Photo</h4>
                  <div className="text-sm text-gray-600">
                    {worker.profilePhoto ? (
                      <span className="text-green-600">✓ Uploaded</span>
                    ) : (
                      <span className="text-red-600">✗ Not uploaded</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Applied: {new Date(worker.user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleKycAction(worker.id, 'REJECTED')}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleKycAction(worker.id, 'VERIFIED')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}