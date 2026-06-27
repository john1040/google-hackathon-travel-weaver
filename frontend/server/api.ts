import { GoogleGenAI } from '@google/genai';
import { CandidatePlace } from '../types.ts';

// Simulated Server-Side Endpoint: POST /candidates
// In a real Node.js backend, this would be an Express route handler.
// The Gemini API key is configured server-side via process.env.API_KEY.

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

export const getCandidates = async (destination: string, preferences: string): Promise<CandidatePlace[]> => {
  const prompt = `
    Find 6 to 8 candidate places to visit or eat at in ${destination}.
    Consider these preferences: "${preferences || 'None'}".
    
    You MUST return ONLY a valid JSON array. Do not include any markdown formatting, backticks, or extra text.
    
    Array items must be objects with exactly these keys:
    - "name": string
    - "place_id": string (generate a unique identifier)
    - "lat": number (latitude)
    - "lng": number (longitude)
    - "type": string (must be exactly "indoor", "outdoor", or "meal")
    - "opening_hours": string (e.g., "9:00 AM - 5:00 PM")
    - "rating": number (1.0 to 5.0)
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        // Note: The prompt requested 'google_maps' and 'google_search' tools.
        // Based on the @google/genai SDK guidelines, only 'googleSearch' is permitted in the tools array.
        // We enable googleSearch to ground the results with real-world data.
        // responseMimeType and responseSchema are omitted as required when using googleSearch.
        tools: [{ googleSearch: {} }],
      }
    });

    let text = response.text.trim();
    // Strip markdown code block formatting if the model includes it despite instructions
    text = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '');

    const candidates: CandidatePlace[] = JSON.parse(text);
    return candidates;
  } catch (error) {
    console.error("Error in /candidates endpoint:", error);
    throw new Error("Failed to fetch candidate places.");
  }
};
