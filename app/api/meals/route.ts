import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("BODY:", body);

    return NextResponse.json({
      success: true,
      received: body,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "API crashed" },
      { status: 500 }
    );
  }
}