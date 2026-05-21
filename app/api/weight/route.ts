import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth/clerk";
import { prisma } from "@/lib/db/prisma";
import { badRequest, jsonError } from "@/lib/http";

const weightSchema = z.object({
  weightKg: z.number().positive(),
  bodyFatPercentage: z.number().min(1).max(80).optional(),
  leanMassKg: z.number().positive().optional(),
  waterRetentionNote: z.string().optional(),
  loggedAt: z.string().datetime().optional()
});

export async function GET() {
  try {
    const userId = await requireUserId();
    const logs = await prisma.weightLog.findMany({
      where: { userId },
      orderBy: { loggedAt: "asc" },
      take: 120
    });

    return NextResponse.json({ logs });
  } catch (error) {
    return jsonError(error, "Could not load weight logs");
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUserId();
    const payload = weightSchema.safeParse(await request.json());

    if (!payload.success) {
      return badRequest(payload.error.issues[0]?.message ?? "Invalid weight log");
    }

    const log = await prisma.weightLog.create({
      data: {
        userId,
        ...payload.data,
        loggedAt: payload.data.loggedAt ? new Date(payload.data.loggedAt) : new Date()
      }
    });

    await prisma.goal.updateMany({
      where: { userId },
      data: { currentWeightKg: payload.data.weightKg }
    });

    return NextResponse.json({ log }, { status: 201 });
  } catch (error) {
    return jsonError(error, "Could not save weight log");
  }
}
