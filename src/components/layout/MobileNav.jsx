import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Calendar, User, Briefcase, Wallet, Video, ListChecks } from 'lucide-react';
import { cn } from '../../lib/utils';

export const MobileNav = ({ type = 'customer' }) => {
  const customerLinks = [
    { to: '/customer', icon: Home, label: 'Home' },
    { to: '/customer/search', icon: Search, label: 'Search' },
    { to: '/customer/bookings', icon: Calendar, label: 'Bookings' },
    { to: '/customer/profile', icon: User, label: 'Profile' },
  ];

  const workerLinks = [
    { to: '/worker', icon: Home, label: 'Requests' },
    { to: '/worker/jobs', icon: ListChecks, label: 'My Jobs' },
    { to: '/worker/earnings', icon: Wallet, label: 'Earnings' },
    { to: '/worker/profile', icon: User, label: 'Profile' },
  ];

  const links = type === 'worker' ? workerLinks : customerLinks;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe pt-2 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-between items-center max-w-md mx-auto h-16">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/worker' || to === '/customer'} 
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1 transition-colors duration-200",
              isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <Icon className="w-6 h-6" strokeWidth={2.5} />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};
