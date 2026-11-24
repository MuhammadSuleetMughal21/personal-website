import { NextResponse } from "next/server";
import { deleteMessage, setMessageRead } from "@/lib/content";
import { rejectUnauthorized } from "@/lib/apiAuth";

export async function PATCH(request: Request, ctx: RouteContext<"/api/admin/messages/[id]">) {
  const denied = rejectUnauthorized(request);
  if (denied) return denied;
  const { id } = await ctx.params;
  const body = (await request.json().catch(() => ({}))) as { read?: unknown };
  const found = await setMessageRead(id, body.read === true);
  if (!found) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, ctx: RouteContext<"/api/admin/messages/[id]">) {
  const denied = rejectUnauthorized(request);
  if (denied) return denied;
  const { id } = await ctx.params;
  await deleteMessage(id);
  return NextResponse.json({ ok: true });
}
