import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

/**
 * The admin app authenticates with `Authorization: Bearer <ADMIN_API_KEY>`.
 * Returns a 401 response when the key is missing or wrong, otherwise null.
 */
export function rejectUnauthorized(request: Request): NextResponse | null {
  const expected = process.env.ADMIN_API_KEY;
  const given = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!expected || expected.length < 16) {
    return NextResponse.json({ error: "ADMIN_API_KEY is not configured on the site" }, { status: 500 });
  }
  // Hash both sides so the comparison is constant-time regardless of length.
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b) ? null : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
