import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API Key not configured' }, { status: 500 });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are an AI assistant built into Vamsi Batchu's personal portfolio terminal (vamsibatchu-cli). 
                Keep your responses concise, creative, and slightly technical to match the brutalist terminal aesthetic.
                The user's portfolio contains projects like gridscape (AI mapping), worldwide (geo tactical), elemental (science interactive), canopy (cinema visualization), and warpfield (particle simulation).
                
                User question: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: 200,
          temperature: 0.7,
        }
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
        console.error('Google API Error:', data);
        return NextResponse.json({ error: data.error?.message || 'AI request failed' });
    }

    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "System: Response empty.";

    return NextResponse.json({ response: aiResponse });
  } catch (error: any) {
    console.error('Terminal API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal system error' });
  }
}
