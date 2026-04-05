/**
 * Breakpoint constants - Imported from tailwind.config.js (source of truth)
 * This ensures TypeScript code stays in sync with Tailwind breakpoints
 *
 * To change breakpoints: Update BREAKPOINTS in tailwind.config.js
 */
import {BREAKPOINTS as TAILWIND_BREAKPOINTS} from "@/tailwind.config.js";

export const BREAKPOINTS: {
  "sm": number;
  "md": number;
  "lg": number;
  "xl": number;
  "2xl": number;
} = TAILWIND_BREAKPOINTS;

/**
 * Type for breakpoint keys
 */
export type BreakpointKey = keyof typeof BREAKPOINTS;

/**
 * Get the pixel value for a breakpoint
 */
export default function getBreakpoint(key: BreakpointKey): number{
  return BREAKPOINTS[key];
};
