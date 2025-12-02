import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Phone, MessageSquare, CheckCircle2, MapPin } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { motion } from 'framer-motion';
import { bookingsAPI } from '../../../lib/api';
import toast from 'react-hot-toast';

const steps = [
  { title: 'Booking Accepted', time: '10:00 AM' },
  { title: 'Professional En Route', time: '10:15 AM' },
  { title: 'Arrived at Location', time: '10:30 AM' },
  { title: 'Work in Progress', time: '10:35 AM' },
  { title: 'Job Completed', time: '11:30 AM' }
];

export default function JobTracking() {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  const loadBooking = async () => {
    try {
      const response = await bookingsAPI.getById(bookingId);
      setBooking(response.data);
      
      // Set current step based on booking status
      const statusSteps = {
        'PENDING': 0,
        'CONFIRMED': 1,
        'IN_PROGRESS': 3,
        'COMPLETED': 4
      };
      setCurrentStep(statusSteps[response.data.status] || 0);
    } catch (error) {
      console.error('Error loading booking:', error);
      toast.error('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Booking not found</h2>
          <Button onClick={() => navigate('/customer/bookings')}>Go Back</Button>
        </div>
      </div>
    );
  }

  // Handle navigation based on booking status
  const handleAction = () => {
    if (booking.status === 'COMPLETED') {
      navigate(`/customer/invoice/${bookingId}`);
    } else {
      toast.info('Booking is still in progress');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Map Placeholder Header */}
      <div className="h-64 bg-gray-200 relative">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-blue-50/50 overflow-hidden">
           {/* Simulated Map Background */}
           <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] opacity-10 bg-cover bg-center"></div>
           <MapPin className="w-12 h-12 text-primary absolute animate-bounce" />
        </div>
        <button onClick={() => navigate('/customer/bookings')} className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-md z-10">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Sheet */}
      <div className="flex-1 bg-white -mt-6 rounded-t-3xl p-6 relative z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        {/* Worker Info */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-primary">
              {booking.worker?.user?.name?.charAt(0) || 'W'}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">{booking.worker?.user?.name || 'Worker'}</h3>
            <p className="text-text-muted text-sm">{booking.service?.name || booking.worker?.profession}</p>
          </div>
          <div className="flex gap-2">
            {booking.worker?.user?.phone && (
              <button 
                onClick={() => window.open(`tel:${booking.worker.user.phone}`)}
                className="p-2 bg-green-100 text-green-600 rounded-full"
              >
                <Phone className="w-5 h-5" />
              </button>
            )}
            <button className="p-2 bg-blue-100 text-blue-600 rounded-full">
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-6 relative pl-2">
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100" />
          
          {steps.map((step, index) => {
            const isCompleted = index <= currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-start gap-4 ${!isCompleted && 'opacity-40'}`}
              >
                <div className={`w-6 h-6 rounded-full z-10 flex items-center justify-center transition-colors duration-500 ${
                  isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200'
                }`}>
                  {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className={`font-bold text-sm ${isCurrent && 'text-primary'}`}>{step.title}</h4>
                  <p className="text-xs text-text-muted">{step.time}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8">
          <Button fullWidth onClick={handleAction}>
            {booking.status === 'COMPLETED' ? 'View Invoice' : 'Tracking in Progress'}
          </Button>
        </div>
      </div>
    </div>
  );
}
