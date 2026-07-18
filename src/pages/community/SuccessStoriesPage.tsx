import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  TrendingUp, 
  Star, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Filter, 
  Plus, 
  ArrowRight,
  Quote,
  Sparkles
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

export function SuccessStoriesPage() {
  const { user } = useAuth();
  const [stories, setStories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data for stories if needed, but I'll try to fetch or seed
    setStories([
      {
        id: '1',
        userName: 'Rajesh Patil',
        location: 'Pune, Maharashtra',
        title: 'Doubled Income with Organic Turmeric',
        content: 'I was struggling with chemical farming for years. Switching to organic turmeric with help from AgriSmart experts changed everything. My yield is now premium grade.',
        image: 'https://images.unsplash.com/photo-1594488344553-90be5c276c12?auto=format&fit=crop&q=80&w=800',
        growth: '+120%',
        category: 'Organic Farming',
        likes: 245,
        comments: 42,
        time: '3 days ago'
      },
      {
        id: '2',
        userName: 'Lakshmi Devi',
        location: 'Warangal, Telangana',
        title: 'Precision Irrigation Success',
        content: 'Using the AI irrigation planner, I saved 40% water and increased my cotton quality significantly. Technology is truly a boon for small farmers.',
        image: 'https://images.unsplash.com/photo-1463123081488-789f998ac9c4?auto=format&fit=crop&q=80&w=800',
        growth: '+45%',
        category: 'Tech Integration',
        likes: 189,
        comments: 28,
        time: '1 week ago'
      }
    ]);
    setIsLoading(false);
  }, []);

  return (
    <div className="space-y-12">
      {/* Featured Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-2xl text-amber-600 border border-amber-100">
          <Trophy className="w-4 h-4 fill-amber-500" />
          <span className="text-xs font-black uppercase tracking-widest">Farmer Hall of Fame</span>
        </div>
        <h1 className="text-5xl font-black tracking-tighter text-gray-900 leading-[0.9]">Inspiring Stories of <span className="text-green-700">Growth</span></h1>
        <p className="text-lg font-medium text-gray-500">Real stories from real farmers who transformed their lives using AgriSmart AI tools and expert guidance.</p>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        <AnimatePresence>
          {stories.map((story, idx) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[48px] border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row group hover:shadow-2xl transition-all duration-500"
            >
              <div className="md:w-1/2 relative overflow-hidden">
                <img src={story.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur rounded-2xl shadow-xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Income Growth</p>
                  <p className="text-xl font-black text-green-700 leading-none">{story.growth}</p>
                </div>
              </div>
              <div className="md:w-1/2 p-10 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-black text-gray-400 text-sm">
                    {story.userName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-900 leading-none">{story.userName}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{story.location}</p>
                  </div>
                </div>

                <div className="flex-grow space-y-4">
                  <div className="inline-block px-3 py-1 rounded-lg bg-green-50 text-[10px] font-black text-green-700 uppercase tracking-widest">
                    {story.category}
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tighter leading-tight group-hover:text-green-700 transition-colors">
                    {story.title}
                  </h3>
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-green-50 opacity-50" />
                    <p className="text-sm text-gray-500 font-medium leading-relaxed relative z-10 italic">
                      "{story.content}"
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-red-500 transition-all">
                      <Heart className="w-4 h-4" />
                      {story.likes}
                    </button>
                    <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-blue-500 transition-all">
                      <MessageCircle className="w-4 h-4" />
                      {story.comments}
                    </button>
                  </div>
                  <button className="text-gray-400 hover:text-green-700 transition-all">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Call to Action */}
      <div className="bg-green-700 rounded-[48px] p-12 text-white flex flex-col items-center text-center space-y-8 relative overflow-hidden shadow-2xl shadow-green-100">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <Sparkles className="w-full h-full scale-150 rotate-12" />
        </div>
        <h2 className="text-4xl font-black tracking-tighter max-w-2xl leading-[0.9]">Have your own success story to share?</h2>
        <p className="text-lg font-medium text-green-50/80 max-w-xl">Your journey could inspire thousands of other farmers to embrace modern agriculture.</p>
        <button className="px-12 py-5 bg-white text-green-700 rounded-[24px] text-lg font-black tracking-tighter shadow-2xl hover:bg-green-50 transition-all flex items-center gap-3 active:scale-95">
          Share Your Story
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
