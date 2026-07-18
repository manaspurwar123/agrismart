import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Video, 
  Search, 
  Star, 
  Clock, 
  Play, 
  CheckCircle2, 
  ChevronRight,
  Filter,
  GraduationCap,
  Layers,
  ArrowRight,
  Download
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Course } from '../../types';

export function LearningHubPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['All', 'Organic Farming', 'Technology', 'Livestock', 'Marketing', 'Financing'];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      if (res.ok) {
        setCourses(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCourses = activeCategory === 'All' 
    ? courses 
    : courses.filter(c => c.category === activeCategory);

  return (
    <div className="space-y-12">
      {/* Learning Stats / Promo */}
      <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-[40px] p-12 text-white relative overflow-hidden shadow-2xl shadow-green-100">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <BookOpen className="w-full h-full -rotate-12 translate-x-1/4" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-widest">Premium Learning</span>
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-6 leading-[0.9]">Master the Art of <span className="text-green-300 underline decoration-4 underline-offset-8">Smart Farming</span></h1>
          <p className="text-lg font-medium text-green-50/80 mb-8 leading-relaxed">
            Access certified courses from top agriculture experts and universities. Learn everything from organic techniques to modern AI tools.
          </p>
          <div className="flex flex-wrap gap-8">
            <div>
              <p className="text-3xl font-black tracking-tighter">150+</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-green-300">Expert Courses</p>
            </div>
            <div className="w-px h-10 bg-white/20 self-center" />
            <div>
              <p className="text-3xl font-black tracking-tighter">12k+</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-green-300">Active Students</p>
            </div>
            <div className="w-px h-10 bg-white/20 self-center" />
            <div>
              <p className="text-3xl font-black tracking-tighter">Cert.</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-green-300">Gov. Recognized</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left: Filters */}
        <div className="lg:w-72 shrink-0 space-y-8">
          <div>
            <h3 className="font-black text-gray-900 tracking-tighter mb-6 flex items-center gap-2">
              <Filter className="w-4 h-4 text-green-600" />
              Course Library
            </h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all",
                    activeCategory === cat 
                      ? "bg-green-700 text-white shadow-lg shadow-green-100" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
            <Star className="text-amber-500 w-8 h-8 mb-4 fill-amber-500" />
            <h4 className="font-black text-gray-900 mb-2 tracking-tighter leading-tight">Join Live Sessions</h4>
            <p className="text-xs font-medium text-gray-600 mb-6">Interact directly with experts in our weekly live workshops.</p>
            <button className="w-full py-3 bg-white text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-200 hover:bg-amber-100 transition-all">
              View Schedule
            </button>
          </div>
        </div>

        {/* Right: Course Grid */}
        <div className="flex-grow space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tighter text-gray-900">{activeCategory} Courses</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search courses..."
                className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-medium w-72 focus:ring-2 focus:ring-green-500 outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence>
              {filteredCourses.map((course, idx) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img src={course.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur shadow-sm text-[10px] font-black uppercase tracking-widest text-green-700">
                        {course.category}
                      </span>
                      <span className="px-3 py-1.5 rounded-xl bg-green-700 text-white shadow-sm text-[10px] font-black uppercase tracking-widest">
                        {course.difficulty}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500">
                        <Play className="text-green-700 w-8 h-8 fill-green-700 ml-1" />
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                          <GraduationCap className="text-gray-400 w-4 h-4" />
                        </div>
                        <p className="text-xs font-bold text-gray-500">{course.instructor}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{course.duration}</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tighter mb-4 leading-tight group-hover:text-green-700 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium line-clamp-2 mb-6">
                      {course.description}
                    </p>
                    
                    <div className="space-y-4 pt-6 border-t border-gray-50">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-gray-400">Course Progress</span>
                        <span className="text-green-700">{course.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          className="h-full bg-green-700 rounded-full"
                        />
                      </div>
                      <div className="flex items-center gap-3 pt-2">
                        <button className="flex-grow py-4 bg-green-700 text-white rounded-2xl text-sm font-black tracking-tighter shadow-lg shadow-green-100 hover:bg-green-800 transition-all flex items-center justify-center gap-2">
                          {course.progress > 0 ? 'Continue Course' : 'Enroll Now'}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-green-700 transition-all">
                          <Download className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && [1, 2].map(i => (
              <div key={i} className="bg-white rounded-[40px] border border-gray-100 p-8 space-y-6 animate-pulse">
                <div className="w-full h-56 bg-gray-100 rounded-3xl" />
                <div className="space-y-4">
                  <div className="w-3/4 h-6 bg-gray-100 rounded-full" />
                  <div className="w-full h-4 bg-gray-50 rounded-full" />
                  <div className="w-full h-4 bg-gray-50 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
