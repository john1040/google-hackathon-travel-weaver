import { GoogleGenAI, Type } from '@google/genai';
import { TripFormData, Itinerary } from '../types.ts';

// Initialize the SDK. It expects process.env.API_KEY to be available in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

export const generateItinerary = async (data: TripFormData): Promise<Itinerary> => {
  const prompt = `
    Create a detailed travel itinerary for a trip to ${data.destination} lasting ${data.days} days.
    Consider the following user preferences: "${data.preferences || 'None specified'}".
    
    Provide a realistic, well-paced schedule. Include specific times, descriptions of activities, and exact geographic coordinates (latitude and longitude) for every stop.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            destination: {
              type: Type.STRING,
              description: 'The confirmed destination for the trip.',
            },
            days: {
              type: Type.ARRAY,
              description: 'An array of daily plans.',
              items: {
                type: Type.OBJECT,
                properties: {
                  day: {
                    type: Type.INTEGER,
                    description: 'The day number (e.g., 1, 2, 3).',
                  },
                  theme: {
                    type: Type.STRING,
                    description: 'A short theme or title for the day (e.g., "Arrival & City Exploration").',
                  },
                  stops: {
                    type: Type.ARRAY,
                    description: 'List of stops for this day.',
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: {
                          type: Type.STRING,
                          description: 'Name of the location or activity.',
                        },
                        type: {
                          type: Type.STRING,
                          description: 'Type of stop (e.g., Restaurant, Museum, Park, Transit).',
                        },
                        lat: {
                          type: Type.NUMBER,
                          description: 'Latitude of the location.',
                        },
                        lng: {
                          type: Type.NUMBER,
                          description: 'Longitude of the location.',
                        },
                        time: {
                          type: Type.STRING,
                          description: 'Time of the activity (e.g., "09:00 AM" or "Morning").',
                        },
                        description: {
                          type: Type.STRING,
                          description: 'Detailed description of what to do.',
                        },
                      },
                      required: ['name', 'type', 'lat', 'lng', 'time', 'description'],
                    },
                  },
                },
                required: ['day', 'stops'],
              },
            },
          },
          required: ['destination', 'days'],
        },
      },
    });

    const jsonStr = response.text.trim();
    const itinerary: Itinerary = JSON.parse(jsonStr);
    return itinerary;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw new Error("Failed to generate itinerary. Please try again.");
  }
};
