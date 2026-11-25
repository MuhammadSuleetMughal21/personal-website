"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { finishIntro } from "@/lib/intro";

const WORDS = ["Design", "Build", "Test", "Ship"];

/** Counter + word ticker, then the curtain lifts and the hero animates in. */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let seen = false;
      try {
        seen = sessionStorage.getItem("intro-seen") === "1";
      } catch {}
      if (reduce || seen) {
        setGone(true);
        finishIntro();
        return;
      }

      document.documentElement.style.overflow = "hidden";
      const counter = { v: 0 };
      const num = root.current!.querySelector<HTMLElement>("[data-num]")!;
      const words = gsap.utils.toArray<HTMLElement>("[data-word]");
      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflow = "";
          try {
            sessionStorage.setItem("intro-seen", "1");
          } catch {}
          setGone(true);
        },
      });

      tl.to(counter, {
        v: 100,
        duration: 2.2,
        ease: "power2.inOut",
        onUpdate: () => {
          num.textContent = String(Math.round(counter.v)).padStart(3, "0");
        },
      });
      words.forEach((w, i) => {
        tl.fromTo(w, { yPercent: 100 }, { yPercent: 0, duration: 0.35, ease: "power3.out" }, i * 0.55);
        if (i < words.length - 1) tl.to(w, { yPercent: -100, duration: 0.35, ease: "power3.in" }, i * 0.55 + 0.4);
      });
      tl.to("[data-bar]", { scaleX: 1, duration: 2.2, ease: "power2.inOut" }, 0);
      tl.to("[data-inner]", { opacity: 0, y: -30, duration: 0.4, ease: "power2.in" }, "+=0.15");
      tl.add(finishIntro, "-=0.05");
      tl.to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut" });
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-bg-2 p-6 sm:p-10"
      style={{ clipPath: "inset(0 0 0% 0)" }}
      aria-hidden
    >
      <div data-inner className="flex h-full flex-col justify-between">
        <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-muted">
          <span>Booting portfolio.app</span>
          <span>v2026</span>
        </div>
        <div className="flex items-end justify-between gap-6">
          <div className="relative h-[1.1em] overflow-hidden font-display text-5xl font-semibold sm:text-7xl">
            {WORDS.map((w) => (
              <span key={w} data-word className="absolute left-0 top-0 translate-y-full">
                {w}
                <span className="text-accent">.</span>
              </span>
            ))}
          </div>
          <span data-num className="font-display text-7xl font-bold tabular-nums text-fg sm:text-[9rem] leading-none">
            000
          </span>
        </div>
        <div className="h-px w-full bg-white/10">
          <div data-bar className="h-full origin-left scale-x-0 bg-accent" />
        </div>
      </div>
    </div>
  );
}
