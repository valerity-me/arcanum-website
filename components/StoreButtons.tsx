"use client";

// Store CTA buttons + a QR placeholder. Apps are not published yet, so both
// buttons render a "Coming soon" state. Wire real URLs into APP_STORE_URL /
// GOOGLE_PLAY_URL once the listings exist.

const APP_STORE_URL: string | null = null;
const GOOGLE_PLAY_URL: string | null = null;

export default function StoreButtons() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <StoreButton
          href={APP_STORE_URL}
          label="App Store"
          sub="Coming soon"
          icon={<AppleIcon />}
        />
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

function AppleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.365 1.43c0 1.14-.42 2.2-1.12 3-.75.86-1.98 1.53-3.02 1.45-.13-1.1.42-2.27 1.1-3.02.76-.85 2.06-1.47 3.04-1.43zM20.5 17.2c-.55 1.27-.82 1.84-1.53 2.96-.99 1.57-2.39 3.52-4.12 3.53-1.54.01-1.94-1-4.03-.99-2.09.01-2.53 1.01-4.07.98-1.73-.02-3.05-1.78-4.04-3.35C-.9 16.7-1.2 12.06.72 9.6c1.12-1.43 2.63-2.26 4.06-2.26 1.46 0 2.38.99 3.59.99 1.17 0 1.88-.99 3.57-.99 1.28 0 2.63.7 3.6 1.9-3.16 1.73-2.64 6.24.36 7.96z" />
    </svg>
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
