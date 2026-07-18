import React, { useState, useEffect } from 'react';
import { 
  FolderOpen, 
  Upload, 
  File, 
  Trash2, 
  Download, 
  Eye, 
  Plus,
  ShieldCheck,
  FileText,
  CreditCard,
  Image as ImageIcon,
  MoreVertical,
  X,
  Search,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/ui/Button';
import { UserDocument } from '../../types';

export const DocumentManagementPage: React.FC = () => {
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newDoc, setNewDoc] = useState({ name: '', type: 'Aadhaar' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('name', newDoc.name);
    formData.append('type', newDoc.type);

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        setShowUploadModal(false);
        setSelectedFile(null);
        setNewDoc({ name: '', type: 'Aadhaar' });
        fetchDocuments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (id: string) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const docTypes = ['Aadhaar', 'PAN', 'Land Records', 'Income Certificate', 'Caste Certificate', 'Bank Passbook', 'Crop Photos', 'Soil Test Report', 'Other'];

  const getDocIcon = (type: string) => {
    switch (type) {
      case 'Aadhaar':
      case 'PAN': return <CreditCard className="w-6 h-6" />;
      case 'Land Records':
      case 'Income Certificate': return <FileText className="w-6 h-6" />;
      case 'Crop Photos': return <ImageIcon className="w-6 h-6" />;
      default: return <File className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4 italic italic">My Documents</h1>
          <p className="text-gray-500 font-medium text-lg">Securely manage and access all your farming-related documents.</p>
        </div>
        <Button 
          onClick={() => setShowUploadModal(true)}
          className="h-16 px-10 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center gap-3"
        >
          <Plus className="w-5 h-5" /> Upload Document
        </Button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-64 bg-white rounded-[40px] animate-pulse border-2 border-gray-100" />
          ))}
        </div>
      ) : documents.length === 0 ? (
        <div className="bg-white rounded-[60px] p-24 text-center border-2 border-gray-100 shadow-sm">
          <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-gray-200 shadow-inner">
            <FolderOpen className="w-12 h-12" />
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-4 italic">Empty Vault</h3>
          <p className="text-gray-400 font-medium max-w-sm mx-auto mb-10">Upload your ID proofs and land records to speed up your scheme applications.</p>
          <Button onClick={() => setShowUploadModal(true)} className="bg-green-500 text-white px-12 h-16 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-green-100">Upload Now</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {documents.map((doc, i) => (
              <motion.div
                key={doc.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-[40px] p-8 border-2 border-gray-100 shadow-sm hover:shadow-2xl hover:border-green-500 transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shadow-inner group-hover:scale-110 group-hover:text-green-500 transition-all`}>
                    {getDocIcon(doc.type)}
                  </div>
                  <button className="text-gray-300 hover:text-gray-900 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="mb-8">
                  <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1 italic">{doc.type}</p>
                  <h4 className="text-lg font-black text-gray-900 line-clamp-1">{doc.name}</h4>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 h-12 rounded-xl border-gray-100 text-gray-400 hover:text-green-500 hover:border-green-500 transition-all flex items-center justify-center">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="flex-1 h-12 rounded-xl border-gray-100 text-gray-400 hover:text-blue-500 hover:border-blue-500 transition-all flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={() => deleteDocument(doc.id)}
                    variant="outline" 
                    className="flex-1 h-12 rounded-xl border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-500 transition-all flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Security Banner */}
      <div className="bg-green-500 rounded-[40px] p-10 text-white flex items-center justify-between shadow-2xl relative overflow-hidden group">
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-[32px] flex items-center justify-center border border-white/20">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-2xl font-black italic">Bank-Grade Encryption</h3>
            <p className="text-green-100 font-medium">Your documents are stored with multi-layer security and only used for your scheme applications.</p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-110 transition-transform" />
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUploadModal(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-xl rounded-[50px] p-12 shadow-2xl relative z-10 border-2 border-gray-100"
            >
              <button 
                onClick={() => setShowUploadModal(false)}
                className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X className="w-8 h-8" />
              </button>

              <h3 className="text-3xl font-black text-gray-900 mb-8 italic">Upload Document</h3>
              
              <form onSubmit={handleUpload} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Document Type</label>
                  <select 
                    value={newDoc.type}
                    onChange={(e) => setNewDoc({...newDoc, type: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-gray-100 h-16 rounded-2xl px-6 font-bold outline-none focus:border-green-500 transition-all"
                  >
                    {docTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Custom Name</label>
                  <input 
                    type="text" 
                    placeholder="E.g. My Aadhaar 2024"
                    value={newDoc.name}
                    onChange={(e) => setNewDoc({...newDoc, name: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-gray-100 h-16 rounded-2xl px-6 font-bold outline-none focus:border-green-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Select File</label>
                  <div className="relative">
                    <input 
                      type="file" 
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer z-20"
                    />
                    <div className="w-full bg-gray-50 border-2 border-dashed border-gray-200 h-32 rounded-3xl flex flex-col items-center justify-center text-gray-400 group-hover:border-green-500 transition-all">
                      {selectedFile ? (
                        <div className="flex items-center gap-3 text-green-600 font-bold">
                          <CheckCircle2 className="w-6 h-6" /> {selectedFile.name}
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mb-2" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Click or drag to upload</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <Button 
                  disabled={uploading || !selectedFile}
                  className="w-full h-20 bg-gray-900 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {uploading ? 'Uploading Vault...' : 'Save to Secure Vault'}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
