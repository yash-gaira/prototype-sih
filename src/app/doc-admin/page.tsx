"use client";

import { useState } from "react";
import { 
  Users, Settings, Search, Bell, Clock, AlertTriangle, 
  CheckCircle, FileText, Activity, HeartPulse, Stethoscope, 
  ChevronRight, Calendar, User, Phone, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";

// Mock Data Store for Patients
const MOCK_PATIENTS = [
  {
    id: "P-1042",
    name: "Ramesh Kumar",
    age: 58,
    gender: "Male",
    bloodGroup: "O+",
    abhaId: "12-3456-7890-1234",
    phone: "+91 98765 43210",
    waitTime: "12 mins",
    priority: "High",
    isCritical: true,
    vitals: { bp: "150/95", hr: "110", temp: "98.6°F", spo2: "94%" },
    aiSummary: {
      cc: "Severe Chest Pain radiating to left arm",
      hpi: "Patient reports crushing chest pain that started 45 minutes ago while resting. Pain is 8/10 in severity. Associated with shortness of breath and diaphoresis.",
      pastMedications: ["Amlodipine 5mg", "Atorvastatin 20mg"]
    },
    ayushMetrics: {
      prakriti: "Vata-Pitta",
      vikriti: "Vata Vriddhi, Pitta Prakopa (associated with Hridroga)",
      agni: "Vishamagni",
      koshtha: "Krura"
    },
    timeline: [
      { date: "10 Sep 2026", title: "ECG Report", type: "lab" },
      { date: "15 Aug 2026", title: "Routine Checkup", type: "prescription" }
    ]
  },
  {
    id: "P-1043",
    name: "Sunita Sharma",
    age: 42,
    gender: "Female",
    bloodGroup: "A+",
    abhaId: "45-6789-0123-4567",
    phone: "+91 91234 56789",
    waitTime: "25 mins",
    priority: "Medium",
    isCritical: false,
    vitals: { bp: "120/80", hr: "72", temp: "99.1°F", spo2: "98%" },
    aiSummary: {
      cc: "Chronic Lower Back Pain",
      hpi: "Patient complains of dull aching pain in the lower back for the last 3 months. Worsens upon prolonged sitting. No history of trauma. Radiating pain to right leg occasionally.",
      pastMedications: ["Ibuprofen 400mg PRN", "Calcium Supplements"]
    },
    ayushMetrics: {
      prakriti: "Kapha-Vata",
      vikriti: "Vata Prakopa (Kati Shoola)",
      agni: "Mandagni",
      koshtha: "Krura"
    },
    timeline: [
      { date: "02 Sep 2026", title: "MRI Lumbar Spine", type: "lab" },
      { date: "10 Jun 2026", title: "Orthopedic Consult", type: "prescription" }
    ]
  },
  {
    id: "P-1044",
    name: "Aarav Singh",
    age: 28,
    gender: "Male",
    bloodGroup: "B+",
    abhaId: "78-9012-3456-7890",
    phone: "+91 99887 76655",
    waitTime: "40 mins",
    priority: "Low",
    isCritical: false,
    vitals: { bp: "115/75", hr: "68", temp: "98.4°F", spo2: "99%" },
    aiSummary: {
      cc: "Allergic Rhinitis / Persistent Sneezing",
      hpi: "Patient reports continuous sneezing, runny nose, and itchy eyes for the past 4 days. Triggered by dust exposure. Mild dry cough present.",
      pastMedications: ["Cetirizine 10mg"]
    },
    ayushMetrics: {
      prakriti: "Pitta-Kapha",
      vikriti: "Kapha Vriddhi (Pratishyaya)",
      agni: "Samagni",
      koshtha: "Mridu"
    },
    timeline: [
      { date: "15 Jan 2026", title: "Allergy Panel", type: "lab" }
    ]
  }
];

export default function DoctorAdminPanel() {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(MOCK_PATIENTS[0].id);
  const [isAyushMode, setIsAyushMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"Summary" | "Timeline">("Summary");

  const activePatient = MOCK_PATIENTS.find(p => p.id === selectedPatientId) || MOCK_PATIENTS[0];

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      
      {/* LEFT SIDEBAR: PATIENT QUEUE */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
        <div className="p-6 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">MediKiosk</h1>
              <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">Doctor Panel</p>
            </div>
          </div>
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search patients..." 
              className="w-full bg-slate-800 text-sm text-white placeholder-slate-400 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
            <span>Patient Queue</span>
            <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{MOCK_PATIENTS.length}</span>
          </div>

          {MOCK_PATIENTS.map((patient) => (
            <div 
              key={patient.id}
              onClick={() => setSelectedPatientId(patient.id)}
              className={`p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                selectedPatientId === patient.id 
                  ? "bg-blue-50 border-blue-500 shadow-md" 
                  : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className={`font-bold text-base ${selectedPatientId === patient.id ? 'text-blue-900' : 'text-slate-800'}`}>
                  {patient.name}
                </h3>
                {patient.isCritical && (
                  <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold bg-red-100 text-red-700 px-2 py-1 rounded-md animate-pulse">
                    <AlertTriangle className="w-3 h-3" /> Critical
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {patient.age}y {patient.gender.charAt(0)}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {patient.waitTime}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200 shrink-0">
          <button className="flex items-center gap-3 w-full p-3 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition-colors">
            <Settings className="w-5 h-5" /> Settings
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN AREA: ACTIVE PATIENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50/50">
        
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Active Consultation</h2>
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setIsAyushMode(false)}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-sm ${
                !isAyushMode ? "bg-white text-blue-700" : "text-slate-500 hover:text-slate-700 shadow-none"
              }`}
            >
              Allopathic Mode
            </button>
            <button
              onClick={() => setIsAyushMode(true)}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-sm ${
                isAyushMode ? "bg-white text-emerald-700" : "text-slate-500 hover:text-slate-700 shadow-none"
              }`}
            >
              AYUSH Mode
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Patient Header Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between gap-6">
              <div className="flex gap-6 items-center">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-slate-200">
                  <User className="w-10 h-10 text-slate-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{activePatient.name}</h1>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm font-semibold text-slate-500">
                    <span className="bg-slate-100 px-3 py-1 rounded-md">{activePatient.age} Yrs</span>
                    <span className="bg-slate-100 px-3 py-1 rounded-md">{activePatient.gender}</span>
                    <span className="bg-red-50 text-red-600 px-3 py-1 rounded-md flex items-center gap-1"><HeartPulse className="w-4 h-4"/> Blood: {activePatient.bloodGroup}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-slate-500 font-medium">
                    <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-emerald-500" /> ABHA: {activePatient.abhaId}</span>
                    <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {activePatient.phone}</span>
                  </div>
                </div>
              </div>

              {/* Vitals */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">BP</span>
                  <p className={`text-lg font-bold ${activePatient.isCritical ? 'text-red-600' : 'text-slate-800'}`}>{activePatient.vitals.bp}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">HR</span>
                  <p className={`text-lg font-bold ${activePatient.isCritical ? 'text-red-600' : 'text-slate-800'}`}>{activePatient.vitals.hr}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Temp</span>
                  <p className="text-lg font-bold text-slate-800">{activePatient.vitals.temp}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">SpO2</span>
                  <p className="text-lg font-bold text-slate-800">{activePatient.vitals.spo2}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-slate-200">
              <button 
                onClick={() => setActiveTab("Summary")}
                className={`pb-4 text-lg font-bold transition-all ${activeTab === "Summary" ? "border-b-4 border-blue-600 text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
              >
                AI Triage Summary
              </button>
              <button 
                onClick={() => setActiveTab("Timeline")}
                className={`pb-4 text-lg font-bold transition-all ${activeTab === "Timeline" ? "border-b-4 border-blue-600 text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
              >
                Medical Records
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "Summary" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                
                {/* AI Summary Section */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-50 rounded-lg"><Activity className="w-6 h-6 text-blue-600" /></div>
                    <h3 className="text-xl font-bold text-slate-800">Chief Complaint & History</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div className={`p-5 rounded-2xl border ${activePatient.isCritical ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                      <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${activePatient.isCritical ? 'text-red-700' : 'text-slate-500'}`}>Chief Complaint (CC)</h4>
                      <p className={`text-lg font-semibold ${activePatient.isCritical ? 'text-red-900' : 'text-slate-900'}`}>{activePatient.aiSummary.cc}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">History of Present Illness</h4>
                        <p className="text-slate-700 leading-relaxed font-medium">{activePatient.aiSummary.hpi}</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Past Medications</h4>
                        <ul className="space-y-2">
                          {activePatient.aiSummary.pastMedications.map((med, i) => (
                            <li key={i} className="flex items-center gap-2 text-slate-700 font-medium bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> {med}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AYUSH Module (Conditional) */}
                {isAyushMode && (
                  <div className="bg-emerald-50 rounded-3xl p-8 shadow-sm border border-emerald-200 animate-in zoom-in-95">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-white rounded-lg"><div className="w-6 h-6 flex items-center justify-center text-emerald-600 text-xl">🌿</div></div>
                      <h3 className="text-xl font-bold text-emerald-900">AYUSH Diagnostics</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white p-4 rounded-2xl border border-emerald-100">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Prakriti</span>
                        <p className="font-bold text-slate-800 mt-1">{activePatient.ayushMetrics.prakriti}</p>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-emerald-100">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Vikriti</span>
                        <p className="font-bold text-slate-800 mt-1">{activePatient.ayushMetrics.vikriti}</p>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-emerald-100">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Agni</span>
                        <p className="font-bold text-slate-800 mt-1">{activePatient.ayushMetrics.agni}</p>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-emerald-100">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Koshtha</span>
                        <p className="font-bold text-slate-800 mt-1">{activePatient.ayushMetrics.koshtha}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "Timeline" && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4">
                <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-4">
                  {activePatient.timeline.map((item, i) => (
                    <div key={i} className="relative pl-8">
                      <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-blue-100 border-4 border-white flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                      </div>
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-slate-300 transition-all">
                        <div>
                          <p className="text-xs font-bold text-slate-400 mb-1">{item.date}</p>
                          <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                            {item.type === 'lab' ? <Activity className="w-4 h-4 text-blue-500" /> : <FileText className="w-4 h-4 text-emerald-500" />}
                            {item.title}
                          </h4>
                        </div>
                        <Button variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          View PDF
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Action Footer */}
        <footer className="h-24 bg-white border-t border-slate-200 px-8 flex items-center justify-between shrink-0">
          <Button variant="outline" size="lg" className="text-slate-600 font-bold border-slate-300 hover:bg-slate-50 h-14 rounded-xl px-8">
            Request More Info
          </Button>
          
          <div className="flex gap-4">
            <Button variant="outline" size="lg" className="text-blue-700 font-bold border-blue-200 bg-blue-50 hover:bg-blue-100 h-14 rounded-xl px-8">
              Generate Final EMR
            </Button>
            <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-800 font-bold h-14 rounded-xl px-8 shadow-lg flex items-center gap-2">
              Accept Case <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </footer>

      </main>
    </div>
  );
}
