"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

export function AlertToast({ 
  message, 
  isOpen, 
  onClose 
}: { 
  message: string, 
  isOpen: boolean, 
  onClose: () => void 
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-lg"
        >
          <div className="bg-red-600 text-white p-6 rounded-2xl shadow-2xl flex items-center gap-4 border-4 border-red-700">
            <AlertTriangle className="w-12 h-12 flex-shrink-0 animate-pulse" />
            <div className="flex-1">
              <h3 className="text-2xl font-bold uppercase tracking-wide">Critical Alert</h3>
              <p className="text-xl mt-1 font-medium">{message}</p>
            </div>
            <button onClick={onClose} className="p-2 bg-red-700 hover:bg-red-800 rounded-full transition-colors">
              <X className="w-8 h-8" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
