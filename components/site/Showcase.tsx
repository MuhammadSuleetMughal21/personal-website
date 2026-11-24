"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Project } from "@/lib/types";
import { AppScreen, PhoneFrame, StoreBanner } from "./PhoneMockup";
import SectionLabel from "./SectionLabel";
import StoreButtons, { StoreTap } from "./StoreButtons";

/**
 * Featured apps. Desktop: the section pins and scrolling moves a horizontal
 * track of full-screen app panels. Mobile: panels stack and animate in.
 */
export default function Showcase({ apps }: { apps: Project[] }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;

        const scroll = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              gsap.set("[data-progress]", { scaleX: self.progress });
              const idx = Math.min(apps.length - 1, Math.round(self.progress * (apps.length - 1)));
              const label = root.current!.querySelector("[data-index]");
              if (label) label.textContent = String(idx + 1).padStart(2, "0");
            },
          },
        });

        // Per-panel parallax driven by the horizontal tween.
        gsap.utils.toArray<HTMLElement>("[data-panel]").forEach((panel) => {
          gsap.fromTo(
            panel.querySelectorAll("[data-phone-back]"),
            { xPercent: 30, rotate: 18 },
            {
              xPercent: -10,
              rotate: 6,
              ease: "none",
              scrollTrigger: { trigger: panel, containerAnimation: scroll, start: "left right", end: "right left", scrub: true },
            },
          );
          gsap.from(panel.querySelectorAll("[data-reveal]"), {
            y: 60,
            opacity: 0,
            stagger: 0.06,
            ease: "power3.out",
            scrollTrigger: { trigger: panel, containerAnimation: scroll, start: "left 70%", end: "left 20%", scrub: true },
          });
        });
      });

      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-panel]").forEach((panel) => {
          gsap.from(panel.querySelectorAll("[data-reveal], [data-phone-front]"), {
            y: 50,
            opacity: 0,
            stagger: 0.08,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: panel, start: "top 80%" },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [apps.length] },
  );

  if (!apps.length) return null;

  return (
    <section id="work" ref={root} className="relative overflow-hidden lg:h-dvh">
      <div className="mx-auto flex max-w-7xl items-end justify-between px-5 pt-24 sm:px-8 lg:absolute lg:inset-x-0 lg:top-0 lg:z-10 lg:pt-24">
        <div>
          <SectionLabel index="02">Selected apps</SectionLabel>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-6xl lg:hidden">Apps I&apos;ve shipped</h2>
        </div>
        <div className="hidden items-center gap-4 font-mono text-sm lg:flex">
          <span data-index className="text-accent">01</span>
          <span className="relative h-px w-40 bg-white/15">
            <span data-progress className="absolute inset-0 origin-left scale-x-0 bg-accent" />
          </span>
          <span className="text-muted">{String(apps.length).padStart(2, "0")}</span>
        </div>
      </div>

      <div ref={track} className="flex flex-col gap-24 px-5 py-16 sm:px-8 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-0 lg:p-0">
        {/* intro panel */}
        <div className="hidden h-full w-[45vw] shrink-0 flex-col justify-center pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:flex">
          <h2 className="font-display text-[clamp(3rem,6vw,6.5rem)] font-bold leading-[0.9] tracking-[-0.04em]">
            Apps
            <br />
            I&apos;ve <span className="text-outline">shipped</span>
          </h2>
          <p className="mt-6 max-w-sm text-muted">Keep scrolling. Each one is live on real phones, built end to end.</p>
        </div>

        {apps.map((app, i) => (
          <article
            key={app.id}
            data-panel
            className="relative grid shrink-0 items-center gap-10 lg:h-full lg:w-screen lg:grid-cols-2 lg:px-[8vw]"
          >
            <span
              className="pointer-events-none absolute -top-10 left-0 select-none font-display text-[28vw] font-bold leading-none opacity-[0.04] lg:-top-6 lg:left-[6vw] lg:text-[22vw]"
              aria-hidden
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            {/* phones */}
            <div className="relative mx-auto h-[440px] w-full max-w-[420px] sm:h-[540px] lg:order-none">
              <div
                className="absolute inset-[10%] rounded-full blur-[90px]"
                style={{ background: `${app.color}55` }}
              />
              <div data-phone-back className="absolute right-0 top-[8%] w-[46%] rotate-12 opacity-70">
                {app.banners?.[1] ? (
                  <StoreBanner src={app.banners[1]} alt={`${app.name} store listing`} />
                ) : (
                  <PhoneFrame className="text-[clamp(9px,1.2vw,13px)]">
                    <AppScreen name={app.name} color={app.color} src={app.screens[1]} variant={i + 1} />
                  </PhoneFrame>
                )}
              </div>
              <div
                data-phone-front
                className="absolute left-[8%] top-0 w-[54%] -rotate-3"
                data-cursor={app.appStore || app.playStore ? "Open" : undefined}
              >
                <StoreTap app={app}>
                  {app.banners?.[0] ? (
                    <StoreBanner src={app.banners[0]} alt={`${app.name} on the App Store and Google Play`} />
                  ) : (
                    <PhoneFrame className="text-[clamp(10px,1.4vw,15px)]">
                      <AppScreen name={app.name} color={app.color} src={app.screens[0]} variant={i} />
                    </PhoneFrame>
                  )}
                </StoreTap>
              </div>
            </div>

            {/* details */}
            <div className="relative max-w-xl">
              <div data-reveal className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
                <span className="h-2 w-2 rounded-full" style={{ background: app.color }} />
                {app.category}
                <span>·</span>
                {app.year}
                <span>·</span>
                {app.platforms.join(" / ")}
              </div>
              <h3 data-reveal className="mt-4 font-display text-5xl font-bold tracking-tight sm:text-6xl">
                {app.name}
              </h3>
              <p data-reveal className="mt-5 text-lg text-muted">
                {app.description}
              </p>
              <ul className="mt-7 space-y-3">
                {app.features.map((f) => (
                  <li data-reveal key={f} className="flex gap-3 text-[15px]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: app.color }} />
                    {f}
                  </li>
                ))}
              </ul>
              <div data-reveal className="mt-7 flex flex-wrap gap-2">
                {app.tags.map((t) => (
                  <span key={t} className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">
                    {t}
                  </span>
                ))}
              </div>
              <div data-reveal className="mt-8">
                <StoreButtons app={app} />
              </div>
            </div>
          </article>
        ))}
        <div className="hidden w-[10vw] shrink-0 lg:block" />
      </div>
    </section>
  );
}
