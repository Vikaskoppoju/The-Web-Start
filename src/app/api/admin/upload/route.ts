import { NextRequest } from "next/server";
import { ok, err } from "@/lib/api-helpers";
import { buildObjectKey, buildPublicUrl } from "@/lib/r2";
import { uploadSchema } from "@/lib/validations";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = uploadSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? "Invalid input", 400);

    const bucket = (process.env as unknown as { IMAGES: { createPresignedUrl: (m: string, k: string, o: object) => Promise<string> } }).IMAGES;
    if (!bucket?.createPresignedUrl) {
      // Fallback for local dev — return a mock URL
      const key = buildObjectKey(parsed.data.folder, parsed.data.filename);
      return ok({ uploadUrl: "#mock-upload", publicUrl: buildPublicUrl(key), key });
    }

    const key = buildObjectKey(parsed.data.folder, parsed.data.filename);
    const uploadUrl = await bucket.createPresignedUrl("PUT", key, { expiresIn: 900 });
    return ok({ uploadUrl, publicUrl: buildPublicUrl(key), key });
  } catch { return err("Failed to generate upload URL", 500); }
}
