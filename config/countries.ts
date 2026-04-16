/**
 * Country data for the CountryPicker component
 * Comprehensive list of countries with their calling codes, currencies, and flags
 */

import countriesData from "../data/countries.json";


export interface Country {
  cca2: string;
  currency: string[];
  callingCode: string[];
  region: string;
  subregion: string;
  flag: string;
  name: {
    common: string;
    official: string;
  };
}

/**
 * Complete list of countries with proper TypeScript typing
 */
export const countries: Country[] = countriesData as Country[];

/**
 * Get country by calling code
 */
export const getCountryByCallingCode = (
  callingCode: string
): Country | undefined =>
  countries.find((country) => country.callingCode.includes(callingCode));

/**
 * Get country by country code (cca2)
 */
export const getCountryByCode = (code: string): Country | undefined =>
  countries.find(
    (country) => country.cca2.toLowerCase() === code.toLowerCase()
  );

/**
 * Search countries by name
 */
export const searchCountries = (query: string): Country[] => {
  const lowercaseQuery = query.toLowerCase();
  return countries.filter(
    (country) =>
      country.name.common.toLowerCase().includes(lowercaseQuery) ||
      country.name.official.toLowerCase().includes(lowercaseQuery) ||
      country.cca2.toLowerCase().includes(lowercaseQuery)
  );
};

/**
 * Get countries by region
 */
export const getCountriesByRegion = (region: string): Country[] =>
  countries.filter(
    (country) => country.region.toLowerCase() === region.toLowerCase()
  );

/**
 * Sort countries alphabetically by name
 */
export const sortCountriesByName = (countriesList: Country[]): Country[] =>
  [...countriesList].sort((a, b) => a.name.common.localeCompare(b.name.common));
