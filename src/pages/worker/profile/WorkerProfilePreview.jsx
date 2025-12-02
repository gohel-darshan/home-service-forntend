import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Star, MapPin, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useWorker } from '../../../context/WorkerContext';
import { Button } from '../../../components/ui/Button';

export default function WorkerProfilePreview() {
  const navigate = useNavigate();
  const { profile } = useWorker();

  return (
    <div className="pb-24 bg-background min-h-screen flex flex-col">
      <div className="flex-1 relative">
        {/* Header / Back */}
        <div className="absolute top-4 left-4 z-20">
            <button 
                onClick={() => navigate(-1)}
                className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>
        </div>

        {/* Hero Image */}
        <div className="relative h-72 bg-gray-200">
            <img src="https://images.unsplash.com/photo-1581578731117-104f2a863a38?w=800" alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
            <button 
            onClick={() => navigate('/worker/profile/builder')}
            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30"
            >
            <Edit2 className="w-5 h-5" />
            </button>
        </div>

        {/* Profile Info */}
        <div className="px-6 -mt-12 relative z-10">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex justify-between items-start mb-4">
                <div>
                <h1 className="text-2xl font-bold text-text">{profile.name}</h1>
                <p className="text-text-muted font-medium">{profile.profession}</p>
                </div>
                {profile.kycStatus === 'verified' && (
                <div className="flex flex-col items-end text-secondary">
                    <ShieldCheck className="w-6 h-6" />
                    <span className="text-xs font-bold">Verified</span>
                </div>
                )}
            </div>

            <div className="flex gap-4 border-b border-gray-100 pb-4 mb-4">
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-yellow-700">4.8</span>
                </div>
                <div className="flex items-center gap-1 text-text-muted">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Gurgaon</span>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                <h3 className="font-bold mb-2 text-sm uppercase text-text-muted">Skills</h3>
                <div className="flex flex-wrap gap-2">
                    {profile.skills.map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-lg font-medium">
                        {skill}
                    </span>
                    ))}
                </div>
                </div>

                <div>
                <h3 className="font-bold mb-2 text-sm uppercase text-text-muted">Services</h3>
                <div className="space-y-2">
                    {profile.services.map(s => (
                    <div key={s.id} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                        <span>{s.name}</span>
                        <span className="font-bold">₹{s.price}</span>
                    </div>
                    ))}
                </div>
                </div>

                <div>
                <h3 className="font-bold mb-2 text-sm uppercase text-text-muted">Portfolio</h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {profile.portfolio.map((img, i) => (
                    <img key={i} src={img} className="w-24 h-24 rounded-lg object-cover bg-gray-100" />
                    ))}
                </div>
                </div>
            </div>
            </div>
        </div>
      </div>

      {/* Final Action */}
      <div className="p-4 bg-white border-t border-gray-200">
        <Button fullWidth size="lg" onClick={() => navigate('/worker')}>
            Looks Good! Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
