
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CITIES, BRANCHES } from '../constants';
import { MapPin, ArrowRight, Tag, Zap, Shield, Search } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [cityId, setCityId] = useState(CITIES[0].id);
  const [branchId, setBranchId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  // Filter branches based on selected city
  const availableBranches = BRANCHES.filter(b => b.cityId === cityId);

  // Reset branch when city changes
  useEffect(() => {
    setBranchId('');
  }, [cityId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!startDate || !endDate) {
      setError('Please select both pick-up and drop-off times.');
      return;
    }

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

    let query = `?city=${cityId}&start=${startDate}&end=${endDate}`;
    if (branchId) {
      query += `&branch=${branchId}`;
    }
    navigate(`/search${query}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Zoomcar-style Hero Section */}
      <div className="relative bg-[#1a1a1a] lg:h-[550px] flex items-center">
        {/* Background Pattern/Image Placeholder */}
        <div className="absolute inset-0 overflow-hidden">
           <div className="absolute right-0 top-0 w-2/3 h-full opacity-20 bg-gradient-to-l from-blue-900 to-transparent"></div>
           <img 
             src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80" 
             alt="Luxury Car Background" 
             className="w-full h-full object-cover opacity-40"
           />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex flex-col lg:flex-row items-center z-10 py-12 lg:py-0">
          
          {/* Left Side: Search Widget */}
          <div className="w-full lg:w-[420px] flex-shrink-0 mb-10 lg:mb-0">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-gray-100">
                <button className="flex-1 py-4 text-center font-bold text-blue-600 border-b-4 border-blue-600 bg-white">
                  Daily Drives
                  <span className="block text-[10px] font-normal text-gray-500 uppercase mt-1">Upto 7 days</span>
                </button>
                <button 
                  onClick={() => navigate('/subscription')}
                  className="flex-1 py-4 text-center font-bold text-gray-400 hover:text-gray-600 bg-gray-50 transition-colors"
                >
                  Subscription
                  <span className="block text-[10px] font-normal text-gray-500 uppercase mt-1">7+ day rides</span>
                </button>
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 leading-tight">
                  Book Self-Drive Car Rentals Across India
                </h2>

                <form onSubmit={handleSearch} className="space-y-4">
                  {/* City Selection */}
                  <div className="relative">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">City</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <select 
                        value={cityId} 
                        onChange={(e) => setCityId(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-semibold appearance-none bg-white"
                      >
                        {CITIES.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-3.5 pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Branch Selection (Optional) */}
                  <div className="relative">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Pick-up Location</label>
                    <select 
                      value={branchId} 
                      onChange={(e) => setBranchId(e.target.value)}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
                    >
                      <option value="">Anywhere in {CITIES.find(c => c.id === cityId)?.name}</option>
                      {availableBranches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date Pickers */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Trip Starts</label>
                      <input 
                        type="datetime-local"
                        value={startDate}
                        min={new Date().toISOString().slice(0, 16)}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="block w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Trip Ends</label>
                      <input 
                        type="datetime-local" 
                        value={endDate}
                        min={startDate || new Date().toISOString().slice(0, 16)}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="block w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Checkbox Visual */}
                  <div className="flex items-center gap-2 mt-2">
                    <input type="checkbox" id="delivery" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <label htmlFor="delivery" className="text-sm text-gray-500">Delivery & Pick-up, from anywhere</label>
                  </div>

                  {error && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                      <span className="inline-block w-3 h-3 rounded-full bg-red-500 text-white flex items-center justify-center text-[8px]">!</span>
                      {error}
                    </p>
                  )}

                  <button 
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-3 rounded-lg shadow-lg shadow-blue-200 transition-all mt-2"
                  >
                    SEARCH
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Side: Promo Text */}
          <div className="hidden lg:block lg:flex-grow lg:pl-24 text-white">
             <div className="mb-8">
               <h3 className="text-blue-400 font-bold tracking-widest uppercase text-sm mb-2">MultiCity Subscription</h3>
               <h1 className="text-5xl font-bold leading-tight mb-6 italic">
                 Get discounted prices on <br/> 7+ days bookings
               </h1>
               <div className="flex gap-12 mt-12">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full border-2 border-yellow-500 flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">⭐</span>
                    </div>
                    <p className="text-sm font-medium text-gray-300">Top-rated <br/> cars</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full border-2 border-yellow-500 flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">₹</span>
                    </div>
                    <p className="text-sm font-medium text-gray-300">Flexible <br/> return</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full border-2 border-yellow-500 flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🎧</span>
                    </div>
                    <p className="text-sm font-medium text-gray-300">Priority <br/> Support</p>
                  </div>
               </div>
             </div>
             <div className="flex gap-2 mt-12 opacity-50">
                <div className="w-2 h-2 rounded-full bg-white"></div>
                <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                <div className="w-2 h-2 rounded-full bg-gray-500"></div>
             </div>
          </div>
        </div>
      </div>

      {/* How it works section */}
      <div className="bg-white py-16 text-center relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg px-8 py-3 flex gap-4">
           <button className="bg-blue-600 text-white px-6 py-2 rounded font-bold text-sm">GUEST</button>
           <button 
             onClick={() => navigate('/host')} 
             className="text-gray-500 px-6 py-2 font-bold text-sm hover:text-gray-900 hover:bg-gray-50 rounded transition-colors"
           >
             HOST
           </button>
        </div>
        
        <div className="max-w-7xl mx-auto px-4">
           <h2 className="text-3xl font-bold text-gray-800 mb-12">How to book a car on MultiCity</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
             <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">1. Search & Book</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Select your city and travel dates. Choose from a wide range of cars that suit your need.</p>
             </div>
             <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                  <Tag className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">2. Pick up</h3>
                <p className="text-gray-500 text-sm leading-relaxed">We deliver the car to your doorstep or you can pick it up from a nearby location.</p>
             </div>
             <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-purple-600">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">3. Drive & Return</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Enjoy your road trip! Return the car to the same location or drop it off at any of our branches.</p>
             </div>
           </div>
        </div>
      </div>

      {/* Advantage Section */}
      <div className="bg-gray-50 py-16 border-t border-gray-100">
         <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
               <div className="w-full md:w-1/2">
                  <img 
                    src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80" 
                    alt="Driving" 
                    className="rounded-2xl shadow-xl"
                  />
               </div>
               <div className="w-full md:w-1/2 space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">Unmatched Benefits</h2>
                  <div className="space-y-4">
                     <div className="flex gap-4">
                        <Shield className="w-6 h-6 text-blue-600 flex-shrink-0" />
                        <div>
                           <h4 className="font-bold text-gray-900">Zero Security Deposit</h4>
                           <p className="text-sm text-gray-500">Valid for all bookings. Just pay for the rental duration.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <Tag className="w-6 h-6 text-blue-600 flex-shrink-0" />
                        <div>
                           <h4 className="font-bold text-gray-900">Transparent Pricing</h4>
                           <p className="text-sm text-gray-500">What you see is what you pay. Prices include insurance and taxes.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <ArrowRight className="w-6 h-6 text-blue-600 flex-shrink-0" />
                        <div>
                           <h4 className="font-bold text-gray-900">Everywhere Delivery</h4>
                           <p className="text-sm text-gray-500">We deliver to airports, railway stations, and your doorstep.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Home;
