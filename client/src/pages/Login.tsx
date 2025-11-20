
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../constants';
import { AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        login(data.user);
        // Store token separately if needed, typically handled in AuthContext
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8">
           <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
           <p className="text-gray-500 text-sm">Sign in to continue to CrossCity Rentals</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-4">
          <p className="text-sm text-gray-500">
            Don't have an account? <a href="#" className="text-blue-600 font-medium hover:underline">Sign up</a>
          </p>
          <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded">
            <p>Demo Admin: admin@example.com / password123</p>
            <p>Demo User: john@example.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
