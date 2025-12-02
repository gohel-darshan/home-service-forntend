import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, User, MapPin, Banknote } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

export default function BookingSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;
  const bookingId = booking?.id || 'bk-demo';

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto pt-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto"
        >
          <CheckCircle className="w-12 h-12 text-green-600" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">
            Your service request has been confirmed. The professional will contact you soon.
          </p>
        </motion.div>

        {booking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <Card className="p-4 space-y-4">
              <h3 className="font-bold text-lg mb-3">Booking Details</h3>
              
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Service Provider</p>
                  <p className="text-sm text-gray-600">{booking.worker?.user?.name || 'Professional'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Scheduled</p>
                  <p className="text-sm text-gray-600">
                    {new Date(booking.scheduledAt).toLocaleDateString()} at{' '}
                    {new Date(booking.scheduledAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              {booking.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-gray-600">{booking.address.street}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <Banknote className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Payment</p>
                  <p className="text-sm text-gray-600">Cash on Delivery - ₹{booking.totalAmount}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <Button fullWidth onClick={() => navigate('/customer/bookings')}>View My Bookings</Button>
          <Button fullWidth variant="outline" onClick={() => navigate('/customer')}>Back to Home</Button>
        </motion.div>
      </div>
    </div>
  );
}
