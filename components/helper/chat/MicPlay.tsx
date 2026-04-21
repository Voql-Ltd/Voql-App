import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef, useCallback, useEffect, useContext } from "react";
import {
  useAudioRecorder,
} from "@siteed/audio-studio";
import { AudioModule } from 'expo-audio';
import { useSingleFile } from "@/hooks";
import { consolelog } from "@/config";
import { ConversationContext, useAuth } from "@/context";

// Configurable timing variables
const CHUNK_INTERVAL_MS = 3 * 1000; // 3 seconds
const CHUNK_DELAY_MS = 100; // 100ms delay for voice processing

interface AudioChunk {
  data: any;
  audioDetails: {
    sampleRate: number;
    channels: number;
    encoding: string;
  };
  text:string,
  timestamp: number;
  duration: number;
  uploaded?: boolean;
  transcription?: string;
}

// Voice transcription function - currently not available
const voiceTranscription = async (chunk: AudioChunk) => {
  console.log('Voice transcription not available');
  return null;
};

// Handle transcription for complete recording - currently not available
const handleFullRecordingTranscription = async (recording: any) => {
  console.log('Voice transcription not available');
  return null;
};

// const cloudinaryUpload = async (chunk: AudioChunk, chunkIndex: number) => {
//   const formData = new FormData();
//   formData.append('file', chunk.data);
//   formData.append('upload_preset', 'your_upload_preset');
//   formData.append('cloud_name', 'your_cloud_name');

//   try {
//     const response = await axios.post('https://api.cloudinary.com/v1_1/your_cloud_name/upload', formData);
//     console.log(`Chunk ${chunkIndex + 1} uploaded to Cloudinary:`, response.data);
    
//     // Update chunk status to uploaded
//     chunk.uploaded = true;
//     return response.data;
//   } catch (error) {
//     console.error(`Error uploading chunk ${chunkIndex + 1} to Cloudinary:`, error);
//     return null;
//   }
// };

export default function MicPlay() {
  const [recording, setRecording] = useState(false);
  const [audioRecording, setAudioRecording] = useState<any>(null);
  const [audioChunks, setAudioChunks] = useState<AudioChunk[]>([]);
  const chunkTimerRef = useRef<any>(null);
  const lastChunkTimeRef = useRef<number>(0);
  const currentChunkDataRef = useRef<any[]>([]);
  const {uploadVoice}= useSingleFile({})
  const {sendAudioChunk} = useContext(ConversationContext)
  const {get_current_user}= useAuth()
  const {
    startRecording,
    stopRecording,
    isRecording,
    isPaused,
    durationMs,
    size,
  } = useAudioRecorder();
  // Extract file extension from URI or filename
  const getFileExtension = (uri: string): string => {
    const lastDot = uri.lastIndexOf('.');
    const lastSlash = uri.lastIndexOf('/');
    const filename = lastSlash > lastDot ? '' : uri.substring(lastDot);
    console.log(filename)
    return filename || '.wav'; // default to .wav if no extension found
  };
  // Handle real-time audio data streaming
  const handleAudioStream = useCallback(async (audioData: any) => {
    // Collect audio data for current chunk
    currentChunkDataRef.current.push(audioData);
    console.log('Collecting audio data for 3-second chunk');
  }, []);

  // Setup chunk timer for configurable intervals
  const setupChunkTimer = useCallback(() => {
    if (chunkTimerRef.current) {
      clearInterval(chunkTimerRef.current);
    }
    
    chunkTimerRef.current = setInterval(async () => {
      let chunks_length=currentChunkDataRef.current.length
      if (chunks_length > 0) {
        // data: [...currentChunkDataRef.current],
        const latest_chunk= currentChunkDataRef.current[chunks_length-1]
        // consolelog({latest_chunk})
        const chunk: AudioChunk = {
          data:latest_chunk,
          audioDetails,
          timestamp: Date.now(),
          text:'',
          duration: CHUNK_INTERVAL_MS, // Use configurable variable
        };
        
        // Get user ID (assuming get_current_user returns a string ID)
        const userId = await get_current_user() || 'user123';
        const userName = 'Test User'; // TODO: Get actual user name
        // const { voiceUrl, error } = await uploadVoice(latest_chunk, audioChunks.length);
        // if(voiceUrl) {
        //   consolelog(typeof voiceUrl)
        //   // consolelog({voiceUrl})
        // }
        // return
        // Send chunk via socket
        sendAudioChunk({
          chunk, 
          channel_info: {
            room_id: 'test-room',
            user_id: userId,
            user_name: userName
          }
        });
        
        setAudioChunks((prev: AudioChunk[]) => {
            const newLength = prev.length + 1;
            console.log('3-second audio chunk sent:', {
              chunkNumber: newLength,
              duration: chunk.duration,
              dataSize: chunk.data.length,
              timestamp: new Date(chunk.timestamp).toISOString()
            });
          
          return [...prev, chunk];
        });
        
        currentChunkDataRef.current = [];
        lastChunkTimeRef.current = Date.now();
      }
    }, CHUNK_INTERVAL_MS); // Use configurable variable
  }, [uploadVoice]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (chunkTimerRef.current) {
        clearInterval(chunkTimerRef.current);
      }
    };
  }, []);

  // Setup audio recording permissions
  const setupAudioPermissions = async () => {
    try {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        console.error('Microphone permission denied');
        return false;
      }
      
      await AudioModule.setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
      return true;
    } catch (error) {
      console.error('Failed to setup audio permissions:', error);
      return false;
    }
  };
