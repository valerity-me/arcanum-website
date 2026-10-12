import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { readLegal } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms of Use — Arcanum",
  description: "Terms governing use of the Arcanum app: subscriptions, content rights, and liability.",
  alternates: { canonical: "/terms/" },
  robots: { index: true, follow: true },
};

export default function Terms() {
  return (
    <LegalPage
      docs={[
        { lang: "EN", label: "English", title: "Terms of Use", text: readLegal("terms_en.txt") },
        { lang: "RU", label: "Русский", title: "Условия использования", text: readLegal("terms_ru.txt") },
      ]}
    />
  );
}
