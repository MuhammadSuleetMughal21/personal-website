"use client";

import { motion } from "motion/react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import type { Profile } from "@/lib/types";

export default function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 px-5 pt-16 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-start justify-between gap-10">
        <div className="space-y-2">
          <p className="text-sm text-muted">{profile.role}</p>
          <p className="text-sm text-muted">{profile.location}</p>
        </div>
        <ul className="flex flex-wrap gap-6">
          {profile.socials.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-1 text-sm"
              >
                {s.label}
                <ArrowUpRight
                  size={14}
                  className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                />
              </a>
            </li>
          ))}
          {profile.resumeUrl && (
            <li>
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-accent"
              >
                Résumé ↗
              </a>
            </li>
          )}
        </ul>
        <a
          href="#"
          className="group flex items-center gap-2 text-sm text-muted hover:text-fg"
        >
          Back to top
          <span className="grid h-9 w-9 place-items-center rounded-full border border-white/15 transition-transform group-hover:-translate-y-1">
            <ArrowUp size={14} />
          </span>
        </a>
      </div>

      <motion.div
        initial={{ y: "40%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="mt-16 select-none whitespace-nowrap text-center font-display text-[17vw] font-bold leading-[0.8] tracking-[-0.06em]"
        aria-hidden
      >
        <span className="bg-gradient-to-b from-white/90 to-white/0 bg-clip-text text-transparent">
          {profile.shortName.toLowerCase()}.dev
        </span>
      </motion.div>
      <p className="mx-auto max-w-7xl py-6 text-center text-xs text-muted">
        © 2026 {profile.name}.
      </p>
    </footer>
  );
}
