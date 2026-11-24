"use server";

import { randomUUID } from "node:crypto";
import { addMessage } from "@/lib/content";

export type ContactState = { ok?: boolean; error?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Contact form: stores the message (database on Vercel, data/messages.json locally) for the admin inbox. */
export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: real visitors never see or fill this field.
  if (String(formData.get("company") ?? "")) return { ok: true };

  const name = String(formData.get("name") ?? "").trim().slice(0, 120);
  const email = String(formData.get("email") ?? "").trim().slice(0, 200);
  const message = String(formData.get("message") ?? "").trim().slice(0, 5000);

  if (!name || !message) return { error: "Please add your name and a message." };
  if (!EMAIL_RE.test(email)) return { error: "That email doesn't look right." };

  try {
    await addMessage({ id: randomUUID(), name, email, message, createdAt: new Date().toISOString(), read: false });
  } catch (err) {
    console.error("contact form: could not save message", err);
    return { error: "Couldn't send right now. Please email me directly." };
  }
  return { ok: true };
}
