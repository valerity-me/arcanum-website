# Arcanum — landing site

Dark, cosmic single-page "dive" for the Arcanum tarot & astrology app.
Next.js 14 (App Router) · Tailwind · Framer Motion · TypeScript.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000. The scroll story runs on procedural placeholders
until real WebP sequences are added.

## Structure

- `app/page.tsx` — assembles the scroll narrative.
- `lib/scenes.ts` — scene config (order, scroll length, frame paths, copy).
- `components/ScrollScene.tsx` — scroll-scrubbed sequence player (canvas).
- `components/{Manifesto,CTA,StoreButtons,Footer,LegalPage}.tsx` — static sections.
- `public/sequences/` — drop WebP frames here (see its README).
- `../kling-shot-brief.md` — the storyboard these scenes implement.

## Adding real video

Render each Kling block as a WebP frame sequence from After Effects into
`public/sequences/<scene>/`, then set `framesPath` + `frameCount` in
`lib/scenes.ts`. See `public/sequences/README.md`.

## Routes

- `/` — simple public landing (App Store marketing + support target).
- `/privacy`, `/terms` — real legal text (EN + RU), read at build from
  `content/legal/*.txt` (exact copies of the app's `assets/legal/*.txt`).
- `/preview` — WIP animated scroll experience (noindex, not linked publicly).

## Static export / deploy

`npm run build` emits a static site into `out/` (`output: "export"`).
Deploy `out/` to any static host — drag-drop to Netlify / Cloudflare Pages, or
`vercel`. Set `NEXT_PUBLIC_SITE_URL` to the final domain so OG image URLs are
absolute.

## TODO before launch

- Real App Store / Google Play URLs + QR in `components/StoreButtons.tsx`
  (currently "Coming soon").
- DSA trader details in the footer (address / phone / email) once confirmed.
- Optimised favicon / apple-touch / 1200×630 OG image (currently the 1024²
  icon is reused for all).
- Keep `content/legal/*.txt` in sync with the app if the policy changes.
