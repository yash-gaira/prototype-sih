"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Bell, 
  Users, 
  Calendar, 
  FileText, 
  BarChart2, 
  Building2,
  Clock,
  ChevronRight,
  Home,
  BrainCircuit,
  MoreHorizontal,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";
import { listenToDoctorQueue, updateAppointmentStatus } from "@/lib/firestoreService";

export default function DoctorDashboardScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(3);

  const [queue, setQueue] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = listenToDoctorQueue((appts) => {
      // Map firebase fields to UI format
      const formatted = appts.map(appt => {
        let color = "bg-slate-100 text-slate-700";
        if (appt.status === "Waiting") color = "bg-blue-100 text-blue-700";
        if (appt.status === "In Progress") color = "bg-orange-100 text-orange-700";
        if (appt.status === "Completed") color = "bg-emerald-100 text-emerald-700";

        return {
          id: appt.id,
          name: appt.patientName || "Unknown",
          time: appt.time,
          status: appt.status,
          color
        };
      });
      setQueue(formatted);
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="flex justify-center min-h-screen bg-slate-100 font-sans sm:p-4 md:p-8">
      <div className="w-full max-w-md md:max-w-6xl md:w-full bg-[#F8F9FA] sm:rounded-3xl relative shadow-2xl overflow-hidden border-x border-slate-200 sm:border-y flex flex-col md:flex-row min-h-[100dvh] md:min-h-[800px]">
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-y-auto pb-24 relative">
          
          {/* Header */}
          <header className="px-6 md:px-10 pt-10 pb-4 flex justify-between items-start">
            <div>
              <p className="text-sm md:text-base text-slate-500 font-medium">Good morning,</p>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">Dr. Yashdeep Gaira</h1>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5">Ayurveda Specialist, AYUSH</p>
            </div>
            <div className="relative cursor-pointer hover:bg-slate-50 p-2 rounded-full transition-colors">
              <Bell className="w-7 h-7 text-[#0D5C46]" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
                  {notifications}
                </span>
              )}
            </div>
          </header>

          <div className="px-6 md:px-10 flex-1 space-y-8">
            
            {/* Top Summary Card (Mint Green) */}
            <div className="bg-[#E8F5E9] rounded-3xl p-6 flex items-center justify-between border border-[#E0F2F1] shadow-[0_4px_12px_rgba(0,0,0,0.04)] cursor-pointer hover:scale-[1.02] transition-transform">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#0D5C46] shadow-sm border border-emerald-50">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0D5C46]">Total Patients Managed</p>
                  <p className="text-2xl font-bold text-[#004D40] tracking-tight">3,150+</p>
                  <p className="text-xs text-emerald-700 font-medium">View Patients</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-[#0D5C46]" />
            </div>

            {/* Quick Actions Grid */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-4 gap-3 md:gap-6">
                <button className="flex flex-col items-center gap-2 group">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-slate-100 group-hover:border-blue-200 group-hover:bg-blue-50 transition-colors">
                    <Calendar className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] md:text-xs font-semibold text-slate-600 text-center leading-tight">My<br/>Schedule</span>
                </button>
                <button className="flex flex-col items-center gap-2 group">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-slate-100 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-colors">
                    <FileText className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] md:text-xs font-semibold text-slate-600 text-center leading-tight">Patient<br/>Records</span>
                </button>
                <button className="flex flex-col items-center gap-2 group">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-purple-600 shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-slate-100 group-hover:border-purple-200 group-hover:bg-purple-50 transition-colors">
                    <BarChart2 className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] md:text-xs font-semibold text-slate-600 text-center leading-tight">Reports &<br/>Analytics</span>
                </button>
                <button className="flex flex-col items-center gap-2 group">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-slate-100 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] md:text-xs font-semibold text-slate-600 text-center leading-tight">AYUSH<br/>Centre</span>
                </button>
              </div>
            </div>

            {/* Today's Live Queue */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-lg font-bold text-slate-900">Today's Live Queue</h3>
                <span className="text-sm font-bold text-blue-600 cursor-pointer">View All</span>
              </div>
              <div className="space-y-3">
                {queue.map((patient) => (
                  <div key={patient.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-lg">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{patient.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span className="text-xs font-medium text-slate-500">{patient.time}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${patient.color}`}>
                            {patient.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select 
                        value={patient.status}
                        onChange={(e) => updateAppointmentStatus(patient.id, e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg p-1.5 outline-none bg-slate-50 cursor-pointer"
                      >
                        <option value="Waiting">Waiting</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <button 
                        onClick={() => router.push('/doctor-workspace')}
                        className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-colors border border-slate-200"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Statistics Card (Deep Forest Green) */}
            <div className="bg-[#0D5C46] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#004D40] rounded-full opacity-50" />
              <h3 className="text-lg font-bold mb-6 relative z-10 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-emerald-200" /> Daily Metrics
              </h3>
              
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="bg-[#004D40]/40 p-4 rounded-2xl border border-emerald-600/30">
                  <p className="text-3xl font-black">24</p>
                  <p className="text-xs text-emerald-100 font-medium mt-1">Today's Patients</p>
                </div>
                <div className="bg-[#004D40]/40 p-4 rounded-2xl border border-emerald-600/30">
                  <p className="text-3xl font-black">8</p>
                  <p className="text-xs text-emerald-100 font-medium mt-1">Pending Consults</p>
                </div>
                <div className="col-span-2 bg-[#004D40]/40 p-4 rounded-2xl border border-emerald-600/30 flex justify-between items-center">
                  <div>
                    <p className="text-xl font-black">94%</p>
                    <p className="text-xs text-emerald-100 font-medium mt-1">Performance Overview</p>
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-emerald-400 border-t-transparent flex items-center justify-center rotate-45">
                    <span className="-rotate-45 text-xs font-bold">+2%</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-slate-200 pb-safe md:hidden z-40">
          <div className="flex justify-around items-center px-2 py-3">
            <button className="flex flex-col items-center gap-1 p-2 w-16 text-[#0D5C46]">
              <Home className="w-6 h-6" />
              <span className="text-[10px] font-semibold">Dashboard</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-2 w-16 text-slate-400 hover:text-slate-600 transition-colors">
              <Users className="w-6 h-6" />
              <span className="text-[10px] font-semibold">Patients</span>
            </button>
            <div className="w-16" /> {/* Spacer for FAB */}
            <button className="flex flex-col items-center gap-1 p-2 w-16 text-slate-400 hover:text-slate-600 transition-colors">
              <BrainCircuit className="w-6 h-6" />
              <span className="text-[10px] font-semibold">Clinical AI</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-2 w-16 text-slate-400 hover:text-slate-600 transition-colors">
              <MoreHorizontal className="w-6 h-6" />
              <span className="text-[10px] font-semibold">More</span>
            </button>
          </div>
        </div>

        {/* FAB (Electric Blue) */}
        <button className="absolute bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-[#2563EB] text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95 transition-all z-50 group md:hidden border-2 border-white">
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        </button>

      </div>
    </main>
  );
}
