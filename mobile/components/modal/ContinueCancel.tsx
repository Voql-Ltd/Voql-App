import { Text, TouchableOpacity, View } from "react-native";
import ModalLayout from "./ModalLayout";
import CustomText from "../helper/CustomText";


export default function ContinueCancel({onClose,isLoading=null, onNext,text,html, continueClass, cancelLabel="Cancel", continueLabel="Continue", extraClass=""}) {
    return (
        <ModalLayout onClose={onClose}>
            <View
                style={isLoading?{
                    opacity:'0.5'
                }:{

                }} 
                onPress={(e)=> e.stopPropagation()} 
                className={"monte bg-white relative rounded-md px-10 py-10 text-center w-fit text-sm"+extraClass}>
                {/* <img src={'/svg/close.svg'} className="w-7 h-7 cursor-pointer absolute right-3 top-2" onPress={onClose}/> */}
                <View>
                    {html?html: <CustomText className="text-semibold">{text}</CustomText>}
                </View>
                <View className="flex mt-10 align-center gap-x-10 justify-between mt-10">
                    <TouchableOpacity 
                        className="bg-white text-primary2 border pl-3 pr-3 pt-2 pb-2 rounded-sm w-full border-primary text-primary" 
                        onPress={onClose}>
                            <CustomText>{cancelLabel}</CustomText>
                        </TouchableOpacity>
                    <TouchableOpacity
                        disabled={isLoading}
                        onPress={()=>{
                            onNext()
                        }} 
                        className={" text-white pl-3 pr-3 w-full "+continueClass}>
                            <CustomText>{continueLabel}</CustomText>
                        </TouchableOpacity>
                </View>
            </View>
        </ModalLayout>

    );
  }
  