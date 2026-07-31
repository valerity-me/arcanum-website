import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // Absolute base for OG/social image URLs. Override per deploy via
  // NEXT_PUBLIC_SITE_URL once the real domain is known.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://arcanum.garden"),
  title: "Arcanum — Tarot, astrology & daily guidance",
  description:
    "Arcanum is a dark, cosmic app for tarot spreads, a real natal chart, and daily guidance. A quiet place for self-reflection and motivation.",
  icons: {
    // Single 1024×1024 source; browsers downscale. Optimised sizes can come later.
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Arcanum",
    description: "Tarot, a real natal chart, and daily guidance — in one dark, quiet place.",
    type: "website",
    images: [{ url: "/icon.png", width: 1024, height: 1024, alt: "Arcanum" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0A0F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Fonts loaded at runtime so the build never blocks on a font fetch.
            Tailwind's fontFamily lists these names directly (font-display /
            font-body), so if the CDN is slow the fallbacks in that list apply. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
