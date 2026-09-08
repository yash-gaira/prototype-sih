"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { AlertToast } from "@/components/ui/AlertToast";
import { Mic, FileText, Send, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

// Groq API Keys
const GROQ_KEYS = [
  process.env.NEXT_PUBLIC_GROQ_API_KEY,
  // Add other keys via environment variables, not hardcoded
].filter(Boolean) as string[];

export default function ConsultPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: "Hello! Where are you experiencing the pain or discomfort today?" }
  ]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  
  const currentKeyIndex = useRef(0);

  // Mock checking for critical keywords
  useEffect(() => {
    const lastUserMsg = messages.filter(m => m.role === 'user').pop();
    if (lastUserMsg && lastUserMsg.text.toLowerCase().includes("chest pain")) {
      setAlertOpen(true);
    }
  }, [messages]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Use the internal Next.js API route to avoid CORS and securely handle keys
  const callGroqAPI = async (chatMessages: {role: 'ai' | 'user', text: string}[]): Promise<string> => {
    const formattedMessages = chatMessages.map(msg => ({
      role: msg.role === 'ai' ? 'assistant' : 'user',
      content: msg.text
    }));
    
    let patientContext = "";
    try {
      const storedProfile = localStorage.getItem("medikiosk_patient_profile");
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        patientContext = `The patient's name is ${profile.name || 'Unknown'}, DOB is ${profile.dob || 'Unknown'}, Gender is ${profile.gender || 'Unknown'}. Greet them by name and be aware of their age/gender if it is relevant. `;
      }
    } catch(e) {}

    // Add a system prompt for behavior
    formattedMessages.unshift({ 
      role: "system", 
      content: `You are MediKiosk, an expert AI medical triage assistant used by patients in a hospital waiting room (OPD).
${patientContext}
Your goals:
1. Ask ONE brief, empathetic follow-up question at a time to understand their symptoms.
2. If the patient mentions severe or red-flag symptoms (e.g., chest pain, stroke signs, severe bleeding, sudden loss of vision, unbearable pain, difficulty breathing), you MUST prepend your response with the exact tag: [CRITICAL]
3. Keep language very simple, accessible, and suitable for elderly patients. Do not give medical diagnoses, only gather information.`
    });

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: formattedMessages })
    });

    if (!response.ok) {
      throw new Error("Failed to connect to AI server");
    }
    
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.text;
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userText = inputText;
    const newMessages: {role: 'ai'|'user', text: string}[] = [...messages, { role: 'user', text: userText }];
    
    setMessages(newMessages);
    setInputText("");
    setIsLoading(true);

    try {
      let aiResponse = await callGroqAPI(newMessages);
      
      // Check if AI flagged this as a critical symptom
      if (aiResponse.includes("[CRITICAL]")) {
        setAlertOpen(true);
        aiResponse = aiResponse.replace("[CRITICAL]", "").trim();
        
        // Save to local storage so the Doctor Panel can see it
        localStorage.setItem("medikiosk_critical_alert", "true");
        localStorage.setItem("medikiosk_critical_reason", userText);
      }

      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', text: "I'm having trouble connecting. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please type instead.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US'; // Or map to selected language
    recognition.interimResults = true; // Show results as they speak
    recognition.continuous = true; // Keep listening until toggled off

    let finalTranscript = '';

    recognition.onstart = () => setIsRecording(true);
    
    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setInputText(finalTranscript + interimTranscript);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognition.start();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMessages(prev => [
        ...prev, 
        { role: 'user', text: `[Uploaded Document: ${file.name}]` },
        { role: 'ai', text: `I have scanned ${file.name}. How can I help you with this?` }
      ]);
    }
  };

  return (
    <main className="flex justify-center min-h-screen bg-slate-100 font-sans sm:p-4 md:p-8">
      <div className="w-full max-w-md md:max-w-6xl md:w-full bg-white sm:rounded-3xl relative shadow-2xl overflow-hidden border-x border-slate-200 sm:border-y flex flex-col md:flex-row min-h-[100dvh] md:min-h-[800px]">
        
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden">
          <AlertToast 
            message="Critical symptom detected: Chest Pain. Please proceed to immediate triage or alert the nurse!" 
            isOpen={alertOpen} 
            onClose={() => setAlertOpen(false)} 
          />

          {/* Header */}
          <header className="px-6 pt-8 pb-4 bg-white flex justify-between items-center z-10 shrink-0 shadow-sm border-b border-slate-100 relative">
            <div>
              <h2 className="text-xl md:text-3xl font-bold text-slate-800 tracking-tight">MediKiosk AI</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Smart Medical Triage</p>
            </div>
            <Button variant="outline" size="sm" className="md:hidden text-xs" onClick={() => router.push("/dashboard")}>
              Exit
            </Button>
            <Button variant="outline" size="lg" className="hidden md:flex" onClick={() => router.push("/doctor")}>
              Doctor View
            </Button>
          </header>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto space-y-4 md:space-y-6 p-4 md:p-8 pb-32">
            {messages.map((msg, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`p-4 md:p-6 rounded-2xl md:rounded-3xl max-w-[85%] md:max-w-[75%] shadow-sm ${
                  msg.role === 'ai' 
                    ? 'bg-white text-slate-800 rounded-tl-sm md:rounded-tl-none border border-slate-200' 
                    : 'bg-blue-600 text-white rounded-tr-sm md:rounded-tr-none'
                }`}>
                  <p className="text-base md:text-xl leading-relaxed font-medium">{msg.text}</p>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-4 md:p-6 bg-white text-slate-800 rounded-2xl md:rounded-3xl rounded-tl-sm md:rounded-tl-none border border-slate-200 shadow-sm flex items-center gap-3">
                  <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin text-blue-600" />
                  <span className="text-base md:text-xl font-medium">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area (Sticky Bottom) */}
          <div className="absolute bottom-0 left-0 right-0 bg-white p-4 md:p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-t border-slate-100 z-20">
            {/* Voice Button floating above */}
            <div className="absolute left-1/2 -top-10 md:-top-12 -translate-x-1/2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleRecording}
                className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-xl transition-colors border-4 ${
                  isRecording 
                    ? 'bg-red-500 border-red-200 animate-pulse shadow-red-200' 
                    : 'bg-blue-600 border-white hover:bg-blue-700 shadow-blue-200'
                }`}
              >
                <Mic className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </motion.button>
            </div>
            
            {/* Text Input Row */}
            <div className="flex gap-2 md:gap-4 items-center mt-6 md:mt-8">
              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isRecording ? "Listening..." : "Type your symptoms..."}
                className="flex-1 p-3 md:p-4 text-base md:text-lg bg-slate-50 border-2 border-slate-200 rounded-xl md:rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              />
              <Button size="lg" onClick={handleSend} disabled={!inputText.trim() || isLoading} className="h-full py-3 md:py-4 px-4 md:px-8 rounded-xl md:rounded-2xl">
                <Send className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
            </div>

            {/* OCR Button & Submit */}
            <input 
              type="file" 
              accept="image/*,.pdf" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
            />
            <div className="flex gap-2 md:gap-4 mt-3 md:mt-4">
              <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm" className="flex-1 text-sm md:text-base py-4 md:py-6 rounded-xl md:rounded-2xl border-slate-300 text-slate-700 hover:bg-slate-50">
                <FileText className="w-4 h-4 md:w-5 md:h-5 mr-2 text-slate-500" />
                <span className="hidden md:inline">Scan Old Reports</span>
                <span className="md:hidden">Scan</span>
              </Button>
              
              <Button onClick={() => router.push("/dashboard")} variant="default" size="sm" className="flex-1 text-sm md:text-base py-4 md:py-6 rounded-xl md:rounded-2xl bg-[#0f4b3e] hover:bg-emerald-800 text-white font-bold shadow-lg">
                Submit to Doctor
              </Button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
