"use client";

import { motion } from "motion/react";
import { Layers, Palette, Rocket, Server, Shield, Smartphone, Sparkles, Zap, type LucideIcon } from "lucide-react";
import type { Service } from "@/lib/types";
import SectionLabel from "./SectionLabel";

const ICONS: Record<string, LucideIcon> = {
  smartphone: Smartphone,
  server: Server,
  sparkles: Sparkles,
  rocket: Rocket,
  palette: Palette,
  shield: Shield,
  zap: Zap,
  layers: Layers,
};

export default function Services({ services }: { services: Service[] }) {
  return (
    <section id="services" className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
      <SectionLabel index="03">What I do</SectionLabel>
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl font-display text-4xl font-bold leading-[1] tracking-[-0.03em] sm:text-6xl"
        >
          From idea to the <span className="text-accent">home screen</span>.
        </motion.h2>
        <p className="max-w-sm text-muted">One developer for the app, the backend behind it and the release that gets it into people&apos;s hands.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {services.map((s, i) => {
          const Icon = ICONS[s.icon] ?? Smartphone;
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: (i % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover="hover"
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-card p-8 sm:p-10"
            >
              <motion.div
                className="absolute inset-0 origin-bottom bg-accent"
                initial={{ scaleY: 0 }}
                variants={{ hover: { scaleY: 1 } }}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              />
              <div className="relative flex items-start justify-between">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/5 text-accent transition-colors duration-500 group-hover:bg-black group-hover:text-accent">
                  <Icon size={24} />
                </span>
                <span className="font-mono text-sm text-muted transition-colors duration-500 group-hover:text-black/60">
                  0{i + 1}
                </span>
              </div>
              <h3 className="relative mt-10 font-display text-2xl font-semibold transition-colors duration-500 group-hover:text-black sm:text-3xl">
                {s.title}
              </h3>
              <p className="relative mt-3 max-w-md text-muted transition-colors duration-500 group-hover:text-black/70">
                {s.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
