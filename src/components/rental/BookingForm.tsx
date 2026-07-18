import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Info,
  ChevronRight,
  ArrowRight,
  Calculator
} from 'lucide-react';
import { Machinery, RentalBooking } from '../../types';
import { cn } from '../../lib/utils';

interface BookingFormProps {
  machinery: Machinery;
  onSuccess: (booking: RentalBooking) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ machinery, onSuccess }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    duration: 1,
    unit: 'day' as 'hour' | 'day' | 'week' | 'month',
    quantity: 1,
    deliveryRequired: false,
    deliveryAddress: '',
    notes: ''
  });

  const [calculating, setCalculating] = useState(false);

  const calculateTotal = () => {
    let basePrice = 0;
    if (formData.unit === 'hour') basePrice = machinery.hourlyPrice;
    if (formData.unit === 'day') basePrice = machinery.dailyPrice;
    if (formData.unit === 'week') basePrice = machinery.weeklyPrice;
    if (formData.unit === 'month') basePrice = machinery.monthlyPrice;

    const rentalCharges = basePrice * formData.duration * formData.quantity;
    const deliveryCharges = formData.deliveryRequired ? 1500 : 0;
    const gst = rentalCharges * 0.18;
    const totalAmount = rentalCharges + deliveryCharges + gst;

    return { rentalCharges, deliveryCharges, gst, totalAmount };
  };

  const { rentalCharges, deliveryCharges, gst, totalAmount } = calculateTotal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);
    
    const bookingData = {
      machineryId: machinery.id,
      machineryName: machinery.name,
      machineryImage: machinery.images[0],
      ownerId: machinery.ownerId,
      ...formData,
      rentalCharges,
      deliveryCharges,
      gst,
      totalAmount,
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      if (res.ok) {
        const data = await res.json();
        onSuccess(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCalculating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-200/50 space-y-8 sticky top-32">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Reserve Now</h3>
        <div className="flex items-center gap-1 text-green-600 font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-xs uppercase tracking-widest">Safe Rental</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rental Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="date" 
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full pl-11 pr-4 py-4 bg-gray-50 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-green-500 outline-none" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Return Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="date" 
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full pl-11 pr-4 py-4 bg-gray-50 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-green-500 outline-none" 
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Duration</label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="number" 
                min="1"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full pl-11 pr-4 py-4 bg-gray-50 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-green-500 outline-none" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Unit</label>
            <select 
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value as any })}
              className="w-full px-4 py-4 bg-gray-50 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="hour">Hours</option>
              <option value="day">Days</option>
              <option value="week">Weeks</option>
              <option value="month">Months</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
          <input 
            type="checkbox" 
            id="delivery"
            checked={formData.deliveryRequired}
            onChange={(e) => setFormData({ ...formData, deliveryRequired: e.target.checked })}
            className="w-5 h-5 rounded-lg text-green-600 focus:ring-green-500" 
          />
          <label htmlFor="delivery" className="flex-1 text-sm font-bold text-gray-700 cursor-pointer">
            Doorstep Delivery Required
          </label>
          <Info className="w-4 h-4 text-gray-400" />
        </div>

        {formData.deliveryRequired && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Delivery Address</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 text-gray-400 w-4 h-4" />
              <textarea 
                placeholder="Enter full delivery address..."
                value={formData.deliveryAddress}
                onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                className="w-full pl-11 pr-4 py-4 bg-gray-50 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-green-500 outline-none min-h-[100px]" 
              />
            </div>
          </div>
        )}
      </div>

      <div className="pt-8 border-t border-dashed border-gray-100 space-y-4">
        <div className="flex justify-between text-sm font-bold text-gray-500">
          <span>Rental Fee ({formData.duration} {formData.unit}s)</span>
          <span className="text-gray-900">₹{(rentalCharges || 0).toLocaleString()}</span>
        </div>
        {formData.deliveryRequired && (
          <div className="flex justify-between text-sm font-bold text-gray-500">
            <span>Delivery Fee</span>
            <span className="text-gray-900">₹{(deliveryCharges || 0).toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-bold text-gray-500">
          <span>GST (18%)</span>
          <span className="text-gray-900">₹{(gst || 0).toLocaleString()}</span>
        </div>
        <div className="pt-4 flex justify-between items-center border-t border-gray-100">
          <span className="text-lg font-black text-gray-900 tracking-tight">Total Amount</span>
          <span className="text-3xl font-black text-green-700">₹{(totalAmount || 0).toLocaleString()}</span>
        </div>
      </div>

      <button 
        type="submit"
        disabled={calculating}
        className="w-full py-5 bg-green-700 text-white rounded-2xl font-black shadow-xl shadow-green-100 hover:bg-green-800 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
      >
        {calculating ? (
          <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            Confirm Booking
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      <p className="text-[10px] font-bold text-gray-400 text-center uppercase tracking-widest">
        Free cancellation within 24 hours of booking
      </p>
    </form>
  );
};
