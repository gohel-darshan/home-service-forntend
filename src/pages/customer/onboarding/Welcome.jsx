import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/Button';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 relative overflow-hidden">
      <div className="flex-1 flex flex-col justify-center items-center text-center z-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-64 h-64 bg-blue-50 rounded-full flex items-center justify-center mb-8"
        >
          <img src="https://cdni.iconscout.com/illustration/premium/thumb/home-service-illustration-download-in-svg-png-gif-file-formats--cleaning-cleaner-man-pack-people-illustrations-4620203.png" alt="Service" className="w-48 object-contain" />
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-primary mb-4"
        >
          Expert Services <br /> at Your Doorstep
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-text-muted text-lg"
        >
          Book trusted professionals for cleaning, repair, and more in just 3 clicks.
        </motion.p>
      </div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <Button fullWidth size="lg" onClick={() => navigate('/customer/login')}>Get Started</Button>
        <p className="text-center text-sm text-text-muted">
          Already have an account? <span className="text-primary font-bold cursor-pointer" onClick={() => navigate('/customer/login')}>Log in</span>
        </p>
      </motion.div>
    </div>
  );
}
