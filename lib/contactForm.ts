/**
 * Contact form delivery that works on a static host (GitHub Pages): the browser
 * posts straight to a form service, which emails the message to you.
 *
 * Set ONE of these in `.env.local` (they are public by design, safe in the bundle):
 *   NEXT_PUBLIC_WEB3FORMS_KEY=<access key from web3forms.com>
 *   NEXT_PUBLIC_FORMSPREE_ID=<form id from formspree.io, e.g. xyzabcd>
 * With neither set, sending opens the visitor's email app with the message filled in.
 */
export type ContactState = { ok?: boolean; via?: "service" | "email"; error?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "";

export function makeSendMessage(toEmail: string) {
  return async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
    // Honeypot: real visitors never see or fill this field.
    if (String(formData.get("company") ?? "")) return { ok: true, via: "service" };

    const name = String(formData.get("name") ?? "").trim().slice(0, 120);
    const email = String(formData.get("email") ?? "").trim().slice(0, 200);
    const message = String(formData.get("message") ?? "").trim().slice(0, 5000);

    if (!name || !message) return { error: "Please add your name and a message." };
    if (!EMAIL_RE.test(email)) return { error: "That email doesn't look right." };

    const subject = `Portfolio enquiry from ${name}`;

    if (WEB3FORMS_KEY || FORMSPREE_ID) {
      try {
        const res = WEB3FORMS_KEY
          ? await fetch("https://api.web3forms.com/submit", {
              method: "POST",
              headers: { "Content-Type": "application/json", Accept: "application/json" },
              body: JSON.stringify({ access_key: WEB3FORMS_KEY, subject, from_name: name, name, email, message }),
            })
          : await fetch(`https://formspree.io/f/${encodeURIComponent(FORMSPREE_ID)}`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Accept: "application/json" },
              body: JSON.stringify({ _subject: subject, name, email, message }),
            });
        if (!res.ok) throw new Error(String(res.status));
        return { ok: true, via: "service" };
      } catch {
        return { error: `Couldn't send right now. Please email me at ${toEmail}.` };
      }
    }

    // No form service configured: hand off to the visitor's email app.
    const body = `${message}\n\n— ${name} (${email})`;
    window.location.href = `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return { ok: true, via: "email" };
  };
}
