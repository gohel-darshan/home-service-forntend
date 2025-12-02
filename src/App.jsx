import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { CustomerProvider } from './context/CustomerContext';
import { BookingProvider } from './context/BookingContext';
import { WorkerProvider } from './context/WorkerContext';
import { AdminProvider } from './context/AdminContext';

// Auth Guards
import { CustomerRoute, WorkerRoute, AdminRoute, PublicRoute } from './components/auth/ProtectedRoutes';
import { DashboardRedirect } from './components/auth/DashboardRedirect';
import WorkerVerificationGuard from './components/auth/WorkerVerificationGuard';

// Layouts
import { MobileNav } from './components/layout/MobileNav';
import { AdminSidebar } from './components/layout/AdminSidebar';

// Pages - Common
import Landing from './pages/Landing';

// Pages - Auth
import UserAuth from './pages/auth/UserAuth';
import WorkerAuth from './pages/auth/WorkerAuth';

// Pages - Customer
import LocationPermission from './pages/customer/onboarding/LocationPermission';
import CustomerHome from './pages/customer/Home';
import CategoryDetails from './pages/customer/CategoryDetails';
import WorkerDiscovery from './pages/customer/WorkerDiscovery';
import WorkerProfile from './pages/customer/WorkerProfile';
import BookingSchedule from './pages/customer/booking/BookingSchedule';
import BookingAddress from './pages/customer/booking/BookingAddress';
import BookingPayment from './pages/customer/booking/BookingPayment';
import BookingSuccess from './pages/customer/booking/BookingSuccess';
import JobTracking from './pages/customer/tracking/JobTracking';
import Invoice from './pages/customer/tracking/Invoice';
import Review from './pages/customer/Review';
import CustomerBookings from './pages/customer/Bookings';
import UserProfile from './pages/customer/profile/UserProfile';
import EditProfile from './pages/customer/profile/EditProfile';
import Addresses from './pages/customer/profile/Addresses';
import AddressForm from './pages/customer/profile/AddressForm';
import PaymentMethods from './pages/customer/profile/PaymentMethods';
import AddPaymentMethod from './pages/customer/profile/AddPaymentMethod';
import Complaints from './pages/customer/profile/Complaints';
import FileComplaint from './pages/customer/profile/FileComplaint';

// Pages - Worker
import SelectProfession from './pages/worker/onboarding/SelectProfession';
import BasicDetails from './pages/worker/onboarding/BasicDetails';
import KycUpload from './pages/worker/kyc/KycUpload';
import KycStatus from './pages/worker/kyc/KycStatus';
import KycForm from './pages/worker/kyc/KycForm';
import JobRequests from './pages/worker/jobs/JobRequests';
import MyJobs from './pages/worker/jobs/MyJobs';
import JobDetail from './pages/worker/jobs/JobDetail';
import CompleteJob from './pages/worker/jobs/CompleteJob';
import EarningsHome from './pages/worker/earnings/EarningsHome';
import Withdraw from './pages/worker/earnings/Withdraw';
import BankAccount from './pages/worker/earnings/BankAccount';
import WorkerProfilePage from './pages/worker/profile/WorkerProfile';
import DynamicWorkerProfile from './pages/worker/profile/DynamicWorkerProfile';
import ProfileTest from './pages/worker/profile/ProfileTest'; 
import ProfileBuilder from './pages/worker/profile/ProfileBuilder';
import SkillsForm from './pages/worker/profile/builder/SkillsForm';
import ServicesForm from './pages/worker/profile/builder/ServicesForm';
import AvailabilityForm from './pages/worker/profile/builder/AvailabilityForm';
import PortfolioForm from './pages/worker/profile/builder/PortfolioForm';
import WorkerProfilePreview from './pages/worker/profile/WorkerProfilePreview';
import WorkerNotifications from './pages/worker/Notifications';
import WorkerDashboard from './pages/worker/WorkerDashboard';

