/**
 * CountryPicker Component
 * A customizable country picker modal for React Native
 * Based on react-native-country-picker-modal
 */
import React, {useCallback, useMemo, useState} from "react";
import {
  FlatList,
  Modal,
  CustomText,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

import type {ClassValue} from "clsx";
import type {StyleProp, TextStyle, ViewStyle} from "react-native";
import { mergeClasses } from "@/config";
import { countries, searchCountries, sortCountriesByName } from "@/config/countries";

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


/**
 * SearchBar component for filtering countries
 */
const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search countries...",
  onSearch,
  theme,
  searchBarStyle,
  value = "",
}) => {
  console.log("SearchBar rendered with value:", value);
  const handleSearch = useCallback(
    (text: string) => {
      console.log("SearchBar handleSearch called with:", text);
      onSearch(text);
    },
    [onSearch]
  );

  return (
    <View
      className={mergeClasses(
        "h-10 border border-neutral-200 rounded-lg py-2 px-4 flex-row items-center",
        `bg-[${theme?.searchBackgroundColor || "#fff"}]`,
        `color: ${theme?.searchTextColor || "#333"};`,
        searchBarStyle
      )}
    >
      <MaterialIcons name="search" size={16} color="#666666" />
      <TextInput
        className="flex-1 p-0 ml-2 text-base text-black bg-transparent"
        placeholder={placeholder}
        placeholderTextColor="#999999"
        value={value}
        onChangeText={handleSearch}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
      />
    </View>
  );
};

/**
 * CountryItem component for displaying individual countries
 */
const CountryItem: React.FC<CountryItemProps> = ({
  country,
  onSelect,
  isSelected,
  showFlag = true,
  showCountryName = true,
  showCallingCode = true,
  flagStyle,
  countryNameStyle,
  callingCodeStyle,
  countryItemStyle,
  theme,
}) => {
  const handlePress = useCallback(() => {
    onSelect(country);
  }, [country, onSelect]);

  return (
    <TouchableOpacity
      className={mergeClasses(
        "py-3 px-4",
        isSelected ? "bg-blue-50" : "bg-white",
        countryItemStyle
      )}
      style={[
        {
          backgroundColor: isSelected
            ? theme?.selectedBackgroundColor || "#e3f2fd"
            : theme?.backgroundColor || "#fff",
        },
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        {showFlag && (
          <CustomText className="mr-3 text-2xl" style={flagStyle}>
            {country.flag}
          </CustomText>
        )}

        <View className="flex-row items-center justify-between flex-1">
          {showCountryName && (
            <CustomText
              className="flex-1 text-base font-medium"
              style={[{color: theme?.textColor || "#333"}, countryNameStyle]}
              numberOfLines={1}
            >
              {country.name.common}
            </CustomText>
          )}

          {showCallingCode && (
            <CustomText
              className="ml-2 text-sm"
              style={[{color: theme?.textColor || "#666"}, callingCodeStyle]}
            >
              +{country.callingCode[0]}
            </CustomText>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

/**
 * Main CountryPicker component
 */
const CountryPicker: React.FC<CountryPickerProps> = ({
  visible,
  onClose,
  onSelect,
  selectedCountry,
  showFlag = true,
  showCountryName = true,
  showCallingCode = true,
  modalStyle,
  countryListStyle,
  countryItemStyle,
  flagStyle,
  countryNameStyle,
  callingCodeStyle,
  searchPlaceholder = "Search countries...",
  showSearch = true,
  showCloseButton = true,
  closeButtonComponent,
  headerComponent,
  footerComponent,
  animationType = "slide",
  theme,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);

  // Filter countries based on search query
  const displayCountries = useMemo(() => {
    if (searchQuery.trim()) {
      return searchCountries(searchQuery);
    }
    return sortCountriesByName(countries);
  }, [searchQuery]);

  // Update filtered countries when search query changes
  React.useEffect(() => {
    setFilteredCountries(displayCountries);
  }, [displayCountries]);

  const handleSearch = useCallback((query: string) => {
    console.log("CountryPicker handleSearch called with:", query);
    setSearchQuery(query);
  }, []);

  const handleCountrySelect = useCallback(
    (country: Country) => {
      onSelect(country);
      onClose();
    },
    [onSelect, onClose]
  );

  const handleClose = useCallback(() => {
    setSearchQuery("");
    onClose();
  }, [onClose]);

  const renderCountryItem = ({item}: {item: Country}) => (
    <CountryItem
      country={item}
      onSelect={handleCountrySelect}
      isSelected={selectedCountry?.cca2 === item.cca2}
      showFlag={showFlag}
      showCountryName={showCountryName}
      showCallingCode={showCallingCode}
      flagStyle={flagStyle}
      countryNameStyle={countryNameStyle}
      callingCodeStyle={callingCodeStyle}
      countryItemStyle={countryItemStyle}
      theme={theme}
    />
  );

  const renderHeader = () => (
    <View
      className="mx-4 mt-6 mb-8"
      style={{
        backgroundColor: theme?.backgroundColor || "#fff",
        borderBottomColor: theme?.borderColor || "#eee",
      }}
    >
      {headerComponent || (
        <View className="flex-row items-start justify-between px-4 py-3">
          <View className="w-6 h-10" />
          <CustomText
            className="flex-grow h-10 text-base font-medium text-center"
            style={{
              color: theme?.textColor || "#333",
            }}
          >
            Country Codes
          </CustomText>
          {showCloseButton && (
            <TouchableOpacity
              onPress={handleClose}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            >
              {closeButtonComponent || (
                <CustomText
                  className="text-base font-semibold"
                  style={{
                    color: theme?.textColor || "#333",
                  }}
                >
                  ✕
                </CustomText>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}

      {showSearch && (
        <SearchBar
          placeholder={searchPlaceholder}
          onSearch={handleSearch}
          theme={theme}
          value={searchQuery}
        />
      )}
    </View>
  );

  const renderFooter = () => {
    if (!footerComponent) {
      return null;
    }
    return (
      <View
        className="px-4 py-3 border-t border-t-neutral-200"
        style={{
          backgroundColor: theme?.backgroundColor || "#fff",
        }}
      >
        {footerComponent}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType={animationType}
      transparent={false}
      onRequestClose={handleClose}
      style={modalStyle}
    >
      <SafeAreaView
        className="flex-1"
        style={{backgroundColor: theme?.backgroundColor || "#fff"}}
      >
        {renderHeader()}
        <FlatList
          data={filteredCountries}
          renderItem={renderCountryItem}
          keyExtractor={(item) => item.cca2}
          ItemSeparatorComponent={() => (
            <View className="h-px bg-neutral-200" />
          )}
          className="flex-1 mx-4 mb-2 border rounded-lg border-neutral-200"
          style={countryListStyle}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View className="items-center justify-center flex-1 py-10">
              <CustomText
                className="text-base text-center"
                style={{color: theme?.textColor || "#666"}}
              >
                No countries found
              </CustomText>
            </View>
          }
        />
        {renderFooter()}
      </SafeAreaView>
    </Modal>
  );
};

export default CountryPicker;
