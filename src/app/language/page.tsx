"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ChevronDown, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LanguageScreen() {
  const router = useRouter();
  const [showOtherLangs, setShowOtherLangs] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");

  const otherLanguages = ["Bengali", "Marathi", "Telugu", "Tamil", "Gujarati"];

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 max-w-3xl mx-auto w-full min-h-screen">
      <div className="w-full space-y-16 text-center">
        
        {/* Greeting Section */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
            Welcome to MediKiosk
          </h1>
          <p className="text-3xl text-slate-600 font-medium">
            Please select your language
          </p>
        </div>

        {/* Language Selection */}
        <div className="space-y-6 flex flex-col items-center w-full">
          <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
            <Button 
              size="lg" 
              variant={selectedLang === "English" ? "default" : "outline"}
              onClick={() => setSelectedLang("English")}
              className="text-3xl"
            >
              English
            </Button>
            <Button 
              size="lg" 
              variant={selectedLang === "Hindi" ? "default" : "outline"}
              onClick={() => setSelectedLang("Hindi")}
              className="text-3xl font-sans"
            >
              हिन्दी
            </Button>
          </div>

          {/* Other Languages Dropdown */}
          <div className="w-full max-w-lg relative">
            <Button 
              size="lg"
              variant="ghost" 
              className="w-full text-2xl flex justify-between bg-slate-100 hover:bg-slate-200"
              onClick={() => setShowOtherLangs(!showOtherLangs)}
            >
              <span>{otherLanguages.includes(selectedLang) ? selectedLang : "Other Languages"}</span>
              <ChevronDown className={`w-8 h-8 transition-transform ${showOtherLangs ? "rotate-180" : ""}`} />
            </Button>

            <AnimatePresence>
              {showOtherLangs && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-10"
                >
                  {otherLanguages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLang(lang);
                        setShowOtherLangs(false);
                      }}
                      className="w-full text-left px-8 py-5 text-2xl hover:bg-blue-50 active:bg-blue-100 transition-colors border-b border-slate-100 last:border-0 text-slate-800 font-medium"
                    >
                      {lang}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Primary Action */}
        <div className="pt-12">
          <Button 
            size="xl" 
            className="w-full max-w-lg shadow-xl shadow-blue-200"
            onClick={() => router.push("/consult")}
          >
            Continue
            <ArrowRight className="w-10 h-10 ml-4" />
          </Button>
        </div>

      </div>
    </main>
  );
}
