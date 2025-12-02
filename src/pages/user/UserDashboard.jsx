import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, DollarSign, TrendingUp, Clock, Star, 
  Bell, Settings, User, MapPin, Phone, Mail 
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { dashboardAPI, notificationsAPI } from '../../lib/api';
import toast from 'react-hot-toast';

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, isCustomer, isWorker, isAdmin } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    loadNotifications();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await dashboardAPI.getData();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await notificationsAPI.getAll();
      setNotifications(response.data.notifications.slice(0, 5));
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleRoleNavigation = () => {
    if (isCustomer()) navigate('/customer');
    else if (isWorker()) navigate('/worker');
    else if (isAdmin()) navigate('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="animate-pulse space-y-4 max-w-4xl mx-auto">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
                <p className="text-gray-600 capitalize">{user?.role?.toLowerCase()} Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/profile')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button onClick={handleRoleNavigation}>
                Go to {user?.role?.toLowerCase()} App
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Quick Stats */}
        {dashboardData?.stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {isCustomer() && (
              <>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Bookings</p>
                      <p className="text-3xl font-bold text-primary">{dashboardData.stats.totalBookings}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-primary" />
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Jobs</p>
                      <p className="text-3xl font-bold text-blue-600">{dashboardData.stats.activeBookings}</p>
                    </div>
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-3xl font-bold text-green-600">{dashboardData.stats.completedBookings}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Spent</p>
                      <p className="text-3xl font-bold text-purple-600">₹{dashboardData.stats.totalSpent.toLocaleString()}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-purple-600" />
                  </div>
                </Card>
              </>
            )}

            {isWorker() && (
              <>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Jobs</p>
                      <p className="text-3xl font-bold text-primary">{dashboardData.stats.totalJobs}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-primary" />
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Earnings</p>
                      <p className="text-3xl font-bold text-green-600">₹{dashboardData.stats.totalEarnings.toLocaleString()}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Rating</p>
                      <p className="text-3xl font-bold text-yellow-600">{dashboardData.stats.rating.toFixed(1)}</p>
                    </div>
                    <Star className="w-8 h-8 text-yellow-600" />
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="text-lg font-bold text-green-600">
                        {dashboardData.stats.isVerified ? 'Verified' : 'Pending'}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </Card>
              </>
            )}

            {isAdmin() && (
              <>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Users</p>
                      <p className="text-3xl font-bold text-primary">{dashboardData.stats.totalUsers}</p>
                    </div>
                    <User className="w-8 h-8 text-primary" />
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-3xl font-bold text-green-600">₹{dashboardData.stats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Bookings</p>
                      <p className="text-3xl font-bold text-blue-600">{dashboardData.stats.totalBookings}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-blue-600" />
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Complaints</p>
                      <p className="text-3xl font-bold text-red-600">{dashboardData.stats.pendingComplaints}</p>
                    </div>
                    <Bell className="w-8 h-8 text-red-600" />
                  </div>
                </Card>
              </>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {dashboardData?.recentBookings?.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{booking.service?.name}</p>
                        <p className="text-sm text-gray-600">
                          {isCustomer() && booking.worker?.user?.name}
                          {isWorker() && booking.customer?.name}
                          {isAdmin() && `${booking.customer?.name} → ${booking.worker?.user?.name || 'Unassigned'}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={booking.status === 'COMPLETED' ? 'success' : 'warning'}>
                        {booking.status}
                      </Badge>
                      <p className="text-sm font-medium mt-1">₹{booking.totalAmount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Notifications */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <Bell className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-sm">{notification.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {notifications.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No new notifications</p>
              )}
            </div>
          </Card>
        </div>

        {/* Profile Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium">{user?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {user?.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Badge variant="primary" className="capitalize">
                  {user?.role?.toLowerCase()}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}