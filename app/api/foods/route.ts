import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/clerk";
import { prisma } from "@/lib/db/prisma";
import { foodDatabase } from "@/lib/nutrition/food-database";
import { jsonError } from "@/lib/http";

export async function GET(request: NextRequest) {
  try {
    await requireUserId();
    const query = request.nextUrl.searchParams.get("q")?.trim();
    const barcode = request.nextUrl.searchParams.get("barcode")?.trim();

    if (barcode) {
      const item = await prisma.foodItem.findUnique({ where: { barcode } });
      return NextResponse.json({ items: item ? [item] : [] });
    }

    if (query) {
      const items = await prisma.foodItem.findMany({
        where: {
          OR: [
           { name: { contains: query } },
           { category: { contains: query } },
           { cuisine: { contains: query } },
          ]
        },
        take: 20,
        orderBy: { name: "asc" }
      });
      return NextResponse.json({ items });
    }

    return NextResponse.json({ items: foodDatabase.slice(0, 20) });
  } catch (error) {
    return jsonError(error, "Could not search foods");
  }
}
