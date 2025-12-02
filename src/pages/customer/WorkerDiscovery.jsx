import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Star, MapPin, Clock, Shield } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { workersAPI, servicesAPI } from '../../lib/api';
import { useBooking } from '../../context/BookingContext';

export default function WorkerDiscovery() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updateDraft } = useBooking();
  const [workers, setWorkers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    profession: searchParams.get('profession') || '',
    minRating: '',
    maxPrice: '',
    isVerified: ''
  });
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    loadData();
  }, [filters, sortBy]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleBookWorker = (worker) => {
    updateDraft({
      workerId: worker.id,
      workerName: worker.user?.name,
      profession: worker.profession,
      hourlyRate: worker.hourlyRate
    });
    navigate('/customer/booking/schedule');
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [workersRes, servicesRes] = await Promise.all([
        workersAPI.getAll(filters),
        servicesAPI.getAll()
      ]);
      
      let workersData = workersRes.data;
      
      // Sort workers
      if (sortBy === 'rating') {
        workersData = workersData.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'price') {
        workersData = workersData.sort((a, b) => a.hourlyRate - b.hourlyRate);
      } else if (sortBy === 'experience') {
        workersData = workersData.sort((a, b) => b.experience - a.experience);
      } else if (sortBy === 'jobs') {
        workersData = workersData.sort((a, b) => b.totalJobs - a.totalJobs);
      }
      
      setWorkers(workersData);
      setServices(servicesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWorkers = workers.filter(worker => {
    if (!searchQuery) return true;
    return (
      worker.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.profession?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const professions = [...new Set(workers.map(w => w.profession))];

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded-xl"></div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Find Professionals</h1>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, profession, or skills..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 border-b space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {/* Profession Filter */}
          <div>
            <label className="block text-xs font-medium mb-1">Profession</label>
            <select
              value={filters.profession}
              onChange={(e) => handleFilterChange('profession', e.target.value)}
              className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="">All</option>
              {professions.map(profession => (
                <option key={profession} value={profession}>{profession}</option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-xs font-medium mb-1">Min Rating</label>
            <select
              value={filters.minRating}
              onChange={(e) => handleFilterChange('minRating', e.target.value)}
              className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="">Any</option>
              <option value="4.5">4.5+</option>
              <option value="4.0">4.0+</option>
              <option value="3.5">3.5+</option>
            </select>
          </div>

          {/* Price Filter */}
          <div>
            <label className="block text-xs font-medium mb-1">Max Price</label>
            <select
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="">Any</option>
              <option value="50">₹50/hr</option>
              <option value="40">₹40/hr</option>
              <option value="30">₹30/hr</option>
            </select>
          </div>

          {/* Verified Filter */}
          <div>
            <label className="block text-xs font-medium mb-1">Verified</label>
            <select
              value={filters.isVerified}
              onChange={(e) => handleFilterChange('isVerified', e.target.value)}
              className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="">All</option>
              <option value="true">Verified Only</option>
            </select>
          </div>
        </div>

        {/* Sort Filter */}
        <div>
          <label className="block text-xs font-medium mb-1">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          >
            <option value="rating">Highest Rated</option>
            <option value="price">Lowest Price</option>
            <option value="experience">Most Experienced</option>
            <option value="jobs">Most Jobs Completed</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">
            {filteredWorkers.length} professionals found
          </p>
        </div>

        {filteredWorkers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No professionals found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredWorkers.map((worker) => (
              <Card 
                key={worker.id} 
                className="p-4 cursor-pointer hover:border-primary transition-colors"
                onClick={() => navigate(`/customer/worker/${worker.id}`)}
              >
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">
                      {worker.user?.name?.charAt(0) || 'W'}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{worker.user?.name}</h3>
                        <p className="text-sm text-gray-600">{worker.profession}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{worker.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Skills */}
                    {worker.skills && worker.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {worker.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {worker.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{worker.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Details */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{worker.experience}y</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{worker.totalJobs} jobs</span>
                        </div>
                        {worker.isVerified && (
                          <div className="flex items-center gap-1">
                            <Shield className="w-3 h-3 text-green-600" />
                            <span className="text-green-600">Verified</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">₹{worker.hourlyRate}/hr</p>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${
                            worker.isAvailable ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <p className="text-xs text-gray-500">
                            {worker.isAvailable ? 'Available' : 'Busy'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-4 border-t flex gap-2">
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/customer/worker/${worker.id}`);
                    }}
                  >
                    View Profile
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookWorker(worker);
                    }}
                    disabled={!worker.isAvailable}
                  >
                    {worker.isAvailable ? 'Book Now' : 'Unavailable'}
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