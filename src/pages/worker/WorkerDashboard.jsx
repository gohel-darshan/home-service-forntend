import React, { useState, useEffect } from 'react';
import { Wallet, CheckCircle, Clock, ChevronRight, Star, TrendingUp, Calendar, MapPin, Menu } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Container, Grid, Stack, Flex } from '../../components/layout/ResponsiveLayout';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { workersAPI } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function WorkerDashboard() {
  const { user } = useAuth();
  const { dashboardStats, bookings, acceptBooking, getBookingsByStatus } = useBooking();
  const navigate = useNavigate();
  const [availableJobs, setAvailableJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workerProfile, setWorkerProfile] = useState(null);

  useEffect(() => {
    loadWorkerData();
  }, [user]);

  const loadWorkerData = async () => {
    try {
      setLoading(true);
      const [jobsRes] = await Promise.all([
        workersAPI.getAvailableJobs({ profession: user?.workerProfile?.profession })
      ]);
      setAvailableJobs(jobsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error loading worker data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptJob = async (jobId) => {
    const result = await acceptBooking(jobId);
    if (result.success) {
      setAvailableJobs(prev => prev.filter(job => job.id !== jobId));
      loadWorkerData(); // Refresh data
    }
  };

  const activeJobs = getBookingsByStatus('CONFIRMED').concat(getBookingsByStatus('IN_PROGRESS'));
  const completedJobs = getBookingsByStatus('COMPLETED');

  if (loading) {
    return (
      <div className="pb-6 pt-6 px-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded-2xl"></div>
          <div className="grid grid-cols-3 gap-6">
            <div className="h-24 bg-gray-200 rounded-xl"></div>
            <div className="h-24 bg-gray-200 rounded-xl"></div>
            <div className="h-24 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="pb-6 pt-6">
        <header className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <Flex justify="between" align="center">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold truncate">Hello, {user?.name?.split(' ')[0] || 'Worker'} 👋</h1>
              <p className="text-base text-gray-600 mt-1">
                You have {availableJobs.length} new job request{availableJobs.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button 
                onClick={() => navigate('/worker/profile')}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                My Profile
              </button>
              <button className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors lg:hidden">
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </Flex>
        </header>

      {/* Earnings Card */}
      <div className="bg-secondary text-white p-6 rounded-2xl mb-6 shadow-lg shadow-secondary/20">
        <div className="flex items-center gap-2 mb-2 opacity-90">
          <Wallet className="w-5 h-5" />
          <span className="text-sm font-medium">Total Earnings</span>
        </div>
        <h2 className="text-4xl font-bold mb-4">
          ₹{dashboardStats?.totalEarnings?.toLocaleString() || '0'}
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate('/worker/earnings/withdraw')}
            className="bg-white/20 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-white/30 transition"
          >
            Withdraw
          </button>
          <button 
            onClick={() => navigate('/worker/earnings')}
            className="bg-white/20 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-white/30 transition"
          >
            History
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card className="flex flex-col items-center justify-center py-4">
          <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-primary mb-1">
            <CheckCircle className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold">{dashboardStats?.completedJobs || 0}</span>
          <span className="text-xs text-text-muted text-center">Completed</span>
        </Card>
        <Card className="flex flex-col items-center justify-center py-4">
          <div className="w-8 h-8 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600 mb-1">
            <Star className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold">{dashboardStats?.rating?.toFixed(1) || '0.0'}</span>
          <span className="text-xs text-text-muted text-center">Rating</span>
        </Card>
        <Card className="flex flex-col items-center justify-center py-4">
          <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-1">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold">{dashboardStats?.activeJobs || 0}</span>
          <span className="text-xs text-text-muted text-center">Active</span>
        </Card>
      </div>

      {/* Verification Status */}
      {!dashboardStats?.isVerified && (
        <Card className="p-4 mb-6 border-l-4 border-l-yellow-500 bg-yellow-50">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-yellow-800">Complete Verification</h4>
              <p className="text-xs text-yellow-700">Get verified to receive more job requests</p>
            </div>
            <Button 
              size="sm" 
              onClick={() => navigate('/worker/kyc')}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              Verify
            </Button>
          </div>
        </Card>
      )}

      {/* Active Jobs */}
      {activeJobs.length > 0 && (
        <section className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Active Jobs</h3>
            <button 
              onClick={() => navigate('/worker/jobs')}
              className="text-primary text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {activeJobs.slice(0, 2).map((job) => (
              <Card key={job.id} className="p-4 border-l-4 border-l-green-500">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold">{job.service?.name}</h4>
                    <p className="text-xs text-text-muted">{job.customer?.name}</p>
                  </div>
                  <Badge variant={job.status === 'IN_PROGRESS' ? 'warning' : 'success'}>
                    {job.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-muted mb-3">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(job.scheduledAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="font-bold text-primary">₹{job.totalAmount}</span>
                </div>
                <Button 
                  size="sm" 
                  fullWidth 
                  onClick={() => navigate(`/worker/jobs/${job.id}`)}
                >
                  View Details
                </Button>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* New Job Requests */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">New Requests</h3>
          <button 
            onClick={() => navigate('/worker/jobs/requests')}
            className="text-primary text-sm font-medium"
          >
            View All
          </button>
        </div>
        
        {availableJobs.length === 0 ? (
          <Card className="p-6 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="font-bold text-gray-500 mb-1">No new requests</h4>
            <p className="text-xs text-gray-400">New job requests will appear here</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {availableJobs.map((job) => (
              <Card key={job.id} className="border-l-4 border-l-primary">
                <div className="flex justify-between mb-2">
                  <h4 className="font-bold">{job.service?.name}</h4>
                  <div className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded">
                    <MapPin className="w-3 h-3" />
                    <span>Nearby</span>
                  </div>
                </div>
                <p className="text-xs text-text-muted mb-1">{job.customer?.name}</p>
                <p className="text-sm text-text-muted mb-3">
                  {new Date(job.scheduledAt).toLocaleDateString()} • 
                  {new Date(job.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-primary font-bold">₹{job.totalAmount}</span>
                  {job.notes && (
                    <span className="text-xs text-gray-500 italic">"Special requirements"</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    fullWidth 
                    onClick={() => handleAcceptJob(job.id)}
                    disabled={loading}
                  >
                    Accept
                  </Button>
                  <Button 
                    size="sm" 
                    variant="white" 
                    fullWidth
                    onClick={() => navigate(`/worker/jobs/requests/${job.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
      </Container>
    </div>
  );
}
