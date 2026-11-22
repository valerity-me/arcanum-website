"use client";

import { useEffect } from "react";
import AppStoreBadge from "./AppStoreBadge";
import GooglePlayBadge from "./GooglePlayBadge";

// Hero art: a scene of writing in a journal by candlelight, subject on the
// right, calm dark space on the left for the text.
const HERO_ART = "/hero-diary.webp";

export default function CinematicHero() {
  // Robust mobile viewport height: CSS vh/svh/dvh units are inconsistent
  // across Safari versions (some don't account for the floating toolbar, some
  // leave a dead gap above its own chrome). window.innerHeight always matches
  // the real, currently-visible area, in every browser. We mirror it into a
  // CSS var and use that instead of relying on any viewport unit.
  useEffect(() => {
    const setRealVh = () => {
      const h = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty("--real-vh", `${h}px`);
    };
    setRealVh();
    window.addEventListener("resize", setRealVh);
    window.addEventListener("orientationchange", setRealVh);
    window.visualViewport?.addEventListener("resize", setRealVh);
    return () => {
      window.removeEventListener("resize", setRealVh);
      window.removeEventListener("orientationchange", setRealVh);
      window.visualViewport?.removeEventListener("resize", setRealVh);
    };
  }, []);

  return (
    <div
      className="hero-viewport relative w-full overflow-hidden bg-black font-body text-paper"
    >
      {/* Mobile-only ambient glow behind the figure */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(106,46,230,0.20),transparent_60%)] sm:hidden"
        aria-hidden
      />

      {/* Hero scene. Mobile: a frame above the text, cropped to the figure
          and the journal. Desktop: full bleed, the figure stays on the right.
          Edges melt into the black page via a mask (fine on an <img>, unlike
          on <video>). */}
      <div className="pointer-events-none absolute inset-x-0 top-12 z-0 h-[46%] sm:inset-0 sm:h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_ART}
          alt=""
          className="hero-art-fade h-full w-full object-cover object-[76%_40%] sm:object-[72%_50%]"
        />
      </div>

      {/* Desktop: a soft shade on the left keeps the text readable when a
          narrow window pulls the figure toward it. */}
      <div
        className="pointer-events-none absolute inset-0 z-0 hidden bg-gradient-to-r from-black/70 via-black/20 to-transparent sm:block"
        aria-hidden
      />

      {/* Foreground column */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Navbar — wordmark only, set in the brand display face */}
        <nav className="relative z-50 flex items-center justify-between px-4 py-4 sm:px-6 md:px-12 md:py-6">
          <div className="flex h-8 items-center md:h-10">
            <span className="font-display text-2xl font-medium tracking-[0.02em] md:text-3xl">
              Arcanum
            </span>
          </div>
        </nav>

        {/* Hero content */}
        <div className="z-10 flex flex-1 flex-col justify-end px-4 pb-24 sm:px-6 sm:pb-24 md:px-12 md:pb-28">
          {/* One entrance for the whole block: a short fade and rise. */}
          <div className="animate-fade-rise max-w-3xl" style={{ animationDelay: "150ms" }}>
            {/* Title */}
            {/* Line breaks follow the meaning: "ten seconds a day" never splits,
                and from sm up each half of the sentence gets its own line. */}
            <h1 className="mb-3 font-display text-[40px] font-medium leading-[1.05] sm:mb-4 sm:text-6xl md:mb-6 md:text-7xl">
              Untangle <span className="whitespace-nowrap">your thoughts,</span>
              <br className="hidden sm:inline" />{" "}
              <span className="whitespace-nowrap">ten seconds a day</span>
            </h1>

            {/* Description */}
            <p className="mb-6 max-w-xl text-base text-muted sm:text-lg md:mb-10 md:text-xl">
              Write a line about your day. Arcanum notices what lifts you and what drains you, and turns your weeks into a book about you.
            </p>

            {/* App store badges */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-5">
              <AppStoreBadge href={null} />
              <GooglePlayBadge href={null} />
            </div>
          </div>
        </div>

        {/* Legal footer: pinned close to the true bottom edge, independent of the
            title/description/badges above (which bottom-align as their own
            block). `env(safe-area-inset-bottom)` keeps it clear of the home
            indicator bar on notched iPhones. */}
        <div
          className="animate-fade-rise absolute inset-x-0 bottom-0 z-10 flex flex-col px-4 text-xs text-muted sm:px-6 md:px-12"
          style={{
            animationDelay: "300ms",
            paddingBottom: "max(0.875rem, env(safe-area-inset-bottom))",
          }}
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <a href="/privacy/" className="cursor-pointer transition-colors hover:text-paper">
              Privacy Policy
            </a>
            <a href="/terms/" className="cursor-pointer transition-colors hover:text-paper">
              Terms of Use
            </a>
            <a
              href="mailto:support@arcanum.garden"
              className="cursor-pointer transition-colors hover:text-paper"
            >
              support@arcanum.garden
            </a>
          </div>
          <p className="mt-2 max-w-2xl text-[11px] leading-relaxed text-muted">
            © {new Date().getFullYear()} VO Digital — a sole proprietorship registered in the
            Republic of Kazakhstan. For entertainment and self-reflection.
          </p>
        </div>
      </div>
    </div>
  );
}
