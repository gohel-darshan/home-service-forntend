import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useWorker } from '../../../context/WorkerContext';

const professions = [
  { id: 'ac', name: 'AC Technician', icon: '❄️' },
  { id: 'plumber', name: 'Plumber', icon: '🔧' },
  { id: 'electrician', name: 'Electrician', icon: '⚡' },
  { id: 'cleaner', name: 'Cleaner', icon: '🧹' },
  { id: 'painter', name: 'Painter', icon: '🎨' },
  { id: 'carpenter', name: 'Carpenter', icon: '🔨' }
];

export default function SelectProfession() {
  const navigate = useNavigate();
  const { updateProfile } = useWorker();
  const [selected, setSelected] = useState(null);

  const handleContinue = () => {
    if (!selected) return;
    updateProfile({ profession: selected.name });
    navigate('/worker/onboarding/details');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white p-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)}><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="font-bold text-lg">Select Profession</h1>
      </header>

      <div className="p-6 grid grid-cols-2 gap-4 flex-1 content-start">
        {professions.map((prof) => (
          <div 
            key={prof.id}
            onClick={() => setSelected(prof)}
            className={`bg-white p-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
              selected?.id === prof.id ? 'border-primary bg-blue-50' : 'border-transparent shadow-sm'
            }`}
          >
            <span className="text-4xl">{prof.icon}</span>
            <span className="font-bold text-sm text-center">{prof.name}</span>
            {selected?.id === prof.id && <CheckCircle2 className="w-5 h-5 text-primary absolute top-2 right-2" />}
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <Button fullWidth disabled={!selected} onClick={handleContinue}>Continue</Button>
      </div>
    </div>
  );
}
