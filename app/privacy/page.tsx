import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { readLegal } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy — Arcanum",
  description: "How Arcanum processes data: what stays on your device, what's sent to our server, and your rights.",
  alternates: { canonical: "/privacy/" },
  robots: { index: true, follow: true },
};

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      docs={[
        { lang: "EN", label: "English", text: readLegal("privacy_en.txt") },
        { lang: "RU", label: "Русский", text: readLegal("privacy_ru.txt") },
      ]}
    />
  );
}
