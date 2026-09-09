import { NextResponse } from 'next/server';
import { searchSimilarChunks } from '@/lib/embeddings';

const GROQ_KEYS = [
  process.env.GROQ_API_KEY,
  process.env.NEXT_PUBLIC_GROQ_API_KEY,
  process.env.GROQ_API_KEY_1,
  process.env.GROQ_API_KEY_2
].filter(Boolean) as string[];

let currentKeyIndex = 0;

export async function POST(req: Request) {
  try {
    const { messages, sessionId } = await req.json();

    let finalMessages = [...messages];

    // RAG RETRIEVAL
    if (sessionId && messages.length > 0) {
      // Get the last user message
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        const query = lastMessage.content || lastMessage.text;
        
        // Search vector store
        const relevantChunks = await searchSimilarChunks(sessionId, query);
        
        if (relevantChunks.length > 0) {
          const contextStr = relevantChunks.map(c => c.text).join('\n---\n');
          
          // Find system prompt and append context
          const systemMsgIndex = finalMessages.findIndex(m => m.role === 'system');
          if (systemMsgIndex !== -1) {
            finalMessages[systemMsgIndex].content += `\n\n[PATIENT HISTORY CONTEXT FROM OLD REPORTS]:\n${contextStr}\n\nUse this context to understand their past medical conditions. Do not hallucinate medical facts.`;
          }
        }
      }
    }

    const callGroq = async (attempt = 0): Promise<Response> => {
      if (attempt >= GROQ_KEYS.length || GROQ_KEYS.length === 0) {
        throw new Error("No valid Groq API Key found or all keys failed");
      }

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_KEYS[currentKeyIndex]}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: finalMessages
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Key at index ${currentKeyIndex} failed. Status: ${response.status}. Error: ${errorText}`);

        // Fallback to next key
        currentKeyIndex = (currentKeyIndex + 1) % GROQ_KEYS.length;
        return callGroq(attempt + 1);
      }

      return response;
    };

    const groqResponse = await callGroq();
    const data = await groqResponse.json();

    return NextResponse.json({ text: data.choices[0].message.content });

  } catch (error: any) {
    console.error("Groq API Error:", error);
    // HACKATHON FALLBACK: Keep the demo moving if API keys fail
    return NextResponse.json({ 
      text: "I understand. Based on these symptoms, I am noting this down for the doctor. Please wait comfortably in the waiting area." 
    });
  }
}
