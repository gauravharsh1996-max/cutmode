import { differenceInCalendarDays, addDays } from "date-fns";
import { clamp } from "@/lib/utils";

export const KCAL_PER_KG_FAT = 7700;

export type SexForCalculation = "MALE" | "FEMALE" | "OTHER";
export type ActivityForCalculation =
  | "SEDENTARY"
  | "LIGHT"
  | "MODERATE"
  | "ACTIVE"
  | "VERY_ACTIVE";

export type DailyNutrition = {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  workoutCalories: number;
};

export type GoalSnapshot = {
  calorieTarget: number;
  proteinTarget: number;
  tenDayDeficitGoal: number;
  maintenanceCalories: number;
  targetWeightKg?: number | null;
  currentWeightKg?: number | null;
};

const activityMultipliers: Record<ActivityForCalculation, number> = {
  SEDENTARY: 1.2,
  LIGHT: 1.375,
  MODERATE: 1.55,
  ACTIVE: 1.725,
  VERY_ACTIVE: 1.9
};

export function calculateMaintenanceCalories(input: {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: SexForCalculation;
  activityLevel: ActivityForCalculation;
}) {
  const sexOffset = input.sex === "FEMALE" ? -161 : input.sex === "MALE" ? 5 : -78;
  const bmr = 10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age + sexOffset;
  return Math.round(bmr * activityMultipliers[input.activityLevel]);
}

export function calculateDailyDeficit(day: DailyNutrition, maintenanceCalories: number) {
  return Math.round(maintenanceCalories + day.workoutCalories - day.calories);
}

export function calculateRollingDeficit(days: DailyNutrition[], maintenanceCalories: number) {
  return days
    .slice(-10)
    .reduce((total, day) => total + calculateDailyDeficit(day, maintenanceCalories), 0);
}

export function calculateFatLossKg(deficitCalories: number) {
  return Number((deficitCalories / KCAL_PER_KG_FAT).toFixed(2));
}

export function calculateTenDayProgress(days: DailyNutrition[], goal: GoalSnapshot) {
  const rollingDeficit = calculateRollingDeficit(days, goal.maintenanceCalories);
  const remainingDeficit = Math.max(goal.tenDayDeficitGoal - rollingDeficit, 0);
  const elapsedDays = clamp(days.slice(-10).length, 1, 10);
  const daysLeft = Math.max(10 - elapsedDays, 1);
  const dailyRequiredDeficit = Math.ceil(remainingDeficit / daysLeft);
  const progressPercent = clamp(Math.round((rollingDeficit / goal.tenDayDeficitGoal) * 100), 0, 160);

  return {
    rollingDeficit,
    remainingDeficit,
    dailyRequiredDeficit,
    progressPercent,
    estimatedFatLossKg: calculateFatLossKg(rollingDeficit),
    message:
      rollingDeficit >= goal.tenDayDeficitGoal
        ? "You are ahead of schedule"
        : `Need ${dailyRequiredDeficit} kcal daily deficit to stay on target`
  };
}

export function estimateTargetDate(input: {
  currentWeightKg?: number | null;
  targetWeightKg?: number | null;
  averageDailyDeficit: number;
  from?: Date;
}) {
  if (!input.currentWeightKg || !input.targetWeightKg || input.currentWeightKg <= input.targetWeightKg) {
    return null;
  }

  const kgToLose = input.currentWeightKg - input.targetWeightKg;
  const totalDeficitNeeded = kgToLose * KCAL_PER_KG_FAT;
  const dailyDeficit = Math.max(input.averageDailyDeficit, 1);
  return addDays(input.from ?? new Date(), Math.ceil(totalDeficitNeeded / dailyDeficit));
}

export function getDailyStatus(input: {
  calories: number;
  protein: number;
  deficit: number;
  calorieTarget: number;
  proteinTarget: number;
}) {
  const labels = [];

  if (input.calories <= input.calorieTarget && input.protein >= input.proteinTarget) {
    labels.push("On Track");
  }

  if (input.calories > input.calorieTarget && input.calories <= input.calorieTarget + 200) {
    labels.push("Slightly Over");
  }

  if (input.protein < input.proteinTarget * 0.85) {
    labels.push("Protein Low");
  }

  if (input.deficit >= 650) {
    labels.push("Great Deficit Day");
  }

  return labels.length ? labels : ["Steady Day"];
}

export function getWaterRetentionWarning(input: {
  sodiumMg?: number | null;
  weightTodayKg?: number | null;
  weightSevenDayAverageKg?: number | null;
  hardWorkoutYesterday?: boolean;
}) {
  const elevatedWeight =
    input.weightTodayKg && input.weightSevenDayAverageKg
      ? input.weightTodayKg - input.weightSevenDayAverageKg > 0.7
      : false;

  if ((input.sodiumMg && input.sodiumMg > 2500) || input.hardWorkoutYesterday || elevatedWeight) {
    return "Scale jump may be temporary water retention from sodium, stress, soreness, or carbs.";
  }

  return null;
}

export function calculateWeeklyAverage(weights: { weightKg: number; loggedAt: Date }[]) {
  const latest = weights.at(-1)?.loggedAt ?? new Date();
  const recent = weights.filter((entry) => differenceInCalendarDays(latest, entry.loggedAt) <= 6);

  if (!recent.length) return null;
  return Number((recent.reduce((sum, entry) => sum + entry.weightKg, 0) / recent.length).toFixed(2));
}
