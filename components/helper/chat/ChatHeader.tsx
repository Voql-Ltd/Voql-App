import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import React from "react";
import {Image, Text, TouchableOpacity, View} from "react-native";

/**
 *
 */
interface ChatHeaderProps {
  name: string;
  avatarUrl: string;
  onBack?: () => void;
  onMicPress?: () => void;
  onSearchPress?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  name,
  avatarUrl,
  onBack,
  onMicPress,
  onSearchPress,
}) => (
  <View className="flex-row items-center justify-between px-4 pt-2.5 pb-1.5 border-b border-gray-200 bg-white">
    <View className="flex-row items-center gap-2.5">
      <TouchableOpacity onPress={onBack}>
        <Ionicons name="chevron-back" size={26} color="#000" />
      </TouchableOpacity>

      <Image
        source={{uri: avatarUrl}}
        className="w-[34px] h-[34px] rounded-[17px]"
      />

      <Text className="text-[17px] font-semibold text-black">{name}</Text>
    </View>

    <View className="flex-row items-center gap-4">
      <TouchableOpacity onPress={onMicPress} className="p-1">
        <MaterialIcons name="keyboard-voice" size={22} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity onPress={onSearchPress} className="p-1">
        <Ionicons name="search" size={22} color="#000" />
      </TouchableOpacity>
    </View>
  </View>
);

export default ChatHeader;
