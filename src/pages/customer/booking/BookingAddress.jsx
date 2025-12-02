import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function BookingAddress() {
  const navigate = useNavigate();
  const { workerId } = useParams();
  const { user } = useAuth();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'home',
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem('bookingData');
    if (savedData) {
      setBookingData(JSON.parse(savedData));
    } else {
      navigate(`/customer/book/${workerId}/schedule`);
    }
  }, [workerId, navigate]);

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchAddresses();
  }, []);
  
  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.customerProfile?.addresses) {
        setAddresses(response.data.customerProfile.addresses);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!selectedAddress && !newAddress.street) return;
    
    const addressData = selectedAddress || newAddress;
    const updatedBookingData = {
      ...bookingData,
      address: addressData
    };
    
    localStorage.setItem('bookingData', JSON.stringify(updatedBookingData));
    navigate(`/customer/book/${workerId}/payment`);
  };

  const handleNewAddress = async () => {
    if (!newAddress.street || !newAddress.city) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/users/addresses', newAddress, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const savedAddress = response.data;
      setAddresses(prev => [...prev, savedAddress]);
      setSelectedAddress(savedAddress);
      setShowNewAddress(false);
      setNewAddress({ type: 'home', street: '', city: '', state: '', zipCode: '' });
      toast.success('Address added successfully!');
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
    }
  };

  if (!bookingData || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Select Address</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Saved Addresses */}
        <div>
          <h3 className="font-bold text-lg mb-4">Saved Addresses</h3>
          {addresses.length > 0 ? (
            <div className="space-y-3">
              {addresses.map((address) => (
                <Card 
                  key={address.id}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedAddress?.id === address.id 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedAddress(address)}
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium capitalize">{address.type}</span>
                        {address.isDefault && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">
                        {address.street}, {address.city}, {address.state} - {address.zipCode}
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      selectedAddress?.id === address.id 
                        ? 'border-primary bg-primary' 
                        : 'border-gray-300'
                    }`}>
                      {selectedAddress?.id === address.id && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No saved addresses found</p>
              <p className="text-sm">Add your first address below</p>
            </div>
          )}
        </div>

        {/* Add New Address */}
        <div>
          {!showNewAddress ? (
            <button
              onClick={() => setShowNewAddress(true)}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-600 hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Address</span>
            </button>
          ) : (
            <Card className="p-4">
              <h4 className="font-medium mb-4">Add New Address</h4>
              <div className="space-y-4">
                <select
                  value={newAddress.type}
                  onChange={(e) => setNewAddress({...newAddress, type: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                  <option value="home">Home</option>
                  <option value="office">Office</option>
                  <option value="other">Other</option>
                </select>

                <input
                  type="text"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                  placeholder="Street Address"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                    placeholder="City"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                  <input
                    type="text"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                    placeholder="State"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>

                <input
                  type="text"
                  value={newAddress.zipCode}
                  onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                  placeholder="ZIP Code"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowNewAddress(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleNewAddress}
                    className="flex-1"
                    disabled={!newAddress.street || !newAddress.city}
                  >
                    Use This Address
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Continue Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Button 
            fullWidth 
            onClick={handleContinue}
            disabled={!selectedAddress && !newAddress.street}
          >
            Continue to Payment
          </Button>
        </div>
      </div>
    </div>
  );
}