import { useRef } from "react";
import { TextInput, View } from "react-native";
import CustomText from "./CustomText";

interface OTPboxProps {
  length?: number;
  type?: 'text' | 'password';
  onChangeOTP: (otp: string) => void;
  value: string;
  label?: string;
}

export default function OTPbox({
  length = 6,
  type = 'text',
  onChangeOTP,
  value = '',
  label
}: OTPboxProps) {
  const inputsRef = useRef<TextInput[]>([]);

  const focusNext = (index: number) => {
    inputsRef.current[index + 1]?.focus();
  };

  const focusPrevious = (index: number) => {
    inputsRef.current[index - 1]?.focus();
  };
  return (
    <View className='gap-y-5'>
      {/* <></> */}
      <CustomText className="text-center text-[#6A6970]">
        {label}
      </CustomText>
      <View className="flex-row justify-between w-full">
        {Array.from({ length }).map((_, index) => ( 
          <View key={index} >
            <TextInput
              ref={(el: TextInput | null) => {
                if (el) {
                  inputsRef.current[index] = el;
                }
              }}
              keyboardType="numeric"
              maxLength={1}
              className="rounded-[20px] p-3 text-center text-[22px]"
              style={{
                width:length>5?44:60,
                borderColor: value[index]?'#004182':'#9CA3AF',
                borderWidth: 1,
                fontFamily: 'Inter',
                // fontWeight: '600',
              }}
              value={value[index] || ''}
              secureTextEntry={type==='password'}
              onChangeText={(text: string) => {
                const newOTP = value.split('');
                newOTP[index] = text;
                onChangeOTP(newOTP.join(''));
                if(text){
                  focusNext(index)
                }
                
              }}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
                  focusPrevious(index);
                }
              }}
            />
          </View>
        ))}
      </View>
    </View>
  );
}