import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useWorker } from '../../../context/WorkerContext';

export default function CompleteJob() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { updateJobStatus } = useWorker();
  const [photos, setPhotos] = useState([]);

  const handleAddPhoto = () => {
    // Simulate photo add
    setPhotos([...photos, "https://images.unsplash.com/photo-1581092921461-eab62e97a783?w=200"]);
  };

  const handleSubmit = () => {
    updateJobStatus(id, 'completed');
    navigate('/worker/jobs');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white p-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)}><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="font-bold text-lg">Complete Job</h1>
      </header>

      <div className="p-6 flex-1">
        <h2 className="font-bold text-lg mb-2">Upload Proof of Work</h2>
        <p className="text-text-muted text-sm mb-6">Please upload photos of the completed work to process the payment.</p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {photos.map((photo, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
              <img src={photo} alt="" className="w-full h-full object-cover" />
              <button className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button 
            onClick={handleAddPhoto}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary hover:bg-blue-50 transition-all"
          >
            <Camera className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Add Photo</span>
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h3 className="font-bold text-sm mb-2">Payment Summary</h3>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-text-muted">Service Charge</span>
            <span>₹450</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-primary pt-2 border-t border-gray-200 mt-2">
            <span>Total to Collect</span>
            <span>₹450</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <Button fullWidth onClick={handleSubmit}>Mark as Completed</Button>
      </div>
    </div>
  );
}
