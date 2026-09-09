"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Search, 
  CheckCircle2, 
  Calendar,
  Clock,
  User,
  Leaf,
  Droplet,
  Flower2,
  Stethoscope,
  Activity,
  MapPin,
  Navigation
} from "lucide-react";
import { ayushHospitals } from "@/data/hospitals";
import { bookAppointment } from "@/lib/firestoreService";

type Step = "CENTRE" | "DEPARTMENT" | "DOCTOR" | "DATETIME" | "CONFIRM" | "SUCCESS";

const DEPARTMENTS = [
  { id: "ayurveda", name: "Ayurveda", desc: "Traditional Indian holistic healing", icon: Leaf, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  { id: "yoga", name: "Yoga & Naturopathy", desc: "Physical & mental wellness", icon: Flower2, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" },
  { id: "unani", name: "Unani", desc: "Perso-Arabic traditional medicine", icon: Droplet, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  { id: "siddha", name: "Siddha", desc: "Traditional South Indian healing", icon: Activity, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
  { id: "homeopathy", name: "Homeopathy", desc: "Alternative natural remedies", icon: Stethoscope, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
];

const DOCTORS = [
  { id: "d1", name: "Dr. R. Verma", degree: "BAMS, MD (Ayurveda)", exp: "15 yrs exp", rating: "4.9" },
  { id: "d2", name: "Dr. S. Mehta", degree: "BAMS, Ph.D", exp: "10 yrs exp", rating: "4.7" },
  { id: "d3", name: "Dr. A. Sharma", degree: "BAMS", exp: "8 yrs exp", rating: "4.8" },
];

const DATES = [
  { day: "Mon", date: "15 Sep" },
  { day: "Tue", date: "16 Sep" },
  { day: "Wed", date: "17 Sep" },
  { day: "Thu", date: "18 Sep" },
  { day: "Fri", date: "19 Sep" },
];

const TIME_SLOTS = [
  { label: "Morning", slots: ["09:00 AM", "09:30 AM", "10:00 AM", "11:30 AM"] },
  { label: "Afternoon", slots: ["12:00 PM", "01:00 PM", "02:30 PM"] },
  { label: "Evening", slots: ["04:00 PM", "05:00 PM", "06:30 PM"] },
];

export default function BookAppointment() {
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState<Step>("CENTRE");
  const [selectedCentre, setSelectedCentre] = useState<any>(null);
  const [nearbyCentres, setNearbyCentres] = useState<any[]>([]);
  const [isLocating, setIsLocating] = useState(true);
  const [selectedDept, setSelectedDept] = useState<any>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<any>(DATES[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    let filtered = ayushHospitals.slice(0, 3).map(h => ({
      ...h,
      distance: (Math.random() * 5 + 1).toFixed(1)
    })).sort((a,b) => parseFloat(a.distance) - parseFloat(b.distance));

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&zoom=10&addressdetails=1`);
          const data = await res.json();
          const state = data.address?.state;
          if (state) {
            let stateFiltered = ayushHospitals.filter(h => h.state.toLowerCase().includes(state.toLowerCase()) || state.toLowerCase().includes(h.state.toLowerCase()));
            if (stateFiltered.length > 0) {
              filtered = stateFiltered.slice(0, 4).map(h => ({
                ...h, 
                distance: (Math.random() * 5 + 1).toFixed(1)
              })).sort((a,b) => parseFloat(a.distance) - parseFloat(b.distance));
            }
          }
        } catch(e) {}
        setNearbyCentres(filtered);
        setIsLocating(false);
      }, () => {
        setNearbyCentres(filtered);
        setIsLocating(false);
      });
    } else {
      setNearbyCentres(filtered);
      setIsLocating(false);
    }
  }, []);

  const handleNext = (nextStep: Step) => setCurrentStep(nextStep);
  const handleBack = () => {
    if (currentStep === "DEPARTMENT") setCurrentStep("CENTRE");
    else if (currentStep === "DOCTOR") setCurrentStep("DEPARTMENT");
    else if (currentStep === "DATETIME") setCurrentStep("DOCTOR");
    else if (currentStep === "CONFIRM") setCurrentStep("DATETIME");
    else router.push("/dashboard");
  };

  const handleConfirm = async () => {
    const dateStr = selectedDate?.date || '15 Sep';
    const dayNum = dateStr.split(' ')[0];
    const month = dateStr.split(' ')[1] || 'SEP';
    
    const appointmentDetails = {
      patientName: "Naman Mahra",
      doctor: selectedDoctor?.name || 'Dr. R. Verma',
      dept: selectedDept?.name || 'Ayurveda',
      date: dayNum,
      monthYear: `${month.toUpperCase()} 2026`,
      time: selectedTime || '11:00 AM',
      center: selectedCentre?.name || "AYUSH Centre"
    };

    try {
      await bookAppointment(appointmentDetails);
      localStorage.setItem("medikiosk_next_appointment", JSON.stringify(appointmentDetails));
    } catch (error) {
      console.error("Firebase booking failed", error);
      // Fallback
      localStorage.setItem("medikiosk_next_appointment", JSON.stringify(appointmentDetails));
    }

    setCurrentStep("SUCCESS");
    setTimeout(() => {
      router.push("/dashboard");
    }, 2500);
  };

  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const renderCentreSelection = () => (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Select Centre</h2>
        <p className="text-sm text-slate-500 mt-1">Closest AYUSH centres based on your location</p>
      </div>

      {isLocating ? (
        <div className="flex flex-col items-center justify-center py-10 space-y-4">
          <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium animate-pulse">Analyzing location...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {nearbyCentres.map((centre, index) => (
            <button
              key={centre.id}
              onClick={() => {
                setSelectedCentre(centre);
                handleNext("DEPARTMENT");
              }}
              className={`w-full text-left flex items-start gap-4 p-4 rounded-2xl border transition-all hover:-translate-y-1 ${
                selectedCentre?.id === centre.id ? 'border-[#0f4b3e] ring-1 ring-[#0f4b3e] bg-emerald-50/30' : 'border-slate-200 bg-white hover:border-[#0f4b3e]'
              }`}
            >
               <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${index === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                 <MapPin className="w-6 h-6" />
               </div>
               <div className="flex-1">
                 <h3 className="font-bold text-slate-900 leading-tight">{centre.name}</h3>
                 <p className="text-xs font-medium text-slate-500 mt-1 line-clamp-1">{centre.address}</p>
                 <p className="text-xs font-bold text-emerald-600 mt-1">{centre.distance} km away</p>
               </div>
               <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                 <Navigation className="w-4 h-4 text-slate-400" />
               </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderDepartmentSelection = () => (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Select Department</h2>
        <p className="text-sm text-slate-500 mt-1">Which branch of AYUSH do you need at {selectedCentre?.name?.substring(0,20)}...?</p>
      </div>

      <div className="space-y-4">
        {DEPARTMENTS.map((dept) => {
          const Icon = dept.icon;
          return (
            <button
              key={dept.id}
              onClick={() => {
                setSelectedDept(dept);
                handleNext("DOCTOR");
              }}
              className={`w-full text-left flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                selectedDept?.id === dept.id ? `border-[#0f4b3e] ring-1 ring-[#0f4b3e] ${dept.bg}` : "border-slate-200 bg-white hover:border-[#0f4b3e]"
              }`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${dept.bg} ${dept.border} border`}>
                <Icon className={`w-7 h-7 ${dept.color}`} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{dept.name}</h3>
                <p className="text-xs text-slate-500">{dept.desc}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  );

  const renderDoctorSelection = () => (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Select Doctor</h2>
        <p className="text-sm text-slate-500 mt-1">Available specialists in {selectedDept?.name}</p>
      </div>

      <div className="relative mb-6">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search by name or disease..." 
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#0f4b3e]"
        />
      </div>

      <div className="space-y-4">
        {DOCTORS.map((doc) => (
          <div key={doc.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-4">
            <div className="w-16 h-16 bg-slate-100 rounded-xl flex flex-col items-center justify-center text-slate-400">
              <User className="w-8 h-8" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-900 truncate">{doc.name}</h3>
                <span className="text-xs font-bold text-[#0f4b3e] bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                   ⭐ {doc.rating}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{doc.degree}</p>
              <p className="text-xs text-slate-400 mt-0.5">{doc.exp}</p>
              
              <button 
                onClick={() => {
                  setSelectedDoctor(doc);
                  handleNext("DATETIME");
                }}
                className="mt-3 w-full py-2 bg-[#0f4b3e] text-white text-xs font-bold rounded-lg hover:bg-emerald-800 transition-colors"
              >
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDateTimeSelection = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 pb-2">
        <h2 className="text-2xl font-bold text-slate-900">Date & Time</h2>
        <p className="text-sm text-slate-500 mt-1">Select an available slot</p>
      </div>

      {/* Date Scroll */}
      <div className="px-6 py-4 flex gap-3 overflow-x-auto hide-scrollbar">
        {DATES.map((d) => {
          const isSelected = selectedDate.date === d.date;
          return (
            <button
              key={d.date}
              onClick={() => setSelectedDate(d)}
              className={`flex flex-col items-center justify-center min-w-[70px] h-[80px] rounded-2xl border transition-colors ${
                isSelected ? "bg-[#0f4b3e] border-[#0f4b3e] text-white shadow-md" : "bg-white border-slate-200 text-slate-600"
              }`}
            >
              <span className={`text-xs font-medium mb-1 ${isSelected ? "text-emerald-100" : "text-slate-400"}`}>{d.day}</span>
              <span className="text-lg font-bold">{d.date.split(" ")[0]}</span>
            </button>
          )
        })}
      </div>

      {/* Time Slots */}
      <div className="px-6 py-4 flex-1 overflow-y-auto space-y-6">
        {TIME_SLOTS.map((group) => (
          <div key={group.label}>
            <h3 className="text-sm font-bold text-slate-900 mb-3">{group.label}</h3>
            <div className="grid grid-cols-3 gap-3">
              {group.slots.map((time) => {
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                      isSelected 
                        ? "bg-[#0f4b3e] border-[#0f4b3e] text-white shadow-md ring-2 ring-[#0f4b3e] ring-offset-2" 
                        : "bg-white border-slate-200 text-slate-600 hover:border-[#0f4b3e]"
                    }`}
                  >
                    {time}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Action */}
      <div className="p-6 bg-white border-t border-slate-100">
        <button 
          disabled={!selectedTime}
          onClick={() => handleNext("CONFIRM")}
          className="w-full py-4 bg-[#0f4b3e] text-white text-base font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 flex-1 overflow-y-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Review Booking</h2>
          <p className="text-sm text-slate-500 mt-1">Please confirm your appointment details</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 relative overflow-hidden">
          {/* Decorative Circle */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-100 rounded-full opacity-50" />
          
          <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4 border-b border-emerald-200/50 pb-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 shadow-sm">
                  <MapPin className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-emerald-950 line-clamp-1">{selectedCentre?.name}</h3>
                  <p className="text-sm text-emerald-700">{selectedCentre?.district}, {selectedCentre?.state}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-b border-emerald-200/50 pb-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex flex-col items-center justify-center text-slate-400 shadow-sm">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-emerald-950">{selectedDoctor?.name}</h3>
                  <p className="text-sm text-emerald-700">{selectedDept?.name} Specialist</p>
                </div>
              </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Calendar className="w-5 h-5 text-[#0f4b3e]" />
                <div>
                  <p className="text-xs text-emerald-700 font-medium">Date</p>
                  <p className="font-bold text-emerald-950">{selectedDate?.day}, {selectedDate?.date} 2026</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-[#0f4b3e]" />
                <div>
                  <p className="text-xs text-emerald-700 font-medium">Time</p>
                  <p className="font-bold text-emerald-950">{selectedTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <User className="w-5 h-5 text-[#0f4b3e]" />
                <div>
                  <p className="text-xs text-emerald-700 font-medium">Patient</p>
                  <p className="font-bold text-emerald-950">Naman Mahra</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="p-6 bg-white border-t border-slate-100">
        <button 
          onClick={handleConfirm}
          className="w-full py-4 bg-[#0f4b3e] text-white text-base font-bold rounded-2xl shadow-[0_8px_30px_rgb(15,75,62,0.3)] hover:scale-[1.02] transition-transform"
        >
          Confirm Appointment
        </button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-[#0f4b3e] text-white">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 200 }}
      >
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-14 h-14 text-[#0f4b3e]" />
        </div>
      </motion.div>
      <h2 className="text-3xl font-bold mb-2">Booking Confirmed!</h2>
      <p className="text-emerald-100/80">Your appointment has been successfully scheduled.</p>
    </div>
  );

  return (
    <main className="flex justify-center h-[100dvh] bg-slate-100 font-sans sm:p-4">
      <div className="w-full max-w-md bg-white sm:rounded-3xl h-full relative shadow-2xl overflow-hidden border-x border-slate-200 sm:border-y flex flex-col">
        
        {/* Universal Header (hidden on SUCCESS) */}
        {currentStep !== "SUCCESS" && (
          <header className="px-6 pt-10 pb-4 bg-white flex items-center gap-4 z-10 shrink-0">
            <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors">
              <ChevronLeft className="w-7 h-7 text-slate-800" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-slate-900 truncate">Book Appointment</h1>
            </div>
            {/* Step Indicator */}
            <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
               {currentStep === "CENTRE" && "1/5"}
               {currentStep === "DEPARTMENT" && "2/5"}
               {currentStep === "DOCTOR" && "3/5"}
               {currentStep === "DATETIME" && "4/5"}
               {currentStep === "CONFIRM" && "5/5"}
            </div>
          </header>
        )}

        <div className="flex-1 relative overflow-hidden bg-slate-50/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
              className="absolute inset-0 overflow-y-auto"
            >
              {currentStep === "CENTRE" && renderCentreSelection()}
              {currentStep === "DEPARTMENT" && renderDepartmentSelection()}
              {currentStep === "DOCTOR" && renderDoctorSelection()}
              {currentStep === "DATETIME" && renderDateTimeSelection()}
              {currentStep === "CONFIRM" && renderConfirmation()}
              {currentStep === "SUCCESS" && renderSuccess()}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </main>
  );
}
