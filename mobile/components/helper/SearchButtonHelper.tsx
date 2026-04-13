import { TextInput, View } from "react-native";
import SearchIcon from '@/assets/images/icons/search.svg'
import { Ionicons } from "@expo/vector-icons";

export default function SearchButtonHelper({
    showBtn=false, keyword, setKeyword, label}:
    {showBtn?:boolean, keyword?:string,label:string, setKeyword:(str:string)=>void}){
    return(
        <View className="px-2 mb-5 flex-row items-center justify-between">
            <View className="border bd-color px-5 rounded-xl w-full p-2 flex-row items-center gap-x-[3px]">
                <Ionicons name="search" size={20} color="gray" />
                <TextInput style={{fontFamily:'Inter'}} className="text-[15px]" placeholder={label} value={keyword || ''} onChangeText={(e)=>setKeyword(e)}/>
            </View>
            {showBtn && <View/>}
        </View>
    )
}