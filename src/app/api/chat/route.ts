import { NextResponse } from 'next/server';

const GROQ_KEYS = [
  process.env.GROQ_API_KEY,
  process.env.NEXT_PUBLIC_GROQ_API_KEY,
  process.env.GROQ_API_KEY_1,
  process.env.GROQ_API_KEY_2
].filter(Boolean) as string[];

let currentKeyIndex = 0;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

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
          model: "llama3-8b-8192",
          messages: messages
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
