"use client";

import { useEffect } from "react";

// Motion for the archetypes section. The markup in <ArchetypesSection /> is
// complete and readable without this: nothing here is needed to see the text
// or the pictures. It renders nothing, waits until the page has loaded, then
// loads GSAP in a separate chunk and attaches by data-arch-*.
//
//  - lines of text rise out from under a mask
//  - pictures open through a mask, the picture settles inside it
//
// Scrolling itself is left to the browser: no smooth-scroll library and no
// pinned or hijacked scroll (an earlier version had both; see git history,
// commit 073fe8c).
//
// prefers-reduced-motion: nothing runs, everything stays visible.

const EASE = "expo.out"; // close to cubic-bezier(0.19, 1, 0.22, 1)

export default function ArchetypesMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = document.querySelector<HTMLElement>("[data-arch-section]");
    if (!section) return;

    let cancelled = false;
    let teardown: (() => void) | undefined;

    const boot = async () => {
      const [{ gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/SplitText"),
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

      // On a wide screen with a mouse the about text is a hover layer driven
      // by CSS, so it must not be animated here.
      const hoverLayer = window.matchMedia(
        "(min-width: 1280px) and (hover: hover) and (pointer: fine)",
      ).matches;
      const parts = (card: HTMLElement) => ({
        mask: $<HTMLElement>("[data-arch-mask]", card),
        inner: $<HTMLElement>("[data-arch-inner]", card),
        text: $$<HTMLElement>(hoverLayer ? ".arch-caption" : ".arch-caption, .arch-about", card),
      });

      const ctx = gsap.context(() => {
        if (!track || !cards.length) return;
        // Everything opens, one card after another, when the row comes into view.
        // On a phone the cards past the right edge open out of sight.
        const master = gsap.timeline({ paused: true });
        cards.forEach((card, i) => {
          const { mask, inner, text } = parts(card);
          gsap.set(mask, { clipPath: "inset(100% 0% 0% 0%)" });
          gsap.set(inner, { scale: 1.2 });
          gsap.set(text, { opacity: 0, y: 16 });
          master.add(
            gsap
              .timeline()
              .to(mask, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: EASE }, 0)
              .to(inner, { scale: 1, duration: 1.7, ease: EASE }, 0)
              .to(text, { opacity: 1, y: 0, duration: 0.9, ease: EASE, stagger: 0.08 }, 0.3),
            i * 0.09,
          );
        });
        ScrollTrigger.create({
          trigger: track,
          start: "top 85%",
          once: true,
          onEnter: () => master.play(),
        });
      }, section);

      teardown = () => {
        ctx.revert();
        splits.forEach((s) => s.revert());
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
