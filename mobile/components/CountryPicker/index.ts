/**
 * CountryPicker Component Exports
 * Main entry point for the CountryPicker component
 */

export {
  countries,
  getCountriesByRegion,
  getCountryByCallingCode,
  getCountryByCode,
  searchCountries,
  sortCountriesByName,
} from "./countries";
export {default as CountryPicker} from "./CountryPicker";
export {default as Flag} from "./Flag";
export type {FlagProps} from "./Flag";
export {
  voqlTheme,
  createCustomTheme,
  darkTheme,
  getTheme,
  lightTheme,
} from "./theme";
export type {
  CallingCode,
  Country,
  CountryCode,
  CountryItemProps,
  CountryPickerModalProps,
  CountryPickerProps,
  CountryPickerTheme,
  SearchBarProps,
} from "./types";