// Pages - Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import WorkerManagement from './pages/admin/workers/WorkerManagement';
import BookingManagement from './pages/admin/bookings/BookingManagement';
import ServiceManagement from './pages/admin/services/ServiceManagement';
import ComplaintResolution from './pages/admin/complaints/ComplaintResolution';
import AdminSettings from './pages/admin/settings/AdminSettings';
import EarningsCommission from './pages/admin/earnings/EarningsCommission';
import UserManagement from './pages/admin/users/UserManagement';
import KycManagement from './pages/admin/kyc/KycManagement';

// --- Layout Components ---

const CustomerLayout = () => {
  const location = useLocation();
  const hideNav = [
    '/customer/onboarding', 
    '/customer/welcome',
    '/customer/login',
    '/customer/location',
    '/customer/book/', 
    '/customer/tracking', 
    '/customer/review',
    '/customer/invoice',
    '/customer/profile/'
  ].some(path => location.pathname.includes(path));
  
  const isMainProfile = location.pathname === '/customer/profile';
  const shouldShowNav = !hideNav || isMainProfile;
  
  return (
    <div className="min-h-screen bg-background font-sans text-text">
      <CustomerProvider>
        <BookingProvider>
          <Outlet />
          {shouldShowNav && <MobileNav type="customer" />}
        </BookingProvider>
      </CustomerProvider>
    </div>
  );
};

const WorkerLayout = () => {
  const location = useLocation();
  const hideNav = [
    '/worker/welcome',
    '/worker/login',
    '/worker/onboarding',
    '/worker/kyc',
    '/worker/job/',
    '/worker/earnings/',
    '/worker/profile/builder'
  ].some(path => location.pathname.includes(path));

  return (
    <div className="min-h-screen bg-background font-sans text-text">
      <WorkerProvider>
        <BookingProvider>
          <WorkerVerificationGuard>
            <Outlet />
            {!hideNav && <MobileNav type="worker" />}
          </WorkerVerificationGuard>
        </BookingProvider>
      </WorkerProvider>
    </div>
  );
};

// Wrapper to provide Admin Context to both Login and Dashboard
const AdminContextWrapper = () => (
  <AdminProvider>
    <Outlet />
  </AdminProvider>
);

