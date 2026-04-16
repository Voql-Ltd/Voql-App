import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import CustomText from "./CustomText";

interface CustomButtonProps {
  label: string;
  route?: string;
  color?: string;
  bgcolor?: string;
  hasBorder?: boolean;
  showIcon?: boolean;
  onPress?: () => void;
  style?: any;
}

export default function CustomButton({
  label,
  route,
  color = "#000",
  bgcolor = "#f3f4f6",
  hasBorder = false,
  showIcon = false,
  onPress,
  style,
}: CustomButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (route) {
      router.push(route as any);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className="flex-row items-center justify-center relative px-5 mb-4 rounded-3xl"
      style={{
        borderRadius: 24,
        paddingVertical: 15,
        paddingHorizontal: 40,
        backgroundColor: bgcolor,
        borderColor: hasBorder ? color : "transparent",
        borderWidth: hasBorder ? 1 : 0,
        ...style,
      }}
    >
      <CustomText
        className="text-center text-lg"
        style={{ color: hasBorder ? color : "#000" }}
      >
        {label}
      </CustomText>

      {showIcon && (
        <View className="absolute right-5">
          <Text>→</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
