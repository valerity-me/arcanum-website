# Video sequences (WebP frames)

Scroll-scrubbed frames rendered from After Effects. One folder per scene, frames
zero-padded and 1-based.

```
public/sequences/
  cosmos/      frame_0001.webp … frame_0030.webp
  card-of-day/ …
  spreads/     …
  astrology/   …
  grimoire/    …
```

To wire a scene, set `framesPath` in `lib/scenes.ts`, e.g.:

```ts
framesPath: "/sequences/cosmos/frame_####.webp",
```

`####` is replaced with the zero-padded frame index. Set `frameCount` to the
number of frames exported. 24–30 frames per scene is plenty — scroll distance,
not frame count, drives smoothness.

Until `framesPath` is set, `ScrollScene` renders a procedural cosmic placeholder
so the scrub mechanism is fully testable without assets.
