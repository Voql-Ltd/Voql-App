import { ChatGroups, ChatNav, CustomText, DataFetchContainer, MainChats } from '@/components';
import { PAGE_ROUTES } from '@/config';
import API_ROUTES from '@/config/apiRoutes';
import { useHttpServices } from '@/hooks';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatsScreen() {
  const {getProtectedData}= useHttpServices()
  const router = useRouter()
  const getRecentConvos=async()=>{
    return await getProtectedData({path:API_ROUTES.GET_CONVERSATIONS})
  }
  const { data: convo_data, isLoading, isError, error } = useQuery({
    queryKey: ['conversations'],
    queryFn: getRecentConvos
  });
  console.log({convo:convo_data})
  const {isChatsEmpty, headerHeights} = useMemo(()=>{ 
    const isChatsLen=!convo_data || convo_data?.data?.length === 0;
    const headerHeight = isChatsLen ? 200 : 140;
    return {isChatsEmpty: isChatsLen, headerHeights: headerHeight};
  },[convo_data])
  // !conversations || conversations.length === 0;
  const [searchQuery, setSearchQuery] = useState('');
  return(
    <SafeAreaView style={{height:headerHeights}} className='flex-1 bg-white mt-6 relative'>
      <ChatNav 
        onOpenOverflow={() => {}}
        onInviteFriends={() => router.push(PAGE_ROUTES.CONTACTS.ADD as any)}
        chatKeyword={searchQuery}
        setChatKeyword={setSearchQuery}
        isChatsEmpty={isChatsEmpty}
      />
      <View style={{paddingTop:headerHeights}} className="relative flex-1">
        <View>
          {!isChatsEmpty && <ChatGroups/>}
        </View>
        <DataFetchContainer
            isLoading={isLoading}
            isError={isError}
            isEmpty={isChatsEmpty}
            emptyComponent={
              <EmptyChats onInviteContacts={() => router.push(PAGE_ROUTES.CONTACTS.ADD as any)}/>
            }  
            errorMsg="Failed to load recent conversations"
        >
          <MainChats messages={[]} new_messages={[]} />
        </DataFetchContainer>
      </View>

    </SafeAreaView>
)}

function EmptyChats({onInviteContacts}: {onInviteContacts: () => void}) {
  
  return (
    <View className="items-center justify-center gap-y-4 px-10">
      <CustomText className='text-xl'>{"Your mic's waiting"}</CustomText>
      <CustomText className="text-center text-gray-500">
        {'Find friends and drop your first voice note, the conversation starts with you.'}
      </CustomText>
      <TouchableOpacity onPress={onInviteContacts} className='mt-5 bgblue-custom px-5 py-3 rounded-full'>
        <CustomText className='text-white text-base'>Add from Contacts</CustomText>
      </TouchableOpacity>
    </View>
  )
}

