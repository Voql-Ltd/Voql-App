import { View, TouchableOpacity, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/colors";
import { PAGE_ROUTES } from "@/config";
import CustomText from "./CustomText";
import { useContext, useState } from "react";

interface StepHeaderProps {
  title: string;
  step: number;
  total: number;
  onPress?: () => void;
  forwardPress?: () => void;
}

export default function StepHeader({title, step, total, onPress, forwardPress}: StepHeaderProps){
  return (
    <View className="flex-row relative z-2 items-center justify-between px-4 py-4 border-b border-gray-100">
      <TouchableOpacity
        onPress={
          onPress 
            ? ()=>onPress()
            : router.canGoBack()
            ? () => router.back()
            : () => router.replace(PAGE_ROUTES.WELCOME_SCREEN as any)
        }
        accessibilityRole="button"
        accessibilityLabel="Go back"
        className="p-2"
      >
        <Ionicons name="chevron-back" size={24} color={colors.neutral[800]} />
      </TouchableOpacity>
      <View className="items-center flex-1">
        <CustomText className="text-lg font-semibold text-gray-800">{title}</CustomText>
        <CustomText className="text-xs text-gray-500">
          Step {step+1} out of {total}
        </CustomText>
      </View>
      {step<3?
        <View className="w-8" />:
        <Pressable className="px-2" onPress={onPress}>
          <CustomText className="text-sm textblue-custom">Skip</CustomText>
        </Pressable>
      }
    </View>
  );
};