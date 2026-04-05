import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import CustomText from "./CustomText";

interface GoBackProps {
  label?: string;
  style?: any;
  route?: () => void;
  whiteArr?: boolean;
  ignoreParams?: boolean;
  showLabel?: boolean;
}

export default function GoBack({
  label,
  style = {},
  route,
  whiteArr = false,
  ignoreParams = false,
  showLabel = false,
}: GoBackProps) {
  const router = useRouter();
  const { goBackTitle = 'Home', goBackLink = '/screens/home' } = useLocalSearchParams();

  return (
    <View style={style} className="flex-row w-fit items-center px-4">
      <TouchableOpacity
        className="bg-[#E5E7EB] rounded-full p-3 flex-row items-center gap-x-5"
        onPress={ignoreParams ? () => route?.() : () => router.push(goBackLink as any)}
      >
        <Text style={{ fontSize: 16 }}>{whiteArr ? "←" : "←"}</Text>
        {showLabel ? (
          <CustomText font_fam="bold" className="text-xl">
            {label}
          </CustomText>
        ) : null}
      </TouchableOpacity>
    </View>
  );
}