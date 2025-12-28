
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getGeminiResponse = async (prompt: string, history: { role: 'user' | 'model'; parts: { text: string }[] }[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: "You are an expert academic tutor. You are helpful, concise, and professional. You assist students in Biology, History, Calculus, and more. When creating study notes, focus on structure and clarity. Always address the student by name, Alex.",
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Something went wrong. Please check your connection and API key.";
  }
};
