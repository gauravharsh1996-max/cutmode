import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth/clerk";
import { prisma } from "@/lib/db/prisma";
import { calculateMaintenanceCalories } from "@/lib/nutrition/calculations";
import { badRequest, jsonError } from "@/lib/http";

const goalSchema = z.object({
  calorieTarget: z.number().int().min(1200).max(5000).optional(),
  proteinTarget: z.number().int().min(40).max(300).optional(),
  tenDayDeficitGoal: z.number().int().min(1000).max(9000).optional(),
  startWeightKg: z.number().positive().optional(),
  currentWeightKg: z.number().positive().optional(),
  targetWeightKg: z.number().positive().optional(),
  heightCm: z.number().positive().optional(),
  age: z.number().int().min(13).max(100).optional(),
  sex: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  activityLevel: z.enum(["SEDENTARY", "LIGHT", "MODERATE", "ACTIVE", "VERY_ACTIVE"]).optional()
});

export async function GET() {
  try {
    const userId = await requireUserId();
    const goal = await prisma.goal.findUnique({ where: { userId } });
    return NextResponse.json({ goal });
  } catch (error) {
    return jsonError(error, "Could not load goals");
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await requireUserId();
    const payload = goalSchema.safeParse(await request.json());

    if (!payload.success) {
      return badRequest(payload.error.issues[0]?.message ?? "Invalid goal");
    }

    const existing = await prisma.goal.findUnique({ where: { userId } });
    const currentWeightKg = payload.data.currentWeightKg ?? existing?.currentWeightKg ?? undefined;
    const heightCm = payload.data.heightCm ?? existing?.heightCm ?? undefined;
    const age = payload.data.age ?? existing?.age ?? undefined;
    const sex = payload.data.sex ?? existing?.sex ?? "OTHER";
    const activityLevel = payload.data.activityLevel ?? existing?.activityLevel ?? "MODERATE";
    const maintenanceCalories =
      currentWeightKg && heightCm && age
        ? calculateMaintenanceCalories({
            weightKg: currentWeightKg,
            heightCm,
            age,
            sex,
            activityLevel
          })
        : payload.data.calorieTarget
          ? Math.round(payload.data.calorieTarget + 500)
          : undefined;

    const goal = await prisma.goal.upsert({
      where: { userId },
      update: {
        ...payload.data,
        maintenanceCalories
      },
      create: {
        userId,
        calorieTarget: payload.data.calorieTarget ?? 2050,
        proteinTarget: payload.data.proteinTarget ?? 130,
        tenDayDeficitGoal: payload.data.tenDayDeficitGoal ?? 5000,
        startWeightKg: payload.data.startWeightKg,
        currentWeightKg: payload.data.currentWeightKg,
        targetWeightKg: payload.data.targetWeightKg,
        heightCm: payload.data.heightCm,
        age: payload.data.age,
        sex: payload.data.sex ?? "OTHER",
        activityLevel: payload.data.activityLevel ?? "MODERATE",
        maintenanceCalories
      }
    });

    return NextResponse.json({ goal });
  } catch (error) {
    return jsonError(error, "Could not save goals");
  }
}
