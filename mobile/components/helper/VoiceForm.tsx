import { View } from "react-native";
import CustomText from "./CustomText";
import VoiceRecorder from "./VoiceRecorderInput";

interface VoiceFormFieldsProps {
  label: string;
  descr: string;
  value: string;
  match: string;
}
export default function VoiceForm(
    {onNext, voiceFormData, currSubStep, voiceFormFields, setVoiceFormData, isLoading}: 
    {onNext: () => void, voiceFormData: any, 
        voiceFormFields:VoiceFormFieldsProps[],
        currSubStep:number,
        setVoiceFormData: (data: any) => void,  isLoading:boolean}){
  

  const onVoiceUpload=(voice_uri:string,value:string)=>{
    setVoiceFormData({...voiceFormData, [value]:voice_uri})
  } 
  return(
    <View className=" flex-1">
      <View className="gap-y-5  flex-1 w-full">
        {voiceFormFields.map(({value, label, descr}, index) => (
          <View key={index} 
            className="flex-col flex-1 justify-between"
            style={currSubStep===index?{}:{display:'none'}}>  
            <View className="px-4">
                <CustomText className="text-2xl">
                    {label}
                </CustomText>
                <CustomText className="text-base mt-3  text-[#6A6970]">
                    {descr}
                </CustomText>
            </View>
            <View id="bb" className="">
                <VoiceRecorder onSave={(voice_uri:string)=>onVoiceUpload(voice_uri, value)}
                    value={voiceFormData[value] || ''}    
                />
            </View>
            <View/>
          </View>
        ))}
      </View>
      {/* <LoadButton
            onPress={onNext}
            className="bg-blue-custom w-full py-4 rounded-xl mt-10"
            // disabled={Object.keys(formData).length<3}
            disabled={false}
            isLoading={isLoading}
        >
            <CustomText className="text-white text-center text-lg">Continue</CustomText>
      </LoadButton> */}
    </View>
  )
}