// Layout for Authenticated Admin Pages (Sidebar + Protection)
const AdminDashboardLayout = () => (
  <div className="min-h-screen bg-gray-50 font-sans text-text flex">
    <AdminRoute>
      <div className="flex w-full">
        <AdminSidebar />
        <main className="flex-1 md:ml-64 overflow-y-auto h-screen">
          <Outlet />
        </main>
      </div>
    </AdminRoute>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-center" />
        <AnimatePresence mode="wait">
          <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />
          
          {/* Auth Routes */}
          <Route path="/auth/user" element={<PublicRoute><UserAuth /></PublicRoute>} />
          <Route path="/auth/worker" element={<PublicRoute><WorkerAuth /></PublicRoute>} />
          
          {/* Customer Routes */}
          <Route path="/customer" element={<CustomerLayout />}>
            
            {/* Protected */}
            <Route path="location" element={<CustomerRoute><LocationPermission /></CustomerRoute>} />
            <Route index element={<CustomerRoute><CustomerHome /></CustomerRoute>} />
            <Route path="category/:id" element={<CustomerRoute><CategoryDetails /></CustomerRoute>} />
            <Route path="search" element={<CustomerRoute><WorkerDiscovery /></CustomerRoute>} />
            <Route path="worker/:id" element={<CustomerRoute><WorkerProfile /></CustomerRoute>} />
            <Route path="book/:workerId/schedule" element={<CustomerRoute><BookingSchedule /></CustomerRoute>} />
            <Route path="book/:workerId/address" element={<CustomerRoute><BookingAddress /></CustomerRoute>} />
            <Route path="book/:workerId/payment" element={<CustomerRoute><BookingPayment /></CustomerRoute>} />
            <Route path="book/success" element={<CustomerRoute><BookingSuccess /></CustomerRoute>} />
            <Route path="bookings" element={<CustomerRoute><CustomerBookings /></CustomerRoute>} />
            <Route path="tracking/:bookingId" element={<CustomerRoute><JobTracking /></CustomerRoute>} />
            <Route path="invoice/:bookingId" element={<CustomerRoute><Invoice /></CustomerRoute>} />
            <Route path="review/:bookingId" element={<CustomerRoute><Review /></CustomerRoute>} />
            <Route path="profile" element={<CustomerRoute><UserProfile /></CustomerRoute>} />
            <Route path="profile/edit" element={<CustomerRoute><EditProfile /></CustomerRoute>} />
            <Route path="profile/addresses" element={<CustomerRoute><Addresses /></CustomerRoute>} />
            <Route path="profile/addresses/new" element={<CustomerRoute><AddressForm /></CustomerRoute>} />
            <Route path="profile/addresses/edit/:id" element={<CustomerRoute><AddressForm /></CustomerRoute>} />
            <Route path="profile/payments" element={<CustomerRoute><PaymentMethods /></CustomerRoute>} />
            <Route path="profile/payments/new" element={<CustomerRoute><AddPaymentMethod /></CustomerRoute>} />
            <Route path="profile/complaints" element={<CustomerRoute><Complaints /></CustomerRoute>} />
            <Route path="profile/complaints/new" element={<CustomerRoute><FileComplaint /></CustomerRoute>} />
          </Route>

          {/* Worker Routes */}
          <Route path="/worker" element={<WorkerLayout />}>
            
            {/* Protected */}
            <Route path="onboarding/profession" element={<WorkerRoute><SelectProfession /></WorkerRoute>} />
            <Route path="onboarding/details" element={<WorkerRoute><BasicDetails /></WorkerRoute>} />
            <Route path="kyc/form" element={<WorkerRoute><KycForm /></WorkerRoute>} />
            <Route path="kyc/upload" element={<WorkerRoute><KycUpload /></WorkerRoute>} />
            <Route path="kyc/status" element={<WorkerRoute><KycStatus /></WorkerRoute>} />
            <Route index element={<WorkerRoute><WorkerDashboard /></WorkerRoute>} />
            <Route path="dashboard" element={<WorkerRoute><WorkerDashboard /></WorkerRoute>} />
            <Route path="requests" element={<WorkerRoute><JobRequests /></WorkerRoute>} />
            <Route path="jobs" element={<WorkerRoute><MyJobs /></WorkerRoute>} />
            <Route path="job/:id" element={<WorkerRoute><JobDetail /></WorkerRoute>} />
            <Route path="job/:id/complete" element={<WorkerRoute><CompleteJob /></WorkerRoute>} />
            <Route path="earnings" element={<WorkerRoute><EarningsHome /></WorkerRoute>} />
            <Route path="earnings/withdraw" element={<WorkerRoute><Withdraw /></WorkerRoute>} />
            <Route path="earnings/bank" element={<WorkerRoute><BankAccount /></WorkerRoute>} />
            <Route path="profile" element={<WorkerRoute><DynamicWorkerProfile /></WorkerRoute>} />
            <Route path="profile/test" element={<ProfileTest />} />
            <Route path="profile/builder" element={<WorkerRoute><ProfileBuilder /></WorkerRoute>} />
            <Route path="profile/builder/skills" element={<WorkerRoute><SkillsForm /></WorkerRoute>} />
            <Route path="profile/builder/services" element={<WorkerRoute><ServicesForm /></WorkerRoute>} />
            <Route path="profile/builder/availability" element={<WorkerRoute><AvailabilityForm /></WorkerRoute>} />
            <Route path="profile/builder/portfolio" element={<WorkerRoute><PortfolioForm /></WorkerRoute>} />
            <Route path="profile/preview" element={<WorkerRoute><WorkerProfilePreview /></WorkerRoute>} />
            <Route path="notifications" element={<WorkerRoute><WorkerNotifications /></WorkerRoute>} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminContextWrapper />}>
            <Route path="login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
            
            {/* Protected Layout Routes */}
            <Route element={<AdminDashboardLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="workers" element={<WorkerManagement />} />
              <Route path="kyc" element={<KycManagement />} />
              <Route path="bookings" element={<BookingManagement />} />
              <Route path="services" element={<ServiceManagement />} />
              <Route path="complaints" element={<ComplaintResolution />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="earnings" element={<EarningsCommission />} />
            </Route>
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </AnimatePresence>
      </AuthProvider>
    </Router>
  );
}

export default App;
