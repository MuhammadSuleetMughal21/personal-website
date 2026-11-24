"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowDownRight, Apple, Smartphone } from "lucide-react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import type { Profile, Project } from "@/lib/types";
import { AppScreen, PhoneFrame } from "./PhoneMockup";
import Magnetic from "./Magnetic";

export default function Hero({ profile, apps }: { profile: Profile; apps: Project[] }) {
  const root = useRef<HTMLElement>(null);

  // Pointer parallax for the phone stack (Motion)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 20 });
  const sy = useSpring(my, { stiffness: 80, damping: 20 });
  const rotY = useTransform(sx, [-1, 1], [-14, 14]);
  const rotX = useTransform(sy, [-1, 1], [10, -10]);
  const backX = useTransform(sx, [-1, 1], [-30, 30]);
  const backXNeg = useTransform(sx, [-1, 1], [30, -30]);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const title = root.current!.querySelector<HTMLElement>("[data-title]")!;
      const split = SplitText.create(title, { type: "lines,words,chars", mask: "lines" });

      const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
      tl.from(split.chars, { yPercent: 110, rotate: 8, duration: 1.2, stagger: 0.018 })
        .from("[data-fade]", { y: 30, opacity: 0, duration: 1, stagger: 0.08 }, 0.35)
        .from("[data-phone]", { y: 160, opacity: 0, rotate: (i) => [-14, 0, 14][i] ?? 0, duration: 1.6, stagger: 0.1 }, 0.2)
        .from("[data-chip]", { scale: 0, opacity: 0, duration: 0.8, stagger: 0.08, ease: "back.out(2)" }, 0.9);

      const off = onIntroDone(() => (reduce ? tl.progress(1) : tl.play()));

      if (!reduce) {
        // Scroll: phones drift apart and the title slides away.
        gsap.to("[data-stack]", {
          yPercent: 18,
          scale: 0.92,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(title, {
          yPercent: -30,
          opacity: 0.2,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      }

      return () => {
        off();
        split.revert();
        ScrollTrigger.refresh();
      };
    },
    { scope: root },
  );

  const shown = apps.slice(0, 3);
  while (shown.length < 3 && apps.length) shown.push(apps[shown.length % apps.length]);

  return (
    <section
      ref={root}
      className="relative flex min-h-dvh items-center overflow-hidden pt-28 pb-16"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        mx.set((e.clientX / window.innerWidth) * 2 - 1);
        my.set((e.clientY / window.innerHeight) * 2 - 1);
      }}
    >
      {/* background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-2/20 blur-[120px]" />
        <div className="absolute right-[10%] top-[15%] h-[25vmax] w-[25vmax] rounded-full bg-accent/10 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse at center, #000 20%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <p data-fade className="mb-5 font-display text-xl font-semibold sm:text-2xl">
            Hi, I&apos;m <span className="text-accent">{profile.name}</span>
          </p>
          <div data-fade className="mb-6 flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            <span className="rounded-full border border-white/10 px-3 py-1.5 text-fg">{profile.role}</span>
            <span>{profile.location}</span>
          </div>

          <h1
            data-title
            className="font-display text-[clamp(2.8rem,7.5vw,6.8rem)] font-bold leading-[0.95] tracking-[-0.035em]"
          >
            {profile.headline}
          </h1>

          <p data-fade className="mt-7 max-w-xl text-lg leading-relaxed text-muted">
            {profile.tagline}. I turn ideas into fast, polished apps and take them all the way to the App Store and Google Play.
          </p>

          <div data-fade className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a
                href="#work"
                data-cursor="View"
                className="group flex items-center gap-3 rounded-full bg-accent py-2 pl-6 pr-2 font-semibold text-black"
              >
                See my apps
                <span className="grid h-10 w-10 place-items-center rounded-full bg-black text-accent transition-transform duration-500 group-hover:rotate-[-45deg]">
                  <ArrowDownRight size={18} />
                </span>
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#contact" className="block rounded-full border border-white/15 px-6 py-4 font-semibold transition-colors hover:border-white/40">
                Start a project
              </a>
            </Magnetic>
          </div>

          <dl data-fade className="mt-14 grid max-w-lg grid-cols-4 gap-4 border-t border-white/10 pt-6">
            {profile.stats.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-2xl font-bold sm:text-3xl">{s.value}</dt>
                <dd className="mt-1 text-xs leading-tight text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* phone stack */}
        <div className="relative mx-auto h-[520px] w-full max-w-[460px] sm:h-[600px]" style={{ perspective: 1400 }}>
          <motion.div data-stack className="relative h-full w-full" style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}>
            {shown.map((app, i) => {
              const pos = [
                "left-0 top-[12%] w-[44%] -rotate-[10deg] opacity-80",
                "left-1/2 top-0 z-10 w-[52%] -translate-x-1/2",
                "right-0 top-[12%] w-[44%] rotate-[10deg] opacity-80",
              ][i];
              return (
                <motion.div key={`${app.id}-${i}`} className={`absolute ${pos}`} style={i === 1 ? undefined : { x: i === 0 ? backX : backXNeg }}>
                  <div data-phone>
                    <PhoneFrame className="text-[clamp(10px,1.6vw,15px)]">
                      <AppScreen name={app.name} color={app.color} src={app.screens[0]} variant={i} />
                    </PhoneFrame>
                  </div>
                </motion.div>
              );
            })}

            {/* floating chips */}
            <div data-chip className="absolute -left-2 bottom-[18%] z-20 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/60 px-4 py-3 backdrop-blur-md sm:-left-6">
              <Apple size={18} />
              <div className="text-xs leading-tight">
                <div className="font-semibold">App Store</div>
                <div className="text-muted">Shipped</div>
              </div>
            </div>
            <div data-chip className="absolute -right-2 bottom-[30%] z-20 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/60 px-4 py-3 backdrop-blur-md sm:-right-6">
              <Smartphone size={18} className="text-accent" />
              <div className="text-xs leading-tight">
                <div className="font-semibold">Google Play</div>
                <div className="text-muted">Live</div>
              </div>
            </div>
            <div data-chip className="absolute left-1/2 top-[-4%] z-20 -translate-x-1/2 rounded-full bg-accent px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-black">
              60 fps · native feel
            </div>
          </motion.div>
        </div>
      </div>

      <div data-fade className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted sm:flex">
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-white/10">
          <motion.span
            className="absolute left-0 top-0 h-4 w-px bg-accent"
            animate={{ y: [-16, 40] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </div>
    </section>
  );
}

