import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { motion } from 'framer-motion';

export default function LocationPermission() {
  const navigate = useNavigate();

  const handleAllow = () => {
    // In a real app, request browser permission here
    navigate('/customer');
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col items-center justify-center text-center">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mb-8"
      >
        <MapPin className="w-16 h-16 text-primary" />
      </motion.div>

      <h1 className="text-2xl font-bold mb-4">Enable Location</h1>
      <p className="text-text-muted mb-12 max-w-xs">
        We need your location to find the best professionals in your neighborhood.
      </p>

      <div className="w-full space-y-4">
        <Button fullWidth onClick={handleAllow}>Allow Location Access</Button>
        <Button fullWidth variant="ghost" onClick={() => navigate('/customer')}>Enter Manually</Button>
      </div>
    </div>
  );
}
