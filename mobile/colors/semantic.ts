/**
 * Semantic Color Palettes
 * Colors for specific states and feedback
 */

/** Success (Green) - For success states, celebrations, positive feedback */
export const success = {
  50: "#E7F6EC",
  75: "#B5E3C4",
  100: "#91D6A8",
  200: "#5FC381",
  300: "#40B869",
  400: "#0F973D", // base
  500: "#099137",
  600: "#04802E",
  700: "#036B26",
  800: "#015B20",
  900: "#04172B",
} as const;

/** Warning (Yellow/Orange) - For warning states, attention, caution */
export const warning = {
  50: "#FEF6E7",
  75: "#FBE2B7",
  100: "#F7D394",
  200: "#F7C164",
  300: "#F5B546",
  400: "#F3A218", // base
  500: "#DD900D",
  600: "#AD6F07",
  700: "#865503",
  800: "#664101",
  900: "#523300",
} as const;

/** Error (Red) - For error states, destructive actions, critical alerts */
export const error = {
  50: "#FBEAE9",
  75: "#F2BCBA",
  100: "#EB9B98",
  200: "#E26E6A",
  300: "#DD524D",
  400: "#D42620", // base
  500: "#CB1A14",
  600: "#BA110B",
  700: "#9E0A05",
  800: "#800501",
  900: "#591000",
} as const;
