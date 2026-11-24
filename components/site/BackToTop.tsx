"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { ArrowUp } from "lucide-react";

/**
 * Floating "back to top" button. Appears after the first screen, the ring fills
 * with page progress, and a tap glides back up. It is an `href="#"` link, so
 * SmoothScroll's Lenis handler animates the scroll and clears any `#section` hash.
 */
export default function BackToTop() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 24, restDelta: 0.001 });
  const [visible, setVisible] = useState(false);
  const [launching, setLaunching] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setVisible(y > 600);
    if (y < 40) setLaunching(false);
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          key="back-to-top"
          href="#"
          aria-label="Back to top"
          data-cursor="Top"
          onClick={() => setLaunching(true)}
          initial={{ opacity: 0, scale: 0.4, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.4, y: 40 }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
          className="group fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center rounded-full border border-white/10 bg-black/60 text-fg shadow-[0_20px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-colors hover:border-accent/50 hover:text-accent sm:bottom-8 sm:right-8"
        >
          {/* scroll-progress ring */}
          <svg viewBox="0 0 56 56" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
            <circle cx="28" cy="28" r="26" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="2" />
            <motion.circle
              cx="28"
              cy="28"
              r="26"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              className="stroke-accent"
              style={{ pathLength: progress }}
            />
          </svg>

          {/* arrow: nudges up on hover, shoots off and drops back in on tap */}
          <span className="relative h-5 w-5 overflow-hidden">
            <motion.span
              className="absolute inset-0 grid place-items-center"
              animate={launching ? { y: [0, -28, 28, 0] } : { y: 0 }}
              transition={launching ? { duration: 0.9, times: [0, 0.35, 0.36, 1], ease: "easeInOut" } : undefined}
            >
              <ArrowUp size={18} strokeWidth={2.4} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
            </motion.span>
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
