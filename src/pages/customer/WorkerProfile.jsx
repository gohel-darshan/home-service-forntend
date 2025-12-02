import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, ShieldCheck, PlayCircle, X, Check, Clock, Award, Phone } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { workersAPI, servicesAPI } from '../../lib/api';
import { useBooking } from '../../context/BookingContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function WorkerProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { updateDraft } = useBooking();
  const [worker, setWorker] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  useEffect(() => {
    loadWorkerData();
  }, [id]);

  const loadWorkerData = async () => {
    try {
      const [workerRes, servicesRes] = await Promise.all([
        workersAPI.getById(id),
        servicesAPI.getAll()
      ]);
      setWorker(workerRes.data);
      // Filter services by worker's profession
      const relevantServices = servicesRes.data.filter(service => 
        service.category.toLowerCase().includes(workerRes.data.profession.toLowerCase()) ||
        service.name.toLowerCase().includes(workerRes.data.profession.toLowerCase())
      );
      setServices(relevantServices);
    } catch (error) {
      console.error('Error loading worker data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = () => {
    setIsServiceModalOpen(true);
  };

  const handleServiceSelect = (service) => {
    updateDraft({
      workerId: worker.id,
      workerName: worker.user?.name,
      profession: worker.profession,
      serviceId: service.id,
      serviceName: service.name,
      price: service.basePrice || worker.hourlyRate
    });
    
    setIsServiceModalOpen(false);
    navigate(`/customer/book/${worker.id}/schedule`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-72 bg-gray-200 rounded-xl"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Worker not found</h2>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Image */}
      <div className="relative h-72 bg-gray-200">
        <img src="https://images.unsplash.com/photo-1581578731117-104f2a863a38?auto=format&fit=crop&q=80&w=800" alt="Work" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Profile Info */}
      <div className="px-6 -mt-10 relative z-10 pb-16">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {worker.user?.name?.charAt(0) || 'W'}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text">{worker.user?.name}</h1>
                <p className="text-text-muted font-medium">{worker.profession}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{worker.experience}+ years experience</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xl font-bold text-primary">₹{worker.hourlyRate}</span>
              <span className="text-xs text-text-muted">per hour</span>
              <div className={`flex items-center gap-1 mt-1 ${
                worker.isAvailable ? 'text-green-600' : 'text-red-600'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  worker.isAvailable ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-xs">
                  {worker.isAvailable ? 'Available' : 'Busy'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 border-b border-gray-100 pb-4 mb-4 flex-wrap">
            <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-lg">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-yellow-700">{worker.rating.toFixed(1)}</span>
              <span className="text-yellow-600/60 text-xs">({worker.reviews?.length || 0})</span>
            </div>
            <div className="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg">
              <Award className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-bold text-blue-700">{worker.totalJobs} jobs</span>
            </div>
            {worker.isVerified && (
              <div className="flex items-center gap-1 text-green-700 bg-green-50 px-3 py-1.5 rounded-lg">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-sm font-bold">Verified</span>
              </div>
            )}
            {worker.user?.phone && (
              <div className="flex items-center gap-1 text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-bold">Contact</span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Skills */}
            {worker.skills && worker.skills.length > 0 && (
              <div>
                <h3 className="font-bold mb-3 text-sm uppercase text-text-muted tracking-wider">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {worker.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1.5">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div>
              <h3 className="font-bold mb-3 text-sm uppercase text-text-muted tracking-wider">Statistics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{worker.stats?.completedJobs || worker.totalJobs}</p>
                  <p className="text-xs text-gray-600">Completed</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{worker.stats?.avgRating?.toFixed(1) || worker.rating.toFixed(1)}</p>
                  <p className="text-xs text-gray-600">Rating</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{worker.stats?.totalReviews || worker.reviews?.length || 0}</p>
                  <p className="text-xs text-gray-600">Reviews</p>
                </div>
              </div>
            </div>

            {/* Portfolio */}
            {worker.portfolio && worker.portfolio.length > 0 && (
              <div>
                <h3 className="font-bold mb-3 text-sm uppercase text-text-muted tracking-wider">Portfolio</h3>
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                  {worker.portfolio.map((img, i) => (
                    <div key={i} className="relative flex-shrink-0 w-40 h-28 rounded-xl overflow-hidden shadow-sm group">
                      <img src={img} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                        <PlayCircle className="w-10 h-10 text-white opacity-90" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div>
              <h3 className="font-bold mb-3 text-sm uppercase text-text-muted tracking-wider">Recent Reviews</h3>
              <div className="space-y-3">
                {worker.reviews && worker.reviews.length > 0 ? (
                  worker.reviews.slice(0, 3).map((review, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">
                              {review.customer?.name?.charAt(0) || 'C'}
                            </span>
                          </div>
                          <span className="font-bold text-sm">{review.customer?.name || 'Customer'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${
                                i < review.rating 
                                  ? 'text-yellow-400 fill-yellow-400' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed">
                        "{review.comment || 'Great service!'}"
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </Card>
                  ))
                ) : (
                  <Card className="p-4 text-center">
                    <p className="text-sm text-gray-500">No reviews yet</p>
                  </Card>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              {worker.user?.phone && (
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => window.open(`tel:${worker.user.phone}`)}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
              )}
              <Button 
                className="flex-1" 
                size="lg" 
                onClick={handleBookClick}
                disabled={!worker.isAvailable}
              >
                {worker.isAvailable ? 'Book Now' : 'Currently Unavailable'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Service Selection Modal */}
      <AnimatePresence>
        {isServiceModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-[60] flex items-end justify-center backdrop-blur-sm">
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-md rounded-t-3xl p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-bold text-xl">Select Service</h3>
                    <p className="text-text-muted text-sm">Choose the type of service you need</p>
                </div>
                <button onClick={() => setIsServiceModalOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"><X className="w-5 h-5 text-gray-500" /></button>
              </div>
              
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {services.length > 0 ? services.map(service => (
                  <div 
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className="flex justify-between items-center p-4 border border-gray-200 rounded-xl hover:border-primary hover:bg-blue-50 cursor-pointer transition-all group"
                  >
                    <div>
                      <span className="font-bold text-text block mb-1">{service.name}</span>
                      <span className="text-xs text-text-muted">{service.description}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-primary">₹{service.basePrice}</span>
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-primary group-hover:bg-primary flex items-center justify-center transition-colors">
                        <Check className="w-3 h-3 text-white opacity-0 group-hover:opacity-100" />
                      </div>
                    </div>
                  </div>
                )) : (
                  <div 
                    onClick={() => handleServiceSelect({ id: 'hourly', name: 'Hourly Service', basePrice: worker.hourlyRate })}
                    className="flex justify-between items-center p-4 border border-gray-200 rounded-xl hover:border-primary hover:bg-blue-50 cursor-pointer transition-all group"
                  >
                    <div>
                      <span className="font-bold text-text block mb-1">Hourly Service</span>
                      <span className="text-xs text-text-muted">Standard hourly rate for {worker.profession}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-primary">₹{worker.hourlyRate}/hr</span>
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-primary group-hover:bg-primary flex items-center justify-center transition-colors">
                        <Check className="w-3 h-3 text-white opacity-0 group-hover:opacity-100" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
