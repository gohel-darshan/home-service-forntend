import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Phone, Star, Filter, Search, Calendar, X, User, CreditCard } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import toast from 'react-hot-toast';

export default function CustomerBookings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookings, loading, filters, applyFilters, dashboardStats } = useBooking();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleFilterChange = (newFilter) => {
    applyFilters({ status: newFilter });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    // Apply search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        booking.service?.name?.toLowerCase().includes(searchLower) ||
        booking.worker?.user?.name?.toLowerCase().includes(searchLower) ||
        booking.id.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }
    
    return true;
  });

  const getBookingStats = () => {
    const stats = {
      all: bookings.length,
      pending: bookings.filter(b => b.status === 'PENDING').length,
      confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
      in_progress: bookings.filter(b => b.status === 'IN_PROGRESS').length,
      completed: bookings.filter(b => b.status === 'COMPLETED').length,
      cancelled: bookings.filter(b => b.status === 'CANCELLED').length
    };
    return stats;
  };

  const bookingStats = getBookingStats();

  const handleShowDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleCancelBooking = (booking) => {
    // For now, just show confirmation
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      toast.success('Booking cancelled successfully!');
      // Here you would call the API to cancel the booking
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
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
          <h1 className="text-xl font-bold">My Bookings</h1>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="bg-white p-4 border-b space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{bookingStats.all}</p>
            <p className="text-xs text-gray-600">Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{bookingStats.completed}</p>
            <p className="text-xs text-gray-600">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{bookingStats.confirmed + bookingStats.in_progress}</p>
            <p className="text-xs text-gray-600">Active</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {[
            { key: 'all', label: 'All', count: bookingStats.all },
            { key: 'PENDING', label: 'Pending', count: bookingStats.pending },
            { key: 'CONFIRMED', label: 'Confirmed', count: bookingStats.confirmed },
            { key: 'IN_PROGRESS', label: 'In Progress', count: bookingStats.in_progress },
            { key: 'COMPLETED', label: 'Completed', count: bookingStats.completed }
          ].map((status) => (
            <button
              key={status.key}
              onClick={() => handleFilterChange(status.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-2 ${
                filters.status === status.key 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <span>{status.label}</span>
              {status.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  filters.status === status.key 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {status.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="p-4 space-y-4 pb-24">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              {searchQuery ? <Search className="w-8 h-8 text-gray-400" /> : <Clock className="w-8 h-8 text-gray-400" />}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No matching bookings' : 'No bookings found'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? `No bookings match "${searchQuery}"` 
                : filters.status === 'all' 
                  ? 'You haven\'t made any bookings yet' 
                  : `No ${filters.status.toLowerCase().replace('_', ' ')} bookings`
              }
            </p>
            {!searchQuery && (
              <Button onClick={() => navigate('/customer')}>
                Book a Service
              </Button>
            )}
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg">{booking.service?.name}</h3>
                  <p className="text-sm text-gray-600">
                    Booking ID: #{booking.id.slice(-8)}
                  </p>
                </div>
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status.replace('_', ' ')}
                </Badge>
              </div>

              {booking.worker && (
                <div className="flex items-center gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">
                      {booking.worker.user?.name?.charAt(0) || 'W'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{booking.worker.user?.name}</p>
                    <p className="text-sm text-gray-600">{booking.worker.profession}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{booking.worker.rating.toFixed(1)}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>
                    {new Date(booking.scheduledAt).toLocaleDateString()} at{' '}
                    {new Date(booking.scheduledAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                
                {booking.address && (
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mt-0.5" />
                    <span>{booking.address.street || 'Address not specified'}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-3 border-t">
                <div>
                  <span className="text-lg font-bold text-primary">
                    ₹{booking.totalAmount}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  {booking.status === 'COMPLETED' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/customer/review/${booking.id}`)}
                    >
                      <Star className="w-3 h-3 mr-1" />
                      Rate
                    </Button>
                  )}
                  
                  {['CONFIRMED', 'IN_PROGRESS'].includes(booking.status) && (
                    <Button 
                      size="sm"
                      onClick={() => navigate(`/customer/tracking/${booking.id}`)}
                    >
                      <MapPin className="w-3 h-3 mr-1" />
                      Track
                    </Button>
                  )}
                  
                  {booking.status === 'PENDING' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCancelBooking(booking)}
                    >
                      Cancel
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleShowDetails(booking)}
                  >
                    Details
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Booking Details</h2>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Booking ID & Status */}
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Booking ID</p>
                    <p className="font-bold">#{selectedBooking.id.slice(-8)}</p>
                  </div>
                  <Badge className={getStatusColor(selectedBooking.status)}>
                    {selectedBooking.status.replace('_', ' ')}
                  </Badge>
                </div>

                {/* Service Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedBooking.service?.name}</p>
                      <p className="text-sm text-gray-600">Service</p>
                    </div>
                  </div>

                  {selectedBooking.worker && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold">
                          {selectedBooking.worker.user?.name?.charAt(0) || 'W'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{selectedBooking.worker.user?.name}</p>
                        <p className="text-sm text-gray-600">{selectedBooking.worker.profession}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {new Date(selectedBooking.scheduledAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedBooking.scheduledAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {selectedBooking.address && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{selectedBooking.address.street}</p>
                        <p className="text-sm text-gray-600">Service Address</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-primary">₹{selectedBooking.totalAmount}</p>
                      <p className="text-sm text-gray-600">Total Amount</p>
                    </div>
                  </div>

                  {selectedBooking.notes && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium mb-1">Notes</p>
                      <p className="text-sm text-gray-600">{selectedBooking.notes}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  {selectedBooking.worker?.user?.phone && (
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => window.open(`tel:${selectedBooking.worker.user.phone}`)}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                  )}
                  
                  {['CONFIRMED', 'IN_PROGRESS'].includes(selectedBooking.status) && (
                    <Button 
                      className="flex-1"
                      onClick={() => {
                        setShowDetailsModal(false);
                        navigate(`/customer/tracking/${selectedBooking.id}`);
                      }}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Track
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}