import React, { useState } from 'react';
import { 
  FileCode, 
  Search, 
  Plus, 
  MoreVertical, 
  Eye, 
  Edit2, 
  Trash2, 
  Globe, 
  Image as ImageIcon, 
  Settings, 
  Layout, 
  MessageSquare, 
  CheckCircle2, 
  XCircle,
  FileText,
  ChevronRight,
  Monitor,
  Smartphone,
  Tablet,
  Save,
  Undo
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

const pages = [
  { id: '1', title: 'Home Page', slug: '/', status: 'Published', lastUpdated: '2024-03-15', author: 'Super Admin' },
  { id: '2', title: 'About Us', slug: '/about', status: 'Published', lastUpdated: '2024-03-12', author: 'Admin' },
  { id: '3', title: 'Services', slug: '/services', status: 'Draft', lastUpdated: '2024-03-10', author: 'Super Admin' },
  { id: '4', title: 'Privacy Policy', slug: '/privacy', status: 'Published', lastUpdated: '2024-02-28', author: 'System' },
  { id: '5', title: 'Terms & Conditions', slug: '/terms', status: 'Published', lastUpdated: '2024-02-28', author: 'System' },
];

export default function CmsManagement() {
  const [activeTab, setActiveTab] = useState<'pages' | 'settings' | 'hero' | 'testimonials'>('pages');
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">CMS Management</h1>
          <p className="text-gray-500 font-medium">Manage website content, sections, dynamic pages, and platform assets.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2">
            <Undo className="w-4 h-4" /> Rollback
          </button>
          <button className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
        {[
          { id: 'pages', label: 'Pages', icon: Layout },
          { id: 'hero', label: 'Hero Sections', icon: ImageIcon },
          { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
          { id: 'settings', label: 'Site Settings', icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              activeTab === tab.id 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'pages' && (
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search pages..." 
                className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-green-500/30 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium transition-all outline-none"
              />
            </div>
            <button className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create Page
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Page Title & Slug</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Author</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Last Updated</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="font-black text-gray-900 tracking-tight">{page.title}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{page.slug}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-gray-600">{page.author}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-gray-600">
                        {new Date(page.lastUpdated).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className={cn(
                        "inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                        page.status === 'Published' ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                      )}>
                        {page.status === 'Published' ? <CheckCircle2 className="w-3 h-3" /> : <Edit2 className="w-3 h-3" />}
                        {page.status}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-green-50 hover:text-green-600 transition-colors shadow-sm">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Site Settings */}
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">General Information</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Website Name</label>
                <input type="text" defaultValue="AgriSmart AI" className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-green-500/30 rounded-2xl py-3 px-4 text-sm font-black transition-all outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Contact Email</label>
                <input type="email" defaultValue="support@agrismart.ai" className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-green-500/30 rounded-2xl py-3 px-4 text-sm font-black transition-all outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Meta Description</label>
                <textarea rows={3} defaultValue="Modern AI platform for smart farming and agricultural marketplace." className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-green-500/30 rounded-2xl py-3 px-4 text-sm font-black transition-all outline-none resize-none" />
              </div>
            </div>
          </div>

          {/* Identity Settings */}
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Identity & Visuals</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Site Logo</label>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-green-50 rounded-[32px] border-2 border-dashed border-green-200 flex items-center justify-center text-green-600">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-black text-gray-900 mb-1">Upload New Logo</p>
                    <p className="text-xs text-gray-400 font-bold mb-4">PNG, SVG up to 2MB</p>
                    <button className="px-4 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all">Choose File</button>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-50">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Appearance Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  <button className="p-4 rounded-2xl border-2 border-green-600 bg-white flex flex-col items-center gap-2">
                    <div className="w-full h-8 bg-gray-100 rounded-lg" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Light</span>
                  </button>
                  <button className="p-4 rounded-2xl border-2 border-transparent bg-gray-50 flex flex-col items-center gap-2">
                    <div className="w-full h-8 bg-gray-900 rounded-lg" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Dark</span>
                  </button>
                  <button className="p-4 rounded-2xl border-2 border-transparent bg-gray-50 flex flex-col items-center gap-2">
                    <div className="w-full h-8 bg-gradient-to-r from-gray-100 to-gray-900 rounded-lg" />
                    <span className="text-[10px] font-black uppercase tracking-widest">System</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
