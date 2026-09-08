"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Sparkles, Activity, FileHeart } from "lucide-react";

export default function AISummaryScreen() {
  const router = useRouter();

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
            <h2 className="text-lg font-bold text-slate-900 mb-2">Your 30-Day Outlook</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Based on your recent triage chats and uploaded lab reports, your overall health vitals are stable. You have a slight recurrence of seasonal viral fever. 
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mt-2 font-bold text-emerald-700">
              Your upcoming Ayurvedic consultation is highly recommended to build immunity.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
              <Activity className="w-6 h-6 text-red-500 mb-2" />
              <p className="text-xs text-slate-500">Risk Factor</p>
              <p className="font-bold text-slate-900">Low</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
              <FileHeart className="w-6 h-6 text-emerald-600 mb-2" />
              <p className="text-xs text-slate-500">Records Analysed</p>
              <p className="font-bold text-slate-900">4 Docs</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
