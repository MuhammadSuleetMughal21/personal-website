"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/** Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Smooth-scroll in-page anchor links.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href")!;
      const target = id === "#" ? 0 : document.querySelector<HTMLElement>(id);
      if (target === null) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: 0, duration: 1.4 });
      history.replaceState(null, "", id === "#" ? location.pathname : id);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
