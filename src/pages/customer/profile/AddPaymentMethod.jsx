import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useCustomer } from '../../../context/CustomerContext';

export default function AddPaymentMethod() {
  const navigate = useNavigate();
  const { addPaymentMethod } = useCustomer();
  
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock adding a card
    addPaymentMethod({
      type: 'card',
      brand: 'Mastercard',
      last4: formData.cardNumber.slice(-4) || '1234',
      expiry: formData.expiry || '12/26'
    });
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white p-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)}><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="font-bold text-lg">Add New Card</h1>
      </header>

      <div className="p-6 flex-1">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-2xl mb-8 shadow-xl">
          <div className="flex justify-between mb-8">
            <CreditCard className="w-8 h-8 opacity-80" />
            <span className="font-mono text-lg italic">BANK</span>
          </div>
          <div className="font-mono text-xl tracking-widest mb-4">
            {formData.cardNumber || '•••• •••• •••• ••••'}
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs opacity-60 mb-1">CARD HOLDER</p>
              <p className="font-medium uppercase">{formData.name || 'YOUR NAME'}</p>
            </div>
            <div>
              <p className="text-xs opacity-60 mb-1">EXPIRES</p>
              <p className="font-medium">{formData.expiry || 'MM/YY'}</p>
            </div>
          </div>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Card Number</label>
            <input
              type="text"
              maxLength={16}
              value={formData.cardNumber}
              onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
              placeholder="0000 0000 0000 0000"
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                maxLength={5}
                value={formData.expiry}
                onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">CVV</label>
              <input
                type="password"
                maxLength={3}
                placeholder="123"
                value={formData.cvv}
                onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Card Holder Name</label>
            <input
              type="text"
              placeholder="Name on card"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
            />
          </div>
        </form>
        
        <div className="mt-4 flex items-center gap-2 text-xs text-text-muted justify-center">
          <Lock className="w-3 h-3" /> Your payment info is stored securely
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <Button fullWidth onClick={handleSubmit}>Save Card</Button>
      </div>
    </div>
  );
}
