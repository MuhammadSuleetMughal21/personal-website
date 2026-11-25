"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef } from "react";
import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import type { Profile } from "@/lib/types";
import SectionLabel from "./SectionLabel";

export default function About({ profile }: { profile: Profile }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const text = root.current!.querySelector<HTMLElement>("[data-scrub]")!;
      const split = SplitText.create(text, { type: "words" });
      // Words light up one by one as the paragraph scrolls through the viewport.
      gsap.fromTo(
        split.words,
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: text, start: "top 80%", end: "bottom 45%", scrub: true },
        },
      );

      // Count-up for numeric stats ("15+" -> counts 0..15 then keeps the "+").
      root.current!.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        const raw = el.dataset.count ?? "";
        const m = raw.match(/^(\d+)(.*)$/);
        if (!m) return;
        const obj = { v: 0 };
        gsap.to(obj, {
          v: Number(m[1]),
          duration: 1.6,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => (el.textContent = `${Math.round(obj.v)}${m[2]}`),
        });
      });

      gsap.fromTo(
        "[data-portrait]",
        { clipPath: "inset(100% 0 0 0)", scale: 1.2 },
        {
          clipPath: "inset(0% 0 0 0)",
          scale: 1,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-portrait]", start: "top 80%" },
        },
      );

      return () => split.revert();
    },
    { scope: root },
  );

  return (
    <section id="about" ref={root} className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-40">
      <SectionLabel index="01">About me</SectionLabel>

      <div className="grid gap-14 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
        <div>
          <p data-scrub className="font-display text-[clamp(1.6rem,3.4vw,2.9rem)] font-medium leading-[1.2] tracking-[-0.02em]">
            {profile.summary}
          </p>

          <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-4">
            {profile.stats.map((s) => (
              <div key={s.label} className="bg-bg p-6">
                <div data-count={s.value} className="font-display text-4xl font-bold text-accent sm:text-5xl">
                  {s.value}
                </div>
                <div className="mt-2 text-sm text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          className="relative self-start lg:sticky lg:top-28"
          whileHover="hover"
        >
          <div data-portrait className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 bg-card">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(107,79,209,0.4),transparent_60%)]">
                <span className="font-display text-[9rem] font-bold leading-none text-white/10">
                  {profile.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </span>
                <span className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-muted">Upload a photo in /admin</span>
              </div>
            )}
          </div>
          <motion.div
            variants={{ hover: { rotate: -6, y: -6 } }}
            className="absolute -bottom-5 -left-4 flex items-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-black shadow-xl"
          >
            <MapPin size={16} /> {profile.location}
          </motion.div>
          {profile.available && (
            <motion.div
              variants={{ hover: { rotate: 4, y: -4 } }}
              className="absolute -right-3 -top-4 rounded-full border border-white/10 bg-black/70 px-4 py-2 text-xs backdrop-blur"
            >
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400" />
              {profile.availabilityText}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
