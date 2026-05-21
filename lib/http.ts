import { NextResponse } from "next/server";
import { isUnauthenticatedError } from "@/lib/auth/clerk";

export function jsonError(error: unknown, fallback = "Something went wrong") {
  if (isUnauthenticatedError(error)) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  console.error(error);
  return NextResponse.json(
    { error: error instanceof Error ? error.message : fallback },
    { status: 500 }
  );
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}
