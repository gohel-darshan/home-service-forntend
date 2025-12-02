import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Star, Users, TrendingUp, Clock, DollarSign, User, Mail, Phone, Calendar, Briefcase } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { adminAPI } from '../../../lib/api';
import toast from 'react-hot-toast';

export default function WorkerManagement() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    profession: '',
    isVerified: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    loadWorkers();
  }, []);
  
  useEffect(() => {
    if (workers.length > 0) {
      loadWorkers();
    }
  }, [filters, searchQuery]);

  const loadWorkers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getWorkers();
      let workersData = response.data.workers || [];
      
      // Apply client-side filtering
      if (searchQuery) {
        workersData = workersData.filter(worker => 
          worker.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          worker.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          worker.profession?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (filters.isVerified && filters.isVerified !== '') {
        workersData = workersData.filter(worker => 
          worker.isVerified === (filters.isVerified === 'true')
        );
      }
      
      if (filters.profession && filters.profession !== '') {
        workersData = workersData.filter(worker => 
          worker.profession?.toLowerCase().includes(filters.profession.toLowerCase())
        );
      }
      
      setWorkers(workersData);
      setPagination(prev => ({
        ...prev,
        total: workersData.length,
        pages: Math.ceil(workersData.length / prev.limit)
      }));
    } catch (error) {
      console.error('Error loading workers:', error);
      toast.error('Failed to load workers');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyWorker = async (workerId) => {
    try {
      await adminAPI.verifyWorker(workerId);
      setWorkers(prev => prev.map(worker => 
        worker.id === workerId ? { ...worker, isVerified: true } : worker
      ));
      toast.success('Worker verified successfully');
    } catch (error) {
      console.error('Error verifying worker:', error);
      toast.error('Failed to verify worker');
    }
  };

  const handleSuspendWorker = async (workerId) => {
    try {
      await adminAPI.suspendWorker(workerId);
      setWorkers(prev => prev.map(worker => 
        worker.id === workerId ? { ...worker, isAvailable: false } : worker
      ));
      toast.success('Worker suspended successfully');
    } catch (error) {
      console.error('Error suspending worker:', error);
      toast.error('Failed to suspend worker');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const getWorkerStats = () => {
    const stats = {
      total: workers.length,
      verified: workers.filter(w => w.isVerified).length,
      pending: workers.filter(w => !w.isVerified).length,
      active: workers.filter(w => w.isAvailable).length,
      avgRating: workers.length > 0 
        ? workers.reduce((sum, w) => sum + w.rating, 0) / workers.length 
        : 0,
      totalEarnings: workers.reduce((sum, w) => sum + (w.stats?.totalEarnings || 0), 0)
    };
    return stats;
  };

  const workerStats = getWorkerStats();
  const professions = [...new Set(workers.map(w => w.profession))];

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
        <h1 className="text-2xl font-bold text-gray-900">Worker Management</h1>
        <p className="text-gray-600">Manage and verify service providers</p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workers by name, email, or profession..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.isVerified}
            onChange={(e) => handleFilterChange('isVerified', e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          >
            <option value="">All Verification Status</option>
            <option value="true">Verified Only</option>
            <option value="false">Pending Verification</option>
          </select>
          
          <select
            value={filters.profession}
            onChange={(e) => handleFilterChange('profession', e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          >
            <option value="">All Professions</option>
            {professions.map(profession => (
              <option key={profession} value={profession}>{profession}</option>
            ))}
          </select>
          
          <Button 
            variant="outline"
            onClick={() => {
              setFilters({ status: 'all', profession: '', isVerified: '' });
              setSearchQuery('');
            }}
          >
            <Filter className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Enhanced Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Workers</p>
              <p className="text-2xl font-bold">{pagination.total}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Verified</p>
              <p className="text-2xl font-bold text-green-600">{workerStats.verified}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{workerStats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-purple-600">{workerStats.avgRating.toFixed(1)}</p>
            </div>
            <Star className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-green-600">₹{workerStats.totalEarnings.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Workers List */}
      <div className="space-y-4">
        {workers.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No workers found matching your criteria</p>
          </Card>
        ) : (
          workers.map((worker) => (
            <Card key={worker.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">
                      {worker.user?.name?.charAt(0) || 'W'}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold">{worker.user?.name}</h3>
                      {worker.isVerified && (
                        <Badge variant="success" className="text-xs">Verified</Badge>
                      )}
                      {!worker.isAvailable && (
                        <Badge variant="secondary" className="text-xs">Inactive</Badge>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>{worker.profession}</div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{worker.rating.toFixed(1)} • {worker.stats?.completedJobs || worker.totalJobs} jobs</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedWorker(worker)}>
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                  
                  {!worker.isVerified && (
                    <Button 
                      size="sm"
                      onClick={() => handleVerifyWorker(worker.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verify
                    </Button>
                  )}
                  
                  {worker.isAvailable && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => handleSuspendWorker(worker.id)}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Suspend
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
        
        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            
            <div className="flex gap-1">
              {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={pagination.page === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Worker Details Modal */}
      {selectedWorker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold">Worker Details</h2>
              <button onClick={() => setSelectedWorker(null)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {selectedWorker.user?.name?.charAt(0) || 'W'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-bold">{selectedWorker.user?.name}</h3>
                    {selectedWorker.isVerified && (
                      <Badge variant="success">Verified</Badge>
                    )}
                    {!selectedWorker.isAvailable && (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{selectedWorker.user?.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{selectedWorker.user?.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(selectedWorker.user?.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span>{selectedWorker.profession}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Details */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-bold text-yellow-800 mb-3">Professional Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-yellow-700">
                  <div>Experience: <span className="font-medium">{selectedWorker.experience} years</span></div>
                  <div>Hourly Rate: <span className="font-medium">₹{selectedWorker.hourlyRate}</span></div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>Rating: <span className="font-medium">{selectedWorker.rating.toFixed(1)}</span></span>
                  </div>
                  <div>Total Jobs: <span className="font-medium">{selectedWorker.totalJobs}</span></div>
                  <div>Status: <span className="font-medium">{selectedWorker.isVerified ? 'Verified' : 'Pending Verification'}</span></div>
                  <div>Availability: <span className="font-medium">{selectedWorker.isAvailable ? 'Available' : 'Unavailable'}</span></div>
                </div>
              </div>

              {/* Skills */}
              {selectedWorker.skills && selectedWorker.skills.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-800 mb-3">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedWorker.skills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Portfolio */}
              {selectedWorker.portfolio && selectedWorker.portfolio.length > 0 && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-bold text-purple-800 mb-3">Portfolio</h4>
                  <div className="text-sm text-purple-700">
                    <div>{selectedWorker.portfolio.length} portfolio item(s)</div>
                  </div>
                </div>
              )}

              {/* Earnings & Statistics */}
              {selectedWorker.stats && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-bold text-green-800 mb-3">Earnings & Statistics</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm text-green-700">
                    <div>Total Earnings: <span className="font-medium">₹{selectedWorker.stats.totalEarnings.toLocaleString()}</span></div>
                    <div>Completed Jobs: <span className="font-medium">{selectedWorker.stats.completedJobs}</span></div>
                    <div>Average Rating: <span className="font-medium">{selectedWorker.stats.averageRating.toFixed(1)}</span></div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                {!selectedWorker.isVerified && (
                  <Button onClick={() => {
                    handleVerifyWorker(selectedWorker.id);
                    setSelectedWorker(null);
                  }}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify Worker
                  </Button>
                )}
                
                {selectedWorker.isAvailable && (
                  <Button 
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      handleSuspendWorker(selectedWorker.id);
                      setSelectedWorker(null);
                    }}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Suspend Worker
                  </Button>
                )}
              </div>

              <div className="text-xs text-gray-500 pt-4 border-t">
                Worker ID: {selectedWorker.id}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}