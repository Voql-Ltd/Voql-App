/** @type {import('tailwindcss').Config} */
import {colors} from "./colors/index";

/**
 * Breakpoint constants - Source of truth for all breakpoints
 * Update these values to change breakpoints everywhere (Tailwind classes and TypeScript code)
 */
export const BREAKPOINTS = {
  "sm": 640,
  "md": 768,
  "lg": 1024,
  "xl": 1280,
  "2xl": 1536,
};

export default {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  // @ts-ignore
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["SpaceMono-Regular", "monospace"],
      },
      // Breakpoints imported from BREAKPOINTS above (source of truth)
      screens: {
        "sm": `${BREAKPOINTS.sm}px`,
        "md": `${BREAKPOINTS.md}px`,
        "lg": `${BREAKPOINTS.lg}px`,
        "xl": `${BREAKPOINTS.xl}px`,
        "2xl": `${BREAKPOINTS["2xl"]}px`,
      },
    },
  },
  plugins: [],
};
