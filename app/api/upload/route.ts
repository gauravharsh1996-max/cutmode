import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/clerk";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { badRequest, jsonError } from "@/lib/http";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    await requireUserId();
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") ?? "cutmode/uploads");

    if (!(file instanceof File)) {
      return badRequest("Upload file is required");
    }

    const upload = await uploadToCloudinary(file, folder);

    if (!upload) {
      return NextResponse.json({ error: "Cloudinary environment variables are not configured" }, { status: 503 });
    }

    return NextResponse.json(upload, { status: 201 });
  } catch (error) {
    return jsonError(error, "Could not upload file");
  }
}
