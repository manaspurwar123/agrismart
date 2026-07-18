import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Sprout, Menu, X, LogOut, ChevronDown, User, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export default function Navbar({ user, onLogout }: { user: any; onLogout: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [currentLang, setCurrentLang] = useState<'en' | 'hi'>('en');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!document.getElementById('google-translate-script')) {
      if (!document.getElementById('google_translate_element')) {
        const div = document.createElement('div');
        div.id = 'google_translate_element';
        div.style.display = 'none';
        document.body.appendChild(div);
      }

      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi',
            autoDisplay: false,
          },
          'google_translate_element'
        );

        const savedLang = localStorage.getItem('preferredLanguage') as 'en' | 'hi';
        if (savedLang && savedLang !== 'en') {
          setTimeout(() => {
            const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
            if (select) {
              select.value = savedLang;
              select.dispatchEvent(new Event('change'));
              setCurrentLang(savedLang);
            }
          }, 1000);
        }
      };

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else {
      const savedLang = localStorage.getItem('preferredLanguage') as 'en' | 'hi';
      if (savedLang) {
        setCurrentLang(savedLang);
      }
    }
  }, []);

  const toggleLanguage = () => {
    const nextLang = currentLang === 'en' ? 'hi' : 'en';
    setCurrentLang(nextLang);
    localStorage.setItem('preferredLanguage', nextLang);

    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = nextLang;
      select.dispatchEvent(new Event('change'));
    } else {
      console.warn('Google Translate select element not found.');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'AI Solutions', path: '/ai-solutions' },
    { name: 'Weather', path: '/weather' },
    { name: 'Farms', path: '/my-farms' },
    { name: 'Soil', path: '/soil-analysis' },
    { name: 'Crops', path: '/crop-recommendation' },
    { name: 'Disease', path: '/disease-detection' },
    { name: 'Market', path: '/marketplace' },
    { name: 'Rental', path: '/rental' },
    { name: 'Finance', path: '/finance' },
    { name: 'Gov', path: '/government' },
    { name: 'Community', path: '/community' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Smart', path: '/smart-farming' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
      isScrolled ? "bg-white/80 backdrop-blur-2xl shadow-xl py-4" : "bg-transparent py-6"
    )}>
      <div className="w-full mx-auto px-4 lg:px-6 xl:px-12 flex items-center justify-between gap-4">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-2xl flex items-center justify-center shadow-lg shadow-green-100 group-hover:scale-110 transition-transform duration-500">
            <Sprout className="text-white w-7 h-7" />
          </div>
          <div>
            <span className={cn("text-2xl font-black tracking-tighter block leading-none transition-colors", isScrolled ? "text-gray-900" : "text-gray-900")}>AgriSmart</span>
            <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest leading-none">Intelligence</span>
          </div>
        </NavLink>

        {/* Desktop Nav */}
        <div className="hidden xl:flex flex-1 min-w-0 justify-center items-center px-4">
          <div className="flex items-center gap-1 bg-gray-100/50 backdrop-blur-md p-1.5 rounded-full border border-white/20 overflow-x-auto overflow-y-hidden no-scrollbar">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => cn(
                  "shrink-0 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300",
                  isActive ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:text-gray-900"
                )}
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          <button 
            onClick={toggleLanguage}
            className={cn(
              "px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-md border",
              currentLang === 'hi' 
                ? "bg-green-600 text-white border-green-600 hover:bg-green-700" 
                : "bg-white text-green-700 border-green-200 hover:bg-green-50"
            )}
            title={currentLang === 'hi' ? "Translate to English" : "हिन्दी में अनुवाद करें"}
          >
            <Globe className="w-3.5 h-3.5" />
            {currentLang === 'hi' ? 'EN' : 'HI'}
          </button>
          {user ? (
            <div className="flex items-center gap-4 bg-white/50 p-1.5 pr-4 rounded-2xl border border-white/20">
              <button 
                onClick={() => navigate('/profile')}
                className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-green-500 transition-all"
              >
                {user.avatar ? <img src={user.avatar} alt="" /> : <User className="text-green-700" />}
              </button>
              <div className="text-left hidden sm:block cursor-pointer" onClick={() => navigate('/dashboard')}>
                <p className="text-sm font-black text-gray-900 leading-none mb-1">{user.name?.split(' ')[0] || 'Farmer'}</p>
                <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider leading-none">{user.role}</p>
              </div>
              <button 
                onClick={onLogout}
                className="ml-2 p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/login')} className="px-6 py-2.5 text-sm font-bold text-gray-700 hover:text-green-700 transition-all">Login</button>
              <button onClick={() => navigate('/register')} className="px-8 py-3 bg-green-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-green-100 hover:bg-green-800 hover:-translate-y-0.5 active:scale-95 transition-all">Get Started</button>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="xl:hidden p-3 bg-gray-100 rounded-xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="p-6 space-y-4">
              <div className="py-2 border-b border-gray-50 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-500">Language / भाषा</span>
                <button 
                  onClick={() => {
                    toggleLanguage();
                    setIsOpen(false);
                  }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-sm border",
                    currentLang === 'hi' 
                      ? "bg-green-600 text-white border-green-600" 
                      : "bg-gray-100 text-gray-600 border-transparent"
                  )}
                >
                  <Globe className="w-4 h-4" />
                  {currentLang === 'hi' ? 'English (EN)' : 'हिन्दी (HI)'}
                </button>
              </div>

              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block text-lg font-bold text-gray-600 hover:text-green-700 py-2 border-b border-gray-50 last:border-none"
                >
                  {link.name}
                </NavLink>
              ))}
              {!user && (
                <div className="pt-4 flex flex-col gap-3">
                  <button onClick={() => navigate('/login')} className="w-full py-4 rounded-2xl font-bold border border-gray-200">Login</button>
                  <button onClick={() => navigate('/register')} className="w-full py-4 rounded-2xl font-bold bg-green-700 text-white">Get Started</button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
