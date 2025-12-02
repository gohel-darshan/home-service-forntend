import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, CreditCard, Bell, HelpCircle, LogOut, ChevronRight, AlertCircle, Clock, Calendar } from 'lucide-react';
import { useCustomer } from '../../../context/CustomerContext';
import { useAuth } from '../../../context/AuthContext';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Container } from '../../../components/layout/ResponsiveLayout';

const MenuItem = ({ icon: Icon, label, onClick, color = "text-gray-600" }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 sm:p-6 bg-white rounded-xl border border-gray-100 mb-3 sm:mb-4 hover:shadow-sm transition-all"
  >
    <div className="flex items-center gap-3 sm:gap-4">
      <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} />
      </div>
      <span className="font-medium text-sm sm:text-base">{label}</span>
    </div>
    <ChevronRight className="w-5 h-5 text-gray-300" />
  </button>
);

export default function UserProfile() {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const { bookings } = useCustomer();

  const handleLogout = () => {
    logout();
  };

  // Get the last 2 bookings for the history preview
  const recentBookings = bookings.slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="pb-24 pt-6">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>

        {/* User Info */}
        <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold overflow-hidden flex-shrink-0">
            {authUser?.avatar ? (
              <img src={authUser.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              authUser?.name?.charAt(0) || 'U'
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-lg sm:text-xl truncate">{authUser?.name || 'User'}</h2>
            <p className="text-text-muted text-sm sm:text-base truncate">{authUser?.phone || 'No phone number'}</p>
            <p className="text-text-muted text-xs sm:text-sm truncate">{authUser?.email || 'No email'}</p>
          </div>
          <button onClick={() => navigate('/customer/profile/edit')} className="p-2 sm:p-3 text-primary hover:bg-blue-50 rounded-full flex-shrink-0">
              <User className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Recent History Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="font-bold text-lg sm:text-xl">Recent History</h3>
              <button onClick={() => navigate('/customer/bookings')} className="text-primary text-sm sm:text-base font-medium">View All</button>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
              {recentBookings.length === 0 ? (
                  <div className="bg-white p-6 sm:p-8 rounded-xl text-center text-text-muted border border-gray-100 border-dashed">
                      <Clock className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-30" />
                      <p className="text-sm sm:text-base">No services taken yet.</p>
                  </div>
              ) : (
                  recentBookings.map(booking => (
                      <Card 
                          key={booking.id} 
                          className="flex flex-col gap-2 sm:gap-3 cursor-pointer hover:border-primary transition-colors p-4 sm:p-6"
                          onClick={() => navigate(`/customer/tracking/${booking.id}`)}
                      >
                          <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                  <img src={booking.workerImage} alt="" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover bg-gray-100 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                      <h4 className="font-bold text-sm sm:text-base truncate">{booking.service}</h4>
                                      <p className="text-xs sm:text-sm text-text-muted truncate">{booking.workerName}</p>
                                  </div>
                              </div>
                              <Badge variant={booking.status === 'Completed' ? 'success' : 'default'} className="flex-shrink-0">
                                  {booking.status}
                              </Badge>
                          </div>
                          <div className="border-t border-gray-50 pt-2 sm:pt-3 mt-1 sm:mt-2 flex justify-between items-center text-xs sm:text-sm text-text-muted">
                              <div className="flex items-center gap-1 flex-1 min-w-0">
                                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                  <span className="truncate">{booking.date} • {booking.time}</span>
                              </div>
                              <span className="font-bold text-primary text-sm sm:text-base flex-shrink-0">₹{booking.price}</span>
                          </div>
                      </Card>
                  ))
              )}
          </div>
        </div>

        {/* Menu */}
        <div>
          <MenuItem icon={MapPin} label="Manage Addresses" onClick={() => navigate('/customer/profile/addresses')} />
          <MenuItem icon={CreditCard} label="Payment Methods" onClick={() => navigate('/customer/profile/payments')} />
          <MenuItem icon={AlertCircle} label="Complaints & Support" onClick={() => navigate('/customer/profile/complaints')} />
          <MenuItem icon={Bell} label="Notifications" onClick={() => {}} />
          <div className="mt-6 sm:mt-8">
            <MenuItem icon={LogOut} label="Logout" color="text-red-500" onClick={handleLogout} />
          </div>
        </div>
      </Container>
    </div>
  );
}
