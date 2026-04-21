import { baseURL, consolelog } from "@/config";
import { createContext, useState, useEffect, useContext } from "react";
import { io, Socket } from "socket.io-client";
import { useAudioQueue } from "@/hooks";

interface ExtendedSocket extends Socket {
  to(room: string): any;
}

export interface ConversationContextProps {
  new_conversations: any[];
  setNewConversations: (new_conversations: any[]) => void;
  new_messages: any[];
  setNewMessages: (new_messages: any[]) => void;
  conversations: any[];
  setConversations: (conversations: any[]) => void;
  messages: any[];
  setMessages: (messages: any[]) => void;
  socket: ExtendedSocket | null;
  setSocket: (socket: ExtendedSocket | null) => void;
  sendAudioChunk: ({chunk, channel_info}:{chunk: any, channel_info: any}) => void;
  isPlaying: boolean;
  currentTrack: any;
  queue: any[];
  audioGroups: {[key: string]: any[]};
  currentGroup: string | null;
  playbackPositions: {[key: string]: number};
  playPause: () => Promise<void>;
  switchToGroup: (groupId: string) => Promise<void>;
  skipToNext: () => Promise<void>;
  skipToPrevious: () => Promise<void>;
  clearQueue: () => Promise<void>;
}

export const ConversationContext = createContext<any | null>(null);

interface UseConversationContextComponentProps {
  children: React.ReactNode;
}

export default function ConversationContextComponent({
  children,
}: UseConversationContextComponentProps) {
  const [new_conversations, setNewConversations] = useState<any[]>([]);
  const [new_messages, setNewMessages] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [socket, setSocket] = useState<ExtendedSocket | null>(null);
  const audioQueueFuncs= useAudioQueue()

  // 2. setup socket
  useEffect(() => {
    const domain = baseURL.split('/api/v1')[0];
    const newSocket = io(domain);
    setSocket(newSocket as any);

    newSocket.on('connect', () => console.log('Connected to server'));
    newSocket.on('disconnect', () => console.log('Disconnected from server'));

    newSocket.on('new_chunk', async (data) => {
      console.log('New chunk received on frontend:', data);

      const groupId = `${data.channel_info?.room_id || 'default'}_${data.channel_info?.user_id || 'unknown'}`;
      const url = `${domain}/chunk/${data.filename}`;

      try {
        // stream directly from URL - no download needed
        await audioQueueFuncs.addToQueue({
          filename: data.filename,
          url,
          groupId,
          user_name: data.channel_info?.user_name,
          room_id: data.channel_info?.room_id,
          timestamp: Date.now(),
        });

        // setAudioGroups(prev => ({
        //   ...prev,
        //   [groupId]: [...(prev[groupId] || []), {
        //     filename: data.filename,
        //     url,
        //     groupId,
        //     user_name: data.channel_info?.user_name,
        //     room_id: data.channel_info?.room_id,
        //     timestamp: Date.now()
        //   }]
        // }));

      } catch (error) {
        console.error('Error adding track to queue:', error);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);


  const sendAudioChunk = ({ chunk, channel_info }: { chunk: any, channel_info: any }) => {
    consolelog('emit audio chunk on frontend');
    socket?.emit('audio_chunk', { chunk, channel_info });
  };

  return (
    <ConversationContext.Provider
      value={{
        ...audioQueueFuncs,
        new_conversations,
        setNewConversations,
        new_messages,
        setNewMessages,
        conversations,
        setConversations,
        messages,
        setMessages,
        socket,
        setSocket,
        sendAudioChunk
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}