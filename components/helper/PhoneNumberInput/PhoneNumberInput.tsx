
import { countries } from "@/config/countries";
import {MaterialIcons} from "@expo/vector-icons";
import { PhoneNumberUtil } from "google-libphonenumber";
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import {
  Image,
  Platform,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import {
  Country,
  CountryCode,
  CountryPicker,
  darkTheme,
  voqlTheme,
} from "../../CountryPicker";
import Flag from "./Flag";
import CustomText from "../CustomText";

const dropDown =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAi0lEQVRYR+3WuQ6AIBRE0eHL1T83FBqU5S1szdiY2NyTKcCAzU/Y3AcBXIALcIF0gRPAsehgugDEXnYQrUC88RIgfpuJ+MRrgFmILN4CjEYU4xJgFKIa1wB6Ec24FuBFiHELwIpQxa0ALUId9wAkhCnuBdQQ5ngP4I9wxXsBDyJ9m+8y/g9wAS7ABW4giBshQZji3AAAAABJRU5ErkJggg==";

const phoneUtil = PhoneNumberUtil.getInstance();

/**
 * Interface for the phone input component props
 */
interface PhoneInputProps {
  /** Default country code (e.g., "US", "IN") */
  defaultCode?: CountryCode;
  /** Initial phone number value */
  value?: string;
  /** Default phone number value */
  defaultValue?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Callback when country selection changes */
  onChangeCountry?: (country: Country) => void;
  /** Callback when text input changes */
  onChangeText?: (text: string) => void;
  /** Callback when formatted text changes (includes country code) */
  onChangeFormattedText?: (formattedText: string) => void;
  /** Whether to show shadow */
  withShadow?: boolean;
  /** Whether to use dark theme */
  withDarkTheme?: boolean;
  /** Style for country code text */
  codeTextStyle?: TextStyle;
  /** Additional props for TextInput */
  textInputProps?: TextInputProps;
  /** Style for TextInput */
  textInputStyle?: TextStyle;
  /** Whether to auto focus the input */
  autoFocus?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Whether to disable arrow icon */
  disableArrowIcon?: boolean;
  /** Style for flag button */
  flagButtonStyle?: ViewStyle;
  /** Style for container */
  containerStyle?: ViewStyle;
  /** Style for text container */
  textContainerStyle?: ViewStyle;
  /** Custom dropdown image renderer */
  renderDropdownImage?: () => React.ReactNode;
  /** Style for country picker button */
  countryPickerButtonStyle?: ViewStyle;
  /** Layout type: "first" or "second" */
  layout?: "first" | "second";
  /** Size of the flag */
  flagSize?: number;
}

interface PhoneInputState {
  modalVisible: boolean;
}

/**
 * Interface for the component's imperative handle
 */
export interface PhoneInputRef {
  getCountryCode: () => CountryCode;
  getCallingCode: () => string | undefined;
  isValidNumber: (number: string) => boolean;
  getNumberAfterPossiblyEliminatingZero: () => {
    number: string;
    formattedNumber: string;
  };
}

/**
 * PhoneInput component for handling phone number input with country selection
 */
const PhoneInput = forwardRef<PhoneInputRef, PhoneInputProps>(
  (
    {
      defaultCode = "IE",
      value,
      defaultValue,
      disabled = false,
      onChangeCountry,
      onChangeText,
      onChangeFormattedText,
      withShadow = false,
      withDarkTheme = false,
      codeTextStyle,
      textInputProps,
      textInputStyle,
      autoFocus = false,
      placeholder = "Phone Number",
      disableArrowIcon = false,
      flagButtonStyle,
      containerStyle,
      textContainerStyle,
      renderDropdownImage,
      countryPickerButtonStyle,
      layout = "first",
      flagSize,
    },
    ref
  ) => {
    const [modalVisible, setModalVisible] = useState(false);
    
    // Get current country and calling code
    const currentCountryCode = defaultCode;
    const currentCountry = countries.find((c) => c.cca2 === currentCountryCode);
    const currentCallingCode = currentCountry?.callingCode?.[0] || "1";
    const phoneNumber = value ?? defaultValue ?? "";

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      getCountryCode: () => currentCountryCode,
      getCallingCode: () => currentCallingCode,
      isValidNumber: (number: string) => {
        try {
          const parsedNumber = phoneUtil.parse(number, currentCountryCode);
          return phoneUtil.isValidNumber(parsedNumber);
        } catch {
          return false;
        }
      },
      getNumberAfterPossiblyEliminatingZero: () => {
        let number = phoneNumber;
        if (number.length > 0 && number.startsWith("0")) {
          number = number.substring(1);
          return {number, formattedNumber: currentCallingCode ? `+${currentCallingCode}${number}` : number};
        }
        return {number, formattedNumber: currentCallingCode ? `+${currentCallingCode}${number}` : number};
      },
    }));

    const handleCountrySelect = (country: Country) => {
      if (onChangeCountry) {
        onChangeCountry(country);
      }
    };

    const handleTextChange = (text: string) => {
      if (onChangeText) {
        onChangeText(text);
      }
    };

    const renderDropdownImageComponent = () => (
      <Image
        source={{uri: dropDown}}
        resizeMode="contain"
        className="h-3.5 w-3"
      />
    );

    const renderFlagButtonComponent = () => {
      if (layout === "first") {
        return (
          <Flag countryCode={currentCountryCode} flagSize={flagSize ?? 18} />
        );
      }
      return <View />;
    };

    const {
      code,
      countryCode,
      number,
      disabled: isDisabled,
    } = {
      code: currentCallingCode,
      countryCode: currentCountryCode,
      number: phoneNumber,
      disabled,
    };

    return (
      <View
        className={`w-full bg-white flex-row rounded-lg border border-secondary-75 ${withShadow ? "shadow-sm" : ""}`}
        style={containerStyle}
      >
        <TouchableOpacity
          className="flex-row items-center justify-center w-1/5 h-full min-w-8"
          style={[flagButtonStyle, countryPickerButtonStyle]}
          disabled={isDisabled}
          onPress={() => setModalVisible(true)}
        >
          {renderFlagButtonComponent()}
          {code && layout === "second" && (
            <View className="flex flex-row gap-x-[2px]">
              <Text
                className="mr-2.5 text-base font-medium text-black"
                style={codeTextStyle}
              >
                {`+${code}`}
              </Text>
              <MaterialIcons name="search" size={24} color="#000000" />
              {/* {!disableArrowIcon && (
            <React.Fragment>
              {renderDropdownImage
                ? renderDropdownImage()
                : renderDropdownImageComponent()}
            </React.Fragment>
          )} */}

            </View>
          )}
        </TouchableOpacity>
        <View
          className="flex-row items-center flex-1 px-2 py-2 text-left"
          style={textContainerStyle}
        >
          {code && layout === "first" && (
            <CustomText
              className="h-full text-base font-medium text-black align-middle mr-2.5"
              style={codeTextStyle}
            >
              {`+${code}`}
            </CustomText>
          )}
          <TextInput
            className="justify-center flex-1 h-full text-black"
            style={textInputStyle}
            placeholder={placeholder}
            onChangeText={handleTextChange}
            value={number}
            editable={!isDisabled}
            selectionColor="black"
            keyboardAppearance={withDarkTheme ? "dark" : "default"}
            keyboardType="number-pad"
            autoFocus={autoFocus}
            autoComplete="tel"
            inputMode="numeric"
            {...(Platform.OS === "web"
              ? {
                  // Web-specific attributes to help browser extensions
                  type: "tel",
                  name: "phoneNumber",
                }
              : {})}
            {...textInputProps}
          />
        </View>

        <CountryPicker
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelect={handleCountrySelect}
          selectedCountry={countries.find((c) => c.cca2 === countryCode)}
          showFlag={true}
          showCountryName={true}
          showCallingCode={true}
          showSearch={true}
          showCloseButton={true}
          searchPlaceholder="Search"
          animationType="slide"
          fullScreen={false}
          theme={withDarkTheme ? darkTheme : voqlTheme}
        />
      </View>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

/**
 * Utility function to validate a phone number for a given country code
 * @param number - The phone number to validate
 * @param countryCode - The country code to validate against
 * @returns boolean indicating if the number is valid
 */
export const isValidNumber = (
  number: string,
  countryCode: CountryCode
): boolean => {
  try {
    const parsedNumber = phoneUtil.parse(number, countryCode);
    return phoneUtil.isValidNumber(parsedNumber);
  } catch {
    return false;
  }
};

export default PhoneInput;
