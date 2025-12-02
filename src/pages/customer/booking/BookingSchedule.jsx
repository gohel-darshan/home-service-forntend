import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { workersAPI } from '../../../lib/api';

export default function BookingSchedule() {
  const navigate = useNavigate();
  const { workerId } = useParams();
  const [worker, setWorker] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorker();
  }, [workerId]);

  const loadWorker = async () => {
    try {
      const response = await workersAPI.getById(workerId);
      setWorker(response.data);
    } catch (error) {
      console.error('Error loading worker:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) return;
    
    const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
    const bookingData = {
      workerId,
      scheduledAt: scheduledDateTime.toISOString(),
      worker,
      selectedDate,
      selectedTime
    };
    
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    navigate(`/customer/book/${workerId}/address`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Schedule Booking</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Worker Info */}
        {worker && (
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{worker.user?.name}</h3>
                <p className="text-gray-600">{worker.profession}</p>
                <p className="text-primary font-bold">₹{worker.hourlyRate}/hr</p>
              </div>
            </div>
          </Card>
        )}

        {/* Date Selection */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">Select Date</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {generateDates().map((date) => {
              const dateStr = date.toISOString().split('T')[0];
              const isSelected = selectedDate === dateStr;
              
              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`p-4 rounded-xl border-2 text-left transition-colors ${
                    isSelected 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {date.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Selection */}
        {selectedDate && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg">Select Time</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((time) => {
                const isSelected = selectedTime === time;
                
                return (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 rounded-xl border-2 font-medium transition-colors ${
                      isSelected 
                        ? 'border-primary bg-primary text-white' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Button 
            fullWidth 
            onClick={handleContinue}
            disabled={!selectedDate || !selectedTime}
          >
            Continue to Address
          </Button>
        </div>
      </div>
    </div>
  );
}