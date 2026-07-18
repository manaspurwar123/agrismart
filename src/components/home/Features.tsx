import React from 'react';
import { motion } from 'motion/react';
import { Sprout, Shield, Zap, TrendingUp, Search, Camera, CloudRain, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

const features = [
  {
    title: "AI Crop Recommendation",
    desc: "Predict the best crop for your soil using satellite data and AI.",
    icon: Sprout,
    color: "bg-green-100 text-green-700",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=600",
    path: "/crop-recommendation"
  },
  {
    title: "Disease Detection",
    desc: "Upload a photo and our AI identifies pests and diseases instantly.",
    icon: Camera,
    color: "bg-blue-100 text-blue-700",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=600",
    path: "/disease-detection"
  },
  {
    title: "Smart Marketplace",
    desc: "Direct farm-to-table commerce platform for global trade.",
    icon: ShoppingBag,
    color: "bg-amber-100 text-amber-700",
    image: "https://images.unsplash.com/photo-1488459711615-228f3c44b886?auto=format&fit=crop&q=80&w=600",
    path: "/marketplace"
  },
  {
    title: "Weather Intelligence",
    desc: "Precision hyperlocal forecasts for your exact field coordinates.",
    icon: CloudRain,
    color: "bg-purple-100 text-purple-700",
    image: "https://images.unsplash.com/photo-1504370805625-d32c54b16100?auto=format&fit=crop&q=80&w=600",
    path: "/weather"
  }
];

export default function Features() {
  const navigate = useNavigate();
  return (
    <section className="py-32 bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-black text-green-700 uppercase tracking-[0.3em] mb-4 block"
          >
            Core Capabilities
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter"
          >
            Everything you need<br />to scale your farm.
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
              onClick={() => navigate(f.path)}
            >
              <div className="relative h-[400px] rounded-[40px] overflow-hidden mb-8 shadow-2xl transition-all duration-700 group-hover:-translate-y-4">
                <img src={f.image} alt={f.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent" />
                
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", f.color)}>
                    <f.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-black mb-3 tracking-tight">{f.title}</h3>
                  <p className="text-sm text-gray-300 font-medium leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">{f.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
