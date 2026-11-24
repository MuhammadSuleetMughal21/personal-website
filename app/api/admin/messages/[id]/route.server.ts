import { NextResponse } from "next/server";
import { readMessagesRaw, saveMessages } from "@/lib/content";
import { rejectUnauthorized } from "@/lib/apiAuth";

export async function PATCH(request: Request, ctx: RouteContext<"/api/admin/messages/[id]">) {
  const denied = rejectUnauthorized(request);
  if (denied) return denied;
  const { id } = await ctx.params;
  const body = (await request.json().catch(() => ({}))) as { read?: unknown };
  const list = await readMessagesRaw();
  const msg = list.find((m) => m.id === id);
  if (!msg) return NextResponse.json({ error: "Not found" }, { status: 404 });
  msg.read = body.read === true;
  await saveMessages(list);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, ctx: RouteContext<"/api/admin/messages/[id]">) {
  const denied = rejectUnauthorized(request);
  if (denied) return denied;
  const { id } = await ctx.params;
  const list = await readMessagesRaw();
  await saveMessages(list.filter((m) => m.id !== id));
  return NextResponse.json({ ok: true });
}
