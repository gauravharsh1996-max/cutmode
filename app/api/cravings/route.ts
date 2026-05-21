import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth/clerk";
import { prisma } from "@/lib/db/prisma";
import { badRequest, jsonError } from "@/lib/http";
import { cravingAlternative } from "@/lib/nutrition/food-database";

const cravingSchema = z.object({
  label: z.string().min(1),
  intensity: z.number().min(1).max(10).default(5),
  remainingCalories: z.number().nonnegative().default(0)
});

export async function GET() {
  try {
    const userId = await requireUserId();
    const cravings = await prisma.cravingLog.findMany({
      where: { userId },
      orderBy: { loggedAt: "desc" },
      take: 30
    });

    return NextResponse.json({ cravings });
  } catch (error) {
    return jsonError(error, "Could not load cravings");
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUserId();
    const payload = cravingSchema.safeParse(await request.json());

    if (!payload.success) {
      return badRequest(payload.error.issues[0]?.message ?? "Invalid craving");
    }

    const suggestion = cravingAlternative(payload.data.label, payload.data.remainingCalories);

    const craving = await prisma.cravingLog.create({
      data: {
        userId,
        label: payload.data.label,
        intensity: payload.data.intensity,
        plannedCalories: payload.data.remainingCalories > 0 ? Math.min(payload.data.remainingCalories, 500) : null,
        status: "PLANNED",
        suggestion
      }
    });

    return NextResponse.json({ craving, suggestion }, { status: 201 });
  } catch (error) {
    return jsonError(error, "Could not save craving");
  }
}