const audioDetails={
        sampleRate: 44100 as any,
        channels: 1 as any,
        encoding: 'pcm_16bit' as any
      }
  const handleStartRecording = async () => {
    try {
      // Setup permissions first
      const hasPermissions = await setupAudioPermissions();
      if (!hasPermissions) {
        console.error('Cannot start recording without permissions');
        return;
      }
      
      // Reset chunk state
      currentChunkDataRef.current = [];
      lastChunkTimeRef.current = Date.now();
      setAudioChunks([]);
      console.log('done here')
      setRecording(true);
      const result = await startRecording({
        ...audioDetails,
        onAudioStream: handleAudioStream,
      });
      

      setupChunkTimer();
      console.log('Recording started:', result);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const handleStopRecording = async () => {
    try {
      const recording = await stopRecording();
       if (chunkTimerRef.current) {
        clearInterval(chunkTimerRef.current);
        chunkTimerRef.current = null;
      }
      setRecording(false);

      return
      // Release any remaining data as final chunk
      if (currentChunkDataRef.current.length > 0) {
        const finalChunk: AudioChunk = {
          data: [...currentChunkDataRef.current],
          timestamp: Date.now(),
          duration: Date.now() - lastChunkTimeRef.current,
        };
        
        setAudioChunks((prev: AudioChunk[]) => [...prev, finalChunk]);
        console.log('Final audio chunk released:', {
          chunkNumber: audioChunks.length + 1,
          duration: finalChunk.duration,
          dataSize: finalChunk.data.length,
          timestamp: new Date(finalChunk.timestamp).toISOString()
        });
        
        // Upload final chunk to Cloudinary
        const { voiceUrl, error } = await uploadVoice(finalChunk, audioChunks.length);
        if (error) {
          consolelog({error})
          throw error
        }
        consolelog({finish_voiceUrl:voiceUrl})
      }
      
      setAudioRecording(recording);
      setRecording(false);
      
      // Clear timer
      if (chunkTimerRef.current) {
        clearInterval(chunkTimerRef.current);
        chunkTimerRef.current = null;
      }
      
      
      // Handle transcription for full recording
      await handleFullRecordingTranscription(recording);
      
      console.log('Recording saved:', recording);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };
  
  const handleSendRecording = async () => {
    // First, handle any remaining unchunked audio data
    return
    if (currentChunkDataRef.current.length > 0) {
      const finalChunk: AudioChunk = {
        data: [...currentChunkDataRef.current],
        timestamp: Date.now(),
        duration: Date.now() - lastChunkTimeRef.current,
      };
      
      console.log('Processing remaining unchunked audio data:', {
        dataSize: finalChunk.data.length,
        duration: finalChunk.duration,
        timestamp: new Date(finalChunk.timestamp).toISOString()
      });
      
      // Upload the final chunk
      const { voiceUrl, error } = await uploadVoice(finalChunk, audioChunks.length);
      if (error) {
        consolelog({ error });
        throw error;
      }
      consolelog({ final_voiceUrl: voiceUrl });
      
      // Add to chunks
      setAudioChunks(prev => [...prev, finalChunk]);
      
      // Clear the remaining data
      currentChunkDataRef.current = [];
    }
    
    // Handle transcription for full recording only
    if (audioRecording) {
      console.log('Sending final audio recording:', audioRecording);
      
      // Get transcription for the full recording
      const fullTranscription = await handleFullRecordingTranscription(audioRecording);
      
      if (fullTranscription) {
        console.log('Full recording transcription:', fullTranscription);
        // Implement your send logic here with full transcription
      }
    }
    
    setRecording(false);
  };
  
  return (
    <View style={recording?{justifyContent:'space-between'}:{justifyContent:'center'}} className=" items-center w-full px-4">
    
      {recording || isRecording?
      <>
        <TouchableOpacity onPress={handleStopRecording} className="p-5 bgblue-custom rounded-full">
          <Ionicons name="pause" size={35} color={'#FFFFFF'}/>
        </TouchableOpacity>
        <View>
          {/* Recording duration display */}
          <Text className="text-white">{Math.floor(durationMs / 1000)}s</Text>
          <Text className="text-white text-xs">{audioChunks.length} chunks</Text>
        </View>
        <TouchableOpacity onPress={handleSendRecording} className="p-5 bgblue-custom rounded-full">
          <Ionicons name="send" size={35} color={'#FFFFFF'}/>
        </TouchableOpacity>
      </>
      :
      <>
        <TouchableOpacity onPress={handleStartRecording} className="p-5 bgblue-custom rounded-full">
          <Ionicons name="mic" size={35} color={'#FFFFFF'}/>
        </TouchableOpacity>
      </>
      }
    </View>
  );
}