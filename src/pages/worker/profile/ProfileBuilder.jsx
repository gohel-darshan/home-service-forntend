import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ChevronRight } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useWorker } from '../../../context/WorkerContext';

const Step = ({ title, desc, done, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between cursor-pointer hover:shadow-sm transition-all mb-3"
  >
    <div>
      <h4 className="font-bold text-sm">{title}</h4>
      <p className="text-xs text-text-muted">{desc}</p>
    </div>
    {done ? <CheckCircle className="w-5 h-5 text-green-500" /> : <ChevronRight className="w-5 h-5 text-gray-300" />}
  </div>
);

export default function ProfileBuilder() {
  const navigate = useNavigate();
  const { profile } = useWorker();

  const hasSkills = profile.skills && profile.skills.length > 0;
  const hasServices = profile.services && profile.services.length > 0;
  const hasAvailability = profile.availability && Object.values(profile.availability).some(v => v);
  const hasPortfolio = profile.portfolio && profile.portfolio.length > 0;

  // Calculate progress
  const steps = [hasSkills, hasServices, hasAvailability, hasPortfolio];
  const completed = steps.filter(Boolean).length;
  const progress = (completed / 4) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-4xl mx-auto">
      <header className="bg-white p-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate('/worker/kyc/status')}><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="font-bold text-lg">Complete Profile</h1>
      </header>

      <div className="p-6 flex-1 max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-right text-xs font-bold text-primary mt-1">{progress}% Completed</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Step 
            title="Skills" 
            desc="Add your expertise" 
            done={hasSkills} 
            onClick={() => navigate('/worker/profile/builder/skills')} 
          />
          <Step 
            title="Services & Pricing" 
            desc="Set your rates" 
            done={hasServices} 
            onClick={() => navigate('/worker/profile/builder/services')} 
          />
          <Step 
            title="Availability" 
            desc="Set working days" 
            done={hasAvailability} 
            onClick={() => navigate('/worker/profile/builder/availability')} 
          />
          <Step 
            title="Portfolio" 
            desc="Upload photos/videos" 
            done={hasPortfolio} 
            onClick={() => navigate('/worker/profile/builder/portfolio')} 
          />
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <Button fullWidth onClick={() => navigate('/worker/profile/preview')}>Preview Profile</Button>
      </div>
    </div>
  );
}
