import React, {Fragment, useContext, useEffect, useMemo, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {ConversationContext} from "@/context";
import { useHttpServices } from '@/hooks';
import { useQuery } from '@tanstack/react-query';
import API_ROUTES from '@/config/apiRoutes';
import { useLocalSearchParams } from "expo-router";
import { Image, TouchableOpacity, View } from "react-native";
import { ChatHeader, CustomText, DataFetchContainer, FixedHeight, MainChats, MicPlay } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { consolelog } from "@/config";
import { Text } from "react-native";
import { useAudioPlayer } from "expo-audio";

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
  user_id?: string;
}

export default function ConvoScreen(){
  const {room_id, roomData}= useLocalSearchParams()
  const {new_messages,audioGroups}=useContext(ConversationContext)
  const {getProtectedData}= useHttpServices()
  
  const getConversationData = async () => {
    const {room_type}= JSON.parse(roomData as string)
    const path = API_ROUTES.GET_CONVERSATION_BY_ROOMID(room_id as string, room_type as string)
    return await getProtectedData({path});
  };

  const { data: conversationData, error:convo_error } = useQuery({
    queryKey: ['conversation', room_id],
    queryFn: getConversationData,
    enabled: !!room_id
  });

  const getConversationMessagesData = async () => {
    const {room_type}= JSON.parse(roomData as string)
    const path = API_ROUTES.GET_MESSAGES(room_id as string)
    return await getProtectedData({path});
  };

  const { data: messagesData, isLoading:messagesLoading, isError, error } = useQuery({
    queryKey: ['messages', room_id],
    queryFn: getConversationMessagesData,
    enabled: !!conversationData?.data?._id
  });

  const {recipientInfo,parsedRoomData}=useMemo(():{recipientInfo: RecipientInfo | null, parsedRoomData: RoomData | null}=>{
    if(!roomData && !conversationData) return {recipientInfo:null,parsedRoomData:null}
    const parsedRoomData: RoomData = JSON.parse(roomData as string)

    let recipientInfo: RecipientInfo = {} as RecipientInfo
    if(!conversationData){
      return {recipientInfo:null, parsedRoomData}
    }
    if(parsedRoomData.room_type==='p2p'){
      // consolelog({members:conversationData?.data?.members, parsedRoomData})
      const friend= conversationData?.data?.members?.find(({_id}:{_id:string})=>_id===parsedRoomData.user_id)
      recipientInfo= {
        name:friend?.firstName + ' ' + friend?.lastName || '',
        _id:friend?._id || '',
        room_type:parsedRoomData.room_type,
        imageUrl:friend?.imageUrl,
        members:conversationData?.data?.members || [],
      }
    }
    else{
      recipientInfo= {
        name:conversationData?.data?.name || '', 
        _id:conversationData?.data?._id || '',
        room_type:parsedRoomData.room_type,
        members:conversationData?.data?.members || [],
        imageUrl:conversationData?.data?.imageUrl,
      }
    }
    return {
      recipientInfo,
      parsedRoomData
    }
  },[roomData, conversationData])
  // console.log({conv:conversationData, roomData:parsedRoomData, room_id, convo_error})
  return (
    <SafeAreaView>
      <FixedHeight 
        spaceBetween={60}
        fixedChildren={
          <View>
            <ChatHeader  
              recipientInfo={recipientInfo}
              roomData={parsedRoomData ?? {
                name: '',
                room_type: '',
                room_bio: '',
                room_image: undefined
              }}
              onMicPress={()=>null}
              onSearchPress={()=>null}
              isSearchEnabled={messagesData?.data?.length > 0}
              isMicEnabled={messagesData?.data?.length > 0}
            />
          </View>
        }
        afterChildren={
          <DataFetchContainer
            isLoading={!messagesData || messagesLoading}
            isEmpty={!messagesData?.data?.length}
            isError={isError}
            errorMsg={error?.message}
            emptyComponent={
              <View className="pb-8 h-full justify-between">
                <View/>
                <View className="items-center">
                  <View className="rounded-full mb-8">
                    <Image source={require('@/assets/images/emptychat.png')} className="w-40 h-40 rounded-full" />
                  </View>
                  <View className="w-[200px] items-center">
                    <CustomText className="text-base text-gray-500 text-center font-medium mb-1">
                      Every great conversation starts with a hello.
                    </CustomText>
                    <CustomText className="text-base text-gray-500 text-center font-medium mb-1">
                      Ready when you are.
                    </CustomText>
                  </View>
                </View>
                <View className=" justify-center items-center flex-col">
                  <CustomText className="mb-4 text-gray-500">Say Hello!</CustomText>
                  {/* <TouchableOpacity className="p-5 bgblue-custom rounded-full">
                    <Ionicons name="mic" size={35} color={'#FFFFFF'}/>
                  </TouchableOpacity> */}
                  <MicPlay/>

                    {Object.keys(audioGroups).length > 0 && 
                      <>
                        <Text>VNs to live listening</Text>
                        <View>
                          {Object.entries(audioGroups).map(([groupId, voiceInfo]: [string, any]) => (
                            <Fragment key={groupId}>
                              <PlayOne voiceInfo={voiceInfo[0]} groupId={groupId}/>
                            </Fragment> 
                          ))}
                        </View>
                      </>
                    }
                </View>
              </View>
            }
          >            
            <MainChats 
              messages={messagesData?.data}
              new_messages={new_messages}
            />
            <MicPlay/>
          </DataFetchContainer>
        }
      />
      
    </SafeAreaView>
  );
};




function PlayOne({voiceInfo, groupId}: {voiceInfo: any, groupId: string}) {
  // console.log('voiceInfo', voiceInfo);
  // const player = useAudioPlayer(voiceInfo.localUri);
  
  const playNewRecording=()=>{
    // play it
    // console.log('Playing audio from:', voice.localUri);
    // player.play();

  }
  const {switchToGroup}= useContext(ConversationContext);
  return (
    <TouchableOpacity className="bg-blue-300 p-2 px-4 rounded-full" onPress={()=>switchToGroup(groupId)}>
      <CustomText className="text-white text-base">Play</CustomText>
      <CustomText className="text-white text-base">from {voiceInfo.user_name}</CustomText>
      {/* <CustomText>{voiceInfo.room_id}</CustomText> */}
    </TouchableOpacity>
  );
}

