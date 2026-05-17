import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is missing' }, { status: 500 });
    }

    const { title } = await req.json();

    if (!title) {
      return NextResponse.json({ error: 'Food title is required' }, { status: 400 });
    }

    console.log(`\x1b[45m[AI QUOTA]\x1b[0m Polishing item: ${title}`);

    const model = genAI.getGenerativeModel({
      model: 'gemini-3.1-flash-lite',
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      You are a professional Indonesian high-end culinary copywriter.
      The user provides the name of a specific food item: "\${title}"
      
      Write a mouth-watering marketing description and relevant hashtags.
      
      OUTPUT FORMAT (MUST BE PURE JSON):
      {
        "description": "Maksimal 2 kalimat singkat, fokus pada rasa/tekstur, elegan dan mewah",
        "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
      }
      
      RULES:
      1. Elegant and elite tone of voice.
      2. No hashtags inside the description field.
      3. Exactly 5 relevant Indonesian food hashtags in the array.
      4. Description MUST NOT exceed 2 short sentences.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const polishedJson = response.text().trim();

    return NextResponse.json({ result: JSON.parse(polishedJson) });
  } catch (error: any) {
    console.error('Error generating magic polish:', error);
    return NextResponse.json({ error: error.message || 'Failed to polish description' }, { status: 500 });
  }
}
