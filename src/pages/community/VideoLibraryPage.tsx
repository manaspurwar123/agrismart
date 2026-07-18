import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, 
  Play, 
  Search, 
  Filter, 
  Eye, 
  Clock, 
  Share2, 
  Heart, 
  Bookmark, 
  MoreVertical,
  X,
  PlayCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { VideoItem } from '../../types';

export function VideoLibraryPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const categories = ['All', 'Crop Management', 'Equipment', 'Organic Farming', 'Success Stories', 'Tutorials'];

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/videos');
      if (res.ok) {
        setVideos(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');

  const filteredVideos = videos.filter(v => {
    const matchesCategory = activeCategory === 'All' || v.category === activeCategory;
    const matchesSearch = (v.title || '').toLowerCase().includes((searchQuery || '').toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12">
      {/* Search & Categories */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-2 lg:pb-0 w-full lg:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300",
                activeCategory === cat 
                  ? "bg-green-700 text-white shadow-lg shadow-green-100" 
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search tutorials & videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-green-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredVideos.map((video, idx) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="relative aspect-video rounded-[32px] overflow-hidden mb-4 shadow-lg group-hover:shadow-xl transition-all duration-500">
                <img src={video.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500 border border-white/30">
                    <Play className="text-white w-8 h-8 fill-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-black text-white">
                  {video.duration}
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                  <PlayCircle className="text-green-700 w-6 h-6" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-black text-gray-900 tracking-tighter leading-tight mb-2 group-hover:text-green-700 transition-colors line-clamp-2">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {video.views} VIEWS
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(video.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-900 transition-colors p-1">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && [1, 2, 3].map(i => (
          <div key={i} className="space-y-4 animate-pulse">
            <div className="aspect-video bg-gray-100 rounded-[32px]" />
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-xl" />
              <div className="space-y-2 flex-grow py-1">
                <div className="w-full h-4 bg-gray-100 rounded-full" />
                <div className="w-2/3 h-4 bg-gray-50 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              onClick={() => setSelectedVideo(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-6xl aspect-video bg-black rounded-[40px] shadow-2xl overflow-hidden border border-white/10"
            >
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all z-20"
              >
                <X className="w-6 h-6" />
              </button>
              
              <iframe
                src={selectedVideo.url}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white pointer-events-none">
                <h2 className="text-3xl font-black tracking-tighter mb-2">{selectedVideo.title}</h2>
                <div className="flex items-center gap-6 text-sm font-bold text-gray-300">
                  <span className="px-3 py-1 rounded-xl bg-green-700 text-[10px] font-black uppercase tracking-widest text-white">
                    {selectedVideo.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {selectedVideo.views} Views
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {selectedVideo.duration}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
