// import welcomeImage from "@/assets/images/welcome-image.png";

// import {analyticsService} from "@/services/analyticsService";
import { CustomText } from "@/components";
import { API_ROUTES, PAGE_ROUTES } from "@/config";
import { router } from "expo-router";
import {
    ImageBackground,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Welcome screen
 */
export default function Welcome(){
  const insets = useSafeAreaInsets();
//   useEffect(() => {
//     analyticsService.trackScreenView("Welcome");
//   }, []);

  const handleLoginPress = (): void => {
    router.push(PAGE_ROUTES.AUTH_SCREENS.LOGIN as any);
  };

  const handleSignupPress = (): void => {
    router.push(PAGE_ROUTES.AUTH_SCREENS.REGISTER as any);
  };

  const heroContent = (
    <>
      <View className="mb-8">
        <CustomText
          className="mb-2 text-3xl font-medium text-white"
          accessibilityRole="header"
        >
          Welcome to {API_ROUTES?.BRAND_NAME}
        </CustomText>
        <CustomText className="text-base text-neutral-100">
          Voice Messages, Reinvented.
        </CustomText>
      </View>
      <View className="flex-grow md:flex-none"></View>
      <View className="flex-row gap-5 mb-8">
        <TouchableOpacity
          className="flex-1 px-8 py-3 bg-transparent border rounded-[32px] border-neutral-400"
          onPress={handleLoginPress}
          accessibilityRole="button"
          accessibilityLabel="Login"
          activeOpacity={0.8}
        >
          <CustomText className="text-base text-center text-secondary-50">Login</CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 px-8 py-3 rounded-[32px] bg-primary-500"
          onPress={handleSignupPress}
          accessibilityRole="button"
          accessibilityLabel="Signup"
          activeOpacity={0.8}
        >
          <CustomText className="text-base text-center text-white">Signup</CustomText>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <View className="flex-1 bg-black h-full">
      <ImageBackground
        source={require("../../assets/images/welcome-image.png")}
        className="flex-1 w-full h-full justify-end bg-gray-900"
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          justifyContent: "flex-end",
          backgroundColor: '#111827'
        }}
        resizeMode="cover"
        accessible
        accessibilityLabel="Voql welcome illustration"
        importantForAccessibility="no-hide-descendants"
      >
        <View className="absolute inset-0 bg-black/25" />
        
        <View className="justify-end flex-1">
          <View
            className="px-4 pt-6 pb-6 bg-black h-[310px]"
            style={{paddingBottom: Math.max(insets.bottom + 24, 24)}}
            accessible
            accessibilityRole="summary"
          >
            {heroContent}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};


