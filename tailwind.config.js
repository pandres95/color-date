/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ── Stitch primary tokens (source of truth) ──
        "primary": "#1A1A1A",
        "on-primary": "#FAFAFA",
        "on-surface": "#1A1A1A",
        "surface": "#FAFAFA",
        "surface-container-low": "#F4F4F4",
        "surface-container-highest": "#E2E2E2",
        "outline-variant": "#C6C6C6",
        "outline": "#777777",

        // ── Used by CollageBuilder, CropAdjust, InstallPrompt ──
        "background": "#FAFAFA",
        "on-background": "#1A1A1A",
        "on-surface-variant": "#474747",
        "surface-variant": "#E2E2E2",
        "surface-container-high": "#e8e8e8",
        "secondary": "#5e5e5e",
        "primary-fixed-dim": "#474746",
      },
      fontFamily: {
        "noto-serif": ["Noto Serif", "serif"],
        "work-sans": ["Work Sans", "sans-serif"],
        "inter": ["Inter", "sans-serif"],
        // Aliases
        "headline": ["Noto Serif", "serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Work Sans", "sans-serif"],
        "serif": ["Noto Serif", "serif"],
        "sans": ["Inter", "sans-serif"],
      },
      borderRadius: {
        "none": "0px",
        "DEFAULT": "0px",
      },
    },
  },
  plugins: [],
}
