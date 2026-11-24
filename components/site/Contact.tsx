"use client";

import { useActionState, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, Copy, Mail, Phone } from "lucide-react";
import { sendMessage, type ContactState } from "@/app/actions";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import type { Profile } from "@/lib/types";
import Magnetic from "./Magnetic";
import SectionLabel from "./SectionLabel";

export default function Contact({ profile }: { profile: Profile }) {
  const root = useRef<HTMLElement>(null);
  const [state, action, pending] = useActionState<ContactState, FormData>(sendMessage, {});
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const split = SplitText.create("[data-big]", { type: "chars,lines", mask: "lines" });
      gsap.from(split.chars, {
        yPercent: 120,
        stagger: 0.025,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-big]", start: "top 85%" },
      });
      return () => split.revert();
    },
    { scope: root },
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <section id="contact" ref={root} className="relative overflow-hidden px-5 py-28 sm:px-8 sm:py-36">
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[50vmax] w-[70vmax] -translate-x-1/2 translate-y-1/2 rounded-full bg-accent/10 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl">
        <SectionLabel index="06">Contact</SectionLabel>
        <h2 data-big className="font-display text-[clamp(3rem,10vw,9.5rem)] font-bold leading-[0.88] tracking-[-0.045em]">
          Got an app idea?
          <br />
          <span className="text-accent">Let&apos;s build it.</span>
        </h2>

        <div className="mt-20 grid gap-14 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-6">
            <p className="max-w-sm text-lg text-muted">
              Tell me about your app. I usually reply within a day.
            </p>
            <button
              type="button"
              onClick={copy}
              data-cursor="Copy"
              className="group flex items-center gap-4 text-left"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white/5"><Mail size={18} /></span>
              <span>
                <span className="block text-xs uppercase tracking-[0.2em] text-muted">Email</span>
                <span className="flex items-center gap-2 text-lg font-medium">
                  {profile.email}
                  {copied ? <Check size={16} className="text-accent" /> : <Copy size={14} className="opacity-40 group-hover:opacity-100" />}
                </span>
              </span>
            </button>
            {profile.phone && (
              <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-white/5"><Phone size={18} /></span>
                <span>
                  <span className="block text-xs uppercase tracking-[0.2em] text-muted">Phone</span>
                  <span className="text-lg font-medium">{profile.phone}</span>
                </span>
              </a>
            )}
          </div>

          <div className="relative rounded-[2rem] border border-white/10 bg-card/80 p-6 backdrop-blur sm:p-10">
            <AnimatePresence mode="wait">
              {state.ok ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex min-h-[380px] flex-col items-center justify-center text-center"
                >
                  <motion.span
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
                    className="grid h-20 w-20 place-items-center rounded-full bg-accent text-black"
                  >
                    <Check size={36} />
                  </motion.span>
                  <h3 className="mt-6 font-display text-3xl font-semibold">Message sent</h3>
                  <p className="mt-2 text-muted">Thanks! I&apos;ll get back to you soon.</p>
                </motion.div>
              ) : (
                <motion.form key="form" action={action} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Your name" name="name" autoComplete="name" />
                    <Field label="Email" name="email" type="email" autoComplete="email" />
                  </div>
                  <Field label="Tell me about your app" name="message" textarea />
                  {state.error && <p className="text-sm text-rose-400">{state.error}</p>}
                  <Magnetic strength={0.2}>
                    <button
                      type="submit"
                      disabled={pending}
                      className="group flex items-center gap-3 rounded-full bg-accent py-2 pl-7 pr-2 font-semibold text-black disabled:opacity-60"
                    >
                      {pending ? "Sending…" : "Send message"}
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-black text-accent transition-transform duration-500 group-hover:rotate-45">
                        <ArrowUpRight size={18} />
                      </span>
                    </button>
                  </Magnetic>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  textarea,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  autoComplete?: string;
}) {
  const cls =
    "peer w-full border-b border-white/15 bg-transparent pb-3 pt-6 text-lg outline-none transition-colors placeholder-transparent focus:border-accent";
  return (
    <label className="relative block">
      {textarea ? (
        <textarea name={name} rows={4} required placeholder={label} className={`${cls} resize-none`} />
      ) : (
        <input name={name} type={type} required placeholder={label} autoComplete={autoComplete} className={cls} />
      )}
      <span className="pointer-events-none absolute left-0 top-0 text-xs uppercase tracking-[0.2em] text-muted transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-0 peer-focus:text-xs peer-focus:uppercase peer-focus:tracking-[0.2em] peer-focus:text-accent">
        {label}
      </span>
    </label>
  );
}
