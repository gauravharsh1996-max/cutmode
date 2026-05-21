import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { requireUserId } from "@/lib/auth/clerk";
import { prisma } from "@/lib/db/prisma";
import { jsonError } from "@/lib/http";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const userId = await requireUserId();
    const format = request.nextUrl.searchParams.get("format");
    const report = await prisma.weeklyReport.findFirst({
      where: { userId },
      orderBy: { weekStart: "desc" }
    });

    const summary =
      report ??
      ({
        caloriesAverage: 2050,
        proteinAverage: 128,
        deficitTotal: 3430,
        weightChangeKg: -0.6,
        coachSummary: "Strong adherence. Keep protein high and avoid reacting to single-day scale noise."
      } as const);

    if (format !== "pdf") {
      return NextResponse.json({ report: summary });
    }

    const pdf = await PDFDocument.create();
    const page = pdf.addPage([595, 842]);
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

    page.drawText("CutMode Weekly Progress Report", {
      x: 56,
      y: 780,
      size: 22,
      font: bold,
      color: rgb(0.09, 0.09, 0.09)
    });

    const rows = [
      `Average calories: ${summary.caloriesAverage} kcal`,
      `Average protein: ${Math.round(summary.proteinAverage)}g`,
      `Weekly deficit: ${summary.deficitTotal} kcal`,
      `Weight change: ${summary.weightChangeKg ?? 0} kg`,
      `Coach summary: ${summary.coachSummary}`
    ];

    rows.forEach((row, index) => {
      page.drawText(row, {
        x: 56,
        y: 720 - index * 34,
        size: 13,
        font,
        color: rgb(0.15, 0.15, 0.15)
      });
    });

    const bytes = await pdf.save();

    return new NextResponse(Buffer.from(bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="cutmode-weekly-report.pdf"'
      }
    });
  } catch (error) {
    return jsonError(error, "Could not export report");
  }
}
