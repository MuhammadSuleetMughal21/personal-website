"use client";

/** Tiny pub/sub so sections can wait for the preloader to finish. */
let done = false;
const listeners = new Set<() => void>();

export function finishIntro() {
  if (done) return;
  done = true;
  listeners.forEach((fn) => fn());
  listeners.clear();
}

export function onIntroDone(fn: () => void) {
  if (done) {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => listeners.delete(fn);
}
