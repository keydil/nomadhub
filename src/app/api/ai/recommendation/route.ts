import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is missing' }, { status: 500 });
    }

    const body = await req.json();
    const { menuItems, timeOfDay, weather } = body;

    if (!menuItems || !Array.isArray(menuItems) || menuItems.length === 0) {
      return NextResponse.json({ error: 'No menu items provided' }, { status: 400 });
    }

    // Prepare a simplified list of items to save tokens
    const availableItems = menuItems.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      category: item.category
    }));

    // Use Gemini 3.1 Flash Lite - the cutting-edge stable model
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.1-flash-lite',
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      You are an expert culinary marketer and AI assistant for a mobile F&B SaaS platform.
      Your task is to generate 3 highly engaging, contextual promotional offers (Smart Offers) based on the user's current context and the available menu items.
      
      CONTEXT:
      - Time of Day: ${timeOfDay || 'Unknown'}
      - Weather: ${weather || 'Unknown'}
      
      AVAILABLE MENU ITEMS:
      ${JSON.stringify(availableItems, null, 2)}
      
      INSTRUCTIONS:
      Select 3 different items from the available menu that best fit the current context (e.g., hot drinks for cold weather, cold drinks for hot weather, heavy meals for lunch/dinner, snacks for afternoon).
      For each selected item, create a hyper-personalized promotional wrapper.
      
      Provide your response as a raw JSON array of 3 objects. Do NOT use markdown code blocks. The JSON array must look exactly like this:
      [
        {
          "itemId": "the exact string id of the selected menu item",
          "badge": "A short uppercase badge name, e.g., 'AIS REKOMENDASI PAGI'",
          "subBadge": "A short context sub-badge with emoji, e.g., '🌤️ CERAH WARM'",
          "badgeColor": "A Tailwind background color class matching the vibe, e.g., 'bg-amber-600', 'bg-blue-600', 'bg-teal-600', 'bg-rose-600'",
          "titlePrefix": "A catchy marketing prefix, e.g., 'Booster Pagi'",
          "desc": "A short, persuasive 1-2 sentence description connecting the food to the current context.",
          "discountMultiplier": 0.85
        },
        ... (2 more objects)
      ]
      
      NOTES:
      - The badge and subBadge must be in ALL CAPS.
      - The badgeColor MUST be a valid Tailwind CSS background color class.
      - The discountMultiplier should be a float between 0.70 and 0.95 (representing 5% to 30% off).
      - Make sure the itemId perfectly matches an id from the AVAILABLE MENU ITEMS.
      - Respond ONLY with the JSON array.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up potential markdown formatting if the model still outputs it
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsedData = JSON.parse(text);

    return NextResponse.json({ recommendations: parsedData });
  } catch (error: any) {
    console.error('Error generating AI recommendations:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate recommendations' }, { status: 500 });
  }
}
