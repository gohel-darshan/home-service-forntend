import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useWorker } from '../../../context/WorkerContext';

export default function BankAccount() {
  const navigate = useNavigate();
  const { addBankAccount } = useWorker();
  const [formData, setFormData] = useState({ accountNumber: '', ifsc: '', holderName: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    addBankAccount(formData);
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-4xl mx-auto">
      <header className="bg-white p-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)}><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="font-bold text-lg">Add Bank Account</h1>
      </header>

      <div className="p-6 flex-1">
        <form className="space-y-4 max-w-md mx-auto lg:max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Account Number</label>
            <input 
              type="text" 
              value={formData.accountNumber}
              onChange={e => setFormData({...formData, accountNumber: e.target.value})}
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">IFSC Code</label>
            <input 
              type="text" 
              value={formData.ifsc}
              onChange={e => setFormData({...formData, ifsc: e.target.value})}
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary outline-none uppercase"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Account Holder Name</label>
            <input 
              type="text" 
              value={formData.holderName}
              onChange={e => setFormData({...formData, holderName: e.target.value})}
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
            />
          </div>
        </form>
        
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-text-muted">
          <Lock className="w-3 h-3" /> Bank details are encrypted and secure.
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <Button fullWidth onClick={handleSubmit}>Save Account</Button>
      </div>
    </div>
  );
}
