import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Banknote } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { bookingsAPI, servicesAPI } from '../../../lib/api';
import toast from 'react-hot-toast';

export default function BookingPayment() {
  const navigate = useNavigate();
  const { workerId } = useParams();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem('bookingData');
    if (savedData) {
      setBookingData(JSON.parse(savedData));
    } else {
      navigate(`/customer/book/${workerId}/schedule`);
    }
  }, [workerId, navigate]);

  const calculateTotal = () => {
    if (!bookingData?.worker) return 0;
    const basePrice = bookingData.worker.hourlyRate * 2; // Assuming 2 hours minimum
    const tax = basePrice * 0.18; // 18% GST
    return basePrice + tax;
  };

  const handlePayment = async () => {
    if (!bookingData) return;

    setLoading(true);
    try {
      // Find service based on worker profession
      const servicesRes = await servicesAPI.getAll();
      const matchingService = servicesRes.data.find(s => 
        s.name.toLowerCase().includes(bookingData.worker.profession.toLowerCase()) ||
        s.category.toLowerCase().includes(bookingData.worker.profession.toLowerCase())
      ) || servicesRes.data[0]; // Fallback to first service
      
      const bookingPayload = {
        serviceId: matchingService.id,
        workerId: bookingData.workerId,
        scheduledAt: bookingData.scheduledAt,
        address: bookingData.address,
        notes: bookingData.notes || '',
        totalAmount: calculateTotal()
      };

      const response = await bookingsAPI.create(bookingPayload);
      
      // Clear saved data
      localStorage.removeItem('bookingData');
      
      toast.success('Booking confirmed successfully!');
      navigate('/customer/book/success', { 
        state: { booking: response.data } 
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  const total = calculateTotal();
  const basePrice = bookingData.worker.hourlyRate * 2;
  const tax = total - basePrice;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Payment</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {/* Booking Summary */}
        <Card className="p-4">
          <h3 className="font-bold text-lg mb-4">Booking Summary</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Service Provider</span>
              <span className="font-medium">{bookingData.worker?.user?.name}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Service</span>
              <span className="font-medium">{bookingData.worker?.profession}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Date & Time</span>
              <span className="font-medium">
                {new Date(bookingData.scheduledAt).toLocaleDateString()} at{' '}
                {new Date(bookingData.scheduledAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            
            {bookingData.address && (
              <div className="flex justify-between">
                <span className="text-gray-600">Address</span>
                <span className="font-medium text-right max-w-48">
                  {bookingData.address.street}
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Price Breakdown */}
        <Card className="p-4">
          <h3 className="font-bold text-lg mb-4">Price Details</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Service Charge (2 hrs min)</span>
              <span>₹{basePrice}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">GST (18%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            
            <div className="border-t pt-3">
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount</span>
                <span className="text-primary">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Payment Methods */}
        <Card className="p-4">
          <h3 className="font-bold text-lg mb-4">Payment Method</h3>
          
          <div className="space-y-3">
            <div className="w-full p-4 rounded-xl border-2 border-primary bg-primary/5 flex items-center gap-3">
              <Banknote className="w-6 h-6 text-primary" />
              <div className="text-left">
                <p className="font-medium">Cash on Delivery (COD)</p>
                <p className="text-sm text-gray-600">Pay cash when service is completed</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Confirm Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Button 
            fullWidth 
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? 'Confirming Booking...' : 'Confirm Booking'}
          </Button>
        </div>
      </div>
    </div>
  );
}