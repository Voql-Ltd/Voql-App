import { AltePhone, CustomText, LoadButton, OTPbox, StepHeader } from "@/components";
import { router, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { consolelog, PAGE_ROUTES } from "@/config";
import API_ROUTES from "@/config/apiRoutes";
import { useAuth } from "@/context";
import { useHttpServices, useToast } from "@/hooks";
import { useMutation } from "@tanstack/react-query";

interface LoginFormData {
  phoneNumber: string;
  countryCode: string;
  formattedValue: string;
  countryName: string;
}

export default function Login() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<LoginFormData>({
    phoneNumber: '',
    countryCode: '',
    formattedValue: '',
    countryName: ''
  });
  const [otp, setOtp] = useState('');
  const router = useRouter();

  const stepLabels = [
    "What's your phone number?",
    'Verify your phone number'
  ];

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        return true;
      };
      const subscription = BackHandler?.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription?.remove();
    }, [])
  );

  return (
    <View className='flex-1 bg-white py-4 pt-6 relative'>
      <SafeAreaView>
        <View className='relative'>
          <StepHeader 
            title={stepLabels[step]} 
            step={step} 
            total={2} 
            forwardPress={() => setStep(step + 1)}
            onPress={step ? () => setStep(step - 1) : () => router.back()}
          />
          <View className='mt-8' style={{ paddingHorizontal: 16 }}>
            {!step ? (
              <Step1EnterPhone 
                formData={formData}
                setFormData={setFormData}
                setStep={setStep}
              />
            ) : step === 1 ? (
              <Step2VerifyPhone 
                formData={formData}
                otp={otp}
                setOtp={setOtp}
              />
            ) : null}
          </View>
          {/* <RegisterInstead /> */}
        </View>
      </SafeAreaView>
    </View>
  );
}

function Step1EnterPhone({ 
  formData, 
  setFormData, 
  setStep 
}: { 
  formData: LoginFormData;
  setFormData: (data: LoginFormData) => void;
  setStep: (step: number) => void;
}) {
  const phoneInput = useRef<any>(null);
  const { NotifyError, NotifySuccess } = useToast();
  const [tryCount, setTryCount] = useState(0);
  const { postData } = useHttpServices();

  const sendOtpQuery = async () => {
    return await postData({
      path: API_ROUTES.SEND_OTP_GUEST,
      body: {
        tryCount,
        phone: formData.formattedValue,
        mode:'signin'
      }
    });
  };

  const { mutate: sendOtp, isPending: sendLoading } = useMutation({
    mutationFn: sendOtpQuery,
    onError: (error: any) => {
      consolelog(error);
      return NotifyError(error?.error?.message || 'Could not send OTP');
    },
    onSuccess: () => {
      setStep(1);
      setTryCount(tryCount + 1);
      return NotifySuccess('OTP sent successfully');
    }
  });

  return (
    <View>
      <CustomText className="mb-2">Phone Number</CustomText>
      <AltePhone
        ref={phoneInput}
        defaultValue={formData.phoneNumber}
        defaultCode={formData.countryCode}
        onChangeText={(text: string) => {
          setFormData({ ...formData, phoneNumber: text });
        }}
        onChangeFormattedText={(data) => {
          setFormData({
            ...formData,
            formattedValue: data.formattedText,
            countryName: data.countryName,
            countryCode: data.countryCode
          });
        }}
        disabled={false}
        autoFocus
      />
      <LoadButton
        onPress={() => {
          const checkValid = phoneInput.current?.isValidNumber(formData.phoneNumber);
          console.log('checkValid', checkValid);
          console.log('formData', formData);
          if (checkValid) {
            sendOtp();
          }
        }}
        className="mt-[150px] bgblue-custom w-full py-4 rounded-lg"
        disabled={!phoneInput.current?.isValidNumber(formData.phoneNumber)}
        isLoading={sendLoading}
      >
        <CustomText className="text-white text-center text-lg">Continue</CustomText>
      </LoadButton>
    </View>
  );
}

function Step2VerifyPhone({ 
  formData, 
  otp, 
  setOtp 
}: { 
  formData: LoginFormData;
  otp: string;
  setOtp: (otp: string) => void;
}) {
  const { NotifyError, NotifySuccess } = useToast();
  const { login } = useAuth();
  const { postData } = useHttpServices();
  const [hasVerified, setHasVerified] = useState(false);

  const loginQuery = async (otp: string) => {
    return await postData({
      path: API_ROUTES.SIGN_IN,
      body: { otp, phone: formData.formattedValue }
    });
  };

  const { mutate: loginUser, isPending: loginLoading } = useMutation({
    mutationFn: loginQuery,
    onError: (error: any) => {
      setHasVerified(true);
      setOtp('')
      return NotifyError(error?.error?.message || 'Could not login');
    },
    onSuccess: async (data: any) => {
    //   consolelog({ login: data });
      consolelog({loginData:data?.data});
    //   await login(data?.data?.token);
      NotifySuccess('Logged in successfully')
            // consolelog({sreg:data})
      setHasVerified(true);
      setOtp('')
      await login(data?.data?.access_token);
      NotifySuccess('Login successful');
      router.push(PAGE_ROUTES.LOGGED_IN_SCREEN as any);
      return
    }
  });

  useEffect(() => {
    if (loginLoading) return;
    if(hasVerified) return;
    if (otp.length === 6) {
      loginUser(otp);
    }
  }, [otp, loginLoading, hasVerified]);

  return (
    <View className="py-5 px-3">
      <OTPbox
        value={otp}
        length={6}
        label={"Enter the 6-digit code sent via SMS to " + formData.formattedValue}
        onChangeOTP={(otpString: string) => setOtp(otpString)}
      />
      <CustomText className="mt-5 text-center">
        {'Didn\'t receive the code? '}
        <CustomText className="textblue-custom">Resend Code</CustomText>
      </CustomText>
      <LoadButton
        onPress={() => loginUser(otp)}
        className="bg-blue-custom w-full py-4 rounded-xl mt-[100px]"
        disabled={otp.length !== 6}
        isLoading={loginLoading}
      >
        <CustomText className="text-white text-center text-lg">Login</CustomText>
      </LoadButton>
    </View>
  );
}

function RegisterInstead() {
  const router = useRouter();
  
  return (
    <View className='mt-6 flex-row gap-x-2 items-center'>
      <CustomText className={'text-[14px]'}>Don't have an account?</CustomText>
      <TouchableOpacity onPress={() => router.push(PAGE_ROUTES.AUTH_SCREENS.REGISTER as any)}>
        <CustomText font_fam="semibold" className={'text-md underline '}>Register</CustomText>
      </TouchableOpacity>
    </View>
  );
}