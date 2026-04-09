import { AudioModule, useAudioPlayer, useAudioRecorder } from "expo-audio";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, Pressable, StyleSheet, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from "react-native-reanimated";

import MicIcon from '@/assets/images/icons/mic.svg';
import PauseIcon from '@/assets/images/icons/pause.svg';
import PlayIcon from '@/assets/images/icons/play.svg';
import RefreshIcon from '@/assets/images/icons/refresh.svg';
import TickIcon from '@/assets/images/icons/tick.svg';

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function VoiceRecorder({onSave, value}:{onSave:(t:string)=>void, value?:string}) {
//   const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorder = useAudioRecorder({
    isMeteringEnabled: true,
    extension: ".m4a",
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    android: {
      extension: ".m4a",
      outputFormat: "mpeg4",
      audioEncoder: "aac",
    },
    ios: {
      extension: ".m4a",
      outputFormat: "aac ",
      audioQuality: 127, // MAX quality
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
    web: {
      mimeType: "audio/webm",
      bitsPerSecond: 128000,
    },
  });
  const [uri, setUri] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [time, setTime] = useState(0);
    const MIN_DURATION = 500; // ms
    const startRef = useRef(0);
  const player = useAudioPlayer(uri || undefined);

  const intervalRef = useRef<any>(null);

  // Slide to cancel animation
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Timer
  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    setTime(0);
  };

  // Start Recording
  const startRecording = async () => {
    if (recording) return;

    await AudioModule.requestRecordingPermissionsAsync();
    await recorder.prepareToRecordAsync();

    await recorder.record();
    setRecording(true);
    startRef.current = Date.now();
    // startTimer();
    };

  // Stop Recording
  const stopRecording = async () => {   
    if (!recording) return;
    const duration = Date.now() - startRef.current;
    try {
        await recorder.stop();
        if (duration < MIN_DURATION) {
            return Alert.alert('Record is too short')
        }
        setUri(recorder.uri || null);
    } catch (e) {
        console.log(e);
    }
    setRecording(false);
  };

  // Cancel Recording
  const cancelRecording = async () => {
    await recorder.stop();

    setRecording(false);
    setUri(null);
    stopTimer();
  };
  const [playing, setPlaying]= useState(false)
  // Playback
  const play = async () => {
    setPlaying(true)
    await player.play();
  };
    const pause = async () => {
    await player.pause();
    setPlaying(false)
  };
  const restart = () => {
    setPlaying(false)
    setRecording(false)
    setUri(null);
  };

  // Gesture logic (slide to cancel)
  const handleMove = (event: any) => {
    return
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };
  const [status, setStatus] = useState(recorder.getStatus());

  useEffect(() => {
   const id = setInterval(() => {
     setStatus(recorder.getStatus());
   }, 100);

   return () => clearInterval(id);
  }, []);
  
  return (
    <>
    <View style={styles.container} className="relative w-full">
      {/* Waveform */}
       {/* <Waveform idle={!recording}/> */}
      {!uri ? <Waveform metering={status.metering} recording={recording}/>:null}
      {/* {recording && <Text style={styles.timer}>{formatTime(time)}</Text>} */}

      {/* Record Button */}
      {!uri && (
        <Pressable
          onPressIn={recording?()=>stopRecording():()=>startRecording()}
        //   onPressOut={stopRecording}
        //   onTouchMove={handleMove}
          style={styles.recordBtn}
          className={!recording?" bgblue-custom ":' bg-[#99D1FF] '}
        >
            <View>
                {!recording?<MicIcon />:
                    <View className="w-[20px] h-[20px] bgblue-custom rounded-lg"/>
                }
            </View>
        </Pressable>
      )}
      {/* <CustomText style={recording?{visibility:'hidden', fontFamily:'Inter'}:{fontFamily:'Inter'}} className='text-center text-lg mt-6'>{formatTime(time)}</CustomText> */}

      {/* Playback */}
      {uri && (
        <View style={styles.controls}>
          <Pressable className="rounded-full items-center justify-center" onPress={playing?()=>pause():()=>play()}>
            <View className="bg-[#FFC107] rounded-full p-3 items-center justify-center">
              {playing?<PauseIcon />:<PlayIcon  />}
            </View>
          </Pressable>
          <Pressable className="rounded-full items-center justify-center"  onPress={restart}>
            <View className="bg-[#1194FF] rounded-full p-3 items-center justify-center">
              <RefreshIcon />
            </View>
          </Pressable>
          <Pressable className="rounded-full items-center justify-center"  onPress={()=>null}>
            <View className="bg-green-500 rounded-full p-3 items-center justify-center">
              <TickIcon/>
            </View>
          </Pressable>
        </View>
      )}

      {/* Slide indicator */}
      {/* {recording && (
        <Animated.View style={[styles.slideText, animatedStyle]}>
          <Text>⬅ Slide to cancel</Text>
        </Animated.View>
      )} */}
    
    </View>
    {/* <View className='px-5 mt-6'>
    <TouchableOpacity
        onPress={()=>{
        

        }}
        className="mt-8 bgblue-custom w-full py-4 rounded-lg"
        disabled={recording}
    >
        <CustomText className="text-white text-center text-lg">Continue</CustomText>
    </TouchableOpacity>
    </View> */}
    </>
  );
}

function Waveform({ metering = -160, recording }: any) {
  const bars = Array.from({ length: 100 });

  const normalized = Math.max(0, (metering + 160) / 160); // 0 → 1

  return (
    <View style={styles.wave}>
      {/* <View className=""> */}
        {bars.map((_, i) => {
            const height = 10 + normalized * 40 * Math.random();

            return (
            <View
                key={i}
                style={{
                height,
                width:3,
                marginHorizontal: 1,
                backgroundColor: recording ? "#1194FF" : "#E0E0E1",
                }}
            />
            );
        })}
      {/* </View> */}
    </View>
  );
}

function AnimatedBar({ height, idle }: { height: number, idle:boolean }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withTiming(Math.random() * 2, { duration: 300 });
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scaleY: scale.value }],
  }));

  return <Animated.View style={[styles.bar, { height, ...(idle?{backgroundColor:'#E0E0E1'}:{backgroundColor:'#1194FF'}) }, style]} />;
}


const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    // flex: 1,
    position:'relative'
  },
  recordBtn: {
    // backgroundColor: "red",
    // padding: 20,
    width:80,
    height:80,
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 50,
  },
//   timer: {
//     marginVertical: 10,
//     fontSize: 18,
//   },
  controls: {
    flexDirection: "row",
    justifyContent:'space-between',
    alignItems:'center',
    width:'100%',
    paddingHorizontal:30
  },
  slideText: {
    position: "absolute",
    bottom: 100,
  },
  wave: {
    flexDirection: "row",
    alignItems: "center",
    height:'100%',
    marginBottom: 10,
    position:'absolute',
    top:0,
    right:0,left:0,
    width:'100%'
  },
  bar: {
    width: 3,
    marginHorizontal: 1
    
  },
});