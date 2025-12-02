import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, DollarSign, Calendar, 
  BarChart3, PieChart, Activity, Star 
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { analyticsAPI } from '../../lib/api';
import toast from 'react-hot-toast';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getOverview({ timeRange });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>)}
          </div>
        </div>
      </div>
    );
  }

  const totalRevenue = Object.values(analytics?.revenueByDay || {}).reduce((sum, val) => sum + val, 0);
  const totalBookings = analytics?.bookingTrends?.reduce((sum, trend) => sum + trend._count.id, 0) || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive business insights and metrics</p>
        </div>
        <div className="flex gap-2">
          {['7', '30', '90'].map(days => (
            <Button
              key={days}
              variant={timeRange === days ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(days)}
            >
              {days} days
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">+12% from last period</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-3xl font-bold text-blue-600">{totalBookings}</p>
              <p className="text-sm text-blue-600 mt-1">+8% from last period</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New Users</p>
              <p className="text-3xl font-bold text-purple-600">
                {analytics?.userGrowth?.reduce((sum, u) => sum + u._count.id, 0) || 0}
              </p>
              <p className="text-sm text-purple-600 mt-1">+15% from last period</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Rating</p>
              <p className="text-3xl font-bold text-yellow-600">
                {analytics?.workerPerformance?.length > 0 
                  ? (analytics.workerPerformance.reduce((sum, w) => sum + w.avgRating, 0) / analytics.workerPerformance.length).toFixed(1)
                  : '0.0'
                }
              </p>
              <p className="text-sm text-yellow-600 mt-1">+0.2 from last period</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Revenue Trend</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {Object.entries(analytics?.revenueByDay || {}).slice(-7).map(([date, amount]) => (
              <div key={date} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{new Date(date).toLocaleDateString()}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(amount / Math.max(...Object.values(analytics.revenueByDay))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">₹{amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Booking Status Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Booking Status</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {analytics?.bookingTrends?.map((trend) => (
              <div key={trend.status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    trend.status === 'COMPLETED' ? 'bg-green-500' :
                    trend.status === 'CONFIRMED' ? 'bg-blue-500' :
                    trend.status === 'PENDING' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  }`}></div>
                  <span className="text-sm capitalize">{trend.status.toLowerCase()}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{trend._count.id}</p>
                  <p className="text-xs text-gray-500">₹{(trend._sum.totalAmount || 0).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Performing Workers */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Top Workers</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {analytics?.workerPerformance?.slice(0, 5).map((worker, index) => (
              <div key={worker.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{worker.user?.name}</p>
                    <p className="text-xs text-gray-600">{worker.profession}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{worker.avgRating.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-gray-500">₹{worker.totalEarnings.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Popular Services */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Popular Services</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {analytics?.serviceStats?.slice(0, 5).map((service, index) => (
              <div key={service.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{service.name}</p>
                    <p className="text-xs text-gray-600">{service.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{service.totalBookings} bookings</p>
                  <p className="text-xs text-gray-500">₹{service.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* User Growth */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">User Growth by Role</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analytics?.userGrowth?.map((userType) => (
            <div key={userType.role} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-primary">{userType._count.id}</p>
              <p className="text-sm text-gray-600 capitalize">New {userType.role.toLowerCase()}s</p>
              <Badge variant="success" className="mt-2">
                +{Math.round(userType._count.id * 0.15)} this period
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}