import { Text, View, TextStyle, ViewStyle } from "react-native";
import React from 'react';
import { ReactNode } from 'react';
import { Ionicons } from "@expo/vector-icons";
// import GreenTick from '../../assets/svg/tick-green.svg';
// import { CustomText } from "../components";

interface ToastProps {
  text1?: string;
  text2?: string;
}

export const toastConfig = {
  error: ({ text1, text2 }: ToastProps): ReactNode => (
    <View
      style={{
        backgroundColor: "#FBE9E9",
        paddingVertical: 16,
        width:'100%',
        paddingHorizontal: 20,
        borderRadius:0,
        // marginHorizontal: 16,
      }}
    >
      <Text style={{ color: "#DC2626", fontSize: 15, fontFamily:'Inter' } as TextStyle}>
        {text1}
      </Text>
      {text2 && <Text style={{ color: "#DC2626", fontSize: 15, fontFamily:'Inter' } as TextStyle}>
        {text2}
      </Text>}
    </View>
  ),

  success: ({ text1, text2 }: ToastProps): ReactNode => (
    <View
      style={{
        backgroundColor: "#E9FCF0",
        paddingVertical: 16,
        width: '100%',
        paddingHorizontal: 20,
        borderRadius: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      } as ViewStyle}
    >
      <Text style={{ fontSize: 16, fontFamily: 'Inter', color: '#059669' } as TextStyle}>
        {text1}
      </Text>
      {/* <GreenTick width={24} height={24}/> */}
      {/* <Text style={{ fontSize: 20, color: '#059669' } as TextStyle}>✓</Text> */}
      <Ionicons name="checkmark-sharp" size={24} color="#059669" />
    </View>
  ),
};

export default toastConfig;
