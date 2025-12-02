import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';
import { useWorker } from '../../context/WorkerContext';

export default function WorkerNotifications() {
  const navigate = useNavigate();
  const { notifications } = useWorker();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white p-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)}><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="font-bold text-lg">Notifications</h1>
      </header>

      <div className="p-4 space-y-3 flex-1">
        {notifications.map((notif) => (
          <div key={notif.id} className={`p-4 rounded-xl border flex gap-3 ${notif.read ? 'bg-white border-gray-100' : 'bg-blue-50 border-blue-100'}`}>
            <div className="p-2 bg-white rounded-full h-fit shadow-sm">
              <Bell className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm mb-1">{notif.title}</h4>
              <p className="text-sm text-text-muted mb-2">{notif.message}</p>
              <p className="text-xs text-gray-400">{notif.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
