import { Pressable, TouchableOpacity, View } from "react-native";
import CustomText from "../CustomText";
import { getDayMonth, isSameDay, isWithinTwoDays, getTime, getRelativeTime } from "@/config";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import VoiceWave from "./VoiceWave";

export default function MessageItem({ message, index, previousCreatedDate, sentByCurrentUser }: { message: any, index: number, previousCreatedDate?: string, sentByCurrentUser: boolean }) {
    if (sentByCurrentUser) {
        return <YourMessage message={message} index={index} 
            previousCreatedDate={previousCreatedDate} />;
    }
    return (
        <GuestMessage message={message} index={index} previousCreatedDate={previousCreatedDate} />
    );
}

function YourMessage({ message, index, previousCreatedDate }: { message: any, index: number, previousCreatedDate?: string }) {
    const [playSound, setPlaySound] = useState(false);
    return (
       <View className="">
            <RunDateCheck previousCreatedDate={previousCreatedDate} createdDate={message.createdDate} />
            <View className="flex-row justify-end">
                <View className="w-[300px]">
                    <View className="w-fit bgblue-custom rounded-[24px] p-4 rounded-tl-[5px]">
                        <View className="flex items-center justify-between">
                            <View>
                                <Pressable onPress={() => setPlaySound(!playSound)}>
                                    <Ionicons name={playSound?"play":"pause"} size={16} color="white" />
                                </Pressable>
                                <View>
                                    <View>
                                        <CustomText>||||</CustomText>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity>
                                <CustomText className="text-white bg-[#1184FF] rounded-full px-2 py-1">1x</CustomText>
                            </TouchableOpacity>
                            <CustomText className="text-white">{'0.55'}</CustomText>
                        </View>
                        <View>
                            <CustomText>{message.content}</CustomText>
                        </View>
                    </View>
                    <CustomText>{getTime(message.createdDate)}</CustomText>
                </View>
            </View>
        </View>
    );
}

function GuestMessage({ message, index, previousCreatedDate }: { message: any, index: number, previousCreatedDate?: string }) {
    return (
        <View>
            <View>
                <View>

                </View>

            </View>
            <View>
                <CustomText>Message Item</CustomText>
            </View>
        </View>
    );
}

function RunDateCheck({ previousCreatedDate, createdDate }: { previousCreatedDate?: string, createdDate: string }) {
    return (
        <>
            {(previousCreatedDate && !isSameDay({ date1: previousCreatedDate, date2: createdDate })) ?
            <View className="mb-3">
                <CustomText>
                    {getRelativeTime({date:createdDate})}
                </CustomText>
            </View>
            : null}
        </>
    );
}