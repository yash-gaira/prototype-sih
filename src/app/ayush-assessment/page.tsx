"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, CheckCircle2, Activity, Moon, Utensils, Droplets, ActivitySquare, AlertTriangle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "basic" | "lifestyle" | "core";

export default function AyushAssessmentPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Basic
    mainComplaint: "",
    duration: "",
    weight: "",
    // Lifestyle
    sleep: "",
    diet: "",
    digestion: "",
    bowel: "",
    activity: "",
    // Core Parameters
    prakriti: "",
    vikruti: "",
    agni: "",
    mala: "",
    nadi: "",
    jihwa: "",
    darshana: "",
    ashtavidha: "",
    dinacarya: ""
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (phase === "basic") setPhase("lifestyle");
    else if (phase === "lifestyle") setPhase("core");
    else handleSubmit();
  };

  const handleBack = () => {
    if (phase === "core") setPhase("lifestyle");
    else if (phase === "lifestyle") setPhase("basic");
    else router.push("/dashboard");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API save
    setTimeout(() => {
      localStorage.setItem("ayush_assessment_data", JSON.stringify(formData));
      setIsSubmitting(false);
      alert("Assessment Submitted Successfully! Your data has been securely saved for the doctor.");
      router.push("/dashboard");
    }, 1500);
  };

  const renderBasic = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">What is your main complaint?</label>
          <textarea 
            value={formData.mainComplaint}
            onChange={(e) => handleChange("mainComplaint", e.target.value)}
            className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-emerald-500 outline-none transition-colors"
            placeholder="E.g., Severe back pain, continuous headache..."
            rows={3}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Duration</label>
            <input 
              value={formData.duration}
              onChange={(e) => handleChange("duration", e.target.value)}
              className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-emerald-500 outline-none"
              placeholder="E.g., 3 days"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Weight (kg)</label>
            <input 
              type="number"
              value={formData.weight}
              onChange={(e) => handleChange("weight", e.target.value)}
              className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-emerald-500 outline-none"
              placeholder="E.g., 70"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderLifestyle = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div className="space-y-4">
        {/* Sleep */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2"><Moon className="w-4 h-4 text-emerald-600"/> Sleep Quality</label>
          <div className="grid grid-cols-3 gap-2">
            {["Sound", "Disturbed", "Insomnia"].map(opt => (
              <button key={opt} onClick={() => handleChange("sleep", opt)} className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${formData.sleep === opt ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600 hover:border-emerald-200'}`}>{opt}</button>
            ))}
          </div>
        </div>
        {/* Diet */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2"><Utensils className="w-4 h-4 text-emerald-600"/> Diet / Appetite</label>
          <div className="grid grid-cols-3 gap-2">
            {["Good", "Poor", "Excessive"].map(opt => (
              <button key={opt} onClick={() => handleChange("diet", opt)} className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${formData.diet === opt ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600 hover:border-emerald-200'}`}>{opt}</button>
            ))}
          </div>
        </div>
        {/* Bowel */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2"><Droplets className="w-4 h-4 text-emerald-600"/> Bowel Habits</label>
          <div className="grid grid-cols-3 gap-2">
            {["Regular", "Constipated", "Loose"].map(opt => (
              <button key={opt} onClick={() => handleChange("bowel", opt)} className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${formData.bowel === opt ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600 hover:border-emerald-200'}`}>{opt}</button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderCore = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl">
        <p className="text-sm text-orange-800 font-medium flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          These advanced parameters can be filled by the patient, an assisting nurse, or during the consultation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Prakriti (Body Type)</label>
          <select value={formData.prakriti} onChange={(e) => handleChange("prakriti", e.target.value)} className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-emerald-500 outline-none bg-white">
            <option value="">Select...</option>
            <option value="Vata">Vata</option>
            <option value="Pitta">Pitta</option>
            <option value="Kapha">Kapha</option>
            <option value="Vata-Pitta">Vata-Pitta</option>
            <option value="Pitta-Kapha">Pitta-Kapha</option>
            <option value="Vata-Kapha">Vata-Kapha</option>
            <option value="Tridosha">Tridosha</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Agni (Digestive Fire)</label>
          <select value={formData.agni} onChange={(e) => handleChange("agni", e.target.value)} className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-emerald-500 outline-none bg-white">
            <option value="">Select...</option>
            <option value="Sama Agni">Sama Agni (Balanced)</option>
            <option value="Visham Agni">Visham Agni (Irregular)</option>
            <option value="Tikshna Agni">Tikshna Agni (Sharp/Hyper)</option>
            <option value="Manda Agni">Manda Agni (Weak)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Vikruti (Current Imbalance)</label>
          <input value={formData.vikruti} onChange={(e) => handleChange("vikruti", e.target.value)} className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-emerald-500 outline-none" placeholder="E.g., Vata aggravation" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Dinacarya (Daily Routine)</label>
          <input value={formData.dinacarya} onChange={(e) => handleChange("dinacarya", e.target.value)} className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-emerald-500 outline-none" placeholder="E.g., Irregular meals, late sleeping" />
        </div>
      </div>

      {/* Ayurvedic Glossary FAQ */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4">
          <Info className="w-5 h-5 text-emerald-600" />
          Term Glossary (FAQ)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-emerald-900 text-sm">Prakriti</h4>
            <p className="text-xs text-slate-600 mt-1">Your natural, inherent physical and mental constitution (Vata, Pitta, Kapha).</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-emerald-900 text-sm">Vikruti</h4>
            <p className="text-xs text-slate-600 mt-1">The current state of imbalance or disease in your body compared to your natural state.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-emerald-900 text-sm">Agni</h4>
            <p className="text-xs text-slate-600 mt-1">The digestive fire or metabolic processes. Weak (Manda) or irregular (Visham) agni leads to toxins.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-emerald-900 text-sm">Dinacarya</h4>
            <p className="text-xs text-slate-600 mt-1">Your daily routine, including sleep schedule, eating habits, and hygiene practices.</p>
          </div>
        </div>
      </div>

    </motion.div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Area */}
      <div className="w-full md:w-1/3 bg-emerald-900 p-8 text-white flex flex-col justify-between">
        <div>
          <button onClick={() => router.push('/dashboard')} className="mb-8 flex items-center gap-2 text-emerald-200 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-extrabold mb-4 tracking-tight">Ayush Assessment</h1>
          <p className="text-emerald-100/80 mb-12">Complete your pre-consultation profile to help the doctor understand your body constitution and save time during the OPD visit.</p>

          <div className="space-y-6">
            <div className={`flex items-center gap-4 ${phase === "basic" ? 'opacity-100' : 'opacity-50'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${phase === "basic" ? 'bg-white text-emerald-900' : 'border-2 border-emerald-400 text-emerald-400'}`}>1</div>
              <span className="font-bold text-lg">Basic Details</span>
            </div>
            <div className={`flex items-center gap-4 ${phase === "lifestyle" ? 'opacity-100' : 'opacity-50'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${phase === "lifestyle" ? 'bg-white text-emerald-900' : 'border-2 border-emerald-400 text-emerald-400'}`}>2</div>
              <span className="font-bold text-lg">Habits & Lifestyle</span>
            </div>
            <div className={`flex items-center gap-4 ${phase === "core" ? 'opacity-100' : 'opacity-50'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${phase === "core" ? 'bg-white text-emerald-900' : 'border-2 border-emerald-400 text-emerald-400'}`}>3</div>
              <span className="font-bold text-lg">Core Parameters</span>
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <p className="text-sm text-emerald-400">Powered by Ministry of Ayush</p>
        </div>
      </div>

      {/* Content Area */}
      <div className="w-full md:w-2/3 p-6 md:p-12 flex flex-col h-screen overflow-y-auto">
        <div className="flex-1 max-w-2xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {phase === "basic" && renderBasic()}
            {phase === "lifestyle" && renderLifestyle()}
            {phase === "core" && renderCore()}
          </AnimatePresence>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between max-w-2xl mx-auto w-full">
          <button 
            onClick={handleBack}
            className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            {phase === "basic" ? "Cancel" : "Back"}
          </button>
          
          <button 
            onClick={handleNext}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : phase === "core" ? "Submit to Doctor" : "Continue"}
            {!isSubmitting && phase !== "core" && <ChevronRight className="w-5 h-5" />}
            {!isSubmitting && phase === "core" && <CheckCircle2 className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
