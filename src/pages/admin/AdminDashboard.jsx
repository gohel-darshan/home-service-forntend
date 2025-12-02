import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Calendar, DollarSign, TrendingUp, AlertCircle, CheckCircle, Clock, Star } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../lib/api';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [pendingComplaints, setPendingComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, bookingsRes, complaintsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getBookings(),
        adminAPI.getComplaints()
      ]);

      setDashboardData(statsRes.data);
      setRecentBookings(bookingsRes.data.slice(0, 10));
      setPendingComplaints(complaintsRes.data.filter(c => c.status === 'OPEN').slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-base text-gray-600">Welcome back, {user?.name}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Users</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{dashboardData?.users?.total || 0}</p>
              <div className="flex flex-col xs:flex-row xs:gap-2 mt-1">
                <span className="text-xs text-blue-600">{dashboardData?.users?.customers || 0} customers</span>
                <span className="text-xs text-green-600">{dashboardData?.users?.workers || 0} workers</span>
              </div>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Active Workers</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{dashboardData?.workers?.total || 0}</p>
              <p className="text-xs text-gray-500 mt-1 truncate">
                Avg Rating: {dashboardData?.workers?.averageRating || '0.0'}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Bookings</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{dashboardData?.bookings?.total || 0}</p>
              <div className="mt-1">
                <span className="text-xs text-green-600 truncate block">
                  {dashboardData?.bookings?.byStatus?.completed?.count || 0} completed
                </span>
              </div>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Revenue</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                ₹{(dashboardData?.revenue?.total || 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1 truncate">
                From {dashboardData?.revenue?.completedBookings || 0} completed jobs
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Bookings */}
        <Card className="p-4 sm:p-6 lg:col-span-2">
          <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2 xs:gap-0 mb-4">
            <h3 className="text-base sm:text-lg font-semibold">Recent Bookings</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/admin/bookings')}
              className="self-start xs:self-auto"
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {recentBookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-0 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">{booking.service?.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {booking.customer?.name} • {booking.worker?.user?.name || 'Unassigned'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex xs:flex-col items-center xs:items-end justify-between xs:justify-start gap-2 xs:gap-1 xs:text-right">
                  <Badge 
                    variant={booking.status === 'COMPLETED' ? 'success' : 
                            booking.status === 'CONFIRMED' ? 'warning' : 'default'}
                    className="text-xs"
                  >
                    {booking.status}
                  </Badge>
                  <p className="text-sm font-medium">₹{booking.totalAmount}</p>
                </div>
              </div>
            ))}
            {recentBookings.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No recent bookings</p>
              </div>
            )}
          </div>
        </Card>

        {/* Pending Complaints */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Pending Complaints</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/admin/complaints')}
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {pendingComplaints.map((complaint) => (
              <div key={complaint.id} className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{complaint.title}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      By {complaint.customer?.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="error" className="text-xs">
                    {complaint.priority}
                  </Badge>
                </div>
              </div>
            ))}
            {pendingComplaints.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No pending complaints</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Activity from Dashboard Data */}
      {dashboardData?.recentActivity && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {dashboardData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {activity.service?.name} - {activity.status}
                  </p>
                  <p className="text-xs text-gray-600">
                    {activity.customer?.name} • {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className="text-sm font-medium text-primary">
                  ₹{activity.totalAmount}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}