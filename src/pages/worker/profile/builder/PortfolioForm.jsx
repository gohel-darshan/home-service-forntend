import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud, X } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { useWorker } from '../../../../context/WorkerContext';

export default function PortfolioForm() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useWorker();
  const [portfolio, setPortfolio] = useState(profile.portfolio || []);

  const addImage = () => {
    // Mock image upload
    const newImage = "https://images.unsplash.com/photo-1581578731117-104f2a863a38?auto=format&fit=crop&q=80&w=400";
    setPortfolio([...portfolio, newImage]);
  };

  const removeImage = (index) => {
    const updated = [...portfolio];
    updated.splice(index, 1);
    setPortfolio(updated);
  };

  const handleSave = () => {
    updateProfile({ portfolio });
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white p-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)}><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="font-bold text-lg">Portfolio</h1>
      </header>

      <div className="p-6 flex-1">
        <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 mb-6">
          Upload photos of your past work to build trust with customers.
        </div>

        <div className="grid grid-cols-2 gap-4">
          {portfolio.map((img, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button 
                onClick={() => removeImage(i)}
                className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          <button 
            onClick={addImage}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary hover:bg-blue-50 transition-all"
          >
            <UploadCloud className="w-8 h-8 mb-2" />
            <span className="text-xs font-bold">Upload Photo</span>
          </button>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <Button fullWidth onClick={handleSave}>Save Portfolio</Button>
      </div>
    </div>
  );
}
