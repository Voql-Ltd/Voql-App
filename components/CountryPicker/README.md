# CountryPicker Component

A customizable country picker modal component for React Native, based on the `react-native-country-picker-modal` library but implemented locally for full control and customization.

## Features

- 🏳️ **Country Selection**: Choose from a comprehensive list of countries
- 🔍 **Search Functionality**: Search countries by name or code
- 🎨 **Customizable Themes**: Light, dark, and custom themes
- 📱 **Responsive Design**: Works on all screen sizes
- 🎯 **TypeScript Support**: Full type safety and IntelliSense
- ⚡ **Performance Optimized**: Efficient rendering with FlatList
- 🎭 **Customizable UI**: Customize colors, styles, and components

## Installation

The component is already included in your project. No additional installation required.

## Basic Usage

```tsx
import React, {useState} from "react";
import {View, TouchableOpacity, Text} from "react-native";
import {CountryPicker, Country} from "./components/CountryPicker";

const MyComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    console.log("Selected:", country.name.common, country.callingCode[0]);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setIsVisible(true)}>
        <Text>
          {selectedCountry
            ? `${selectedCountry.flag} ${selectedCountry.name.common}`
            : "Select Country"}
        </Text>
      </TouchableOpacity>

      <CountryPicker
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        onSelect={handleCountrySelect}
        selectedCountry={selectedCountry || undefined}
      />
    </View>
  );
};
```

## Props

### CountryPicker Props

| Prop                | Type                          | Default                 | Description                              |
| ------------------- | ----------------------------- | ----------------------- | ---------------------------------------- |
| `visible`           | `boolean`                     | -                       | Whether the picker is visible            |
| `onClose`           | `() => void`                  | -                       | Callback when picker is dismissed        |
| `onSelect`          | `(country: Country) => void`  | -                       | Callback when a country is selected      |
| `selectedCountry`   | `Country?`                    | -                       | Currently selected country               |
| `showFlag`          | `boolean`                     | `true`                  | Whether to show the country flag         |
| `showCountryName`   | `boolean`                     | `true`                  | Whether to show the country name         |
| `showCallingCode`   | `boolean`                     | `true`                  | Whether to show the calling code         |
| `showSearch`        | `boolean`                     | `true`                  | Whether to show search functionality     |
| `showCloseButton`   | `boolean`                     | `true`                  | Whether to show the close button         |
| `searchPlaceholder` | `string`                      | `'Search countries...'` | Placeholder text for search              |
| `animationType`     | `'slide' \| 'fade' \| 'none'` | `'slide'`               | Animation type for modal                 |
| `fullScreen`        | `boolean`                     | `false`                 | Whether to show the modal as full screen |
| `theme`             | `CountryPickerTheme`          | -                       | Custom theme colors                      |

### Country Object

```tsx
interface Country {
  cca2: string; // Country code (e.g., 'US', 'CA')
  currency: string[]; // Currency codes (e.g., ['USD'])
  callingCode: string[]; // Calling codes (e.g., ['1'])
  region: string; // Region (e.g., 'Americas')
  subregion: string; // Subregion (e.g., 'North America')
  flag: string; // Flag emoji (e.g., '🇺🇸')
  name: {
    common: string; // Common name (e.g., 'United States')
    official: string; // Official name (e.g., 'United States of America')
  };
}
```

## Theming

### Using Built-in Themes

```tsx
import { voqlTheme, lightTheme, darkTheme } from './components/CountryPicker/theme';

// Use Voql theme (default)
<CountryPicker theme={voqlTheme} {...props} />

// Use light theme
<CountryPicker theme={lightTheme} {...props} />

// Use dark theme
<CountryPicker theme={darkTheme} {...props} />
```

### Creating Custom Themes

```tsx
import {createCustomTheme, voqlTheme} from "./components/CountryPicker/theme";

const customTheme = createCustomTheme(voqlTheme, {
  primaryColor: "#FF6B6B",
  backgroundColor: "#F8F9FA",
  textColor: "#2D3748",
  selectedBackgroundColor: "#FFE5E5",
});

<CountryPicker theme={customTheme} {...props} />;
```

## Advanced Usage

### Custom Header Component

```tsx
const CustomHeader = () => (
  <View style={{padding: 16, backgroundColor: "#f0f0f0"}}>
    <Text style={{fontSize: 20, fontWeight: "bold"}}>Choose Your Country</Text>
  </View>
);

<CountryPicker headerComponent={<CustomHeader />} {...props} />;
```

### Custom Close Button

```tsx
const CustomCloseButton = ({onPress}) => (
  <TouchableOpacity onPress={onPress} style={{padding: 8}}>
    <Text style={{fontSize: 18, color: "#FF0000"}}>Close</Text>
  </TouchableOpacity>
);

<CountryPicker closeButtonComponent={<CustomCloseButton />} {...props} />;
```

### Custom Styling

```tsx
<CountryPicker
  modalStyle={{backgroundColor: "#f0f0f0"}}
  countryListStyle={{backgroundColor: "#ffffff"}}
  countryItemStyle={{paddingVertical: 16}}
  flagStyle={{fontSize: 28}}
  countryNameStyle={{fontSize: 18, fontWeight: "bold"}}
  callingCodeStyle={{fontSize: 16, color: "#666"}}
  {...props}
/>
```

## Utility Functions

The component also exports utility functions for working with countries:

```tsx
import {
  countries,
  getCountryByCallingCode,
  getCountryByCode,
  searchCountries,
  getCountriesByRegion,
  sortCountriesByName,
} from "./components/CountryPicker";

// Get all countries
const allCountries = countries;

// Find country by calling code
const usCountry = getCountryByCallingCode("1");

// Find country by code
const canadaCountry = getCountryByCode("CA");

// Search countries
const searchResults = searchCountries("united");

// Get countries by region
const europeanCountries = getCountriesByRegion("Europe");

// Sort countries alphabetically
const sortedCountries = sortCountriesByName(countries);
```

## Example Component

See `CountryPickerExample.tsx` for a complete example of how to use the component.

## File Structure

```
components/CountryPicker/
├── index.ts                    # Main exports
├── types.ts                    # TypeScript type definitions
├── countries.ts                # Country data and utilities
├── CountryPicker.tsx           # Main component
├── theme.ts                    # Theme configurations
├── CountryPickerExample.tsx    # Usage example
└── README.md                   # This documentation
```

## Contributing

When modifying the component:

1. Follow TypeScript best practices
2. Maintain type safety
3. Update documentation
4. Test on both iOS and Android
5. Ensure accessibility compliance

## License

This component is part of the Voql project and follows the same license terms.
