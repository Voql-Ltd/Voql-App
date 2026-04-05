import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import CustomText from './CustomText';

interface RadioButtonHelperProps {
  options: string[];
  selected?: string;
  onSelect?: (option: string) => void;
}

export default function RadioButtonHelper({ options, selected, onSelect }: RadioButtonHelperProps) {
  const [selectedOption, setSelectedOption] = useState(selected || '');

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <View style={styles.container}>
      {options.map((opt) => (
        <TouchableOpacity key={opt} style={styles.option} onPress={() => handleSelect(opt)}>
          <View style={[styles.circle, selectedOption === opt && styles.selectedCircle]} />
          <CustomText style={styles.label}>{opt}</CustomText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 20 },
  option: { flexDirection: 'row', alignItems: 'center' },
  circle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0D6EFD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCircle: {
    backgroundColor: '#0D6EFD',
  },
  label: { marginLeft: 8, textTransform: 'capitalize' },
});
