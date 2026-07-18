import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Typewriter from 'typewriter-effect';
import { ArrowRight, Play, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FDFCF8]">
      {/* Background Parallax Images */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000" 
          alt="Fields" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FDFCF8]/0 via-[#FDFCF8]/50 to-[#FDFCF8]" />
      </motion.div>

      {/* Animated Clouds */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        <motion.div 
          animate={{ x: [-100, 100], opacity: [0, 0.5, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-1/4 w-96 h-32 bg-white/40 blur-[60px] rounded-full"
        />
        <motion.div 
          animate={{ x: [100, -100], opacity: [0, 0.3, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-40 right-1/4 w-[500px] h-40 bg-white/30 blur-[80px] rounded-full"
        />
      </div>

      {/* Floating Leaves */}
      <div className="absolute inset-0 z-2 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: -100, 
              rotate: 0,
              scale: 0.5 + Math.random()
            }}
            animate={{ 
              y: window.innerHeight + 100,
              x: `+=${(Math.random() - 0.5) * 200}`,
              rotate: 360 
            }}
            transition={{ 
              duration: 10 + Math.random() * 10, 
              repeat: Infinity, 
              ease: "linear",
              delay: i * 2
            }}
            className="absolute text-green-600/20"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L21,21L21,4C18,4 17,8 17,8Z" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ opacity }}
        >
          <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-green-50 border border-green-100 text-green-700 text-sm font-black uppercase tracking-widest mb-8 shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Next-Gen Farming Technology
          </span>

          <h1 className="text-7xl md:text-9xl font-black text-gray-900 tracking-tighter leading-[0.85] mb-12">
            Grow Better<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-green-900">
              <Typewriter
                options={{
                  strings: ['Yields', 'Future', 'Profit', 'Legacy'],
                  autoStart: true,
                  loop: true,
                  delay: 75,
                }}
              />
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-3xl mx-auto mb-16 leading-relaxed">
            The world's most advanced AI platform for precision agriculture. Increase your productivity by up to 40% with real-time satellite insights.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button onClick={() => navigate('/register')} className="group relative px-10 py-5 bg-green-700 text-white rounded-[24px] font-black text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-green-200">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative flex items-center gap-2">
                Get Started Free <ArrowRight className="w-6 h-6" />
              </span>
            </button>
            <button className="px-10 py-5 bg-white text-gray-900 rounded-[24px] font-black text-lg border border-gray-100 shadow-xl flex items-center gap-3 hover:bg-gray-50 transition-all hover:-translate-y-1">
              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                <Play className="w-4 h-4 fill-green-700 text-green-700" />
              </div>
              Watch How It Works
            </button>
          </div>
        </motion.div>

        {/* Stats Overlay */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 max-w-5xl mx-auto"
        >
          {[
            { label: 'Active Farmers', value: '50k+' },
            { label: 'Yield Increase', value: '42%' },
            { label: 'Water Saved', value: '30B L' },
            { label: 'Global Rank', value: '#1' },
          ].map((stat, i) => (
            <div key={i} className="text-left">
              <p className="text-4xl font-black text-gray-900 tracking-tighter mb-1">{stat.value}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-20 right-20 z-5 hidden xl:block"
      >
        <div className="w-64 h-64 bg-green-100 rounded-[48px] rotate-12 flex items-center justify-center p-8 border border-green-200 shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400" 
            alt="Crop" 
            className="w-full h-full object-cover rounded-3xl"
          />
        </div>
      </motion.div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-gray-300" />
      </div>
    </section>
  );
}
