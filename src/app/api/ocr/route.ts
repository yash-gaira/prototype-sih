import { NextResponse } from "next/response";

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing Groq API Key" }, { status: 500 });
    }

    const prompt = `You are a highly accurate OCR extraction system. Extract the following details from this Aadhaar Card image and return ONLY a valid JSON object, nothing else. Do not wrap it in markdown block quotes. If a field is not found, leave it empty.
Expected JSON format:
{
  "name": "Full Name",
  "dob": "DD/MM/YYYY or YYYY",
  "gender": "Male / Female / Other",
  "aadhaarNumber": "XXXX XXXX XXXX"
}`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.2-11b-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: imageBase64 } }
            ]
          }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq Vision API error:", err);
      return NextResponse.json({ error: "Failed to process image OCR" }, { status: 500 });
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
