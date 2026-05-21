import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/clerk";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/db/prisma";
import { badRequest, jsonError } from "@/lib/http";
import { analyzeMealImage } from "@/lib/ai/openai";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUserId();
    const formData = await request.formData();
    const file = formData.get("image");
    const context = String(formData.get("context") ?? "");

    if (!(file instanceof File)) {
      return badRequest("A meal image is required");
    }

    const arrayBuffer = await file.arrayBuffer();
    const imageBase64 = Buffer.from(arrayBuffer).toString("base64");
    const [estimate, upload] = await Promise.all([
      analyzeMealImage({
        imageBase64,
        mimeType: file.type || "image/jpeg",
        context
      }),
      uploadToCloudinary(file).catch((error) => {
        console.error("Cloudinary upload skipped", error);
        return null;
      })
    ]);

    await prisma.meal.create({
      data: {
        userId,
        name: estimate.name,
        source: "AI_PHOTO",
        imageUrl: upload?.url,
        notes: estimate.notes.join("\n"),
        confidence: estimate.confidence,
        calories: Math.round(estimate.calories),
        protein: estimate.protein,
        carbs: estimate.carbs,
        fats: estimate.fats,
        fiber: estimate.fiber ?? 0,
        sodiumMg: estimate.sodiumMg,
        items: {
          create: estimate.items.map((item) => ({
            name: item.name,
            serving: item.serving,
            calories: Math.round(item.calories),
            protein: item.protein,
            carbs: item.carbs,
            fats: item.fats,
            fiber: item.fiber ?? 0,
            confidence: item.confidence
          }))
        }
      }
    });

    return NextResponse.json(estimate);
  } catch (error) {
    return jsonError(error, "Could not analyze meal");
  }
}
