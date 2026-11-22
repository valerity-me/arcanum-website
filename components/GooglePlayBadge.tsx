// Official Google Play "Get it on Google Play" badge
// (public/badges/google-play-badge.png, 478×142, en-US, full color).
// Per Google Play badge guidelines: use the artwork as provided, never
// recolor or alter it, and link it to the app's Google Play listing.
// Rendered at exactly the same height as the App Store badge (48px, h-12):
// Google requires the two badges to match in height, so the height is fixed
// and the width follows each artwork's own proportions. While the app is not on Google Play yet, it is dimmed
// and not a link, the same way as the App Store badge.
export default function GooglePlayBadge({ href }: { href: string | null }) {
  const badge = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/badges/google-play-badge.png"
      alt="Get it on Google Play"
      width={162}
      height={48}
      className="block h-12 w-auto"
    />
  );

  if (!href) {
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
