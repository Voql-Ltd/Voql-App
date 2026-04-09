/**
 * CountryPicker Component
 * A customizable country picker modal for React Native
 * Based on react-native-country-picker-modal
 */

;
import {MaterialIcons} from "@expo/vector-icons";
import React, {useCallback, useMemo, useState} from "react";
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {countries, searchCountries, sortCountriesByName} from "./countries";
import {
  Country,
  CountryItemProps,
  CountryPickerProps,
  SearchBarProps,
} from "./types";
import { mergeClasses } from "@/config";

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
          <Text className="mr-3 text-2xl" style={flagStyle}>
            {country.flag}
          </Text>
        )}

        <View className="flex-row items-center justify-between flex-1">
          {showCountryName && (
            <Text
              className="flex-1 text-base font-medium"
              style={[{color: theme?.textColor || "#333"}, countryNameStyle]}
              numberOfLines={1}
            >
              {country.name.common}
            </Text>
          )}

          {showCallingCode && (
            <Text
              className="ml-2 text-sm"
              style={[{color: theme?.textColor || "#666"}, callingCodeStyle]}
            >
              +{country.callingCode[0]}
            </Text>
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
          <Text
            className="flex-grow h-10 text-base font-medium text-center"
            style={{
              color: theme?.textColor || "#333",
            }}
          >
            Country Codes
          </Text>
          {showCloseButton && (
            <TouchableOpacity
              onPress={handleClose}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            >
              {closeButtonComponent || (
                <Text
                  className="text-base font-semibold"
                  style={{
                    color: theme?.textColor || "#333",
                  }}
                >
                  ✕
                </Text>
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
              <Text
                className="text-base text-center"
                style={{color: theme?.textColor || "#666"}}
              >
                No countries found
              </Text>
            </View>
          }
        />
        {renderFooter()}
      </SafeAreaView>
    </Modal>
  );
};

export default CountryPicker;
