import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  adminLogin: (credentials) => api.post('/auth/admin/login', credentials),
};

// Services API
export const servicesAPI = {
  getAll: () => api.get('/services'),
  getById: (id) => api.get(`/services/${id}`),
  create: (serviceData) => api.post('/services', serviceData),
};

// Bookings API
export const bookingsAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getMy: () => api.get('/bookings/my'),
  getWorkerBookings: () => api.get('/bookings/worker'),
  getById: (id) => api.get(`/bookings/${id}`),
  accept: (id) => api.put(`/bookings/${id}/accept`),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
};

// Addresses API
export const addressesAPI = {
  create: (addressData) => api.post('/addresses', addressData),
  getAll: () => api.get('/addresses'),
  update: (id, addressData) => api.put(`/addresses/${id}`, addressData),
  delete: (id) => api.delete(`/addresses/${id}`),
  setDefault: (id) => api.put(`/addresses/${id}/default`),
};

// Complaints API
export const complaintsAPI = {
  create: (complaintData) => api.post('/complaints', complaintData),
  getMy: () => api.get('/complaints/my'),
  getById: (id) => api.get(`/complaints/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  getData: () => api.get('/dashboard'),
};

// Analytics API
export const analyticsAPI = {
  getOverview: (params) => api.get('/analytics/overview', { params }),
  getWorkerAnalytics: (params) => api.get('/analytics/worker', { params }),
};

// Notifications API
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
};

// Workers API
export const workersAPI = {
  getAll: (params) => api.get('/workers', { params }),
  getById: (id) => api.get(`/workers/${id}`),
  getAvailableJobs: (params) => api.get('/workers/jobs/available', { params }),
  updateKycStatus: (data) => api.put('/workers/kyc/status', data),
  submitKyc: (data) => api.post('/workers/kyc/submit', data),
  getMyProfile: () => api.get('/workers/profile/me'),
  updateMyProfile: (data) => api.put('/workers/profile/me', data),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  getDashboardStats: () => api.get('/users/dashboard-stats'),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getBookings: () => api.get('/admin/bookings'),
  getComplaints: () => api.get('/admin/complaints'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getWorkers: (params) => api.get('/admin/workers', { params }),
  verifyWorker: (workerId) => api.put(`/admin/workers/${workerId}/verify`),
  suspendWorker: (workerId) => api.put(`/admin/workers/${workerId}/suspend`),
  updateComplaintStatus: (complaintId, data) => api.put(`/admin/complaints/${complaintId}/status`, data),
  getPendingKyc: () => api.get('/admin/kyc/pending'),
  updateKycStatus: (workerId, data) => api.put(`/admin/kyc/${workerId}/status`, data),
};

// Reviews API
export const reviewsAPI = {
  create: (reviewData) => api.post('/reviews', reviewData),
  getWorkerReviews: (workerId) => api.get(`/reviews/worker/${workerId}`),
};

export default api;