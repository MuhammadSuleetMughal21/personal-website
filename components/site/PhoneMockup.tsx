/* eslint-disable @next/next/no-img-element */
import type { CSSProperties, ReactNode } from "react";

/** A CSS-only modern phone frame. Children fill the screen. */
export function PhoneFrame({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`relative aspect-[9/19.5] rounded-[2.6rem] bg-gradient-to-b from-[#2a2a33] to-[#141419] p-[0.55rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.12)] ${className}`}
      style={style}
    >
      {/* side buttons */}
      <span className="absolute -left-[3px] top-[22%] h-[7%] w-[3px] rounded-l bg-[#2a2a33]" />
      <span className="absolute -left-[3px] top-[32%] h-[11%] w-[3px] rounded-l bg-[#2a2a33]" />
      <span className="absolute -right-[3px] top-[28%] h-[14%] w-[3px] rounded-r bg-[#2a2a33]" />
      <div className="relative h-full w-full overflow-hidden rounded-[2.1rem] bg-black">
        {children}
        {/* dynamic island */}
        <span className="absolute left-1/2 top-[1.6%] z-10 h-[3.4%] w-[32%] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  );
}

/** A store listing image (App Store / Google Play banner) shown as a floating card, no phone frame. */
export function StoreBanner({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-[1.75rem] bg-card shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/10 ${className}`}
    >
      <img src={src} alt={alt} className="block h-auto w-full" loading="lazy" draggable={false} />
    </div>
  );
}

/** Screenshot if one exists, otherwise a generated UI in the app's brand colour. */
export function AppScreen({ name, color, src, variant = 0 }: { name: string; color: string; src?: string; variant?: number }) {
  if (src) {
    return <img src={src} alt={`${name} screenshot`} className="h-full w-full object-cover" loading="lazy" />;
  }
  return <GeneratedScreen name={name} color={color} variant={variant} />;
}

function GeneratedScreen({ name, color, variant }: { name: string; color: string; variant: number }) {
  const initial = name.charAt(0);
  return (
    <div
      className="flex h-full w-full flex-col text-white"
      style={{ background: `linear-gradient(170deg, ${color}33 0%, #0c0c11 45%)` }}
    >
      {/* status bar */}
      <div className="flex items-center justify-between px-[9%] pt-[5%] text-[0.55em] font-semibold opacity-80">
        <span>9:41</span>
        <span className="flex gap-1">
          <span className="h-[0.6em] w-[1em] rounded-sm border border-white/70" />
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-[5%] px-[7%] pt-[9%]">
        <div className="flex items-center gap-[5%]">
          <span
            className="grid aspect-square w-[16%] place-items-center rounded-[28%] text-[0.8em] font-bold text-black"
            style={{ background: color }}
          >
            {initial}
          </span>
          <div className="flex-1 space-y-1">
            <div className="h-[0.45em] w-[70%] rounded bg-white/80" />
            <div className="h-[0.35em] w-[45%] rounded bg-white/30" />
          </div>
        </div>

        {variant % 3 === 0 && (
          <>
            <div className="rounded-[0.9em] p-[7%]" style={{ background: color }}>
              <div className="h-[0.4em] w-[40%] rounded bg-black/30" />
              <div className="mt-[8%] text-[1.15em] font-bold leading-none text-black">{name.split(" ")[0]}</div>
              <div className="mt-[10%] flex gap-[4%]">
                <div className="h-[1.2em] w-[30%] rounded-full bg-black/80" />
                <div className="h-[1.2em] w-[22%] rounded-full bg-black/20" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-[5%]">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="aspect-square rounded-[0.8em] bg-white/[0.07] p-[12%]">
                  <div className="h-[30%] w-[30%] rounded-full" style={{ background: i % 2 ? `${color}aa` : "#ffffff33" }} />
                </div>
              ))}
            </div>
          </>
        )}

        {variant % 3 === 1 && (
          <>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[0.9em] bg-white/[0.06]">
              <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                <path d="M0 50 C 15 40, 25 45, 35 30 S 60 10, 70 22 S 90 8, 100 5 L100 60 L0 60Z" fill={`${color}55`} />
                <path d="M0 50 C 15 40, 25 45, 35 30 S 60 10, 70 22 S 90 8, 100 5" fill="none" stroke={color} strokeWidth="1.5" />
              </svg>
            </div>
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-[5%] rounded-[0.8em] bg-white/[0.06] p-[5%]">
                <span className="aspect-square w-[14%] rounded-full" style={{ background: i === 0 ? color : "#ffffff22" }} />
                <div className="flex-1 space-y-1">
                  <div className="h-[0.4em] w-[60%] rounded bg-white/70" />
                  <div className="h-[0.3em] w-[35%] rounded bg-white/25" />
                </div>
              </div>
            ))}
          </>
        )}

        {variant % 3 === 2 && (
          <>
            <div className="space-y-[4%]">
              <div className="ml-auto w-[70%] rounded-[0.9em] rounded-br-sm p-[5%] text-black" style={{ background: color }}>
                <div className="h-[0.35em] w-[85%] rounded bg-black/40" />
                <div className="mt-1 h-[0.35em] w-[60%] rounded bg-black/40" />
              </div>
              <div className="w-[75%] rounded-[0.9em] rounded-bl-sm bg-white/10 p-[5%]">
                <div className="h-[0.35em] w-[90%] rounded bg-white/50" />
                <div className="mt-1 h-[0.35em] w-[70%] rounded bg-white/50" />
                <div className="mt-1 h-[0.35em] w-[40%] rounded bg-white/50" />
              </div>
              <div className="ml-auto w-[50%] rounded-[0.9em] rounded-br-sm p-[5%]" style={{ background: color }}>
                <div className="h-[0.35em] w-[80%] rounded bg-black/40" />
              </div>
            </div>
            <div className="mt-auto mb-[4%] flex items-center gap-[4%] rounded-full bg-white/10 p-[3%] pl-[6%]">
              <div className="h-[0.35em] flex-1 rounded bg-white/25" />
              <span className="aspect-square w-[14%] rounded-full" style={{ background: color }} />
            </div>
          </>
        )}
      </div>

      {/* tab bar */}
      <div className="mx-[7%] mb-[6%] mt-[4%] flex justify-around rounded-full bg-white/[0.08] py-[4%]">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="h-[0.7em] w-[0.7em] rounded-full" style={{ background: i === variant % 4 ? color : "#ffffff40" }} />
        ))}
      </div>
      <span className="mx-auto mb-[2.5%] h-[0.25em] w-[35%] rounded-full bg-white/60" />
    </div>
  );
}
