"use client";

import type { CSSProperties, MouseEvent, ReactNode } from "react";
import type { Project } from "@/lib/types";

/* lucide-react has no brand icons, so the store logos are inline SVGs. */
export function AppleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

export function GooglePlayIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z" />
    </svg>
  );
}

const hasIOS = (app: Project) => !!app.appStore || app.platforms.includes("iOS");
const hasAndroid = (app: Project) => !!app.playStore || app.platforms.includes("Android");

/** The link to use when someone taps the app itself: their own phone's store first. */
export function storeUrlFor(app: Project): string {
  if (typeof navigator !== "undefined") {
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/i.test(ua) && app.appStore) return app.appStore;
    if (/Android/i.test(ua) && app.playStore) return app.playStore;
  }
  return app.appStore || app.playStore || "";
}

/** Wraps an app visual so tapping it opens the right store (no-op when there is no link yet). */
export function StoreTap({
  app,
  children,
  className,
  style,
}: {
  app: Project;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const fallback = app.appStore || app.playStore;
  if (!fallback)
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const url = storeUrlFor(app);
    if (url && url !== fallback) {
      e.preventDefault();
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };
  return (
    <a
      href={fallback}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      aria-label={`Open ${app.name} in the app store`}
      className={className ?? "block"}
      style={style}
    >
      {children}
    </a>
  );
}

/** Separate App Store / Google Play buttons. Listed platforms without a link yet show as "Coming soon". */
export default function StoreButtons({ app, size = "lg" }: { app: Project; size?: "lg" | "sm" }) {
  const items = [
    hasIOS(app) && { key: "ios", href: app.appStore, top: "Download on the", label: "App Store", Icon: AppleIcon },
    hasAndroid(app) && { key: "android", href: app.playStore, top: "Get it on", label: "Google Play", Icon: GooglePlayIcon },
  ].filter(Boolean) as { key: string; href: string; top: string; label: string; Icon: typeof AppleIcon }[];

  if (!items.length) return null;

  const sm = size === "sm";
  return (
    <div className={`flex flex-wrap ${sm ? "gap-2" : "gap-3"}`}>
      {items.map(({ key, href, top, label, Icon }) => {
        const inner = (
          <>
            <Icon className={sm ? "h-4 w-4" : "h-6 w-6"} />
            <span className="flex flex-col text-left leading-none">
              <span className={`${sm ? "text-[9px]" : "text-[10px]"} uppercase tracking-wide opacity-70`}>
                {href ? top : "Coming soon"}
              </span>
              <span className={`${sm ? "text-xs" : "text-base"} font-semibold`}>{label}</span>
            </span>
          </>
        );
        const base = `relative z-10 flex items-center rounded-xl border transition-colors ${
          sm ? "gap-1.5 px-2.5 py-1.5" : "gap-2.5 px-4 py-2"
        }`;
        return href ? (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label={`${top} ${label}`}
            className={`${base} border-white/15 bg-fg text-black hover:border-accent hover:bg-accent`}
          >
            {inner}
          </a>
        ) : (
          <span
            key={key}
            aria-disabled
            title="Store link coming soon"
            className={`${base} cursor-not-allowed border-white/10 text-muted opacity-60`}
          >
            {inner}
          </span>
        );
      })}
    </div>
  );
}
