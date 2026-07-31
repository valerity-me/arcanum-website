import CinematicHero from "@/components/CinematicHero";

// No ratingValue/reviewCount — the app isn't published on any store yet, so
// those would be fabricated. Subscription prices ARE real (configured in App
// Store Connect), so those are included; availability is PreOrder since the
// app itself isn't live yet.
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
  offers: [
    {
      "@type": "Offer",
      name: "Weekly subscription",
      price: "1.99",
      priceCurrency: "USD",
      availability: "https://schema.org/PreOrder",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "1.99",
        priceCurrency: "USD",
        billingDuration: "P1W",
      },
    },
    {
      "@type": "Offer",
      name: "Monthly subscription",
      price: "4.99",
      priceCurrency: "USD",
      availability: "https://schema.org/PreOrder",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "4.99",
        priceCurrency: "USD",
        billingDuration: "P1M",
      },
    },
    {
      "@type": "Offer",
      name: "Yearly subscription",
      price: "39.99",
      priceCurrency: "USD",
      availability: "https://schema.org/PreOrder",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "39.99",
        priceCurrency: "USD",
        billingDuration: "P1Y",
      },
    },
  ],
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
