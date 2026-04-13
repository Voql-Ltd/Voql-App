
import { API_ROUTES, consolelog } from '@/config';
import { useAuth } from '@/context';
import { useHttpServices, useSingleFile, useToast } from '@/hooks';
import { useMutation } from '@tanstack/react-query';
import { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import CustomText from "./CustomText";
import InputHelper from "./InputHelper";
import LoadButton from './LoadButton';

export default function ProfileForm(
  {   
      onNext, formData, 
      setFormData, 
      otp
  }: {onNext: () => void, formData: any, otp: string, setFormData: (data: any) => void} ){
  const formFields = [
    {
      label: 'First Name',
      value: 'firstName',
    },
    {
      label: 'Last Name',
      value: 'lastName',
    },
    {
      label: 'Nick Name',
      value: 'nickName'
    }
  ]
  const [focused, setFocused]= useState('')
  const {NotifyError, NotifySuccess}= useToast()
  const {postData} = useHttpServices();
  const {login} = useAuth()
  const {pickImage, uploadFile, file, loading} = useSingleFile({})
  
  const createAccQuery = async () => {
    const {imageUrl, error:imageError} = file.uri ? await uploadFile() : {imageUrl: '', error: ''}
    // if (error || !imageUrl) {
    //     consolelog({ error });
    //     throw "Cloudinary upload failed" ;
    // }
    if (imageError) {
      consolelog({imageError})
      throw imageError
    }
    return await postData({
      path: API_ROUTES.SIGN_UP,
      body: {
        firstName: formData.firstName,
        formattedText:formData.formattedValue,
      lastName: formData.lastName,
        phone: formData.phoneNumber,
        email: formData.email,
        ...(imageUrl ? {photoURL: imageUrl} : {}),
      countryCode: formData.countryCode,
        countryName: formData.countryName,
        // take device info later
        // deviceId: DeviceInfo.getDeviceId(),
        otp: formData.otp
      }
    });
  };
  
  const {mutate:createAcc, isPending:isLoading}=useMutation({
      mutationFn: createAccQuery,
      onError: (error:any) => {
        return NotifyError(error?.error?.message || 'Could not create account')
      },
      onSuccess: async(data:any) => {  
        NotifySuccess('Account created successfully')
        consolelog({sreg:data})
        await login(data?.data?.access_code);
        return onNext();
      }
  })
  return(
    <View className="">

      {focused!=='nickName' && <View className="items-center mb-8">
        <TouchableOpacity onPress={pickImage} className="relative h-fit">
          <View className="w-32 h-32 rounded-full bg-gray-200 items-center justify-center overflow-hidden border-2 border-gray-300">
            {file.uri ? (
              <Image source={{uri:file.uri}} className="w-full h-full" />
            ) : (
              <CustomText className="text-4xl text-gray-400">+</CustomText>
            )}
          </View>
          <View className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 border-2 border-white">
            {/* Icon placeholder */}
            <View className="w-4 h-4 bg-white rounded-full" />
          </View>
        </TouchableOpacity>
        <CustomText className="mt-2 text-sm textblue-custom">{!file.uri?'Tap to upload photo':'Edit'}</CustomText>
      </View>}
      <View className="gap-y-5">
        {formFields.map(({value, label}, index) => (
          <View key={index}>  
            <InputHelper 
              label={label}
              showLabel={true}
              isFocused={focused===value}
              setFocused={(v:string)=>setFocused(v)}
              value={formData[value as keyof typeof formData] || ''}
              onChangeText={(text:string)=>setFormData({...formData, [value]: text})}
              fieldName={value}
            />
            {/* {formData[value] && <CustomText>{value}</CustomText>} */}
          </View>
        ))}
      </View>
      <LoadButton
            onPress={()=>createAcc()}
            className="bg-blue-custom w-full py-4 rounded-xl mt-10"
            // disabled={Object.keys(formData).length<3}
            disabled={false}
            isLoading={isLoading}
        >
            <CustomText className="text-white text-center text-lg">Continue</CustomText>
        </LoadButton>
    </View>
  )
}