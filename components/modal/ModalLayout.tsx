import { useEffect, useRef } from "react";
import { Animated, Pressable } from "react-native";

export default function ModalLayout({children, onClose}) {
  const slideAnim = useRef(new Animated.Value(400)).current
 
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0, 
      duration: 300, 
      useNativeDriver: true,
    }).start();
  }, []);

    return (
      <Pressable 
        onPress={onClose} className="px-0 flex-col justify-end"
        style={{ width:"100%", 
          position: 'absolute',
          bottom: 0,
          top:0,
          left: 0,
          right: 0,
          padding: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex:99}}>

        <Animated.View 
          onStartShouldSetResponder={(event) => true}
          onTouchEnd={(e) => {
            e.stopPropagation();
          }}
          style={{
            transform: [{ translateY: slideAnim }]
          }}
          className="w-full items-center flex flex-col px-2"
        >
          {children}
        </Animated.View>
      </Pressable>
    );
  }
  