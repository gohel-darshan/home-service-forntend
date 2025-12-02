import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, Phone } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'CUSTOMER'
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) return;
    
    setLoading(true);
    const result = await register(formData);
    setLoading(false);
    
    if (result.success) {
      navigate('/customer/login');
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <button onClick={() => navigate(-1)} className="mb-8">
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Create Account</h1>
        <p className="text-text-muted">Join us to book home services</p>
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
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <div className="text-center">
          <p className="text-text-muted">
            Already have an account?{' '}
            <button 
              type="button"
              onClick={() => navigate('/customer/login')}
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