import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
// import { ResetPasswordContext } from "../../../src/context";
import { useRouter } from "expo-router";
import ButtonHelper from "./ButtonHelper";
import CustomText from "./CustomText";
import GoBack from "./GoBack";

interface ProgressItemProps {
  active: boolean;
  completed: boolean;
}

interface ProgressiveLayoutProps {
  children: React.ReactNode;
  title?: string;
  descr?: string;
  totalSteps?: number;
  onPress?: () => void;
  validateBtn?: boolean;
  buttonLabel?: string;
  showBtnIcon?: boolean;
  showModal?: boolean;
  route?: string;
  style?: any;
}

/* Changed w-[16%] to flex-1 to auto-balance across any screen width */
function ProgressItem({ active, completed }: ProgressItemProps) {
  // 1. Initialize to 1 if already completed, otherwise 0
  // This prevents previous bars from "re-filling" on every screen change
  const widthAnim = useRef(new Animated.Value(completed ? 1 : 0)).current;

  useEffect(() => {
    // 2. Only run the animation if it's the current active bar
    // and it's not already at its target value.
    Animated.timing(widthAnim, {
      toValue: active || completed ? 1 : 0,
      duration: completed ? 0 : 400, // Instant if completed, smooth if active
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [active, completed]);

  const animatedWidth = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View className="h-1.5 flex-1 bg-[#E5E7EB] rounded-full overflow-hidden">
      <Animated.View
        className="h-full bg-[#105362] rounded-full"
        style={{ width: animatedWidth }}
      />
    </View>
  );
}

const ProgressiveLayout = ({
  children,
  title,
  descr,
  totalSteps = 3,
  onPress,
  validateBtn,
  buttonLabel = "Continue",
  showBtnIcon = false,
  showModal,
  route,
  style,
}: ProgressiveLayoutProps) => {
  const router = useRouter();
  // const { step } = useContext(ResetPasswordContext);
  const step = 1; // Temporary fallback

  return (
    <View className="flex-1 bg-white" style={style}>
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
          <View className="px-6 pb-10 pt-2 flex-col h-full">
            {/* Navigation Header */}
            <View className="ml-[-20px]">
              <GoBack route={route as any} ignoreParams={true} />
            </View>

            {/* Progress Bar Section */}
            <View className="w-full mb-8">
              <View className="flex-row justify-between gap-x-2">
                {[...Array(totalSteps)].map((_, index) => {
                  const barNumber = index + 1;
                  return (
                    <ProgressItem
                      key={index}
                      // This bar animates if it's the current step
                      active={step === barNumber}
                      // This bar stays filled if we've already passed it
                      completed={step > barNumber}
                    />
                  );
                })}
              </View>
              <CustomText className="text-[#105362] mt-3 text-lg">
                <CustomText font_fam="semibold">Step {step}</CustomText> of{" "}
                {totalSteps}
              </CustomText>
            </View>

            {/* Form Header */}
            <View className="mb-6">
              <CustomText
                font_fam="semibold"
                className="text-[26px] leading-9 mb-2"
              >
                {title}
              </CustomText>
              <CustomText className="text-gray-500 text-base leading-6">
                {descr}
              </CustomText>
            </View>

            {/* Screen Content */}
            <View className="mb-14">{children}</View>

            {/* Bottom Button */}
            <ButtonHelper
              label={buttonLabel}
              type="sec"
              disabled={validateBtn}
              onPress={onPress}
              showIcon={showBtnIcon}
            />

            {/* {showModal ? (
              <ModalLayout onClose={() => setPlan_selected_confirm(null)}>
                <View
                  className={
                    "bg-white items-center rounded-t-[25px] px-8 py-12 text-center w-full text-sm"
                  }
                >
                  <CustomText style="bold" className="text-lg">
                    Hold on!
                  </CustomText>
                  <CustomText className="text-semibold my-5 text-center text-lg">
                    Confirmed
                  </CustomText>
                  <View className="flex mt-10 align-center gap-y-6 w-full">
                    {btnChoices.map(
                      ({ className, label, icon: Icon, iconOrder }, idx) => (
                        <TouchableOpacity
                          key={idx}
                          className={` ${className} rounded-[24px] py-5 px-10 flex-row items-center justify-between gap-x-2 ${iconOrder === 1 ? "order-1" : ""} ${iconOrder === 3 ? "order-3" : ""}`}
                          onPress={() => {
                            if (label === "Yes, proceed") {
                              setStep(1);
                              setFormData({
                                ...formData,
                                plan: plan_selected_confirm.value,
                              });
                              setPlan_selected_confirm(null);
                            } else {
                              setPlan_selected_confirm(null);
                            }
                          }}
                        >
                          {iconOrder === 1 ? (
                            <Icon />
                          ) : (
                            <View className="px-3" />
                          )}
                          <CustomText className={"text-white text-lg"}>
                            {label}
                          </CustomText>
                          {iconOrder === 3 ? (
                            <Icon />
                          ) : (
                            <View className="px-3" />
                          )}
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                </View>
              </ModalLayout>
            ) : null} */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ProgressiveLayout;
