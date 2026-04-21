import { useAuth } from '@/context';
import React from 'react';
import { FlatList, View } from 'react-native';
import MessageItem from './MessageItem';

export default function MainChats({ messages, new_messages}: { messages: any, new_messages: any}) {
  const { get_current_user } = useAuth();
  const current_user = get_current_user();
  return (
    <View className='flex-1 gap-y-10 flex-col'>
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => {
          const previousItem = index > 0 ? messages[index - 1] : null;
          const previousCreatedDate = previousItem?.createdDate;
          const sentByCurrentUser= item?.senderId?._id === current_user
          return (
            <MessageItem 
              message={item} 
              index={index}
              sentByCurrentUser={sentByCurrentUser}
              previousCreatedDate={previousCreatedDate}
            />
          );
        }}
        className="flex-1"
      />
    </View>
  );
}

{/* <FlatList
  data={messages}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <ChatPerson
      name={item.name || 'Unknown'}
      lastMessage={item.lastMessage || ''}
      time={item.time || ''}
      unreadCount={item.unreadCount}
    />
  )}
  className="flex-1"
/> */}