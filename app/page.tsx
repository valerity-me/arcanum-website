import CinematicHero from "@/components/CinematicHero";

// Deliberately conservative: no ratingValue/reviewCount/offers/price. The app
// isn't published on any store yet, so those fields would be fabricated —
// this only states what's actually true today.
const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Arcanum",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "iOS, Android",
  description:
    "Tarot spreads, a real natal chart, and daily guidance — full readings that interpret your situation, not just card meanings.",
  publisher: {
    "@type": "Organization",
    name: "VO Digital",
  },
};

// Public homepage: a single full-viewport cinematic hero (video + store badges),
// with legal links, contact and copyright laid over the image itself.
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />
      <CinematicHero />
    </>
  );
}
