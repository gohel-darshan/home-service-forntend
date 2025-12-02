import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const RoleCard = ({ onClick, icon: Icon, title, desc, color }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    onClick={onClick}
    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer"
  >
    <div className={`p-4 rounded-full ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div className="flex-1">
      <h3 className="font-bold text-lg text-text">{title}</h3>
      <p className="text-sm text-text-muted">{desc}</p>
    </div>
  </motion.div>
);

export default function Landing() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to their dashboard
  React.useEffect(() => {
    if (isAuthenticated && user) {
      switch (user.role) {
        case 'CUSTOMER':
          navigate('/customer');
          break;
        case 'WORKER':
          navigate('/worker');
          break;
        case 'ADMIN':
          navigate('/admin');
          break;
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleRoleSelect = (role) => {
    switch (role) {
      case 'user':
        navigate('/auth/user');
        break;
      case 'worker':
        navigate('/auth/worker');
        break;
      case 'admin':
        navigate('/admin/login');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary">Home Service</h1>
          <p className="text-text-muted">Choose your role to continue</p>
        </div>

        <div className="space-y-4">
          <RoleCard 
            onClick={() => handleRoleSelect('user')}
            icon={User} 
            title="I'm a User" 
            desc="Book home services" 
            color="bg-blue-500"
          />
          <RoleCard 
            onClick={() => handleRoleSelect('worker')}
            icon={Briefcase} 
            title="I'm a Worker" 
            desc="Provide home services" 
            color="bg-green-500"
          />
          <RoleCard 
            onClick={() => handleRoleSelect('admin')}
            icon={ShieldCheck} 
            title="Admin Login" 
            desc="Manage platform" 
            color="bg-gray-800"
          />
        </div>
      </div>
    </div>
  );
}
