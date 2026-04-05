import { TouchableOpacity, View } from "react-native";
import CustomText from "./CustomText";
import LoadButton from './LoadButton';
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
    <View className=" items-start">
      <View className="gap-y-5">
        {voiceFormFields.map(({value, label, descr}, index) => (
          <View key={index} style={currSubStep===index?{}:{display:'none'}}>  
            <CustomText className="text-2xl">
                {label}
            </CustomText>
            <CustomText className="text-lg mt-3">
                {descr}
            </CustomText>
            <VoiceRecorder onSave={(voice_uri:string)=>onVoiceUpload(voice_uri, value)}
                value={voiceFormData[value] || ''}    
            />
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