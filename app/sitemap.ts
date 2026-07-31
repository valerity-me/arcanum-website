import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://arcanum.garden";

// Only the pages meant to be found: the homepage and the two legal docs.
// /preview and /hero-lab carry `robots: noindex` in their own metadata and
// are intentionally left out here too.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${BASE_URL}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/privacy/`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms/`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
