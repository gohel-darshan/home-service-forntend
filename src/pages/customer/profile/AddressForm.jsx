import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useCustomer } from '../../../context/CustomerContext';

export default function AddressForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addresses, addAddress, updateAddress } = useCustomer();
  
  const [formData, setFormData] = useState({
    type: 'Home',
    text: ''
  });

  useEffect(() => {
    if (id) {
      const existing = addresses.find(a => a.id === id);
      if (existing) setFormData(existing);
    }
  }, [id, addresses]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.text) return;
    
    if (id) {
      updateAddress(id, formData);
    } else {
      addAddress(formData);
    }
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white p-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)}><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="font-bold text-lg">{id ? 'Edit Address' : 'Add New Address'}</h1>
      </header>

      <div className="p-6 flex-1 space-y-6">
        {/* Map Placeholder */}
        <div className="h-48 bg-gray-200 rounded-xl flex items-center justify-center relative overflow-hidden">
          <MapPin className="w-8 h-8 text-gray-400 mb-2" />
          <div className="absolute bottom-2 bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            Pin Location on Map
          </div>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">Label</label>
            <div className="flex gap-3">
              {['Home', 'Office', 'Other'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({...formData, type})}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    formData.type === type 
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-white text-text border-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Full Address</label>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData({...formData, text: e.target.value})}
              placeholder="House No, Building, Street, Area..."
              className="w-full p-3 h-32 rounded-xl border border-gray-200 focus:border-primary outline-none resize-none"
            />
          </div>
        </form>
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <Button fullWidth onClick={handleSubmit}>Save Address</Button>
      </div>
    </div>
  );
}
