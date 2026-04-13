import { Image, Text, View } from "react-native";
import CustomText from "../CustomText";

interface ChatPersonProps {
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
}

export default function ChatPerson({ name, lastMessage, time, unreadCount }: ChatPersonProps) {
    // return null
return (
    <View className="flex-row items-center p-4 border-b border-gray-100">
        <View className="mr-3">
            <Image source={{ uri: 'https://via.placeholder.com/50' }} style={{ width: 50, height: 50 }} className="rounded-full" />
        </View>
        <View className="flex-1">
            <CustomText numberOfLines={1} className="text-base font-semibold text-gray-800">{name}</CustomText>
            <View className="flex-row items-center justify-between mt-1">
                <CustomText numberOfLines={1} className="text-sm text-gray-500 flex-1">{lastMessage}</CustomText>
                <View className="flex-row items-center">
                    <CustomText numberOfLines={1} className="text-xs text-gray-400 mr-2">{time}</CustomText>
                    {!!unreadCount && (
                        <View className="bg-red-500 rounded-full min-w-5 h-5 justify-center items-center px-1">
                            <CustomText className="text-white text-xs font-bold">{unreadCount}</CustomText>
                        </View>
                    )}
                </View>
            </View>
        </View>
    </View>
  );
}