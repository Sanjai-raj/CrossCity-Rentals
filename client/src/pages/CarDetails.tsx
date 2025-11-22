import React, { useState, useContext, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { BRANCHES, AuthContext } from '../constants';
import type { Car } from '../types';
import { MapPin, Gauge, Fuel, Users, CheckCircle2, Star, Shield, Info, Calendar, AlertCircle, Loader, X, AlertTriangle, Check } from 'lucide-react';

const CarDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useContext(AuthContext);
  
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Modal & Booking State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(`/api/cars/${id}`);
        if (!response.ok) throw new Error('Car not found');
        const data = await response.json();
        setCar(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  // Helper to get local ISO string for input
  const formatDateForInput = (date: Date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  const [startDate, setStartDate] = useState(() => {
    const paramStart = searchParams.get('start');
    if (paramStart) return paramStart;
    const now = new Date();
    now.setMinutes(now.getMinutes() + 60);
    return formatDateForInput(now);
  });

  const [endDate, setEndDate] = useState(() => {
    const paramEnd = searchParams.get('end');
    if (paramEnd) return paramEnd;
    const now = new Date();
    now.setHours(now.getHours() + 25);
    return formatDateForInput(now);
  });

  // MOVED UP: useMemo must be before conditional returns
  const { durationHours, totalPrice, tax, basePrice, isValidDuration } = useMemo(() => {
    if (!car) return { durationHours: 0, totalPrice: 0, tax: 0, basePrice: 0, isValidDuration: false };

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { durationHours: 0, totalPrice: 0, tax: 0, basePrice: 0, isValidDuration: false };
    }

    const diffMs = end.getTime() - start.getTime();
    const hours = diffMs / (1000 * 60 * 60);

    if (hours <= 0) {
      return { durationHours: 0, totalPrice: 0, tax: 0, basePrice: 0, isValidDuration: false };
    }

    const isDaily = hours >= 24;
    const price = isDaily 
      ? (hours / 24) * car.pricePerDay 
      : hours * car.pricePerHour;
    
    const taxAmt = price * 0.18;
    
    return { 
      durationHours: hours, 
      basePrice: price, 
      tax: taxAmt, 
      totalPrice: price + taxAmt,
      isValidDuration: true 
    };
  }, [startDate, endDate, car]); // Safe dependency on 'car' object

  const handleBookClick = () => {
    setError('');
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start < now) {
      setError('Pick-up time cannot be in the past.');
      return;
    }
    if (end <= start) {
      setError('Drop-off time must be after pick-up time.');
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleFinalizeBooking = async () => {
    if (!agreedToTerms || !car || !user) return;
    
    setIsProcessing(true);
    setBookingError('');
    
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId: car.id,
          userId: user.id,
          startDate: start,
          endDate: end,
          totalPrice
        })
      });
      
      if (response.ok) {
        setShowConfirmModal(false);
        navigate('/my-bookings'); 
      } else {
        setBookingError('Booking failed. Please try again.');
      }
    } catch (err) {
      setBookingError('Network error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-blue-600';
      case 'maintenance': return 'bg-amber-500';
      case 'booked': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader className="w-8 h-8 animate-spin text-blue-600"/></div>;
  }

  if (!car) {
    return <div className="text-center py-20">Car not found</div>;
  }

  const branch = BRANCHES.find(b => b.id === car.branchId);
  const isAvailable = car.status === 'active';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 mb-6">
        <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate('/')}>Home</span> / 
        <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate(`/search?city=${branch?.cityId}`)}> Search</span> / 
        <span className="text-gray-900 font-medium"> {car.make} {car.model}</span>
      </div>

      {/* Car Status Banner if not active */}
      {!isAvailable && (
        <div className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-bold text-amber-800">This vehicle is currently unavailable</h3>
            <p className="text-amber-700 text-sm mt-1">
              Status: <span className="font-semibold capitalize">{car.status}</span>. Please select another vehicle or check back later.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gray-100 rounded-2xl overflow-hidden h-[400px] relative group">
             <img src={car.image} alt={car.model} className={`w-full h-full object-cover ${!isAvailable ? 'grayscale opacity-75' : ''}`} />
             
             {/* Status Badge */}
             <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wide shadow-sm ${getStatusColor(car.status)}`}>
               {car.status}
             </div>

             <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-bold text-gray-900">{car.rating}</span>
                <span className="text-gray-500 text-sm">({car.trips} trips)</span>
             </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Vehicle Specifications</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                 <Gauge className="w-6 h-6 text-blue-600 mb-2" />
                 <span className="text-sm text-gray-500">Transmission</span>
                 <span className="font-semibold text-gray-900">{car.transmission}</span>
               </div>
               <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                 <Fuel className="w-6 h-6 text-blue-600 mb-2" />
                 <span className="text-sm text-gray-500">Fuel Type</span>
                 <span className="font-semibold text-gray-900">{car.fuel}</span>
               </div>
               <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                 <Users className="w-6 h-6 text-blue-600 mb-2" />
                 <span className="text-sm text-gray-500">Capacity</span>
                 <span className="font-semibold text-gray-900">{car.seats} Seats</span>
               </div>
               <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                 <Shield className="w-6 h-6 text-blue-600 mb-2" />
                 <span className="text-sm text-gray-500">Insurance</span>
                 <span className="font-semibold text-gray-900">Comprehensive</span>
               </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Key Features</h3>
            <div className="grid grid-cols-2 gap-3">
              {car.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Pick-up Location</h3>
              <p className="text-blue-600 font-medium mt-1">{branch?.name}</p>
              <p className="text-gray-500 text-sm mt-1">{branch?.address}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Book this car</h3>
            <p className="text-gray-500 text-sm mb-6">Free cancellation up to 48 hours before trip.</p>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex justify-between text-sm mb-2">
                   <span className="text-gray-500">Rate per hour</span>
                   <span className="font-medium">₹{car.pricePerHour}</span>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-gray-500">Rate per day</span>
                   <span className="font-medium">₹{car.pricePerDay}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Pick Up</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input 
                      type="datetime-local" 
                      value={startDate}
                      min={new Date().toISOString().slice(0, 16)}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Drop Off</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input 
                      type="datetime-local" 
                      value={endDate}
                      min={startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
                    />
                  </div>
                </div>
                
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  {isValidDuration 
                    ? `${durationHours.toFixed(1)} hours selected` 
                    : 'Select valid dates'}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Trip Price</span>
                <span>₹{isValidDuration ? basePrice.toFixed(2) : '0.00'}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxes & Fees (18%)</span>
                <span>₹{isValidDuration ? tax.toFixed(2) : '0.00'}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-dashed border-gray-200">
                <span>Total</span>
                <span>₹{isValidDuration ? totalPrice.toFixed(2) : '0.00'}</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 mb-4">
                 <AlertCircle className="w-4 h-4 flex-shrink-0" />
                 <span>{error}</span>
              </div>
            )}

            <button 
              onClick={handleBookClick}
              disabled={!isAvailable}
              className={`w-full font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95 
                ${isAvailable 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'}`}
            >
              {!isAvailable ? 'Unavailable' : user ? 'Proceed to Pay' : 'Log in to Book'}
            </button>
            
            {!user && (
              <p className="text-center text-xs text-gray-400 mt-3">You won't be charged yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Confirm Booking</h3>
              <button onClick={() => setShowConfirmModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl flex gap-4 items-center">
                <img src={car.image} alt={car.model} className="w-16 h-16 object-cover rounded-lg" />
                <div>
                   <h4 className="font-bold text-gray-900">{car.make} {car.model}</h4>
                   <p className="text-sm text-gray-500">{branch?.name}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Start Time</span>
                  <span className="font-medium text-gray-900">{new Date(startDate).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">End Time</span>
                  <span className="font-medium text-gray-900">{new Date(endDate).toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-100">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <span className="font-bold text-blue-600 text-lg">₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {bookingError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{bookingError}</span>
                </div>
              )}

              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${agreedToTerms ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white group-hover:border-blue-500'}`}>
                     {agreedToTerms && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)} 
                  />
                  <span className="text-sm text-gray-600 select-none">
                    I agree to the <span className="text-blue-600 font-medium">Terms & Conditions</span> and <span className="text-blue-600 font-medium">Cancellation Policy</span>.
                  </span>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
               <button 
                 onClick={() => setShowConfirmModal(false)}
                 className="flex-1 px-4 py-3 rounded-xl font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
               >
                 Cancel
               </button>
               <button 
                 onClick={handleFinalizeBooking}
                 disabled={!agreedToTerms || isProcessing}
                 className={`flex-1 px-4 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all
                   ${agreedToTerms && !isProcessing ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200' : 'bg-gray-300 cursor-not-allowed'}
                 `}
               >
                 {isProcessing ? (
                   <>
                     <Loader className="w-5 h-5 animate-spin" />
                     Processing...
                   </>
                 ) : (
                   'Confirm & Pay'
                 )}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetails;
