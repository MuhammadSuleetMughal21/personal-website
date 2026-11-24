import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { CONTENT_TAG, readContentRaw, saveContent } from "@/lib/content";
import { rejectUnauthorized } from "@/lib/apiAuth";
import { COLLECTION_KEYS, collections, profileFields, sanitize, slugId } from "@/lib/schema";
import type { CollectionKey, Profile, SiteContent } from "@/lib/types";

/** Replace one section of the content: `profile` or any collection key. */
export async function PUT(request: Request, ctx: { params: Promise<{ section: string }> }) {
  const denied = rejectUnauthorized(request);
  if (denied) return denied;

  const { section } = await ctx.params;
  const body: unknown = await request.json().catch(() => undefined);
  const content = await readContentRaw();

  if (section === "profile") {
    content.profile = sanitize(profileFields, body) as unknown as Profile;
  } else if (COLLECTION_KEYS.includes(section as CollectionKey)) {
    if (!Array.isArray(body)) return NextResponse.json({ error: "Expected an array" }, { status: 400 });
    const def = collections[section as CollectionKey];
    const seen = new Set<string>();
    const items = body.slice(0, 200).map((raw) => {
      const clean = sanitize(def.fields, raw);
      const rawId = (raw as { id?: unknown })?.id;
      let id = typeof rawId === "string" && rawId ? slugId(rawId) : slugId(String(clean[def.titleKey] ?? ""));
      while (seen.has(id)) id = `${id}-${seen.size}`;
      seen.add(id);
      return { id, ...clean };
    });
    (content as unknown as Record<string, unknown>)[section] = items;
  } else {
    return NextResponse.json({ error: "Unknown section" }, { status: 404 });
  }

  await saveContent(content as SiteContent);
  // Expire immediately so the next visitor sees the change.
  revalidateTag(CONTENT_TAG, { expire: 0 });
  return NextResponse.json({ ok: true, savedAt: new Date().toISOString() });
}
