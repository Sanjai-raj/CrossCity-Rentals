import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../constants';
import { Menu, X, Car, User as UserIcon, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed w-full z-50 top-0 left-0 transition-all duration-300 ${scrolled ? 'glass py-2' : 'bg-transparent py-4'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform duration-300">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight transition-colors text-blue-900">
                CrossCity Rentals
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/search"
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/50 text-gray-700 hover:text-blue-600 ${isActive('/search') ? 'bg-blue-50 text-blue-600' : ''}`}
            >
              Find Cars
            </Link>
            <Link
              to="/how-it-works"
              className="px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/50 text-gray-700 hover:text-blue-600"
            >
              How it Works
            </Link>

            {user ? (
              <div className={`flex items-center gap-4 pl-6 border-l ${scrolled ? 'border-gray-200' : 'border-gray-300'
                }`}>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-blue-600 font-semibold hover:text-blue-700 text-sm">
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center gap-4 text-gray-700">
                  <Link to="/my-bookings" className="text-sm font-medium hover:text-blue-600 transition-colors">
                    My Trips
                  </Link>
                  <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserIcon className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="transition-colors text-gray-500 hover:text-red-600"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="font-medium text-sm transition-colors text-gray-700 hover:text-blue-600"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none transition-colors text-gray-700 hover:text-blue-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass absolute top-full left-0 w-full border-t border-gray-100 animate-slide-up">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <Link to="/search" className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors">
              Find Cars
            </Link>
            <Link to="/how-it-works" className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors">
              How it Works
            </Link>
            {user ? (
              <>
                <Link to="/my-bookings" className="block px-4 py-3 rounded-xl text-base font-medium text-blue-600 hover:bg-blue-50">
                  My Trips
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="block px-4 py-3 rounded-xl text-base font-medium text-blue-600 hover:bg-blue-50">
                    Admin Dashboard
                  </Link>
                )}
                <div className="px-4 py-3 text-sm text-gray-500 border-t border-gray-100 mt-2">
                  Signed in as <span className="font-bold text-gray-900">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <div className="pt-4 mt-2 border-t border-gray-100 grid grid-cols-2 gap-4">
                <Link to="/login" className="flex justify-center items-center px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 border border-gray-200">
                  Log In
                </Link>
                <Link to="/signup" className="flex justify-center items-center px-4 py-3 rounded-xl text-base font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
