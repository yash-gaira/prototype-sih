"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { 
  Bell, 
  User, 
  Calendar, 
  Upload, 
  FileText, 
  MapPin, 
  Plus, 
  Home, 
  Clock, 
  Sparkles, 
  MoreHorizontal, 
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
  X,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { t } from "@/lib/translations";
import { listenToPatientAppointments, uploadDocumentRecord } from "@/lib/firestoreService";

export default function UserDashboard() {
  const router = useRouter();
  const [language, setLanguage] = useState<string>("en");
  const [userName, setUserName] = useState("Naman Mahra");
  const [aadhaarNumber, setAadhaarNumber] = useState("XXXX XXXX 1234");
  const [nextAppt, setNextAppt] = useState<any>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem("preferredLanguage");
    if (savedLang) {
      setLanguage(savedLang);
    }

    const profileRaw = localStorage.getItem("medikiosk_patient_profile");
    if (profileRaw) {
      try {
        const profile = JSON.parse(profileRaw);
        if (profile.name) setUserName(profile.name);
        if (profile.aadhaarNumber) setAadhaarNumber(profile.aadhaarNumber);
        else if (profile.phoneNumber) setAadhaarNumber(profile.phoneNumber);
      } catch (e) {}
    }

    // Request Location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          localStorage.setItem("medikiosk_user_location", JSON.stringify({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }));
        },
        (error) => {
          console.log("Location access denied or error:", error);
        }
      );
    }
    
    // Initialize nextAppt from local storage immediately so it shows instantly
    const apptRaw = localStorage.getItem("medikiosk_next_appointment");
    if (apptRaw) {
      try {
        const appt = JSON.parse(apptRaw);
        setNextAppt(appt);
      } catch(e) {}
    }

    const unsubscribe = listenToPatientAppointments((appts) => {
      if (appts && appts.length > 0) {
        // Assume the first one is the most recent pending appointment
        setNextAppt(appts[0]);
      } else {
        // Fallback to local storage if nothing in firebase yet
        const apptRaw = localStorage.getItem("medikiosk_next_appointment");
        if (apptRaw) {
          try {
            const appt = JSON.parse(apptRaw);
            setNextAppt(appt);
          } catch(e) {}
        }
      }
    });

    const familyRaw = localStorage.getItem("medikiosk_family_members");
    if (familyRaw) {
      try {
        setFamilyMembers(JSON.parse(familyRaw));
      } catch(e) {}
    }

    return () => unsubscribe();
  }, []);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      title: "Welcome to MediKiosk!",
      message: "Your Ayush health ID is generated. You can now consult the AI.",
      time: "Just now",
      icon: CheckCircle2,
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      iconBg: "bg-emerald-200",
      textClass: "text-emerald-900",
      descClass: "text-emerald-800",
      timeClass: "text-emerald-600"
    },
    {
      id: 2,
      type: "info",
      title: "AI Triage Ready",
      message: "Try our new AI assessment tool to reduce your consultation time.",
      time: "2 hours ago",
      icon: Sparkles,
      bg: "bg-blue-50",
      border: "border-blue-100",
      iconBg: "bg-blue-200",
      textClass: "text-blue-900",
      descClass: "text-blue-800",
      timeClass: "text-blue-600"
    },
    {
      id: 3,
      type: "warning",
      title: "Complete your Profile",
      message: "Please add your past medical history for better AI diagnosis.",
      time: "1 day ago",
      icon: ShieldAlert,
      bg: "bg-orange-50",
      border: "border-orange-100",
      iconBg: "bg-orange-200",
      textClass: "text-orange-900",
      descClass: "text-orange-800",
      timeClass: "text-orange-600"
    }
  ]);

  const [familyMembers, setFamilyMembers] = useState([
    { id: 1, name: "Naman", relation: "you", initial: "N", color: "green" },
    { id: 2, name: "Mother", relation: "mother", initial: "M", color: "red" },
    { id: 3, name: "Father", relation: "father", initial: "F", color: "blue" },
    { id: 4, name: "Sister", relation: "sister", initial: "S", color: "purple" }
  ]);

  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRelation, setNewMemberRelation] = useState("");

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "success">("idle");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const colorClasses: Record<string, string> = {
    green: "bg-green-100 text-green-700 border-green-200",
    red: "bg-red-100 text-red-600 border-red-100",
    blue: "bg-blue-100 text-blue-600 border-blue-100",
    purple: "bg-purple-100 text-purple-600 border-purple-100",
    orange: "bg-orange-100 text-orange-600 border-orange-100",
    teal: "bg-teal-100 text-teal-700 border-teal-100",
  };

  const handleAddMember = () => {
    if (!newMemberName || !newMemberRelation) return;
    
    const colors = ["orange", "teal", "green", "blue", "purple", "red"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newMember = {
      id: Date.now(),
      name: newMemberName,
      relation: newMemberRelation,
      initial: newMemberName.charAt(0).toUpperCase(),
      color: randomColor
    };

    const newMembers = [...familyMembers, newMember];
    setFamilyMembers(newMembers);
    localStorage.setItem("medikiosk_family_members", JSON.stringify(newMembers));
    
    setNewMemberName("");
    setNewMemberRelation("");
    setShowAddMember(false);
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadState("uploading");
    
    // Create mock document based on file
    const newDoc = {
      id: Date.now().toString(),
      title: file.name,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      doctor: "Uploaded by User",
      centre: "MediKiosk Health Locker",
      type: file.type.includes('image') ? "Lab Report" : "Prescription",
      size: (file.size / (1024 * 1024)).toFixed(1) + " MB"
    };

    setTimeout(async () => {
      setUploadState("success");
      
      // Save to localStorage
      const existingStr = localStorage.getItem("custom_documents");
      const existingDocs = existingStr ? JSON.parse(existingStr) : [];
      localStorage.setItem("custom_documents", JSON.stringify([newDoc, ...existingDocs]));

      try {
        await uploadDocumentRecord(newDoc);
      } catch (error) {
        console.error("Firebase upload record failed", error);
      }

      setTimeout(() => {
        setShowUploadModal(false);
        setUploadState("idle");
        if (fileInputRef.current) fileInputRef.current.value = "";
      }, 2000);
    }, 1500);
  };

  return (
    <main className="flex justify-center min-h-screen bg-slate-100 font-sans sm:p-4 md:p-8">
      <div className="w-full max-w-md md:max-w-6xl md:w-full bg-white sm:rounded-3xl relative shadow-2xl overflow-hidden border-x border-slate-200 sm:border-y flex flex-col md:flex-row min-h-[100dvh] md:min-h-[800px]">
        
        {/* Desktop Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-y-auto pb-24 md:pb-8 relative">
          
          {/* Header */}
          <header className="px-6 md:px-10 pt-10 pb-4 flex justify-between items-start">
            <div className="flex gap-4 items-center relative" ref={profileMenuRef}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-14 h-14 md:w-16 md:h-16 bg-slate-200 rounded-full overflow-hidden flex items-center justify-center hover:bg-slate-300 transition-colors"
              >
                <User className="w-8 h-8 md:w-10 md:h-10 text-slate-400" />
              </button>
              
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-[4.5rem] left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                      <p className="text-sm font-bold text-slate-900 truncate">{userName}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">ABHA: {aadhaarNumber}</p>
                    </div>
                    <div className="p-2">
                      <button 
                        onClick={() => {
                          setShowProfileMenu(false);
                          router.push('/login');
                        }} 
                        className="w-full text-left px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-3 font-semibold transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <p className="text-sm md:text-base text-slate-500 font-medium">{t(language, 'goodMorning')},</p>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">{userName}</h1>
                <p className="text-xs md:text-sm text-slate-500 mt-0.5">{t(language, 'yourHealthOurPriority')}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="relative cursor-pointer hover:bg-slate-50 p-2 rounded-full transition-colors" onClick={() => setShowNotifications(!showNotifications)}>
                <Bell className="w-7 h-7 text-emerald-800" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
                    {notifications.length}
                  </span>
                )}
              </div>
              <button 
                onClick={() => router.push("/ayush-assessment")} 
                className="hidden md:flex items-center mt-2 w-24 h-9 bg-slate-300 rounded-full p-1 cursor-pointer hover:bg-slate-400 transition-colors shadow-inner"
                title="AYUSH Assessment"
              >
                <div className="w-7 h-7 bg-white rounded-full shadow-sm shrink-0" />
                <span className="text-xs font-bold text-slate-600 ml-2 tracking-wide">AYUSH</span>
              </button>
            </div>
          </header>

          <div className="md:px-10 px-0 flex-1">
            <div className="md:grid md:grid-cols-12 md:gap-8 h-full">
              
              {/* Left Column on Desktop */}
              <div className="md:col-span-6 lg:col-span-7 flex flex-col gap-8">
                
                {/* Health ID Card */}
                <div className="px-6 md:px-0">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl md:rounded-3xl p-5 md:p-6 flex items-center justify-between border border-emerald-100 shadow-sm transition-transform hover:scale-[1.01] cursor-pointer">
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center text-emerald-700 shadow-sm border border-emerald-100">
                        <User className="w-6 h-6 md:w-8 md:h-8" />
                      </div>
                      <div>
                        <p className="text-sm md:text-base font-bold text-emerald-900">{t(language, 'myHealthId')}</p>
                        <p className="text-lg md:text-2xl font-bold text-emerald-900 tracking-widest my-0.5">{aadhaarNumber}</p>
                        <p className="text-xs md:text-sm text-emerald-700">{t(language, 'viewManageProfile')}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-emerald-800" />
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="px-6 md:px-0">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-4 md:mb-6">{t(language, 'quickActions')}</h3>
                  <div className="grid grid-cols-4 gap-3 md:gap-6">
                    <button onClick={() => router.push("/book-appointment")} className="flex flex-col items-center gap-2 md:gap-3 group">
                      <div className="w-14 h-14 md:w-20 md:h-20 bg-white rounded-2xl md:rounded-3xl flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-colors">
                        <Calendar className="w-6 h-6 md:w-8 md:h-8" />
                      </div>
                      <span className="text-[10px] md:text-xs font-semibold text-slate-600 text-center leading-tight">Book<br/>Appointment</span>
                    </button>
                    <button onClick={handleUploadClick} className="flex flex-col items-center gap-2 md:gap-3 group">
                      <div className="w-14 h-14 md:w-20 md:h-20 bg-white rounded-2xl md:rounded-3xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 group-hover:border-blue-200 group-hover:bg-blue-50 transition-colors">
                        <Upload className="w-6 h-6 md:w-8 md:h-8" />
                      </div>
                      <span className="text-[10px] md:text-xs font-semibold text-slate-600 text-center leading-tight">Upload<br/>Document</span>
                    </button>
                    <button onClick={() => router.push("/documents")} className="flex flex-col items-center gap-2 md:gap-3 group">
                      <div className="w-14 h-14 md:w-20 md:h-20 bg-white rounded-2xl md:rounded-3xl flex items-center justify-center text-orange-600 shadow-sm border border-slate-100 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                        <FileText className="w-6 h-6 md:w-8 md:h-8" />
                      </div>
                      <span className="text-[10px] md:text-xs font-semibold text-slate-600 text-center leading-tight">Document<br/>History</span>
                    </button>
                    <button onClick={() => router.push("/find-centre")} className="flex flex-col items-center gap-2 md:gap-3 group">
                      <div className="w-14 h-14 md:w-20 md:h-20 bg-white rounded-2xl md:rounded-3xl flex items-center justify-center text-rose-600 shadow-sm border border-slate-100 group-hover:border-rose-200 group-hover:bg-rose-50 transition-colors">
                        <MapPin className="w-6 h-6 md:w-8 md:h-8" />
                      </div>
                      <span className="text-[10px] md:text-xs font-semibold text-slate-600 text-center leading-tight">Find AYUSH<br/>Centre</span>
                    </button>
                  </div>
                </div>

                {/* Family Members */}
                <div className="px-6 md:px-0">
                  <div className="flex justify-between items-end mb-4 md:mb-6">
                    <h3 className="text-lg md:text-xl font-bold text-slate-900">{t(language, 'familyMembers')}</h3>
                  </div>
                  <div className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar pb-2">
                    {familyMembers.map((member) => (
                      <div key={member.id} className="flex flex-col items-center gap-2 flex-shrink-0 relative group">
                        {member.relation.toLowerCase() !== "you" && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const newMembers = familyMembers.filter(m => m.id !== member.id);
                              setFamilyMembers(newMembers);
                              localStorage.setItem("medikiosk_family_members", JSON.stringify(newMembers));
                            }}
                            className="absolute -top-1 -right-1 bg-white border border-slate-200 text-rose-500 rounded-full p-1 shadow-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10 hover:bg-rose-50"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                        <button className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold ${colorClasses[member.color]} border-2`}>
                          {member.relation.toLowerCase() === 'you' ? userName.charAt(0).toUpperCase() : member.initial}
                        </button>
                        <div className="text-center">
                          <p className="text-xs md:text-sm font-bold text-slate-800">{member.relation.toLowerCase() === 'you' ? userName.split(' ')[0] : member.name}</p>
                          <p className="text-[10px] md:text-xs text-slate-500 capitalize">{member.relation}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex flex-col items-center gap-2 flex-shrink-0">
                      <button 
                        onClick={() => setShowAddMember(true)}
                        className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center border-2 border-dashed border-slate-300 text-slate-400 hover:border-emerald-500 hover:text-emerald-500 hover:bg-emerald-50 transition-colors"
                      >
                        <Plus className="w-6 h-6 md:w-8 md:h-8" />
                      </button>
                      <span className="text-xs md:text-sm font-semibold text-slate-500 mt-1">Add</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column on Desktop */}
              <div className="md:col-span-6 lg:col-span-5 mt-8 md:mt-0">
                {/* Next Appointment */}
                <div className="px-6 md:px-0">
                  <div className="bg-[#0f4b3e] rounded-3xl p-5 md:p-6 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-700 rounded-full opacity-30" />
                    
                    <div className="flex justify-between items-center mb-6 relative z-10">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-emerald-100" />
                        <h3 className="text-lg md:text-xl font-bold">Next Appointment</h3>
                      </div>
                    </div>
                    
                    {nextAppt ? (
                      <>
                        <div className="flex gap-4 md:gap-6 relative z-10 bg-emerald-900/40 p-4 rounded-2xl">
                          <div className="flex flex-col items-center justify-center pr-4 md:pr-6 border-r border-emerald-600/50">
                            <span className="text-4xl md:text-5xl font-extrabold tracking-tighter">{nextAppt.date.split(" ")[0]}</span>
                            <span className="text-xs md:text-sm font-bold tracking-widest mt-1 uppercase">{nextAppt.date.split(" ")[1] ? `${nextAppt.date.split(" ")[1]} 2026` : nextAppt.monthYear}</span>
                          </div>
                          
                          <div className="flex flex-col justify-center gap-3 min-w-0">
                            <div className="flex items-start gap-3">
                              <User className="w-4 h-4 md:w-5 md:h-5 mt-0.5 text-emerald-200 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="font-bold text-sm md:text-base leading-none truncate">{nextAppt.doctor}</p>
                                <p className="text-xs md:text-sm text-emerald-100 mt-1 truncate">{nextAppt.dept} OPD</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <Clock className="w-4 h-4 md:w-5 md:h-5 mt-0.5 text-emerald-200 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="font-bold text-sm md:text-base leading-none truncate">{nextAppt.time}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button onClick={() => router.push("/appointment-details")} className="w-full mt-6 bg-white text-[#0f4b3e] font-bold text-sm md:text-base py-3 md:py-4 rounded-xl hover:bg-emerald-50 transition-colors relative z-10">
                          View Details
                        </button>
                      </>
                    ) : (
                      <div className="relative z-10 text-center py-4">
                        <div className="w-16 h-16 bg-emerald-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-600">
                          <Calendar className="w-8 h-8 text-emerald-200" />
                        </div>
                        <p className="text-lg font-bold text-white mb-2">No Upcoming Visits</p>
                        <p className="text-sm text-emerald-200 mb-6 px-4">Book your next consultation with our AYUSH specialists today.</p>
                        <button onClick={() => router.push("/book-appointment")} className="w-full bg-emerald-400 text-emerald-950 font-bold text-sm md:text-base py-3 md:py-4 rounded-xl hover:bg-emerald-300 transition-colors shadow-lg">
                          Book Appointment
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Floating AI Button (Mobile Only) */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/consult")}
            className="md:hidden absolute bottom-24 right-6 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(37,99,235,0.4)] text-white z-20 border-4 border-white"
          >
            <Sparkles className="w-8 h-8" />
          </motion.button>

        </div>

        {/* Bottom Navigation (Mobile Only) */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-100 flex justify-around items-center px-2 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] sm:rounded-b-3xl">
          <button className="flex flex-col items-center gap-1.5 text-emerald-800">
            <Home className="w-6 h-6 fill-emerald-800" />
            <span className="text-[10px] font-bold">Home</span>
          </button>
          
          <button onClick={() => router.push("/history")} className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-emerald-800 transition-colors">
            <Calendar className="w-6 h-6" />
            <span className="text-[10px] font-semibold">Visits</span>
          </button>

          <button onClick={() => router.push("/ai-summary")} className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-emerald-800 transition-colors">
            <Sparkles className="w-6 h-6" />
            <span className="text-[10px] font-semibold">AI Summary</span>
          </button>

          <button onClick={() => {
            alert("Coming Soon: Advanced Settings and Features will be available in the next update!");
          }} className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-emerald-800 transition-colors">
            <MoreHorizontal className="w-6 h-6" />
            <span className="text-[10px] font-semibold">More</span>
          </button>
        </div>

        {/* Modals */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-0"
              onClick={() => setShowNotifications(false)}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900">Notifications</h3>
                  <div className="flex items-center gap-2">
                    {notifications.length > 0 && (
                      <button onClick={() => setNotifications([])} className="text-xs font-bold text-slate-500 hover:text-rose-500 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors">
                        Clear All
                      </button>
                    )}
                    <button onClick={() => setShowNotifications(false)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8 flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                        <Bell className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-slate-500 font-medium">No new notifications</p>
                    </div>
                  ) : (
                    notifications.map(n => {
                      const Icon = n.icon;
                      return (
                        <div key={n.id} className={`p-4 rounded-2xl ${n.bg} border ${n.border} flex gap-4 items-start relative group`}>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setNotifications(prev => prev.filter(x => x.id !== n.id));
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-white/50 text-slate-400 hover:text-slate-600 transition-colors opacity-0 group-hover:opacity-100 md:opacity-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className={`mt-1 p-2 ${n.iconBg} ${n.textClass} rounded-full shrink-0`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="pr-6">
                            <h4 className={`font-bold ${n.textClass}`}>{n.title}</h4>
                            <p className={`text-sm ${n.descClass} mt-1`}>{n.message}</p>
                            <p className={`text-xs ${n.timeClass} mt-2 font-medium`}>{n.time}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {showAddMember && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-0"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl relative"
              >
                <button onClick={() => setShowAddMember(false)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Add Family Member</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)}
                      placeholder="Enter name"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0f4b3e] focus:ring-1 focus:ring-[#0f4b3e]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1.5">Relationship</label>
                    <select 
                      value={newMemberRelation} onChange={(e) => setNewMemberRelation(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0f4b3e] focus:ring-1 focus:ring-[#0f4b3e] appearance-none"
                    >
                      <option value="">Select relationship</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <button onClick={handleAddMember} disabled={!newMemberName || !newMemberRelation} className="w-full bg-[#0f4b3e] text-white font-bold py-3.5 rounded-xl mt-4 disabled:opacity-50">
                    Add Member
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {showUploadModal && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4"
            >
              <motion.div 
                initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="bg-white rounded-t-3xl md:rounded-3xl p-6 md:p-8 w-full md:max-w-md shadow-2xl relative"
              >
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 md:hidden" />
                <button onClick={() => setShowUploadModal(false)} className="hidden md:flex absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                  <X className="w-5 h-5" />
                </button>
                
                {uploadState === "idle" ? (
                  <>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Upload Document</h3>
                    <p className="text-slate-500 mb-6">Upload prescriptions or lab reports to securely store them.</p>
                    
                    <div className="border-2 border-dashed border-[#0f4b3e]/30 bg-emerald-50/50 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 transition-colors" onClick={handleUploadClick}>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileSelect} 
                        className="hidden" 
                        accept="image/*,application/pdf"
                      />
                      <Upload className="w-8 h-8 md:w-10 md:h-10 text-[#0f4b3e] mb-3 md:mb-4" />
                      <p className="font-bold text-slate-800 text-center text-sm md:text-base">Tap to browse files</p>
                      <p className="text-[10px] md:text-xs text-slate-500 mt-1">PDF, JPG, PNG up to 10MB</p>
                    </div>
                  </>
                ) : uploadState === "uploading" ? (
                  <div className="py-12 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-slate-100 border-t-[#0f4b3e] rounded-full animate-spin mb-4" />
                    <h3 className="text-xl font-bold text-slate-900">Uploading securely...</h3>
                    <p className="text-slate-500 mt-2 text-center text-sm">Encrypting and uploading your document to your Health Locker.</p>
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-slate-900">Upload Complete</h3>
                    <p className="text-slate-500 mt-2 text-center">Your document has been securely saved.</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
