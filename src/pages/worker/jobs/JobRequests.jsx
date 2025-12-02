import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, User, Phone, CheckCircle, XCircle, DollarSign, Calendar, Filter, RefreshCw } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { workersAPI } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { useBooking } from '../../../context/BookingContext';
import toast from 'react-hot-toast';

export default function JobRequests() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { acceptBooking } = useBooking();
  const [jobRequests, setJobRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    minAmount: '',
    maxDistance: '',
    timeRange: 'all'
  });

  useEffect(() => {
    loadJobRequests();
  }, []);

  const loadJobRequests = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);
      
      const response = await workersAPI.getAvailableJobs({
        profession: user.workerProfile?.profession
      });
      setJobRequests(response.data);
    } catch (error) {
      console.error('Error loading job requests:', error);
      toast.error('Failed to load job requests');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAcceptJob = async (jobId) => {
    const result = await acceptBooking(jobId);
    if (result.success) {
      setJobRequests(prev => prev.filter(job => job.id !== jobId));
      toast.success('Job accepted successfully!');
    }
  };

  const handleRejectJob = async (jobId) => {
    // Remove from local state (in real app, would call API)
    setJobRequests(prev => prev.filter(job => job.id !== jobId));
    toast.success('Job declined');
  };

  const handleRefresh = () => {
    loadJobRequests(true);
  };

  // Filter jobs based on criteria
  const filteredJobs = jobRequests.filter(job => {
    if (filters.minAmount && job.totalAmount < parseFloat(filters.minAmount)) {
      return false;
    }
    
    if (filters.timeRange !== 'all') {
      const jobDate = new Date(job.scheduledAt);
      const now = new Date();
      const diffHours = (jobDate - now) / (1000 * 60 * 60);
      
      if (filters.timeRange === 'today' && diffHours > 24) return false;
      if (filters.timeRange === 'week' && diffHours > 168) return false;
    }
    
    return true;
  });

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
          <h1 className="text-xl font-bold">Job Requests</h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Badge variant="primary">{filteredJobs.length} Available</Badge>
          </div>
        </div>
        
        {/* Filters */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">Min Amount</label>
            <input
              type="number"
              placeholder="₹0"
              value={filters.minAmount}
              onChange={(e) => setFilters(prev => ({ ...prev, minAmount: e.target.value }))}
              className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Time Range</label>
            <select
              value={filters.timeRange}
              onChange={(e) => setFilters(prev => ({ ...prev, timeRange: e.target.value }))}
              className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button 
              variant="outline" 
              size="sm" 
              fullWidth
              onClick={() => setFilters({ minAmount: '', maxDistance: '', timeRange: 'all' })}
            >
              <Filter className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No job requests</h3>
            <p className="text-gray-500">New job requests will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{job.service?.name}</h3>
                    <p className="text-sm text-gray-600">
                      Request ID: #{job.id.slice(-8)}
                    </p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    New Request
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
                      <span>{job.address.street || 'Address provided after acceptance'}</span>
                    </div>
                  )}

                  {job.notes && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Special Instructions:</strong> {job.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Payment and Timing Info */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <DollarSign className="w-4 h-4 text-green-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-green-800">₹{job.totalAmount}</p>
                    <p className="text-xs text-green-600">Earnings</p>
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
                
                {/* Distance and Urgency */}
                <div className="flex items-center justify-between mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Nearby location</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {new Date(job.scheduledAt) - new Date() < 24 * 60 * 60 * 1000 && (
                      <Badge variant="warning" className="text-xs">Urgent</Badge>
                    )}
                    <Badge variant="success" className="text-xs">New</Badge>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/worker/jobs/requests/${job.id}`)}
                  >
                    View Details
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => handleRejectJob(job.id)}
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                  
                  <Button 
                    className="flex-1"
                    onClick={() => handleAcceptJob(job.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Accept
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