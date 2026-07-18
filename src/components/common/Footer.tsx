import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sprout, Mail, Phone, MapPin, Globe, Share2, Video, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0A1A0C] text-white pt-24 pb-12 overflow-hidden relative">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-[1600px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-green-700 rounded-2xl flex items-center justify-center">
                <Sprout className="text-white w-7 h-7" />
              </div>
              <span className="text-3xl font-black tracking-tighter">AgriSmart AI</span>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
              Pioneering the next evolution of global agriculture through advanced AI, real-time satellite intelligence, and sustainable robotics.
            </p>
            <div className="flex gap-4">
              {[Globe, Share2, Video].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-green-700 hover:-translate-y-1 transition-all duration-300 border border-white/5">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-green-500 mb-10">Company</h4>
            <ul className="space-y-6">
              {[
                { name: 'Home', path: '/' },
                { name: 'About', path: '/about' },
                { name: 'Services', path: '/services' },
                { name: 'Community', path: '/community' },
                { name: 'Contact', path: '/contact' }
              ].map(link => (
                <li key={link.name}>
                  <NavLink to={link.path} className="text-gray-400 hover:text-white transition-colors font-medium">{link.name}</NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-green-500 mb-10">Solutions</h4>
            <ul className="space-y-6">
              {[
                { name: 'AI Solutions', path: '/ai-solutions' },
                { name: 'Marketplace', path: '/marketplace' },
                { name: 'Weather', path: '/weather' },
                { name: 'Gov Schemes', path: '/government/schemes' },
                { name: 'Analytics', path: '/analytics' }
              ].map(link => (
                <li key={link.name}>
                  <NavLink to={link.path} className="text-gray-400 hover:text-white transition-colors font-medium">{link.name}</NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-green-500 mb-10">Newsletter</h4>
            <p className="text-gray-400 mb-8 font-medium">Join 50,000+ progressive farmers getting our weekly insights.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 outline-none focus:border-green-500 transition-colors"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-green-700 hover:bg-green-600 px-6 rounded-xl transition-all active:scale-95">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-sm text-gray-500 font-bold uppercase tracking-widest">
          <p>© 2026 AgriSmart AI. Empowering Growth.</p>
          <div className="flex gap-10">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
