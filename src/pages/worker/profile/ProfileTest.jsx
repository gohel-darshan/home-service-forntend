import React, { useState } from 'react';
import { authAPI } from '../../../lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import DynamicWorkerProfile from './DynamicWorkerProfile';

export default function ProfileTest() {
  const [credentials, setCredentials] = useState({
    email: 'worker@example.com',
    password: 'worker123'
  });
  const [loading, setLoading] = useState(false);
  const { login, user, isAuthenticated } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await authAPI.login(credentials);
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      login(userData);
      toast.success('Logged in successfully!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated && user?.role === 'WORKER') {
    return <DynamicWorkerProfile />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Worker Profile Test</h1>
          <p className="text-gray-600 mt-2">Login to see real data or view demo</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login as Worker'}
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">Or view demo profile:</p>
          <DynamicWorkerProfile />
        </div>
      </div>
    </div>
  );
}