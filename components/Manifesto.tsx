"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Quiet beat between the grimoire and the CTA. Minimal motion by design. */
export default function Manifesto() {
  const reduce = useReducedMotion();
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-6">
      {/* single candle glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[40vh] w-[40vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(245,166,35,0.14),transparent_70%)] animate-flame-flicker" />

      <motion.blockquote
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1] }}
        className="relative z-10 max-w-2xl text-center"
      >
        <p className="font-display text-3xl font-medium italic leading-snug text-paper sm:text-5xl">
          Sometimes we run low on support and motivation.
          <br />
          But we deserve it.
        </p>
        <p className="mt-6 font-body text-base text-muted sm:text-lg">
          That is why we are here — and why we do what we do.
        </p>
      </motion.blockquote>
    </section>
  );
}
