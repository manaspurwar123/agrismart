import React, { useState, useEffect } from 'react';
import { 
  Newspaper, 
  Calendar, 
  Tag, 
  ExternalLink, 
  Search,
  ArrowRight,
  Bookmark,
  Bell
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/Button';
import { GovNews } from '../../types';

export const GovNewsPage: React.FC = () => {
  const [news, setNews] = useState<GovNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/government-news');
      const data = await res.json();
      setNews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = news.filter(n => 
    (n.title || '').toLowerCase().includes((search || '').toLowerCase()) || 
    (n.content || '').toLowerCase().includes((search || '').toLowerCase())
  );

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Announcement': return 'text-blue-500 bg-blue-50';
      case 'Policy': return 'text-purple-500 bg-purple-50';
      case 'Deadline': return 'text-orange-500 bg-orange-50';
      case 'Scheme': return 'text-green-500 bg-green-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4 italic italic">Policy Updates</h1>
          <p className="text-gray-500 font-medium text-lg">Stay informed with the latest government circulars and announcements.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative group w-full md:w-80">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
            <input 
              type="text"
              placeholder="Search news..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border-2 border-gray-100 h-16 pl-14 pr-8 rounded-[20px] w-full font-bold focus:border-green-500 outline-none transition-all shadow-sm"
            />
          </div>
          <Button className="h-16 bg-gray-900 text-white rounded-[20px] px-8 font-black text-xs uppercase tracking-widest flex items-center gap-3">
            <Bell className="w-5 h-5" /> Notify Me
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-8">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-64 bg-white rounded-[40px] animate-pulse border-2 border-gray-100" />
          ))}
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="bg-white rounded-[50px] p-24 text-center border-2 border-gray-100 shadow-sm">
          <h3 className="text-3xl font-black text-gray-900 mb-4 italic">No updates found</h3>
          <p className="text-gray-400 font-medium max-w-sm mx-auto">Try a different search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {filteredNews.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[40px] p-10 border-2 border-gray-100 shadow-sm hover:shadow-2xl hover:border-green-500 transition-all group flex flex-col md:flex-row gap-10"
            >
              {/* Date Block */}
              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-3xl w-full md:w-32 h-32 shrink-0 shadow-inner group-hover:bg-green-500 group-hover:text-white transition-all">
                <span className="text-3xl font-black">{new Date(item.date).getDate()}</span>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                  {new Date(item.date).toLocaleString('default', { month: 'short' })}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <Calendar className="w-4 h-4" /> {new Date(item.date).getFullYear()}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-3xl font-black text-gray-900 group-hover:text-green-600 transition-colors leading-tight italic">{item.title}</h3>
                  <p className="text-gray-500 font-medium text-lg leading-relaxed">
                    {item.content}
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <Button className="h-14 px-8 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                    Read Full Article <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="outline" className="h-14 w-14 rounded-2xl border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-500 transition-all flex items-center justify-center">
                    <Bookmark className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Visual Element */}
              <div className="hidden lg:block w-64 h-64 bg-gray-50 rounded-3xl overflow-hidden shadow-inner group-hover:rotate-3 transition-transform">
                <img 
                  src={`https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?q=80&w=300`}
                  className="w-full h-full object-cover opacity-60 mix-blend-multiply group-hover:scale-110 transition-transform"
                  alt="News"
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Subscription Box */}
      <div className="bg-gray-900 rounded-[60px] p-16 text-center relative overflow-hidden group">
        <div className="relative z-10 space-y-8">
          <h2 className="text-4xl lg:text-6xl font-black text-white italic italic">Never miss a deadline.</h2>
          <p className="text-gray-400 font-medium text-lg max-w-xl mx-auto italic">Get instant notifications about new subsidies and scheme announcements directly on your phone.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
            <input 
              type="email" 
              placeholder="Your email address"
              className="w-full h-18 bg-white/10 backdrop-blur-md border-2 border-white/10 rounded-2xl px-8 font-bold text-white outline-none focus:border-green-500 transition-all"
            />
            <Button className="w-full sm:w-auto h-18 px-12 bg-green-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-green-900 hover:scale-105 transition-all">
              Subscribe
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full -mr-48 -mt-48 blur-3xl group-hover:scale-125 transition-transform duration-1000" />
      </div>
    </div>
  );
};
