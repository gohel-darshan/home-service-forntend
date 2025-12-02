import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, UserCheck, UserX, Mail, Phone, Calendar, MapPin, Star, Briefcase } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { adminAPI } from '../../../lib/api';
import toast from 'react-hot-toast';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({
    role: '',
    status: 'all'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    loadUsers();
  }, [filters, searchQuery, pagination.page]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers({
        role: filters.role,
        search: searchQuery,
        page: pagination.page,
        limit: pagination.limit
      });
      
      setUsers(response.data.users || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination?.total || 0,
        pages: response.data.pagination?.pages || 0
      }));
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const getUserStats = () => {
    const stats = {
      total: users.length,
      customers: users.filter(u => u.role === 'CUSTOMER').length,
      workers: users.filter(u => u.role === 'WORKER').length,
      admins: users.filter(u => u.role === 'ADMIN').length,
      activeToday: users.filter(u => {
        const today = new Date();
        const userDate = new Date(u.updatedAt);
        return userDate.toDateString() === today.toDateString();
      }).length
    };
    return stats;
  };

  const userStats = getUserStats();

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'ADMIN': return 'error';
      case 'WORKER': return 'warning';
      case 'CUSTOMER': return 'success';
      default: return 'default';
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">Manage all platform users</p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          >
            <option value="">All Roles</option>
            <option value="CUSTOMER">Customers</option>
            <option value="WORKER">Workers</option>
            <option value="ADMIN">Admins</option>
          </select>
          
          <Button 
            variant="outline"
            onClick={() => {
              setFilters({ role: '', status: 'all' });
              setSearchQuery('');
            }}
          >
            <Filter className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold">{pagination.total}</p>
            </div>
            <UserCheck className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Customers</p>
              <p className="text-2xl font-bold text-green-600">{userStats.customers}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Workers</p>
              <p className="text-2xl font-bold text-yellow-600">{userStats.workers}</p>
            </div>
            <Briefcase className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-red-600">{userStats.admins}</p>
            </div>
            <UserX className="w-8 h-8 text-red-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Today</p>
              <p className="text-2xl font-bold text-purple-600">{userStats.activeToday}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {users.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No users found matching your criteria</p>
          </Card>
        ) : (
          users.map((user) => (
            <Card key={user.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">
                      {user.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{user.name}</h3>
                      <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                        {user.role}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
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

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold">User Details</h2>
              <button onClick={() => setSelectedUser(null)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {selectedUser.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-bold">{selectedUser.name}</h3>
                    <Badge variant={getRoleBadgeVariant(selectedUser.role)}>
                      {selectedUser.role}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{selectedUser.email}</span>
                    </div>
                    {selectedUser.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{selectedUser.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Last active {new Date(selectedUser.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role-specific details */}
              {selectedUser.role === 'CUSTOMER' && selectedUser.customerProfile && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-bold text-green-800 mb-3">Customer Details</h4>
                  <div className="text-sm text-green-700 space-y-2">
                    <div>Total Bookings: {selectedUser.bookings?.length || 0}</div>
                    {selectedUser.customerProfile.addresses?.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span className="font-medium">{selectedUser.customerProfile.addresses.length} saved address(es):</span>
                        </div>
                        {selectedUser.customerProfile.addresses.map((addr, idx) => (
                          <div key={idx} className="ml-5 p-2 bg-white rounded border">
                            <div className="font-medium">{addr.type}</div>
                            <div>{addr.street}, {addr.city}, {addr.state} {addr.zipCode}</div>
                            {addr.isDefault && <Badge variant="success" className="text-xs mt-1">Default</Badge>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedUser.role === 'WORKER' && selectedUser.workerProfile && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-bold text-yellow-800 mb-3">Worker Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm text-yellow-700">
                    <div>Profession: <span className="font-medium">{selectedUser.workerProfile.profession}</span></div>
                    <div>Experience: <span className="font-medium">{selectedUser.workerProfile.experience} years</span></div>
                    <div>Hourly Rate: <span className="font-medium">₹{selectedUser.workerProfile.hourlyRate}</span></div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>Rating: <span className="font-medium">{selectedUser.workerProfile.rating.toFixed(1)}</span></span>
                    </div>
                    <div>Status: <span className="font-medium">{selectedUser.workerProfile.isVerified ? 'Verified' : 'Pending'}</span></div>
                    <div>Availability: <span className="font-medium">{selectedUser.workerProfile.isAvailable ? 'Available' : 'Unavailable'}</span></div>
                    <div>Total Jobs: <span className="font-medium">{selectedUser.workerProfile.totalJobs}</span></div>
                    {selectedUser.workerProfile.skills?.length > 0 && (
                      <div className="col-span-2">
                        <div className="font-medium mb-1">Skills:</div>
                        <div className="flex flex-wrap gap-1">
                          {selectedUser.workerProfile.skills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Booking history */}
              {selectedUser.bookings && selectedUser.bookings.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-800 mb-3">Booking Activity</h4>
                  <div className="text-sm text-blue-700">
                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div>Total: <span className="font-medium">{selectedUser.bookings.length}</span></div>
                      <div>Completed: <span className="font-medium">{selectedUser.bookings.filter(b => b.status === 'COMPLETED').length}</span></div>
                      <div>Pending: <span className="font-medium">{selectedUser.bookings.filter(b => b.status === 'PENDING').length}</span></div>
                      <div>Cancelled: <span className="font-medium">{selectedUser.bookings.filter(b => b.status === 'CANCELLED').length}</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}