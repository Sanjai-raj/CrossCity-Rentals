
import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Clock, ShieldCheck } from 'lucide-react';

const Benefit = ({ icon: Icon, title, desc }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

const Host: React.FC = () => {
  const handleHostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thanks for your interest! Our team will contact you shortly.");
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="w-full md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Share your car,<br/>
              <span className="text-blue-400">Earn up to ₹50,000/month</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Join India's largest community of car hosts. Zero listing fees, flexible schedule, and complete peace of mind with our comprehensive insurance policy.
            </p>
            <div className="flex gap-4">
              <a href="#start-earning" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-full transition-colors">
                Start Earning
              </a>
              <Link to="/how-it-works" className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-full transition-colors backdrop-blur-sm">
                Learn More
              </Link>
            </div>
          </div>
          
          {/* Earnings Calculator Mockup */}
          <div className="w-full md:w-1/3 bg-white text-gray-900 rounded-2xl p-6 shadow-2xl">
            <h3 className="font-bold text-xl mb-4">Estimate your earnings</h3>
            <div className="space-y-4">
               <div>
                 <label className="text-xs font-bold text-gray-500 uppercase">Car Model</label>
                 <select className="w-full mt-1 p-2 border border-gray-300 rounded-lg">
                   <option>Maruti Swift</option>
                   <option>Hyundai Creta</option>
                   <option>Honda City</option>
                   <option>Toyota Fortuner</option>
                 </select>
               </div>
               <div>
                 <label className="text-xs font-bold text-gray-500 uppercase">Sharing Days</label>
                 <div className="mt-1 flex justify-between text-sm">
                   <span>15 days/mo</span>
                   <input type="range" className="w-1/2 accent-blue-600" />
                 </div>
               </div>
               <div className="pt-4 border-t border-gray-100">
                 <p className="text-gray-500 text-sm">Potential Monthly Earning</p>
                 <p className="text-3xl font-bold text-blue-600">₹24,500</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
         <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Host with MultiCity?</h2>
            <p className="text-gray-500 mt-2">We make car sharing simple, safe, and profitable.</p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Benefit 
              icon={DollarSign} 
              title="Weekly Payments" 
              desc="Get paid directly to your bank account every week. Track your earnings in real-time through the dashboard." 
            />
            <Benefit 
              icon={ShieldCheck} 
              title="Safe & Insured" 
              desc="Your car is covered by our comprehensive insurance policy during trips. We also verify every guest's driving license." 
            />
            <Benefit 
              icon={Clock} 
              title="Complete Flexibility" 
              desc="You decide when to share your car. Use it when you need it, share it when you don't. No minimum commitment." 
            />
         </div>
      </div>

      {/* Steps Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How it works</h2>
           <div className="flex flex-col md:flex-row justify-between gap-8 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>

              <div className="flex-1 bg-white md:bg-transparent p-6 md:p-0 rounded-xl md:rounded-none shadow-sm md:shadow-none text-center">
                 <div className="w-16 h-16 bg-white border-4 border-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-600 mx-auto mb-4 shadow-sm">1</div>
                 <h3 className="font-bold text-lg mb-2">List your Car</h3>
                 <p className="text-sm text-gray-500">Enter your car number, upload photos and RC. Takes less than 2 mins.</p>
              </div>
              <div className="flex-1 bg-white md:bg-transparent p-6 md:p-0 rounded-xl md:rounded-none shadow-sm md:shadow-none text-center">
                 <div className="w-16 h-16 bg-white border-4 border-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-600 mx-auto mb-4 shadow-sm">2</div>
                 <h3 className="font-bold text-lg mb-2">Install Device</h3>
                 <p className="text-sm text-gray-500">Our expert visits your home to install the safety device for keyless entry.</p>
              </div>
              <div className="flex-1 bg-white md:bg-transparent p-6 md:p-0 rounded-xl md:rounded-none shadow-sm md:shadow-none text-center">
                 <div className="w-16 h-16 bg-white border-4 border-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-600 mx-auto mb-4 shadow-sm">3</div>
                 <h3 className="font-bold text-lg mb-2">Start Earning</h3>
                 <p className="text-sm text-gray-500">Your car goes live. Guests book it, and you start earning while you sleep.</p>
              </div>
           </div>
        </div>
      </div>

      {/* Lead Form Section */}
      <div id="start-earning" className="py-20 bg-white">
         <div className="max-w-3xl mx-auto px-4">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 md:p-12">
               <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Ready to earn?</h2>
               <form onSubmit={handleHostSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                        <input type="text" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Full Name" />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input type="tel" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+91 98765 43210" />
                     </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                           <option>Bengaluru</option>
                           <option>Mumbai</option>
                           <option>Delhi NCR</option>
                           <option>Hyderabad</option>
                           <option>Chennai</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Car Number</label>
                        <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="KA 01 AB 1234" />
                     </div>
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-colors">
                     Get a Call Back
                  </button>
               </form>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Host;
