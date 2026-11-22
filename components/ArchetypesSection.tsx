import AppStoreBadge from "./AppStoreBadge";
import { archetypes, type Archetype } from "@/lib/archetypes";

// Second screen: the twelve archetypes. Plain markup, readable without any
// script; the motion (smooth scroll, line reveals, pinned ribbon, dust) is
// attached afterwards by <ArchetypesMotion />, which looks elements up by
// their data-arch-* attributes. Styles live in app/globals.css (.arch-*).
const FLIP_MARKER = "The flip side:";

// `about` in the app is "<strength>. The flip side: <flip>". Same words, set
// as two lines: the marker stays with the second one.
function splitAbout(about: Archetype["about"]) {
  const at = about.indexOf(FLIP_MARKER);
  if (at === -1) return { strength: about, flip: null };
  return {
    strength: about.slice(0, at).trim(),
    flip: about.slice(at + FLIP_MARKER.length).trim(),
  };
}

export default function ArchetypesSection() {
  return (
    <section
      id="archetypes"
      aria-labelledby="archetypes-title"
      data-arch-section
      className="relative bg-ink font-body text-paper"
    >
      {/* Dust layer: one viewport-sized canvas that stays in view while the
          section scrolls past (sticky), so it never grows with the pinned
          scroll distance. Drawn by ArchetypesMotion; empty without it. */}
      <div className="arch-dust" aria-hidden>
        <canvas data-arch-dust />
      </div>

      {/* The hero ends on pure black, the page is ink: a short blend hides the seam. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-32 bg-gradient-to-b from-black to-transparent"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-content px-4 pt-28 sm:px-6 sm:pt-36 md:px-12">
        {/* Line breaks follow the meaning: each half of the phrase stays whole. */}
        <h2
          id="archetypes-title"
          data-arch-title
          className="max-w-3xl font-display text-[34px] font-medium leading-[1.08] sm:text-5xl md:text-6xl"
        >
          <span className="whitespace-nowrap">Meet the character</span>
          <br className="hidden sm:inline" />{" "}
          <span className="whitespace-nowrap">you already are</span>
        </h2>
        <p
          data-arch-lead
          className="mt-6 max-w-xl text-base text-muted sm:mt-8 sm:text-lg md:text-xl"
        >
          A 24-question test in the app shows which of twelve archetypes leads you. Every archetype
          has a strength and a flip side.
        </p>
      </div>

      {/* Ribbon. On a desktop with a mouse it is pinned and the page scroll
          moves it sideways; everywhere else it is a swipeable row. */}
      <div data-arch-pin className="arch-pin relative z-10">
        <div className="arch-marquee font-display font-medium text-paper/[0.05]" aria-hidden>
          <div className="arch-marquee-track">
            {[0, 1].map((copy) => (
              <span key={copy} className="arch-marquee-set">
                {archetypes.map((a) => (
                  <span key={a.key}>{a.name}</span>
                ))}
              </span>
            ))}
          </div>
        </div>

        <div data-arch-scroller className="arch-scroller">
          <ul data-arch-track className="arch-track" role="list">
            {archetypes.map((a) => {
              const { strength, flip } = splitAbout(a.about);
              return (
                <li key={a.key} data-arch-card className="arch-card">
                  <article tabIndex={0} className="arch-article">
                    <div data-arch-mask className="arch-mask">
                      <div data-arch-inner className="arch-inner">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/archetypes/${a.key}.webp`}
                          alt=""
                          width={720}
                          height={1080}
                          loading="lazy"
                          decoding="async"
                          className="arch-img"
                        />
                      </div>
                    </div>
                    <div className="arch-caption">
                      <h3 className="font-display text-[28px] font-medium leading-[1.1]">{a.name}</h3>
                      <p className="mt-1 text-sm text-muted">{a.motto}</p>
                    </div>
                    <div className="arch-about">
                      <p className="text-paper/85">{strength}</p>
                      {flip && (
                        <p className="arch-flip text-muted">
                          <span className="text-paper">{FLIP_MARKER}</span> {flip}
                        </p>
                      )}
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="arch-progress" aria-hidden>
          <span data-arch-bar />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-content flex-col items-start gap-6 px-4 pb-28 pt-16 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:pb-36 sm:pt-20 md:px-12">
        <p data-arch-cta className="font-display text-3xl font-medium leading-[1.1] sm:text-4xl">
          Take the test in the app
        </p>
        <AppStoreBadge href={null} />
      </div>
    </section>
  );
}
