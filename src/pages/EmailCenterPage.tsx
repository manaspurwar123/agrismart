import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  History, 
  Eye, 
  Trash2, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  Key, 
  Building2, 
  MessageCircle, 
  Megaphone,
  X,
  Plus,
  ArrowRight,
  User,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface EmailLog {
  id: string;
  userId: string;
  recipientEmail: string;
  subject: string;
  body: string;
  type: 'Auth' | 'Order' | 'Rental' | 'Gov' | 'Alert' | 'Reminder' | 'Community' | 'Admin';
  status: 'Sent' | 'Failed';
  sentAt: string;
}

const types: Record<string, any> = {
  Auth: { icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
  Order: { icon: Key, color: 'text-green-600', bg: 'bg-green-50' },
  Rental: { icon: Key, color: 'text-purple-600', bg: 'bg-purple-50' },
  Gov: { icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  Alert: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
  Reminder: { icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
  Community: { icon: MessageCircle, color: 'text-pink-600', bg: 'bg-pink-50' },
  Admin: { icon: Megaphone, color: 'text-gray-600', bg: 'bg-gray-50' },
};

export default function EmailCenterPage() {
  const [emails, setEmails] = useState<EmailLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<EmailLog | null>(null);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const res = await fetch('/api/emails/history');
      if (res.ok) {
        const data = await res.json();
        setEmails(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEmail = async (id: string) => {
    // Simulated delete
    setEmails(prev => prev.filter(e => e.id !== id));
  };

  const resendEmail = async (email: EmailLog) => {
    // Simulated resend
    alert(`Resending email to ${email.recipientEmail}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Platform Email Center</h1>
          <p className="text-gray-500 font-medium">Track and manage automated system emails and official communications.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg flex items-center gap-2">
            <Mail className="w-4 h-4" /> New Outbound
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Sent', value: emails.length, icon: Send, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Success Rate', value: '100%', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Last Sent', value: emails.length > 0 ? new Date(emails[0].sentAt).toLocaleDateString() : 'N/A', icon: History, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h4 className="text-xl font-black text-gray-900 tracking-tight">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Email List */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
        <div className="p-6 border-b border-gray-50 flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search recipients or subject..." 
              className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-green-500/30 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium transition-all outline-none"
            />
          </div>
          <button className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-500 rounded-2xl hover:bg-gray-100 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Type & Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Recipient</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Subject</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Sent Date</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {emails.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto text-gray-300">
                      <Mail className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">No email history found</h3>
                    <p className="text-gray-500 font-medium">Any automated emails sent to you will appear here.</p>
                  </td>
                </tr>
              ) : (
                emails.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()).map((email) => {
                  const type = types[email.type] || types.Admin;
                  return (
                    <tr key={email.id} className="group hover:bg-gray-50/50 transition-all">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", type.bg, type.color)}>
                            <type.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 block">{email.type}</span>
                            <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-md text-[8px] font-black uppercase tracking-widest">Delivered</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-gray-900">{email.recipientEmail}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-gray-500 line-clamp-1 max-w-xs">{email.subject}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                          {new Date(email.sentAt).toLocaleDateString()}
                          <span className="block font-bold">{new Date(email.sentAt).toLocaleTimeString()}</span>
                        </p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button 
                            onClick={() => setSelectedEmail(email)}
                            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm"
                            title="View Email"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => resendEmail(email)}
                            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-colors shadow-sm"
                            title="Resend"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteEmail(email.id)}
                            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
                            title="Delete Log"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email View Modal */}
      <AnimatePresence>
        {selectedEmail && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">Email Details</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">ID: {selectedEmail.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedEmail(null)}
                  className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-gray-900 rounded-2xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 overflow-y-auto space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">To</p>
                    <p className="text-sm font-bold text-gray-900">{selectedEmail.recipientEmail}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Sent Date</p>
                    <p className="text-sm font-bold text-gray-900">{new Date(selectedEmail.sentAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Subject</p>
                  <p className="text-lg font-black text-gray-900">{selectedEmail.subject}</p>
                </div>
                <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Message Body</p>
                  <div className="prose prose-sm font-medium text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {selectedEmail.body}
                  </div>
                </div>
              </div>
              <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex gap-4">
                <button 
                  onClick={() => resendEmail(selectedEmail)}
                  className="flex-grow px-6 py-4 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Resend This Email
                </button>
                <button 
                  onClick={() => setSelectedEmail(null)}
                  className="px-8 py-4 bg-white border border-gray-100 text-gray-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
