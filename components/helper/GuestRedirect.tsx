import { PAGE_ROUTES } from "@/config";
import { useRouter } from "expo-router";
import { Fragment } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import CustomText from "./CustomText";

interface ButtonConfig {
  label: string;
  className: string;
  textClassName: string;
  redirect: `/${string}`;
}

interface GuestRedirectProps {
  style?: any;
}

export default function GuestRedirect({ style }: GuestRedirectProps = {}) {
  const router = useRouter();
  
  const buttons: ButtonConfig[] = [
    {
      label: "Create Account",
      className: "bg-white",
      textClassName: "text-black",
      redirect: PAGE_ROUTES.AUTH_SCREENS.REGISTER as `/${string}`,
    },
    {
      label: "Login",
      className: "border border-white",
      textClassName: "text-white",
      redirect: PAGE_ROUTES.AUTH_SCREENS.CHOOSE_ROLE as `/${string}`,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#1a1a1a', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 80, ...style }}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(30, 30, 30, 0.66)",
        }}
      />
      <View className="w-full relative" style={{ width: 322, height: 430, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 20 }}>
        <View className="mt-8 flex-col gap-y-4">
          <View className="flex-col justify-center items-center">
            <View className="w-fit bg-[#E5F2FF] rounded-[8px] p-2 mb-2">
              <CustomText font_fam="bold" className="text-2xl text-blue-600">Logo</CustomText>
            </View>
            <CustomText className="text-white mb-0 text-xl text-center">
              Monielog
            </CustomText>
          </View>
          <View className="justify-center px-10">
            <CustomText
              className="text-white text-center mb-10 mt-[50px] text-2xl"
            >
              {"Easily track sales & manage debts"}
            </CustomText>
          </View>
          <View className="px-4 gap-y-6">
            {buttons.map(({ label, className, textClassName, redirect }, index) => (
              <Fragment key={index}>
                <TouchableOpacity
                  style={{
                    borderRadius: 24,
                    paddingVertical: 15,
                    paddingHorizontal: 40,
                    backgroundColor: className.includes('bg-white') ? '#fff' : 'transparent',
                    borderWidth: className.includes('border') ? 1 : 0,
                    borderColor: '#fff',
                  }}
                  activeOpacity={0.7}
                  onPress={() => router.push(redirect as any)}
                >
                  <CustomText
                    className={`${textClassName} text-center text-lg`}
                  >
                    {label}
                  </CustomText>
                </TouchableOpacity>
              </Fragment>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

function StyledCard() {
  return (
    <View style={styles.cardBase}>
      {/* The Peak */}
      <View style={styles.peak} />

      {/* Your Content Here */}
    </View>
  );
}

const styles = StyleSheet.create({
  cardBase: {
    width: "90%",
    height: 400,
    backgroundColor: "black",
    borderRadius: 40,
    position: "relative",
    overflow: "hidden", // Keeps the peak from sticking out weirdly
  },
  peak: {
    position: "absolute",
    top: -25, // Adjust based on how sharp you want the peak
    left: "50%",
    marginLeft: -40, // Half of width to center it
    width: 80,
    height: 80,
    backgroundColor: "black",
    transform: [{ rotate: "45deg" }],
    borderRadius: 15, // Smooths the tip of the peak
  },
});
