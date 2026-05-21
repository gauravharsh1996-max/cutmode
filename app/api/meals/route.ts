import { NextRequest, NextResponse } from "next/server";
import { startOfDay, endOfDay } from "date-fns";
import { z } from "zod";
import { requireUserId } from "@/lib/auth/clerk";
import { prisma } from "@/lib/db/prisma";
import { badRequest, jsonError } from "@/lib/http";

const createMealSchema = z.object({
  name: z.string().min(1),
  calories: z.number().nonnegative(),
  protein: z.number().nonnegative(),
  carbs: z.number().nonnegative(),
  fats: z.number().nonnegative(),
  fiber: z.number().nonnegative().optional(),
  sodiumMg: z.number().nonnegative().optional(),
  source: z.enum(["MANUAL", "AI_PHOTO", "BARCODE", "CUSTOM", "RESTAURANT"]).default("MANUAL"),
  loggedAt: z.string().datetime().optional(),
  items: z
    .array(
      z.object({
        name: z.string(),
        serving: z.string(),
        calories: z.number().nonnegative(),
        protein: z.number().nonnegative(),
        carbs: z.number().nonnegative(),
        fats: z.number().nonnegative(),
        fiber: z.number().nonnegative().optional(),
        confidence: z.number().min(0).max(1).optional()
      })
    )
    .optional()
});

export async function GET(request: NextRequest) {
  try {
    const userId = await requireUserId();
    const date = request.nextUrl.searchParams.get("date");
    const day = date ? new Date(date) : new Date();

    const meals = await prisma.meal.findMany({
      where: {
        userId,
        loggedAt: {
          gte: startOfDay(day),
          lte: endOfDay(day)
        }
      },
      include: { items: true },
      orderBy: { loggedAt: "desc" }
    });

    return NextResponse.json({ meals });
  } catch (error) {
    return jsonError(error, "Could not load meals");
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUserId();
    const payload = createMealSchema.safeParse(await request.json());

    if (!payload.success) {
      return badRequest(payload.error.issues[0]?.message ?? "Invalid meal");
    }

    const data = payload.data;
    const meal = await prisma.meal.create({
      data: {
        userId,
        name: data.name,
        source: data.source,
        calories: Math.round(data.calories),
        protein: data.protein,
        carbs: data.carbs,
        fats: data.fats,
        fiber: data.fiber ?? 0,
        sodiumMg: data.sodiumMg,
        loggedAt: data.loggedAt ? new Date(data.loggedAt) : new Date(),
        items: {
          create:
            data.items?.map((item) => ({
              name: item.name,
              serving: item.serving,
              calories: Math.round(item.calories),
              protein: item.protein,
              carbs: item.carbs,
              fats: item.fats,
              fiber: item.fiber ?? 0,
              confidence: item.confidence
            })) ?? [
              {
                name: data.name,
                serving: "1 serving",
                calories: Math.round(data.calories),
                protein: data.protein,
                carbs: data.carbs,
                fats: data.fats,
                fiber: data.fiber ?? 0
              }
            ]
        }
      },
      include: { items: true }
    });

    return NextResponse.json({ meal }, { status: 201 });
  } catch (error) {
    return jsonError(error, "Could not save meal");
  }
}
