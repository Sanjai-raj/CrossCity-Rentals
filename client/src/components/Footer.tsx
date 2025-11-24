import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Heart, Car, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0f172a] text-white pt-20 pb-10 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">CrossCity</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Premium car rentals across major cities. Experience the freedom of self-drive with transparent pricing and zero hidden charges.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-400 hover:text-white transition-all duration-300">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all duration-300">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-700 hover:text-white transition-all duration-300">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Company</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to="/about" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 hover:opacity-100 transition-opacity"></span>About Us</Link></li>
              <li><Link to="/careers" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 hover:opacity-100 transition-opacity"></span>Careers</Link></li>
              <li><Link to="/blog" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 hover:opacity-100 transition-opacity"></span>Blog</Link></li>
              <li><Link to="/press" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 hover:opacity-100 transition-opacity"></span>Press</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Support</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to="/help" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 hover:opacity-100 transition-opacity"></span>Help Center</Link></li>
              <li><Link to="/terms" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 hover:opacity-100 transition-opacity"></span>Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 hover:opacity-100 transition-opacity"></span>Privacy Policy</Link></li>
              <li><Link to="/trust" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 hover:opacity-100 transition-opacity"></span>Trust & Safety</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Contact Us</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>123 Business Avenue, Tech Park,<br />Bangalore, Karnataka 560001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span>support@crosscity.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2025 CrossCity Rentals. All rights reserved.</p>
          <div className="flex items-center gap-2 text-gray-500 text-sm bg-gray-800/50 px-4 py-2 rounded-full">
            <span>Made with</span>
            <Heart size={14} className="text-red-500 fill-current animate-pulse" />
            <span>in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
