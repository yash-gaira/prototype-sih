"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Activity, AlertCircle, CheckCircle2, ChevronRight, Stethoscope, Eye, Clock, FileText, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function DoctorDashboardPage() {
  const router = useRouter();
  
  const [patientProfile, setPatientProfile] = useState<any>(null);
  const [ayushData, setAyushData] = useState<any>(null);
  
  // In-Clinic Focus State
  const [nadi, setNadi] = useState("");
  const [jihwa, setJihwa] = useState("");

  useEffect(() => {
    try {
      const profileStr = localStorage.getItem("medikiosk_patient_profile");
      if (profileStr) setPatientProfile(JSON.parse(profileStr));

      const ayushStr = localStorage.getItem("ayush_assessment_data");
      if (ayushStr) setAyushData(JSON.parse(ayushStr));
    } catch(e) {}
  }, []);

  const getAnomalies = () => {
    if (!ayushData) return [];
    const anomalies = [];
    if (ayushData.sleep === "Disturbed" || ayushData.sleep === "Insomnia") {
      anomalies.push({ parameter: "Sleep", value: ayushData.sleep, urgency: "high" });
    }
    if (ayushData.diet === "Poor" || ayushData.diet === "Excessive") {
      anomalies.push({ parameter: "Diet/Appetite", value: ayushData.diet, urgency: "medium" });
    }
    if (ayushData.bowel === "Constipated" || ayushData.bowel === "Loose") {
      anomalies.push({ parameter: "Bowel Habits", value: ayushData.bowel, urgency: "high" });
    }
    if (ayushData.agni === "Visham Agni" || ayushData.agni === "Manda Agni" || ayushData.agni === "Tikshna Agni") {
      anomalies.push({ parameter: "Agni (Digestive Fire)", value: ayushData.agni, urgency: "high" });
    }
    return anomalies;
  };

  const anomalies = getAnomalies();

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 md:px-10 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-900 rounded-xl flex items-center justify-center text-white">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 leading-tight">Doctor Workspace</h1>
            <p className="text-sm font-medium text-emerald-700">OPD Optimization Mode Active</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-emerald-50 text-emerald-800 rounded-lg text-sm font-bold border border-emerald-100 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Goal: 20 Min Consultation
          </div>
          <button onClick={() => router.push('/dashboard')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <User className="w-6 h-6 text-slate-600" />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Patient Context & Smart Focus */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Patient Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-start gap-6">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
              <User className="w-10 h-10 text-slate-400" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{patientProfile?.name || "Unknown Patient"}</h2>
                  <p className="text-slate-500 font-medium mt-1">ID: {patientProfile?.aadhaarNumber || "N/A"} • {patientProfile?.gender || "Unknown"} • DOB: {patientProfile?.dob || "Unknown"}</p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                  Verified via Aadhaar
                </div>
              </div>
              <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                <p className="text-xs font-bold text-orange-800 uppercase tracking-wide mb-1">Chief Complaint</p>
                <p className="text-lg font-bold text-slate-900">{ayushData?.mainComplaint || "Not provided"}</p>
                <p className="text-sm font-medium text-orange-700 mt-1">Duration: {ayushData?.duration || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Smart Focus (UX Highlight) */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-gradient-to-br from-red-50 to-rose-50 rounded-3xl p-6 border border-red-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-900">Smart Focus</h3>
                <p className="text-sm font-medium text-red-700">Will focus on only relevant topics based on pre-assessment</p>
              </div>
            </div>
            
            {anomalies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {anomalies.map((anom, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-4 border border-red-100 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{anom.parameter}</p>
                      <p className="text-lg font-bold text-slate-900 mt-0.5">{anom.value}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-red-300" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 text-center border border-emerald-100">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-slate-900">No critical anomalies detected in pre-assessment.</p>
              </div>
            )}
          </motion.div>

          {/* In-Clinic Focus */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">In-Clinic Focus</h3>
                <p className="text-sm font-medium text-slate-500">Record live clinical findings</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nadi Pariksha (Pulse Examination)</label>
                <textarea 
                  value={nadi}
                  onChange={(e) => setNadi(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white transition-colors outline-none"
                  placeholder="Record pulse rate, rhythm, volume, and dosha dominance (Vata/Pitta/Kapha)..."
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Jihwa Pariksha (Tongue Examination)</label>
                <textarea 
                  value={jihwa}
                  onChange={(e) => setJihwa(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white transition-colors outline-none"
                  placeholder="Record coating, color, shape, and moisture..."
                  rows={3}
                />
              </div>
              
              <button className="w-full py-4 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl font-bold text-lg transition-colors shadow-md">
                Finalize Diagnosis & Generate Prescription
              </button>
            </div>
          </div>
          
        </div>

        {/* Right Column: Pre-Consultation Data */}
        <div className="lg:col-span-4">
          <div className="bg-slate-100 rounded-3xl p-6 border border-slate-200 sticky top-24">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-500" /> Pre-Consultation Data
            </h3>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Core Parameters</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-slate-600">Prakriti</span>
                    <span className="text-sm font-bold text-slate-900">{ayushData?.prakriti || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-slate-600">Vikruti</span>
                    <span className="text-sm font-bold text-slate-900">{ayushData?.vikruti || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-slate-600">Agni</span>
                    <span className="text-sm font-bold text-slate-900">{ayushData?.agni || "—"}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Habits & Lifestyle</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-slate-600">Sleep</span>
                    <span className="text-sm font-bold text-slate-900">{ayushData?.sleep || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-slate-600">Diet</span>
                    <span className="text-sm font-bold text-slate-900">{ayushData?.diet || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-slate-600">Bowel</span>
                    <span className="text-sm font-bold text-slate-900">{ayushData?.bowel || "—"}</span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
