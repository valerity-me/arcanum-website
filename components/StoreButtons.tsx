"use client";

import AppStoreBadge from "./AppStoreBadge";

// Store CTA buttons + a QR placeholder. Apps are not published yet, so both
// render a "Coming soon" state. Wire real URLs into APP_STORE_URL /
// GOOGLE_PLAY_URL once the listings exist.

const APP_STORE_URL: string | null = null;
const GOOGLE_PLAY_URL: string | null = null;

export default function StoreButtons() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <AppStoreBadge href={APP_STORE_URL} />
        <StoreButton
          href={GOOGLE_PLAY_URL}
          label="Google Play"
          sub="Coming soon"
          icon={<GooglePlayIcon />}
        />
      </div>

      <div className="flex items-center gap-3 text-muted">
        <QrPlaceholder />
        <span className="max-w-[10rem] text-left font-body text-xs leading-relaxed">
          Scan to download once we launch
        </span>
      </div>
    </div>
  );
}

function StoreButton({
  href,
  label,
  sub,
  icon,
}: {
  href: string | null;
  label: string;
  sub: string;
  icon: React.ReactNode;
}) {
  const disabled = !href;
  const className =
    "group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 backdrop-blur transition-colors duration-200 " +
    (disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:border-gold/50 hover:bg-white/[0.07]");

  const inner = (
    <>
      <span className="text-paper">{icon}</span>
      <span className="flex flex-col text-left leading-tight">
        <span className="font-body text-[10px] uppercase tracking-widest text-muted">{sub}</span>
        <span className="font-body text-base font-semibold text-paper">{label}</span>
      </span>
    </>
  );

  if (disabled) {
    return (
      <div className={className} aria-disabled title="Coming soon">
        {inner}
      </div>
    );
  }
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  );
}

function QrPlaceholder() {
  return (
    <div
      className="grid h-16 w-16 shrink-0 grid-cols-5 grid-rows-5 gap-[2px] rounded-md border border-white/10 bg-white/[0.04] p-1.5"
      aria-label="QR code placeholder"
      role="img"
    >
      {Array.from({ length: 25 }).map((_, i) => (
        <span
          key={i}
          className={
            "rounded-[1px] " +
            // deterministic checkerboard-ish pattern, purely decorative
            ([0, 1, 2, 4, 5, 8, 10, 12, 14, 16, 18, 20, 22, 23, 24].includes(i)
              ? "bg-paper/70"
              : "bg-transparent")
          }
        />
      ))}
    </div>
  );
}

function GooglePlayIcon() {
  return (
    <svg width="20" height="22" viewBox="0 0 24 24" aria-hidden>
      <path d="M3.6 1.8c-.2.2-.3.5-.3.9v18.6c0 .4.1.7.3.9l.1.1L14 12.1v-.2L3.7 1.7l-.1.1z" fill="#9A6BF2" />
      <path d="M17.5 15.6 14 12.1v-.2l3.5-3.5.1.1 4.1 2.3c1.2.7 1.2 1.8 0 2.5l-4.2 2.3z" fill="#E3C77B" />
      <path d="m17.6 15.5-3.6-3.5L3.6 22.3c.4.4 1 .5 1.8.1l12.2-6.9" fill="#D8C9F8" />
      <path d="M17.6 8.5 5.4 1.6c-.8-.4-1.4-.4-1.8.1L14 12.1l3.6-3.6z" fill="#6A2EE6" />
    </svg>
  );
}
