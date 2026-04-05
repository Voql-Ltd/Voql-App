import { useRouter } from "expo-router";
import { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomText from "./CustomText";
import GoBack from "./GoBack";

interface DescriptionItem {
  value: string;
  descr: string;
  label: string;
}

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description?: DescriptionItem[];
  showBackButton?: boolean;
}

const AuthLayout = ({
  children,
  title,
  description = [],
  showBackButton = true,
}: AuthLayoutProps) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustContentInsets={false}
        >
          <View className="flex-1 px-6">
            {/* Header: Logo and optional Back Button */}
            <View className="mt-2 mb-8">
              {showBackButton && (
                <View className="ml-[-20] mb-[-20]">
                  <GoBack route={() => router.back()} ignoreParams={true} />
                </View>
              )}

              <View className="items-center mt-10">
                <CustomText className="text-2xl font-bold text-blue-600">Logo</CustomText>
              </View>
            </View>

            {/* Title & Subtitle */}
            <View className="items-center mt-6">
              <CustomText
                className="text-[24px] text-gray-900 text-center mb-4"
                font_fam="bold"
              >
                {title}
              </CustomText>

              <View className="flex-col gap-y-2">
                {description.map(({ value, descr, label }) => (
                  <View key={value} className="flex-row">
                    <CustomText font_fam="bold">{label} - </CustomText>
                    <CustomText>{descr}</CustomText>
                  </View>
                ))}
              </View>
            </View>

            {/* Main content */}
            <View className="flex-1">{children}</View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AuthLayout;
