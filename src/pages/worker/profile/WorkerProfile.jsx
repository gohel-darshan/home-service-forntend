import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, ShieldCheck, Briefcase, Clock, CreditCard, LogOut, ChevronRight, Star, Image as ImageIcon, HelpCircle, Loader2 } from 'lucide-react';
import { useWorker } from '../../../context/WorkerContext';
import { useAuth } from '../../../context/AuthContext';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

const MenuItem = ({ icon: Icon, label, subLabel, onClick, color = "text-gray-600", badge }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 mb-3 hover:shadow-sm transition-all"
  >
    <div className="flex items-center gap-3">
      <div className="p-2 bg-gray-50 rounded-lg">
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="text-left">
        <span className="font-medium text-sm block">{label}</span>
        {subLabel && <span className="text-xs text-text-muted">{subLabel}</span>}
      </div>
    </div>
    <div className="flex items-center gap-2">
        {badge}
        <ChevronRight className="w-5 h-5 text-gray-300" />
    </div>
  </button>
);

// Helper functions for KYC status
const getKycStatusText = (status) => {
  switch (status) {
    case 'VERIFIED': return 'Verified';
    case 'PENDING': return 'Under Review';
    case 'REJECTED': return 'Rejected';
    case 'NOT_STARTED': return 'Action Required';
    default: return 'Action Required';
  }
};

const getKycStatusColor = (status) => {
  switch (status) {
    case 'VERIFIED': return 'text-green-600';
    case 'PENDING': return 'text-orange-600';
    case 'REJECTED': return 'text-red-600';
    case 'NOT_STARTED': return 'text-gray-600';
    default: return 'text-gray-600';
  }
};

const getKycBadgeVariant = (status) => {
  switch (status) {
    case 'VERIFIED': return 'success';
    case 'PENDING': return 'warning';
    case 'REJECTED': return 'destructive';
    case 'NOT_STARTED': return 'secondary';
    default: return 'secondary';
  }
};

export default function WorkerProfile() {
  const navigate = useNavigate();
  const { profile, stats, earnings, jobs, loading, loadProfile } = useWorker();
  const { logout } = useAuth();

  useEffect(() => {
    loadProfile();
  }, []);

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="pb-28 pt-6 px-4 max-w-md mx-auto flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-text-muted">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-28 pt-6 px-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Profile Header Card */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                  <img 
                    src={profile.avatar || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400'} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400';
                    }}
                  />
              </div>
              <div className="flex-1">
                  <h2 className="font-bold text-lg flex items-center gap-1">
                      {profile.name || 'Worker Name'}
                      {profile.kycStatus === 'VERIFIED' && <ShieldCheck className="w-4 h-4 text-blue-500" />}
                  </h2>
                  <p className="text-text-muted text-sm">{profile.profession || 'Add your profession'}</p>
                  <p className="text-text-muted text-xs mt-0.5">{profile.phone || profile.email}</p>
              </div>
              <button onClick={() => navigate('/worker/onboarding/details')} className="p-2 text-primary hover:bg-blue-50 rounded-full">
                  <User className="w-5 h-5" />
              </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="space-y-4">
              <div className="text-center">
                  <p className="text-xs text-text-muted mb-1">Rating</p>
                  <div className="flex items-center justify-center gap-1 font-bold text-sm">
                      {stats.avgRating || profile.rating || 0} <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  </div>
              </div>
              <div className="text-center border-t border-gray-100 pt-4">
                  <p className="text-xs text-text-muted mb-1">Jobs Done</p>
                  <p className="font-bold text-sm">{stats.completedJobs || profile.totalJobs || 0}</p>
              </div>
              <div className="text-center border-t border-gray-100 pt-4">
                  <p className="text-xs text-text-muted mb-1">Earned</p>
                  <p className="font-bold text-sm text-green-600">₹{stats.totalEarnings || earnings.total || 0}</p>
              </div>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
              <h3 className="font-bold text-sm text-text-muted uppercase tracking-wider mb-3 ml-1">Business Settings</h3>
              <MenuItem 
                  icon={Briefcase} 
                  label="Services & Pricing" 
                  subLabel="Manage your rate card"
                  onClick={() => navigate('/worker/profile/builder')} 
                  color="text-blue-600"
              />
              <MenuItem 
                  icon={Clock} 
                  label="Availability" 
                  subLabel="Set working hours"
                  onClick={() => navigate('/worker/profile/builder')} 
                  color="text-orange-600"
              />
              <MenuItem 
                  icon={ImageIcon} 
                  label="Portfolio" 
                  subLabel="Photos & Videos"
                  onClick={() => navigate('/worker/profile/builder')} 
                  color="text-purple-600"
              />
          </div>
        </div>

        <div className="space-y-6">
          <div>
              <h3 className="font-bold text-sm text-text-muted uppercase tracking-wider mb-3 ml-1">Account</h3>
              <MenuItem 
                  icon={ShieldCheck} 
                  label="KYC Verification" 
                  subLabel={getKycStatusText(profile.kycStatus)}
                  onClick={() => navigate('/worker/kyc/status')} 
                  color={getKycStatusColor(profile.kycStatus)}
                  badge={
                      <Badge variant={getKycBadgeVariant(profile.kycStatus)}>
                          {getKycStatusText(profile.kycStatus)}
                      </Badge>
                  }
              />
              <MenuItem 
                  icon={CreditCard} 
                  label="Bank Account" 
                  subLabel="Manage payouts"
                  onClick={() => navigate('/worker/earnings/bank')} 
                  color="text-gray-600"
              />
          </div>

          <div>
               <h3 className="font-bold text-sm text-text-muted uppercase tracking-wider mb-3 ml-1">Support</h3>
               <MenuItem icon={HelpCircle} label="Help & Support" onClick={() => {}} />
               <MenuItem icon={LogOut} label="Logout" color="text-red-500" onClick={handleLogout} />
          </div>
        </div>
      </div>
    </div>
  );
}
