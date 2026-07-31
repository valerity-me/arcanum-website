import type { Metadata } from "next";
import CinematicHero from "@/components/CinematicHero";

// Evaluation lab for the 21st.dev-style cinematic hero. Not linked publicly.
export const metadata: Metadata = {
  title: "Hero lab — Arcanum",
  robots: { index: false, follow: false },
};

export default function HeroLab() {
  return <CinematicHero />;
}
