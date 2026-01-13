
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { OrganizedPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function organizeMaintenancePlan(text: string): Promise<OrganizedPlan> {
  const prompt = `
    Analyze the following maintenance plan text and structure it into a JSON object.
    The text is in Portuguese. Translate keys and status values to English in the final JSON.
    Infer the status of planning items. For example, '🟢' means 'Completed'. If there is no status indicator, assume 'Pending'.

    Here is the desired JSON schema:
    {
      "eventDetails": {
        "date": "string",
        "time": "string",
        "services": "string"
      },
      "planning": [
        {
          "task": "string",
          "status": "string (e.g., 'Completed', 'Pending')",
          "responsible": "string | null"
        }
      ],
      "safety": {
        "dc85": {
            "preparationBy": "string",
            "deadline": "string",
            "safetyResponsible": "string"
        }
      },
      "volunteers": ["string"],
      "documents": ["string"],
      "ppe": ["string"]
    }

    Maintenance Plan Text:
    ---
    ${text}
    ---

    Return ONLY the JSON object, with no additional text or markdown formatting.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        },
    });
    
    const jsonString = response.text;
    if (!jsonString) {
      throw new Error("Received empty response from API");
    }
    
    // Sometimes the model might wrap the JSON in markdown backticks, remove them.
    const cleanedJsonString = jsonString.replace(/^```json\n?/, '').replace(/\n?```$/, '');

    return JSON.parse(cleanedJsonString) as OrganizedPlan;
  } catch (error) {
    console.error("Error calling or parsing Gemini API response:", error);
    throw new Error("Failed to get a valid structured plan from the AI model.");
  }
}
