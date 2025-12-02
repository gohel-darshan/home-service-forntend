import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, Navigation, CheckCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { bookingsAPI } from '../../../lib/api';
import toast from 'react-hot-toast';

export default function JobDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooking();
  }, [id]);

  const loadBooking = async () => {
    try {
      const response = await bookingsAPI.getById(id);
      setBooking(response.data);
    } catch (error) {
      console.error('Error loading booking:', error);
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Job not found</h2>
          <Button onClick={() => navigate('/worker/jobs')}>Go Back</Button>
        </div>
      </div>
    );
  }

  const handleAction = async () => {
    try {
      if (booking.status === 'CONFIRMED') {
        // Update status to IN_PROGRESS
        await bookingsAPI.updateStatus(booking.id, 'IN_PROGRESS');
        setBooking({...booking, status: 'IN_PROGRESS'});
        toast.success('Job started successfully!');
      } else if (booking.status === 'IN_PROGRESS') {
        navigate(`/worker/job/${booking.id}/complete`);
      }
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error('Failed to update job status');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      <header className="bg-white p-4 flex items-center gap-4 shadow-sm sticky top-0 z-10">
        <button onClick={() => navigate(-1)}><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="font-bold text-lg">Job Details</h1>
      </header>

      <div className="p-4 space-y-6 flex-1">
        {/* Customer Card */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-primary">
                  {booking.customer?.user?.name?.charAt(0) || 'C'}
                </span>
              </div>
              <div>
                <h3 className="font-bold">{booking.customer?.user?.name || 'Customer'}</h3>
                <p className="text-xs text-text-muted">Customer</p>
              </div>
            </div>
            {booking.customer?.user?.phone && (
              <a href={`tel:${booking.customer.user.phone}`} className="p-2 bg-green-100 text-green-600 rounded-full">
                <Phone className="w-5 h-5" />
              </a>
            )}
          </div>
          
          <div className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                {booking.address?.street || 'Address not specified'}
              </p>
              <p className="text-xs text-text-muted mt-1">
                {booking.address?.city}, {booking.address?.state}
              </p>
            </div>
            <button className="p-2 bg-blue-100 text-primary rounded-lg">
              <Navigation className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Job Info */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold mb-3">Service Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-muted">Service Type</span>
              <span className="font-medium">{booking.service?.name || 'Service'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Date & Time</span>
              <span className="font-medium">
                {new Date(booking.scheduledAt).toLocaleDateString()}, {' '}
                {new Date(booking.scheduledAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Total Amount</span>
              <span className="font-bold text-green-600">₹{booking.totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Status</span>
              <span className={`font-medium ${
                booking.status === 'COMPLETED' ? 'text-green-600' :
                booking.status === 'IN_PROGRESS' ? 'text-blue-600' :
                booking.status === 'CONFIRMED' ? 'text-yellow-600' : 'text-gray-600'
              }`}>
                {booking.status.replace('_', ' ')}
              </span>
            </div>
          </div>
          {booking.notes && (
            <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 text-sm rounded-lg">
              <span className="font-bold">Note:</span> {booking.notes}
            </div>
          )}
        </div>
      </div>

      {/* Action Bar */}
      {booking.status !== 'COMPLETED' && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <Button fullWidth onClick={handleAction} size="lg">
            {booking.status === 'CONFIRMED' ? 'Start Job' : 
             booking.status === 'IN_PROGRESS' ? 'Complete Job' : 'Job Action'}
          </Button>
        </div>
      )}
    </div>
  );
}
