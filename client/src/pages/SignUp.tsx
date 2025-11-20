
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../constants';
import { AlertCircle, User, Mail, Lock, CheckCircle } from 'lucide-react';

const SignUp: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // 1. Register
      const registerRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: 'customer' })
      });

      if (!registerRes.ok) {
        const data = await registerRes.json();
        throw new Error(data.error || 'Registration failed');
      }

      // 2. Auto Login after registration
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const loginData = await loginRes.json();

      if (loginRes.ok) {
        login(loginData.user);
        navigate('/');
      } else {
        navigate('/login');
      }

    } catch (err: any) {
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8">
           <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
           <p className="text-gray-500 text-sm">Join CrossCity Rentals today</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <CheckCircle className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="text-xs text-gray-500">
            By signing up, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-blue-600 font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
