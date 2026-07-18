import React from 'react';
import { motion } from 'motion/react';
import { 
  Sprout, 
  CloudRain, 
  ShieldCheck, 
  Bot, 
  ShoppingBag, 
  Landmark, 
  Users, 
  LineChart,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SERVICES = [
  {
    id: 'smart-farming',
    title: 'Smart Farming',
    description: 'Connect IoT sensors, manage drones, and automate irrigation systems for precision agriculture.',
    icon: Sprout,
    color: 'bg-green-100 text-green-700',
    path: '/smart-farming/dashboard'
  },
  {
    id: 'weather',
    title: 'Weather Intelligence',
    description: 'Hyper-local weather forecasting with AI-driven alerts for extreme conditions.',
    icon: CloudRain,
    color: 'bg-blue-100 text-blue-700',
    path: '/weather'
  },
  {
    id: 'disease',
    title: 'Disease Detection',
    description: 'Instantly identify crop diseases and pests using our computer vision models.',
    icon: ShieldCheck,
    color: 'bg-red-100 text-red-700',
    path: '/disease-detection'
  },
  {
    id: 'ai-assistant',
    title: 'AI Agronomist',
    description: '24/7 personalized farming advice, crop recommendations, and voice-assisted queries.',
    icon: Bot,
    color: 'bg-purple-100 text-purple-700',
    path: '/ai/assistant'
  },
  {
    id: 'marketplace',
    title: 'Global Marketplace',
    description: 'Buy supplies, rent equipment, and sell your produce directly to buyers.',
    icon: ShoppingBag,
    color: 'bg-amber-100 text-amber-700',
    path: '/marketplace'
  },
  {
    id: 'government',
    title: 'Gov Schemes',
    description: 'Discover eligible subsidies, apply for crop insurance, and manage documents.',
    icon: Landmark,
    color: 'bg-indigo-100 text-indigo-700',
    path: '/government/dashboard'
  },
  {
    id: 'analytics',
    title: 'Farm Analytics',
    description: 'Predict yields, track expenses, and forecast profits with advanced dashboards.',
    icon: LineChart,
    color: 'bg-teal-100 text-teal-700',
    path: '/analytics/dashboard'
  },
  {
    id: 'community',
    title: 'Community Hub',
    description: 'Connect with expert agronomists and share experiences with fellow farmers.',
    icon: Users,
    color: 'bg-orange-100 text-orange-700',
    path: '/community'
  }
];

export default function ServicesPage() {
  const navigate = useNavigate();

  return (
    <div className="pt-32 pb-20 bg-[#FDFCF8] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter mb-8"
          >
            Our Services.
          </motion.h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto font-medium leading-relaxed">
            A comprehensive ecosystem of intelligent tools designed to optimize every aspect of your agricultural operations.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(service.path)}
              className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-xl shadow-gray-200/50 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col h-full"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${service.color} group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed flex-grow">
                {service.description}
              </p>
              <div className="mt-8 flex items-center text-sm font-bold text-gray-900 uppercase tracking-widest group-hover:text-green-600 transition-colors">
                Explore <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 bg-gray-900 rounded-[60px] p-12 md:p-20 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">Need a custom enterprise solution?</h2>
            <p className="text-xl text-gray-400 font-medium mb-10">
              We offer bespoke AI models, private cloud deployments, and custom sensor integrations for large-scale agricultural operations.
            </p>
            <button 
              onClick={() => navigate('/contact')}
              className="px-10 py-5 bg-white text-gray-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-green-50 transition-colors"
            >
              Contact Sales
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
