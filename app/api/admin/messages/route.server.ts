import { NextResponse } from "next/server";
import { readMessagesRaw } from "@/lib/content";
import { rejectUnauthorized } from "@/lib/apiAuth";

export async function GET(request: Request) {
  const denied = rejectUnauthorized(request);
  if (denied) return denied;
  const list = (await readMessagesRaw()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json(list, { headers: { "Cache-Control": "no-store" } });
}
