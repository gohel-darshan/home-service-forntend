import React from 'react';
import { DollarSign, TrendingUp, Download } from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

export default function EarningsCommission() {
  const { settings, updateSettings, settlements } = useAdmin();

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Earnings & Commission</h1>
        <p className="text-text-muted">Manage platform revenue and worker settlements</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Commission Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg">Commission Rate</h3>
          </div>
          <p className="text-sm text-text-muted mb-4">
            Set the percentage deducted from every completed service.
          </p>
          <div className="flex gap-2">
            <input 
              type="number" 
              value={settings.commissionRate}
              onChange={(e) => updateSettings({ commissionRate: e.target.value })}
              className="flex-1 p-3 border rounded-xl font-bold text-lg"
            />
            <span className="flex items-center justify-center bg-gray-100 px-4 rounded-xl font-bold">%</span>
          </div>
        </Card>

        {/* Revenue Stats */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-lg">Total Revenue</h3>
          </div>
          <p className="text-3xl font-bold mb-1">₹45,200</p>
          <p className="text-sm text-green-600 font-medium">+12% this month</p>
        </Card>
      </div>

      {/* Settlement History */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-lg">Settlement History</h3>
          <button className="flex items-center gap-2 text-sm text-primary font-medium">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 font-medium text-sm text-text-muted">Transaction ID</th>
              <th className="p-4 font-medium text-sm text-text-muted">Worker</th>
              <th className="p-4 font-medium text-sm text-text-muted">Date</th>
              <th className="p-4 font-medium text-sm text-text-muted">Amount</th>
              <th className="p-4 font-medium text-sm text-text-muted">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {settlements.map((st) => (
              <tr key={st.id}>
                <td className="p-4 text-sm font-mono">{st.id}</td>
                <td className="p-4 font-medium">{st.worker}</td>
                <td className="p-4 text-sm">{st.date}</td>
                <td className="p-4 font-bold">₹{st.amount}</td>
                <td className="p-4">
                  <Badge variant={st.status === 'Processed' ? 'success' : 'warning'}>{st.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
