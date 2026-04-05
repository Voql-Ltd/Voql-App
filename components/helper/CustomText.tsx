import { Text, TextProps, StyleProp, TextStyle } from 'react-native';

interface CustomTextProps extends TextProps {
  className?: string;
  font_fam?: 'normal' | 'bold' | 'semibold' | 'italic' | string;
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export default function CustomText({className, font_fam='normal', children, ...props}: CustomTextProps) {

  return (
    <Text style={
        font_fam==='normal'?{fontFamily:'Inter', ...(props.style as TextStyle)}:
        font_fam==='italic'?{fontFamily:'Inter', ...(props.style as TextStyle)}:
        {fontFamily:'Inter', ...(props.style as TextStyle)}
    } 
        className={className}
        {...props}>
          {children || ''}
    </Text>
  );
}
