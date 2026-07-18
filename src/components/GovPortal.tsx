import React, { useState, useEffect } from 'react';
import { Landmark, Search, ExternalLink, ChevronRight, CheckCircle, FileText } from 'lucide-react';
import { GovScheme } from '../types';

export default function GovPortal() {
  const [schemes, setSchemes] = useState<GovScheme[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/gov-schemes')
      .then(res => res.json())
      .then(setSchemes);
  }, []);

  const filtered = schemes.filter(s => 
    (s.title || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    (s.description || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Government Portal</h1>
          <p className="text-gray-500">Access exclusive agricultural schemes and subsidies.</p>
        </div>
        <div className="relative">
          <input 
            type="text" placeholder="Search schemes..."
            className="pl-12 pr-6 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm w-full md:w-80 outline-none focus:ring-2 focus:ring-[#2E7D32]"
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {filtered.map((scheme) => (
          <div key={scheme.id} className="bg-white rounded-[32px] p-8 shadow-xl border border-gray-50 hover:shadow-2xl transition-all group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center">
                <Landmark className="w-7 h-7 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{scheme.title}</h3>
                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-wider">Active Scheme</span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-8 leading-relaxed">{scheme.description}</p>
            
            <div className="space-y-4 mb-8">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Eligibility</p>
                  <p className="text-sm text-gray-700">{scheme.eligibilityCriteria?.[0]}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <FileText className="w-5 h-5 text-blue-500 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Benefits</p>
                  <p className="text-sm text-gray-700">{scheme.benefits?.[0]}</p>
                </div>
              </div>
            </div>

            <a 
              href={scheme.applyUrl} target="_blank" rel="noreferrer"
              className="w-full py-4 bg-gray-50 text-gray-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#2E7D32] hover:text-white transition-all group-hover:shadow-lg group-hover:shadow-green-100"
            >
              Apply Online <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
