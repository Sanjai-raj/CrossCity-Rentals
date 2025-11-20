
import React from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Shield, Wrench, Zap } from 'lucide-react';

const PlanCard = ({ title, price, features, recommended }: any) => (
  <div className={`relative bg-white rounded-2xl shadow-xl border ${recommended ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-gray-200'} p-8 flex flex-col`}>
    {recommended && (
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide shadow-md">
        Most Popular
      </div>
    )}
    <h3 className="text-lg font-semibold text-gray-500 mb-2">{title}</h3>
    <div className="flex items-baseline gap-1 mb-6">
      <span className="text-4xl font-bold text-gray-900">₹{price}</span>
      <span className="text-gray-500">/month</span>
    </div>
    
    <ul className="space-y-4 mb-8 flex-grow">
      {features.map((feat: any, idx: number) => (
        <li key={idx} className="flex items-start gap-3">
           {feat.included ? (
             <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
           ) : (
             <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
           )}
           <span className={`text-sm ${feat.included ? 'text-gray-700' : 'text-gray-400 line-through'}`}>{feat.text}</span>
        </li>
      ))}
    </ul>

    <Link 
      to="/search" 
      className={`w-full py-3 rounded-xl font-bold text-center transition-colors ${recommended ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
    >
      Choose Plan
    </Link>
  </div>
);

const Subscription: React.FC = () => {
  const plans = [
    {
      title: '1 Month',
      price: '29,999',
      features: [
        { text: '3,000 KMs / month', included: true },
        { text: 'Maintenance included', included: true },
        { text: 'Insurance included', included: true },
        { text: 'Free Doorstep Delivery', included: false },
        { text: 'Switch Car Models', included: false },
      ]
    },
    {
      title: '3 Months',
      price: '24,999',
      recommended: true,
      features: [
        { text: '3,500 KMs / month', included: true },
        { text: 'Maintenance included', included: true },
        { text: 'Insurance included', included: true },
        { text: 'Free Doorstep Delivery', included: true },
        { text: 'Switch Car Models', included: false },
      ]
    },
    {
      title: '6+ Months',
      price: '21,999',
      features: [
        { text: '4,000 KMs / month', included: true },
        { text: 'Maintenance included', included: true },
        { text: 'Insurance included', included: true },
        { text: 'Free Doorstep Delivery', included: true },
        { text: 'Switch Car Models (Once)', included: true },
      ]
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gray-900 text-white pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Why buy when you can subscribe?</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Own a car without the hassles of down payment, EMI, insurance, and maintenance. Just subscribe and drive.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <PlanCard key={idx} {...plan} />
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
           <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">Subscription Benefits</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                 <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8 text-blue-600" />
                 </div>
                 <h3 className="text-xl font-bold mb-3">Zero Down Payment</h3>
                 <p className="text-gray-500">Don't block your capital. Just pay a small refundable security deposit and the monthly fee.</p>
              </div>
              <div className="text-center">
                 <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Wrench className="w-8 h-8 text-blue-600" />
                 </div>
                 <h3 className="text-xl font-bold mb-3">Service & Maintenance</h3>
                 <p className="text-gray-500">We take care of regular servicing, wear & tear repairs, and insurance renewals.</p>
              </div>
              <div className="text-center">
                 <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-8 h-8 text-blue-600" />
                 </div>
                 <h3 className="text-xl font-bold mb-3">No Long Commitments</h3>
                 <p className="text-gray-500">Return the car anytime after your lock-in period or extend as per your need.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
