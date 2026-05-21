import { PrismaClient } from "@prisma/client";
import { subDays } from "date-fns";
import { foodDatabase } from "../lib/nutrition/food-database";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { clerkId: "seed_cutmode_user" },
    update: {},
    create: {
      clerkId: "seed_cutmode_user",
      email: "demo@cutmode.app",
      name: "CutMode Demo",
      goal: {
        create: {
          calorieTarget: 2050,
          proteinTarget: 130,
          tenDayDeficitGoal: 5000,
          startWeightKg: 86,
          currentWeightKg: 84.2,
          targetWeightKg: 78,
          heightCm: 178,
          age: 29,
          sex: "MALE",
          activityLevel: "MODERATE",
          maintenanceCalories: 2650
        }
      }
    }
  });

  await prisma.foodItem.createMany({
    data: foodDatabase.map((food) => ({
      name: food.name,
      category: food.category,
      cuisine: food.cuisine,
      servingLabel: food.serving,
      caloriesPerServing: food.calories,
      proteinPerServing: food.protein,
      carbsPerServing: food.carbs,
      fatsPerServing: food.fats,
      fiberPerServing: food.fiber ?? 0,
      isHighProtein: food.isHighProtein ?? false,
      sodiumWarning: food.sodiumWarning ?? false
    })),
  });

  const meals = [
    {
      name: "Masala oats with Greek yogurt",
      calories: 465,
      protein: 37,
      carbs: 64,
      fats: 9,
      source: "MANUAL" as const,
      loggedAt: subDays(new Date(), 0)
    },
    {
      name: "Shrimp curry, roti, salad",
      calories: 612,
      protein: 42,
      carbs: 59,
      fats: 22,
      source: "AI_PHOTO" as const,
      confidence: 0.82,
      sodiumMg: 980,
      loggedAt: subDays(new Date(), 0)
    },
    {
      name: "Paneer tikka wrap",
      calories: 520,
      protein: 31,
      carbs: 54,
      fats: 20,
      source: "RESTAURANT" as const,
      confidence: 0.78,
      loggedAt: subDays(new Date(), 1)
    }
  ];

  for (const meal of meals) {
    await prisma.meal.create({
      data: {
        ...meal,
        userId: user.id,
        items: {
          create: [
            {
              name: meal.name,
              serving: "1 serving",
              calories: meal.calories,
              protein: meal.protein,
              carbs: meal.carbs,
              fats: meal.fats,
              confidence: meal.confidence ?? 0.95
            }
          ]
        }
      }
    });
  }

  await prisma.workout.create({
    data: {
      userId: user.id,
      title: "Push hypertrophy",
      kind: "GYM",
      durationMinutes: 68,
      caloriesBurned: 310,
      exercises: {
        create: [
          { name: "Bench press", sets: 4, reps: 6, loadKg: 75 },
          { name: "Incline dumbbell press", sets: 3, reps: 10, loadKg: 27.5 },
          { name: "Cable fly", sets: 3, reps: 12 }
        ]
      }
    }
  });

  for (let index = 0; index < 14; index += 1) {
    await prisma.weightLog.create({
      data: {
        userId: user.id,
        weightKg: Number((85.6 - index * 0.1 + (index % 3 === 0 ? 0.25 : 0)).toFixed(1)),
        bodyFatPercentage: Number((24.2 - index * 0.08).toFixed(1)),
        leanMassKg: 64.8,
        loggedAt: subDays(new Date(), 13 - index)
      }
    });
  }

  await prisma.cravingLog.create({
    data: {
      userId: user.id,
      label: "momos",
      intensity: 7,
      plannedCalories: 420,
      status: "FITTED",
      suggestion: "Fit 6 steamed momos into dinner and anchor the next snack around protein."
    }
  });

  await prisma.achievement.createMany({
    data: [
      {
        userId: user.id,
        code: "protein-anchor",
        title: "Protein Anchor",
        description: "Hit your protein goal 5 days in a week"
      },
      {
        userId: user.id,
        code: "deficit-builder",
        title: "Deficit Builder",
        description: "Reached 60% of the rolling 10-day deficit target"
      }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
