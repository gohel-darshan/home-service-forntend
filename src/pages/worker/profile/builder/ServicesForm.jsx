import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { useWorker } from '../../../../context/WorkerContext';

export default function ServicesForm() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useWorker();
  const [services, setServices] = useState(profile.services || []);

  const addRow = () => {
    setServices([...services, { id: Date.now(), name: '', price: '' }]);
  };

  const updateRow = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = value;
    setServices(updated);
  };

  const removeRow = (index) => {
    const updated = [...services];
    updated.splice(index, 1);
    setServices(updated);
  };

  const handleSave = () => {
    updateProfile({ services });
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-4xl mx-auto">
      <header className="bg-white p-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)}><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="font-bold text-lg">Services & Pricing</h1>
      </header>

      <div className="p-6 flex-1 max-w-3xl mx-auto">
        <p className="text-sm text-text-muted mb-6">
          List the specific services you offer and your standard rates.
        </p>

        <div className="space-y-4">
          {services.map((service, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="flex-1 space-y-2">
                <input
                  placeholder="Service Name (e.g. AC Service)"
                  value={service.name}
                  onChange={(e) => updateRow(i, 'name', e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm"
                />
              </div>
              <div className="w-32 space-y-2">
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">₹</span>
                  <input
                    type="number"
                    placeholder="Price"
                    value={service.price}
                    onChange={(e) => updateRow(i, 'price', e.target.value)}
                    className="w-full pl-6 pr-3 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm font-bold"
                  />
                </div>
              </div>
              <button 
                onClick={() => removeRow(i)}
                className="p-3 text-red-500 hover:bg-red-50 rounded-xl mt-px"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <button 
          onClick={addRow}
          className="mt-6 w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold flex items-center justify-center gap-2 hover:border-primary hover:text-primary hover:bg-blue-50 transition-all"
        >
          <Plus className="w-5 h-5" /> Add Another Service
        </button>
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <Button fullWidth onClick={handleSave}>Save Services</Button>
      </div>
    </div>
  );
}
