import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Package, 
  MapPin, 
  Phone, 
  MessageSquare,
  ArrowRight,
  Filter,
  RefreshCcw,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Order } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const OrderManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Requests' | 'Purchases'>(user?.role === 'farmer' ? 'Requests' : 'Purchases');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (activeTab === 'Requests') return o.farmerId === user?.id;
    return o.buyerId === user?.id;
  });

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#F9FBFA]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Marketplace Orders</h1>
            <p className="text-gray-500 font-medium">Track your purchase requests and active sales</p>
          </div>
          <div className="flex bg-white border-2 border-gray-100 rounded-2xl p-1 shadow-sm">
            {user?.role === 'farmer' && (
              <button 
                onClick={() => setActiveTab('Requests')}
                className={`px-8 py-3 rounded-xl transition-all font-black uppercase tracking-widest text-xs ${activeTab === 'Requests' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                Incoming Requests
              </button>
            )}
            <button 
              onClick={() => setActiveTab('Purchases')}
              className={`px-8 py-3 rounded-xl transition-all font-black uppercase tracking-widest text-xs ${activeTab === 'Purchases' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              My Purchases
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="grid gap-6">
            {filteredOrders.map((order) => (
              <motion.div 
                key={order.id}
                layout
                className="bg-white rounded-[40px] p-8 border-2 border-gray-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                  {/* Status & Badge */}
                  <div className="w-full lg:w-48 text-center shrink-0">
                    <div className={`w-20 h-20 rounded-[24px] mx-auto mb-4 flex items-center justify-center ${
                      order.status === 'Completed' ? 'bg-green-50 text-green-600' :
                      order.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                      order.status === 'Accepted' ? 'bg-blue-50 text-blue-600' :
                      'bg-orange-50 text-orange-600'
                    }`}>
                      {order.status === 'Completed' ? <CheckCircle2 className="w-10 h-10" /> :
                       order.status === 'Rejected' ? <XCircle className="w-10 h-10" /> :
                       <Clock className="w-10 h-10" />}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${
                      order.status === 'Completed' ? 'bg-green-50 text-green-600 border border-green-100' :
                      order.status === 'Rejected' ? 'bg-red-50 text-red-600 border border-red-100' :
                      'bg-orange-50 text-orange-600 border border-orange-100'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order #{order.id}</p>
                        <h3 className="text-2xl font-black text-gray-900 group-hover:text-green-600 transition-colors">{order.productName}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Value</p>
                        <p className="text-2xl font-black text-gray-900">₹{order.totalPrice}</p>
                        <p className="text-xs font-bold text-gray-400">Qty: {order.quantity} units</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-50">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                          <Package className="w-4 h-4" />
                          <span>{activeTab === 'Requests' ? `Buyer: ${order.buyerName}` : `Seller: ${order.farmerId}`}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span>{order.deliveryAddress}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                          <Phone className="w-4 h-4" />
                          <span>{order.contactNumber}</span>
                        </div>
                        {order.message && (
                          <div className="flex items-start gap-3 text-sm font-medium text-gray-500 italic">
                            <MessageSquare className="w-4 h-4 mt-0.5" />
                            <span>"{order.message}"</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="w-full lg:w-64 space-y-3">
                    {activeTab === 'Requests' && order.status === 'Pending' && (
                      <>
                        <Button 
                          onClick={() => updateOrderStatus(order.id, 'Accepted')}
                          className="w-full bg-green-500 hover:bg-green-600 text-white rounded-2xl h-14 font-black uppercase tracking-widest text-xs"
                        >
                          Accept Order
                        </Button>
                        <Button 
                          onClick={() => updateOrderStatus(order.id, 'Rejected')}
                          variant="outline"
                          className="w-full border-red-100 text-red-500 hover:bg-red-50 rounded-2xl h-14 font-black uppercase tracking-widest text-xs"
                        >
                          Reject Request
                        </Button>
                      </>
                    )}
                    {activeTab === 'Requests' && order.status === 'Accepted' && (
                      <Button 
                        onClick={() => updateOrderStatus(order.id, 'Completed')}
                        className="w-full bg-gray-900 hover:bg-green-600 text-white rounded-2xl h-14 font-black uppercase tracking-widest text-xs"
                      >
                        Mark as Delivered
                      </Button>
                    )}
                    {(order.status === 'Completed' || order.status === 'Rejected') && (
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status Finalized</p>
                        <p className="text-xs font-bold text-gray-600">On {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[60px] p-24 text-center border-2 border-gray-100">
            <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="w-12 h-12 text-gray-200" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4">No {activeTab.toLowerCase()} found</h3>
            <p className="text-gray-500 font-medium max-w-sm mx-auto mb-10">When you interact with the marketplace, your requests and sales will appear here.</p>
            <Button 
              onClick={() => navigate('/marketplace')}
              className="bg-gray-900 text-white rounded-[24px] px-10 py-5 font-black uppercase tracking-widest text-xs"
            >
              Visit Marketplace
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
