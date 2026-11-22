import AppStoreBadge from "./AppStoreBadge";
import GooglePlayBadge from "./GooglePlayBadge";
import { archetypes, type Archetype } from "@/lib/archetypes";

// Second screen: the archetypes. Plain markup, readable without any script;
// the motion (line reveals, mask reveals) is attached afterwards by
// <ArchetypesMotion />, which looks elements up by their data-arch-*
// attributes. Styles live in app/globals.css (.arch-*).
//
// The test in the app covers twelve archetypes; the page shows these five for
// now, in this order. The other pictures stay in public/archetypes/.
const SHOWN = ["explorer", "creator", "jester", "magician", "ruler"];
const shown = SHOWN.map((key) => archetypes.find((a) => a.key === key)).filter(
  (a): a is Archetype => Boolean(a),
);

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
      {/* The hero ends on pure black, the page is ink: a short blend hides the seam. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-32 bg-gradient-to-b from-black to-transparent"
        aria-hidden
      />

      {/* Same side gutters as the first screen, so the left edges line up. */}
      <div className="relative z-10 px-4 pt-28 sm:px-6 sm:pt-36 md:px-12">
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

      {/* Cards: a row of all five on a wide screen with a mouse; a swipeable
          row everywhere else. */}
      <div className="arch-pin relative z-10">
        <div data-arch-scroller className="arch-scroller">
          <ul data-arch-track className="arch-track" role="list">
            {shown.map((a) => {
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
      </div>

      <div className="relative z-10 flex flex-col items-start gap-6 px-4 pb-24 pt-16 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:pb-28 sm:pt-20 md:px-12">
        <p data-arch-cta className="font-display text-3xl font-medium leading-[1.1] sm:text-4xl">
          Take the test in the app
        </p>
        {/* Both badges are 48px high (Google requires equal heights). */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-5">
          <AppStoreBadge href={null} />
          <GooglePlayBadge href={null} />
        </div>
      </div>
    </section>
  );
}
