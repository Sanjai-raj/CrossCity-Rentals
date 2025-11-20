
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, CreditCard, ShieldCheck, Smile, FileText, Key } from 'lucide-react';

const Step = ({ icon: Icon, title, desc, step }: any) => (
  <div className="flex flex-col md:flex-row gap-6 items-start">
    <div className="flex-shrink-0 relative">
      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
        <Icon className="w-8 h-8" />
      </div>
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
        {step}
      </div>
    </div>
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const HowItWorks: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Rent a car in 4 simple steps</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Experience the freedom of self-drive with CrossCity Rentals. No hidden charges, zero security deposit, and unlimited kilometers.
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid gap-12">
          <Step 
            step={1}
            icon={Search}
            title="Book your car"
            desc="Download the app or visit our website. Select your city, date, and time. Choose from a wide range of cars that suit your travel needs."
          />
          <Step 
            step={2}
            icon={FileText}
            title="Upload Documents"
            desc="Upload your driver's license and ID proof. We'll verify them instantly so you can get on the road faster. This is a one-time process."
          />
          <Step 
            step={3}
            icon={Key}
            title="Unlock & Drive"
            desc="Reach the pickup location or get the car delivered to your doorstep. Use the app to unlock the car (for keyless entry cars) or collect keys from the executive."
          />
          <Step 
            step={4}
            icon={Smile}
            title="Return"
            desc="Enjoy your trip! Return the car to the same location or drop it off at any designated point. We'll handle the cleaning and maintenance."
          />
        </div>

        <div className="mt-16 text-center">
           <Link to="/search" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg transition-transform hover:scale-105">
             Book a Car Now
           </Link>
        </div>
      </div>

      {/* FAQ / Info Section */}
      <div className="bg-gray-50 py-20">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Documents Required</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                  <CreditCard className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">Driver's License</h3>
                  <p className="text-sm text-gray-500">Original Driving License is mandatory. Learners license is not accepted.</p>
               </div>
               <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                  <ShieldCheck className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">ID Proof</h3>
                  <p className="text-sm text-gray-500">Aadhar Card or Passport serves as a valid ID proof for Indian citizens.</p>
               </div>
               <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                  <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">Age Limit</h3>
                  <p className="text-sm text-gray-500">Driver must be at least 21 years old to book a car with MultiCity.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default HowItWorks;
