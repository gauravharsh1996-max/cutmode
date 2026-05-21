import type { CoachRecommendation } from "@/types";
import { cravingAlternative } from "@/lib/nutrition/food-database";

export type CoachInput = {
  calories: number;
  calorieTarget: number;
  protein: number;
  proteinTarget: number;
  deficit: number;
  remainingCalories: number;
  workoutCalories?: number;
  hungerLevel?: number;
  craving?: string;
  sodiumMg?: number;
};

export function buildCoachRecommendations(input: CoachInput): CoachRecommendation[] {
  const recommendations: CoachRecommendation[] = [];

  if (input.protein < input.proteinTarget * 0.85) {
    recommendations.push({
      title: "Protein is the lever today",
      message: "You are low on protein. Add eggs, Greek yogurt, whey, paneer, shrimp, or chicken before adding snack calories.",
      priority: "high",
      category: "protein"
    });
  }

  if (input.remainingCalories > 350) {
    recommendations.push({
      title: "Calories still available",
      message: `You still have about ${Math.round(input.remainingCalories)} kcal remaining. Use it for a filling high-protein meal instead of grazing.`,
      priority: "medium",
      category: "calories"
    });
  }

  if (input.deficit >= 650) {
    recommendations.push({
      title: "Great deficit day",
      message: "This is a strong fat-loss day. Keep dinner satisfying so tomorrow does not rebound into extra hunger.",
      priority: "low",
      category: "mindset"
    });
  }

  if (input.sodiumMg && input.sodiumMg > 2400) {
    recommendations.push({
      title: "Expect scale noise",
      message: "Restaurant or salty food can pull water in for 24-48 hours. Judge the weekly average, not tomorrow morning alone.",
      priority: "medium",
      category: "recovery"
    });
  }

  if (input.workoutCalories && input.workoutCalories > 450) {
    recommendations.push({
      title: "Recovery meal",
      message: "Hard session logged. A lean protein plus carbs meal will support training without breaking the deficit.",
      priority: "medium",
      category: "recovery"
    });
  }

  if (input.craving) {
    recommendations.push({
      title: "Craving mode",
      message: cravingAlternative(input.craving, input.remainingCalories),
      priority: "medium",
      category: "craving"
    });
  }

  if (!recommendations.length) {
    recommendations.push({
      title: "Steady and boring works",
      message: "Nothing dramatic to fix. Keep protein anchored, log honestly, and let the 10-day deficit do the work.",
      priority: "low",
      category: "mindset"
    });
  }

  return recommendations;
}
