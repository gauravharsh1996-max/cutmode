import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth/clerk";
import { buildCoachRecommendations } from "@/lib/ai/coach";
import { jsonError, badRequest } from "@/lib/http";

const coachSchema = z.object({
  calories: z.number().nonnegative(),
  calorieTarget: z.number().positive(),
  protein: z.number().nonnegative(),
  proteinTarget: z.number().positive(),
  deficit: z.number(),
  remainingCalories: z.number(),
  workoutCalories: z.number().optional(),
  hungerLevel: z.number().min(1).max(10).optional(),
  craving: z.string().optional(),
  sodiumMg: z.number().optional()
});

export async function POST(request: NextRequest) {
  try {
    await requireUserId();
    const payload = coachSchema.safeParse(await request.json());

    if (!payload.success) {
      return badRequest(payload.error.issues[0]?.message ?? "Invalid coach input");
    }

    return NextResponse.json({
      recommendations: buildCoachRecommendations(payload.data)
    });
  } catch (error) {
    return jsonError(error, "Could not generate recommendations");
  }
}
