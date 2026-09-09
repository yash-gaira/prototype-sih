import { NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { storeDocumentChunks } from "@/lib/embeddings";
import Tesseract from "tesseract.js";
// Use require for CommonJS module compatibility in Turbopack
const pdf = require("pdf-parse");

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const sessionId = formData.get("sessionId") as string;

    if (!file || !sessionId) {
      return NextResponse.json({ error: "Missing file or sessionId" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = "";

    // 1. EXTRACT TEXT
    if (file.type === "application/pdf") {
      const pdfData = await pdf(buffer);
      extractedText = pdfData.text;
    } else if (file.type.startsWith("image/")) {
      const { data: { text } } = await Tesseract.recognize(buffer, "eng");
      extractedText = text;
    } else {
      return NextResponse.json({ error: "Unsupported file type. Please upload a PDF or Image." }, { status: 400 });
    }

    if (!extractedText.trim()) {
      return NextResponse.json({ error: "No text could be extracted from the file." }, { status: 400 });
    }

    // 2. CHUNKING
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 100,
    });
    
    const chunks = await splitter.splitText(extractedText);

    // 3. STORE IN VECTOR DB
    await storeDocumentChunks(sessionId, chunks);

    return NextResponse.json({ 
      success: true, 
      message: "Report successfully analyzed and indexed.",
      chunksProcessed: chunks.length 
    });

  } catch (error: any) {
    console.error("Upload Report Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
