
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import CustomText from "./CustomText";
import InputHelper from "./InputHelper";
import LoadButton from './LoadButton';

export default function ProfileForm({onPress, formData, setFormData, setPhotoURL, isLoading}: {onPress: () => void, formData: any, setFormData: (data: any) => void, setPhotoURL: (url: string) => void, isLoading:boolean} ){
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
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhotoURL(result.assets[0].uri);
    }
  };
  const [focused, setFocused]= useState('')

  return(
    <View className="">

      <View className="items-center mb-8">
        <TouchableOpacity onPress={pickImage} className="relative h-fit">
          <View className="w-32 h-32 rounded-full bg-gray-200 items-center justify-center overflow-hidden border-2 border-gray-300">
            {formData.photoURL ? (
              <Image source={{uri: formData.photoURL}} className="w-full h-full" />
            ) : (
              <CustomText className="text-4xl text-gray-400">+</CustomText>
            )}
          </View>
          <View className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 border-2 border-white">
            {/* Icon placeholder */}
            <View className="w-4 h-4 bg-white rounded-full" />
          </View>
        </TouchableOpacity>
        <CustomText className="mt-2 text-sm textblue-custom">{!formData.photoURL?'Tap to upload photo':'Edit'}</CustomText>
      </View>
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
            onPress={onPress}
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