import React from "react";
import { useRouter } from "next/navigation";
import { Home, Clock, Calendar, FileText, Sparkles } from "lucide-react";
import { t } from "@/lib/translations";

export default function Sidebar() {
  const router = useRouter();
  
  // We can just read the language from localStorage if we are in client, but since it's a quick fix, let's keep it simple
  const [language, setLanguage] = React.useState<string>("en");
  
  React.useEffect(() => {
    const savedLang = localStorage.getItem("preferredLanguage");
    if (savedLang) setLanguage(savedLang);
  }, []);

  return (
    <aside className="hidden md:flex w-64 bg-slate-50 border-r border-slate-200 flex-col py-8 px-4 justify-between shrink-0">
      <div>
        <div className="flex items-center gap-3 px-4 mb-4">
           <div className="w-10 h-10 bg-white shadow-sm border border-slate-200 rounded-xl flex items-center justify-center">
             <span className="text-xl">🌿</span>
           </div>
           <span className="text-xl font-extrabold text-slate-900 tracking-tight">MediKiosk</span>
        </div>
        <div className="px-4 mb-10">
          <img src="/ayush-logo.jpg" alt="Ministry of Ayush" className="w-full object-contain rounded-lg shadow-sm border border-slate-100 bg-white p-1" />
        </div>
        
        <nav className="space-y-2">
          <button onClick={() => router.push("/dashboard")} className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors">
            <Home className="w-5 h-5" /> {t(language, 'dashboard')}
          </button>
          <button onClick={() => router.push("/history")} className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors">
            <Clock className="w-5 h-5" /> {t(language, 'history')}
          </button>
          <button onClick={() => router.push("/history")} className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors">
            <Calendar className="w-5 h-5" /> {t(language, 'upcomingVisits')}
          </button>
          <button onClick={() => router.push("/documents")} className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors">
            <FileText className="w-5 h-5" /> {t(language, 'documents')}
          </button>
          <button onClick={() => router.push("/ai-summary")} className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors">
            <Sparkles className="w-5 h-5" /> {t(language, 'aiSummary')}
          </button>
        </nav>
      </div>
      
      <button 
        onClick={() => router.push("/consult")} 
        className="flex items-center justify-center gap-3 w-full px-4 py-4 bg-blue-600 text-white shadow-lg hover:bg-blue-700 rounded-2xl font-bold transition-all hover:-translate-y-1"
      >
         <Sparkles className="w-5 h-5" />
         {t(language, 'aiTriage')}
      </button>
    </aside>
  );
}
