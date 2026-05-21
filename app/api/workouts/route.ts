import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth/clerk";
import { prisma } from "@/lib/db/prisma";
import { badRequest, jsonError } from "@/lib/http";

const workoutSchema = z.object({
  title: z.string().min(1),
  kind: z.enum(["GYM", "CARDIO", "TREADMILL", "SPORT", "TEMPLATE", "RECOVERY"]),
  durationMinutes: z.number().min(1),
  caloriesBurned: z.number().nonnegative().default(0),
  treadmillIncline: z.number().optional(),
  exercises: z
    .array(
      z.object({
        name: z.string(),
        sets: z.number().optional(),
        reps: z.number().optional(),
        loadKg: z.number().optional(),
        distanceKm: z.number().optional(),
        notes: z.string().optional()
      })
    )
    .optional()
});

export async function GET() {
  try {
    const userId = await requireUserId();
    const workouts = await prisma.workout.findMany({
      where: { userId },
      include: { exercises: true },
      orderBy: { performedAt: "desc" },
      take: 30
    });

    return NextResponse.json({ workouts });
  } catch (error) {
    return jsonError(error, "Could not load workouts");
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUserId();
    const payload = workoutSchema.safeParse(await request.json());

    if (!payload.success) {
      return badRequest(payload.error.issues[0]?.message ?? "Invalid workout");
    }

    const workout = await prisma.workout.create({
      data: {
        userId,
        ...payload.data,
        exercises: {
          create: payload.data.exercises ?? []
        }
      },
      include: { exercises: true }
    });

    return NextResponse.json({ workout }, { status: 201 });
  } catch (error) {
    return jsonError(error, "Could not save workout");
  }
}
