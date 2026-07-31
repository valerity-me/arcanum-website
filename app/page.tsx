import CinematicHero from "@/components/CinematicHero";
import Footer from "@/components/Footer";

// Public homepage: the cinematic hero (video + store badges), followed by a
// slim footer carrying the Privacy / Terms / support links Apple needs.
export default function Home() {
  return (
    <>
      <CinematicHero />
      <Footer />
    </>
  );
}
