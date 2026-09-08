"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Stethoscope, Activity, FileText, History, Clock } from "lucide-react";

export default function DoctorDashboard() {
  const router = useRouter();
  const [isAyushMode, setIsAyushMode] = useState(false);
  const [criticalReason, setCriticalReason] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem("medikiosk_critical_alert") === "true") {
      setCriticalReason(localStorage.getItem("medikiosk_critical_reason"));
    }
  }, []);

  const clearCriticalAlert = () => {
    localStorage.removeItem("medikiosk_critical_alert");
    localStorage.removeItem("medikiosk_critical_reason");
    setCriticalReason(null);
  };

  return (
    <main className="flex-1 min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Critical Triage Alert Banner */}
        {criticalReason && (
          <div className="bg-red-600 text-white p-6 rounded-3xl shadow-lg border-4 border-red-700 flex items-center justify-between mb-8 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-4">
              <Activity className="w-10 h-10 animate-pulse" />
              <div>
                <h2 className="text-2xl font-bold uppercase tracking-wide">High Priority Triage Alert</h2>
                <p className="text-xl mt-1 font-medium">AI detected a severe symptom: <span className="font-bold underline">"{criticalReason}"</span></p>
              </div>
            </div>
            <Button variant="outline" size="lg" onClick={clearCriticalAlert} className="text-red-700 border-red-200 hover:bg-red-50 font-bold bg-white">
              Acknowledge
            </Button>
          </div>
        )}

        {/* Header */}
        <header className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="default" onClick={() => router.push("/consult")} className="h-12 w-12 p-0 rounded-full">
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Stethoscope className="w-8 h-8 text-blue-600" />
              Doctor Dashboard
            </h1>
          </div>

          {/* Allopathic / AYUSH Toggle */}
          <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setIsAyushMode(false)}
              className={`px-6 py-3 rounded-xl text-lg font-medium transition-all ${
                !isAyushMode ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Allopathic
            </button>
            <button
              onClick={() => setIsAyushMode(true)}
              className={`px-6 py-3 rounded-xl text-lg font-medium transition-all ${
                isAyushMode ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              AYUSH Mode
            </button>
          </div>
        </header>

        {/* Patient Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Clinical Info */}
          <div className="md:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-3 mb-6">
                <Activity className="w-6 h-6 text-red-500" />
                Chief Complaint & HPI
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 text-red-900 rounded-2xl border border-red-100">
                  <span className="font-bold uppercase tracking-wide text-sm text-red-700 mb-1 block">Primary Issue</span>
                  <p className="text-xl">Severe Chest Pain radiating to left arm.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 text-lg leading-relaxed">
                  <strong>History of Present Illness:</strong> Patient reports crushing chest pain that started 45 minutes ago while resting. Pain is 8/10 in severity. Associated with shortness of breath and diaphoresis. No relief with sublingual nitroglycerin (if taken).
                </div>
              </div>
            </section>

            {isAyushMode ? (
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 border-l-4 border-l-emerald-500">
                <h2 className="text-2xl font-semibold text-emerald-800 flex items-center gap-3 mb-6">
                  Ayurvedic Assessment (Mock)
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-2xl">
                    <span className="block text-emerald-700 font-bold mb-1">Prakriti</span>
                    <p className="text-lg text-emerald-900">Vata-Pitta</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-2xl">
                    <span className="block text-emerald-700 font-bold mb-1">Agni</span>
                    <p className="text-lg text-emerald-900">Vishamagni (Irregular)</p>
                  </div>
                </div>
              </section>
            ) : (
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-3 mb-6">
                  <History className="w-6 h-6 text-blue-500" />
                  Past Medical History
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-lg text-slate-700">
                  <li>Hypertension (Diagnosed 2018)</li>
                  <li>Type 2 Diabetes Mellitus</li>
                  <li>Current Meds: Metformin 500mg, Lisinopril 10mg</li>
                </ul>
              </section>
            )}
          </div>

          {/* Timeline / Scanned Documents */}
          <div className="space-y-8">
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 h-full">
              <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-slate-500" />
                Timeline & Scans
              </h2>
              
              <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-4">
                
                <div className="relative pl-6">
                  <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-1"></div>
                  <p className="text-sm font-bold text-slate-500">Today, 10:15 AM</p>
                  <p className="text-lg font-medium text-slate-800 mt-1">AI Consultation Completed</p>
                </div>

                <div className="relative pl-6">
                  <div className="absolute w-4 h-4 bg-slate-300 rounded-full -left-[9px] top-1"></div>
                  <p className="text-sm font-bold text-slate-500">Today, 10:10 AM</p>
                  <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-medium text-slate-800">Old Prescription</p>
                      <p className="text-sm text-slate-500">OCR Extracted</p>
                    </div>
                  </div>
                </div>

                <div className="relative pl-6">
                  <div className="absolute w-4 h-4 bg-slate-300 rounded-full -left-[9px] top-1"></div>
                  <p className="text-sm font-bold text-slate-500">Today, 10:05 AM</p>
                  <p className="text-lg font-medium text-slate-800 mt-1">ABHA Card Scanned</p>
                </div>

              </div>
            </section>
          </div>

        </div>
      </div>
    </main>
  );
}
