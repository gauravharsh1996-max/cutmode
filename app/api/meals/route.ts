import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log(body);

    return NextResponse.json({
      success: true,
      body,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "failed" },
      { status: 500 }
    );
  }
}