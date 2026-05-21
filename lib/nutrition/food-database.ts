import type { MealEstimate, MealEstimateItem } from "../../types";

export type FoodDatabaseItem = {
  name: string;
  aliases: string[];
  category: string;
  cuisine?: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
  sodiumMg?: number;
  isHighProtein?: boolean;
  sodiumWarning?: boolean;
};

export const foodDatabase: FoodDatabaseItem[] = [
  {
    name: "Paneer tikka",
    aliases: ["paneer", "paneer dish", "tandoori paneer"],
    category: "Indian",
    cuisine: "Indian",
    serving: "180g plate",
    calories: 420,
    protein: 28,
    carbs: 14,
    fats: 28,
    fiber: 3,
    sodiumMg: 900,
    isHighProtein: true
  },
  {
    name: "Shrimp curry",
    aliases: ["prawn curry", "shrimp masala", "jhinga curry"],
    category: "Indian",
    cuisine: "Indian",
    serving: "1 bowl",
    calories: 360,
    protein: 34,
    carbs: 12,
    fats: 19,
    fiber: 2,
    sodiumMg: 980,
    isHighProtein: true
  },
  {
    name: "Butter chicken",
    aliases: ["chicken curry", "restaurant chicken", "murgh makhani"],
    category: "Restaurant",
    cuisine: "Indian",
    serving: "1 bowl",
    calories: 560,
    protein: 38,
    carbs: 17,
    fats: 36,
    sodiumMg: 1250,
    sodiumWarning: true,
    isHighProtein: true
  },
  {
    name: "Roti",
    aliases: ["chapati", "phulka"],
    category: "Indian bread",
    cuisine: "Indian",
    serving: "1 medium",
    calories: 110,
    protein: 3.5,
    carbs: 22,
    fats: 1.5,
    fiber: 3
  },
  {
    name: "Naan",
    aliases: ["butter naan", "garlic naan"],
    category: "Indian bread",
    cuisine: "Indian",
    serving: "1 piece",
    calories: 290,
    protein: 8,
    carbs: 46,
    fats: 8,
    sodiumMg: 600
  },
  {
    name: "Chicken momos",
    aliases: ["momos", "steamed momos", "dumplings"],
    category: "Street food",
    cuisine: "Indo-Tibetan",
    serving: "6 pieces",
    calories: 420,
    protein: 22,
    carbs: 52,
    fats: 13,
    sodiumMg: 1050,
    sodiumWarning: true
  },
  {
    name: "Veg momos",
    aliases: ["vegetable momos", "momos"],
    category: "Street food",
    cuisine: "Indo-Tibetan",
    serving: "6 pieces",
    calories: 380,
    protein: 12,
    carbs: 58,
    fats: 11,
    sodiumMg: 980,
    sodiumWarning: true
  },
  {
    name: "Masala oats",
    aliases: ["oats", "savory oats"],
    category: "Breakfast",
    cuisine: "Indian",
    serving: "1 bowl",
    calories: 310,
    protein: 13,
    carbs: 48,
    fats: 8,
    fiber: 8
  },
  {
    name: "Greek yogurt bowl",
    aliases: ["greek yogurt", "hung curd", "yogurt"],
    category: "High protein",
    serving: "250g",
    calories: 220,
    protein: 25,
    carbs: 18,
    fats: 5,
    isHighProtein: true
  },
  {
    name: "Whey protein shake",
    aliases: ["protein shake", "whey", "protein powder"],
    category: "Protein product",
    serving: "1 scoop with water",
    calories: 125,
    protein: 24,
    carbs: 3,
    fats: 2,
    isHighProtein: true
  },
  {
    name: "Chicken breast meal",
    aliases: ["grilled chicken", "chicken meal", "chicken rice"],
    category: "High protein",
    serving: "150g chicken plus rice",
    calories: 520,
    protein: 48,
    carbs: 48,
    fats: 12,
    isHighProtein: true
  },
  {
    name: "Egg sandwich",
    aliases: ["sandwich", "omelette sandwich", "egg toast"],
    category: "Cafe",
    serving: "1 sandwich",
    calories: 410,
    protein: 24,
    carbs: 38,
    fats: 18
  },
  {
    name: "Diet Coke",
    aliases: ["diet coke", "coke zero", "zero sugar cola"],
    category: "Craving",
    serving: "330ml can",
    calories: 2,
    protein: 0,
    carbs: 0,
    fats: 0,
    sodiumMg: 40
  },
  {
    name: "Chocolate",
    aliases: ["dark chocolate", "milk chocolate"],
    category: "Craving",
    serving: "25g",
    calories: 135,
    protein: 2,
    carbs: 14,
    fats: 8
  },
  {
    name: "Potato chips",
    aliases: ["chips", "crisps"],
    category: "Craving",
    serving: "30g pack",
    calories: 165,
    protein: 2,
    carbs: 16,
    fats: 10,
    sodiumMg: 210
  }
];

