import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../context/AuthContext';

export default function WorkerLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;
    
    setLoading(true);
    const result = await login(formData, 'worker');
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
        <h1 className="text-2xl font-bold mb-2">Worker Login</h1>
        <p className="text-text-muted">Sign in to manage your jobs</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-4">
          <div className="flex gap-3 items-center border-b-2 border-gray-200 py-3 focus-within:border-primary transition-colors">
            <Mail className="w-5 h-5 text-gray-400" />
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full text-lg outline-none bg-transparent"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="flex gap-3 items-center border-b-2 border-gray-200 py-3 focus-within:border-primary transition-colors">
            <Lock className="w-5 h-5 text-gray-400" />
            <input 
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full text-lg outline-none bg-transparent"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

        <Button fullWidth type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>

        <div className="text-center">
          <p className="text-text-muted">
            New worker?{' '}
            <button 
              type="button"
              onClick={() => navigate('/worker/register')}
              className="text-primary font-bold"
            >
              Join Us
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}