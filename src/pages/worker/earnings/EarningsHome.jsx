import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, TrendingUp, ChevronRight } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { useWorker } from '../../../context/WorkerContext';

export default function EarningsHome() {
  const navigate = useNavigate();
  const { earnings } = useWorker();

  return (
    <div className="pb-24 pt-6 px-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Earnings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Wallet Card */}
        <div className="lg:col-span-2 bg-secondary text-white p-6 rounded-2xl shadow-lg shadow-secondary/20">
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <Wallet className="w-5 h-5" />
            <span className="text-sm font-medium">Available Balance</span>
          </div>
          <h2 className="text-4xl font-bold mb-6">₹{earnings.available}</h2>
          <button 
            onClick={() => navigate('/worker/earnings/withdraw')}
            className="w-full bg-white text-secondary font-bold py-3 rounded-xl hover:bg-gray-50 transition"
          >
            Withdraw Money
          </button>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <Card className="p-4">
            <p className="text-xs text-text-muted mb-1">Today's Earnings</p>
            <p className="text-xl font-bold">₹850</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-text-muted mb-1">Total Earned</p>
            <p className="text-xl font-bold">₹{earnings.total}</p>
          </Card>
        </div>
      </div>

      {/* History */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Transaction History</h3>
          <button className="text-primary text-sm font-medium">View All</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
          {earnings.history.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{item.source}</h4>
                  <p className="text-xs text-text-muted">{item.date}</p>
                </div>
              </div>
              <span className="font-bold text-green-600">+₹{item.amount}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
