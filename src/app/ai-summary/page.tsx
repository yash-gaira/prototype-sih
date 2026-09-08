"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Sparkles, Activity, FileHeart } from "lucide-react";

export default function AISummaryScreen() {
  const router = useRouter();
  const [summary, setSummary] = useState("");
  const [riskFactor, setRiskFactor] = useState("Low");
  const [docCount, setDocCount] = useState(0);

  useEffect(() => {
    const storedSummary = localStorage.getItem("ai_triage_summary");
    if (storedSummary) {
      setSummary(storedSummary);
      
      const lower = storedSummary.toLowerCase();
      if (lower.includes("blood") || lower.includes("severe") || lower.includes("10/10") || lower.includes("critical") || lower.includes("chest pain") || lower.includes("breathing") || lower.includes("stroke") || lower.includes("emergency")) {
        setRiskFactor("High");
      } else if (lower.includes("moderate") || lower.includes("fever") || lower.includes("dizzy") || lower.includes("pain")) {
        setRiskFactor("Medium");
      }
    }

    const docs = localStorage.getItem("custom_documents");
    if (docs) {
      try {
        setDocCount(JSON.parse(docs).length);
      } catch (e) {}
    }
  }, []);

  return (
    <main className="flex justify-center min-h-screen bg-slate-100 font-sans sm:p-4">
      <div className="w-full max-w-md bg-white sm:rounded-3xl h-[100dvh] relative shadow-2xl flex flex-col overflow-hidden border-x border-slate-200 sm:border-y">
        
        {/* Header */}
        <header className="px-6 pt-10 pb-4 bg-white flex items-center gap-4 z-10 shrink-0 shadow-sm relative">
          <button onClick={() => router.back()}>
            <ChevronLeft className="w-8 h-8 text-slate-800" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">AI Health Summary</h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-3xl border border-blue-100">
            <Sparkles className="w-8 h-8 text-blue-600 mb-4" />
            <h2 className="text-lg font-bold text-slate-900 mb-2">Consultation Summary</h2>
            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
              {summary ? (
                summary
              ) : (
                <div className="text-center py-4">
                  <p className="mb-4">No recent AI consultations found.</p>
                  <button 
                    onClick={() => router.push('/consult')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold"
                  >
                    Start AI Triage
                  </button>
                </div>
              )}
            </div>
            {summary && (
              <p className="text-sm text-slate-600 leading-relaxed mt-4 font-bold text-emerald-700">
                Your upcoming Ayurvedic consultation is highly recommended.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-2xl border ${riskFactor === 'High' ? 'bg-red-50 border-red-100' : riskFactor === 'Medium' ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'}`}>
              <Activity className={`w-6 h-6 mb-2 ${riskFactor === 'High' ? 'text-red-500' : riskFactor === 'Medium' ? 'text-amber-500' : 'text-emerald-500'}`} />
              <p className="text-xs text-slate-500">Risk Factor</p>
              <p className="font-bold text-slate-900">{riskFactor}</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
              <FileHeart className="w-6 h-6 text-emerald-600 mb-2" />
              <p className="text-xs text-slate-500">Records Analysed</p>
              <p className="font-bold text-slate-900">{docCount} {docCount === 1 ? 'Doc' : 'Docs'}</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
