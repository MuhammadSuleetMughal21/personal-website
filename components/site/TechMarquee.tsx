import type { SkillGroup } from "@/lib/types";

/** Two counter-scrolling rows of the tech stack (pure CSS animation). */
export default function TechMarquee({ skills }: { skills: SkillGroup[] }) {
  const all = skills.flatMap((g) => g.items);
  const half = Math.ceil(all.length / 2);
  const rows = [all.slice(0, half), all.slice(half)];

  return (
    <section aria-label="Tech stack" className="relative -rotate-2 border-y border-white/10 bg-accent py-5 text-black">
      {rows.map((row, r) => (
        <div key={r} className={`overflow-hidden ${r === 1 ? "mt-3" : ""}`}>
          <div className="marquee" data-reverse={r === 1} style={{ ["--marquee-speed" as string]: `${30 + r * 8}s` }}>
            {[...row, ...row, ...row, ...row].map((item, i) => (
              <span key={i} className="flex items-center gap-6 px-3 font-display text-2xl font-semibold uppercase tracking-tight sm:text-4xl">
                {item}
                <svg width="20" height="20" viewBox="0 0 24 24" className="shrink-0" aria-hidden>
                  <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" fill="currentColor" />
                </svg>
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
