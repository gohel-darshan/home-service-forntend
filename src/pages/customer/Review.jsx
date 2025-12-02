import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Camera, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

export default function Review() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');

  const handleSubmit = () => {
    toast.success('Review Submitted!');
    navigate('/customer');
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col">
      <div className="flex justify-end">
        <button onClick={() => navigate('/customer')}><X className="w-6 h-6 text-gray-400" /></button>
      </div>

      <div className="flex-1 flex flex-col items-center pt-10">
        <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400" alt="Worker" className="w-24 h-24 rounded-full object-cover mb-4 shadow-lg" />
        <h2 className="text-xl font-bold mb-1">How was Rajesh?</h2>
        <p className="text-text-muted text-sm mb-8">AC Repair Service</p>

        <div className="flex gap-3 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setRating(star)}>
              <Star 
                className={`w-10 h-10 transition-colors ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} 
              />
            </button>
          ))}
        </div>

        <div className="w-full space-y-4">
          <textarea 
            placeholder="Write your experience..." 
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-32 bg-gray-50 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
          
          <button className="w-full py-3 border border-dashed border-gray-300 rounded-xl text-gray-500 text-sm flex items-center justify-center gap-2 hover:bg-gray-50">
            <Camera className="w-5 h-5" /> Add Photos
          </button>
        </div>
      </div>

      <Button fullWidth onClick={handleSubmit} disabled={rating === 0}>Submit Review</Button>
    </div>
  );
}
