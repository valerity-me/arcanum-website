// Central config for the scroll "dive" narrative.
// Each scene maps to one Kling video block (see kling-shot-brief.md).
// While real WebP sequences don't exist yet, `framesPath` can be null and the
// ScrollScene component renders a procedural placeholder so the mechanism is
// testable right now.

export type Scene = {
  id: string;
  /** Junction frames bracketing this block, for reference (J0..J7). */
  junction: [string, string];
  /** Section scroll length in viewport heights. Bigger = slower scrub. */
  scrollVh: number;
  /** Number of frames in the sequence. */
  frameCount: number;
  /**
   * Path template for frames, e.g. "/sequences/cosmos/frame_####.webp".
   * "####" is replaced with a zero-padded 1-based index. null = placeholder.
   */
  framesPath: string | null;
  /** Placeholder tint (used until real frames arrive). */
  placeholderHue: number;
  /** Copy overlaid on the scene. */
  eyebrow?: string;
  title?: string;
  body?: string;
  /** Copy placement — alternated for rhythm and to keep the visual centre free. */
  align?: "left" | "right" | "center";
};

export const scenes: Scene[] = [
  {
    id: "card-of-day",
    junction: ["J1", "J2"],
    scrollVh: 260,
    frameCount: 30,
    framesPath: null,
    placeholderHue: 275,
    align: "left",
    eyebrow: "Card of the day",
    title: "A card, every morning",
    body: "A personal card and a warm hint — where your strength is today.",
  },
  {
    id: "spreads",
    junction: ["J2", "J3"],
    scrollVh: 260,
    frameCount: 30,
    framesPath: null,
    placeholderHue: 268,
    align: "right",
    eyebrow: "Tarot spreads",
    title: "Ask what's on your mind",
    body: "Not just card meanings — a full reading that interprets your actual situation. Relationships, career, the near future.",
  },
  {
    id: "astrology",
    junction: ["J3", "J5"],
    scrollVh: 280,
    frameCount: 30,
    framesPath: null,
    placeholderHue: 250,
    align: "left",
    eyebrow: "Astrology",
    title: "The stars know you",
    body: "A real natal chart from your birth date — your planets, elements and signs.",
  },
  {
    id: "grimoire",
    junction: ["J5", "J6"],
    scrollVh: 260,
    frameCount: 30,
    framesPath: null,
    placeholderHue: 285,
    align: "right",
    eyebrow: "History & collection",
    title: "Your path stays with you",
    body: "Every card and spread is saved. Come back, compare — and collect all 78 cards.",
  },
];

// Zero-pad a 1-based frame index into the framesPath template.
export function frameSrc(template: string, index1: number, pad = 4): string {
  const n = String(index1).padStart(pad, "0");
  return template.replace(/#+/g, (m) => n.slice(-m.length).padStart(m.length, "0"));
}
