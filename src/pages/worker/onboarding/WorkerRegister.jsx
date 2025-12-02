import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, Phone, Briefcase } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../context/AuthContext';

export default function WorkerRegister() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'WORKER',
    profession: '',
    experience: '',
    hourlyRate: ''
  });
  const [loading, setLoading] = useState(false);

  const professions = [
    'House Cleaning', 'Plumbing', 'Electrical Work', 'Gardening',
    'Painting', 'Carpentry', 'AC Repair', 'Appliance Repair'
  ];

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.profession) return;
    
    setLoading(true);
    const result = await register(formData);
    setLoading(false);
    
    if (result.success) {
      navigate('/worker');
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <button onClick={() => navigate(-1)} className="mb-8">
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Join as Worker</h1>
        <p className="text-text-muted">Start earning by providing services</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-6">
        <div className="space-y-4">
          <div className="flex gap-3 items-center border-b-2 border-gray-200 py-3 focus-within:border-primary transition-colors">
            <User className="w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full text-lg outline-none bg-transparent"
              placeholder="Full Name"
              required
            />
          </div>

          <div className="flex gap-3 items-center border-b-2 border-gray-200 py-3 focus-within:border-primary transition-colors">
            <Mail className="w-5 h-5 text-gray-400" />
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full text-lg outline-none bg-transparent"
              placeholder="Email Address"
              required
            />
          </div>

          <div className="flex gap-3 items-center border-b-2 border-gray-200 py-3 focus-within:border-primary transition-colors">
            <Phone className="w-5 h-5 text-gray-400" />
            <input 
              type="tel" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full text-lg outline-none bg-transparent"
              placeholder="Phone Number"
            />
          </div>

          <div className="flex gap-3 items-center border-b-2 border-gray-200 py-3 focus-within:border-primary transition-colors">
            <Briefcase className="w-5 h-5 text-gray-400" />
            <select 
              value={formData.profession}
              onChange={(e) => setFormData({...formData, profession: e.target.value})}
              className="w-full text-lg outline-none bg-transparent"
              required
            >
              <option value="">Select Profession</option>
              {professions.map(prof => (
                <option key={prof} value={prof}>{prof}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex gap-3 items-center border-b-2 border-gray-200 py-3 focus-within:border-primary transition-colors">
              <input 
                type="number" 
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                className="w-full text-lg outline-none bg-transparent"
                placeholder="Experience (years)"
                min="0"
              />
            </div>

            <div className="flex gap-3 items-center border-b-2 border-gray-200 py-3 focus-within:border-primary transition-colors">
              <input 
                type="number" 
                value={formData.hourlyRate}
                onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                className="w-full text-lg outline-none bg-transparent"
                placeholder="Rate (₹/hr)"
                min="0"
              />
            </div>
          </div>
          
          <div className="flex gap-3 items-center border-b-2 border-gray-200 py-3 focus-within:border-primary transition-colors">
            <Lock className="w-5 h-5 text-gray-400" />
            <input 
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full text-lg outline-none bg-transparent"
              placeholder="Password"
              required
            />
          </div>
        </div>

        <Button fullWidth type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Join as Worker'}
        </Button>

        <div className="text-center">
          <p className="text-text-muted">
            Already registered?{' '}
            <button 
              type="button"
              onClick={() => navigate('/worker/login')}
              className="text-primary font-bold"
            >
              Sign In
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}