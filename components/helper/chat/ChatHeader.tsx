import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import React from "react";
import {Image, Text, TouchableOpacity, View} from "react-native";
import CustomText from "../CustomText";

interface RecipientInfo {
  name: string;
  _id: string;
  room_type: string;
  members: any[];
  imageUrl?: string;
}

interface RoomData {
  name: string;
  room_type: string;
  room_bio: string;
  room_image?: string;
}

interface ChatHeaderProps {
  recipientInfo: RecipientInfo | null;
  roomData: RoomData;
  onBack?: () => void;
  onMicPress?: () => void;
  onSearchPress?: () => void;
  isSearchEnabled?: boolean;
  isMicEnabled?: boolean;
}

export default function ChatHeader({
  recipientInfo, roomData,
  onBack,
  onMicPress,
  onSearchPress,
  isSearchEnabled = true,
  isMicEnabled = true,
}:ChatHeaderProps){
  const name = recipientInfo?.name || roomData?.name || '';
  const imageUrl = recipientInfo?.imageUrl || roomData?.room_image;

  return(
    <View className="flex-row items-center justify-between px-3 pb-2.5 border-b border-gray-200 bg-white">
      <View className="flex-row items-center gap-2.5">
        <TouchableOpacity onPress={onBack} className="p-2">
          <Ionicons name="chevron-back" size={20} color="#000" />
        </TouchableOpacity>
        <View className="rounded-full border">
          <Image
            source={imageUrl ? {uri: imageUrl} : require('@/assets/images/norm/person.png')}
            className="w-[30px] h-[30px] rounded-[17px]"
          />
        </View>
        <CustomText className="text-[16px] text-black">{name}</CustomText>
      </View>

      <View className="flex-row items-center gap-4">
        <TouchableOpacity style={isMicEnabled?{}:{opacity:0.2}} disabled={!isMicEnabled} onPress={onMicPress} className="p-1">
          <MaterialIcons name="keyboard-voice" size={25} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={isSearchEnabled?{}:{display:'none'}} disabled={!isSearchEnabled} onPress={onSearchPress} className="p-1">
          <Ionicons name="search" size={25} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  )
};

