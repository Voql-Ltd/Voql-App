import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import CustomText from "./CustomText";

interface GoBackProps {
  label?: string;
  style?: any;
  route?: () => void;
  whiteArr?: boolean;
  ignoreParams?: boolean;
  showLabel?: boolean;
  extraComponent?: React.ReactNode;
}

export default function GoBack({
  label,
  style = {},
  route,
  whiteArr = false,
  ignoreParams = false,
  showLabel = false,
  extraComponent=null,
}: GoBackProps) {
  const router = useRouter();
  const { goBackTitle = 'Home', goBackLink = '/screens/home' } = useLocalSearchParams();

  return (
    <View style={style} className="flex-row items-center px-4 justify-between">
      <TouchableOpacity
        className=""
        onPress={!route ? () => router.back() : () => route?.()}
      >
        <Ionicons name="caret-back" size={25} />
        
      </TouchableOpacity>
      {showLabel ? (
          <CustomText className="text-xl">
            {label}
          </CustomText>
        ) : null}
        {extraComponent || <View/>}
    </View>
  );
}