
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import CarDetails from './pages/CarDetails';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import HowItWorks from './pages/HowItWorks';
import Subscription from './pages/Subscription';
import Host from './pages/Host';
import AdminDashboard from './pages/AdminDashboard';
import MyBookings from './pages/MyBookings';
import type { User } from './types';
import { AuthContext } from './constants';


const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('mcs_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mcs_user');
  };

  useEffect(() => {
    const stored = localStorage.getItem('mcs_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <HashRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
          <Navbar />
          <main className="flex-grow pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/cars/:id" element={<CarDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/host" element={<Host />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route 
                path="/admin" 
                element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} 
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </AuthContext.Provider>
  );
};

export default App;
