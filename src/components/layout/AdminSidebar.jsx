import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck,
  Calendar, 
  AlertCircle, 
  Layers, 
  DollarSign, 
  Settings, 
  LogOut,
  Shield
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/admin' },
  { icon: UserCheck, label: 'User Management', to: '/admin/users' },
  { icon: Users, label: 'Worker Management', to: '/admin/workers' },
  { icon: Shield, label: 'KYC Verification', to: '/admin/kyc' },
  { icon: Calendar, label: 'Bookings', to: '/admin/bookings' },
  { icon: Layers, label: 'Services', to: '/admin/services' },
  { icon: AlertCircle, label: 'Complaints', to: '/admin/complaints' },
  { icon: DollarSign, label: 'Earnings', to: '/admin/earnings' },
  { icon: Settings, label: 'Settings', to: '/admin/settings' },
];

export const AdminSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col z-50 hidden md:flex">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-primary">ServicePro</h1>
        <p className="text-xs text-text-muted">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm",
              isActive 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-gray-600 hover:bg-gray-50 hover:text-primary"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 transition-colors font-medium text-sm"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};
