import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import CustomText from './CustomText';

interface CheckboxHelperProps {
  label?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  color?: string;
  size?: number;
  labelStyle?: any;
  containerStyle?: any;
}

export default function CheckboxHelper({
  label,
  checked,
  onChange,
  color = '#0D6EFD',
  size = 22,
  labelStyle,
  containerStyle,
}: CheckboxHelperProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className=''
      style={[styles.container, containerStyle]}
      onPress={() => onChange(!checked)}
    >
      <View
        className='rounded-lg border-[1px] flex-row items-center justify-center'
        style={[
          styles.checkbox,
          {
            borderColor: checked ? color : '#9CA3AF',
            backgroundColor: checked ? color : 'transparent',
          },
        ]}
      >
        {checked && <Ionicons name="checkmark" size={size} color="#fff" />}
      </View>
      {label && <CustomText>{label}</CustomText>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderWidth: 2,
    borderRadius: 6,

    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#222',
  },
});
