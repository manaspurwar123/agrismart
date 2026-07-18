import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Target, Users, Landmark, Mail, ArrowRight, CheckCircle2, ChevronRight, Globe, Leaf, Cpu } from 'lucide-react';
import { Button } from '../components/ui/Button';
import Card from '../components/common/Card';

const TIMELINE_DATA = [
  { year: '2021', title: 'The Genesis', desc: 'Started in a small lab with a vision to integrate AI into daily farming. Launched our first soil health prediction model.' },
  { year: '2022', title: 'First 10,000 Farmers', desc: 'Expanded our operations to 3 continents. Introduced satellite-based crop monitoring and our initial marketplace.' },
  { year: '2023', title: 'IoT Integration', desc: 'Launched our own line of affordable smart sensors for real-time field data, connecting physical farms to the cloud.' },
  { year: '2024', title: 'AI Assistant Core', desc: 'Deployed the AgriSmart AI assistant, providing conversational, localized agronomy advice in 20+ languages.' },
  { year: '2025', title: 'Global Scale', desc: 'Reached 50,000 active users. Partnered with governments for subsidized technology access and insurance.' }
];

const TEAM_MEMBERS = [
  { name: 'Dr. Sarah Chen', role: 'Chief Executive Officer', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400', bio: 'Former AI researcher at top tech firms, now dedicated to sustainable agriculture.' },
  { name: 'Marcus Johnson', role: 'Head of Agronomy', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', bio: 'Over 20 years of field experience in commercial farming and soil health.' },
  { name: 'Elena Rodriguez', role: 'Lead Data Scientist', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400', bio: 'Specializes in satellite imagery analysis and predictive weather modeling.' },
  { name: 'David Kim', role: 'VP of Engineering', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400', bio: 'Builds scalable IoT infrastructure and real-time data pipelines.' }
];

export default function AboutPage() {
  const [activeYear, setActiveYear] = useState(TIMELINE_DATA[0]);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedMember, setSelectedMember] = useState<typeof TEAM_MEMBERS[0] | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  return (
    <div className="pt-32 pb-20 bg-[#FDFCF8]">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter mb-8"
          >
            Our Mission.
          </motion.h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto font-medium leading-relaxed">
            We are on a mission to solve global food insecurity by providing farmers with the most advanced intelligence tools on the planet.
          </p>
        </div>

        {/* Core Values */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {[
            { title: "Innovation", desc: "Pushing the boundaries of AgriTech.", icon: Target },
            { title: "Integrity", desc: "Transparent data for every farmer.", icon: Shield },
            { title: "Community", desc: "Growing together as one global family.", icon: Users },
            { title: "Sustainability", desc: "Protecting our earth for generations.", icon: Landmark },
          ].map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="bg-white p-12 rounded-[40px] shadow-2xl border border-gray-50 hover:-translate-y-2 transition-all cursor-default group"
            >
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-700 mb-8 group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight text-gray-900 group-hover:text-green-700 transition-colors">{item.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Story Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gray-900 rounded-[80px] p-12 md:p-20 text-white flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-32"
        >
          <div className="flex-1">
            <h2 className="text-5xl font-black tracking-tighter mb-8">Founded with a purpose.</h2>
            <p className="text-xl text-gray-400 font-medium leading-relaxed mb-8">
              It all started in 2021 when a group of data scientists and farmers came together to bridge the technological divide. Today, we serve over 50,000 farmers across 12 countries.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-4xl font-black text-green-500 mb-1">2021</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Year Founded</p>
              </div>
              <div>
                <p className="text-4xl font-black text-green-500 mb-1">50k+</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Users</p>
              </div>
            </div>
          </div>
          <div className="flex-1 rounded-[40px] overflow-hidden shadow-2xl">
            <img src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800" alt="Team" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
        </motion.div>

        {/* Interactive Timeline */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">Our Journey</h2>
            <p className="text-xl text-gray-500 font-medium">How we got to where we are today.</p>
          </div>
          
          <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 p-8 md:p-12">
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {TIMELINE_DATA.map((item) => (
                <button
                  key={item.year}
                  onClick={() => setActiveYear(item)}
                  className={`px-6 py-3 rounded-xl font-bold text-lg transition-all ${
                    activeYear.year === item.year 
                      ? 'bg-green-600 text-white shadow-lg shadow-green-200 scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {item.year}
                </button>
              ))}
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeYear.year}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-3xl mx-auto text-center"
              >
                <h3 className="text-3xl font-black text-gray-900 mb-4">{activeYear.title}</h3>
                <p className="text-xl text-gray-500 font-medium leading-relaxed">{activeYear.desc}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">Meet the Team</h2>
            <p className="text-xl text-gray-500 font-medium">The experts behind the technology.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM_MEMBERS.map((member, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[32px] overflow-hidden shadow-lg border border-gray-100 cursor-pointer group"
                onClick={() => setSelectedMember(selectedMember?.name === member.name ? null : member)}
              >
                <div className="h-64 overflow-hidden relative">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <span className="text-white font-bold text-sm tracking-widest uppercase">View Profile</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-sm font-bold text-green-600 mb-4">{member.role}</p>
                  
                  <AnimatePresence>
                    {selectedMember?.name === member.name && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-500 text-sm leading-relaxed pt-4 border-t border-gray-100 mt-4">
                          {member.bio}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact/Newsletter Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 text-center relative overflow-hidden bg-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mx-auto mb-6">
                <Mail className="w-8 h-8" />
              </div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">Stay in the Loop</h2>
              <p className="text-xl text-gray-500 font-medium mb-10 max-w-2xl mx-auto">
                Join our newsletter to get the latest updates on AgriSmart technology, new features, and industry insights.
              </p>

              {isSubscribed ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 text-green-700 p-6 rounded-2xl font-bold flex items-center justify-center gap-3 inline-flex mx-auto"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  Thanks for subscribing! We'll be in touch.
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    required
                    className="flex-1 px-6 py-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-medium"
                  />
                  <Button type="submit" className="py-4 px-8 shrink-0">
                    Subscribe <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </form>
              )}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
