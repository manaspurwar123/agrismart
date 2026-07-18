import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Share2, 
  Bookmark, 
  CheckCircle2, 
  Info, 
  ExternalLink,
  Phone,
  HelpCircle,
  FileCheck,
  Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { GovScheme } from '../../types';

export const SchemeDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState<GovScheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchScheme();
  }, [id]);

  const fetchScheme = async () => {
    try {
      const res = await fetch(`/api/schemes/${id}`);
      const data = await res.json();
      setScheme(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setIsApplying(true);
    try {
      // Simulate API call
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schemeId: scheme?.id,
          schemeTitle: scheme?.title,
          formData: {}, // In a real app, this would be a full form
          documents: []
        })
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/government/applications');
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="h-96 bg-gray-100 rounded-[60px] animate-pulse" />
      <div className="h-48 bg-gray-100 rounded-[40px] animate-pulse" />
    </div>
  );

  if (!scheme) return (
    <div className="text-center py-24">
      <h2 className="text-3xl font-black text-gray-900 italic">Scheme not found</h2>
      <Button onClick={() => navigate('/government/schemes')} className="mt-8 bg-gray-900 text-white rounded-2xl px-12 py-4 h-16 font-black uppercase tracking-widest text-xs">Go Back</Button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      {/* Header / Banner */}
      <div className="relative h-[500px] rounded-[60px] overflow-hidden group shadow-2xl">
        <img 
          src={scheme.bannerUrl || "https://images.unsplash.com/photo-1592982537447-6f2a6a0c3c1b?q=80&w=1200"}
          className="w-full h-full object-cover"
          alt={scheme.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        
        <div className="absolute top-10 left-10 right-10 flex justify-between items-center">
          <button 
            onClick={() => navigate('/government/schemes')}
            className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white hover:bg-white/40 transition-all border border-white/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-4">
            <button className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white hover:bg-white/40 transition-all border border-white/20">
              <Share2 className="w-6 h-6" />
            </button>
            <button className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white hover:bg-white/40 transition-all border border-white/20">
              <Bookmark className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-12 left-12 right-12">
          <span className="bg-green-500 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-lg inline-block mb-6">
            {scheme.department}
          </span>
          <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter italic leading-none">{scheme.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-12">
          {/* Overview */}
          <section className="bg-white rounded-[40px] p-10 border-2 border-gray-100 shadow-sm">
            <h2 className="text-3xl font-black text-gray-900 mb-8 italic flex items-center gap-4">
              <Info className="w-8 h-8 text-green-500" /> Overview
            </h2>
            <p className="text-gray-500 font-medium text-lg leading-relaxed">
              {scheme.description}
            </p>
          </section>

          {/* Benefits */}
          <section className="bg-white rounded-[40px] p-10 border-2 border-gray-100 shadow-sm">
            <h2 className="text-3xl font-black text-gray-900 mb-8 italic flex items-center gap-4">
              <CheckCircle2 className="w-8 h-8 text-blue-500" /> Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scheme.benefits.map((benefit, i) => (
                <div key={i} className="flex gap-4 p-6 bg-blue-50 rounded-3xl border border-blue-100 group hover:bg-blue-100 transition-colors">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm shrink-0 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-blue-900 leading-snug">{benefit}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Eligibility & Documents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white rounded-[40px] p-10 border-2 border-gray-100 shadow-sm">
              <h3 className="text-2xl font-black text-gray-900 mb-6 italic">Eligibility</h3>
              <ul className="space-y-4">
                {scheme.eligibilityCriteria.map((item, i) => (
                  <li key={i} className="flex gap-3 text-gray-500 font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section className="bg-white rounded-[40px] p-10 border-2 border-gray-100 shadow-sm">
              <h3 className="text-2xl font-black text-gray-900 mb-6 italic">Required Docs</h3>
              <ul className="space-y-4">
                {scheme.requiredDocuments.map((item, i) => (
                  <li key={i} className="flex gap-3 text-gray-500 font-medium">
                    <FileCheck className="w-5 h-5 text-gray-300 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* FAQ */}
          {scheme.faq && scheme.faq.length > 0 && (
            <section className="bg-white rounded-[40px] p-10 border-2 border-gray-100 shadow-sm">
              <h2 className="text-3xl font-black text-gray-900 mb-8 italic flex items-center gap-4">
                <HelpCircle className="w-8 h-8 text-purple-500" /> FAQ
              </h2>
              <div className="space-y-6">
                {scheme.faq.map((q, i) => (
                  <div key={i} className="space-y-2">
                    <h4 className="font-black text-gray-900">{q.question}</h4>
                    <p className="text-gray-500 font-medium">{q.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-8">
          {/* Apply Card */}
          <div className="bg-gray-900 rounded-[50px] p-10 text-white sticky top-32 shadow-2xl overflow-hidden relative group">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black italic">Interested?</h3>
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <Layout className="w-6 h-6" />
                </div>
              </div>
              <p className="text-gray-400 font-medium mb-10 leading-relaxed">
                Start your application today. Our AI assistant can help you with eligibility and documents.
              </p>
              
              <div className="space-y-4">
                <Button 
                  onClick={handleApply}
                  disabled={isApplying || success}
                  className={`w-full h-16 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                    success ? 'bg-green-500 text-white' : 'bg-white text-gray-900 hover:scale-105'
                  }`}
                >
                  {isApplying ? 'Processing...' : success ? 'Applied Successfully!' : 'Apply Now'}
                </Button>
                <a 
                  href={scheme.applyUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full h-16 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 border-2 border-white/10 hover:bg-white/5 transition-all"
                >
                  Official Website <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Deadline */}
              {scheme.lastDate && (
                <div className="mt-8 pt-8 border-t border-white/10 text-center">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 italic">Deadline</p>
                  <p className="text-orange-400 font-black text-lg">{new Date(scheme.lastDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-colors" />
          </div>

          {/* Helpline */}
          {scheme.helpline && (
            <div className="bg-white rounded-[40px] p-8 border-2 border-gray-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-500 shadow-inner">
                <Phone className="w-8 h-8" />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Helpline</p>
              <p className="text-2xl font-black text-gray-900 tracking-tighter">{scheme.helpline}</p>
              <p className="text-gray-400 text-xs font-medium mt-2 leading-relaxed">Available 24/7 for farmers assistence.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
