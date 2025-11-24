import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CITIES, BRANCHES } from '../constants';
import { MapPin, ArrowRight, Tag, Zap, Shield, Search,  Clock } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [cityId, setCityId] = useState(CITIES[0].id);
  const [branchId, setBranchId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      {/* Modern Hero Section */}
      <div className="relative min-h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80"
            alt="Luxury Car Background"
            className="w-full h-full object-cover scale-105 animate-pulse-slow"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20 pt-20">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

            {/* Left Side: Text Content */}
            <div className={`w-full lg:w-1/2 text-white transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-sm font-medium tracking-wide uppercase">Premium Car Rentals</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
                Drive the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Extraordinary</span>
              </h1>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-lg">
                Experience the thrill of the open road with our premium fleet. From daily commutes to weekend getaways, we have the perfect ride for you.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => document.getElementById('search-widget')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1"
                >
                  Book Now
                </button>
                <button
                  onClick={() => navigate('/subscription')}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg transition-all hover:-translate-y-1"
                >
                  Subscription
                </button>
              </div>

              <div className="mt-12 flex items-center gap-8 text-sm font-medium text-gray-400">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span>Fully Insured</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span>Anywhere Delivery</span>
                </div>
              </div>
            </div>

            {/* Right Side: Search Widget */}
            <div
              id="search-widget"
              className={`w-full lg:w-[450px] transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              <div className="glass rounded-2xl p-1 shadow-2xl">
                <div className="bg-white rounded-xl p-6 shadow-inner">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Search className="w-6 h-6 text-blue-600" />
                    Find your drive
                  </h2>

                  <form onSubmit={handleSearch} className="space-y-5">
                    {/* City Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">City</label>
                      <div className="relative group">
                        <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        <select
                          value={cityId}
                          onChange={(e) => setCityId(e.target.value)}
                          className="block w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 font-semibold appearance-none transition-all hover:bg-gray-100"
                        >
                          {CITIES.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Branch Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pick-up Location</label>
                      <div className="relative">
                        <select
                          value={branchId}
                          onChange={(e) => setBranchId(e.target.value)}
                          className="block w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm font-medium appearance-none transition-all hover:bg-gray-100"
                        >
                          <option value="">Anywhere in {CITIES.find(c => c.id === cityId)?.name}</option>
                          {availableBranches.map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Date Pickers */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Start</label>
                        <div className="relative">
                          <input
                            type="datetime-local"
                            value={startDate}
                            min={new Date().toISOString().slice(0, 16)}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="block w-full px-3 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-all hover:bg-gray-100"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">End</label>
                        <div className="relative">
                          <input
                            type="datetime-local"
                            value={endDate}
                            min={startDate || new Date().toISOString().slice(0, 16)}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="block w-full px-3 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-all hover:bg-gray-100"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Checkbox */}
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <input type="checkbox" id="delivery" className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      <label htmlFor="delivery" className="text-sm font-medium text-blue-900">Home Delivery & Pick-up</label>
                    </div>

                    {error && (
                      <div className="p-3 bg-red-50 text-red-600 text-xs font-medium rounded-lg flex items-center gap-2 animate-shake">
                        <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center font-bold">!</span>
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5"
                    >
                      Search Cars
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works section */}
      <div className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-3">Simple Process</h2>
            <h3 className="text-4xl font-extrabold text-gray-900 mb-6">How it works</h3>
            <p className="text-lg text-gray-600">Booking a car has never been easier. Follow these three simple steps to get on the road.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: "Search & Book", desc: "Select your city and travel dates. Choose from a wide range of cars that suit your need.", color: "blue" },
              { icon: Tag, title: "Pick up", desc: "We deliver the car to your doorstep or you can pick it up from a nearby location.", color: "indigo" },
              { icon: Zap, title: "Drive & Return", desc: "Enjoy your road trip! Return the car to the same location or drop it off at any of our branches.", color: "purple" }
            ].map((step, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <div className={`w-16 h-16 rounded-2xl bg-${step.color}-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className={`w-8 h-8 text-${step.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{index + 1}. {step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advantage Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl opacity-20 blur-2xl"></div>
              <img
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80"
                alt="Driving"
                className="relative rounded-3xl shadow-2xl w-full object-cover transform transition-transform hover:scale-[1.02] duration-500"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Safety First</p>
                    <p className="text-lg font-bold text-gray-900">100% Insured</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 space-y-8">
              <div>
                <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-3">Why Choose Us</h2>
                <h3 className="text-4xl font-extrabold text-gray-900 mb-6">Unmatched Benefits</h3>
                <p className="text-lg text-gray-600">We prioritize your comfort and safety above all else. Experience the difference with our premium services.</p>
              </div>

              <div className="space-y-6">
                {[
                  { icon: Shield, title: "Zero Security Deposit", desc: "Valid for all bookings. Just pay for the rental duration." },
                  { icon: Tag, title: "Transparent Pricing", desc: "What you see is what you pay. Prices include insurance and taxes." },
                  { icon: ArrowRight, title: "Everywhere Delivery", desc: "We deliver to airports, railway stations, and your doorstep." }
                ].map((benefit, index) => (
                  <div key={index} className="flex gap-5 group">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors duration-300">
                      <benefit.icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-1">{benefit.title}</h4>
                      <p className="text-gray-500">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
