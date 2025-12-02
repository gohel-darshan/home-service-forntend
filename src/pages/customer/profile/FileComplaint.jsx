import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useCustomer } from '../../../context/CustomerContext';

export default function FileComplaint() {
  const navigate = useNavigate();
  const { fileComplaint } = useCustomer();
  
  const [formData, setFormData] = useState({
    subject: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.description) return;
    
    fileComplaint(formData);
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white p-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)}><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="font-bold text-lg">File Complaint</h1>
      </header>

      <div className="p-6 flex-1 space-y-6">
        <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800">
          We are sorry you faced an issue. Please describe it below, and our support team will resolve it within 24 hours.
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Subject</label>
            <select 
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary outline-none bg-white"
            >
              <option value="">Select Issue Type</option>
              <option value="Worker arrived late">Worker arrived late</option>
              <option value="Overcharged">Overcharged</option>
              <option value="Poor service quality">Poor service quality</option>
              <option value="Rude behavior">Rude behavior</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Please provide more details..."
              className="w-full p-3 h-40 rounded-xl border border-gray-200 focus:border-primary outline-none resize-none"
            />
          </div>
        </form>
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <Button fullWidth onClick={handleSubmit}>Submit Complaint</Button>
      </div>
    </div>
  );
}
