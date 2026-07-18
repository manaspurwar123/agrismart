import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  Droplets,
  Sprout,
  ShieldCheck,
  Stethoscope,
  Activity,
  Calendar
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { DiseaseReport } from '../types';

export const DiseaseDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [report, setReport] = useState<DiseaseReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const response = await fetch(`/api/disease/${id}`);
      const data = await response.json();
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#2E7D32] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!report) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Report Not Found</h1>
      <Link to="/disease-history">
        <Button>Back to History</Button>
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <Link to="/disease-history" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to History
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" /> Export PDF
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" /> Share
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-8">
          <div className={`h-2 ${
            report.status === 'Healthy' ? 'bg-green-500' : 
            report.severity === 'Critical' ? 'bg-red-600' : 'bg-orange-500'
          }`} />
          
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100 aspect-square">
                  <img src={report.imageUrl} alt="Disease" className="w-full h-full object-cover" />
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-[#2E7D32]" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Accuracy</p>
                      <p className="font-bold">{report.confidenceScore}% Confidence</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Date</p>
                      <p className="font-bold">{new Date(report.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-black uppercase tracking-widest">
                      {report.cropName}
                    </span>
                    {report.status === 'Unhealthy' && (
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                        report.severity === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {report.severity} Severity
                      </span>
                    )}
                  </div>
                  <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">
                    {report.status === 'Healthy' ? 'Healthy Plant' : report.diseaseName}
                  </h1>
                  <p className="text-gray-600 leading-relaxed text-lg italic">
                    "{report.analysis}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Status</p>
                    <p className={`font-bold flex items-center gap-2 ${report.status === 'Healthy' ? 'text-green-600' : 'text-red-600'}`}>
                      {report.status === 'Healthy' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      {report.status}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Risk Level</p>
                    <p className="font-bold">{report.spreadRisk}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-4">Affected Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {report.affectedParts.map((part, i) => (
                      <span key={i} className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium text-gray-700 border border-gray-200">
                        {part}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
          >
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <AlertCircle className="text-orange-500" /> Diagnosis Details
            </h2>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#2E7D32] mb-2 uppercase tracking-widest text-xs">Symptoms</h4>
                <ul className="space-y-2">
                  {report.symptoms.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-600">
                      <span className="text-[#2E7D32] font-bold">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#2E7D32] mb-2 uppercase tracking-widest text-xs">Primary Causes</h4>
                <ul className="space-y-2">
                  {report.causes.map((c, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-600">
                      <span className="text-[#2E7D32] font-bold">•</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
          >
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <Stethoscope className="text-[#2E7D32]" /> Treatment Plan
            </h2>
            <div className="space-y-6">
              <div className="p-5 bg-green-50 rounded-2xl border border-green-100">
                <h4 className="font-bold text-[#2E7D32] mb-2 text-sm">Organic Treatment</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{report.treatment.organic}</p>
              </div>
              <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-blue-700 mb-2 text-sm">Chemical Management</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{report.treatment.chemical}</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-400 mb-2 uppercase tracking-widest text-xs">Recommended Pesticides</h4>
                <div className="flex flex-wrap gap-2">
                  {report.treatment.recommendedPesticides.map((p, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600 border border-gray-200">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
          >
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <ShieldCheck className="text-[#2E7D32]" /> Prevention Strategy
            </h2>
            <div className="space-y-4">
              {[
                { icon: Droplets, title: "Watering", desc: report.prevention.waterManagement },
                { icon: Sprout, title: "Fertilization", desc: report.prevention.fertilizerTips },
                { icon: ShieldCheck, title: "Soil Health", desc: report.prevention.soilHealthTips }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <item.icon className="w-5 h-5 text-[#2E7D32]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-0.5">{item.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#1B5E20] p-8 rounded-3xl shadow-xl text-white"
          >
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <CheckCircle2 /> Recovery Guide
            </h2>
            <ul className="space-y-4">
              {report.recoveryTips.map((tip, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold">
                    {i + 1}
                  </div>
                  <span className="text-white/90 leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
              <div className="flex gap-3 items-center">
                <Info className="w-5 h-5" />
                <p className="text-xs font-medium">Follow this guide for the next 14 days for optimal results.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
