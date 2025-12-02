import React, { createContext, useContext, useState, useEffect } from 'react';
import { bookingsAPI, usersAPI } from '../lib/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const BookingContext = createContext();

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    sortBy: 'createdAt'
  });
  
  const [bookingDraft, setBookingDraft] = useState({
    workerId: null,
    workerName: '',
    workerImage: '',
    serviceId: null,
    serviceName: '',
    price: 0,
    date: null,
    time: '',
    addressId: null,
    paymentMethod: 'razorpay'
  });

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await usersAPI.getDashboardStats();
      setDashboardStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  // Fetch user's bookings with filters
  const fetchBookings = async (filterOptions = {}) => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      let response;
      
      if (user?.role === 'WORKER') {
        response = await bookingsAPI.getWorkerBookings();
      } else {
        response = await bookingsAPI.getMy();
      }
      
      let filteredBookings = response.data;
      
      // Apply filters
      if (filterOptions.status && filterOptions.status !== 'all') {
        filteredBookings = filteredBookings.filter(b => b.status === filterOptions.status);
      }
      
      if (filterOptions.dateRange && filterOptions.dateRange !== 'all') {
        const now = new Date();
        const filterDate = new Date();
        
        switch (filterOptions.dateRange) {
          case 'today':
            filterDate.setHours(0, 0, 0, 0);
            break;
          case 'week':
            filterDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            filterDate.setMonth(now.getMonth() - 1);
            break;
        }
        
        filteredBookings = filteredBookings.filter(b => 
          new Date(b.createdAt) >= filterDate
        );
      }
      
      // Apply sorting
      if (filterOptions.sortBy) {
        filteredBookings.sort((a, b) => {
          switch (filterOptions.sortBy) {
            case 'amount':
              return b.totalAmount - a.totalAmount;
            case 'status':
              return a.status.localeCompare(b.status);
            default:
              return new Date(b.createdAt) - new Date(a.createdAt);
          }
        });
      }
      
      setBookings(filteredBookings);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  // Create new booking
  const createBooking = async (bookingData) => {
    try {
      setLoading(true);
      const response = await bookingsAPI.create(bookingData);
      setBookings(prev => [response.data, ...prev]);
      await fetchDashboardStats();
      toast.success('Booking created successfully!');
      return { success: true, booking: response.data };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to create booking';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Update booking status
  const updateBookingStatus = async (bookingId, status) => {
    try {
      const response = await bookingsAPI.updateStatus(bookingId, status);
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId ? response.data : booking
        )
      );
      await fetchDashboardStats();
      toast.success('Booking status updated!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update booking';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Accept booking (for workers)
  const acceptBooking = async (bookingId) => {
    try {
      const response = await bookingsAPI.accept(bookingId);
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId ? response.data : booking
        )
      );
      await fetchDashboardStats();
      toast.success('Booking accepted!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to accept booking';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Get booking by ID
  const getBookingById = async (bookingId) => {
    try {
      const response = await bookingsAPI.getById(bookingId);
      setCurrentBooking(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch booking:', error);
      return null;
    }
  };

  // Apply filters
  const applyFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    fetchBookings({ ...filters, ...newFilters });
  };

  // Get bookings by status
  const getBookingsByStatus = (status) => {
    return bookings.filter(booking => booking.status === status);
  };

  const updateDraft = (data) => {
    setBookingDraft(prev => ({ ...prev, ...data }));
  };

  const clearDraft = () => {
    setBookingDraft({
      workerId: null,
      workerName: '',
      workerImage: '',
      serviceId: null,
      serviceName: '',
      price: 0,
      date: null,
      time: '',
      addressId: null,
      paymentMethod: 'razorpay'
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings(filters);
      fetchDashboardStats();
    }
  }, [isAuthenticated, user]);

  const value = {
    bookings,
    currentBooking,
    loading,
    dashboardStats,
    filters,
    bookingDraft,
    fetchBookings,
    fetchDashboardStats,
    createBooking,
    updateBookingStatus,
    acceptBooking,
    getBookingById,
    applyFilters,
    getBookingsByStatus,
    setCurrentBooking,
    updateDraft,
    clearDraft
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};
