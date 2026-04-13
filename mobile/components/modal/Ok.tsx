import { Text, Pressable, TouchableOpacity, View } from "react-native";
import ModalLayout from "./ModalLayout";
import CustomText from "../helper/CustomText";

export default function Ok({onClose, text}) {
    return (
        <ModalLayout onClose={onClose}>
            <Pressable 
                onPress={(e)=> e.stopPropagation()} 
                className="bg-white rounded-md px-10 py-10 text-center w-fit">
                <CustomText>
                    {text}
                </CustomText>
                <View className="flex mt-10 align-center justify-center mt-10">
                    <TouchableOpacity
                        onPress={()=>{
                            onClose()
                        }} 
                        className="bg-blue-500 text-black pl-3 pr-3 rounded-md w-full py-2">
                            <CustomText>OK</CustomText>
                    </TouchableOpacity>
                </View>
            </Pressable>
        </ModalLayout>

    );
  }
  