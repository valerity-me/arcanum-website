"use client";

import { motion, useReducedMotion } from "framer-motion";
import StoreButtons from "./StoreButtons";

export default function CTA() {
  const reduce = useReducedMotion();
  return (
    <section
      id="download"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink px-6 py-24"
    >
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(106,46,230,0.14),transparent_60%)]" />

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        {/* phone placeholder — swap for the real product shot / app UI */}
        <div className="mb-10 flex h-[380px] w-[190px] items-center justify-center rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent shadow-[0_0_60px_-10px_rgba(106,46,230,0.5)]">
          <span className="font-display text-sm tracking-widest text-muted">app preview</span>
        </div>

        <h2 className="font-display text-5xl font-medium tracking-wide text-paper sm:text-7xl">Arcanum</h2>
        <p className="mt-4 max-w-md font-body text-base text-muted sm:text-lg">
          Tarot, a real natal chart, and daily guidance — in one dark, quiet place.
        </p>

        <div className="mt-10">
          <StoreButtons />
        </div>
      </motion.div>
    </section>
  );
}
