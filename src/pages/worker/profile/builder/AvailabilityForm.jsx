import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { useWorker } from '../../../../context/WorkerContext';

const DAYS = [
  { id: 'mon', label: 'Monday' },
  { id: 'tue', label: 'Tuesday' },
  { id: 'wed', label: 'Wednesday' },
  { id: 'thu', label: 'Thursday' },
  { id: 'fri', label: 'Friday' },
  { id: 'sat', label: 'Saturday' },
  { id: 'sun', label: 'Sunday' },
];

export default function AvailabilityForm() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useWorker();
  const [availability, setAvailability] = useState(profile.availability || {});

  const toggleDay = (dayId) => {
    setAvailability(prev => ({
      ...prev,
      [dayId]: !prev[dayId]
    }));
  };

  const handleSave = () => {
    updateProfile({ availability });
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white p-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)}><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="font-bold text-lg">Set Availability</h1>
      </header>

      <div className="p-6 flex-1">
        <p className="text-sm text-text-muted mb-6">
          Select the days you are available to accept jobs.
        </p>

        <div className="space-y-3">
          {DAYS.map((day) => (
            <div 
              key={day.id}
              onClick={() => toggleDay(day.id)}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                availability[day.id] 
                  ? 'bg-white border-primary shadow-sm' 
                  : 'bg-gray-50 border-transparent opacity-60'
              }`}
            >
              <span className={`font-bold ${availability[day.id] ? 'text-text' : 'text-gray-400'}`}>
                {day.label}
              </span>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                availability[day.id] 
                  ? 'bg-primary border-primary text-white' 
                  : 'border-gray-300 bg-white'
              }`}>
                {availability[day.id] && <Check className="w-4 h-4" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <Button fullWidth onClick={handleSave}>Save Availability</Button>
      </div>
    </div>
  );
}
