import { Ionicons } from "@expo/vector-icons";
import { ReactNode, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import CustomText from "./CustomText";

interface SelectOptionHelperProps {
  options?: string[];
  onChangeValue?: (value: string) => void;
  value?: string;
  label?: string;
  leftSibling?: ReactNode;
  showActiveOption?: boolean;
  dropdownSrc?: any;
  placeholder?: string;
  isInput?: boolean;
  posAttribute?: { top?: number };
  optionStyle?: any;
  containerStyle?: any;
  parent_className?: string;
}

// const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function SelectOptionHelper({
  options = [],
  onChangeValue = () => {},
  value = "",
  label = "Select...",
  leftSibling = null,
  showActiveOption = true,
  dropdownSrc = null,
  placeholder = '',
  isInput = false,
  posAttribute = { top: 45 },
  optionStyle = {},
  containerStyle = {},
  parent_className
}: SelectOptionHelperProps) {
  const [show, setShow] = useState(false);
  // const [query, setQuery] = useState(value || "");
  const controlRef = useRef(null);

  // useEffect(() => {
  //   // if parent externally changes value, keep query synced unless input mode has typed content
  //   if (!isInput) setQuery(value || "");
  // }, [value, isInput]);

  const newOptions = showActiveOption ? options : options.filter((opt) => opt !== value);
  
  const filtered = (!isInput)
    ? newOptions
    : newOptions
    // newOptions.filter((option) => option.toLowerCase().includes(query.toLowerCase()));


  // const caretSource = dropdownSrc || defaultCaret;

  function handleSelect(option: string) {
    setShow(false);
    onChangeValue(option);
  }

  return (
    <View style={styles.wrapper} >
      {/* Control */}
      <Pressable
        ref={controlRef}
        onPress={() => setShow((s) => !s)}
        className={parent_className || 'border-gray-300'}
        style={[styles.control, containerStyle, isInput && value && !options.includes(value) ? { borderColor: 'red' } : null]}
      >
        {leftSibling ? <View style={styles.left}>{leftSibling}</View> : null}

        <View style={styles.content}>
          {!isInput ? (
            0
            // query
             ? (
              <CustomText numberOfLines={1} style={styles.valueText}>
                {/* {query} */}
              </CustomText>
            ) : (
              <CustomText style={{fontFamily:'jakarta'}} 
                className='text-lg py-1'>
                {value || placeholder || label}
              </CustomText>
            )
          ) : (
            <TextInput
              style={styles.input}
              placeholder={label}
              value={value}
              onChangeText={(t: string) => {
                onChangeValue(t); 
              }}
              onFocus={() => setShow(true)}
              returnKeyType="done"
            />
          )}
        </View>

        <View style={styles.iconWrap}>
          {/* <Image
            source={caretSource}
            style={[
              styles.caret,
              { transform: [{ rotate: show ? "180deg" : "0deg" }] },
            ]}
            resizeMode="contain"
          /> */}
          <Ionicons 
            name="caret-down" 
            // size={s}
            style={[
              styles.caret,
              { transform: [{ rotate: show ? "180deg" : "0deg" }] },
            ]}
            />
        </View>
      </Pressable>
      {show && (
        <Pressable style={styles.overlay} onPress={() => setShow(false)}>
          
        </Pressable>
      )}

      {show && (
        <View style={[styles.dropdown, { ...posAttribute, minWidth: "100%" }]}>
          <ScrollView
            style={styles.scroll}
            className='bg-white z-[99]'
            contentContainerStyle={styles.scrollContent}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          >
            {filtered.length === 0 ? (
              <View style={[styles.optionRow, optionStyle]}>
                <CustomText style={{fontFamily:'jakarta', fontSize:15}}>No results</CustomText>
              </View>
            ) : (
              filtered.map((option, idx) => {
                const isActive = option === value;
                return (
                  <TouchableOpacity
                    key={`${option}-${idx}`}
                    onPress={() => handleSelect(option)}
                    activeOpacity={0.7}
                    style={[
                      styles.optionRow,
                      isActive ? styles.optionActive : null,
                      optionStyle,
                    ]}
                  >
                    <CustomText style={{fontFamily:'jakarta', fontSize:15}}>{option}</CustomText>
                    {/* if you want to show sub-info like date or amount, you can pass structured objects instead of strings */}
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    position:'relative',
    // backgroundColor:'#0D6EFD',
    // zIndex: 999,
  },
  control: {
    width: "100%",
    minHeight: 44,
    borderRadius: 10,
    borderWidth: 1,
    // borderColor: "#0D6EFD",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  left: {
    marginRight: 8,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  valueText: {
    color: "#000",
  },
  placeholderText: {
    color: "#9AA0A6",
  },
  input: {
    padding: 0,
    margin: 0,
    color: "#000",
    fontSize: 16,

  },
  iconWrap: {
    marginLeft: 8,
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  caret: {
    width: 12,
    height: 12,
    tintColor: "#000",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    // transparent overlay so dropdown closes on outside press
    backgroundColor: "transparent",
  },

  dropdown: {
    position: "absolute",
    left: 0,
    right: 0,
    // top is provided by posAttribute
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CABECF",
    maxHeight: 200,
    zIndex: 1000,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
    elevation: 6,
  },
  scroll: {
    maxHeight: 200,
  },
  scrollContent: {
    paddingVertical: 4,
  },
  optionRow: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
    justifyContent: "center",
  },
  optionActive: {
    backgroundColor: "#CABECF",
  },

});