function scoreFoodMatch(food: FoodDatabaseItem, text: string) {
  const haystack = [food.name, ...food.aliases].join(" ").toLowerCase();
  const normalized = text.toLowerCase();

  if (normalized.includes(food.name.toLowerCase())) return 1;

  const aliasMatch = food.aliases.some((alias) => normalized.includes(alias.toLowerCase()));
  if (aliasMatch) return 0.86;

  const tokens = normalized.split(/\W+/).filter(Boolean);
  const hits = tokens.filter((token) => haystack.includes(token));
  return hits.length ? Math.min(0.72, hits.length / Math.max(tokens.length, 1)) : 0;
}

export function estimateMealFromText(input: string): MealEstimate {
  const matches = foodDatabase
    .map((food) => ({ food, score: scoreFoodMatch(food, input) }))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const selected =
    matches.length > 0
      ? matches
      : [
          {
            food: foodDatabase.find((food) => food.name === "Chicken breast meal") ?? foodDatabase[0],
            score: 0.42
          }
        ];

  const items: MealEstimateItem[] = selected.map(({ food, score }) => ({
    name: food.name,
    serving: food.serving,
    calories: food.calories,
    protein: food.protein,
    carbs: food.carbs,
    fats: food.fats,
    fiber: food.fiber ?? 0,
    sodiumMg: food.sodiumMg,
    confidence: Number(score.toFixed(2))
  }));

  const totals = items.reduce(
    (sum, item) => ({
      calories: sum.calories + item.calories,
      protein: sum.protein + item.protein,
      carbs: sum.carbs + item.carbs,
      fats: sum.fats + item.fats,
      fiber: sum.fiber + (item.fiber ?? 0),
      sodiumMg: sum.sodiumMg + (item.sodiumMg ?? 0)
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sodiumMg: 0 }
  );

  return {
    name: items.map((item) => item.name).join(" + "),
    source: "ai_photo",
    confidence: Number((items.reduce((sum, item) => sum + item.confidence, 0) / items.length).toFixed(2)),
    items,
    notes: [
      "Estimate uses common serving sizes. Weighing ingredients will improve accuracy.",
      totals.sodiumMg > 1800 ? "High sodium meal; temporary water retention is possible." : "Looks compatible with a steady deficit."
    ],
    ...totals,
    calories: Math.round(totals.calories)
  };
}

export function cravingAlternative(label: string, remainingCalories: number) {
  const lower = label.toLowerCase();

  if (lower.includes("momo")) {
    return remainingCalories >= 420
      ? "Fit 6 steamed momos into dinner, add a whey shake or Greek yogurt later for protein."
      : "Try 3 steamed momos plus grilled chicken or paneer so the craving fits without blowing the day.";
  }

  if (lower.includes("chocolate")) {
    return "Have 15-25g chocolate after a protein-rich meal. It is easier to stop when hunger is handled first.";
  }

  if (lower.includes("chips")) {
    return "Portion a small bowl, pair it with diet soda or Greek yogurt dip, and keep the packet away from the desk.";
  }

  if (lower.includes("diet coke") || lower.includes("coke")) {
    return "Diet Coke is fine in a deficit. Keep hydration steady and avoid using it as a meal replacement.";
  }

  return remainingCalories > 300
    ? `Plan a controlled serving of ${label} and anchor the next meal around lean protein.`
    : `Save ${label} for tomorrow or take a smaller portion with a high-protein snack now.`;
}
