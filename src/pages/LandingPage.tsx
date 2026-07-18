import React from 'react';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import { motion } from 'motion/react';
import { CheckCircle2, TrendingUp, ShieldCheck, Globe, Users, ArrowRight, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import Card from '../components/common/Card';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#FDFCF8]">
      <Hero />
      
      {/* About Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-[60px] overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1200" alt="About" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-green-900/10" />
            </div>
            {/* Stats Overlay */}
            <div className="absolute -bottom-10 -right-10 bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100 hidden md:block">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-700">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-4xl font-black text-gray-900 leading-none mb-1">50k+</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Farmers</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-black text-green-700 uppercase tracking-[0.3em] mb-4 block">About AgriSmart</span>
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-8 leading-[0.9]">
              Revolutionizing the way we feed the world.
            </h2>
            <p className="text-xl text-gray-500 font-medium leading-relaxed mb-10">
              Founded in 2021, AgriSmart AI has grown from a small laboratory project to the world's leading intelligence layer for agriculture. We empower farmers with the same technology used by global space agencies.
            </p>
            <div className="space-y-6 mb-12">
              {[
                "Satellite-based crop health monitoring",
                "Advanced pest and disease prediction models",
                "Hyperlocal precision weather intelligence",
                "Direct farm-to-global marketplace access"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-700">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-lg font-bold text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/about')} className="px-10 py-5 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-green-700 transition-all duration-500 flex items-center gap-3 group">
              Learn More About Our Mission <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      <Features />

      {/* Smart Farming Section */}
      <section className="py-32 bg-gray-900 text-white overflow-hidden rounded-[80px] mx-6">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-24">
            <div className="max-w-2xl">
              <span className="text-xs font-black text-green-500 uppercase tracking-[0.3em] mb-4 block">Smart Agriculture</span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
                Intelligent automation for modern fields.
              </h2>
            </div>
            <p className="text-xl text-gray-400 font-medium max-w-sm mb-4">
              Reduce manual labor by 60% with our integrated IoT and AI ecosystem.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            <Card className="lg:col-span-8 h-[600px] relative overflow-hidden group border-none bg-white/5 backdrop-blur-md">
              <img src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
              <div className="absolute bottom-12 left-12 right-12">
                <h3 className="text-4xl font-black mb-4 tracking-tight">Precision Irrigation</h3>
                <p className="text-lg text-gray-300 font-medium max-w-xl mb-8">AI-driven watering schedules that adapt to real-time humidity and soil moisture levels, saving millions of gallons monthly.</p>
                <button onClick={() => navigate('/smart-farming/dashboard')} className="px-8 py-4 bg-green-500 text-gray-900 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-green-400 transition-all">Explore Tech</button>
              </div>
            </Card>
            <div className="lg:col-span-4 flex flex-col gap-8">
              {[
                { title: "Autonomous Monitoring", desc: "Drone-based field analysis.", icon: ShieldCheck },
                { title: "Soil Nutrient Labs", desc: "Instant chemical breakdown.", icon: Zap }
              ].map((item, i) => (
                <Card key={i} className="flex-grow p-10 border-none bg-white/5 backdrop-blur-md group hover:bg-white/10 transition-colors">
                  <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center text-gray-900 mb-8 group-hover:scale-110 transition-transform">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black mb-4 tracking-tight">{item.title}</h3>
                  <p className="text-gray-400 font-medium">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-white">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">Trusted by Leaders</h2>
            <p className="text-gray-500 font-medium">Join thousands of farmers already growing with AgriSmart AI.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { name: "John Doe", role: "Wheat Farmer", text: "AgriSmart changed my life. My yields are up by 35% this season alone." },
              { name: "Sarah Smith", role: "Orchard Owner", text: "The disease detection tool saved my apple crop from a devastating pest outbreak." },
              { name: "Michael Chen", role: "Agri-Exporter", text: "The marketplace is smooth and transparent. Best platform I've ever used." }
            ].map((t, i) => (
              <Card key={i} className="p-12 border-gray-50 shadow-2xl shadow-gray-100 rounded-[48px] hover:-translate-y-2 transition-all">
                <div className="flex gap-1 text-amber-400 mb-8">
                  {[...Array(5)].map((_, j) => <CheckCircle2 key={j} className="w-4 h-4 fill-amber-400" />)}
                </div>
                <p className="text-xl text-gray-700 font-medium italic leading-relaxed mb-10">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full" />
                  <div>
                    <p className="font-black text-gray-900">{t.name}</p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
