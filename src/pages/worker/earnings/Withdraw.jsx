import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useWorker } from '../../../context/WorkerContext';

export default function Withdraw() {
  const navigate = useNavigate();
  const { earnings, withdrawMoney } = useWorker();
  const [amount, setAmount] = useState('');

  const handleWithdraw = () => {
    withdrawMoney(Number(amount));
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-4xl mx-auto">
      <header className="bg-white p-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)}><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="font-bold text-lg">Withdraw Money</h1>
      </header>

      <div className="p-6 flex-1 max-w-md mx-auto lg:max-w-2xl">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 mb-6 text-center">
          <p className="text-text-muted mb-2">Available Balance</p>
          <h2 className="text-3xl font-bold text-primary">₹{earnings.available}</h2>
        </div>

        {earnings.bankAccount ? (
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200">
              <Building className="w-5 h-5 text-gray-500" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">{earnings.bankAccount.holderName}</p>
              <p className="text-xs text-text-muted">XXXX {earnings.bankAccount.accountNumber.slice(-4)}</p>
            </div>
            <button className="text-primary text-xs font-bold">Change</button>
          </div>
        ) : (
          <div 
            onClick={() => navigate('/worker/earnings/bank')}
            className="border-2 border-dashed border-gray-300 p-4 rounded-xl text-center text-gray-500 mb-8 cursor-pointer hover:bg-gray-50"
          >
            + Add Bank Account
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-muted">Enter Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 font-bold text-gray-500">₹</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none font-bold text-lg"
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <Button 
          fullWidth 
          disabled={!amount || Number(amount) > earnings.available || !earnings.bankAccount} 
          onClick={handleWithdraw}
        >
          Withdraw Now
        </Button>
      </div>
    </div>
  );
}
