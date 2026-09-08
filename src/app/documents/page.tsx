"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Search, 
  SlidersHorizontal, 
  MoreVertical, 
  FileText, 
  FlaskConical, 
  Download, 
  Share2, 
  Maximize2 
} from "lucide-react";

type DocumentType = {
  id: string;
  title: string;
  date: string;
  doctor: string;
  centre: string;
  type: "Prescription" | "Lab Report";
  size: string;
};

const DUMMY_DOCS: DocumentType[] = [
  { id: "1", title: "Prescription - Fever", date: "12 Sep 2026", doctor: "Dr. R. Verma", centre: "AYUSH Health Centre, Dehradun", type: "Prescription", size: "2.4 MB" },
  { id: "2", title: "Blood Test Report", date: "28 Aug 2026", doctor: "City Diagnostic Centre", centre: "AYUSH Health Centre, Dehradun", type: "Lab Report", size: "1.2 MB" },
  { id: "3", title: "Prescription - BP", date: "14 Jul 2026", doctor: "Dr. S. Mehta", centre: "Apollo Clinic", type: "Prescription", size: "1.8 MB" },
  { id: "4", title: "Liver Function Test", date: "02 May 2026", doctor: "Apollo Diagnostics", centre: "Apollo Clinic", type: "Lab Report", size: "3.1 MB" },
  { id: "5", title: "Prescription - Cold", date: "10 Feb 2026", doctor: "Dr. A. Sharma", centre: "City Hospital", type: "Prescription", size: "1.5 MB" },
];

