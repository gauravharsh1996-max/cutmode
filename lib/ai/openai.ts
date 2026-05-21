import OpenAI from "openai";
import { estimateMealFromText } from "@/lib/nutrition/food-database";
import type { MealEstimate } from "@/types";

const nutritionSystemPrompt = `
You are CutMode Vision, a nutrition estimation assistant for sustainable fat loss and muscle preservation.
Analyze food images conservatively and return strict JSON only.
You understand Indian foods, restaurant meals, homemade meals, momos, paneer, shrimp curry, naan, roti, oats, Greek yogurt, sandwiches, protein shakes, and chicken meals.
Prioritize realistic serving estimates and note uncertainty. Never shame the user or recommend crash dieting.
JSON shape:
{
  "name": string,
  "confidence": number,
  "calories": number,
  "protein": number,
  "carbs": number,
  "fats": number,
  "fiber": number,
  "sodiumMg": number,
  "items": [{ "name": string, "serving": string, "calories": number, "protein": number, "carbs": number, "fats": number, "fiber": number, "sodiumMg": number, "confidence": number }],
  "notes": string[]
}
`;

function getClient() {
  if (!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function normalizeEstimate(parsed: unknown, fallbackText: string): MealEstimate {
  const fallback = estimateMealFromText(fallbackText);

  if (!parsed || typeof parsed !== "object") return fallback;
  const value = parsed as Partial<MealEstimate>;

  return {
    name: typeof value.name === "string" ? value.name : fallback.name,
    source: "ai_photo",
    confidence: Number(value.confidence ?? fallback.confidence),
    calories: Math.round(Number(value.calories ?? fallback.calories)),
    protein: Number(value.protein ?? fallback.protein),
    carbs: Number(value.carbs ?? fallback.carbs),
    fats: Number(value.fats ?? fallback.fats),
    fiber: Number(value.fiber ?? fallback.fiber ?? 0),
    sodiumMg: Number(value.sodiumMg ?? fallback.sodiumMg ?? 0),
    items: Array.isArray(value.items) && value.items.length ? value.items : fallback.items,
    notes: Array.isArray(value.notes) && value.notes.length ? value.notes : fallback.notes
  };
}

export async function analyzeMealImage(input: {
  imageBase64?: string;
  mimeType?: string;
  context?: string;
}): Promise<MealEstimate> {
  const client = getClient();
  const fallbackText = input.context || "mixed Indian high protein meal";

  if (!client || !input.imageBase64 || !input.mimeType) {
    return estimateMealFromText(fallbackText);
  }

  const imageUrl = `data:${input.mimeType};base64,${input.imageBase64}`;
  const model = process.env.OPENAI_VISION_MODEL || "gpt-4o-mini";

  try {
    const response = await client.chat.completions.create({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: nutritionSystemPrompt },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Estimate this meal. Context from user: ${input.context || "No context provided."}`
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high"
              }
            }
          ]
        }
      ]
    });

    const content = response.choices[0]?.message?.content;
    return normalizeEstimate(content ? JSON.parse(content) : null, fallbackText);
  } catch (error) {
    console.error("OpenAI meal analysis failed", error);
    return estimateMealFromText(fallbackText);
  }
}
