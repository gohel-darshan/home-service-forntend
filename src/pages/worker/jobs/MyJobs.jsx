import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, User, Phone, CheckCircle, Calendar, DollarSign, Filter, Search } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../context/AuthContext';
import { useBooking } from '../../../context/BookingContext';

export default function MyJobs() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookings, loading, updateBookingStatus, filters, applyFilters } = useBooking();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const handleUpdateStatus = async (jobId, status) => {
    await updateBookingStatus(jobId, status);
  };

  const handleFilterChange = (newFilter) => {
    applyFilters({ status: newFilter });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter and sort jobs
  let filteredJobs = bookings.filter(job => {
    // Apply search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        job.service?.name?.toLowerCase().includes(searchLower) ||
        job.customer?.name?.toLowerCase().includes(searchLower) ||
        job.id.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }
    
    return true;
  });

  // Sort jobs
  if (sortBy === 'date') {
    filteredJobs = filteredJobs.sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt));
  } else if (sortBy === 'amount') {
    filteredJobs = filteredJobs.sort((a, b) => b.totalAmount - a.totalAmount);
  } else if (sortBy === 'status') {
    filteredJobs = filteredJobs.sort((a, b) => a.status.localeCompare(b.status));
  }

  const getJobStats = () => {
    const stats = {
      all: bookings.length,
      confirmed: bookings.filter(j => j.status === 'CONFIRMED').length,
      in_progress: bookings.filter(j => j.status === 'IN_PROGRESS').length,
      completed: bookings.filter(j => j.status === 'COMPLETED').length,
      totalEarnings: bookings.filter(j => j.status === 'COMPLETED').reduce((sum, j) => sum + j.totalAmount, 0)
    };
    return stats;
  };

  const jobStats = getJobStats();

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
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">My Jobs</h1>
          <Badge variant="primary">{bookings.length} Total</Badge>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
      </div>

      {/* Stats and Filters */}
      <div className="bg-white p-4 border-b space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center">
            <p className="text-lg font-bold text-primary">{jobStats.all}</p>
            <p className="text-xs text-gray-600">Total</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-blue-600">{jobStats.confirmed}</p>
            <p className="text-xs text-gray-600">Confirmed</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-purple-600">{jobStats.in_progress}</p>
            <p className="text-xs text-gray-600">Active</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-green-600">₹{jobStats.totalEarnings}</p>
            <p className="text-xs text-gray-600">Earned</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {[
            { key: 'all', label: 'All', count: jobStats.all },
            { key: 'CONFIRMED', label: 'Confirmed', count: jobStats.confirmed },
            { key: 'IN_PROGRESS', label: 'Active', count: jobStats.in_progress },
            { key: 'COMPLETED', label: 'Completed', count: jobStats.completed }
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

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </div>

      <div className="p-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              {searchQuery ? <Search className="w-8 h-8 text-gray-400" /> : <Clock className="w-8 h-8 text-gray-400" />}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No matching jobs' : 'No jobs found'}
            </h3>
            <p className="text-gray-500">
              {searchQuery 
                ? `No jobs match "${searchQuery}"` 
                : filters.status === 'all' 
                  ? 'No jobs assigned yet' 
                  : `No ${filters.status.toLowerCase().replace('_', ' ')} jobs`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{job.service?.name}</h3>
                    <p className="text-sm text-gray-600">
                      Job ID: #{job.id.slice(-8)}
                    </p>
                  </div>
                  <Badge className={getStatusColor(job.status)}>
                    {job.status.replace('_', ' ')}
                  </Badge>
                </div>

                {/* Customer Info */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{job.customer?.name}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {job.customer?.phone || 'Phone not provided'}
                    </p>
                  </div>
                </div>

                {/* Job Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>
                      {new Date(job.scheduledAt).toLocaleDateString()} at{' '}
                      {new Date(job.scheduledAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  {job.address && (
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5" />
                      <span>{job.address.street}, {job.address.city}</span>
                    </div>
                  )}

                  {job.notes && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Notes:</strong> {job.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Payment and Timing Info */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <DollarSign className="w-4 h-4 text-green-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-green-800">₹{job.totalAmount}</p>
                    <p className="text-xs text-green-600">Payment</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <Calendar className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                    <p className="text-sm font-bold text-blue-800">
                      {new Date(job.scheduledAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-blue-600">
                      {new Date(job.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {job.status === 'CONFIRMED' && (
                    <Button 
                      className="flex-1"
                      onClick={() => handleUpdateStatus(job.id, 'IN_PROGRESS')}
                    >
                      Start Job
                    </Button>
                  )}
                  
                  {job.status === 'IN_PROGRESS' && (
                    <Button 
                      className="flex-1"
                      onClick={() => handleUpdateStatus(job.id, 'COMPLETED')}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete
                    </Button>
                  )}
                  
                  {job.customer?.phone && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(`tel:${job.customer.phone}`)}
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/worker/jobs/${job.id}`)}
                  >
                    Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}