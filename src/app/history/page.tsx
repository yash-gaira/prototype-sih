"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Calendar, User, Clock, FileText, CheckCircle2 } from "lucide-react";

export default function HistoryScreen() {
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
            <h1 className="text-xl font-bold text-slate-900">History & Visits</h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div className="relative border-l-2 border-emerald-100 ml-4 pl-6 pb-6">
            <div className="absolute w-4 h-4 bg-emerald-500 rounded-full -left-[9px] top-0 border-2 border-white shadow-sm" />
            <h3 className="font-bold text-slate-900">Upcoming: Ayurveda Consultation</h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1">15 Sep 2026 • 11:00 AM</p>
            <p className="text-xs text-slate-500 mt-1">Dr. R. Verma • AYUSH Health Centre</p>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-4 pl-6 pb-6 opacity-70">
            <div className="absolute w-4 h-4 bg-slate-300 rounded-full -left-[9px] top-0 border-2 border-white shadow-sm" />
            <h3 className="font-bold text-slate-900">Completed: Blood Test</h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">28 Aug 2026</p>
            <p className="text-xs text-slate-500 mt-1">City Diagnostic Centre</p>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-4 pl-6 pb-6 opacity-70">
            <div className="absolute w-4 h-4 bg-slate-300 rounded-full -left-[9px] top-0 border-2 border-white shadow-sm" />
            <h3 className="font-bold text-slate-900">Completed: General Checkup</h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">14 Jul 2026</p>
            <p className="text-xs text-slate-500 mt-1">Dr. S. Mehta • Apollo Clinic</p>
          </div>
        </div>

      </div>
    </main>
  );
}
