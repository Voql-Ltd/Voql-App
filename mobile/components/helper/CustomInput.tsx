import React, { useState } from "react";
import { TextInput, TextInputProps, TouchableOpacity, View } from "react-native";

import CustomText from "./CustomText";

interface CustomInputProps {
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: TextInputProps['keyboardType'];
  placeholder?: string;
  secureTextEntry?: boolean;
  rightElement?: React.ReactNode;
  error?: string;
  containerClassName?: string;
  inputClassName?: string;
  style?: any;
}

export default function CustomInput({
  value,
  onChangeText,
  keyboardType,
  placeholder,
  secureTextEntry = false,
  rightElement,
  error,
  containerClassName,
  inputClassName,
  ...props
}: CustomInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View className={"mb-4 "+ containerClassName}>
      <View
        // className={cn(
        //   "flex-row items-center h-[52px] px-4 rounded-3xl border",
        //   "border-gray-300 bg-white", // Default
        //   focused && !error && "border-blue-700", // Focus state
        //   error && "border-red-600" // Error state
        // )}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholderTextColor="#999"
          className={"flex-1 text-[15px] text-black "+ inputClassName}
          {...props}
        />

        {rightElement && (
          <TouchableOpacity className="ml-2" activeOpacity={0.7}>
            {rightElement}
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <CustomText className="text-red-600 text-xs mt-1 ml-2">
          {error}
        </CustomText>
      )}
    </View>
  );
}
