import { readFile } from "node:fs/promises";
import path from "node:path";

const MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

/** Serves images uploaded from the admin panel (stored in data/uploads). */
export async function GET(_req: Request, ctx: RouteContext<"/media/[file]">) {
  const { file } = await ctx.params;
  // Only plain generated names: no slashes, no dot-dot.
  if (!/^[a-z0-9-]+\.(png|jpg|webp|gif|avif)$/.test(file)) {
    return new Response("Not found", { status: 404 });
  }
  try {
    const data = await readFile(path.join(process.cwd(), "data", "uploads", file));
    const ext = file.split(".").pop()!;
    return new Response(data, {
      headers: {
        "Content-Type": MIME[ext],
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
