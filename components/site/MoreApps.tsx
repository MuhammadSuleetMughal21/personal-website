"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { Project } from "@/lib/types";
import { AppScreen, PhoneFrame, StoreBanner } from "./PhoneMockup";
import StoreButtons, { StoreTap } from "./StoreButtons";

/** Grid of the non-featured apps, each card tilting toward the pointer. */
export default function MoreApps({ apps }: { apps: Project[] }) {
  if (!apps.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <motion.h3
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10 font-display text-3xl font-bold tracking-tight sm:text-4xl"
      >
        More apps <span className="text-muted">on the shelf</span>
      </motion.h3>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {apps.map((app, i) => (
          <TiltCard key={app.id} app={app} index={i} />
        ))}
      </div>
    </section>
  );
}

function TiltCard({ app, index }: { app: Project; index: number }) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [8, -8]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 });

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 900 }}
    >
      <motion.div
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width);
          py.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
        }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        whileHover="hover"
        className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-card p-5"
      >
        <StoreTap app={app} className="relative flex h-56 items-end justify-center overflow-hidden rounded-2xl"
          style={{ background: `${app.color}22` }}
        >
          <motion.div
            className="w-[46%] translate-y-[22%]"
            variants={{ hover: { y: "8%", rotate: -4 } }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            {app.banners?.[0] ? (
              <StoreBanner src={app.banners[0]} alt={`${app.name} store listing`} className="rounded-2xl" />
            ) : (
              <PhoneFrame className="text-[9px]">
                <AppScreen name={app.name} color={app.color} src={app.screens[0]} variant={index} />
              </PhoneFrame>
            )}
          </motion.div>
        </StoreTap>
        <div className="mt-5 flex items-start justify-between gap-3">
          <div>
            <h4 className="font-display text-xl font-semibold">{app.name}</h4>
            <p className="mt-1 text-sm text-muted">{app.category}</p>
          </div>
          <span className="font-mono text-xs text-muted">{app.year}</span>
        </div>
        <p className="mt-3 line-clamp-2 text-sm text-muted">{app.description}</p>
        <div className="mt-4">
          <StoreButtons app={app} size="sm" />
        </div>
      </motion.div>
    </motion.article>
  );
}
