"use client";

import { useEffect, useRef } from "react";
import { startDust } from "@/lib/archDust";

// Quiet dust over the whole page: one fixed canvas that never takes pointer
// events. Starts once the page has loaded and the browser is idle, so it does
// not compete with the first paint. Nothing runs under prefers-reduced-motion.
export default function SiteDust() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let stop: (() => void) | undefined;
    let cancelled = false;
    let idleId = 0;
    let timerId = 0;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    const begin = () => {
      if (cancelled) return;
      stop = startDust(canvas, document.body);
    };
    const schedule = () => {
      if (w.requestIdleCallback) idleId = w.requestIdleCallback(begin, { timeout: 1500 });
      else timerId = window.setTimeout(begin, 300);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      if (idleId && w.cancelIdleCallback) w.cancelIdleCallback(idleId);
      window.clearTimeout(timerId);
      stop?.();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 h-full w-full"
    />
  );
}
