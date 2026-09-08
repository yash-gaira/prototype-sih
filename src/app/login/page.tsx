"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Phone, UploadCloud, CreditCard, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginScreen() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<"number" | "abha" | "aadhaar" | null>(null);
  
  const abhaInputRef = useRef<HTMLInputElement>(null);
  const aadhaarInputRef = useRef<HTMLInputElement>(null);

  const [language, setLanguage] = useState<string | null>(null);

  const topLanguages = [
    { code: "en", name: "English", native: "English" },
    { code: "hi", name: "Hindi", native: "हिन्दी" },
  ];

  const otherLanguages = [
    { code: "bn", name: "Bengali", native: "বাংলা" },
    { code: "mr", name: "Marathi", native: "मराठी" },
    { code: "te", name: "Telugu", native: "తెలుగు" },
    { code: "ta", name: "Tamil", native: "தமிழ்" },
    { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
    { code: "ur", name: "Urdu", native: "اردو" },
    { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
    { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
    { code: "ml", name: "Malayalam", native: "മലയാളം" },
    { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  ];

  const handleLogin = () => {
    // In a real app, we'd validate the auth token/file here.
    router.push("/dashboard");
  };

  const renderLanguageSelection = () => (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-3 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Select Language
        </h2>
        <p className="text-lg text-slate-500 font-medium">
          Choose your preferred language to continue
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {topLanguages.map((lang) => (
          <Button 
            key={lang.code}
            size="lg" 
            variant="outline"
            onClick={() => setLanguage(lang.code)}
            className="w-full text-lg flex justify-between px-6 py-6 h-auto border-2 border-slate-200 text-slate-700 hover:border-[#0f4b3e] hover:bg-emerald-50 hover:text-[#0f4b3e] transition-all"
          >
            <span className="font-bold">{lang.native}</span>
            <span className="text-slate-400 font-medium text-sm">{lang.name}</span>
          </Button>
        ))}
        
        <div className="pt-4 pb-2">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 text-center md:text-left">Other Languages</p>
          <div className="grid grid-cols-2 gap-3">
            {otherLanguages.map((lang) => (
              <Button 
                key={lang.code}
                variant="outline"
                onClick={() => setLanguage(lang.code)}
                className="w-full flex flex-col items-center justify-center py-4 h-auto border-2 border-slate-200 text-slate-700 hover:border-[#0f4b3e] hover:bg-emerald-50 hover:text-[#0f4b3e] transition-all"
              >
                <span className="font-bold">{lang.native}</span>
                <span className="text-slate-400 font-medium text-xs mt-1">{lang.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAuthSelection = () => (
    <div className="w-full max-w-md space-y-12">
      <div className="space-y-3 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Sign In
        </h2>
        <p className="text-lg text-slate-500 font-medium">
          Choose a method to verify your identity
        </p>
      </div>

      <div className="space-y-4 w-full">
        <Button 
          size="lg" 
          variant={selectedMethod === "number" ? "default" : "outline"}
          onClick={() => setSelectedMethod("number")}
          className={`w-full text-lg flex justify-between px-6 py-6 h-auto border-2 transition-all ${selectedMethod === 'number' ? 'border-[#0f4b3e] bg-[#0f4b3e] text-white shadow-lg' : 'border-slate-200 text-slate-700 hover:border-[#0f4b3e] hover:bg-emerald-50 hover:text-[#0f4b3e]'}`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-lg ${selectedMethod === 'number' ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
              <Phone className="w-6 h-6" />
            </div>
            <span className="font-bold">Mobile Number</span>
          </div>
        </Button>

        <Button 
          size="lg" 
          variant={selectedMethod === "abha" ? "default" : "outline"}
          onClick={() => {
             setSelectedMethod("abha");
             abhaInputRef.current?.click();
          }}
          className={`w-full text-lg flex justify-between px-6 py-6 h-auto border-2 transition-all ${selectedMethod === 'abha' ? 'border-[#0f4b3e] bg-[#0f4b3e] text-white shadow-lg' : 'border-slate-200 text-slate-700 hover:border-[#0f4b3e] hover:bg-emerald-50 hover:text-[#0f4b3e]'}`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-lg ${selectedMethod === 'abha' ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
              <UploadCloud className="w-6 h-6" />
            </div>
            <span className="font-bold">Upload ABHA Card</span>
          </div>
          <input type="file" accept="image/*,.pdf" className="hidden" ref={abhaInputRef} onChange={handleLogin} />
        </Button>

        <Button 
          size="lg" 
          variant={selectedMethod === "aadhaar" ? "default" : "outline"}
          onClick={() => {
             setSelectedMethod("aadhaar");
             aadhaarInputRef.current?.click();
          }}
          className={`w-full text-lg flex justify-between px-6 py-6 h-auto border-2 transition-all ${selectedMethod === 'aadhaar' ? 'border-[#0f4b3e] bg-[#0f4b3e] text-white shadow-lg' : 'border-slate-200 text-slate-700 hover:border-[#0f4b3e] hover:bg-emerald-50 hover:text-[#0f4b3e]'}`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-lg ${selectedMethod === 'aadhaar' ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
              <CreditCard className="w-6 h-6" />
            </div>
            <span className="font-bold">Aadhaar Card OTP</span>
          </div>
          <input type="file" accept="image/*,.pdf" className="hidden" ref={aadhaarInputRef} onChange={handleLogin} />
        </Button>
      </div>

      <AnimatePresence>
        {selectedMethod === "number" && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            className="w-full flex flex-col gap-4 pt-4"
          >
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold border-r border-slate-300 pr-3">+91</span>
              <input 
                type="tel"
                placeholder="Enter 10-digit number"
                className="w-full p-4 pl-16 text-lg font-medium bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-[#0f4b3e] focus:ring-4 focus:ring-emerald-100 transition-all shadow-sm"
              />
            </div>
            <Button onClick={handleLogin} className="w-full py-6 text-lg font-bold bg-[#0f4b3e] hover:bg-emerald-800 text-white rounded-2xl shadow-lg">
              Send OTP <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <main className="flex min-h-screen bg-slate-50 overflow-hidden">
      
      {/* Left side - Branding (Desktop only) */}
      <div className="hidden md:flex flex-1 relative bg-[#0f4b3e] text-white flex-col justify-between p-12 lg:p-20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-100 via-transparent to-transparent" />
        <div className="relative z-10">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 border border-white/20">
            <span className="text-3xl">🌿</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Welcome to <br/>MediKiosk
          </h1>
          <p className="text-xl text-emerald-100/80 max-w-md font-medium leading-relaxed">
            Your trusted gateway to AYUSH healthcare services. Secure, fast, and accessible triage.
          </p>
        </div>
        
        <div className="relative z-10 flex gap-4">
          <div className="w-12 h-1.5 bg-white rounded-full opacity-100" />
          <div className="w-12 h-1.5 bg-white/30 rounded-full" />
        </div>
      </div>

      {/* Right side - Dynamic Content */}
      <AnimatePresence mode="wait">
        {!language ? (
          <motion.div 
            key="lang-select"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col items-center justify-center p-8 w-full max-h-screen overflow-y-auto"
          >
            {renderLanguageSelection()}
          </motion.div>
        ) : (
          <motion.div 
            key="auth-select"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col items-center justify-center p-8 w-full relative max-h-screen overflow-y-auto"
          >
            <button onClick={() => setLanguage(null)} className="absolute top-8 left-8 md:top-12 md:left-12 text-slate-400 hover:text-slate-600 font-semibold flex items-center gap-1">
               <ChevronLeft className="w-5 h-5" /> Back
            </button>
            {renderAuthSelection()}
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
