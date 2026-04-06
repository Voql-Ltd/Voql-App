import { AddFriends, AltePhone, CustomText, LoadButton, OTPbox, ProfileForm, StepHeader, VoiceForm } from "@/components";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { BackHandler, Pressable, TouchableOpacity, View } from "react-native";

import { PAGE_ROUTES } from "@/config";
import { useFocusEffect } from "expo-router";

import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { RegisterContext, RegisterContextComponent, ScreenViewContext, ScreenViewContextComponent } from "@/context";
import { useToast } from "@/hooks";
import { useMutation } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
// import {useNetworkState} from "@/hooks/useNetworkState";


export default function Register() {

  return(

    <ScreenViewContextComponent>
      <RegisterContextComponent>
        <ParentComponent/>
      </RegisterContextComponent>
    </ScreenViewContextComponent>
  )
}
function ParentComponent(){
    
    const router = useRouter()
    const {step, setStep}= useContext(RegisterContext)
    const {isScrollOffset, setIsScrollOffset} = useContext(ScreenViewContext)

    useEffect(()=>{
    if(!isScrollOffset) return
    setIsScrollOffset(false)
    },[step])
    useFocusEffect(
    useCallback(() => {
        const onBackPress = () => {
        return true; 
        };

        BackHandler?.addEventListener("hardwareBackPress", onBackPress);
//
        // return () =>BackHandler?.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
)
  const stepLabels=[
    "What's your phone number?",
    'Verify your phone number',
    'Set up Profile',
    'Add voice tags'
    
  ]
  return(
    <View className='flex-1 bg-white py-4 pt-6 relative'>
      <SafeAreaView>
        <View className='relative'>
          
          <StepHeader title={stepLabels[step]} step={step} total={5} 
            forwardPress={()=>setStep(step+1)}
            onPress={step?()=>setStep(step-1):()=>router.back()}/>
          {/* <GoBack route={step?()=>setStep(step-1):()=>router.back()} ignoreParams={true}/> */}
          <View className='mt-8' style={step===3?{paddingHorizontal:0}:{paddingHorizontal:16}}>
            {!step?
              <Step1EnterPhone/>:
            step===1?
              <Step2VerifyPhone/>:
            step===2?
              <Step3CompleteProfile/>:
            step===3?
              <Step4VoiceTags/>:
            step===4?
              <Step5AddContacts/>:
            step===5?
              <View/>:
            step===6?
              <View/>
            :null    
            }
          </View>    
        </View>
      </SafeAreaView>
    </View>

  )
}

function Step1EnterPhone(){
  const phoneInput = useRef<any>(null);
  const {NotifyError, NotifySuccess}= useToast()
  const searchParams = useLocalSearchParams<{
    phoneNumber?: string;
    countryCode?: string;
  }>();
  // const [value, setValue] = useState<string>(phoneNumber || "");
  // const [countryCode, setCountryCode] = useState(initialCountryCode || "IE");
  // const [formattedValue, setFormattedValue] = useState<string>(
  //   phoneNumber || ""
  // );
  // const {isOffline} = useNetworkState();
  const {formData, setFormData, setStep}= useContext(RegisterContext)
  useEffect(() => {
    if(!searchParams?.phoneNumber){
      return;
    }
    setFormData((prev:any) => ({
      ...prev,
      phoneNumber: searchParams.phoneNumber,
      countryCode: searchParams.countryCode || '',
      formattedValue: searchParams.phoneNumber,
    }));
  }, []);

  const sendOtpQuery=()=>{
    return Promise.resolve({})
  }
  const {mutate:sendOtp, isPending:sendLoading}=useMutation({
      mutationFn: sendOtpQuery,
      onError: ({error}:{error:any}) => {
        
        return NotifyError(error?.message || 'Could not send OTP')
      },
      onSuccess: () => {
        return NotifySuccess('OTP sent successfully')
      }
  })
  return(
    <View>
      <CustomText className="mb-2">Phone Number</CustomText>
      <AltePhone
        ref={phoneInput}
        defaultValue={formData.phoneNumber}
        defaultCode={formData.countryCode}
        onChangeText={(text: string) => {
          setFormData({...formData, phoneNumber:text})
        }}
        onChangeFormattedText={(text: string) => {
          setFormData({
            ...formData, 
            formattedValue: text,
            countryCode: phoneInput.current?.getCountryCode() || formData.countryCode
          })
        }}
        disabled={false}
        autoFocus
      />
      {/* {isOffline && (
        <CustomText className="mt-2 text-sm text-orange-600">
          No internet connection. Please check your network and try again.
        </CustomText>
      )} */}
      {/* {(error || authError) && (
        <NotifyError/>
      )} */}
      <LoadButton
        onPress={()=>{
          const checkValid = phoneInput.current?.isValidNumber(formData.phoneNumber);
          console.log('checkValid', checkValid);
          console.log('formData', formData);
          setStep(1);
          // setFormData({...formData, isValid:checkValid ? checkValid : false});
          // setFormData({...formData, countryCode:phoneInput.current?.getCountryCode() || ""});

        }}
        className="mt-[150px] bgblue-custom w-full py-4 rounded-lg"
        disabled={!phoneInput.current?.isValidNumber(formData.phoneNumber)}
        isLoading={sendLoading}
      >
        <CustomText className="text-white text-center text-lg">Continue</CustomText>
      </LoadButton>
    </View>
  )
}
function Step2VerifyPhone(){
  const [otp, setOtp] = useState('');
  const {setStep, formData} = useContext(RegisterContext)
  
  const verifyOtpQuery = ({otp, phone}:{otp:string, phone:string})=>{
    return new Promise((resolve, reject) => {
      resolve(true)
    })
  };
  
  const {mutate:verifyOtp, isPending:sendLoading}=useMutation({
      mutationFn: ({otp, phone}:{otp:string, phone:string})=>verifyOtpQuery({otp, phone}),
      onError: ({error}:{error:any}) => {
        
        // return NotifyError(error?.message || 'Could not send OTP')
      },
      onSuccess: () => {
        setStep(2)
        // return NotifySuccess('OTP sent successfully')
      }
  })

  useEffect(()=>{
    if(sendLoading) return
    if(otp.length===6){
      const otp_data={
        otp:otp,
        phone:formData.phoneNumber
      }
      verifyOtp(otp_data)
    }
  }, [otp, sendLoading])
  
  return(
    <View className="py-5 px-3">
      <OTPbox value={otp} 
        length={6}
        label={"Enter the 6-digit code sent via SMS to "+formData.phoneNumber}
        onChangeOTP={(otpString:string)=>setOtp(otpString)}/>
      <CustomText className="mt-5 text-center">
        {'Didn\'t receive the code? '}
        <CustomText className="textblue-custom">Resend Code</CustomText>
      </CustomText>
     <LoadButton
        onPress={()=>{
          verifyOtp({otp, phone:formData.phoneNumber})
          setStep(2);
        }}
        className="bg-blue-custom w-full py-4 rounded-xl mt-[100px]"
        disabled={otp.length!==6}
        isLoading={sendLoading}
      >
        <CustomText className="text-white text-center text-lg">Continue</CustomText>
      </LoadButton>
    </View>
  )
}
function Step3CompleteProfile(){
  const {setStep, formData, setFormData}= useContext(RegisterContext)
  const [focused, setFocused] = useState('');
  const createAccQuery=()=>{
    return Promise.resolve({})
  }
  const {mutate:createAcc, isPending:isLoading}=useMutation({
      mutationFn: createAccQuery,
      onError: ({error}:{error:any}) => {
        
        // return NotifyError(error?.message || 'Could not send OTP')
      },
      onSuccess: () => {
        // return NotifySuccess('OTP sent successfully')
      }
  })
  return(
    <ProfileForm 
      isLoading={isLoading}
      onPress={() => setStep(3)} 
      formData={formData} 
      setFormData={setFormData} 
      setPhotoURL={(url:string)=>{
        setFormData({
          ...formData,
          photoURL: url
        })
      }}
    />
  )
}

function Step4VoiceTags(){
  const {setStep, step, voiceFormData, setVoiceFormData, formData}= useContext(RegisterContext)
  const [subStep, setSubStep]= useState(0)
  
  const saveRecQuery=()=>{
    return Promise.resolve({})
  }
  const {mutate:saveRec, isPending:isLoading}=useMutation({
      mutationFn: saveRecQuery,
      onError: ({error}:{error:any}) => {
        
        // return NotifyError(error?.message || 'Could not send OTP')
      },
      onSuccess: () => {
        // return NotifySuccess('OTP sent successfully')
      }
  })
  const voiceFormFields = [
      {
        label: 'Say your first name 😉',
        descr:'This helps us tag you naturally in conversations.',
        value: 'firstVoice',
        match:'firstName'
      },
      {
        label: 'Now your last name 😉',
        descr:"We’ll use this to recognize you more accurately in groups.",
        value: 'lastVoice',
        match:'lastName'
      },
      {
        label: 'What do friends call you?',
        descr:'Say your nickname so we can catch it when they do.',
        value: 'nickVoice',
        match:'nickName'
      }
    ]
  return(
    <View className="w-full h-full">
      {subStep<2?
      <VoiceForm 
        onNext={()=>setSubStep(subStep+1)} voiceFormData={voiceFormData}
        setVoiceFormData={setVoiceFormData}  
        isLoading={false}
        voiceFormFields={voiceFormFields}
        currSubStep={subStep}
      />
      :
      <View>
        <CustomText className="text-2xl ">
          Does this sound right?
        </CustomText>
        <CustomText className="text-base text-[#6A6970] mt-3">
          {"Play it back, confirm if it’s good, or try again."}
        </CustomText>
        <View className="gap-y-2 mt-10">
          {voiceFormFields.map(({value, match}, index) => (
            <View key={index}>  
              <CustomText className="text-base">
                  {formData[match] || 'noname'}
              </CustomText>
              <View>
                <Pressable>

                </Pressable>
                <CustomText className="text-lg mt-3">
                    {voiceFormData[value]}
                </CustomText>
              
              </View>
              
            </View>
          ))}
        </View>
        <LoadButton
            onPress={()=>saveRecQuery()}
            className="bg-blue-custom w-full py-4 rounded-xl mt-10"
            // disabled={Object.keys(formData).length<3}
            disabled={false}
            isLoading={isLoading}
          >
              <CustomText className="text-white text-center text-lg">Save my voice tags</CustomText>
        </LoadButton>
      </View>
      }
    </View>
  )
}

function Step5AddContacts(){
  return(
    <View>
      <AddFriends onNext={()=>null}/>
    </View>
  )
}

function LoginInstead(){
  return(
  <View className='mt-6 flex-row gap-x-2 items-center'>
    <CustomText className={'text-[14px]'}>Already have an account?</CustomText>
    <TouchableOpacity onPress={()=>router.push(PAGE_ROUTES.AUTH_SCREENS.LOGIN as any)}>
      <CustomText font_fam="semibold" className={'text-md underline '}>Login</CustomText>
    </TouchableOpacity>
  </View>
  )
}


