import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Map as MapIcon, Calendar, Edit3, Save, X, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user, logout, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    address: user?.address || '',
    state: user?.state || '',
    district: user?.district || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put('/api/user/profile', formData);
      login(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
      >
        {/* Header/Cover */}
        <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
        
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-16 mb-8">
            <div className="relative group">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff&size=200`}
                alt={user.name}
                className="w-32 h-32 rounded-3xl border-4 border-white shadow-xl object-cover bg-white"
              />
              {isEditing && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                  <Edit3 size={24} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData({ ...formData, avatar: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              )}
            </div>

            <div className="flex gap-3 mb-2">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-6 py-2 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-all flex items-center gap-2"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 shadow-lg transition-all flex items-center gap-2"
                >
                  <Edit3 size={20} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{user.name}</h1>
                <p className="text-emerald-600 font-bold uppercase tracking-wider text-sm">{user.role}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="text-emerald-500" size={20} />
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase">Email Address</p>
                      <p className="font-semibold text-gray-900">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="text-emerald-500" size={20} />
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 font-medium uppercase">Mobile Number</p>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                          className="w-full bg-emerald-50 border border-emerald-100 rounded-lg px-2 py-1 outline-none font-semibold"
                        />
                      ) : (
                        <p className="font-semibold text-gray-900">{user.mobile || 'Not set'}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="text-emerald-500" size={20} />
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase">Member Since</p>
                      <p className="font-semibold text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="text-emerald-500" size={20} />
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 font-medium uppercase">Location</p>
                      {isEditing ? (
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <input
                            type="text"
                            placeholder="District"
                            value={formData.district}
                            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                            className="bg-emerald-50 border border-emerald-100 rounded-lg px-2 py-1 outline-none text-sm"
                          />
                          <input
                            type="text"
                            placeholder="State"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            className="bg-emerald-50 border border-emerald-100 rounded-lg px-2 py-1 outline-none text-sm"
                          />
                        </div>
                      ) : (
                        <p className="font-semibold text-gray-900">
                          {user.district && user.state ? `${user.district}, ${user.state}` : 'Location not set'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <UserCircle size={20} className="text-emerald-500" />
                  About Me
                </h3>
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className="w-full bg-emerald-50 border border-emerald-100 rounded-2xl p-4 outline-none resize-none"
                  />
                ) : (
                  <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100 italic">
                    {user.bio || 'No bio provided yet.'}
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar Stats/Actions */}
            <div className="space-y-6">
              <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100">
                <h3 className="font-bold text-emerald-900 mb-4">Account</h3>
                <div className="space-y-3">
                  <button
                    onClick={logout}
                    className="w-full flex items-center justify-between p-3 bg-red-50 rounded-xl text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <LogOut size={18} />
                      <span className="text-sm font-medium">Logout Session</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Activity Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Status</span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase">Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Verification</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const UserCircle = ({ size, className }: { size?: number, className?: string }) => (
  <User size={size} className={className} />
);

const ArrowRight = ({ size, className }: { size?: number, className?: string }) => (
  <motion.div className={className}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  </motion.div>
);
