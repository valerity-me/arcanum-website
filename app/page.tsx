import Footer from "@/components/Footer";
import StoreButtons from "@/components/StoreButtons";

// Simple public landing — the App Store's marketing + support target.
// The animated scroll experience lives at /preview until its assets are ready.

const features = [
  {
    title: "Card of the day",
    body: "Every morning, a personal card and a warm hint — where your strength is today.",
  },
  {
    title: "Tarot spreads",
    body: "Not just card meanings — a full reading that interprets your actual situation.",
  },
  {
    title: "Astrology & natal chart",
    body: "A real natal chart from your birth date, plus compatibility with a partner.",
  },
];

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-ink">
      {/* ambient cosmic glow + faint stars */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(106,46,230,0.20),transparent_55%)]" />
      <StaticStarfield />

      <div className="relative z-10 mx-auto flex max-w-content flex-col items-center px-6">
        {/* hero */}
        <section className="flex min-h-[92svh] flex-col items-center justify-center text-center">
          <img
            src="/icon.png"
            alt="Arcanum app icon"
            width={132}
            height={132}
            className="mb-9 h-28 w-28 rounded-[28%] shadow-[0_0_70px_-10px_rgba(154,107,242,0.75)] sm:h-32 sm:w-32"
          />
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-gold-light">Arcanum</p>
          <h1 className="max-w-3xl font-display text-5xl font-medium leading-[1.05] text-paper sm:text-7xl">
            Your cards are waiting
          </h1>
          <p className="mt-5 max-w-xl font-body text-base text-muted sm:text-lg">
            Tarot, a real natal chart, and daily guidance — full readings that interpret your
            situation, not just card meanings.
          </p>

          <div className="mt-10">
            <StoreButtons />
          </div>
        </section>

        {/* features */}
        <section className="grid w-full max-w-4xl gap-6 pb-24 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur"
            >
              <h2 className="font-display text-2xl font-medium text-paper">{f.title}</h2>
              <p className="mt-3 font-body text-sm leading-relaxed text-muted">{f.body}</p>
            </div>
          ))}
        </section>

        {/* support — satisfies Apple's Support URL requirement */}
        <section id="support" className="pb-24 text-center">
          <h2 className="font-display text-3xl font-medium text-paper">Support & contact</h2>
          <p className="mx-auto mt-4 max-w-md font-body text-base text-muted">
            Questions, feedback, or a data request? Write to us — we read every message.
          </p>
          <a
            href="mailto:valerity.me@gmail.com"
            className="mt-6 inline-block cursor-pointer rounded-xl border border-white/10 bg-white/[0.05] px-6 py-3 font-body text-sm font-medium text-paper transition-colors duration-200 hover:border-gold/50 hover:bg-white/[0.09]"
          >
            valerity.me@gmail.com
          </a>
        </section>
      </div>

      <Footer />
    </main>
  );
}

// Deterministic, server-rendered decorative stars (no client JS needed).
function StaticStarfield() {
  const stars = Array.from({ length: 48 }).map((_, i) => {
    const x = Math.abs((Math.sin(i * 12.9898) * 43758.5453) % 1);
    const y = Math.abs((Math.sin(i * 78.233) * 12543.123) % 1);
    const size = (Math.abs(Math.sin(i * 3.7)) * 1.5 + 0.4).toFixed(2);
    const op = (0.15 + Math.abs(Math.sin(i)) * 0.5).toFixed(2);
    return { left: `${x * 100}%`, top: `${y * 70}%`, size, op };
  });
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-violet-pale"
          style={{ left: s.left, top: s.top, width: `${s.size}px`, height: `${s.size}px`, opacity: Number(s.op) }}
        />
      ))}
    </div>
  );
}
