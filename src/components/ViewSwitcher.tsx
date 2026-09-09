"use client";

import { usePathname, useRouter } from "next/navigation";
import { User, Stethoscope } from "lucide-react";

export default function ViewSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/login") return null;

  const isDoctor = pathname.includes("doctor");

  return (
    <div className="fixed bottom-6 right-6 z-50 flex bg-white rounded-full shadow-2xl p-1 border border-slate-200">
      <button
        onClick={() => router.push("/dashboard")}
        className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-colors ${
          !isDoctor ? "bg-emerald-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-100"
        }`}
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">Patient</span>
      </button>
      <button
        onClick={() => router.push("/doctor-dashboard")}
        className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-colors ${
          isDoctor ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-100"
        }`}
      >
        <Stethoscope className="w-4 h-4" />
        <span className="hidden sm:inline">Doctor</span>
      </button>
    </div>
  );
}
