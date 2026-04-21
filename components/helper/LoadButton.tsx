import { ReactNode } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";

interface LoadButtonProps {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  loadingLabel?: string;
  buttonStyle?: any;
  removeDefaultDisabledLabelStyle?:boolean;
  loadingComponent?: ReactNode;
  textStyle?: any;
  className?: string;
}

export default function LoadButton({
  children,
  onPress,
  disabled = false,
  isLoading = false,
  removeDefaultDisabledLabelStyle = false,
  loadingLabel,
  buttonStyle={backgroundColor: '#1194FF'},
  loadingComponent = null,
  textStyle,
  className 
  // = 'mlog-bg-blue px-5 py-5 rounded-[15px]'
}: LoadButtonProps) {
  return (
    <TouchableOpacity
      className={className+' bg-blue-300'}
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        styles.button, 
        buttonStyle, 
        {opacity: removeDefaultDisabledLabelStyle? 1 : (disabled || isLoading ? 0.6 : 1)}
      ]}
      activeOpacity={0.6}
    >
      {isLoading ? (
        loadingComponent?loadingComponent:
        <View style={styles.loadingContainer}>
          {children}
          {loadingLabel ? (
            loadingLabel
          ) : (
            <ActivityIndicator size="small" color="#fff" style={{ marginLeft: 6 }} />
          )}
        </View>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius:24,
   
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily:'Jakarta'
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // paddingHorizontal:21
  },
});
