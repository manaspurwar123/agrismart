import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, Lock, Eye, EyeOff, UserCircle, ArrowRight, CheckCircle2, Loader2, Leaf } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserRole } from '../types';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState<UserRole>(UserRole.FARMER);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.mobile || !formData.password) {
      return "All fields are required";
    }
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match";
    }
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (!formData.acceptTerms) {
      return "Please accept the Terms and Conditions";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/auth/register', {
        ...formData,
        role
      });
      login(response.data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { id: UserRole.FARMER, label: 'Farmer', icon: Leaf },
    { id: UserRole.BUYER, label: 'Buyer', icon: UserCircle },
    { id: UserRole.EXPERT, label: 'Expert', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-emerald-50">
      {/* Animated Leaves Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -100, x: Math.random() * 100 + "%", rotate: 0 }}
            animate={{ 
              y: "120vh", 
              rotate: 360,
              x: (Math.random() * 100 + (Math.sin(i) * 20)) + "%"
            }}
            transition={{ 
              duration: 15 + Math.random() * 10, 
              repeat: Infinity,
              ease: "linear",
              delay: i * 2
            }}
            className="absolute text-emerald-200"
          >
            <Leaf size={24 + Math.random() * 24} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative bg-white/80 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg rotate-3">
              <Leaf size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join the AgriSmart community today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl"
              >
                {error}
              </motion.div>
            )}

            {/* Role Selection */}
            <div className="grid grid-cols-3 gap-3">
              {roles.map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-300",
                      role === r.id 
                        ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200" 
                        : "bg-white border-gray-100 text-gray-600 hover:border-emerald-200 hover:bg-emerald-50/50"
                    )}
                  >
                    <Icon size={20} />
                    <span className="text-xs font-medium">{r.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/50 border border-gray-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl py-3 pl-12 pr-4 outline-none transition-all shadow-sm"
                />
              </div>

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/50 border border-gray-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl py-3 pl-12 pr-4 outline-none transition-all shadow-sm"
                />
              </div>

              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  required
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full bg-white/50 border border-gray-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl py-3 pl-12 pr-4 outline-none transition-all shadow-sm"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-white/50 border border-gray-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl py-3 pl-12 pr-12 outline-none transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full bg-white/50 border border-gray-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl py-3 pl-12 pr-4 outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                className="w-5 h-5 rounded-lg border-gray-200 text-emerald-500 focus:ring-emerald-500 transition-all cursor-pointer"
              />
              <span className="text-sm text-gray-600">
                I accept the <Link to="/terms" className="text-emerald-600 font-medium hover:underline">Terms & Conditions</Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 group active:scale-95"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <p className="text-center text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-600 font-bold hover:underline">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
