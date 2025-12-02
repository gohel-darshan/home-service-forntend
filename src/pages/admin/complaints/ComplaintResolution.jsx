import React, { useState, useEffect } from 'react';
import { Search, Filter, MessageSquare, CheckCircle, User, Mail, Phone, Calendar, AlertTriangle, Clock } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { adminAPI } from '../../../lib/api';
import toast from 'react-hot-toast';

export default function ComplaintResolution() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: ''
  });

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getComplaints();
      setComplaints(response.data || []);
    } catch (error) {
      console.error('Error loading complaints:', error);
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (complaintId, status, priority) => {
    try {
      await adminAPI.updateComplaintStatus(complaintId, { status, priority });
      setComplaints(prev => prev.map(complaint => 
        complaint.id === complaintId ? { ...complaint, status, ...(priority && { priority }) } : complaint
      ));
      toast.success('Complaint status updated successfully');
    } catch (error) {
      console.error('Error updating complaint:', error);
      toast.error('Failed to update complaint status');
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'RESOLVED': return 'success';
      case 'IN_PROGRESS': return 'warning';
      case 'CLOSED': return 'secondary';
      case 'OPEN': return 'error';
      default: return 'default';
    }
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'URGENT': return 'error';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'default';
      case 'LOW': return 'secondary';
      default: return 'default';
    }
  };

  const getComplaintStats = () => {
    const stats = {
      total: complaints.length,
      open: complaints.filter(c => c.status === 'OPEN').length,
      inProgress: complaints.filter(c => c.status === 'IN_PROGRESS').length,
      resolved: complaints.filter(c => c.status === 'RESOLVED').length,
      closed: complaints.filter(c => c.status === 'CLOSED').length,
      urgent: complaints.filter(c => c.priority === 'URGENT').length
    };
    return stats;
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = !searchQuery || 
      complaint.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !filters.status || complaint.status === filters.status;
    const matchesPriority = !filters.priority || complaint.priority === filters.priority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const complaintStats = getComplaintStats();

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
        <h1 className="text-2xl font-bold text-gray-900">Complaint Resolution</h1>
        <p className="text-gray-600">Manage and resolve customer complaints</p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search complaints by title, customer, or description..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          >
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
          
          <select
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          >
            <option value="">All Priority</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
          
          <Button 
            variant="outline"
            onClick={() => {
              setFilters({ status: '', priority: '' });
              setSearchQuery('');
            }}
          >
            <Filter className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold">{complaintStats.total}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open</p>
              <p className="text-2xl font-bold text-red-600">{complaintStats.open}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">{complaintStats.inProgress}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{complaintStats.resolved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Closed</p>
              <p className="text-2xl font-bold text-gray-600">{complaintStats.closed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-gray-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Urgent</p>
              <p className="text-2xl font-bold text-red-600">{complaintStats.urgent}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No complaints found matching your criteria</p>
          </Card>
        ) : (
          filteredComplaints.map((complaint) => (
            <Card key={complaint.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-red-500" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{complaint.title}</h3>
                      <Badge variant={getStatusBadgeVariant(complaint.status)} className="text-xs">
                        {complaint.status}
                      </Badge>
                      <Badge variant={getPriorityBadgeVariant(complaint.priority)} className="text-xs">
                        {complaint.priority}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Customer: {complaint.customer?.name}</div>
                      <div>Filed: {new Date(complaint.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedComplaint(complaint)}>
                    <MessageSquare className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Complaint Details Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold">Complaint Details</h2>
              <button onClick={() => setSelectedComplaint(null)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-red-50 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-10 h-10 text-red-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-bold">{selectedComplaint.title}</h3>
                    <Badge variant={getStatusBadgeVariant(selectedComplaint.status)}>
                      {selectedComplaint.status}
                    </Badge>
                    <Badge variant={getPriorityBadgeVariant(selectedComplaint.priority)}>
                      {selectedComplaint.priority}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold text-blue-800 mb-3">Customer Information</h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{selectedComplaint.customer?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{selectedComplaint.customer?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{selectedComplaint.customer?.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Complaint Description */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-3">Complaint Description</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedComplaint.description}</p>
              </div>

              {/* Timeline */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-bold text-purple-800 mb-3">Timeline</h4>
                <div className="space-y-2 text-sm text-purple-700">
                  <div>Filed: <span className="font-medium">{new Date(selectedComplaint.createdAt).toLocaleString()}</span></div>
                  <div>Last Updated: <span className="font-medium">{new Date(selectedComplaint.updatedAt).toLocaleString()}</span></div>
                </div>
              </div>

              {/* Status Management */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-bold text-yellow-800 mb-3">Status Management</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-yellow-700 mb-1">Status</label>
                    <select
                      value={selectedComplaint.status}
                      onChange={(e) => handleUpdateStatus(selectedComplaint.id, e.target.value, selectedComplaint.priority)}
                      className="w-full px-3 py-2 border border-yellow-200 rounded-lg bg-white text-sm"
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-yellow-700 mb-1">Priority</label>
                    <select
                      value={selectedComplaint.priority}
                      onChange={(e) => handleUpdateStatus(selectedComplaint.id, selectedComplaint.status, e.target.value)}
                      className="w-full px-3 py-2 border border-yellow-200 rounded-lg bg-white text-sm"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500 pt-4 border-t">
                Complaint ID: {selectedComplaint.id}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}