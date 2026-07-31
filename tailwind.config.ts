import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand "space" theme — synced with the Arcanum app
        ink: {
          DEFAULT: "#0B0A0F", // near-black background
          soft: "#141119",
        },
        violet: {
          deep: "#6A2EE6",
          soft: "#9A6BF2",
          pale: "#D8C9F8",
        },
        gold: {
          DEFAULT: "#B8924A",
          light: "#E3C77B",
        },
        paper: "#F4F1EA", // warm white text
        muted: "#9A93A6", // secondary text
        candle: "#F5A623", // the single warm accent (candle flame)
      },
      fontFamily: {
        // Serif display (mystical/premium, echoes the engraved serif on the cards)
        // paired with a clean humanist sans for body & UI. Names listed directly —
        // no CSS var() first (an undefined var with no fallback invalidates the
        // whole font-family declaration and silently drops to the default sans).
        display: ["Cormorant", "Georgia", "serif"],
        body: ["Manrope", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1240px",
      },
      transitionTimingFunction: {
        ritual: "cubic-bezier(.22,.61,.36,1)",
      },
      keyframes: {
        "flame-flicker": {
          "0%,100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.82", transform: "scale(0.98)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "flame-flicker": "flame-flicker 3.2s ease-in-out infinite",
        "fade-up": "fade-up 0.8s cubic-bezier(.22,.61,.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
