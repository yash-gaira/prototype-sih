"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { updateAppointmentStatus } from "@/lib/firestoreService";
import { motion } from "framer-motion";

function ScanProcessor() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!id) {
      setStatus("error");
      return;
    }

    const markArrived = async () => {
      try {
        await updateAppointmentStatus(id, "Waiting");
        setStatus("success");
        // Optionally redirect to home after 3 seconds
        setTimeout(() => router.push("/"), 3000);
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    markArrived();
  }, [id, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-[#F8F9FA] px-6 text-center">
      {status === "loading" && (
        <div className="space-y-4">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">Processing Check-in...</h2>
          <p className="text-slate-500 text-sm">Please wait while we notify the doctor.</p>
        </div>
      )}

      {status === "success" && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 max-w-sm w-full"
        >
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Check-in Successful!</h2>
          <p className="text-slate-500 text-sm mb-6">
            The doctor has been notified of your arrival. Please take a seat in the waiting area.
          </p>
          <p className="text-xs font-bold text-emerald-600 bg-emerald-50 py-2 rounded-lg">
            Status updated to "Waiting"
          </p>
        </motion.div>
      )}

      {status === "error" && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-red-100 max-w-sm w-full">
          <h2 className="text-xl font-bold text-red-600 mb-2">Invalid QR Code</h2>
          <p className="text-slate-500 text-sm">We couldn't process this check-in. Please contact the reception.</p>
        </div>
      )}
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ScanProcessor />
    </Suspense>
  );
}
