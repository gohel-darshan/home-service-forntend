import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../../data/mock';
import { Card } from '../../components/ui/Card';

export default function CategoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const category = CATEGORIES.find(c => c.id === id) || CATEGORIES[0];

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="bg-primary text-white p-6 pt-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">{category.name}</h1>
        </div>
        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
          <h2 className="font-bold text-lg mb-1">What do you need help with?</h2>
          <p className="text-blue-100 text-sm">Select a service to proceed</p>
        </div>
      </header>

      <div className="p-4 space-y-4 -mt-4">
        {category.subServices && category.subServices.length > 0 ? (
          category.subServices.map((sub) => (
            <Card 
              key={sub.id} 
              className="flex justify-between items-center p-5 hover:border-primary transition-colors cursor-pointer"
              onClick={() => navigate(`/customer/search?service=${sub.name}`)}
            >
              <div>
                <h3 className="font-bold text-lg">{sub.name}</h3>
                <p className="text-text-muted text-sm">Starts at ₹{sub.price}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </Card>
          ))
        ) : (
          <div className="text-center py-10 text-text-muted">
            No specific sub-services found. <br />
            <Link to="/customer/search" className="text-primary font-bold">View all workers</Link>
          </div>
        )}
      </div>
    </div>
  );
}
