import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import CustomText from "./CustomText";

interface ButtonHelperProps extends TouchableOpacityProps {
  disabled?: boolean;
  isLoading?: boolean;
  isLoader?: boolean;
  extraClassName?: string;
  label?: string;
  onPress?: () => void;
  type?: "pri" | "sec" | "tert";
  showIcon?: boolean;
}

export default function ButtonHelper({
  disabled = false,
  isLoading,
  isLoader,
  extraClassName,
  label,
  onPress,
  type = "pri",
  showIcon = false,
  ...props
}: ButtonHelperProps) {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: type === "pri" ? "#fff" : "#004182",
        borderWidth: type === "pri" ? 1 : 0,
        borderColor: type === "pri" ? "#004182" : "transparent",
        borderRadius: 24,
        paddingVertical: 16,
        paddingHorizontal: 20,
        opacity: disabled ? 0.4 : 1,
      }}
      onPress={onPress}
      {...props}
    >
      <CustomText
        font_fam="semibold"
        style={{
          color: type === "pri" ? "#004182" : "#fff",
          fontSize: 18,
          textAlign: 'center'
        }}
      >
        {label}
      </CustomText>

      {showIcon && (
        <View style={{ position: 'absolute', right: 20 }}>
          <Text style={{ color: type === "pri" ? "#004182" : "#fff", fontSize: 16 }}>→</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
