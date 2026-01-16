
import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem } from "../types";

// Always use a named parameter for apiKey and obtain it exclusively from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBusinessInsights = async (salesData: any[], inventory: any[]) => {
  const prompt = `
    As a restaurant business consultant, analyze this week's data:
    Sales Summary: ${JSON.stringify(salesData)}
    Low Inventory: ${JSON.stringify(inventory.filter(i => i.stock <= i.minThreshold))}
    
    Provide 3 actionable insights to improve profit or efficiency. 
    Format the response as a JSON array of strings.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    // Use the .text property to get the response string.
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Error:", error);
    return ["Optimize staffing during peak hours", "Review prices for high-volume items", "Check inventory for waste reduction"];
  }
};

export const suggestNewMenuDescription = async (itemName: string) => {
  const prompt = `Write a mouth-watering, sophisticated 20-word menu description for "${itemName}".`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Use the .text property to get the response string.
    return response.text || "Freshly prepared with high-quality ingredients.";
  } catch (error) {
    return "Chef's special preparation using fresh local ingredients.";
  }
};
