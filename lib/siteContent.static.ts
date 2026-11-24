import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { SiteContent } from "./types";

/** Static-export build: read content.json once at build time (no cache layer needed). */
export async function getContent(): Promise<SiteContent> {
  return JSON.parse(await readFile(path.join(process.cwd(), "data", "content.json"), "utf-8")) as SiteContent;
}
