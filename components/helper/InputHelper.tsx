import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import CustomText from './CustomText';

interface InputHelperProps {
  setIsScrollOffset?: (value: boolean) => void;
  label?: string;
  showLabel?: boolean;
  textClassName?: string;
  scrollOfset?: boolean;
  className?: string;
  type?: 'text' | 'email' | 'number' | 'password';
  isLast?: boolean;
  onChangeValue?: (text: string) => void;
  value?: string;
  hasError?: boolean;
  errorMessage?:string;
  validLength?: number;
  [key: string]: any;
}

export default function InputHelper({
  setIsScrollOffset = () => null,
  label,
  showLabel,
  textClassName = '',
  scrollOfset = false,
  className = '',
  type = 'text',
  isLast,
  onChangeValue,
  value = '',
  hasError,
  validLength,
  errorMessage,
  ...rest
}: InputHelperProps) {
  const [showPassword, setShowPassword] = useState(false);

  const labelStyle = {
    position: "absolute" as const,
    fontFamily: 'Jakarta',
    left: 17,
  };
  const keyboardType = type === 'email' ? 'email-address' : type === 'number' ? 'numeric' : 'default';
  
  return (
    <View className="w-full">
      {showLabel ? 
      <CustomText className="text-lg mb-2">{label || ''}</CustomText> : null}
      <View  
        style={
          showLabel
            ? { paddingHorizontal: 8, paddingVertical:6,
               borderColor: rest.isFocused
                  ? "#004182"
                  : hasError
                  ? '#DC2626'
                  // : value?.length >= (validLength || 0)
                  // ? '#004182'
                  : "#9CA3AF",
                borderWidth: 1,
             }
            : {
                borderColor: rest.isFocused
                  ? "#004182"
                  : hasError
                  ? '#DC2626'
                  // : value?.length >= (validLength || 0)
                  // ? '#004182'
                  : "#9CA3AF",
                borderWidth: 1,
              }
        }  
        className={"relative w-full flex-row items-center justify-between rounded-[20px] "}>
        
        <TextInput
          value={value} 
          onFocus={() => {
            if (isLast && setIsScrollOffset) {
              setIsScrollOffset(true);
            }
            rest.setFocused(rest.fieldName);
          }}
          onBlur={() => {
            if (isLast && setIsScrollOffset) {
              setIsScrollOffset(false);
            }
            rest.setFocused('');
          }}
          style={{fontFamily:'Inter'}}
          onChangeText={(t: string) => onChangeValue && onChangeValue(t)}
          // placeholder={label}
          className={'text-base text-black flex-1 px-3 py-2 '}
          secureTextEntry={type==='password' && !showPassword}
          keyboardType={keyboardType}
          placeholder={label}
          autoCapitalize={type === 'email' ? 'none' : 'sentences'}
          // placeholderTextColor="#"
          
          {...rest}
        />
      
        {type==='password'? (
          <TouchableOpacity

            className='min-w-fit p-2 pr-4'
            onPress={() => setShowPassword(s => !s)}
            // style={styles.eyeButton}
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          >
            <Ionicons className='min-w-fit' name={showPassword ? 'eye-off' : 'eye'} size={20} color="#000000" />
          </TouchableOpacity>
        ):null}
      </View>
      {errorMessage?
      <View>
        <CustomText className="text-[13px] mt-1">{label || ''}</CustomText>
      </View>:null}

    </View>
  );
}