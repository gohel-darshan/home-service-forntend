import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Trash2, Edit2, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useCustomer } from '../../../context/CustomerContext';

export default function Addresses() {
  const navigate = useNavigate();
  const { addresses, deleteAddress } = useCustomer();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white p-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)}><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="font-bold text-lg">Manage Addresses</h1>
      </header>

      <div className="p-4 space-y-4 flex-1">
        {addresses.length === 0 ? (
          <div className="text-center py-10 text-text-muted">
            <MapPin className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>No addresses saved yet.</p>
          </div>
        ) : (
          addresses.map((addr) => (
            <div key={addr.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-blue-50 rounded-full">
                   <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{addr.type}</h4>
                  <p className="text-sm text-text-muted">{addr.text}</p>
                </div>
              </div>
              <div className="flex gap-2 justify-end border-t border-gray-50 pt-3">
                <button 
                  onClick={() => navigate(`/customer/profile/addresses/edit/${addr.id}`)}
                  className="text-xs font-medium text-gray-500 flex items-center gap-1 px-3 py-1.5 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
                <button 
                  onClick={() => deleteAddress(addr.id)}
                  className="text-xs font-medium text-red-500 flex items-center gap-1 px-3 py-1.5 bg-red-50 rounded-lg hover:bg-red-100"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <Button fullWidth onClick={() => navigate('/customer/profile/addresses/new')}>
          <Plus className="w-5 h-5 mr-2" /> Add New Address
        </Button>
      </div>
    </div>
  );
}
