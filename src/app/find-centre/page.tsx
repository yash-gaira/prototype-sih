"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, MapPin, Navigation, Map as MapIcon, Loader2, X, CheckCircle2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { ayushHospitals, Hospital } from "@/data/hospitals";
import { useCoins } from "@/contexts/CoinContext";
import { AnimatePresence, motion } from "framer-motion";
import { t } from "@/lib/translations";

export default function FindCentreScreen() {
  const router = useRouter();
  
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [userState, setUserState] = useState<string>("");
  const [nearbyHospitals, setNearbyHospitals] = useState<(Hospital & { distance?: string })[]>([]);

  const { balance, deductCoins } = useCoins();
  const [selectedService, setSelectedService] = useState<{name: string, cost: number} | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showInsufficientModal, setShowInsufficientModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("medikiosk_language");
    if (savedLang) setLanguage(savedLang);
  }, []);

  const handleServiceClick = (service: {name: string, cost: number}) => {
    setSelectedService(service);
    if (balance >= service.cost) {
      setShowConfirmModal(true);
    } else {
      setShowInsufficientModal(true);
    }
  };

  const handleConfirmTransaction = () => {
    if (selectedService && deductCoins(selectedService.cost, selectedService.name)) {
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        setSelectedService(null);
      }, 2500);
    } else {
      setShowConfirmModal(false);
      setShowInsufficientModal(true);
    }
  };

  const premiumServices = [
    { id: 1, name: "Special Consultation", cost: 30 },
    { id: 2, name: "Priority Appointment", cost: 50 },
    { id: 3, name: "Detailed AYUSH Report", cost: 40 },
    { id: 4, name: "Premium Wellness", cost: 75 },
  ];

  useEffect(() => {
    // Prompt for location on mount
    getLocation();
  }, []);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      setNearbyHospitals(ayushHospitals.slice(0, 5)); // Fallback
      return;
    }

    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`);
          const data = await res.json();
          const detectedState = data.address?.state || "";
          setUserState(detectedState);
          
          // Filter hospitals by state (case insensitive partial match)
          let filtered: Hospital[] = [];
          if (detectedState) {
            filtered = ayushHospitals.filter(h => 
              h.state.toLowerCase().includes(detectedState.toLowerCase()) || 
              detectedState.toLowerCase().includes(h.state.toLowerCase())
            );
          }
          
          if (filtered.length === 0) {
            filtered = ayushHospitals.slice(0, 5); // Fallback
          }

          // Add mock distances and sort
          const withDistances = filtered.map(h => ({
            ...h,
            distance: (Math.random() * 15 + 1).toFixed(1) // Random distance 1-16 km
          })).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

          setNearbyHospitals(withDistances);
          setLocationStatus("success");
        } catch (e) {
          console.error("Geocoding failed", e);
          setLocationStatus("error");
          setNearbyHospitals(ayushHospitals.slice(0, 5)); // Fallback
        }
      },
      (error) => {
        console.error("Geolocation error", error);
        setLocationStatus("error");
        setNearbyHospitals(ayushHospitals.slice(0, 5)); // Fallback
      }
    );
  };

  return (
    <main className="flex justify-center min-h-screen bg-slate-100 font-sans sm:p-4 md:p-8">
      <div className="w-full max-w-md md:max-w-6xl md:w-full bg-white sm:rounded-3xl relative shadow-2xl overflow-hidden border-x border-slate-200 sm:border-y flex flex-col md:flex-row min-h-[100dvh] md:min-h-[800px]">
        
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full bg-slate-50 relative">
          
          {/* Header */}
          <header className="px-6 pt-10 pb-4 bg-white flex justify-between items-center z-10 shrink-0 shadow-sm relative">
            <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="md:hidden">
                <ChevronLeft className="w-8 h-8 text-slate-800" />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">{t(language, 'findAyushCentre')}</h1>
                {userState && (
                  <p className="text-sm font-medium text-emerald-600 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> Showing centres in {userState}
                  </p>
                )}
              </div>
            </div>
            
            <button 
              onClick={getLocation} 
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden md:inline whitespace-normal break-words text-center">{t(language, 'updateLocation')}</span>
            </button>
          </header>

          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            
            {/* Map Area */}
            <div className="h-[30vh] md:h-full md:flex-1 bg-blue-50 relative shrink-0">
              <div className="absolute inset-0 bg-slate-200 bg-cover bg-center opacity-60 flex items-center justify-center">
                 <div className="text-center">
                   <MapIcon className="w-12 h-12 text-slate-400 mx-auto mb-2 opacity-50" />
                   <span className="text-slate-500 font-bold uppercase tracking-widest text-sm whitespace-normal break-words text-center">{t(language, 'interactiveMap')}</span>
                 </div>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center animate-bounce shadow-xl border-2 border-white">
                   <MapPin className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* List Area */}
            <div className="flex-1 md:w-[400px] md:flex-none md:border-l md:border-slate-200 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-none overflow-y-auto relative z-20 h-[70vh] md:h-full rounded-t-3xl md:rounded-none p-6 md:p-8">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 md:hidden" />
              
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 whitespace-normal break-words leading-snug">{t(language, 'nearbyCentres')}</h2>
                {locationStatus === "loading" && (
                  <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                )}
              </div>
              
              <div className="space-y-4 pb-20 md:pb-0">
                {nearbyHospitals.map((hospital, index) => {
                  const openInGoogleMaps = () => {
                    const query = encodeURIComponent(`${hospital.name}, ${hospital.address}`);
                    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                  };
                  return (
                    <div key={hospital.id} className="relative transition-all hover:-translate-y-1 hover:shadow-md group">
                    <div 
                      onClick={openInGoogleMaps}
                      className={`border rounded-2xl p-4 flex gap-4 cursor-pointer relative z-10 ${index === 0 ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200 bg-white'}`}
                    >
                       <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${index === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                         <span className="font-bold text-lg">{hospital.name.charAt(0)}</span>
                       </div>
                       <div className="flex-1">
                         <h3 className="font-bold text-slate-900 leading-tight">{hospital.name}</h3>
                         <p className="text-xs font-medium text-slate-500 mt-1">{hospital.address}</p>
                         {hospital.distance && (
                           <p className="text-xs font-bold text-emerald-600 mt-0.5">{hospital.distance} km away</p>
                         )}
                         <div className="flex flex-wrap gap-1 mt-2">
                           {hospital.systems.slice(0, 2).map(sys => (
                             <span key={sys} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md">
                               {sys}
                             </span>
                           ))}
                           {hospital.systems.length > 2 && (
                             <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md">
                               +{hospital.systems.length - 2} more
                             </span>
                           )}
                         </div>
                       </div>
                       <button className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-110 ${index === 0 ? 'bg-[#0f4b3e] text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                         <Navigation className="w-4 h-4" />
                       </button>
                    </div>
                    {/* Premium Services */}
                    {index < 2 && ( // Add to first 2 hospitals to avoid clutter
                      <div className="mt-[-8px] pt-6 px-4 pb-4 bg-white border border-t-0 border-slate-200 rounded-b-2xl shadow-sm space-y-3 relative z-0">
                        <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-2 whitespace-normal break-words leading-tight">{t(language, 'premiumAyushServices')}</p>
                        {premiumServices.slice(index * 2, index * 2 + 2).map(service => (
                          <div key={service.id} className="flex justify-between items-center bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <span className="text-sm font-bold text-slate-800">{service.name}</span>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleServiceClick(service); }}
                              className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-200 transition-colors shadow-sm hover:shadow"
                            >
                              <span className="text-[10px]">⭐</span> {service.cost} Coins
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    </div>
                  );
                })}
                
                {nearbyHospitals.length === 0 && locationStatus === "success" && (
                  <div className="text-center py-10">
                    <p className="text-slate-500 font-medium">No AYUSH centres found in your immediate state. Please try searching manually.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
              {showConfirmModal && selectedService && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                  onClick={() => setShowConfirmModal(false)}
                >
                  <motion.div 
                    initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                    className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-slate-900">{t(language, 'useCoinsQ').replace('?', '')} {selectedService.cost} {t(language, 'coins')}?</h3>
                      <button onClick={() => setShowConfirmModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                      <p className="text-sm text-slate-600 mb-2">{t(language, 'youAreAboutToAccess')} <strong>{selectedService.name}</strong>.</p>
                      <div className="flex justify-between items-center font-bold text-lg">
                        <span className="text-slate-500">{t(language, 'yourBalance')}</span>
                        <div className="flex items-center gap-2">
                          <span className="line-through text-slate-400">{balance}</span>
                          <span className="text-emerald-600">→ {balance - selectedService.cost}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors whitespace-normal break-words text-center px-1">
                        {t(language, 'cancel')}
                      </button>
                      <button onClick={handleConfirmTransaction} className="flex-1 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-colors whitespace-normal break-words text-center px-1">
                        {t(language, 'confirmAndContinue')}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {showInsufficientModal && selectedService && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                  onClick={() => setShowInsufficientModal(false)}
                >
                  <motion.div 
                    initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                    className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <X className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{t(language, 'insufficientCoins')}</h3>
                    <p className="text-slate-600 mb-6">
                      {t(language, 'youNeed')} <strong>{selectedService.cost} {t(language, 'coins')}</strong> {t(language, 'coinsToAccessThisService')}<br/>
                      {t(language, 'yourCurrentBalance')} <strong>{balance} {t(language, 'coins')}</strong>
                    </p>
                    <div className="flex gap-3">
                      <button onClick={() => setShowInsufficientModal(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors whitespace-normal break-words text-center px-1">
                        {t(language, 'close')}
                      </button>
                      <button onClick={() => setShowInsufficientModal(false)} className="flex-1 py-3 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-md shadow-amber-200 transition-colors whitespace-normal break-words text-center px-1">
                        {t(language, 'getMoreCoins')}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {showSuccessModal && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
                >
                  <motion.div 
                    initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-slate-900/90 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-md"
                  >
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    <span className="font-bold whitespace-normal break-words">{t(language, 'accessGranted')}</span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
