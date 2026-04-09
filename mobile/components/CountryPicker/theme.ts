/**
 * Theme configuration for CountryPicker component
 * Provides consistent styling and color schemes
 */

/**
 *
 */
export interface CountryPickerTheme {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  searchBackgroundColor: string;
  searchTextColor: string;
  selectedBackgroundColor: string;
  secondaryTextColor: string;
  placeholderColor: string;
  shadowColor: string;
}

/**
 * Default light theme
 */
export const lightTheme: CountryPickerTheme = {
  primaryColor: "#007AFF",
  backgroundColor: "#FFFFFF",
  textColor: "#000000",
  borderColor: "#E5E5E7",
  searchBackgroundColor: "#F2F2F7",
  searchTextColor: "#000000",
  selectedBackgroundColor: "#E3F2FD",
  secondaryTextColor: "#8E8E93",
  placeholderColor: "#C7C7CC",
  shadowColor: "#000000",
};

/**
 * Dark theme
 */
export const darkTheme: CountryPickerTheme = {
  primaryColor: "#0A84FF",
  backgroundColor: "#1C1C1E",
  textColor: "#FFFFFF",
  borderColor: "#38383A",
  searchBackgroundColor: "#2C2C2E",
  searchTextColor: "#FFFFFF",
  selectedBackgroundColor: "#2C2C2E",
  secondaryTextColor: "#8E8E93",
  placeholderColor: "#8E8E93",
  shadowColor: "#000000",
};

/**
 * Custom theme for Voql app
 */
export const voqlTheme: CountryPickerTheme = {
  primaryColor: "#6366F1", // Indigo
  backgroundColor: "#FFFFFF",
  textColor: "#1F2937",
  borderColor: "#E5E7EB",
  searchBackgroundColor: "#FFFFFF",
  searchTextColor: "#1F2937",
  selectedBackgroundColor: "#EEF2FF",
  secondaryTextColor: "#6B7280",
  placeholderColor: "#9CA3AF",
  shadowColor: "#000000",
};

/**
 * Get theme based on system appearance or custom preference
 */
export const getTheme = (
  themeName: "light" | "dark" | "voql" = "voql"
): CountryPickerTheme => {
  switch (themeName) {
    case "light":
      return lightTheme;
    case "dark":
      return darkTheme;
    case "voql":
    default:
      return voqlTheme;
  }
};

/**
 * Create custom theme by overriding default values
 */
export const createCustomTheme = (
  baseTheme: CountryPickerTheme = voqlTheme,
  overrides: Partial<CountryPickerTheme> = {}
): CountryPickerTheme => ({
  ...baseTheme,
  ...overrides,
});
