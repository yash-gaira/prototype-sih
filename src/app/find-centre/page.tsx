"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, MapPin, Navigation } from "lucide-react";

export default function FindCentreScreen() {
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
            <h1 className="text-xl font-bold text-slate-900">Find AYUSH Centre</h1>
          </div>
        </header>

        {/* Map Placeholder */}
        <div className="flex-1 bg-blue-50 relative">
          <div className="absolute inset-0 bg-slate-200 bg-cover bg-center opacity-60 flex items-center justify-center">
             <span className="text-slate-400 font-bold uppercase tracking-widest">Interactive Map</span>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-bounce shadow-xl border-2 border-white">
               <MapPin className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* List Bottom Sheet */}
        <div className="h-1/2 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] absolute bottom-0 left-0 right-0 p-6 overflow-y-auto">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
          <h2 className="text-xl font-bold text-slate-900 mb-4">Nearby Centres</h2>
          
          <div className="space-y-4">
            <div className="border border-emerald-100 bg-emerald-50/30 rounded-2xl p-4 flex gap-4">
               <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
                 <span className="font-bold text-lg">A</span>
               </div>
               <div className="flex-1">
                 <h3 className="font-bold text-slate-900">AYUSH Health Centre</h3>
                 <p className="text-xs text-slate-500 mt-1">Dehradun City • 2.5 km away</p>
               </div>
               <button className="w-10 h-10 bg-[#0f4b3e] text-white rounded-full flex items-center justify-center shrink-0 shadow-lg">
                 <Navigation className="w-4 h-4" />
               </button>
            </div>
            
            <div className="border border-slate-200 rounded-2xl p-4 flex gap-4">
               <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center shrink-0">
                 <span className="font-bold text-lg">H</span>
               </div>
               <div className="flex-1">
                 <h3 className="font-bold text-slate-900">National Homeopathy Clinic</h3>
                 <p className="text-xs text-slate-500 mt-1">Rajpur Road • 4.1 km away</p>
               </div>
               <button className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center shrink-0">
                 <Navigation className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
