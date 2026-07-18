import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Barcode from 'react-barcode';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, ScanLine, Download, Printer, Plus, Tag } from 'lucide-react';

interface CodeData {
  id: string;
  type: 'QR' | 'Barcode';
  value: string;
  label: string;
  category: string;
  createdAt: string;
}

export function QRBarcodeSystem() {
  const [codes, setCodes] = useState<CodeData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({ type: 'QR', value: '', label: '', category: 'Asset' });

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      const resQR = await fetch('/api/qr');
      const dataQR = await resQR.json();
      const resBar = await fetch('/api/barcode');
      const dataBar = await resBar.json();
      
      const allCodes = [...dataQR.map((item: any) => ({...item, type: 'QR'})), ...dataBar.map((item: any) => ({...item, type: 'Barcode'}))];
      allCodes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setCodes(allCodes);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = formData.type === 'QR' ? '/api/qr/generate' : '/api/barcode/generate';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsGenerating(false);
        setFormData({ type: 'QR', value: '', label: '', category: 'Asset' });
        fetchCodes();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = (id: string, type: string) => {
    const svg = document.getElementById(`code-${id}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
         ctx.fillStyle = "white";
         ctx.fillRect(0, 0, canvas.width, canvas.height);
         ctx.drawImage(img, 0, 0);
      }
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${type}-${id}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handlePrint = (id: string) => {
    const svg = document.getElementById(`code-${id}`);
    if (!svg) return;
    const printWindow = window.open('', '', 'width=600,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Print Code</title></head>
          <body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
            ${svg.outerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 250);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">QR & Barcode System</h1>
          <p className="text-gray-500 font-medium">Generate and manage codes for assets and inventory.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white text-gray-700 font-bold rounded-2xl hover:bg-gray-50 border border-gray-200 transition-all flex items-center gap-2">
            <ScanLine className="w-5 h-5" />
            Scan Code
          </button>
          <button 
            onClick={() => setIsGenerating(true)}
            className="px-6 py-3 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Generate New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {codes.map((code) => (
          <motion.div
            key={code.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col items-center group relative overflow-hidden"
          >
            <div className="absolute top-4 left-4">
              <span className="px-2 py-1 bg-gray-100 text-xs font-bold text-gray-500 rounded-lg">{code.category}</span>
            </div>
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleDownload(code.id, code.type)} className="p-2 bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 rounded-xl transition-colors"><Download className="w-4 h-4" /></button>
              <button onClick={() => handlePrint(code.id)} className="p-2 bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600 rounded-xl transition-colors"><Printer className="w-4 h-4" /></button>
            </div>
            
            <div className="mt-8 mb-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-50 w-full flex justify-center">
              {code.type === 'QR' ? (
                <QRCodeSVG id={`code-${code.id}`} value={code.value} size={150} level="H" includeMargin={true} />
              ) : (
                <Barcode value={code.value} width={1.5} height={60} fontSize={14} /> // Note: Barcode uses canvas by default, might need adjustment for SVG export in handleDownload
              )}
            </div>
            
            <h3 className="font-bold text-gray-900 text-center mb-1">{code.label}</h3>
            <p className="text-sm font-mono text-gray-500 text-center break-all">{code.value}</p>
          </motion.div>
        ))}
        {codes.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <QrCode className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No codes generated yet.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isGenerating && (
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Tag className="w-6 h-6 text-green-600" />
                Generate Code
              </h2>
              <form onSubmit={handleGenerate} className="space-y-4">
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button type="button" onClick={() => setFormData({...formData, type: 'QR'})} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.type === 'QR' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>QR Code</button>
                  <button type="button" onClick={() => setFormData({...formData, type: 'Barcode'})} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.type === 'Barcode' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>Barcode</button>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-green-500 focus:bg-white transition-all outline-none">
                    <option>Asset</option>
                    <option>Product</option>
                    <option>Inventory</option>
                    <option>Location</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Label / Name</label>
                  <input required type="text" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-green-500 focus:bg-white transition-all outline-none" placeholder="e.g. Tractor 01" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Data Value</label>
                  <input required type="text" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-green-500 focus:bg-white transition-all outline-none font-mono text-sm" placeholder={formData.type === 'QR' ? "URL, JSON, or Text" : "Numeric or Alphanumeric"} />
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsGenerating(false)} className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-all">Generate</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
