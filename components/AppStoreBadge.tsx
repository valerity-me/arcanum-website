// Official Apple "Download on the App Store" artwork (public/badges/app-store-badge.svg,
// black lockup). Per Apple's marketing guidelines: never recolor, rotate, add
// effects, or place other content within a clear space of 1/4 of the badge's
// height on every side; minimum on-screen height 40px. We render the artwork
// as-is, with no extra background/border container. The only concession for
// the "not published yet" state is dimming the whole thing via opacity — the
// badge itself stays untouched.
export default function AppStoreBadge({ href }: { href: string | null }) {
  const disabled = !href;
  const badge = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/badges/app-store-badge.svg"
      alt="Download on the App Store"
      height={48}
      width={143}
      className="h-12 w-auto"
    />
  );

  if (disabled) {
    return (
      <div className="cursor-not-allowed opacity-70" aria-disabled title="Coming soon">
        {badge}
      </div>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
      {badge}
    </a>
  );
}
