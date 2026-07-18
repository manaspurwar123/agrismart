import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronRight, 
  FileText, 
  CheckCircle2, 
  XCircle,
  Truck,
  Wrench
} from 'lucide-react';
import { RentalBooking } from '../../types';
import { cn } from '../../lib/utils';

export const MyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<RentalBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-amber-100 text-amber-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      case 'Completed': return 'bg-blue-100 text-blue-700';
      case 'In Progress': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <span className="text-xs font-black text-green-700 uppercase tracking-[0.2em] mb-4 block">Rental History</span>
          <h1 className="text-6xl font-black text-gray-900 tracking-tighter leading-none mb-4">My Bookings.</h1>
          <p className="text-xl text-gray-500 font-medium">Manage your active and past machinery rentals.</p>
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          [1, 2].map(i => <div key={i} className="h-64 bg-gray-100 rounded-[40px] animate-pulse" />)
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[48px] border border-gray-100">
            <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-gray-900 mb-2">No Bookings Yet</h3>
            <p className="text-gray-500 font-bold mb-8">Ready to gear up? Explore our equipment collection.</p>
            <button className="px-8 py-4 bg-green-700 text-white rounded-2xl font-black shadow-xl shadow-green-100 transition-all">
              Start Browsing
            </button>
          </div>
        ) : (
          bookings.map((booking) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[48px] border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row group hover:shadow-xl transition-all duration-500"
            >
              <div className="w-full md:w-80 aspect-square md:aspect-auto relative overflow-hidden">
                <img 
                  src={booking.machineryImage} 
                  alt={booking.machineryName} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-6 left-6">
                  <span className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg",
                    getStatusColor(booking.status)
                  )}>
                    {booking.status}
                  </span>
                </div>
              </div>

              <div className="flex-1 p-10 flex flex-col justify-between gap-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{booking.machineryName}</h3>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      Order ID: #{booking.id.toUpperCase()} • {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                    <p className="text-3xl font-black text-green-700">₹{(booking.totalAmount || 0).toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Start Date</p>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      {new Date(booking.startDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Duration</p>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                      <Clock className="w-4 h-4 text-orange-500" />
                      {booking.duration} {booking.unit}(s)
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Delivery</p>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                      <Truck className={cn("w-4 h-4", booking.deliveryRequired ? "text-green-500" : "text-gray-300")} />
                      {booking.deliveryRequired ? 'Requested' : 'Self-Pickup'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Owner</p>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-900 underline decoration-gray-200">
                      View Contact
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-50 flex flex-wrap gap-4">
                  <button className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-black transition-all">
                    <FileText className="w-4 h-4" />
                    Download Invoice
                  </button>
                  <button className="px-8 py-4 bg-white border border-gray-100 text-gray-900 rounded-2xl font-black text-sm hover:bg-gray-50 transition-all">
                    Extend Rental
                  </button>
                  {booking.status === 'Pending' && (
                    <button className="px-8 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-sm hover:bg-red-100 transition-all ml-auto">
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
