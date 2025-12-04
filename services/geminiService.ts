import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AppState } from "../types";

// Helper to sanitize data for the AI to reduce token usage
const prepareContext = (state: AppState) => {
  const summary = {
    tanks: state.tanks.map(t => ({
      name: t.name,
      fuel: t.fuelType,
      level: t.currentLevel,
      capacity: t.capacity,
      percent: Math.round((t.currentLevel / t.capacity) * 100) + '%'
    })),
    recentTransactions: state.transactions.slice(0, 20), // Send last 20 for context
    alerts: state.alerts.filter(a => !a.acknowledged),
    totalRevenue: state.transactions.reduce((acc, t) => acc + t.amount, 0),
    totalVolume: state.transactions.reduce((acc, t) => acc + t.liters, 0)
  };
  return JSON.stringify(summary, null, 2);
};

export const generateAIResponse = async (
  prompt: string,
  state: AppState
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key is missing");

    const ai = new GoogleGenAI({ apiKey });
    const contextData = prepareContext(state);

    const systemInstruction = `
      You are an expert Fuel Station Operations Analyst assistant.
      You have access to the current station data in JSON format provided below.
      
      Your role is to:
      1. Analyze sales trends and inventory levels.
      2. Detect anomalies (e.g., if a tank level is critically low despite low sales, suggest a leak check).
      3. Help the station manager make decisions on restocking.
      4. Summarize financial performance.

      Current Data Context:
      ${contextData}

      Rules:
      - Be concise and professional.
      - Use bullet points for lists.
      - If inventory is below 20%, strictly warn the user.
      - If asked about "anomalies", check for discrepancies between sales volume and tank level drops (if data permits inference).
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2, // Low temperature for analytical accuracy
      }
    });

    return response.text || "I couldn't generate a response based on the current data.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I am currently unable to process your request. Please check your API key configuration.";
  }
};