import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import CustomText from "./CustomText";

interface TimerProps {
  pathType?: string;
  pre_body?: string;
  initialTime?: number;
  onResend?: () => void;
}

export default function Timer({ pathType, pre_body, initialTime = 60, onResend }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);
  return (
    <CustomText className={'flex-row items-center text-sm mt-4'}>
      Didn't receive the code? 
      <TouchableOpacity 
        className='flex-row items-center' 
        onPress={onResend}
        disabled={timeLeft > 0}
      >
        <CustomText 
          className={`underline mlog-blue ${timeLeft > 0 ? 'opacity-50' : ''}`} 
          font_fam="semibold"
        >
          Resend Code
        </CustomText>
      </TouchableOpacity>
      {timeLeft ? ` in ${timeLeft} secs` : ''}
    </CustomText>
  );
}