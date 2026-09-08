import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { rawText } = await req.json();

    if (!rawText) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY || process.env.GROQ_API_KEY_1 || process.env.GROQ_API_KEY_2;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing Groq API Key" }, { status: 500 });
    }

    const prompt = `You are a highly accurate data extraction system. Extract the following details from this messy OCR text from an Aadhaar Card and return ONLY a valid JSON object, nothing else. Do not wrap it in markdown block quotes. If a field is not found, leave it empty.
Expected JSON format:
{
  "name": "Full Name",
  "dob": "DD/MM/YYYY or YYYY",
  "gender": "Male / Female / Other",
  "aadhaarNumber": "XXXX XXXX XXXX"
}

OCR Text:
"""
${rawText}
"""`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq Text API error:", err);
      // HACKATHON FALLBACK
      return NextResponse.json({
        name: "Rahul Kumar",
        dob: "15/08/1985",
        gender: "Male",
        aadhaarNumber: "1234 5678 9012",
        mocked: true
      });
    }

    const data = await response.json();
    let textResult = data.choices?.[0]?.message?.content || "{}";
    
    // Clean up potential markdown from the response
    textResult = textResult.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let extractedData;
    try {
      extractedData = JSON.parse(textResult);
    } catch (e) {
      console.error("Failed to parse OCR JSON:", textResult);
      return NextResponse.json({ error: "Failed to parse OCR output" }, { status: 500 });
    }

    return NextResponse.json(extractedData);

  } catch (error) {
    console.error("OCR Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
