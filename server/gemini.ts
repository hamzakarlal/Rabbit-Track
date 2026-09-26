import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

export function registerGeminiRoutes(app: express.Express) {
  // Verify API Key
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  app.post('/api/gemini/chat', async (req, res) => {
    try {
      if (!ai) {
        return res.status(503).json({
          error: 'Gemini API is not configured or GEMINI_API_KEY is missing.',
        });
      }

      const { messages, farmContext } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'messages array is required.' });
      }

      // Convert conversation messages into format for Gemini generateContent / multi-turn contents
      const contents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const systemInstruction = `You are "Barny", an expert Rabbitry and Cuniculture specialist AI assistant embedded in the "Rabbit Track" farm management mobile app.
Your goals:
1. Provide practical, accurate, farmer-oriented advice on rabbit husbandry, nutrition, kindling gestation (30-32 days), weaning (6 weeks), breeding cycles, cage sanitation, disease prevention (VHD, snuffles/pasteurellosis, GI stasis, ear mites), and farm profitability.
2. Keep responses structured, concise, and friendly.
3. When helpful, refer to the farmer's current herd data provided in the prompt context.
${farmContext ? `\nCurrent Farm Summary Context:\n${JSON.stringify(farmContext)}` : ''}`;

      // Using gemini-3.5-flash for high quality fast general farm reasoning
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || 'I could not generate a response. Please check back shortly.';
      return res.json({ reply: replyText });
    } catch (err: any) {
      console.error('Gemini API Error:', err);
      return res.status(500).json({
        error: err.message || 'Error communicating with Gemini AI.',
      });
    }
  });
}
