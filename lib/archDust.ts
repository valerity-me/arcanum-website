// Quiet dust for the archetypes section: a few dozen slow specks of pale violet
// and, rarely, a warm spark, on one viewport-sized canvas. It continues the
// sparks of the first screen; it is not an effect to look at. No library.
//
// Runs only while the section is on screen and the tab is visible. Half the
// density on narrow screens. Specks step aside a little for a mouse pointer.

type Speck = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  phase: number;
  rate: number;
  alpha: number;
  warm: boolean;
  ox: number;
  oy: number;
};

const PALE = "216, 201, 248"; // violet-pale
const CANDLE = "245, 166, 35"; // candle
const PUSH_RADIUS = 120;

export function startDust(canvas: HTMLCanvasElement, section: HTMLElement): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const count = window.innerWidth < 768 ? 28 : 56;

  let w = 0;
  let h = 0;
  let specks: Speck[] = [];
  let raf = 0;
  let last = 0;
  let onScreen = false;
  let pointerX = -9999;
  let pointerY = -9999;

  const make = (): Speck => {
    const warm = Math.random() < 0.08;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: warm ? 1.1 + Math.random() * 0.7 : 0.4 + Math.random() * 0.9,
      vx: (Math.random() - 0.5) * 6, // px per second
      vy: -(2 + Math.random() * 7),
      phase: Math.random() * Math.PI * 2,
      rate: 0.4 + Math.random() * 1.1,
      alpha: warm ? 0.5 + Math.random() * 0.3 : 0.14 + Math.random() * 0.34,
      warm,
      ox: 0,
      oy: 0,
    };
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const nw = canvas.clientWidth;
    const nh = canvas.clientHeight;
    if (!nw || !nh) return;
    if (specks.length) {
      const sx = nw / (w || nw);
      const sy = nh / (h || nh);
      specks.forEach((s) => {
        s.x *= sx;
        s.y *= sy;
      });
    }
    w = nw;
    h = nh;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!specks.length) specks = Array.from({ length: count }, make);
  };

  const frame = (now: number) => {
    raf = 0;
    if (!onScreen || document.hidden) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const t = now / 1000;

    ctx.clearRect(0, 0, w, h);
    for (const s of specks) {
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      if (s.y < -4) s.y = h + 4;
      if (s.x < -4) s.x = w + 4;
      if (s.x > w + 4) s.x = -4;

      if (finePointer) {
        const dx = s.x + s.ox - pointerX;
        const dy = s.y + s.oy - pointerY;
        const d = Math.hypot(dx, dy);
        if (d < PUSH_RADIUS && d > 0.001) {
          const push = (1 - d / PUSH_RADIUS) * 60 * dt;
          s.ox += (dx / d) * push;
          s.oy += (dy / d) * push;
        }
        const ease = Math.pow(0.5, dt * 2.5); // offset eases back
        s.ox *= ease;
        s.oy *= ease;
      }

      const twinkle = 0.55 + 0.45 * Math.sin(t * s.rate + s.phase);
      const a = s.alpha * twinkle;
      const px = s.x + s.ox;
      const py = s.y + s.oy;
      if (s.warm) {
        ctx.fillStyle = `rgba(${CANDLE}, ${(a * 0.18).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px, py, s.r * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${CANDLE}, ${a.toFixed(3)})`;
      } else {
        ctx.fillStyle = `rgba(${PALE}, ${a.toFixed(3)})`;
      }
      ctx.beginPath();
      ctx.arc(px, py, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  };

  const run = () => {
    if (raf || !onScreen || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  const io = new IntersectionObserver(
    ([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) run();
    },
    { threshold: 0 },
  );
  io.observe(section);

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const onVisibility = () => run();
  const onPointer = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointerX = e.clientX - rect.left;
    pointerY = e.clientY - rect.top;
  };
  document.addEventListener("visibilitychange", onVisibility);
  if (finePointer) window.addEventListener("pointermove", onPointer, { passive: true });

  return () => {
    cancelAnimationFrame(raf);
    raf = 0;
    onScreen = false;
    io.disconnect();
    ro.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pointermove", onPointer);
    ctx.clearRect(0, 0, w, h);
  };
}
