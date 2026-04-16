/**
 * Type definitions for the CountryPicker component
 * Based on react-native-country-picker-modal
 */

import type {ClassValue} from "clsx";
import type {StyleProp, TextStyle, ViewStyle} from "react-native";

export type CountryCode = string;
export type CallingCode = string;

/**
 *
 */
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
 *
 */
export interface CountryPickerProps {
  /**
   * Whether the picker is visible
   */
  visible: boolean;

  /**
   * Callback when picker is dismissed
   */
  onClose: () => void;

  /**
   * Callback when a country is selected
   */
  onSelect: (country: Country) => void;

  /**
   * Currently selected country
   */
  selectedCountry?: Country;

  /**
   * Whether to show the country flag
   */
  showFlag?: boolean;

  /**
   * Whether to show the country name
   */
  showCountryName?: boolean;

  /**
   * Whether to show the calling code
   */
  showCallingCode?: boolean;

  /**
   * Custom styles for the modal
   */
  modalStyle?: StyleProp<ViewStyle>;

  /**
   * Custom styles for the country list
   */
  countryListStyle?: StyleProp<ViewStyle>;

  /**
   * Custom class names for the country item
   */
  countryItemStyle?: ClassValue;

  /**
   * Custom styles for the flag
   */
  flagStyle?: StyleProp<TextStyle>;

  /**
   * Custom styles for the country name
   */
  countryNameStyle?: StyleProp<TextStyle>;

  /**
   * Custom styles for the calling code
   */
  callingCodeStyle?: StyleProp<TextStyle>;

  /**
   * Placeholder text for search
   */
  searchPlaceholder?: string;

  /**
   * Whether to show search functionality
   */
  showSearch?: boolean;

  /**
   * Custom search function
   */
  onSearch?: (query: string) => void;

  /**
   * Filtered countries based on search
   */
  filteredCountries?: Country[];

  /**
   * Whether to show the close button
   */
  showCloseButton?: boolean;

  /**
   * Custom close button component
   */
  closeButtonComponent?: React.ReactNode;

  /**
   * Custom header component
   */
  headerComponent?: React.ReactNode;

  /**
   * Custom footer component
   */
  footerComponent?: React.ReactNode;

  /**
   * Animation type for modal
   */
  animationType?: "slide" | "fade" | "none";

  /**
   * Whether to show the modal as full screen
   */
  fullScreen?: boolean;

  /**
   * Custom theme colors
   */
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    searchBackgroundColor?: string;
    searchTextColor?: string;
    selectedBackgroundColor?: string;
    secondaryTextColor?: string;
    placeholderColor?: string;
    shadowColor?: string;
  };
}

/**
 *
 */
export interface CountryItemProps {
  country: Country;
  onSelect: (country: Country) => void;
  isSelected: boolean;
  showFlag?: boolean;
  showCountryName?: boolean;
  showCallingCode?: boolean;
  flagStyle?: StyleProp<TextStyle>;
  countryNameStyle?: StyleProp<TextStyle>;
  callingCodeStyle?: StyleProp<TextStyle>;
  countryItemStyle?: ClassValue;
  theme?: CountryPickerProps["theme"];
}

/**
 *
 */
export interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  theme?: CountryPickerProps["theme"];
  searchBarStyle?: ClassValue;
  value?: string;
}

/**
 *
 */
export interface CountryPickerModalProps extends CountryPickerProps {
  /**
   * Whether to show the modal
   */
  show?: boolean;

  /**
   * Callback when modal is shown
   */
  onShow?: () => void;

  /**
   * Callback when modal is hidden
   */
  onHide?: () => void;
}

/**
 *
 */
export interface CountryPickerTheme {
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  searchBackgroundColor?: string;
  searchTextColor?: string;
  selectedBackgroundColor?: string;
  secondaryTextColor?: string;
  placeholderColor?: string;
  shadowColor?: string;
}
