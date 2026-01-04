
import { GoogleGenAI, Type } from "@google/genai";
import { ExtractedEvent } from "../types";

export const extractEventFromImage = async (base64Image: string): Promise<ExtractedEvent | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image.split(',')[1],
            },
          },
          {
            text: "You are an expert event coordinator. Extract event information from this image. " +
                  "Return a JSON object with: title, date (in YYYY-MM-DD format if possible), " +
                  "time (in HH:mm 24-hour format if possible), location, and a brief description. " +
                  "If you can't find a specific piece of information, provide your best guess based on context or leave it as an empty string.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            date: { type: Type.STRING },
            time: { type: Type.STRING },
            location: { type: Type.STRING },
            description: { type: Type.STRING },
          },
          required: ["title", "date", "time", "location", "description"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;

    return JSON.parse(text) as ExtractedEvent;
  } catch (error) {
    console.error("Error extracting event info:", error);
    return null;
  }
};
