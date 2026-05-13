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

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // IMPORTANT PROMPT ADJUSTMENT:
    // Focus entirely on the input dish, unrelated to general store constraints.
    const prompt = `
      You are a professional Indonesian culinary copywriter.
      The user provides the name of a specific food item: "${title}"
      
      Write a high-conversion, mouth-watering marketing description for exactly this item.
      Even though the shop name may vary, DO NOT focus on the shop name. Focus 100% on the TASTE, TEXTURE, and EXPERIENCE of eating "${title}".
      
      At the end of the description, add 3-5 relevant Instagram-style hashtags specific to this dish.
      
      Return raw string text output directly. No JSON, no wrappers. Just the final description text ready to be pasted.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const polishedText = response.text().trim();

    return NextResponse.json({ description: polishedText });
  } catch (error: any) {
    console.error('Error generating magic polish:', error);
    return NextResponse.json({ error: error.message || 'Failed to polish description' }, { status: 500 });
  }
}
