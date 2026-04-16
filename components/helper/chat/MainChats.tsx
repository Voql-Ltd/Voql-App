import React from 'react';
import { FlatList } from 'react-native';
// import DataFetchContainer from '../DataFetchContainer';
import ChatPerson from './ChatPerson';

interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
}

export default function MainChats({ conversations}: { conversations: ChatItem[] | undefined}) {
  // Filter out undefined conversations and ensure required fields exist
  const validChats = (conversations || []).filter(chat => 
    chat && 
    chat.id && 
    chat.name && 
    chat.lastMessage !== undefined
  );

  return (
      <FlatList
        data={validChats}
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
      />
  );
}