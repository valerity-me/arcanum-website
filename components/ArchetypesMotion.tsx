"use client";

import { useEffect } from "react";
import { startDust } from "@/lib/archDust";

// Motion for the archetypes section. The markup in <ArchetypesSection /> is
// complete and readable without this: nothing here is needed to see the text
// or the pictures. It renders nothing, waits until the page has loaded, then
// loads GSAP and Lenis in a separate chunk and attaches by data-arch-*.
//
//  - smooth scroll (Lenis, mouse devices only), tied to ScrollTrigger
//  - lines of text rise out from under a mask
//  - pictures open through a mask, the picture settles inside it
//  - desktop with a mouse: the ribbon is pinned, page scroll moves it
//    sideways, pictures lag behind their cards (parallax), a thin candle
//    line shows progress, the names drift very quietly behind the cards
//  - phones and tablets: the ribbon stays a swipeable row, no pin, no parallax
//  - quiet dust on a canvas
//
// prefers-reduced-motion: nothing runs, everything stays visible.

const EASE = "expo.out"; // close to cubic-bezier(0.19, 1, 0.22, 1)
const PINNED = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";
const UNPINNED = "(max-width: 1023px), (hover: none), (pointer: coarse), (pointer: none)";

export default function ArchetypesMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = document.querySelector<HTMLElement>("[data-arch-section]");
    if (!section) return;

    let cancelled = false;
    let teardown: (() => void) | undefined;

    const boot = async () => {
      const [{ gsap }, { ScrollTrigger }, { SplitText }, { default: Lenis }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/SplitText"),
        import("lenis"),
      ]);
      if (cancelled) return;
      // Line breaks depend on the real font, so wait for it.
      await document.fonts.ready;
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger, SplitText);
      const $ = <T extends Element>(sel: string, root: ParentNode = section) =>
        root.querySelector<T>(sel);
      const $$ = <T extends Element>(sel: string, root: ParentNode = section) =>
        Array.from(root.querySelectorAll<T>(sel));

      // ── Smooth scroll ────────────────────────────────────────────────────
      let lenis: InstanceType<typeof Lenis> | undefined;
      let tick: ((time: number) => void) | undefined;
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        lenis = new Lenis({ lerp: 0.1 });
        lenis.on("scroll", ScrollTrigger.update);
        tick = (time: number) => lenis?.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
      }

      // ── Lines of text ────────────────────────────────────────────────────
      const splits: InstanceType<typeof SplitText>[] = [];
      const lineReveal = (el: Element | null, delay = 0, stagger = 0.08, duration = 1.1) => {
        if (!el) return;
        let played = false;
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit(self: InstanceType<typeof SplitText>) {
            // The mask clips; give descenders and accents room so they are not cut.
            self.masks.forEach((m) => {
              (m as HTMLElement).style.paddingBlock = "0.14em";
              (m as HTMLElement).style.marginBlock = "-0.14em";
            });
            if (played) return;
            return gsap.from(self.lines, {
              yPercent: 110,
              duration,
              delay,
              stagger,
              ease: EASE,
              onComplete: () => {
                played = true;
              },
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            });
          },
        });
        splits.push(split);
      };
      lineReveal($("[data-arch-title]"), 0, 0.09, 1.2);
      lineReveal($("[data-arch-lead]"), 0.2, 0.07, 1.0);
      lineReveal($("[data-arch-cta]"), 0, 0.07, 1.0);

      // ── Pictures and cards ───────────────────────────────────────────────
      const cards = $$<HTMLElement>("[data-arch-card]");
      const track = $<HTMLElement>("[data-arch-track]");
      const pin = $<HTMLElement>("[data-arch-pin]");
      const bar = $<HTMLElement>("[data-arch-bar]");
      const marquee = $<HTMLElement>(".arch-marquee-track");

      const parts = (card: HTMLElement) => ({
        mask: $<HTMLElement>("[data-arch-mask]", card),
        inner: $<HTMLElement>("[data-arch-inner]", card),
        // On a mouse desktop the about text is a hover layer driven by CSS.
        text: $$<HTMLElement>(
          window.matchMedia(PINNED).matches ? ".arch-caption" : ".arch-caption, .arch-about",
          card,
        ),
      });
      const hide = (card: HTMLElement) => {
        const { mask, inner, text } = parts(card);
        gsap.set(mask, { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(inner, { scale: 1.2 });
        gsap.set(text, { opacity: 0, y: 16 });
      };
      const open = (card: HTMLElement) => {
        const { mask, inner, text } = parts(card);
        return gsap
          .timeline()
          .to(mask, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: EASE }, 0)
          .to(inner, { scale: 1, duration: 1.7, ease: EASE }, 0)
          .to(text, { opacity: 1, y: 0, duration: 0.9, ease: EASE, stagger: 0.08 }, 0.3);
      };
      // Opens a group of cards one after another, once, when `trigger` is reached.
      const openGroup = (group: HTMLElement[], trigger: Element, start: string) => {
        const master = gsap.timeline({ paused: true });
        group.forEach((card, i) => master.add(open(card), i * 0.08));
        ScrollTrigger.create({
          trigger,
          start,
          once: true,
          onEnter: () => master.play(),
        });
      };

      const mm = gsap.matchMedia();

      // Phones, tablets, touch: a swipeable row. Everything opens when the row
      // comes into view; the cards past the right edge open out of sight.
      mm.add(UNPINNED, () => {
        if (!track) return;
        cards.forEach(hide);
        openGroup(cards, track, "top 85%");
      });

      // Desktop with a mouse: pinned ribbon.
      mm.add(PINNED, () => {
        if (!track || !pin) return;
        pin.classList.add("arch-pinned");
        const distance = () => Math.max(0, track.offsetWidth - window.innerWidth);

        const move = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (bar) bar.style.transform = `scaleX(${self.progress.toFixed(4)})`;
            },
          },
        });

        // Names behind the cards drift the other way, slower than the ribbon.
        if (marquee) {
          gsap.fromTo(
            marquee,
            { x: () => -distance() * 0.4 },
            {
              x: 0,
              ease: "none",
              scrollTrigger: {
                trigger: pin,
                start: "top top",
                end: () => `+=${distance()}`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        }

        cards.forEach(hide);
        // Cards already in the first screen of the ribbon open together as it
        // arrives; the rest open as they cross the right edge while it moves.
        const reach = window.innerWidth * 0.92;
        const first: HTMLElement[] = [];
        const later: HTMLElement[] = [];
        cards.forEach((card) => {
          (card.getBoundingClientRect().left < reach ? first : later).push(card);
        });
        openGroup(first, pin, "top 80%");
        later.forEach((card) => {
          const tl = open(card).pause(0);
          ScrollTrigger.create({
            trigger: card,
            containerAnimation: move,
            start: "left 92%",
            once: true,
            onEnter: () => tl.play(),
          });
        });

        // Parallax: the picture lags behind its card, a few percent.
        cards.forEach((card) => {
          const inner = $<HTMLElement>("[data-arch-inner]", card);
          if (!inner) return;
          gsap.fromTo(
            inner,
            { xPercent: -5 },
            {
              xPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: move,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });

        return () => {
          pin.classList.remove("arch-pinned");
          if (bar) bar.style.transform = "";
        };
      });

      // ── Dust ─────────────────────────────────────────────────────────────
      const canvas = $<HTMLCanvasElement>("[data-arch-dust]");
      const stopDust = canvas ? startDust(canvas, section) : undefined;

      teardown = () => {
        stopDust?.();
        mm.revert();
        splits.forEach((s) => s.revert());
        if (tick) gsap.ticker.remove(tick);
        lenis?.destroy();
      };
    };

    // Not needed for the first screen: start once the browser is idle.
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const start = () => void boot();
    let idleId = 0;
    let timerId = 0;
    const schedule = () => {
      if (w.requestIdleCallback) idleId = w.requestIdleCallback(start, { timeout: 1500 });
      else timerId = window.setTimeout(start, 300);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      if (idleId && w.cancelIdleCallback) w.cancelIdleCallback(idleId);
      window.clearTimeout(timerId);
      teardown?.();
    };
  }, []);

  return null;
}
