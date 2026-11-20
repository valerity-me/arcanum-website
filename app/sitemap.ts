import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://arcanum.garden";

// The public pages: the homepage and the two legal docs.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${BASE_URL}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/privacy/`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms/`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
