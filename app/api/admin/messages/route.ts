import { NextResponse } from "next/server";
import { listMessages } from "@/lib/content";
import { rejectUnauthorized } from "@/lib/apiAuth";

export async function GET(request: Request) {
  const denied = rejectUnauthorized(request);
  if (denied) return denied;
  return NextResponse.json(await listMessages(), { headers: { "Cache-Control": "no-store" } });
}
