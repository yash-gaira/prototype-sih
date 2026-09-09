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
import { listenToDoctorQueue, updateAppointmentStatus, uploadDocumentRecord } from "@/lib/firestoreService";

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
      
      // Inject mock patients to show a busy clinic for the demo
      const mockPatients = [
        { id: 'mock-1', name: 'Ramesh Kumar', time: '09:15 AM', status: 'Completed', color: 'bg-emerald-100 text-emerald-700' },
        { id: 'mock-2', name: 'Sunita Devi', time: '09:45 AM', status: 'Completed', color: 'bg-emerald-100 text-emerald-700' },
        { id: 'mock-3', name: 'Anil Sharma', time: '10:30 AM', status: 'In Progress', color: 'bg-orange-100 text-orange-700' },
        { id: 'mock-4', name: 'Pooja Singh', time: '11:15 AM', status: 'Waiting', color: 'bg-blue-100 text-blue-700' },
        { id: 'mock-5', name: 'Karan Patel', time: '11:40 AM', status: 'Waiting', color: 'bg-blue-100 text-blue-700' },
        { id: 'mock-6', name: 'Vikram Singh', time: '12:00 PM', status: 'Waiting', color: 'bg-blue-100 text-blue-700' },
      ];
      
      const existingNames = new Set(formatted.map(f => f.name));
      const filteredMocks = mockPatients.filter(m => !existingNames.has(m.name));
      
      setQueue([...formatted, ...filteredMocks]);
    });

    return () => unsubscribe();
  }, []);

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // States for FAB (Prescription)
  const [prescPatient, setPrescPatient] = useState("");
  const [prescNote, setPrescNote] = useState("");
  const [prescStatus, setPrescStatus] = useState<"idle" | "saving" | "success">("idle");

  // Close modals on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModal(null);
        setShowNotifications(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
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
            <div className="relative">
              <div
                className="cursor-pointer hover:bg-slate-50 p-2 rounded-full transition-colors"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-7 h-7 text-[#0D5C46]" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
                    {notifications}
                  </span>
                )}
              </div>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute top-12 right-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-slate-800 text-sm">Notifications</h4>
                    {notifications > 0 && (
                      <button
                        onClick={() => {
                          setNotifications(0);
                          setShowNotifications(false);
                        }}
                        className="text-xs text-blue-600 font-bold hover:underline"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  {notifications > 0 ? (
                    <div className="space-y-3">
                      <div className="text-xs bg-slate-50 p-2 rounded-lg text-slate-600 border border-slate-100">
                        <strong className="text-slate-800 block mb-1">New Patient Assigned</strong>
                        Yashdeep Gaira has booked an appointment.
                      </div>
                      <div className="text-xs bg-slate-50 p-2 rounded-lg text-slate-600 border border-slate-100">
                        <strong className="text-slate-800 block mb-1">System Update</strong>
                        Ayush guidelines updated for Q3.
                      </div>
                      <div className="text-xs bg-slate-50 p-2 rounded-lg text-slate-600 border border-slate-100">
                        <strong className="text-slate-800 block mb-1">Lab Reports Ready</strong>
                        3 pending reports have been attached to records.
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-4">No new notifications</p>
                  )}
                </div>
              )}
            </div>
          </header>

          <div className="px-6 md:px-10 flex-1 space-y-8">

            {/* Top Summary Card (Mint Green) */}
            <div
              onClick={() => router.push('/doctor-workspace')}
              className="bg-[#E8F5E9] rounded-3xl p-6 flex items-center justify-between border border-[#E0F2F1] shadow-[0_4px_12px_rgba(0,0,0,0.04)] cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#0D5C46] shadow-sm border border-emerald-50">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0D5C46]">Total Patients Managed</p>
                  <p className="text-2xl font-bold text-[#004D40] tracking-tight">3,150+</p>
                  <p className="text-xs text-emerald-700 font-medium hover:underline">View Patients</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-[#0D5C46]" />
            </div>

            {/* Quick Actions Grid */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-4 gap-3 md:gap-6">
                <button onClick={() => setActiveModal('schedule')} className="flex flex-col items-center gap-2 group">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-slate-100 group-hover:border-blue-200 group-hover:bg-blue-50 transition-colors">
                    <Calendar className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] md:text-xs font-semibold text-slate-600 text-center leading-tight">My<br />Schedule</span>
                </button>
                <button onClick={() => router.push('/doctor-workspace')} className="flex flex-col items-center gap-2 group">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-slate-100 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-colors">
                    <FileText className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] md:text-xs font-semibold text-slate-600 text-center leading-tight">Patient<br />Records</span>
                </button>
                <button onClick={() => setActiveModal('reports')} className="flex flex-col items-center gap-2 group">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-purple-600 shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-slate-100 group-hover:border-purple-200 group-hover:bg-purple-50 transition-colors">
                    <BarChart2 className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] md:text-xs font-semibold text-slate-600 text-center leading-tight">Reports &<br />Analytics</span>
                </button>
                <button onClick={() => setActiveModal('centre')} className="flex flex-col items-center gap-2 group">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-slate-100 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] md:text-xs font-semibold text-slate-600 text-center leading-tight">AYUSH<br />Centre</span>
                </button>
              </div>
            </div>

            {/* Today's Live Queue */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-lg font-bold text-slate-900">Today's Live Queue</h3>
                <span onClick={() => setActiveModal('queue')} className="text-sm font-bold text-blue-600 cursor-pointer hover:underline">View All</span>
              </div>
              <div className="space-y-3">
                {queue.length === 0 ? (
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center text-slate-500 font-medium">
                    No active patients in queue.
                  </div>
                ) : (
                  queue.map((patient) => (
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
                  ))
                )}
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
                  <p className="text-3xl font-black">{queue.length + 24}</p>
                  <p className="text-xs text-emerald-100 font-medium mt-1">Today's Patients</p>
                </div>
                <div className="bg-[#004D40]/40 p-4 rounded-2xl border border-emerald-600/30">
                  <p className="text-3xl font-black">{queue.filter(q => q.status !== 'Completed').length + 8}</p>
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

        {/* Dynamic Action Modals */}
        {activeModal && (
          <div className="absolute inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm md:p-4">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white w-full md:max-w-md rounded-t-3xl md:rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800 capitalize">
                  {activeModal === 'schedule' && "My Schedule"}
                  {activeModal === 'reports' && "Reports & Analytics"}
                  {activeModal === 'centre' && "AYUSH Centre Info"}
                  {activeModal === 'queue' && "Full Patient Queue"}
                  {activeModal === 'fab' && "New Prescription / Note"}
                </h2>
                <button onClick={() => { setActiveModal(null); setPrescStatus("idle"); }} className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 font-bold hover:bg-slate-200">✕</button>
              </div>

              {activeModal === 'queue' && (
                <div className="space-y-4">
                  {queue.length === 0 ? (
                    <p className="text-center text-slate-500 py-8">No patients in queue.</p>
                  ) : (
                    queue.map((patient) => (
                      <div key={patient.id} className="p-4 border border-slate-100 rounded-2xl flex justify-between items-center bg-slate-50">
                        <div>
                          <p className="font-bold text-slate-900">{patient.name}</p>
                          <p className="text-xs text-slate-500">{patient.time}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${patient.color}`}>
                            {patient.status}
                          </span>
                          <button onClick={() => { setActiveModal(null); router.push('/doctor-workspace'); }} className="text-xs font-bold text-blue-600 hover:underline">
                            Workspace
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeModal === 'schedule' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-blue-50 p-4 rounded-2xl border border-blue-100">
                    <button className="text-blue-700 font-bold">&lt;</button>
                    <p className="font-bold text-blue-900">September 2026</p>
                    <button className="text-blue-700 font-bold">&gt;</button>
                  </div>
                  <div className="grid grid-cols-5 gap-2 text-center">
                    {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, i) => (
                      <div key={day} className={`p-2 rounded-xl ${i === 2 ? 'bg-[#0D5C46] text-white shadow-md' : 'bg-slate-50 text-slate-500'}`}>
                        <p className="text-xs font-medium">{day}</p>
                        <p className={`text-lg font-bold ${i === 2 ? 'text-white' : 'text-slate-800'}`}>{14 + i}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3 mt-4">
                    <h4 className="font-bold text-slate-800 text-sm">Upcoming Slots</h4>
                    {['09:00 AM - 4 Patients', '11:00 AM - 2 Patients', '02:00 PM - 5 Patients'].map(slot => (
                      <div key={slot} className="p-3 border border-slate-100 rounded-xl flex items-center gap-3">
                        <Clock className="w-5 h-5 text-[#0D5C46]" />
                        <span className="font-medium text-slate-700 text-sm">{slot}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeModal === 'reports' && (
                <div className="space-y-6">
                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 text-center">
                    <p className="text-sm text-emerald-800 font-medium">Average Wait Time</p>
                    <p className="text-3xl font-black text-emerald-950 mt-1">14 mins</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-3">Status Breakdown</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs font-medium mb-1"><span className="text-slate-600">Completed</span><span className="text-emerald-600">45%</span></div>
                        <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full" style={{ width: '45%' }}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-medium mb-1"><span className="text-slate-600">Waiting</span><span className="text-blue-600">35%</span></div>
                        <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-medium mb-1"><span className="text-slate-600">In Progress</span><span className="text-orange-600">20%</span></div>
                        <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-orange-500 h-2 rounded-full" style={{ width: '20%' }}></div></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeModal === 'centre' && (
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-100">
                    <Building2 className="w-10 h-10 text-orange-600" />
                  </div>
                  <h3 className="font-bold text-xl text-slate-900">Dehradun Main AYUSH</h3>
                  <p className="text-sm text-slate-500 mt-1">Rajpur Road, Uttarakhand</p>
                  <div className="mt-6 p-4 bg-slate-50 rounded-2xl text-left border border-slate-100">
                    <p className="text-xs font-bold text-slate-800 mb-2">Available Departments</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600">Ayurveda</span>
                      <span className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600">Yoga</span>
                      <span className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600">Homeopathy</span>
                    </div>
                  </div>
                </div>
              )}

              {activeModal === 'fab' && (
                <div className="space-y-4">
                  {prescStatus === "success" ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8" />
                      </div>
                      <h3 className="font-bold text-xl text-slate-900">Saved to Records!</h3>
                      <p className="text-sm text-slate-500 mt-2">The prescription has been added to the patient's secure locker.</p>
                      <button onClick={() => { setActiveModal(null); setPrescStatus("idle"); setPrescNote(""); }} className="mt-6 w-full py-3 bg-[#0D5C46] text-white rounded-xl font-bold">
                        Done
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="text-sm font-bold text-slate-700 block mb-1">Select Patient</label>
                        <select 
                          value={prescPatient} 
                          onChange={(e) => setPrescPatient(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:outline-none focus:border-[#0D5C46]"
                        >
                          <option value="">-- Choose from queue --</option>
                          {queue.map(q => <option key={q.id} value={q.name}>{q.name} ({q.time})</option>)}
                          <option value="Guest Patient">Other / Walk-in</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-bold text-slate-700 block mb-1">Clinical Notes / Prescription</label>
                        <textarea 
                          value={prescNote}
                          onChange={(e) => setPrescNote(e.target.value)}
                          placeholder="Rx: Take 1 tablet twice daily..."
                          className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 h-32 resize-none focus:outline-none focus:border-[#0D5C46]"
                        />
                      </div>
                      <button 
                        disabled={!prescPatient || !prescNote || prescStatus === "saving"}
                        onClick={async () => {
                          setPrescStatus("saving");
                          try {
                            await uploadDocumentRecord({
                              title: `Prescription - Dr. Gaira`,
                              date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                              doctor: "Dr. Yashdeep Gaira",
                              centre: "AYUSH OPD",
                              type: "Prescription",
                              size: "12 KB",
                              notes: prescNote
                            });
                            setPrescStatus("success");
                          } catch(e) {
                            console.error(e);
                            setPrescStatus("idle");
                            alert("Failed to save.");
                          }
                        }}
                        className="w-full py-3.5 bg-[#2563EB] text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                      >
                        {prescStatus === "saving" ? (
                           <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : "Save to Digital Locker"}
                      </button>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-slate-200 pb-safe md:hidden z-40">
          <div className="flex justify-around items-center px-2 py-3">
            <button className="flex flex-col items-center gap-1 p-2 w-16 text-[#0D5C46]">
              <Home className="w-6 h-6" />
              <span className="text-[10px] font-semibold">Dashboard</span>
            </button>
            <button onClick={() => setActiveModal('queue')} className="flex flex-col items-center gap-1 p-2 w-16 text-slate-400 hover:text-slate-600 transition-colors">
              <Users className="w-6 h-6" />
              <span className="text-[10px] font-semibold">Patients</span>
            </button>
            <div className="w-16" /> {/* Spacer for FAB */}
            <button onClick={() => router.push('/doctor-workspace')} className="flex flex-col items-center gap-1 p-2 w-16 text-slate-400 hover:text-slate-600 transition-colors">
              <BrainCircuit className="w-6 h-6" />
              <span className="text-[10px] font-semibold">Clinical AI</span>
            </button>
            <button onClick={() => setActiveModal('reports')} className="flex flex-col items-center gap-1 p-2 w-16 text-slate-400 hover:text-slate-600 transition-colors">
              <MoreHorizontal className="w-6 h-6" />
              <span className="text-[10px] font-semibold">More</span>
            </button>
          </div>
        </div>

        {/* FAB (Electric Blue) */}
        <button
          onClick={() => setActiveModal('fab')}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-[#2563EB] text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95 transition-all z-50 group md:hidden border-2 border-white"
        >
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        </button>

      </div>
    </main>
  );
}
