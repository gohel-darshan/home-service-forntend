import React, { useState, useEffect } from 'react';
import { Search, MapPin, Bell, TrendingUp, Calendar, Star, Clock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Grid, Stack, Flex } from '../../components/layout/ResponsiveLayout';
import { servicesAPI, workersAPI } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';

export default function CustomerHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { dashboardStats, bookings, getBookingsByStatus } = useBooking();
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    loadData();
    if (bookings.length > 0) {
      setRecentBookings(bookings.slice(0, 3));
    }
  }, [bookings]);

  const loadData = async () => {
    try {
      const [servicesRes, workersRes] = await Promise.all([
        servicesAPI.getAll(),
        workersAPI.getAll()
      ]);
      
      const workersData = workersRes.data;
      setWorkers(workersData);
      
      // Generate categories based on worker professions
      const workerProfessions = [...new Set(workersData.map(worker => worker.profession))];
      const dynamicCategories = workerProfessions.map((profession, index) => {
        const colors = [
          'bg-blue-100 text-blue-600',
          'bg-green-100 text-green-600', 
          'bg-yellow-100 text-yellow-600',
          'bg-purple-100 text-purple-600',
          'bg-red-100 text-red-600',
          'bg-orange-100 text-orange-600'
        ];
        return {
          id: index + 1,
          name: profession,
          color: colors[index % colors.length]
        };
      });
      setCategories(dynamicCategories);
      
      // Filter services based on available worker professions
      const availableServices = servicesRes.data.filter(service => 
        workerProfessions.some(profession => 
          profession.toLowerCase().includes(service.name.toLowerCase()) ||
          service.name.toLowerCase().includes(profession.toLowerCase()) ||
          service.category.toLowerCase().includes(profession.toLowerCase())
        )
      );
      setServices(availableServices);
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/customer/search?q=${searchQuery}`);
    }
  };



  if (loading) {
    return (
      <div className="pb-24 pt-4 px-4 space-y-6 max-w-md mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded-xl"></div>
          <div className="h-32 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="pb-6">
        {/* Header */}
        <header className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <Flex justify="between" align="center" className="mb-4">
            <Flex align="center" className="gap-3 flex-1 min-w-0">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-primary">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600">Welcome back</p>
                <p className="font-bold text-lg truncate">{user?.name || 'User'}</p>
              </div>
            </Flex>
            <button className="p-2 sm:p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
          </Flex>
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search for services..." 
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all text-sm sm:text-base"
            />
          </div>
        </header>

          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white shadow-lg mb-4 sm:mb-6">
          <div className="max-w-md">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Book Home Services</h2>
            <p className="text-blue-100 mb-4 sm:mb-6 text-sm sm:text-base">Professional services at your doorstep</p>
            <button 
              onClick={() => navigate('/customer/search')}
              className="bg-white text-primary px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              Explore Services
            </button>
          </div>
        </div>

        {categories.length > 0 && (
          <section className="mb-6 sm:mb-8">
            <Flex justify="between" align="center" className="mb-4 sm:mb-6">
              <h3 className="font-bold text-lg sm:text-xl">Available Services</h3>
              <Link to="/customer/search" className="text-primary font-medium hover:text-primary/80 transition-colors text-sm sm:text-base">See all</Link>
            </Flex>
            <Grid cols={3} className="xs:grid-cols-3 sm:grid-cols-6">
              {categories.map((cat) => (
                <Link key={cat.id} to={`/customer/search?profession=${cat.name}`} className="group">
                  <div className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl hover:bg-white hover:shadow-sm transition-all">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center ${cat.color} group-hover:scale-105 transition-transform`}>
                      <div className="w-4 h-4 sm:w-6 sm:h-6 bg-current opacity-50 rounded-full" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-center text-gray-700 leading-tight">{cat.name}</span>
                  </div>
                </Link>
              ))}
            </Grid>
          </section>
        )}

        {dashboardStats && (
          <section className="mb-8">
            <h3 className="font-bold text-xl mb-6">Your Activity</h3>
            <Grid cols={2} className="sm:grid-cols-4">
              <Card className="p-4 sm:p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{dashboardStats.totalBookings || 0}</p>
                <p className="text-sm text-gray-600">Total Bookings</p>
              </Card>
              <Card className="p-4 sm:p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{dashboardStats.activeBookings || 0}</p>
                <p className="text-sm text-gray-600">Active Jobs</p>
              </Card>
            </Grid>
          </section>
        )}

        {recentBookings.length > 0 && (
          <section className="mb-8">
            <Flex justify="between" align="center" className="mb-6">
              <h3 className="font-bold text-xl">Recent Bookings</h3>
              <Link to="/customer/bookings" className="text-primary font-medium hover:text-primary/80 transition-colors">View all</Link>
            </Flex>
            <Stack spacing="md">
              {recentBookings.map((booking) => (
                <Card key={booking.id} className="p-4 hover:shadow-md transition-shadow">
                  <Flex justify="between" align="start" className="mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">{booking.service?.name}</h4>
                      <p className="text-sm text-gray-600">
                        {booking.worker?.user?.name || 'Worker not assigned'}
                      </p>
                    </div>
                    <Badge 
                      variant={booking.status === 'COMPLETED' ? 'success' : 
                              booking.status === 'CONFIRMED' ? 'warning' : 'default'}
                    >
                      {booking.status}
                    </Badge>
                  </Flex>
                  <Flex justify="between" align="center" className="text-sm text-gray-600">
                    <Flex align="center" className="gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(booking.scheduledAt).toLocaleDateString()}</span>
                    </Flex>
                    <span className="font-bold text-primary">₹{booking.totalAmount}</span>
                  </Flex>
                </Card>
              ))}
            </Stack>
          </section>
        )}

        {services.length > 0 && (
          <section className="mb-8">
            <h3 className="font-bold text-xl mb-6">Available Services</h3>
            <Stack spacing="md">
              {services.slice(0, 4).map((service) => (
                <Card 
                  key={service.id} 
                  className="p-4 cursor-pointer hover:shadow-md hover:border-primary transition-all"
                  onClick={() => navigate(`/customer/search?service=${service.id}`)}
                >
                  <Flex justify="between" align="center">
                    <div>
                      <h4 className="font-bold text-gray-900">{service.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                      <p className="text-primary font-bold">Starting ₹{service.basePrice}</p>
                    </div>
                    <Badge variant="success">{service.category}</Badge>
                  </Flex>
                </Card>
              ))}
            </Stack>
          </section>
        )}

        {workers.length > 0 && (
          <section>
            <h3 className="font-bold text-xl mb-6">Top Professionals</h3>
            <Stack spacing="md">
              {workers.slice(0, 3).map((worker) => (
                <Card 
                  key={worker.id} 
                  className="p-4 cursor-pointer hover:shadow-md hover:border-primary transition-all" 
                  onClick={() => navigate(`/customer/worker/${worker.id}`)}
                >
                  <Flex className="gap-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl sm:text-2xl font-bold text-gray-600">{worker.user?.name?.charAt(0) || 'W'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Flex justify="between" align="start" className="mb-2">
                        <h4 className="font-bold text-gray-900 truncate">{worker.user?.name}</h4>
                        <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full flex-shrink-0">
                          <Star className="w-3 h-3 fill-current text-green-600" />
                          <span className="text-sm font-bold text-green-700">{worker.rating.toFixed(1)}</span>
                        </div>
                      </Flex>
                      <p className="text-sm text-gray-600 mb-2">{worker.profession}</p>
                      <Flex align="center" className="gap-2 mb-2">
                        {worker.isVerified && <Badge variant="success" className="text-xs">Verified</Badge>}
                        <span className="text-sm text-gray-500">{worker.experience}+ years exp</span>
                      </Flex>
                      <p className="text-primary font-bold">₹{worker.hourlyRate}/hr</p>
                    </div>
                  </Flex>
                </Card>
              ))}
            </Stack>
          </section>
        )}
      </Container>
    </div>
  );
}