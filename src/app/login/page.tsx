"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Phone, UploadCloud, CreditCard, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { t } from "@/lib/translations";
import { db, auth } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import Tesseract from 'tesseract.js';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export default function LoginScreen() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<"number" | "abha" | "aadhaar" | null>(null);
  
  const abhaInputRef = useRef<HTMLInputElement>(null);
  const aadhaarInputRef = useRef<HTMLInputElement>(null);

  const [language, setLanguage] = useState<string | null>(null);
  const [isLoadingOCR, setIsLoadingOCR] = useState(false);
  const [aadhaarDetails, setAadhaarDetails] = useState<any>(null);

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
    { code: "or", name: "Odia", native: "ଓଡ଼િଆ" },
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
          {t('en', 'selectLanguage')}
        </h2>
        <p className="text-lg text-slate-500 font-medium">
          {t('en', 'chooseLanguage')}
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
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 text-center md:text-left">{t('en', 'otherLanguages')}</p>
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



  const handleAadhaarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoadingOCR(true);
    setSelectedMethod("aadhaar");
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      try {
        // Run offline Tesseract OCR to read text
        const { data: { text } } = await Tesseract.recognize(base64, 'eng');

        // Send messy text to Groq AI to parse neatly into JSON
        const res = await fetch("/api/ocr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rawText: text })
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "OCR Failed");
        }
        const data = await res.json();
        setAadhaarDetails(data);
      } catch (err: any) {
        console.error("OCR Error:", err);
        alert(`Aadhaar Scan Error: ${err.message || "Please try again with a clearer photo."}`);
      } finally {
        setIsLoadingOCR(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const confirmAadhaarAndLogin = async () => {
    try {
      const uniqueId = aadhaarDetails.aadhaarNumber || Date.now().toString();
      
      // Save to Firebase
      await setDoc(doc(db, "users", uniqueId), {
        ...aadhaarDetails,
        authMethod: 'aadhaar',
        createdAt: new Date().toISOString()
      });

      // Save to local storage so AI and Dashboard can access it
      localStorage.setItem("medikiosk_patient_profile", JSON.stringify(aadhaarDetails));
      
      router.push("/dashboard");
    } catch (err) {
      console.error("Error saving user to Firebase:", err);
      // Even if Firebase fails, proceed with local session for demo
      localStorage.setItem("medikiosk_patient_profile", JSON.stringify(aadhaarDetails));
      router.push("/dashboard");
    }
  };

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
      });
    }
  };

  const handleSendOtp = async () => {
    if (phoneNumber.length !== 10) {
      alert("Please enter a valid 10-digit number");
      return;
    }
    setIsSendingOtp(true);
    try {
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      const formattedNumber = `+91${phoneNumber}`;
      
      const confirmation = await signInWithPhoneNumber(auth, formattedNumber, appVerifier);
      setConfirmationResult(confirmation);
    } catch (err: any) {
      console.error("Error sending OTP", err);
      // Firebase throws specific error codes like auth/billing-not-enabled
      if (err.code === 'auth/billing-not-enabled') {
        alert("Firebase Billing Not Enabled: Please upgrade your Firebase project to the Blaze plan to send SMS OTPs.");
      } else if (err.code === 'auth/network-request-failed') {
        alert("Network Error: Please turn OFF Brave Shields or Adblockers to allow reCAPTCHA to load.");
      } else {
        alert(`Failed to send OTP: ${err.message || "Unknown error"}`);
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      alert("Please enter the 6-digit OTP");
      return;
    }
    setIsVerifyingOtp(true);
    try {
      const result = await confirmationResult.confirm(otp);
      
      // Save minimal profile
      localStorage.setItem("medikiosk_patient_profile", JSON.stringify({
        phoneNumber: result.user.phoneNumber,
        authMethod: 'phone'
      }));
      
      router.push("/dashboard");
    } catch (err) {
      console.error("Error verifying OTP", err);
      alert("Invalid OTP. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const renderAuthSelection = () => {
    if (aadhaarDetails) {
      return (
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="space-y-3 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Verify Details
            </h2>
            <p className="text-lg text-slate-500 font-medium">
              Please confirm the extracted details from your Aadhaar.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
              <input type="text" value={aadhaarDetails.name || ''} onChange={e => setAadhaarDetails({...aadhaarDetails, name: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">DOB / YOB</label>
                <input type="text" value={aadhaarDetails.dob || ''} onChange={e => setAadhaarDetails({...aadhaarDetails, dob: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gender</label>
                <input type="text" value={aadhaarDetails.gender || ''} onChange={e => setAadhaarDetails({...aadhaarDetails, gender: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aadhaar Number</label>
              <input type="text" value={aadhaarDetails.aadhaarNumber || ''} onChange={e => setAadhaarDetails({...aadhaarDetails, aadhaarNumber: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium" />
            </div>
          </div>

          <Button onClick={confirmAadhaarAndLogin} className="w-full py-6 text-lg font-bold bg-[#0f4b3e] hover:bg-emerald-800 text-white rounded-2xl shadow-lg">
            Confirm & Login <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      );
    }

    return (
      <div className="w-full max-w-md space-y-12">
        <div className="space-y-3 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t(language, 'signIn')}
          </h2>
          <p className="text-lg text-slate-500 font-medium">
            {t(language, 'chooseMethod')}
          </p>
        </div>

        <div className="space-y-4 w-full relative">
          {isLoadingOCR && (
            <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center border-2 border-emerald-500/20 shadow-lg">
              <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4" />
              <p className="font-bold text-emerald-800">Scanning Aadhaar Card...</p>
            </div>
          )}

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
              <span className="font-bold">{t(language, 'mobileNumber')}</span>
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
              <span className="font-bold">{t(language, 'uploadAbha')}</span>
            </div>
            <input type="file" accept="image/*,.pdf" className="hidden" ref={abhaInputRef} onChange={handleLogin} />
          </Button>

          <Button 
            size="lg" 
            variant={selectedMethod === "aadhaar" ? "default" : "outline"}
            onClick={() => {
               aadhaarInputRef.current?.click();
            }}
            className={`w-full text-lg flex justify-between px-6 py-6 h-auto border-2 transition-all ${selectedMethod === 'aadhaar' ? 'border-[#0f4b3e] bg-[#0f4b3e] text-white shadow-lg' : 'border-slate-200 text-slate-700 hover:border-[#0f4b3e] hover:bg-emerald-50 hover:text-[#0f4b3e]'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${selectedMethod === 'aadhaar' ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
                <CreditCard className="w-6 h-6" />
              </div>
              <span className="font-bold">{t(language, 'aadhaarOtp')}</span>
            </div>
            <input type="file" accept="image/*" capture="environment" className="hidden" ref={aadhaarInputRef} onChange={handleAadhaarUpload} />
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
              {!confirmationResult ? (
                <>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold border-r border-slate-300 pr-3">+91</span>
                    <input 
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder={t(language, 'enterNumber')}
                      className="w-full p-4 pl-16 text-lg font-medium bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-[#0f4b3e] focus:ring-4 focus:ring-emerald-100 transition-all shadow-sm"
                    />
                  </div>
                  <div id="recaptcha-container"></div>
                  <Button onClick={handleSendOtp} disabled={isSendingOtp || phoneNumber.length !== 10} className="w-full py-6 text-lg font-bold bg-[#0f4b3e] hover:bg-emerald-800 text-white rounded-2xl shadow-lg">
                    {isSendingOtp ? "Sending..." : t(language, 'sendOtp')} <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </>
              ) : (
                <>
                  <div className="relative">
                    <input 
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter 6-digit OTP"
                      className="w-full p-4 text-center tracking-widest text-lg font-bold bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-[#0f4b3e] focus:ring-4 focus:ring-emerald-100 transition-all shadow-sm"
                    />
                  </div>
                  <Button onClick={handleVerifyOtp} disabled={isVerifyingOtp || otp.length !== 6} className="w-full py-6 text-lg font-bold bg-[#0f4b3e] hover:bg-emerald-800 text-white rounded-2xl shadow-lg">
                    {isVerifyingOtp ? "Verifying..." : "Verify & Login"} <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </>
              )}
              <p className="text-center text-xs text-slate-500 mt-6 max-w-xs mx-auto">
                {t(language, 'terms')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <main className="flex min-h-screen bg-slate-50 overflow-hidden">
      
      {/* Left side - Branding (Desktop only) */}
      <div className="hidden md:flex flex-1 relative bg-[#0f4b3e] text-white flex-col justify-between p-12 lg:p-20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-100 via-transparent to-transparent" />
        <div className="relative z-10">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 border border-white/20">
            <span className="text-3xl">🌿</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight mb-6" dangerouslySetInnerHTML={{ __html: t(language, 'welcomeTitle').replace('MediKiosk', '<br/>MediKiosk') }} />
          <p className="text-xl text-emerald-100/80 max-w-md font-medium leading-relaxed">
            {t(language, 'welcomeDesc')}
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
               <ChevronLeft className="w-5 h-5" /> {t(language, 'back')}
            </button>
            {renderAuthSelection()}
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
