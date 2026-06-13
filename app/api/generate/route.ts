import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Client initialize karo (Ye Vercel ke environment variables se key auto-pick karega, safe tarike se)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { prompt, language, tone } = await request.json();

    // System instructions text pipeline setup
    const systemInstruction = `You are Zyntax AI, an expert content generator. 
    You must strictly respond in ${language || 'Hinglish'}. 
    Maintain a ${tone || 'Professional'} tone throughout the text output.`;

    const fullPrompt = `${systemInstruction}\n\nUser Prompt: ${prompt}`;

    // Gemini 2.5 Flash model request trigger
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    const replyText = response.text || "Sorry, I couldn't process that query.";
    return NextResponse.json({ text: replyText });

  } catch (error: any) {
    console.error("Zyntax Core Engine Error:", error);
    return NextResponse.json(
      { error: "Zyntax Engine connection failed.", details: error.message },
      { status: 500 }
    );
  }
}

