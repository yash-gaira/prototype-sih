"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Calendar, User, Clock, FileText, CheckCircle2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function HistoryScreen() {
  const router = useRouter();

  return (
    <main className="flex justify-center min-h-screen bg-slate-100 font-sans sm:p-4 md:p-8">
      <div className="w-full max-w-md md:max-w-6xl md:w-full bg-white sm:rounded-3xl relative shadow-2xl overflow-hidden border-x border-slate-200 sm:border-y flex flex-col md:flex-row min-h-[100dvh] md:min-h-[800px]">
        
        {/* Desktop Sidebar */}
        <Sidebar />

        <div className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden">
          {/* Header */}
          <header className="px-6 md:px-10 pt-10 pb-4 bg-white flex items-center gap-4 z-10 shrink-0 shadow-sm relative border-b border-slate-100">
            <button onClick={() => router.back()} className="md:hidden">
              <ChevronLeft className="w-8 h-8 text-slate-800" />
            </button>
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-slate-900 tracking-tight">History & Visits</h1>
              <p className="text-sm text-slate-500 font-medium mt-1">Your past appointments and checkups</p>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-6 md:px-10 py-6 md:py-10">
            <div className="max-w-2xl">
              <div className="relative border-l-2 border-emerald-100 ml-4 pl-6 md:pl-10 pb-8 md:pb-12">
                <div className="absolute w-5 h-5 bg-emerald-500 rounded-full -left-[11px] top-0 border-4 border-white shadow-sm" />
                <h3 className="font-bold text-lg md:text-xl text-slate-900">Upcoming: Ayurveda Consultation</h3>
                <p className="text-sm md:text-base text-emerald-600 font-semibold mt-1">15 Sep 2026 • 11:00 AM</p>
                <p className="text-sm md:text-base text-slate-500 mt-2">Dr. R. Verma • AYUSH Health Centre</p>
                <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 inline-block">
                   <p className="text-sm font-medium text-emerald-800">Please carry your previous medical reports.</p>
                </div>
              </div>

              <div className="relative border-l-2 border-slate-200 ml-4 pl-6 md:pl-10 pb-8 md:pb-12 opacity-80 hover:opacity-100 transition-opacity">
                <div className="absolute w-5 h-5 bg-slate-300 rounded-full -left-[11px] top-0 border-4 border-white shadow-sm" />
                <h3 className="font-bold text-lg md:text-xl text-slate-900">Completed: Blood Test</h3>
                <p className="text-sm md:text-base text-slate-500 font-semibold mt-1">28 Aug 2026</p>
                <p className="text-sm md:text-base text-slate-500 mt-2">City Diagnostic Centre</p>
              </div>

              <div className="relative border-l-2 border-transparent ml-4 pl-6 md:pl-10 pb-6 opacity-80 hover:opacity-100 transition-opacity">
                <div className="absolute w-5 h-5 bg-slate-300 rounded-full -left-[11px] top-0 border-4 border-white shadow-sm" />
                <h3 className="font-bold text-lg md:text-xl text-slate-900">Completed: General Checkup</h3>
                <p className="text-sm md:text-base text-slate-500 font-semibold mt-1">14 Jul 2026</p>
                <p className="text-sm md:text-base text-slate-500 mt-2">Dr. S. Mehta • Apollo Clinic</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
