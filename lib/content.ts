import "server-only";
import { readFile, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import { cacheLife, cacheTag } from "next/cache";
import postgres, { type Sql } from "postgres";
import seedContent from "@/data/content.json";
import type { Message, SiteContent } from "./types";

/**
 * Content + contact-message store.
 *
 * - With DATABASE_URL (Vercel + Neon): Postgres. An empty database is seeded from
 *   data/content.json on first read, so the site comes up with your current content.
 * - Without it (local): the JSON files in data/, as before.
 */
export const CONTENT_TAG = "content";

const DATABASE_URL = process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? "";
export const usingDatabase = DATABASE_URL !== "";

/* ------------------------------------------------------------------ database */

let client: Sql | null = null;
let schemaReady: Promise<void> | null = null;

async function db(): Promise<Sql> {
  // One connection per serverless instance; prepare:false works behind Neon's pooler.
  client ??= postgres(DATABASE_URL, { max: 1, prepare: false, idle_timeout: 20, connect_timeout: 15, onnotice: () => {} });
  schemaReady ??= (async () => {
    await client!`create table if not exists site_content (
      id int primary key,
      data jsonb not null,
      updated_at timestamptz not null default now()
    )`;
    await client!`create table if not exists messages (
      id text primary key,
      name text not null,
      email text not null,
      budget text,
      message text not null,
      created_at timestamptz not null default now(),
      read boolean not null default false
    )`;
  })().catch((err) => {
    schemaReady = null; // retry on the next request
    throw err;
  });
  await schemaReady;
  return client;
}

// postgres writes the value as JSON for the jsonb column; passing a pre-stringified value double-encodes it.
const asJson = (v: unknown) => v as postgres.JSONValue;

type MessageRow = { id: string; name: string; email: string; budget: string | null; message: string; created_at: Date; read: boolean };
const toMessage = (r: MessageRow): Message => ({
  id: r.id,
  name: r.name,
  email: r.email,
  ...(r.budget ? { budget: r.budget } : {}),
  message: r.message,
  createdAt: new Date(r.created_at).toISOString(),
  read: r.read,
});

/* ---------------------------------------------------------------------- files */

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

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

/* -------------------------------------------------------------------- content */

/** Site content for the public page, cached until the admin saves (tag `content`). */
export async function getContent(): Promise<SiteContent> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("max");
  return readContentRaw();
}

/** Uncached read, for the admin API. */
export async function readContentRaw(): Promise<SiteContent> {
  if (!usingDatabase) return readJson<SiteContent>(CONTENT_FILE, seedContent as unknown as SiteContent);
  const sql = await db();
  const rows = await sql<{ data: SiteContent }[]>`select data from site_content where id = 1`;
  if (rows.length) return rows[0].data;
  const seed = seedContent as unknown as SiteContent;
  await sql`insert into site_content (id, data) values (1, ${sql.json(asJson(seed))}) on conflict (id) do nothing`;
  return seed;
}

export async function saveContent(content: SiteContent) {
  if (!usingDatabase) return writeJson(CONTENT_FILE, content);
  const sql = await db();
  await sql`
    insert into site_content (id, data, updated_at) values (1, ${sql.json(asJson(content))}, now())
    on conflict (id) do update set data = excluded.data, updated_at = now()
  `;
}

/* ------------------------------------------------------------------- messages */

const MAX_MESSAGES = 2000;

/** Newest first. */
export async function listMessages(): Promise<Message[]> {
  if (!usingDatabase) {
    const list = await readJson<Message[]>(MESSAGES_FILE, []);
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  const sql = await db();
  const rows = await sql<MessageRow[]>`select * from messages order by created_at desc limit ${MAX_MESSAGES}`;
  return rows.map(toMessage);
}

export async function addMessage(msg: Message) {
  if (!usingDatabase) {
    const list = await readJson<Message[]>(MESSAGES_FILE, []);
    list.unshift(msg);
    return writeJson(MESSAGES_FILE, list.slice(0, MAX_MESSAGES));
  }
  const sql = await db();
  await sql`
    insert into messages (id, name, email, budget, message, created_at, read)
    values (${msg.id}, ${msg.name}, ${msg.email}, ${msg.budget ?? null}, ${msg.message}, ${msg.createdAt}::timestamptz, ${msg.read})
  `;
}

/** Returns false when no message has that id. */
export async function setMessageRead(id: string, read: boolean): Promise<boolean> {
  if (!usingDatabase) {
    const list = await readJson<Message[]>(MESSAGES_FILE, []);
    const msg = list.find((m) => m.id === id);
    if (!msg) return false;
    msg.read = read;
    await writeJson(MESSAGES_FILE, list);
    return true;
  }
  const sql = await db();
  const res = await sql`update messages set read = ${read}::boolean where id = ${id}`;
  return res.count > 0;
}

export async function deleteMessage(id: string) {
  if (!usingDatabase) {
    const list = await readJson<Message[]>(MESSAGES_FILE, []);
    return writeJson(MESSAGES_FILE, list.filter((m) => m.id !== id));
  }
  const sql = await db();
  await sql`delete from messages where id = ${id}`;
}