export default function DocumentsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"All" | "Prescription" | "Lab Report">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<DocumentType | null>(null);
  const [showOptionsFor, setShowOptionsFor] = useState<DocumentType | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [allDocs, setAllDocs] = useState<DocumentType[]>(DUMMY_DOCS);

  React.useEffect(() => {
    const existingStr = localStorage.getItem("custom_documents");
    if (existingStr) {
      try {
        const customDocs = JSON.parse(existingStr);
        setAllDocs([...customDocs, ...DUMMY_DOCS]);
      } catch (e) {}
    }
  }, []);

  const handleAction = (action: string) => {
    if (action === 'download') setToastMsg("Downloading document...");
    if (action === 'share') setToastMsg("Opening share dialog...");
    if (action === 'fullscreen') setToastMsg("Opening full screen view...");
    setShowOptionsFor(null);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredDocs = allDocs.filter(doc => {
    const matchesTab = activeTab === "All" || doc.type === activeTab;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const renderListView = () => (
    <div className="flex flex-col h-full bg-white pb-6">
      {/* Header */}
      <header className="px-6 pt-10 pb-4">
        <button onClick={() => router.push("/dashboard")} className="mb-4">
          <ChevronLeft className="w-8 h-8 text-slate-800" />
        </button>
        <h1 className="text-3xl font-bold text-slate-900">Documents</h1>
        <p className="text-sm text-slate-500 mt-1">All your health documents in one place</p>
      </header>

      {/* Search Bar */}
      <div className="px-6 mb-6 flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search documents..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#0f4b3e] focus:ring-1 focus:ring-[#0f4b3e]"
          />
        </div>
        <button className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
          <SlidersHorizontal className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Tabs */}
      <div className="px-6 mb-6 flex gap-3 overflow-x-auto hide-scrollbar">
        {["All", "Prescription", "Lab Report"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab 
                ? "bg-[#0f4b3e] text-white" 
                : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto px-6 space-y-4">
        {filteredDocs.map((doc) => (
          <div 
            key={doc.id} 
            onClick={() => setSelectedDoc(doc)}
            className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-3xl shadow-sm cursor-pointer hover:border-[#0f4b3e] transition-colors"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${doc.type === 'Prescription' ? 'bg-red-50' : 'bg-blue-50'}`}>
              {doc.type === 'Prescription' ? (
                <FileText className="w-6 h-6 text-red-500" />
              ) : (
                <FlaskConical className="w-6 h-6 text-blue-500" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-slate-900 truncate">{doc.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{doc.date}</p>
              <p className="text-xs text-slate-400 mt-0.5 truncate">{doc.doctor}</p>
            </div>
            
            <button 
              onClick={(e) => { e.stopPropagation(); setShowOptionsFor(doc); }}
              className="p-2 text-slate-400 hover:text-slate-600"
            >
              <MoreVertical className="w-6 h-6" />
            </button>
          </div>
        ))}
        {filteredDocs.length === 0 && (
          <p className="text-center text-slate-500 mt-10">No documents found.</p>
        )}
      </div>
    </div>
  );

  const renderDetailView = () => {
    if (!selectedDoc) return null;
    return (
      <div className="flex flex-col h-full bg-slate-50">
        {/* Header */}
        <header className="px-6 pt-10 pb-4 bg-white flex items-center gap-4 shadow-sm z-10 relative">
          <button onClick={() => setSelectedDoc(null)}>
            <ChevronLeft className="w-8 h-8 text-slate-800" />
          </button>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${selectedDoc.type === 'Prescription' ? 'bg-red-50' : 'bg-blue-50'}`}>
               {selectedDoc.type === 'Prescription' ? (
                <FileText className="w-5 h-5 text-red-500" />
              ) : (
                <FlaskConical className="w-5 h-5 text-blue-500" />
              )}
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-slate-900 truncate">{selectedDoc.title}</h1>
              <p className="text-xs text-slate-500">{selectedDoc.date} • {selectedDoc.size}</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6 pb-28">
          
          {/* Metadata */}
          <div className="bg-emerald-50 rounded-2xl p-5 mb-6 space-y-4 border border-emerald-100">
             <div className="flex gap-3">
               <FileText className="w-5 h-5 text-[#0f4b3e] mt-0.5 shrink-0" />
               <div>
                 <p className="text-xs text-[#0f4b3e] opacity-80">Document Type</p>
                 <p className="text-sm font-bold text-[#0f4b3e]">{selectedDoc.type}</p>
               </div>
             </div>
             <div className="flex gap-3">
               <Calendar className="w-5 h-5 text-[#0f4b3e] mt-0.5 shrink-0" />
               <div>
                 <p className="text-xs text-[#0f4b3e] opacity-80">Date</p>
                 <p className="text-sm font-bold text-[#0f4b3e]">{selectedDoc.date}</p>
               </div>
             </div>
             <div className="flex gap-3">
               <MoreVertical className="w-5 h-5 text-[#0f4b3e] mt-0.5 shrink-0" />
               <div>
                 <p className="text-xs text-[#0f4b3e] opacity-80">Doctor</p>
                 <p className="text-sm font-bold text-[#0f4b3e]">{selectedDoc.doctor}</p>
               </div>
             </div>
          </div>

          {/* Document Preview Mockup */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 relative aspect-[1/1.4] w-full max-w-sm mx-auto">
            <div className="border-b border-slate-200 pb-4 mb-4 flex justify-between items-start">
               <div>
                 <h2 className="font-bold text-sm text-slate-800">AYUSH Health Centre</h2>
                 <p className="text-[8px] text-slate-500">Government of Uttarakhand</p>
               </div>
               <span className="font-bold text-xs uppercase tracking-widest text-slate-400">Prescription</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex"><span className="w-24 text-slate-500">Patient Name</span> <span className="font-medium">: Naman Mahra</span></div>
              <div className="flex"><span className="w-24 text-slate-500">Age / Gender</span> <span className="font-medium">: 21 / Male</span></div>
              <div className="flex"><span className="w-24 text-slate-500">Date</span> <span className="font-medium">: {selectedDoc.date}</span></div>
              <div className="flex"><span className="w-24 text-slate-500">Diagnosis</span> <span className="font-medium">: Viral Fever</span></div>
              <div className="flex mt-4 pt-4"><span className="w-24 text-slate-500">Advice</span> <span className="font-medium flex-1">: Rest, Hydration, Paracetamol 650mg SOS, Follow up if not better.</span></div>
            </div>
            <div className="absolute bottom-6 right-6 text-right">
              <div className="w-16 h-8 border-b border-slate-400 mx-auto mb-1 flex items-end justify-center">
                <span className="font-cursive text-sm text-slate-700 signature-font">Dr. Verma</span>
              </div>
              <p className="text-[8px] font-bold text-slate-800">Dr. R. Verma</p>
              <p className="text-[7px] text-slate-500">BAMS, MD (Ayurveda)</p>
            </div>
          </div>
          
          <div className="flex justify-center items-center gap-4 mt-6 text-slate-400 text-xs font-semibold">
            <ChevronLeft className="w-4 h-4" />
            <span>1 / 1</span>
            <ChevronLeft className="w-4 h-4 rotate-180" />
          </div>

        </div>

        {/* Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-200 flex gap-4 z-10 rounded-t-3xl">
          <button 
            onClick={() => handleAction('download')}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-[#0f4b3e] text-[#0f4b3e] rounded-xl font-bold hover:bg-emerald-50 transition-colors"
          >
            <Download className="w-5 h-5" /> Download
          </button>
          <button 
            onClick={() => handleAction('share')}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#0f4b3e] text-white rounded-xl font-bold shadow-lg hover:bg-emerald-800 transition-colors"
          >
            <Share2 className="w-5 h-5" /> Share
          </button>
        </div>
      </div>
    );
  };

  return (
    <main className="flex justify-center min-h-screen bg-slate-100 font-sans sm:p-4">
      <div className="w-full max-w-md bg-white sm:rounded-3xl h-full relative shadow-2xl overflow-hidden border-x border-slate-200 sm:border-y">
        
        {/* Main View Toggle */}
        <AnimatePresence mode="wait">
          {selectedDoc ? (
            <motion.div 
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute inset-0 z-10 bg-white"
            >
              {renderDetailView()}
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute inset-0"
            >
              {renderListView()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Sheet Backdrop */}
        <AnimatePresence>
          {showOptionsFor && (
            <motion.div 
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOptionsFor(null)}
              className="absolute inset-0 bg-slate-900/40 z-40"
            />
          )}
          {showOptionsFor && (
            <motion.div 
              key="sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6 flex flex-col gap-2 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />
              
              <button onClick={() => handleAction('download')} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors font-bold text-slate-800 w-full text-left">
                <Download className="w-6 h-6 text-[#0f4b3e]" />
                Download
              </button>
              <button onClick={() => handleAction('share')} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors font-bold text-slate-800 w-full text-left">
                <Share2 className="w-6 h-6 text-[#0f4b3e]" />
                Share
              </button>
              <button onClick={() => handleAction('fullscreen')} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors font-bold text-slate-800 w-full text-left">
                <Maximize2 className="w-6 h-6 text-[#0f4b3e]" />
                View Full Screen
              </button>
              
              <button 
                onClick={() => setShowOptionsFor(null)}
                className="mt-4 p-4 font-bold text-slate-500 bg-slate-50 rounded-2xl w-full text-center hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast Notification */}
        <AnimatePresence>
          {toastMsg && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 50, x: "-50%" }}
              className="absolute bottom-6 left-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-lg z-50 whitespace-nowrap font-medium"
            >
              {toastMsg}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
