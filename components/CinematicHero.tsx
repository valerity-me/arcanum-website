"use client";

import { useEffect } from "react";
import AppStoreBadge from "./AppStoreBadge";

// Hero art: the Sage archetype from the app (risograph, grayscale source)
// tinted to the brand violet. A stand-in until the dedicated diary scene.
const HERO_ART = "/hero-sage.webp";

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
      className="hero-viewport relative w-full overflow-hidden bg-black font-body text-white"
    >
      {/* Mobile-only ambient glow behind the figure */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(106,46,230,0.20),transparent_60%)] sm:hidden"
        aria-hidden
      />

      {/* Archetype art. Mobile: a frame above the text. Desktop: a tall
          panel on the right. Edges melt into the black page via a mask
          (fine on an <img>, unlike on <video>). Dimmed on mid widths, where
          the text runs over it. */}
      <div className="pointer-events-none absolute inset-x-0 top-12 z-0 h-[46%] sm:inset-x-auto sm:right-0 sm:top-0 sm:aspect-[2/3] sm:h-full sm:opacity-50 lg:opacity-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_ART}
          alt=""
          className="hero-art-fade h-full w-full object-cover object-[50%_32%] sm:object-center"
        />
      </div>

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
          <div className="animate-fade-rise max-w-2xl" style={{ animationDelay: "150ms" }}>
            {/* Title */}
            <h1 className="mb-3 text-balance font-display text-[40px] font-medium leading-[1.05] sm:mb-4 sm:text-6xl md:mb-6 md:text-7xl">
              Untangle your thoughts, ten seconds a day
            </h1>

            {/* Description */}
            <p className="mb-6 max-w-xl text-base text-gray-400 sm:text-lg md:mb-10 md:text-xl">
              Write a line about your day. Arcanum notices what lifts you and what drains you, and turns your weeks into a book about you.
            </p>

            {/* App store badges */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-5">
              <AppStoreBadge href={null} />
              <StoreBadge label="Google Play" sub="Coming soon" />
            </div>
          </div>
        </div>

        {/* Caption for the figure: who this is. Desktop only, bottom right. */}
        <p className="animate-fade-rise absolute bottom-14 right-6 z-10 hidden max-w-[16rem] text-right text-sm text-gray-400 lg:right-12 lg:block" style={{ animationDelay: "300ms" }}>
          The Sage, one of twelve archetypes. Meet the character you already are
        </p>

        {/* Legal footer: pinned close to the true bottom edge, independent of the
            title/description/badges above (which bottom-align as their own
            block). `env(safe-area-inset-bottom)` keeps it clear of the home
            indicator bar on notched iPhones. */}
        <div
          className="animate-fade-rise absolute inset-x-0 bottom-0 z-10 flex flex-col px-4 text-xs text-gray-400 sm:px-6 md:px-12"
          style={{
            animationDelay: "300ms",
            paddingBottom: "max(0.875rem, env(safe-area-inset-bottom))",
          }}
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <a href="/privacy/" className="cursor-pointer transition-colors hover:text-white">
              Privacy Policy
            </a>
            <a href="/terms/" className="cursor-pointer transition-colors hover:text-white">
              Terms of Use
            </a>
            <a
              href="mailto:support@arcanum.garden"
              className="cursor-pointer transition-colors hover:text-white"
            >
              support@arcanum.garden
            </a>
          </div>
          <p className="mt-1.5 max-w-2xl text-[11px] leading-relaxed text-gray-500">
            © {new Date().getFullYear()} VO Digital — a sole proprietorship registered in the
            Republic of Kazakhstan. For entertainment and self-reflection.
          </p>
        </div>
      </div>
    </div>
  );
}

// Google Play pill in the hero's liquid glass. The app isn't on Google Play
// yet, so it's a non-interactive "Coming soon" label. Text only: Google's
// brand rules forbid recoloring the Play logo, so it waits for the official
// badge artwork, which goes in together with the real listing URL.
function StoreBadge({ label, sub }: { label: string; sub: string }) {
  return (
    <div
      className="liquid-glass flex h-12 flex-col justify-center rounded-full px-5 leading-tight sm:px-6"
      title="Coming soon"
    >
      <span className="text-xs text-gray-400">{sub}</span>
      <span className="text-sm font-semibold text-white sm:text-base">{label}</span>
    </div>
  );
}
