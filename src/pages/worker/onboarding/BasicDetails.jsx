import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useWorker } from '../../../context/WorkerContext';

export default function BasicDetails() {
  const navigate = useNavigate();
  const { updateProfile, profile } = useWorker();
  const [formData, setFormData] = useState({ 
    name: profile.name || '', 
    experience: profile.experience || '', 
    bio: profile.bio || '' 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    // Explicit navigation to KYC Upload page
    navigate('/worker/kyc/upload');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white p-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)}><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="font-bold text-lg">Basic Details</h1>
      </header>

      <div className="p-6 flex-1">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 relative overflow-hidden">
            {profile.avatar ? (
               <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
               <Camera className="w-8 h-8" />
            )}
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white border-2 border-white">
              <span className="text-xl font-bold">+</span>
            </div>
          </div>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Full Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Experience (Years)</label>
            <input 
              type="text" 
              value={formData.experience}
              onChange={e => setFormData({...formData, experience: e.target.value})}
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
              placeholder="e.g. 5 Years"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">About You</label>
            <textarea 
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value})}
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary outline-none h-32 resize-none"
              placeholder="Describe your skills..."
            />
          </div>
        </form>
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <Button fullWidth onClick={handleSubmit}>Continue to KYC</Button>
      </div>
    </div>
  );
}
