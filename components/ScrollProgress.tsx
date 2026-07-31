"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin brass progress line at the top — recommended for scroll-story pattern. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-gradient-to-r from-violet-deep via-violet-soft to-gold-light"
      aria-hidden
    />
  );
}
