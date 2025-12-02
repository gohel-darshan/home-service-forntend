import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { useCustomer } from '../../../context/CustomerContext';

export default function Invoice() {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const { getBooking } = useCustomer();
  
  const booking = getBooking(bookingId);

  if (!booking) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col">
      <header className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/customer')}><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="font-bold text-lg">Invoice</h1>
        <div className="w-6" />
      </header>

      <Card className="bg-white p-6 flex-1 mb-6 flex flex-col">
        <div className="text-center border-b border-gray-100 pb-6 mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🧾</span>
          </div>
          <h2 className="text-2xl font-bold text-primary mb-1">₹{booking.price}.00</h2>
          <p className="text-green-600 font-medium text-sm">Payment Successful</p>
          <p className="text-text-muted text-xs mt-2">Transaction ID: #{booking.id.toUpperCase()}</p>
        </div>

        <div className="space-y-4 flex-1">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Service</span>
            <span className="font-medium">{booking.service}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Date</span>
            <span className="font-medium">{booking.date}, {booking.time}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Payment Method</span>
            <span className="font-medium capitalize">{booking.paymentMethod}</span>
          </div>
          
          <div className="border-t border-dashed border-gray-200 my-4" />
          
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Base Charge</span>
            <span>₹{Math.round(booking.price / 1.18)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Tax (18%)</span>
            <span>₹{booking.price - Math.round(booking.price / 1.18)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2">
            <span>Total</span>
            <span>₹{booking.price}.00</span>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <Button fullWidth onClick={() => navigate(`/customer/review/${bookingId}`)}>Rate Service</Button>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="text-sm"><Download className="w-4 h-4 mr-2" /> PDF</Button>
          <Button variant="outline" className="text-sm"><Share2 className="w-4 h-4 mr-2" /> Share</Button>
        </div>
      </div>
    </div>
  );
}
