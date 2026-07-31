"use client";

const VIDEO_URL = "/hero-loop.mp4";

export default function CinematicHero() {
  return (
    <div
      className="relative h-[100svh] w-full overflow-hidden bg-black text-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Mobile-only ambient glow behind the floating card */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(106,46,230,0.20),transparent_60%)] sm:hidden"
        aria-hidden
      />

      {/* Background video.
          Mobile: a smaller, centred frame focused on the card, with soft-faded
          edges (mask) so it melts into the dark background — card gets breathing
          room on all sides. Desktop: full-bleed cover. */}
      <video
        className="absolute left-1/2 top-[42%] z-0 h-[54%] w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[2rem] object-cover object-[76%_45%] [mask-image:radial-gradient(120%_120%_at_50%_45%,#000_50%,transparent_100%)] sm:left-0 sm:top-0 sm:h-full sm:w-full sm:max-w-none sm:translate-x-0 sm:translate-y-0 sm:rounded-none sm:object-center sm:[mask-image:none]"
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
      />

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
              className="animate-blur-fade-up mb-4 text-3xl font-normal sm:text-5xl md:mb-6 md:text-6xl lg:text-7xl"
              style={{ animationDelay: "400ms", letterSpacing: "-0.04em" }}
            >
              Your cards are waiting
            </h1>

            {/* Description */}
            <p
              className="animate-blur-fade-up mb-6 max-w-xl text-base text-gray-300 sm:text-lg md:mb-10 md:text-xl"
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
