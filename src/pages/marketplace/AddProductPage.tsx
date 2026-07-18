import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  Leaf, 
  Trash2, 
  Plus, 
  ChevronRight, 
  Info,
  CheckCircle2,
  Calendar,
  IndianRupee,
  Package,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/ui/Button';

const CATEGORIES = [
  'Fruits', 'Vegetables', 'Grains', 'Pulses', 'Seeds', 
  'Fertilizers', 'Organic Products', 'Dairy Products', 
  'Flowers', 'Herbs', 'Spices', 'Farming Equipment'
];

const UNITS = ['Kg', 'Ton', 'Quintal', 'Piece', 'Bale', 'Bundle', 'Liter'];

export const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Fruits',
    description: '',
    price: '',
    unit: 'Kg',
    quantity: '',
    isOrganic: false,
    harvestDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    location: {
      village: '',
      district: '',
      state: ''
    }
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Simulation: In production, upload to Cloudinary and get URL
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages([...images, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          quantity: Number(formData.quantity),
          images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800']
        })
      });

      if (res.ok) {
        navigate('/marketplace/my-products');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#F9FBFA]">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-green-600 font-bold transition-all mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Cancel & Return
          </button>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Publish New Product</h1>
          <p className="text-gray-500 font-medium">Reach thousands of buyers directly from your farm</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Image Upload Section */}
          <section className="bg-white rounded-[48px] p-12 border-2 border-gray-100 shadow-xl">
            <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Product Showcase</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-3xl overflow-hidden group border-2 border-gray-100">
                  <img src={img} alt="Product preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {images.length < 4 && (
                <label className="aspect-square rounded-3xl border-4 border-dashed border-gray-100 hover:border-green-500 hover:bg-green-50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <Plus className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Add Image</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
            <p className="text-gray-400 text-xs font-bold mt-6 flex items-center gap-2">
              <Info className="w-4 h-4" /> Max 4 high-quality images. Recommended size: 800x800px.
            </p>
          </section>

          {/* Basic Info */}
          <section className="bg-white rounded-[48px] p-12 border-2 border-gray-100 shadow-xl">
            <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Essential Details</h3>
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Product Name</label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Eg: Premium Alphonso Mangoes"
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-[24px] py-5 px-8 outline-none transition-all font-black text-lg shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-[24px] py-5 px-8 outline-none transition-all font-black text-lg appearance-none shadow-sm"
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Description</label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Tell buyers about the quality, taste, and farming method..."
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-[32px] py-6 px-8 outline-none transition-all font-bold text-lg min-h-[200px] shadow-sm"
                />
              </div>

              <div className="flex items-center justify-between p-8 bg-green-50 rounded-[32px] border-2 border-green-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-green-900 uppercase tracking-tight">Organic Farming</h4>
                    <p className="text-green-700 text-xs font-medium">Was this product grown without synthetic pesticides?</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, isOrganic: !formData.isOrganic})}
                  className={`w-16 h-8 rounded-full transition-all relative ${formData.isOrganic ? 'bg-green-500' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${formData.isOrganic ? 'left-9' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </section>

          {/* Pricing & Stock */}
          <section className="bg-white rounded-[48px] p-12 border-2 border-gray-100 shadow-xl">
            <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Price & Availability</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Unit</label>
                <select 
                  value={formData.unit}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-[24px] py-5 px-8 outline-none transition-all font-black text-lg appearance-none shadow-sm"
                >
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Price (₹)</label>
                <div className="relative">
                  <input 
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="0.00"
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-[24px] py-5 px-8 outline-none transition-all font-black text-lg shadow-sm"
                  />
                  <IndianRupee className="absolute right-6 top-6 w-6 h-6 text-gray-300" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Available Quantity</label>
                <div className="relative">
                  <input 
                    type="number"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    placeholder="0"
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-[24px] py-5 px-8 outline-none transition-all font-black text-lg shadow-sm"
                  />
                  <Package className="absolute right-6 top-6 w-6 h-6 text-gray-300" />
                </div>
              </div>
            </div>
          </section>

          {/* Logistics */}
          <section className="bg-white rounded-[48px] p-12 border-2 border-gray-100 shadow-xl">
            <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Logistics & Location</h3>
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Harvest Date</label>
                  <div className="relative">
                    <input 
                      type="date"
                      required
                      value={formData.harvestDate}
                      onChange={(e) => setFormData({...formData, harvestDate: e.target.value})}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-[24px] py-5 px-8 outline-none transition-all font-black text-lg shadow-sm"
                    />
                    <Calendar className="absolute right-6 top-6 w-6 h-6 text-gray-300 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Estimated Expiry (Optional)</label>
                  <div className="relative">
                    <input 
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-[24px] py-5 px-8 outline-none transition-all font-black text-lg shadow-sm"
                    />
                    <Calendar className="absolute right-6 top-6 w-6 h-6 text-gray-300 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Village / Area</label>
                  <input 
                    type="text"
                    required
                    value={formData.location.village}
                    onChange={(e) => setFormData({...formData, location: { ...formData.location, village: e.target.value }})}
                    placeholder="Enter village"
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-[24px] py-5 px-8 outline-none transition-all font-black text-lg shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">District</label>
                  <input 
                    type="text"
                    required
                    value={formData.location.district}
                    onChange={(e) => setFormData({...formData, location: { ...formData.location, district: e.target.value }})}
                    placeholder="Enter district"
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-[24px] py-5 px-8 outline-none transition-all font-black text-lg shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">State</label>
                  <input 
                    type="text"
                    required
                    value={formData.location.state}
                    onChange={(e) => setFormData({...formData, location: { ...formData.location, state: e.target.value }})}
                    placeholder="Enter state"
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-[24px] py-5 px-8 outline-none transition-all font-black text-lg shadow-sm"
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="flex gap-6">
            <Button 
              type="button" 
              onClick={() => navigate(-1)}
              className="h-20 flex-1 rounded-[32px] bg-white text-gray-900 border-2 border-gray-100 font-black uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-all"
            >
              Cancel Listing
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="h-20 flex-[2] rounded-[32px] bg-gray-900 text-white font-black uppercase tracking-widest text-xl hover:bg-green-600 transition-all flex items-center justify-center gap-4 shadow-xl"
            >
              {loading ? 'Processing...' : (
                <>
                  <CheckCircle2 className="w-8 h-8" />
                  Publish Product Now
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
