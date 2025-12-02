import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, usersAPI } from '../lib/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await usersAPI.getProfile();
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  };

  const login = async (credentials, role) => {
    try {
      setLoading(true);
      let response;
      
      if (role === 'ADMIN') {
        response = await authAPI.adminLogin(credentials);
      } else {
        response = await authAPI.login({ ...credentials, role });
      }
      
      const { token, user } = response.data;
      
      // Validate user role matches expected role
      if (role && user.role !== role) {
        throw new Error(`Invalid credentials for ${role.toLowerCase()} login`);
      }
      
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      toast.success('Login successful!');
      
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      
      toast.success('Registration successful! Please login with your credentials.');
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
    // Force a page reload to clear all state
    window.location.href = '/';
  };

  const updateProfile = async (userData) => {
    try {
      const response = await usersAPI.updateProfile(userData);
      setUser(response.data);
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Helper functions for role checking
  const isCustomer = () => user?.role === 'CUSTOMER';
  const isWorker = () => user?.role === 'WORKER';
  const isAdmin = () => user?.role === 'ADMIN';

  const value = {
    user,
    loading,
    isAuthenticated,
    isCustomer,
    isWorker,
    isAdmin,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};