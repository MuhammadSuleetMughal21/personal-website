import "server-only";
import { readFile, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import { cacheLife, cacheTag } from "next/cache";
import type { Message, SiteContent } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

export const CONTENT_TAG = "content";

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(file, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

/** Write atomically so a crash mid-write never leaves a half-written file. */
async function writeJson(file: string, data: unknown) {
  const tmp = `${file}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(data, null, 2) + "\n", "utf-8");
  await rename(tmp, file);
}

/** Site content, cached until the admin panel saves a change. */
export async function getContent(): Promise<SiteContent> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("max");
  return readJson<SiteContent>(CONTENT_FILE, {} as SiteContent);
}

export async function saveContent(content: SiteContent) {
  await writeJson(CONTENT_FILE, content);
}

export async function readMessagesRaw() {
  return readJson<Message[]>(MESSAGES_FILE, []);
}

export async function readContentRaw() {
  return readJson<SiteContent>(CONTENT_FILE, {} as SiteContent);
}

export async function saveMessages(list: Message[]) {
  await writeJson(MESSAGES_FILE, list);
}
