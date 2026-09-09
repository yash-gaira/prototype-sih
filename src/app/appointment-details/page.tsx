"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, Calendar, User, Clock, MapPin, QrCode } from "lucide-react";
import QRCode from "react-qr-code";

export default function AppointmentDetailsScreen() {
  const router = useRouter();
  
  const [appt, setAppt] = useState({
    id: "mock-id-123",
    date: "15 Sep",
    monthYear: "2026",
    time: "11:00 AM",
    doctor: "Dr. R. Verma",
    dept: "Ayurveda"
  });

  useEffect(() => {
    const raw = localStorage.getItem("medikiosk_next_appointment");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setAppt({
          id: parsed.id || "mock-id-123",
          date: parsed.date || "15 Sep",
          monthYear: parsed.monthYear || "2026",
          time: parsed.time || "11:00 AM",
          doctor: parsed.doctor || "Dr. R. Verma",
          dept: parsed.dept || "Ayurveda"
        });
      } catch(e) {}
    }
  }, []);

  return (
    <main className="flex justify-center min-h-screen bg-[#0f4b3e] sm:p-4">
      <div className="w-full max-w-md bg-slate-50 sm:rounded-3xl h-[100dvh] relative shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="px-6 pt-16 md:pt-20 pb-20 bg-[#0f4b3e] flex items-center gap-4 z-10 shrink-0 text-white relative">
          <button onClick={() => router.back()} className="hover:bg-emerald-800 p-2 rounded-full transition-colors -ml-2">
            <ChevronLeft className="w-8 h-8" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Appointment Details</h1>
          </div>
        </header>

        {/* Ticket Card */}
        <div className="flex-1 px-6 relative z-20 -mt-8">
          <div className="bg-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
            {/* Cutouts for ticket effect */}
            <div className="absolute top-1/2 -left-4 w-8 h-8 bg-slate-50 rounded-full -translate-y-1/2" />
            <div className="absolute top-1/2 -right-4 w-8 h-8 bg-slate-50 rounded-full -translate-y-1/2" />
            
            <div className="border-b-2 border-dashed border-slate-200 pb-6 mb-6">
              <div className="flex justify-between items-start mb-6">
                 <div>
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Date</p>
                   <p className="text-2xl font-black text-slate-900">{appt.date} {appt.monthYear && <span className="text-sm font-bold text-slate-500">{appt.monthYear}</span>}</p>
                 </div>
                 <div className="text-right">
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Time</p>
                   <p className="text-2xl font-black text-[#0f4b3e]">{appt.time}</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                   <User className="w-5 h-5 text-slate-400 shrink-0" />
                   <div>
                     <p className="font-bold text-slate-900">{appt.doctor}</p>
                     <p className="text-xs text-slate-500">{appt.dept} Specialist</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <MapPin className="w-5 h-5 text-slate-400" />
                   <div>
                     <p className="font-bold text-slate-900">AYUSH Health Centre</p>
                     <p className="text-xs text-slate-500">Dehradun</p>
                   </div>
                 </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="bg-white p-2 rounded-xl flex items-center justify-center mb-2 shadow-sm border border-slate-100">
                 <QRCode 
                   value={`https://prototype-sih-rho.vercel.app/scan?id=${appt.id}`} 
                   size={130}
                   level="M"
                 />
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-2">Scan at reception</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
