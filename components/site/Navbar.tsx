"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Magnetic from "./Magnetic";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar({ name, available }: { name: string; available: boolean }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(v > prev && v > 200 && !open);
    setScrolled(v > 40);
  });

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6"
        animate={{ y: hidden ? -110 : 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border px-4 py-2.5 transition-colors duration-500 sm:px-6 ${
            scrolled ? "border-white/10 bg-black/50 backdrop-blur-xl" : "border-transparent"
          }`}
        >
          <a href="#" className="group flex items-center gap-2 font-display text-lg font-bold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-accent text-sm text-black transition-transform duration-500 group-hover:rotate-[360deg]">
              {name.split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
            </span>
            <span className="whitespace-nowrap">{name}</span>
            <span className="text-accent">.</span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group relative block overflow-hidden px-3 py-1.5 text-sm text-muted transition-colors hover:text-fg"
                >
                  <span className="block transition-transform duration-300 group-hover:-translate-y-full">{l.label}</span>
                  <span className="absolute inset-x-3 top-full block transition-transform duration-300 group-hover:-translate-y-full">
                    {l.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            {available && (
              <span className="hidden items-center gap-2 text-xs text-muted lg:flex">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Available
              </span>
            )}
            <Magnetic className="hidden md:block">
              <a
                href="#contact"
                className="block rounded-full bg-fg px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-accent"
              >
                Let&apos;s talk
              </a>
            </Magnetic>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="relative z-[60] grid h-10 w-10 place-items-center rounded-full bg-white/10 md:hidden"
            >
              <span className="relative block h-3 w-5">
                <motion.span
                  className="absolute left-0 top-0 h-0.5 w-5 rounded bg-fg"
                  animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                />
                <motion.span
                  className="absolute bottom-0 left-0 h-0.5 w-5 rounded bg-fg"
                  animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-end bg-[#0b0b10] px-6 pb-12 md:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="space-y-2">
              {LINKS.map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <motion.a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block font-display text-5xl font-semibold"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ delay: 0.2 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="mr-3 font-mono text-sm text-accent">0{i + 1}</span>
                    {l.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
