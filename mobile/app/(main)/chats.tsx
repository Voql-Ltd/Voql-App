import { CustomText } from '@/components';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
}

export default function ChatsScreen() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  
  const chats: Chat[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      lastMessage: 'Hey! How are you doing?',
      timestamp: '2:30 PM',
      unreadCount: 2
    },
    {
      id: '2',
      name: 'Bob Smith',
      lastMessage: 'See you tomorrow!',
      timestamp: '1:15 PM',
    },
    {
      id: '3',
      name: 'Carol Davis',
      lastMessage: 'Thanks for your help!',
      timestamp: 'Yesterday',
      unreadCount: 1
    },
    {
      id: '4',
      name: 'David Wilson',
      lastMessage: 'Can you send me the files?',
      timestamp: 'Yesterday',
    }
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hey! How are you doing?',
      sender: 'other',
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: '2',
      text: 'I\'m doing great! Just working on some projects. How about you?',
      sender: 'user',
      timestamp: new Date(Date.now() - 3000000)
    },
    {
      id: '3',
      text: 'Same here! Been busy with work lately.',
      sender: 'other',
      timestamp: new Date(Date.now() - 2400000)
    },
    {
      id: '4',
      text: 'Tell me about it! What are you working on?',
      sender: 'user',
      timestamp: new Date(Date.now() - 1800000)
    }
  ]);

  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => setSelectedChat(item.id)}
    >
      <View style={styles.avatar}>
        <CustomText style={styles.avatarText}>
          {item.name.charAt(0).toUpperCase()}
        </CustomText>
      </View>
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <CustomText style={styles.chatName}>{item.name}</CustomText>
          <CustomText style={styles.timestamp}>{item.timestamp}</CustomText>
        </View>
        <CustomText style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </CustomText>
      </View>
      {item.unreadCount && (
        <View style={styles.unreadBadge}>
          <CustomText style={styles.unreadText}>{item.unreadCount}</CustomText>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userMessage : styles.otherMessage
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.sender === 'user' ? styles.userBubble : styles.otherBubble
        ]}
      >
        <CustomText
          style={[
            styles.messageText,
            item.sender === 'user' ? styles.userText : styles.otherText
          ]}
        >
          {item.text}
        </CustomText>
      </View>
      <CustomText style={styles.messageTime}>
        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </CustomText>
    </View>
  );

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: 'user',
        timestamp: new Date()
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  if (selectedChat) {
    const selectedChatData = chats.find(chat => chat.id === selectedChat);
    
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.individualChatHeader}>
          <TouchableOpacity onPress={() => setSelectedChat(null)}>
            <CustomText style={styles.backButton}>Back</CustomText>
          </TouchableOpacity>
          <CustomText style={styles.chatTitle}>{selectedChatData?.name}</CustomText>
          <View style={styles.headerSpacer} />
        </View>
        
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
        />
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            multiline
            maxLength={500}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <CustomText style={styles.sendButtonText}>Send</CustomText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <CustomText style={styles.title}>Chats</CustomText>
      </View>
      
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        style={styles.chatsList}
        contentContainerStyle={styles.chatsContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  chatsList: {
    flex: 1,
  },
  chatsContainer: {
    padding: 10,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  individualChatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 50,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 15,
  },
  messageContainer: {
    marginBottom: 15,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#007AFF',
  },
  otherBubble: {
    backgroundColor: '#e9e9eb',
  },
  messageText: {
    fontSize: 16,
  },
  userText: {
    color: '#fff',
  },
  otherText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 11,
    color: '#999',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});