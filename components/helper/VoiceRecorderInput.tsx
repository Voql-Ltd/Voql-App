import { AudioModule, RecordingPresets, useAudioPlayer, useAudioRecorder } from "expo-audio";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function VoiceRecorder({onSave, value}:{onSave:(t:string)=>void, value?:string}) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [uri, setUri] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [time, setTime] = useState(0);

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
    await AudioModule.requestRecordingPermissionsAsync();
    await recorder.prepareToRecordAsync();
    recorder.record();

    setRecording(true);
    startTimer();
  };

  // Stop Recording
  const stopRecording = async () => {
    await recorder.stop();

    setUri(recorder.uri || null);
    setRecording(false);
    stopTimer();
  };

  // Cancel Recording
  const cancelRecording = async () => {
    await recorder.stop();

    setRecording(false);
    setUri(null);
    stopTimer();
  };

  // Playback
  const play = async () => {
    player.play();
  };

  const restart = () => {
    setUri(null);
  };

  // Gesture logic (slide to cancel)
  const handleMove = (event: any) => {
    const x = event.nativeEvent.pageX;
    translateX.value = x - SCREEN_WIDTH / 2;

    if (x < SCREEN_WIDTH * 0.3) {
      runOnJS(cancelRecording)();
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <View style={styles.container}>
      {/* Waveform */}
      {recording && <Waveform />}

      {/* Timer */}
      {recording && <Text style={styles.timer}>{formatTime(time)}</Text>}

      {/* Record Button */}
      {!uri && (
        <Pressable
          onPressIn={startRecording}
          onPressOut={stopRecording}
          onTouchMove={handleMove}
          style={styles.recordBtn}
        >
          <Text style={{ color: "#fff" }}>🎤</Text>
        </Pressable>
      )}

      {/* Playback */}
      {uri && (
        <View style={styles.controls}>
          <Pressable onPress={play}>
            <Text>▶️ Play</Text>
          </Pressable>

          <Pressable onPress={restart}>
            <Text>🔁 Restart</Text>
          </Pressable>
        </View>
      )}

      {/* Slide indicator */}
      {recording && (
        <Animated.View style={[styles.slideText, animatedStyle]}>
          <Text>⬅ Slide to cancel</Text>
        </Animated.View>
      )}
    </View>
  );
}

function Waveform() {
  const bars = Array.from({ length: 30 });
  const heights = useRef(bars.map(() => Math.random() * 40 + 10)).current;

  return (
    <View style={styles.wave}>
      {heights.map((h, i) => (
        <AnimatedBar key={i} height={h} />
      ))}
    </View>
  );
}

function AnimatedBar({ height }: { height: number }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withTiming(Math.random() * 2, { duration: 300 });
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scaleY: scale.value }],
  }));

  return <Animated.View style={[styles.bar, { height }, style]} />;
}


const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  recordBtn: {
    backgroundColor: "red",
    padding: 20,
    borderRadius: 50,
  },
  timer: {
    marginVertical: 10,
    fontSize: 18,
  },
  controls: {
    flexDirection: "row",
    gap: 20,
  },
  slideText: {
    position: "absolute",
    bottom: 100,
  },
  wave: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  bar: {
    width: 3,
    backgroundColor: "black",
    marginHorizontal: 1,
  },
});