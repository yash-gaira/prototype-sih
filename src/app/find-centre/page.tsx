"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, MapPin, Navigation, Map as MapIcon, Loader2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { ayushHospitals, Hospital } from "@/data/hospitals";

export default function FindCentreScreen() {
  const router = useRouter();
  
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [userState, setUserState] = useState<string>("");
  const [nearbyHospitals, setNearbyHospitals] = useState<(Hospital & { distance?: string })[]>([]);

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
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">Find AYUSH Centre</h1>
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
              <span className="hidden md:inline">Update Location</span>
            </button>
          </header>

          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            
            {/* Map Area */}
            <div className="h-[30vh] md:h-full md:flex-1 bg-blue-50 relative shrink-0">
              <div className="absolute inset-0 bg-slate-200 bg-cover bg-center opacity-60 flex items-center justify-center">
                 <div className="text-center">
                   <MapIcon className="w-12 h-12 text-slate-400 mx-auto mb-2 opacity-50" />
                   <span className="text-slate-500 font-bold uppercase tracking-widest text-sm">Interactive Map</span>
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
                <h2 className="text-xl font-bold text-slate-900">Nearby Centres</h2>
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
                    <div 
                      key={hospital.id} 
                      onClick={openInGoogleMaps}
                      className={`border rounded-2xl p-4 flex gap-4 transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer ${index === 0 ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200 bg-white'}`}
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
                  );
                })}
                
                {nearbyHospitals.length === 0 && locationStatus === "success" && (
                  <div className="text-center py-10">
                    <p className="text-slate-500 font-medium">No AYUSH centres found in your immediate state. Please try searching manually.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
