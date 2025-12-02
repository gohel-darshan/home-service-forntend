import React, { createContext, useContext, useState } from 'react';
import { faker } from '@faker-js/faker';
import toast from 'react-hot-toast';
import { WORKERS, CATEGORIES, BOOKINGS } from '../data/mock';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  // 1. Workers State
  const [workers, setWorkers] = useState(WORKERS.map(w => ({
    ...w,
    kycStatus: w.verified ? 'verified' : 'pending',
    joinedDate: faker.date.past().toLocaleDateString(),
    email: faker.internet.email(),
    phone: faker.phone.number()
  })));

  // 2. Bookings State
  const [bookings, setBookings] = useState(BOOKINGS.map(b => ({
    ...b,
    customerName: faker.person.fullName(),
    paymentStatus: 'Paid'
  })));

  // 3. Services State
  const [categories, setCategories] = useState(CATEGORIES);

  // 4. Complaints State
  const [complaints, setComplaints] = useState([
    { 
      id: 'cmp-1', 
      type: 'Customer',
      user: 'Rahul Sharma', 
      worker: 'Amit Singh', 
      issue: 'Worker arrived late', 
      status: 'Pending', 
      date: '2023-10-24',
      description: 'The worker was 45 minutes late and did not inform.'
    },
    { 
      id: 'cmp-2', 
      type: 'Worker',
      user: 'Priya Patel', 
      worker: 'Rajesh Kumar', 
      issue: 'Customer refused to pay extra', 
      status: 'Resolved', 
      date: '2023-10-20',
      description: 'Customer added extra work but refused to pay for parts.'
    }
  ]);

  // 5. Settings & Earnings State
  const [settings, setSettings] = useState({
    commissionRate: 15,
    maintenanceMode: false,
    pushEnabled: true,
    emailAlerts: true
  });

  const [banners, setBanners] = useState([
    { id: 1, url: 'https://images.unsplash.com/photo-1581578731117-104f2a863a38?auto=format&fit=crop&q=80&w=800', active: true }
  ]);

  const [admins, setAdmins] = useState([
    { id: 1, name: 'Super Admin', email: 'admin@servicepro.com', role: 'Super Admin' },
    { id: 2, name: 'Support Lead', email: 'support@servicepro.com', role: 'Support' }
  ]);

  const [settlements, setSettlements] = useState([
    { id: 'st-1', worker: 'Rajesh Kumar', amount: 4500, date: '2023-10-25', status: 'Processed' },
    { id: 'st-2', worker: 'Amit Singh', amount: 2100, date: '2023-10-24', status: 'Pending' }
  ]);

  // --- Actions ---

  const login = (email, password) => {
    // Mock Login
    if (email === 'admin@servicepro.com' && password === 'admin') {
      setIsAuthenticated(true);
      setAdminUser({ name: 'Super Admin', email });
      toast.success('Welcome Admin');
      return true;
    } else {
      toast.error('Invalid credentials');
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminUser(null);
    toast.success('Logged out');
  };

  // Worker Actions
  const verifyWorker = (id) => {
    setWorkers(workers.map(w => w.id === id ? { ...w, kycStatus: 'verified', verified: true } : w));
    toast.success('Worker KYC Approved');
  };

  const rejectWorker = (id) => {
    setWorkers(workers.map(w => w.id === id ? { ...w, kycStatus: 'rejected' } : w));
    toast.error('Worker KYC Rejected');
  };

  const updateWorker = (id, data) => {
    setWorkers(workers.map(w => w.id === id ? { ...w, ...data } : w));
    toast.success('Worker details updated');
  };

  const deleteWorker = (id) => {
    setWorkers(workers.filter(w => w.id !== id));
    toast.success('Worker removed');
  };

  // Booking Actions
  const updateBookingStatus = (id, status) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    toast.success(`Booking marked as ${status}`);
  };

  const processRefund = (id) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'Refunded', paymentStatus: 'Refunded' } : b));
    toast.success('Refund processed successfully');
  };

  // Service Actions
  const addCategory = (category) => {
    setCategories([...categories, { ...category, id: faker.string.uuid() }]);
    toast.success('Category added');
  };

  const updateCategory = (id, data) => {
    setCategories(categories.map(c => c.id === id ? { ...c, ...data } : c));
    toast.success('Category updated');
  };

  const deleteCategory = (id) => {
    setCategories(categories.filter(c => c.id !== id));
    toast.success('Category deleted');
  };

  // Complaint Actions
  const resolveComplaint = (id, resolutionNote) => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, status: 'Resolved', resolution: resolutionNote } : c));
    toast.success('Complaint resolved');
  };

  // Settings & Admin Actions
  const updateSettings = (newSettings) => {
    setSettings({ ...settings, ...newSettings });
    toast.success('Settings saved');
  };

  const addBanner = (url) => {
    setBanners([...banners, { id: Date.now(), url, active: true }]);
    toast.success('Banner added');
  };

  const removeBanner = (id) => {
    setBanners(banners.filter(b => b.id !== id));
    toast.success('Banner removed');
  };

  const addAdmin = (admin) => {
    setAdmins([...admins, { id: Date.now(), ...admin }]);
    toast.success('Admin added');
  };

  const removeAdmin = (id) => {
    setAdmins(admins.filter(a => a.id !== id));
    toast.success('Admin removed');
  };

  return (
    <AdminContext.Provider value={{
      isAuthenticated, login, logout, adminUser,
      workers, verifyWorker, rejectWorker, updateWorker, deleteWorker,
      bookings, updateBookingStatus, processRefund,
      categories, addCategory, updateCategory, deleteCategory,
      complaints, resolveComplaint,
      settings, updateSettings,
      banners, addBanner, removeBanner,
      admins, addAdmin, removeAdmin,
      settlements
    }}>
      {children}
    </AdminContext.Provider>
  );
};
