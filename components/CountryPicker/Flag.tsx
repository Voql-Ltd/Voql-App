/**
 * Flag Component
 * Displays country flag emoji based on country code
 */

import React from "react";
import {Text, TextProps} from "react-native";
import {getCountryByCode} from "./countries";

/**
 *
 */
export interface FlagProps extends TextProps {
  /** Country code (e.g., 'US', 'CA') */
  countryCode: string;
  /** Size of the flag (font size) */
  flagSize?: number;
}

/**
 * Flag component that displays country flag emoji
 */
const Flag: React.FC<FlagProps> = ({
  countryCode,
  flagSize = 24,
  style,
  ...props
}) => {
  const country = getCountryByCode(countryCode);
  const flag = country?.flag || "🏳️"; // Default flag if country not found

  return (
    <Text
      style={[
        {
          fontSize: flagSize,
        },
        style,
      ]}
      {...props}
    >
      {flag}
    </Text>
  );
};

export default Flag;
