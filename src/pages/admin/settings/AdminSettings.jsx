import React, { useState } from 'react';
import { Save, Upload, Bell, Shield, Plus, Trash2 } from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import { Button } from '../../../components/ui/Button';

export default function AdminSettings() {
  const { settings, updateSettings, banners, addBanner, removeBanner, admins, addAdmin, removeAdmin } = useAdmin();
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', role: 'Support' });

  const handleAddAdmin = () => {
    if(newAdmin.name && newAdmin.email) {
      addAdmin(newAdmin);
      setNewAdmin({ name: '', email: '', role: 'Support' });
    }
  };

  return (
    <div className="p-8 max-w-5xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Platform Settings</h1>
        <p className="text-text-muted">Configure global application settings</p>
      </header>

      <div className="space-y-8">
        
        {/* 1. Banner Images */}
        <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" /> Banner Images
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {banners.map(b => (
              <div key={b.id} className="relative group rounded-xl overflow-hidden h-32">
                <img src={b.url} alt="Banner" className="w-full h-full object-cover" />
                <button 
                  onClick={() => removeBanner(b.id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button 
              onClick={() => addBanner('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800')}
              className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center h-32 text-gray-400 hover:border-primary hover:text-primary hover:bg-blue-50 transition-all"
            >
              <Plus className="w-6 h-6 mb-1" />
              <span className="text-xs font-bold">Add Banner</span>
            </button>
          </div>
        </section>

        {/* 2. Push Notifications */}
        <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" /> Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-text-muted">Enable push alerts for all users</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.pushEnabled}
                onChange={e => updateSettings({ pushEnabled: e.target.checked })}
                className="toggle" 
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Alerts</p>
                <p className="text-sm text-text-muted">Send email summaries to admins</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.emailAlerts}
                onChange={e => updateSettings({ emailAlerts: e.target.checked })}
                className="toggle" 
              />
            </div>
          </div>
        </section>

        {/* 3. Admin Roles */}
        <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> Admin Roles
          </h3>
          
          <div className="space-y-3 mb-6">
            {admins.map(admin => (
              <div key={admin.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-bold text-sm">{admin.name}</p>
                  <p className="text-xs text-text-muted">{admin.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold bg-white px-2 py-1 rounded border">{admin.role}</span>
                  <button onClick={() => removeAdmin(admin.id)} className="text-red-500 hover:bg-red-100 p-1 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 items-end border-t border-gray-100 pt-4">
            <div className="flex-1">
              <label className="text-xs font-bold text-text-muted">Name</label>
              <input 
                value={newAdmin.name}
                onChange={e => setNewAdmin({...newAdmin, name: e.target.value})}
                className="w-full p-2 border rounded-lg text-sm" 
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-text-muted">Email</label>
              <input 
                value={newAdmin.email}
                onChange={e => setNewAdmin({...newAdmin, email: e.target.value})}
                className="w-full p-2 border rounded-lg text-sm" 
              />
            </div>
            <div className="w-32">
              <label className="text-xs font-bold text-text-muted">Role</label>
              <select 
                value={newAdmin.role}
                onChange={e => setNewAdmin({...newAdmin, role: e.target.value})}
                className="w-full p-2 border rounded-lg text-sm bg-white"
              >
                <option>Super Admin</option>
                <option>Support</option>
                <option>Editor</option>
              </select>
            </div>
            <Button onClick={handleAddAdmin}>Add</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
