"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * Custom cursor: a dot that follows exactly and a ring that trails on a spring.
 * Elements with `data-cursor="Label"` grow the ring and show the label.
 */
export default function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 350, damping: 30, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 350, damping: 30, mass: 0.6 });
  const [label, setLabel] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const enabled = useSyncExternalStore(subscribeFine, isFinePointer, () => false);

  useEffect(() => {
    if (!enabled) return;

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button, input, textarea, select");
      setHovering(!!el);
      setLabel(el?.dataset.cursor || null);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = label ? 96 : hovering ? 56 : 32;

  return (
    <>
      <motion.div
        className="cursor-dot pointer-events-none fixed left-0 top-0 z-[90] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
        style={{ x, y }}
      />
      <motion.div
        className="cursor-dot pointer-events-none fixed left-0 top-0 z-[89] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent/60 text-[11px] font-semibold uppercase tracking-wider text-black"
        style={{ x: rx, y: ry }}
        animate={{
          width: size,
          height: size,
          backgroundColor: label ? "rgba(216,180,110,1)" : "rgba(216,180,110,0)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {label}
      </motion.div>
    </>
  );
}

const FINE = "(hover: hover) and (pointer: fine)";
function isFinePointer() {
  return window.matchMedia(FINE).matches;
}
function subscribeFine(cb: () => void) {
  const mq = window.matchMedia(FINE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
