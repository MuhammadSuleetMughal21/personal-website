"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import type { Experience as Job } from "@/lib/types";
import SectionLabel from "./SectionLabel";

/** Accordion rows: hover lights the row, click expands the highlights. */
export default function Experience({ jobs }: { jobs: Job[] }) {
  const [open, setOpen] = useState<string | null>(jobs[0]?.id ?? null);

  return (
    <section id="experience" className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
      <SectionLabel index="05">Experience</SectionLabel>
      <h2 className="mb-14 font-display text-4xl font-bold tracking-[-0.03em] sm:text-6xl">Where I&apos;ve worked</h2>

      <ul className="border-t border-white/10">
        {jobs.map((job, i) => {
          const isOpen = open === job.id;
          return (
            <motion.li
              key={job.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="border-b border-white/10"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : job.id)}
                aria-expanded={isOpen}
                className="group grid w-full grid-cols-[1fr_auto] items-center gap-4 py-8 text-left sm:grid-cols-[180px_1fr_1fr_auto]"
              >
                <span className="hidden font-mono text-sm text-muted sm:block">{job.period}</span>
                <span className="font-display text-2xl font-semibold transition-transform duration-500 group-hover:translate-x-3 sm:text-3xl">
                  {job.company}
                  <span className="mt-1 block font-mono text-xs font-normal text-muted sm:hidden">{job.period}</span>
                </span>
                <span className="hidden text-muted sm:block">{job.role}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0, backgroundColor: isOpen ? "#c8ff3d" : "rgba(255,255,255,0.06)" }}
                  className={`grid h-11 w-11 place-items-center rounded-full ${isOpen ? "text-black" : ""}`}
                >
                  <Plus size={18} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-4 pb-10 sm:grid-cols-[180px_1fr]">
                      <span className="text-sm text-muted">{job.location}</span>
                      <div>
                        <p className="mb-4 text-fg sm:hidden">{job.role}</p>
                        <ul className="space-y-3">
                          {job.points.map((p, k) => (
                            <motion.li
                              key={p}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 + k * 0.06 }}
                              className="flex gap-3 text-muted"
                            >
                              <span className="mt-2.5 h-1 w-4 shrink-0 bg-accent" />
                              {p}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
