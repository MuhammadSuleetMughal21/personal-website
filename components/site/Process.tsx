"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { ProcessStep } from "@/lib/types";
import SectionLabel from "./SectionLabel";

/** Steps connected by a line that draws itself as you scroll. */
export default function Process({ steps }: { steps: ProcessStep[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        "[data-line]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-steps]", start: "top 70%", end: "bottom 60%", scrub: true },
        },
      );
      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step) => {
        gsap
          .timeline({ scrollTrigger: { trigger: step, start: "top 72%", toggleActions: "play none none reverse" } })
          .to(step.querySelector("[data-dot]"), { backgroundColor: "#d8b46e", scale: 1.25, duration: 0.3 })
          .from(step.querySelectorAll("[data-in]"), { x: 40, opacity: 0, stagger: 0.08, duration: 0.7, ease: "power3.out" }, 0);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative border-y border-white/10 bg-bg-2 py-28 sm:py-36">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.4fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionLabel index="04">How I work</SectionLabel>
          <h2 className="font-display text-4xl font-bold leading-[1] tracking-[-0.03em] sm:text-6xl">
            A clear path
            <br />
            <span className="text-outline">to launch day</span>
          </h2>
          <p className="mt-6 max-w-sm text-muted">No black boxes. You get a working build on your phone every week.</p>
        </div>

        <ol data-steps className="relative">
          <span className="absolute left-[11px] top-2 bottom-2 w-px bg-white/10" />
          <span data-line className="absolute left-[11px] top-2 bottom-2 w-px origin-top bg-accent" />
          {steps.map((s, i) => (
            <li data-step key={s.id} className="relative pb-16 pl-14 last:pb-0">
              <span data-dot className="absolute left-0 top-1.5 h-6 w-6 rounded-full border-4 border-bg-2 bg-white/20" />
              <span data-in className="block font-mono text-xs uppercase tracking-[0.2em] text-accent">
                Step 0{i + 1}
              </span>
              <h3 data-in className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
                {s.title}
              </h3>
              <p data-in className="mt-3 max-w-lg text-muted">
                {s.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
