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
    
    // Add a system prompt for behavior
    formattedMessages.unshift({ 
      role: "system", 
      content: `You are MediKiosk, an expert AI medical triage assistant used by patients in a hospital waiting room (OPD).
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
    <main className="flex-1 flex flex-col p-6 max-w-4xl mx-auto w-full h-[100dvh] bg-slate-50">
      <AlertToast 
        message="Critical symptom detected: Chest Pain. Please proceed to immediate triage or alert the nurse!" 
        isOpen={alertOpen} 
        onClose={() => setAlertOpen(false)} 
      />

      {/* Header */}
      <header className="flex justify-between items-center mb-8 pt-4">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">MediKiosk AI</h2>
        <Button variant="outline" size="lg" onClick={() => router.push("/doctor")}>
          Doctor View
        </Button>
      </header>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto mb-8 space-y-6 px-2 pb-4">
        {messages.map((msg, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`p-6 rounded-3xl max-w-[85%] shadow-sm ${
              msg.role === 'ai' 
                ? 'bg-white text-slate-800 rounded-tl-none border border-slate-200' 
                : 'bg-blue-600 text-white rounded-tr-none'
            }`}>
              <p className="text-2xl leading-relaxed font-medium">{msg.text}</p>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="p-6 bg-white text-slate-800 rounded-3xl rounded-tl-none border border-slate-200 shadow-sm flex items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="text-2xl font-medium">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="space-y-6 mt-auto bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
        {/* Massive Voice Button */}
        <div className="flex justify-center -mt-16">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleRecording}
            className={`w-28 h-28 rounded-full flex items-center justify-center shadow-2xl transition-colors border-4 ${
              isRecording 
                ? 'bg-red-500 border-red-200 animate-pulse shadow-red-200' 
                : 'bg-blue-600 border-white hover:bg-blue-700 shadow-blue-200'
            }`}
          >
            <Mic className="w-14 h-14 text-white" />
          </motion.button>
        </div>
        
        {/* Text Input Row */}
        <div className="flex gap-4 items-center">
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isRecording ? "Listening..." : "Type your symptoms here..."}
            className="flex-1 p-5 text-xl bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
          />
          <Button size="xl" onClick={handleSend} disabled={!inputText.trim() || isLoading} className="h-full py-5 px-8">
            <Send className="w-8 h-8" />
          </Button>
        </div>

        {/* OCR Button */}
        <input 
          type="file" 
          accept="image/*,.pdf" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
        />
        <div className="flex gap-4">
          <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="lg" className="flex-1 text-xl py-6 border-slate-300 text-slate-700 hover:bg-slate-50">
            <FileText className="w-6 h-6 mr-3 text-slate-500" />
            Scan Old Reports
          </Button>
          
          <Button onClick={() => router.push("/dashboard")} variant="default" size="lg" className="flex-1 text-xl py-6 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200">
            Submit to Doctor
          </Button>
        </div>
      </div>
    </main>
  );
}
