"use client";

import { useEffect } from "react";
import AppStoreBadge from "./AppStoreBadge";

const VIDEO_URL = "/hero-loop.mp4";

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
      {/* Mobile-only ambient glow behind the floating card */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(106,46,230,0.20),transparent_60%)] sm:hidden"
        aria-hidden
      />

      {/* Background video.
          Mobile: a large frame focused on the card. Desktop: full-bleed cover. */}
      <div className="absolute left-1/2 top-12 z-0 h-[44%] w-[99%] -translate-x-1/2 overflow-hidden sm:left-0 sm:top-0 sm:h-full sm:w-full sm:translate-x-0 sm:translate-y-0">
        <video
          className="h-full w-full object-cover object-[90%_42%] sm:object-center"
          src={VIDEO_URL}
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Fade to black at the top and bottom edges of the video frame.
            Plain gradient overlays, not a CSS mask/filter: masking a <video>
            element is unreliable across Safari versions (hardware video
            decode lives on its own compositing layer that often ignores
            mask-image), whereas an ordinary alpha-blended gradient div works
            identically in every browser. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black to-transparent sm:hidden"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent sm:hidden"
          aria-hidden
        />
      </div>

      {/* Bottom blur overlay — desktop full-bleed only (mobile text sits on the dark bg) */}
      <div
        className="bottom-blur-mask pointer-events-none absolute inset-0 z-[1] hidden sm:block"
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
          <div className="animate-fade-rise max-w-2xl" style={{ animationDelay: "150ms" }}>
            {/* Title */}
            <h1 className="mb-3 font-display text-[40px] font-medium leading-[1.05] sm:mb-4 sm:text-6xl md:mb-6 md:text-7xl">
              Your cards are waiting
            </h1>

            {/* Description */}
            <p className="mb-6 max-w-xl text-base text-gray-400 sm:text-lg md:mb-10 md:text-xl">
              Arcanum begins with an archetype test and a ten-second daily entry. From them it shows the abilities you overlook, what lifts you and what drains you, and writes a book about you, with a new chapter for every week of your diary. A daily tarot card and spreads are there when you want to reflect.
            </p>

            {/* App store badges */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-5">
              <AppStoreBadge href={null} />
              <StoreBadge label="Google Play" sub="Coming soon" />
            </div>
          </div>
        </div>

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
