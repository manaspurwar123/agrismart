import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Share2, 
  Bookmark, 
  MoreVertical, 
  Image as ImageIcon, 
  Video, 
  MapPin, 
  Search, 
  Filter, 
  Plus,
  Send,
  X,
  MessageCircle,
  Tag,
  Clock
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { CommunityPost, Comment } from '../../types';

export function DiscussionFeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General', tags: [] as string[] });
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'General', 'Success Story', 'Help Needed', 'Market Tips', 'Equipment'];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/community/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) return;
    try {
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
      if (res.ok) {
        setIsCreating(false);
        setNewPost({ title: '', content: '', category: 'General', tags: [] });
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPosts = activeCategory === 'All' 
    ? posts 
    : posts.filter(p => p.category === activeCategory);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Sidebar - Filters */}
      <div className="hidden lg:block space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-48">
          <h3 className="font-black text-gray-900 tracking-tighter mb-6 flex items-center gap-2">
            <Filter className="w-4 h-4 text-green-600" />
            Feed Filters
          </h3>
          <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all",
                  activeCategory === cat 
                    ? "bg-green-50 text-green-700 shadow-sm shadow-green-100" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Feed */}
      <div className="lg:col-span-2 space-y-6">
        {/* Create Post Card */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
              {user?.avatar ? <img src={user.avatar} className="w-full h-full rounded-xl object-cover" alt="" /> : <Users className="text-green-700 w-6 h-6" />}
            </div>
            <button 
              onClick={() => setIsCreating(true)}
              className="flex-grow bg-gray-50 rounded-2xl px-6 py-3 text-left text-sm font-bold text-gray-400 hover:bg-gray-100 transition-all border border-gray-100"
            >
              Share your thoughts or ask a question, {user?.name?.split(' ')[0] || 'Farmer'}...
            </button>
            <button 
              onClick={() => setIsCreating(true)}
              className="p-3 bg-green-700 text-white rounded-xl shadow-lg shadow-green-100 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-6">
            <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-green-700 transition-colors">
              <ImageIcon className="w-4 h-4" />
              Photo
            </button>
            <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-green-700 transition-colors">
              <Video className="w-4 h-4" />
              Video
            </button>
            <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-green-700 transition-colors">
              <MapPin className="w-4 h-4" />
              Location
            </button>
          </div>
        </div>

        {/* Post List */}
        <div className="space-y-6">
          <AnimatePresence>
            {filteredPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                      {post.userAvatar ? <img src={post.userAvatar} className="w-full h-full object-cover" alt="" /> : <Users className="text-gray-400 w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-gray-900 leading-none mb-1">{post.userName}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">{post.userRole}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button className="ml-auto p-2 text-gray-400 hover:text-gray-900 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="px-2 py-0.5 rounded-lg bg-green-50 text-[10px] font-black text-green-700 uppercase tracking-widest mb-2 inline-block">
                        {post.category}
                      </span>
                      <h3 className="text-xl font-black text-gray-900 tracking-tighter leading-tight">{post.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 font-medium leading-relaxed">
                      {post.content}
                    </p>
                    {post.images && post.images.length > 0 && (
                      <div className="rounded-3xl overflow-hidden border border-gray-100">
                        <img src={post.images[0]} alt="" className="w-full h-auto" />
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-8">
                    <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-red-500 transition-all">
                      <Heart className="w-4.5 h-4.5" />
                      {post.likes}
                    </button>
                    <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-blue-500 transition-all">
                      <MessageCircle className="w-4.5 h-4.5" />
                      {post.commentsCount}
                    </button>
                    <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-green-500 transition-all">
                      <Share2 className="w-4.5 h-4.5" />
                      Share
                    </button>
                    <button className="ml-auto text-gray-400 hover:text-amber-500 transition-all">
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 animate-pulse">
                  <div className="flex gap-4 mb-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl" />
                    <div className="space-y-2 py-1">
                      <div className="w-32 h-3 bg-gray-100 rounded-full" />
                      <div className="w-20 h-2 bg-gray-50 rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="w-full h-4 bg-gray-100 rounded-full" />
                    <div className="w-2/3 h-4 bg-gray-100 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsCreating(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black tracking-tighter text-gray-900 leading-none mb-2">Create Post</h2>
                  <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest leading-none">Share with the Community</p>
                </div>
                <button 
                  onClick={() => setIsCreating(false)}
                  className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Topic / Title</label>
                  <input 
                    type="text" 
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="What's on your mind?"
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-lg font-black tracking-tight border border-transparent focus:border-green-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Category</label>
                    <select 
                      value={newPost.category}
                      onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border border-transparent focus:border-green-500 focus:bg-white outline-none transition-all appearance-none"
                    >
                      {categories.filter(c => c !== 'All').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Tags (Optional)</label>
                    <div className="relative">
                      <Tag className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="wheat, harvest, help..."
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl text-sm font-bold border border-transparent focus:border-green-500 focus:bg-white outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Your Story / Question</label>
                  <textarea 
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Describe it in detail..."
                    rows={6}
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-medium border border-transparent focus:border-green-500 focus:bg-white outline-none transition-all resize-none"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <button className="flex-grow py-4 bg-green-700 text-white rounded-2xl text-sm font-black tracking-tighter shadow-lg shadow-green-100 hover:bg-green-800 transition-all flex items-center justify-center gap-2" onClick={handleCreatePost}>
                    <Send className="w-4 h-4" />
                    Publish Post
                  </button>
                  <button className="p-4 bg-gray-100 rounded-2xl text-gray-400 hover:text-green-700 transition-all">
                    <ImageIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
