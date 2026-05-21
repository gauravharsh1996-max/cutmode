import {
  calculateDailyDeficit,
  calculateTenDayProgress,
  getDailyStatus,
  getWaterRetentionWarning,
  type DailyNutrition,
  type GoalSnapshot
} from "@/lib/nutrition/calculations";

export const mockGoal: GoalSnapshot = {
  calorieTarget: 2050,
  proteinTarget: 130,
  tenDayDeficitGoal: 5000,
  maintenanceCalories: 2650,
  currentWeightKg: 84.2,
  targetWeightKg: 78
};

export const nutritionHistory: DailyNutrition[] = [
  { date: "2026-05-11", calories: 2180, protein: 118, carbs: 212, fats: 72, workoutCalories: 220 },
  { date: "2026-05-12", calories: 1995, protein: 136, carbs: 178, fats: 64, workoutCalories: 420 },
  { date: "2026-05-13", calories: 2310, protein: 126, carbs: 242, fats: 82, workoutCalories: 0 },
  { date: "2026-05-14", calories: 1880, protein: 142, carbs: 160, fats: 56, workoutCalories: 370 },
  { date: "2026-05-15", calories: 2060, protein: 132, carbs: 190, fats: 66, workoutCalories: 260 },
  { date: "2026-05-16", calories: 2245, protein: 116, carbs: 238, fats: 78, workoutCalories: 110 },
  { date: "2026-05-17", calories: 1920, protein: 151, carbs: 166, fats: 58, workoutCalories: 510 },
  { date: "2026-05-18", calories: 2010, protein: 139, carbs: 182, fats: 62, workoutCalories: 350 },
  { date: "2026-05-19", calories: 2145, protein: 121, carbs: 220, fats: 74, workoutCalories: 180 },
  { date: "2026-05-20", calories: 1548, protein: 92, carbs: 132, fats: 48, workoutCalories: 310 }
];

export const mealsToday = [
  {
    id: "meal-1",
    name: "Masala oats with Greek yogurt",
    time: "08:40",
    source: "Manual",
    calories: 465,
    protein: 37,
    carbs: 64,
    fats: 9,
    confidence: 0.98
  },
  {
    id: "meal-2",
    name: "Shrimp curry, roti, salad",
    time: "13:20",
    source: "AI photo",
    calories: 612,
    protein: 42,
    carbs: 59,
    fats: 22,
    confidence: 0.82
  },
  {
    id: "meal-3",
    name: "Whey shake and banana",
    time: "17:15",
    source: "Barcode",
    calories: 278,
    protein: 26,
    carbs: 34,
    fats: 3,
    confidence: 0.96
  },
  {
    id: "meal-4",
    name: "Diet Coke and chocolate square",
    time: "19:10",
    source: "Craving Mode",
    calories: 193,
    protein: 2,
    carbs: 20,
    fats: 11,
    confidence: 0.9
  }
];

export const workouts = [
  {
    id: "workout-1",
    title: "Push hypertrophy",
    kind: "Gym",
    duration: 68,
    calories: 310,
    performedAt: "Today",
    exercises: ["Bench press 4x6", "Incline DB press 3x10", "Cable fly 3x12", "Triceps pushdown 3x14"]
  },
  {
    id: "workout-2",
    title: "Incline treadmill",
    kind: "Cardio",
    duration: 32,
    calories: 260,
    incline: 10,
    performedAt: "Yesterday",
    exercises: ["5.2 km/h", "Zone 2 finish"]
  },
  {
    id: "workout-3",
    title: "Pull day template",
    kind: "Trainer mode",
    duration: 74,
    calories: 340,
    performedAt: "2 days ago",
    exercises: ["Lat pulldown", "Chest-supported row", "Rear delt fly", "Hammer curls"]
  }
];

export const weightTrend = [
  { date: "May 1", weight: 85.4, average: 85.3, bodyFat: 24.1 },
  { date: "May 4", weight: 85.1, average: 85.2, bodyFat: 23.9 },
  { date: "May 7", weight: 84.9, average: 85.0, bodyFat: 23.8 },
  { date: "May 10", weight: 84.7, average: 84.9, bodyFat: 23.6 },
  { date: "May 13", weight: 84.8, average: 84.7, bodyFat: 23.5 },
  { date: "May 16", weight: 84.3, average: 84.5, bodyFat: 23.2 },
  { date: "May 20", weight: 84.2, average: 84.3, bodyFat: 23.0 }
];

export const analyticsTrend = nutritionHistory.map((day) => ({
  date: day.date.slice(5),
  calories: day.calories,
  protein: day.protein,
  deficit: calculateDailyDeficit(day, mockGoal.maintenanceCalories)
}));

export const dashboardSummary = (() => {
  const today = nutritionHistory.at(-1)!;
  const deficit = calculateDailyDeficit(today, mockGoal.maintenanceCalories);
  const tenDay = calculateTenDayProgress(nutritionHistory, mockGoal);
  const sodiumMg = 2320;

  return {
    today,
    deficit,
    tenDay,
    remainingCalories: mockGoal.calorieTarget - today.calories,
    remainingProtein: mockGoal.proteinTarget - today.protein,
    statuses: getDailyStatus({
      calories: today.calories,
      protein: today.protein,
      deficit,
      calorieTarget: mockGoal.calorieTarget,
      proteinTarget: mockGoal.proteinTarget
    }),
    waterWarning: getWaterRetentionWarning({
      sodiumMg,
      weightTodayKg: 84.2,
      weightSevenDayAverageKg: 84.3,
      hardWorkoutYesterday: true
    }),
    sodiumMg
  };
})();

export const achievements = [
  { title: "Protein Anchor", description: "Hit 130g protein 5 days this week" },
  { title: "Deficit Builder", description: "Crossed 60% of the 10-day target" },
  { title: "Honest Logger", description: "Logged cravings without breaking the plan" }
];
