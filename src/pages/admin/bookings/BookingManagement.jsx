import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Calendar, MapPin, Phone, Mail, DollarSign, Clock, User } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { adminAPI } from '../../../lib/api';
import toast from 'react-hot-toast';

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    dateRange: ''
  });

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getBookings();
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'CONFIRMED': return 'warning';
      case 'IN_PROGRESS': return 'default';
      case 'CANCELLED': return 'error';
      case 'PENDING': return 'secondary';
      default: return 'default';
    }
  };

  const getBookingStats = () => {
    const stats = {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'PENDING').length,
      confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
      inProgress: bookings.filter(b => b.status === 'IN_PROGRESS').length,
      completed: bookings.filter(b => b.status === 'COMPLETED').length,
      cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
      totalRevenue: bookings.filter(b => b.status === 'COMPLETED').reduce((sum, b) => sum + (b.totalAmount || 0), 0)
    };
    return stats;
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = !searchQuery || 
      booking.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.service?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.worker?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !filters.status || booking.status === filters.status;
    
    return matchesSearch && matchesStatus;
  });

  const bookingStats = getBookingStats();

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
        <p className="text-gray-600">Track and manage all service bookings</p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bookings by customer, service, or worker..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          
          <Button 
            variant="outline"
            onClick={() => {
              setFilters({ status: '', dateRange: '' });
              setSearchQuery('');
            }}
          >
            <Filter className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold">{bookingStats.total}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{bookingStats.completed}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{bookingStats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-green-600">₹{bookingStats.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No bookings found matching your criteria</p>
          </Card>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{booking.service?.name}</h3>
                      <Badge variant={getStatusBadgeVariant(booking.status)} className="text-xs">
                        {booking.status}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Customer: {booking.customer?.name}</div>
                      <div>Worker: {booking.worker?.user?.name || 'Unassigned'}</div>
                      <div>Amount: ₹{booking.totalAmount}</div>
                      <div>Date: {new Date(booking.scheduledAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedBooking(booking)}>
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold">Booking Details</h2>
              <button onClick={() => setSelectedBooking(null)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Calendar className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-bold">{selectedBooking.service?.name}</h3>
                    <Badge variant={getStatusBadgeVariant(selectedBooking.status)}>
                      {selectedBooking.status}
                    </Badge>
                  </div>
                  <div className="text-lg font-semibold text-green-600">₹{selectedBooking.totalAmount}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Details */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-800 mb-3">Customer Information</h4>
                  <div className="space-y-2 text-sm text-blue-700">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{selectedBooking.customer?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{selectedBooking.customer?.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{selectedBooking.customer?.phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Worker Details */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-bold text-yellow-800 mb-3">Worker Information</h4>
                  <div className="space-y-2 text-sm text-yellow-700">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{selectedBooking.worker?.user?.name || 'Not assigned yet'}</span>
                    </div>
                    {selectedBooking.worker?.user?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{selectedBooking.worker.user.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-3">Service Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>Service: <span className="font-medium">{selectedBooking.service?.name}</span></div>
                  <div>Category: <span className="font-medium">{selectedBooking.service?.category}</span></div>
                  <div>Base Price: <span className="font-medium">₹{selectedBooking.service?.basePrice}</span></div>
                  <div>Total Amount: <span className="font-medium">₹{selectedBooking.totalAmount}</span></div>
                </div>
                {selectedBooking.service?.description && (
                  <div className="mt-2">
                    <div className="font-medium">Description:</div>
                    <div className="text-sm">{selectedBooking.service.description}</div>
                  </div>
                )}
              </div>

              {/* Address */}
              {selectedBooking.address && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-bold text-green-800 mb-3">Service Address</h4>
                  <div className="flex items-start gap-2 text-sm text-green-700">
                    <MapPin className="w-4 h-4 mt-0.5" />
                    <div>
                      <div>{selectedBooking.address.street}</div>
                      <div>{selectedBooking.address.city}, {selectedBooking.address.state} {selectedBooking.address.zipCode}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedBooking.notes && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-bold text-purple-800 mb-3">Special Notes</h4>
                  <p className="text-sm text-purple-700">{selectedBooking.notes}</p>
                </div>
              )}

              {/* Timeline */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-3">Timeline</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div>Booking Created: <span className="font-medium">{new Date(selectedBooking.createdAt).toLocaleString()}</span></div>
                  <div>Scheduled For: <span className="font-medium">{new Date(selectedBooking.scheduledAt).toLocaleString()}</span></div>
                  {selectedBooking.completedAt && (
                    <div>Completed At: <span className="font-medium">{new Date(selectedBooking.completedAt).toLocaleString()}</span></div>
                  )}
                  <div>Last Updated: <span className="font-medium">{new Date(selectedBooking.updatedAt).toLocaleString()}</span></div>
                </div>
              </div>

              <div className="text-xs text-gray-500 pt-4 border-t">
                Booking ID: {selectedBooking.id}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}