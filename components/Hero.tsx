"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Compact static hero — the first screen. Text is visible immediately (unlike
 * the scroll scenes, whose copy reveals mid-section). Keeps the cosmic entry
 * without a long scrubbed intro. Placeholder for a future 21st.dev hero;
 * the crystal-planet is a CSS stand-in for the app icon.
 */
export default function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-ink px-6 text-center">
      {/* deep cosmic backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(106,46,230,0.22),transparent_60%)]" />
      <Starfield />

      {/* crystal-planet motif (app icon stand-in) */}
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 0.61, 0.36, 1] }}
        className="relative z-10 mb-10"
      >
        <div className="relative h-28 w-28 sm:h-36 sm:w-36">
          <div className="absolute inset-0 rounded-[38%] bg-gradient-to-br from-violet-pale via-violet-soft to-violet-deep shadow-[0_0_70px_-8px_rgba(154,107,242,0.8)]" />
          <div className="absolute inset-0 rounded-[38%] mix-blend-screen bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.55),transparent_55%)]" />
          <div className="absolute left-1/2 top-1/2 h-[130%] w-[220%] -translate-x-1/2 -translate-y-1/2 -rotate-[18deg] rounded-full border border-violet-pale/70 [mask-image:radial-gradient(closest-side,transparent_60%,black_62%)]" />
        </div>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center"
      >
        <span className="mb-4 text-xs uppercase tracking-[0.4em] text-gold-light">Arcanum</span>
        <h1 className="max-w-3xl font-display text-5xl font-medium leading-[1.05] text-paper sm:text-7xl">
          Your cards are waiting
        </h1>
        <p className="mt-5 max-w-xl font-body text-base text-muted sm:text-lg">
          Tarot, a real natal chart, and daily guidance — full readings that interpret your
          situation, not just card meanings.
        </p>

        <a
          href="#download"
          className="mt-9 cursor-pointer rounded-xl border border-white/10 bg-white/[0.05] px-6 py-3 font-body text-sm font-medium text-paper backdrop-blur transition-colors duration-200 hover:border-gold/50 hover:bg-white/[0.09]"
        >
          Get the app
        </a>
      </motion.div>

      {/* scroll hint */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        aria-hidden
      >
        <div className="flex flex-col items-center gap-2 text-muted">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <span className="h-8 w-[1px] animate-pulse bg-gradient-to-b from-violet-soft to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}

function Starfield() {
  // deterministic decorative stars — no layout impact
  const stars = Array.from({ length: 60 }).map((_, i) => {
    const x = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    const y = (Math.sin(i * 78.233) * 12543.123) % 1;
    const s = (Math.abs(Math.sin(i * 3.7)) * 1.6 + 0.4).toFixed(2);
    return {
      left: `${Math.abs(x) * 100}%`,
      top: `${Math.abs(y) * 100}%`,
      size: s,
      op: (0.2 + Math.abs(Math.sin(i)) * 0.6).toFixed(2),
    };
  });
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {stars.map((st, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-violet-pale"
          style={{ left: st.left, top: st.top, width: `${st.size}px`, height: `${st.size}px`, opacity: Number(st.op) }}
        />
      ))}
    </div>
  );
}
