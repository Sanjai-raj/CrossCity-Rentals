
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../constants';
import { Menu, X, Car, User as UserIcon, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50 top-0 left-0 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-blue-900">CrossCity Rentals</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/search" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Find Cars
            </Link>
            <Link to="/how-it-works" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              How it Works
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                {user.role === 'admin' && (
                   <Link to="/admin" className="text-blue-600 font-semibold hover:text-blue-700 text-sm">
                     Dashboard
                   </Link>
                )}
                <div className="flex items-center gap-4 text-gray-700">
                   <Link to="/my-bookings" className="text-sm font-medium hover:text-blue-600 transition-colors">
                     My Trips
                   </Link>
                   <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium">{user.name}</span>
                   </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                 <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium text-sm">
                  Log in
                </Link>
                <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/search" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
              Find Cars
            </Link>
            <Link to="/how-it-works" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
              How it Works
            </Link>
            {user ? (
              <>
                <Link to="/my-bookings" className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-gray-50">
                  My Trips
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-gray-50">
                    Admin Dashboard
                  </Link>
                )}
                <div className="px-3 py-2 text-sm text-gray-500">
                  Signed in as <span className="font-bold text-gray-900">{user.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-gray-50">
                Log In / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
