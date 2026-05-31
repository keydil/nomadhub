import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is missing' }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
    }

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');
    const mimeType = file.type;

    // Use Gemini 2.5 Flash - the cutting-edge stable model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3.1-flash-lite',
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      You are an expert culinary marketer and AI assistant for a mobile F&B SaaS platform.
      Analyze the provided image of food.
      
      Provide your response in raw JSON format (without any markdown blocks or code fences) with exactly these four keys:
      1. "title": A catchy, appetizing name for the dish.
      2. "description": A mouth-watering, marketing-friendly description of the dish.
      3. "suggestedPrice": An estimated reasonable price for this street food / food truck dish in Indonesian Rupiah (IDR). Format it as a string without 'Rp', just numbers and separators, e.g., "45.000".
      4. "category": A short, broad category for this item (e.g., "Makanan Utama", "Minuman", "Gorengan", "Snack", "Dessert", "Frozen Food", etc).
      
      Respond ONLY with the JSON object.
    `;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    let text = response.text();

    // Clean up potential markdown formatting if the model still outputs it
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsedData = JSON.parse(text);

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('Error analyzing food image:', error);
    return NextResponse.json({ error: error.message || 'Failed to analyze image' }, { status: 500 });
  }
}
