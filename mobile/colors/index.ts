/**
 * Design System Color Palette
 * Centralized color definitions for the Voql application
 */

import {brown} from "./brown";
import {neutral} from "./neutral";
import {primary} from "./primary";
import {secondary} from "./secondary";
import {error, success, warning} from "./semantic";
import {shades} from "./shades";

export {brown, error, neutral, primary, secondary, shades, success, warning};

/**
 * Complete color palette object for Tailwind CSS
 */
export const colors = {
  primary,
  secondary,
  neutral,
  brown,
  success,
  warning,
  error,
  white: shades.white,
  black: shades.black,
} as const;
