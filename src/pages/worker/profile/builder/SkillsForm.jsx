import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Plus } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { useWorker } from '../../../../context/WorkerContext';

const SUGGESTED_SKILLS = [
  'Installation', 'Repair', 'Maintenance', 'Cleaning', 
  'Gas Refill', 'Wiring', 'Inspection', 'Emergency'
];

export default function SkillsForm() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useWorker();
  const [skills, setSkills] = useState(profile.skills || []);
  const [customSkill, setCustomSkill] = useState('');

  const toggleSkill = (skill) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const addCustomSkill = (e) => {
    e.preventDefault();
    if (customSkill && !skills.includes(customSkill)) {
      setSkills([...skills, customSkill]);
      setCustomSkill('');
    }
  };

  const handleSave = () => {
    updateProfile({ skills });
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-4xl mx-auto">
      <header className="bg-white p-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)}><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="font-bold text-lg">Add Skills</h1>
      </header>

      <div className="p-6 flex-1 max-w-3xl mx-auto">
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-muted mb-2">Selected Skills</label>
          <div className="flex flex-wrap gap-2 min-h-[50px] p-3 bg-white rounded-xl border border-gray-200">
            {skills.length === 0 && <span className="text-gray-400 text-sm">No skills selected</span>}
            {skills.map(skill => (
              <span key={skill} className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-lg flex items-center gap-2">
                {skill}
                <button onClick={() => toggleSkill(skill)}><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-text-muted mb-2">Suggested Skills</label>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_SKILLS.map(skill => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  skills.includes(skill) 
                    ? 'bg-primary text-white border-primary' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={addCustomSkill}>
          <label className="block text-sm font-medium text-text-muted mb-2">Add Custom Skill</label>
          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              placeholder="e.g. Smart Home Setup"
              className="flex-1 p-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
            />
            <button type="submit" className="p-3 bg-gray-900 text-white rounded-xl">
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </form>
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <Button fullWidth onClick={handleSave}>Save Skills</Button>
      </div>
    </div>
  );
}
