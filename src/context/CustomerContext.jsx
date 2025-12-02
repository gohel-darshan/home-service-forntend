import React, { createContext, useContext, useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';
import toast from 'react-hot-toast';

const CustomerContext = createContext();

export const useCustomer = () => useContext(CustomerContext);

export const CustomerProvider = ({ children }) => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 1. User Profile State
  const [user, setUser] = useState({
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@example.com',
    avatar: null
  });

  // 2. Addresses State
  const [addresses, setAddresses] = useState([
    { id: '1', type: 'Home', text: 'Flat 402, Galaxy Apartments, Sector 45, Gurgaon' },
    { id: '2', type: 'Office', text: 'WeWork, Cyber City, DLF Phase 2, Gurgaon' }
  ]);

  // 3. Payment Methods State
  const [paymentMethods, setPaymentMethods] = useState([
    { id: '1', type: 'card', brand: 'Visa', last4: '4242', expiry: '12/25' },
    { id: '2', type: 'upi', vpa: 'rahul@okhdfc' }
  ]);

  // 4. Complaints State
  const [complaints, setComplaints] = useState([
    { id: 'c1', subject: 'Worker arrived late', status: 'Resolved', date: '2023-10-15', description: 'The electrician was 30 mins late.' }
  ]);

  // 5. Bookings State
  const [bookings, setBookings] = useState([
    {
      id: 'bk-demo',
      service: 'AC Repair',
      workerName: 'Rajesh Kumar',
      workerImage: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
      date: '2023-10-24',
      time: '10:00 AM',
      status: 'Completed',
      price: 550,
      trackingStep: 4
    }
  ]);

  // --- Actions ---

  const login = (phone) => {
    setIsAuthenticated(true);
    setUser(prev => ({ ...prev, phone }));
    toast.success('Login Successful!');
  };

  const logout = () => {
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  // User
  const updateUser = (data) => {
    setUser(prev => ({ ...prev, ...data }));
    toast.success('Profile updated successfully!');
  };

  // Address
  const addAddress = (addr) => {
    const newAddr = { id: faker.string.uuid(), ...addr };
    setAddresses([...addresses, newAddr]);
    toast.success('Address added!');
  };

  const updateAddress = (id, data) => {
    setAddresses(addresses.map(a => a.id === id ? { ...a, ...data } : a));
    toast.success('Address updated!');
  };

  const deleteAddress = (id) => {
    setAddresses(addresses.filter(a => a.id !== id));
    toast.success('Address deleted');
  };

  // Payments
  const addPaymentMethod = (method) => {
    setPaymentMethods([...paymentMethods, { id: faker.string.uuid(), ...method }]);
    toast.success('Payment method added!');
  };

  const deletePaymentMethod = (id) => {
    setPaymentMethods(paymentMethods.filter(p => p.id !== id));
    toast.success('Payment method removed');
  };

  // Complaints
  const fileComplaint = (complaint) => {
    setComplaints([{ 
      id: faker.string.uuid(), 
      status: 'Pending', 
      date: new Date().toISOString().split('T')[0], 
      ...complaint 
    }, ...complaints]);
    toast.success('Complaint submitted.');
  };

  // Bookings
  const addBooking = (bookingDetails) => {
    const newBooking = {
      id: `bk-${Date.now()}`,
      status: 'Pending',
      trackingStep: 0, // 0: Accepted
      ...bookingDetails
    };
    setBookings([newBooking, ...bookings]);
    return newBooking.id;
  };

  const getBooking = (id) => bookings.find(b => b.id === id);

  const updateBookingStatus = (id, step) => {
    setBookings(bookings.map(b => {
      if (b.id === id) {
        let status = 'In Progress';
        if (step === 0) status = 'Accepted';
        if (step === 1) status = 'En Route';
        if (step === 4) status = 'Completed';
        return { ...b, trackingStep: step, status };
      }
      return b;
    }));
  };

  return (
    <CustomerContext.Provider value={{
      isAuthenticated, login, logout,
      user, updateUser,
      addresses, addAddress, updateAddress, deleteAddress,
      paymentMethods, addPaymentMethod, deletePaymentMethod,
      complaints, fileComplaint,
      bookings, addBooking, getBooking, updateBookingStatus
    }}>
      {children}
    </CustomerContext.Provider>
  );
};
