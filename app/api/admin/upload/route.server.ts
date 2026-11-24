import { randomBytes } from "node:crypto";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { rejectUnauthorized } from "@/lib/apiAuth";

const TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};
const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const denied = rejectUnauthorized(request);
  if (denied) return denied;
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  const ext = TYPES[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Use PNG, JPG, WebP, GIF or AVIF" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Max 5 MB per image" }, { status: 400 });
  }
  const name = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.${ext}`;
  await writeFile(path.join(process.cwd(), "data", "uploads", name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/media/${name}` });
}
