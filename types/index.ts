export type MacroEstimate = {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
  sodiumMg?: number;
};

export type MealEstimateItem = MacroEstimate & {
  name: string;
  serving: string;
  confidence: number;
};

export type MealEstimate = MacroEstimate & {
  name: string;
  confidence: number;
  source: "manual" | "ai_photo" | "barcode" | "custom";
  items: MealEstimateItem[];
  notes: string[];
};

export type CoachRecommendation = {
  title: string;
  message: string;
  priority: "low" | "medium" | "high";
  category: "protein" | "calories" | "hydration" | "recovery" | "craving" | "mindset";
};
