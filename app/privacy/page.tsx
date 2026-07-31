import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { readLegal } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy — Arcanum",
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
