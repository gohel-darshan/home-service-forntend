import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { workersAPI, bookingsAPI } from '../lib/api';
import { useAuth } from './AuthContext';

const WorkerContext = createContext();

export const useWorker = () => useContext(WorkerContext);

export const WorkerProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  // 1. Worker Profile State
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    profession: '',
    experience: 0,
    hourlyRate: 0,
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
    isVerified: false,
    kycStatus: 'NOT_STARTED',
    skills: [],
    availability: null,
    portfolio: [],
    rating: 0,
    totalJobs: 0
  });

  const [stats, setStats] = useState({
    completedJobs: 0,
    totalEarnings: 0,
    avgRating: 0,
    totalReviews: 0
  });

  // 2. Jobs State
  const [jobs, setJobs] = useState([]);

  // 3. Earnings State
  const [earnings, setEarnings] = useState({
    total: 0,
    available: 0,
    history: [],
    bankAccount: null
  });

  // 4. Notifications
  const [notifications, setNotifications] = useState([]);

  // Load worker profile data
  const loadProfile = async () => {
    if (!isAuthenticated || user?.role !== 'WORKER') {
      // Load mock data if not authenticated or not a worker
      setProfile({
        name: 'Jane Smith',
        phone: '+1234567891',
        email: 'worker@example.com',
        profession: 'AC Technician',
        experience: 5,
        hourlyRate: 500,
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
        isVerified: false,
        kycStatus: 'PENDING',
        skills: ['AC Installation', 'Gas Refill', 'Copper Piping', 'Electrical Work'],
        availability: {
          "monday": { "available": true, "startTime": "09:00", "endTime": "18:00" },
          "tuesday": { "available": true, "startTime": "09:00", "endTime": "18:00" }
        },
        portfolio: [
          'https://images.unsplash.com/photo-1581092921461-eab62e97a783?w=400',
          'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400'
        ],
        rating: 4.8,
        totalJobs: 25
      });
      
      setStats({
        completedJobs: 25,
        totalEarnings: 12450,
        avgRating: 4.8,
        totalReviews: 18
      });
      
      setEarnings({
        total: 12450,
        available: 9960,
        history: [],
        bankAccount: null
      });
      return;
    }
    
    try {
      setLoading(true);
      const response = await workersAPI.getMyProfile();
      const workerData = response.data;
      
      setProfile({
        name: workerData.user.name,
        phone: workerData.user.phone,
        email: workerData.user.email,
        profession: workerData.profession || '',
        experience: workerData.experience || 0,
        hourlyRate: workerData.hourlyRate || 0,
        avatar: workerData.profilePhoto || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
        isVerified: workerData.isVerified,
        kycStatus: workerData.kycStatus,
        skills: workerData.skills || [],
        availability: workerData.availability,
        portfolio: workerData.portfolio || [],
        rating: workerData.rating,
        totalJobs: workerData.totalJobs
      });
      
      setStats(workerData.stats);
      setJobs(workerData.bookings || []);
      
      // Calculate earnings from completed bookings
      const totalEarnings = workerData.stats.totalEarnings || 0;
      setEarnings(prev => ({
        ...prev,
        total: totalEarnings,
        available: totalEarnings * 0.8 // Assuming 80% available
      }));
      
    } catch (error) {
      console.error('Failed to load profile:', error);
      // Load fallback data on API error
      setProfile({
        name: 'Jane Smith',
        phone: '+1234567891',
        email: 'worker@example.com',
        profession: 'AC Technician',
        experience: 5,
        hourlyRate: 500,
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
        isVerified: false,
        kycStatus: 'PENDING',
        skills: ['AC Installation', 'Gas Refill', 'Copper Piping', 'Electrical Work'],
        availability: {
          "monday": { "available": true, "startTime": "09:00", "endTime": "18:00" },
          "tuesday": { "available": true, "startTime": "09:00", "endTime": "18:00" }
        },
        portfolio: [
          'https://images.unsplash.com/photo-1581092921461-eab62e97a783?w=400',
          'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400'
        ],
        rating: 4.8,
        totalJobs: 25
      });
      
      setStats({
        completedJobs: 25,
        totalEarnings: 12450,
        avgRating: 4.8,
        totalReviews: 18
      });
      
      setEarnings({
        total: 12450,
        available: 9960,
        history: [],
        bankAccount: null
      });
      
      toast.error('Using demo data - login as worker for real data');
    } finally {
      setLoading(false);
    }
  };

  // Load data when authenticated
  useEffect(() => {
    loadProfile();
  }, [isAuthenticated, user]);

  // --- Actions ---

  const updateProfile = async (data) => {
    try {
      setLoading(true);
      await workersAPI.updateMyProfile(data);
      setProfile(prev => ({ ...prev, ...data }));
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const updateKycStatus = (status) => {
    setProfile(prev => ({ ...prev, kycStatus: status }));
    if (status === 'verified') toast.success('KYC Verified!');
  };

  const acceptJob = async (jobId) => {
    try {
      await bookingsAPI.accept(jobId);
      setJobs(jobs.map(j => j.id === jobId ? { ...j, status: 'CONFIRMED' } : j));
      toast.success('Job Accepted');
    } catch (error) {
      toast.error('Failed to accept job');
    }
  };

  const rejectJob = (jobId) => {
    setJobs(jobs.filter(j => j.id !== jobId));
    toast.success('Job Declined');
  };

  const updateJobStatus = async (jobId, status) => {
    try {
      await bookingsAPI.updateStatus(jobId, status);
      setJobs(jobs.map(j => j.id === jobId ? { ...j, status } : j));
      
      if (status === 'COMPLETED') {
        const job = jobs.find(j => j.id === jobId);
        setEarnings(prev => ({
          ...prev,
          total: prev.total + job.totalAmount,
          available: prev.available + job.totalAmount,
          history: [{ 
            id: Date.now(), 
            date: 'Today', 
            amount: job.totalAmount, 
            source: job.service.name 
          }, ...prev.history]
        }));
        toast.success('Job Completed! Payment added to wallet.');
        // Reload profile to get updated stats
        loadProfile();
      }
    } catch (error) {
      toast.error('Failed to update job status');
    }
  };

  const addBankAccount = (details) => {
    setEarnings(prev => ({ ...prev, bankAccount: details }));
    toast.success('Bank account added');
  };

  const withdrawMoney = (amount) => {
    if (amount > earnings.available) return toast.error('Insufficient balance');
    setEarnings(prev => ({ ...prev, available: prev.available - amount }));
    toast.success(`Withdrawal of ₹${amount} initiated`);
  };

  return (
    <WorkerContext.Provider value={{
      loading,
      profile, 
      stats,
      updateProfile, 
      updateKycStatus,
      jobs, 
      acceptJob, 
      rejectJob, 
      updateJobStatus,
      earnings, 
      addBankAccount, 
      withdrawMoney,
      notifications,
      loadProfile
    }}>
      {children}
    </WorkerContext.Provider>
  );
};
