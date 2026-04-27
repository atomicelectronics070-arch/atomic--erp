import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateAIResponse(systemPrompt: string, userMessage: string) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured in environment variables.");
    }

    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7,
            }
        });

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: `Instrucciones de comportamiento (Prompt de Sistema): ${systemPrompt}` }],
                },
                {
                    role: "model",
                    parts: [{ text: "Entendido. He procesado las instrucciones y actuaré bajo este rol en adelante." }],
                },
            ],
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini AI Error:", error);
        throw error;
    }
}


