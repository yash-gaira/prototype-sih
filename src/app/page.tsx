"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export default function IntroScreen() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login after 2.5 seconds
    const timer = setTimeout(() => {
      router.push("/login");
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex-1 flex flex-col md:flex-row items-center justify-center min-h-screen bg-slate-50 overflow-hidden">
      
      {/* Left/Top side - Animation */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex-1 w-full flex items-center justify-center md:bg-white md:border-r border-slate-100 p-8"
      >
        <div className="flex flex-col items-center gap-8">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
            className="relative flex items-center justify-center p-10 bg-white md:bg-slate-50 rounded-full shadow-[0_0_60px_-15px_rgba(37,99,235,0.3)] md:shadow-none"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, ease: "linear", repeat: Infinity }}
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-200 opacity-50"
            />
            <Activity className="w-24 h-24 text-blue-600" />
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center md:hidden"
          >
            <h1 className="text-6xl font-extrabold text-slate-900 tracking-tight mb-2">MediKiosk</h1>
            <p className="text-2xl text-slate-500 font-medium">Smart Patient Triage</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Desktop Text Info */}
      <div className="hidden md:flex flex-1 w-full h-full bg-slate-50 flex-col justify-center px-16 lg:px-24">
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm mb-6">
            AYUSH Ministry Prototype
          </div>
          <h1 className="text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
            MediKiosk
          </h1>
          <p className="text-2xl text-slate-600 font-medium mb-8 max-w-lg">
            Smart Patient Triage platform powered by AI. Bringing traditional medicine into the digital age.
          </p>
          
          <div className="flex gap-4">
            <div className="w-12 h-2 bg-blue-600 rounded-full animate-pulse" />
            <div className="w-12 h-2 bg-slate-300 rounded-full" />
            <div className="w-12 h-2 bg-slate-300 rounded-full" />
          </div>
        </motion.div>
      </div>

    </main>
  );
}
