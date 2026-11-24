import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { rejectUnauthorized } from "@/lib/apiAuth";

const TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};
// Vercel functions accept request bodies up to 4.5 MB.
const MAX_BYTES = 4 * 1024 * 1024;

const blobConfigured = Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

/**
 * Store an uploaded image and return its URL.
 * On Vercel: Vercel Blob (public URL). Locally without Blob: public/media/, served at /media/<file>.
 */
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
    return NextResponse.json({ error: "Max 4 MB per image" }, { status: 400 });
  }
  const name = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.${ext}`;

  if (blobConfigured) {
    const blob = await put(`uploads/${name}`, file, { access: "public", contentType: file.type });
    return NextResponse.json({ url: blob.url });
  }
  if (process.env.VERCEL) {
    return NextResponse.json(
      { error: "Image storage isn't connected. In Vercel: site project → Storage → connect a Blob store, then redeploy." },
      { status: 500 },
    );
  }
  const dir = path.join(process.cwd(), "public", "media");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/media/${name}` });
}
