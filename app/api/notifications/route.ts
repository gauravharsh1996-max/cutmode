import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth/clerk";
import { prisma } from "@/lib/db/prisma";
import { badRequest, jsonError } from "@/lib/http";

const preferencesSchema = z.array(
  z.object({
    kind: z.enum(["PROTEIN", "HYDRATION", "MEAL", "WORKOUT", "SLEEP", "WEIGH_IN"]),
    enabled: z.boolean(),
    timeLocal: z.string().optional()
  })
);

export async function GET() {
  try {
    const userId = await requireUserId();
    const preferences = await prisma.notificationPreference.findMany({
      where: { userId },
      orderBy: { kind: "asc" }
    });

    return NextResponse.json({ preferences });
  } catch (error) {
    return jsonError(error, "Could not load notification preferences");
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await requireUserId();
    const payload = preferencesSchema.safeParse(await request.json());

    if (!payload.success) {
      return badRequest(payload.error.issues[0]?.message ?? "Invalid preferences");
    }

    const preferences = await prisma.$transaction(
      payload.data.map((preference) =>
        prisma.notificationPreference.upsert({
          where: {
            userId_kind: {
              userId,
              kind: preference.kind
            }
          },
          update: {
            enabled: preference.enabled,
            timeLocal: preference.timeLocal
          },
          create: {
            userId,
            kind: preference.kind,
            enabled: preference.enabled,
            timeLocal: preference.timeLocal
          }
        })
      )
    );

    return NextResponse.json({ preferences });
  } catch (error) {
    return jsonError(error, "Could not save notification preferences");
  }
}
