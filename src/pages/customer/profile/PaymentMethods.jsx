import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Trash2, Plus, Smartphone } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useCustomer } from '../../../context/CustomerContext';

export default function PaymentMethods() {
  const navigate = useNavigate();
  const { paymentMethods, deletePaymentMethod } = useCustomer();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white p-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)}><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="font-bold text-lg">Payment Methods</h1>
      </header>

      <div className="p-4 space-y-4 flex-1">
        {paymentMethods.length === 0 ? (
          <div className="text-center py-10 text-text-muted">
            <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>No payment methods saved.</p>
          </div>
        ) : (
          paymentMethods.map((method) => (
            <div key={method.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                  {method.type === 'card' ? <CreditCard className="w-5 h-5 text-primary" /> : <Smartphone className="w-5 h-5 text-green-600" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm">
                    {method.type === 'card' ? `${method.brand} •••• ${method.last4}` : method.vpa}
                  </h4>
                  <p className="text-xs text-text-muted">
                    {method.type === 'card' ? `Expires ${method.expiry}` : 'UPI ID'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => deletePaymentMethod(method.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <Button fullWidth onClick={() => navigate('/customer/profile/payments/new')}>
          <Plus className="w-5 h-5 mr-2" /> Add New Card / UPI
        </Button>
      </div>
    </div>
  );
}
