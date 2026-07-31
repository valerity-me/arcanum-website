import type { Metadata } from "next";
import ScrollProgress from "@/components/ScrollProgress";
import Hero from "@/components/Hero";
import ScrollScene from "@/components/ScrollScene";
import Manifesto from "@/components/Manifesto";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { scenes } from "@/lib/scenes";

// Work-in-progress scroll experience (the animated "dive"). Kept off the public
// homepage until the Kling assets are wired. Not linked publicly.
export const metadata: Metadata = {
  title: "Arcanum — preview",
  robots: { index: false, follow: false },
};

export default function Preview() {
  return (
    <main className="relative bg-ink">
      <ScrollProgress />

      <Hero />

      {/* The scroll "dive": each scene is one Kling video block, scrubbed by scroll.
          Order follows kling-shot-brief.md (card → spreads → astrology → grimoire). */}
      {scenes.map((scene, i) => (
        <ScrollScene key={scene.id} scene={scene} index={i} />
      ))}

      <Manifesto />
      <CTA />
      <Footer />
    </main>
  );
}
