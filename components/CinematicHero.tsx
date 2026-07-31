"use client";

import { useEffect } from "react";

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
      className="hero-viewport relative w-full overflow-hidden bg-black text-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Mobile-only ambient glow behind the floating card */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(106,46,230,0.20),transparent_60%)] sm:hidden"
        aria-hidden
      />

      {/* Background video.
          Mobile: a large frame focused on the card. Desktop: full-bleed cover. */}
      <div className="absolute left-1/2 top-[32%] z-0 h-[80%] w-[99%] -translate-x-1/2 -translate-y-1/2 overflow-hidden sm:left-0 sm:top-0 sm:h-full sm:w-full sm:translate-x-0 sm:translate-y-0">
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
        {/* Navbar — logo only */}
        <nav className="relative z-50 flex items-center justify-between px-4 py-4 sm:px-6 md:px-12 md:py-6">
          <div
            className="animate-blur-fade-up flex h-8 items-center text-xl font-semibold tracking-[0.25em] md:h-10 md:text-2xl"
            style={{ animationDelay: "0ms" }}
          >
            ARCANUM
          </div>
        </nav>

        {/* Hero content */}
        <div className="z-10 flex flex-1 flex-col justify-end px-4 pb-8 sm:px-6 md:px-12 md:pb-16">
          <div className="max-w-2xl">
            {/* Title */}
            <h1
              className="animate-blur-fade-up mb-2 text-2xl font-normal sm:mb-4 sm:text-5xl md:mb-6 md:text-6xl lg:text-7xl"
              style={{ animationDelay: "400ms", letterSpacing: "-0.04em" }}
            >
              Your cards are waiting
            </h1>

            {/* Description */}
            <p
              className="animate-blur-fade-up mb-6 max-w-xl text-base text-gray-400 sm:text-lg md:mb-10 md:text-xl"
              style={{ animationDelay: "500ms" }}
            >
              Tarot, a real natal chart, and daily guidance — full readings that speak to your
              moment, not just card meanings.
            </p>

            {/* App store badges */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <StoreBadge
                label="App Store"
                sub="Coming soon"
                icon={<AppleGlyph />}
                delay="600ms"
              />
              <StoreBadge
                label="Google Play"
                sub="Coming soon"
                icon={<GooglePlayGlyph />}
                delay="700ms"
              />
            </div>

            {/* On-image footer: legal links, contact and copyright — no black bar */}
            <div
              className="animate-blur-fade-up mt-7 flex flex-col gap-1.5 text-xs text-gray-400 sm:mt-9"
              style={{ animationDelay: "800ms" }}
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
              <p className="max-w-2xl text-[11px] leading-relaxed text-gray-500">
                © {new Date().getFullYear()} VO Digital — a sole proprietorship registered in the
                Republic of Kazakhstan. For entertainment and self-reflection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Store badge styled to match the hero's liquid glass. Apps aren't published yet,
// so these are non-interactive "Coming soon" pills. Swap for the official
// App Store / Google Play badge artwork + real URLs once the listings are live.
function StoreBadge({
  label,
  sub,
  icon,
  delay,
}: {
  label: string;
  sub: string;
  icon: React.ReactNode;
  delay: string;
}) {
  return (
    <div
      className="liquid-glass animate-blur-fade-up flex items-center gap-3 rounded-full px-5 py-2.5 sm:px-6 sm:py-3"
      style={{ animationDelay: delay }}
      title="Coming soon"
    >
      <span className="text-white">{icon}</span>
      <span className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-widest text-gray-400">{sub}</span>
        <span className="text-sm font-semibold text-white sm:text-base">{label}</span>
      </span>
    </div>
  );
}

function AppleGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.365 1.43c0 1.14-.42 2.2-1.12 3-.75.86-1.98 1.53-3.02 1.45-.13-1.1.42-2.27 1.1-3.02.76-.85 2.06-1.47 3.04-1.43zM20.5 17.2c-.55 1.27-.82 1.84-1.53 2.96-.99 1.57-2.39 3.52-4.12 3.53-1.54.01-1.94-1-4.03-.99-2.09.01-2.53 1.01-4.07.98-1.73-.02-3.05-1.78-4.04-3.35C-.9 16.7-1.2 12.06.72 9.6c1.12-1.43 2.63-2.26 4.06-2.26 1.46 0 2.38.99 3.59.99 1.17 0 1.88-.99 3.57-.99 1.28 0 2.63.7 3.6 1.9-3.16 1.73-2.64 6.24.36 7.96z" />
    </svg>
  );
}

function GooglePlayGlyph() {
  return (
    <svg width="18" height="20" viewBox="0 0 24 24" aria-hidden>
      <path d="M3.6 1.8c-.2.2-.3.5-.3.9v18.6c0 .4.1.7.3.9l.1.1L14 12.1v-.2L3.7 1.7l-.1.1z" fill="#9A6BF2" />
      <path d="M17.5 15.6 14 12.1v-.2l3.5-3.5.1.1 4.1 2.3c1.2.7 1.2 1.8 0 2.5l-4.2 2.3z" fill="#E3C77B" />
      <path d="m17.6 15.5-3.6-3.5L3.6 22.3c.4.4 1 .5 1.8.1l12.2-6.9" fill="#D8C9F8" />
      <path d="M17.6 8.5 5.4 1.6c-.8-.4-1.4-.4-1.8.1L14 12.1l3.6-3.6z" fill="#6A2EE6" />
    </svg>
  );
}
