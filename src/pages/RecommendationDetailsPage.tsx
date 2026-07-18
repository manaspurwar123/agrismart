import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ChevronLeft, Leaf, Droplets, FlaskConical, Bug, 
  Calendar, ShoppingCart, Warehouse, Download, Printer,
  FileText, TrendingUp, CheckCircle2, Info
} from 'lucide-react';
import axios from 'axios';
import Markdown from 'react-markdown';
import { CropRecommendation } from '../types';
import { cn } from '../lib/utils';

export default function RecommendationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recommendation, setRecommendation] = useState<CropRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`/api/crop-recommendation/${id}`);
        setRecommendation(response.data);
      } catch (err) {
        console.error('Failed to fetch details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!recommendation) return null;

  const sections = [
    { id: 'guide', title: 'Complete Crop Guide', icon: Leaf, content: recommendation.completeCropGuide },
    { id: 'soil', title: 'Soil Requirement', icon: FlaskConical, content: recommendation.soilRequirement },
    { id: 'fertilizer', title: 'Fertilizer Schedule', icon: TrendingUp, content: recommendation.fertilizerSchedule },
    { id: 'irrigation', title: 'Irrigation Schedule', icon: Droplets, content: recommendation.irrigationSchedule },
    { id: 'pest', title: 'Pest Management', icon: Bug, content: recommendation.pestManagement },
    { id: 'harvest', title: 'Harvest Process', icon: Calendar, content: recommendation.harvestProcess },
    { id: 'market', title: 'Market Price Trend', icon: ShoppingCart, content: recommendation.marketPriceTrend },
    { id: 'storage', title: 'Storage Suggestions', icon: Warehouse, content: recommendation.storageSuggestions },
  ];

  return (
    <div className="min-h-screen bg-emerald-50 pt-20 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-emerald-700 font-bold mb-8 group"
        >
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Results
        </button>

        <div className="bg-white rounded-[40px] shadow-2xl border border-white/40 overflow-hidden mb-12">
          {/* Header Banner */}
          <div className="bg-emerald-900 p-12 text-white relative">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Leaf size={240} />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <span className="inline-block px-4 py-1 bg-emerald-500/20 backdrop-blur border border-emerald-500/30 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                  AI Farming Guide
                </span>
                <h1 className="text-5xl font-black mb-2">{recommendation.recommendedCrop}</h1>
                <p className="text-emerald-100 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  Expertly generated for {recommendation.farmName}
                </p>
              </div>
              <div className="flex gap-4">
                <button className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur rounded-2xl transition-all">
                  <Printer size={24} />
                </button>
                <button className="flex items-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-2xl font-bold transition-all shadow-xl shadow-emerald-900/20">
                  <Download size={24} />
                  Download PDF Report
                </button>
              </div>
            </div>
          </div>

          <div className="p-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Navigation Sidebar */}
              <div className="lg:col-span-1 space-y-2 h-fit sticky top-28">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-3 p-4 rounded-2xl text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all font-medium"
                  >
                    <section.icon size={20} />
                    <span className="text-sm">{section.title}</span>
                  </a>
                ))}
              </div>

              {/* Content Area */}
              <div className="lg:col-span-3 space-y-16">
                {sections.map((section) => (
                  <section key={section.id} id={section.id} className="scroll-mt-28">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <section.icon size={28} />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">{section.title}</h2>
                    </div>
                    <div className="prose prose-emerald max-w-none prose-headings:font-black prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600">
                      <Markdown>{section.content || 'Data coming soon...'}</Markdown>
                    </div>
                    <div className="mt-12 h-px bg-gray-100"></div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Support */}
        <div className="bg-emerald-900 rounded-[32px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
              <Info size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Need help with implementation?</h3>
              <p className="text-emerald-200">Our agricultural experts are available for personalized consultation.</p>
            </div>
          </div>
          <button className="px-8 py-4 bg-white text-emerald-900 rounded-2xl font-black hover:bg-emerald-50 transition-all">
            Consult Expert
          </button>
        </div>
      </div>
    </div>
  );
}

function Loader2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
