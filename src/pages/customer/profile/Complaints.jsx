import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { useCustomer } from '../../../context/CustomerContext';

export default function Complaints() {
  const navigate = useNavigate();
  const { complaints } = useCustomer();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white p-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)}><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="font-bold text-lg">Complaints & Support</h1>
      </header>

      <div className="p-4 space-y-4 flex-1">
        {complaints.length === 0 ? (
          <div className="text-center py-10 text-text-muted">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>No complaints found.</p>
          </div>
        ) : (
          complaints.map((complaint) => (
            <div key={complaint.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-sm">{complaint.subject}</h4>
                <Badge variant={complaint.status === 'Resolved' ? 'success' : 'warning'}>
                  {complaint.status}
                </Badge>
              </div>
              <p className="text-sm text-text-muted mb-3">{complaint.description}</p>
              <div className="text-xs text-gray-400">
                Filed on: {complaint.date}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <Button fullWidth onClick={() => navigate('/customer/profile/complaints/new')}>
          <Plus className="w-5 h-5 mr-2" /> File New Complaint
        </Button>
      </div>
    </div>
  );
}
