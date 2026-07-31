"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { frameSrc, type Scene } from "@/lib/scenes";

/**
 * Scroll-scrubbed sequence player.
 *
 * A tall section (scene.scrollVh) holds a sticky, full-viewport <canvas>. Scroll
 * progress through the section maps to a frame index; the frame is drawn to the
 * canvas (Apple-style image-sequence scrubbing). Until real WebP frames exist,
 * a procedural cosmic placeholder is drawn so the whole machine is testable.
 *
 * Copy fades in across the middle of the section and out before the seam, so the
 * junction frame (shared with the next scene) stays clean.
 */
export default function ScrollScene({ scene, index }: { scene: Scene; index: number }) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Copy visible in the middle third of the section.
  const copyOpacity = useTransform(scrollYProgress, [0.18, 0.35, 0.62, 0.8], [0, 1, 1, 0]);
  const copyY = useTransform(scrollYProgress, [0.18, 0.35], reduce ? [0, 0] : [24, 0]);

  // Rule-of-thirds placement: alternate copy left/right so the visual centre
  // (where the card / subject sits) stays clear. Defaults to centre.
  const align = scene.align ?? "center";
  const alignClass =
    align === "left"
      ? "items-start text-left"
      : align === "right"
        ? "items-end text-right"
        : "items-center text-center";

  // Preload real frames when a path is provided.
  useEffect(() => {
    if (!scene.framesPath) {
      setLoaded(false);
      return;
    }
    let cancelled = false;
    const imgs: HTMLImageElement[] = [];
    let done = 0;
    for (let i = 1; i <= scene.frameCount; i++) {
      const img = new Image();
      img.src = frameSrc(scene.framesPath, i);
      img.onload = img.onerror = () => {
        done += 1;
        if (done === scene.frameCount && !cancelled) setLoaded(true);
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;
    return () => {
      cancelled = true;
    };
  }, [scene.framesPath, scene.frameCount]);

  // Draw the current frame whenever scroll progress changes.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const render = (p: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const idx = Math.min(scene.frameCount - 1, Math.max(0, Math.round(p * (scene.frameCount - 1))));

      if (loaded && scene.framesPath) {
        const img = imagesRef.current[idx];
        if (img && img.complete && img.naturalWidth) {
          drawCover(ctx, img, w, h);
          return;
        }
      }
      drawPlaceholder(ctx, w, h, p, idx, scene);
    };

    render(scrollYProgress.get());
    const unsub = scrollYProgress.on("change", render);
    return () => {
      window.removeEventListener("resize", resize);
      unsub();
    };
  }, [loaded, scene, scrollYProgress, reduce]);

  return (
    <section
      ref={sectionRef}
      id={scene.id}
      className="relative"
      style={{ height: `${scene.scrollVh}vh` }}
      aria-label={scene.title ?? scene.id}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* subtle vignette to keep edges dark */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(11,10,15,0.75)_100%)]" />

        {/* copy overlay — placed on a third, vertically centred for balance */}
        <motion.div
          style={{ opacity: copyOpacity, y: copyY }}
          className={`absolute inset-x-0 top-1/2 mx-auto flex max-w-content -translate-y-1/2 flex-col px-6 sm:px-10 ${alignClass}`}
        >
          <div className="max-w-md">
            {scene.eyebrow && (
              <span className="mb-3 block text-xs uppercase tracking-[0.35em] text-gold-light">
                {scene.eyebrow}
              </span>
            )}
            {scene.title && (
              <h2 className="font-display text-4xl font-medium leading-[1.08] text-paper sm:text-6xl">
                {scene.title}
              </h2>
            )}
            {scene.body && (
              <p className="mt-4 font-body text-base text-muted sm:text-lg">{scene.body}</p>
            )}
          </div>
        </motion.div>

        {/* placeholder badge — remove once real frames are wired */}
        {!scene.framesPath && (
          <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-widest text-muted">
            placeholder · {scene.id} · {scene.junction[0]}→{scene.junction[1]}
          </div>
        )}
      </div>
    </section>
  );
}

// Draw an image with object-fit: cover semantics.
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
) {
  const ir = img.naturalWidth / img.naturalHeight;
  const cr = w / h;
  let dw = w;
  let dh = h;
  if (ir > cr) {
    dh = h;
    dw = h * ir;
  } else {
    dw = w;
    dh = w / ir;
  }
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
}

// Procedural cosmic placeholder so the scrub is visible before Kling assets land.
function drawPlaceholder(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  p: number,
  idx: number,
  scene: Scene,
) {
  const hue = scene.placeholderHue;

  // Background: deep radial glow that drifts with scroll.
  const cx = w * 0.5;
  const cy = h * (0.62 - p * 0.24);
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.85);
  g.addColorStop(0, `hsl(${hue} 60% 16%)`);
  g.addColorStop(0.45, `hsl(${hue} 45% 8%)`);
  g.addColorStop(1, "#0B0A0F");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Deterministic starfield with slight parallax on scroll.
  ctx.save();
  for (let i = 0; i < 90; i++) {
    const rnd = pseudo(i * 7.3 + scene.id.length);
    const sx = (rnd % 1) * w;
    const sy = (((rnd * 13.7) % 1) * h + p * 40 * ((i % 3) + 1)) % h;
    const r = ((rnd * 3.1) % 1) * 1.4 + 0.2;
    ctx.globalAlpha = 0.25 + ((rnd * 5) % 1) * 0.6;
    ctx.fillStyle = i % 9 === 0 ? "#E3C77B" : "#D8C9F8";
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // A ringed "crystal-planet" orb whose size tracks scroll (dive metaphor).
  const orbR = Math.min(w, h) * (0.12 + p * 0.1);
  const og = ctx.createRadialGradient(cx, cy, 0, cx, cy, orbR);
  og.addColorStop(0, `hsl(${hue} 70% 72%)`);
  og.addColorStop(0.6, `hsl(${hue} 65% 45%)`);
  og.addColorStop(1, `hsl(${hue} 60% 20%)`);
  ctx.fillStyle = og;
  ctx.beginPath();
  ctx.arc(cx, cy, orbR, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(216,201,248,0.7)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(cx, cy, orbR * 1.7, orbR * 0.5, -0.5, 0, Math.PI * 2);
  ctx.stroke();

  // Frame counter — proves the scrub is stepping through frames.
  ctx.fillStyle = "rgba(154,147,166,0.55)";
  ctx.font = "12px ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.fillText(`frame ${idx + 1} / ${scene.frameCount}`, cx, h - 28);
}

// Cheap deterministic pseudo-random in [0, ~large).
function pseudo(seed: number): number {
  const x = Math.sin(seed) * 43758.5453;
  return Math.abs(x - Math.floor(x)) * 100;
}
