import { Ionicons } from "@expo/vector-icons";
import { ComponentType, ReactNode, useState } from "react";
import { FlatList, Modal, TouchableOpacity, View } from "react-native";
import CustomText from "./CustomText";

interface SelectOptionItem {
  [key: string]: any;
  value?: any;
  label?: string;
  disabled?: boolean;
  IconComponent?: ComponentType<any>;
}

interface SelectOptionasObjectHelperProps {
  options?: SelectOptionItem[];
  onChange?: (item: SelectOptionItem) => void;
  label?: string;
  disabled?: boolean;
  value?: SelectOptionItem;
  leftSibling?: ReactNode;
  showActiveOption?: boolean;
  valueProp?: string;
  labelProp?: string;
}

export default function SelectOptionAsObjectHelper({
  options = [],
  onChange,
  label,
  disabled,
  value = {},
  leftSibling = null,
  showActiveOption = true,
  valueProp = "value",
  labelProp = "label",
}: SelectOptionasObjectHelperProps) {
  const [show, setShow] = useState(false);
//   const filteredOptions = showActiveOption
//     ? options
//     : options.filter((opt) => opt[valueProp] !== value[valueProp]);
    // console.log({value})
    const IconToDisplay = !leftSibling ? null : value['IconComponent'];
  return (
    <View className="w-full">
      {/* Select Box */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setShow(!show)}
        className="flex flex-row justify-between items-center border border-[#CABECF] rounded-lg bg-white px-4 py-3"
      >
        <View className="flex flex-row items-center gap-x-3">
          {leftSibling ? 
            <View>
                {IconToDisplay && <IconToDisplay/>}
            </View> : null}
          <CustomText
            style={{fontFamily:'jakarta'}}
            className={`text-[15px] ${
              value[labelProp] ? "text-black" : "text-gray-400"
            }`}
          >
            {value[labelProp] || label}
          </CustomText>
        </View>

        <Ionicons
          name={show ? "chevron-up" : "chevron-down"}
          size={18}
          color="#000"
        />
      </TouchableOpacity>

      
      <Modal visible={show} transparent animationType="fade">
        <TouchableOpacity
          activeOpacity={1}
          onPressOut={() => setShow(false)}
          className="flex-1 justify-center bg-black/30 px-6"
        >
          <View className="bg-white rounded-xl border border-[#CABECF] max-h-[300px] py-2">
            <FlatList
              data={options}
              keyExtractor={(_, ind) => ind.toString()}
              renderItem={({ item: parent_item, index }: { item: SelectOptionItem; index: number }) => {
                // console.log(})
                const {IconComponent,...item} = parent_item
                // console.log({old_item:item})
                return(
                  <TouchableOpacity
                    style={!!item.disabled ? {
                      opacity: 0.5
                    } : {}}
                    disabled={!!item.disabled}
                    className={`flex-row gap-x-3  items-center px-4 py-3 ${
                      value[valueProp] === item[valueProp]
                        ? "bg-gray-200"
                        : "bg-transparent"
                    }`}
                    onPress={() => {
                      if (item.disabled || !onChange) return;
                      onChange({ ...item, IconComponent });
                      setShow(false);
                      return;
                    }}
                  >
                  {IconComponent && <IconComponent/>}
                  <CustomText
                    style={{fontFamily:'jakarta'}}
                    className={`text-[15px] ${
                      value[valueProp] === item[valueProp]
                        ? "font-semibold text-black"
                        : "text-gray-700"
                    }`}
                  >
                    {item[labelProp]}
                  </CustomText>
                </TouchableOpacity>
              )}}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

