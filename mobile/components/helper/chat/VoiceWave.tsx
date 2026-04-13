import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

const bars: number[] = [6, 10, 14, 18, 24, 18, 14, 10, 6];

export default function VoiceWave() {
  const animations = useRef<Animated.Value[]>(
    bars.map(() => new Animated.Value(1))
  ).current;

  useEffect(() => {
    const loops = animations.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1.6,
            duration: 300,
            delay: i * 100,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.6,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      )
    );

    Animated.stagger(100, loops).start();
  }, [animations]);

  return (
    <View style={styles.container}>
      {bars.map((h, i) => (
        <Animated.View
          key={i}
          style={[
            styles.bar,
            {
              height: h,
              transform: [{ scaleY: animations[i] }],
            },
          ]}
        />
      ))}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  bar: {
    width: 4,
    backgroundColor: "#00BCD4",
    borderRadius: 2,
  },
});