import { countries } from "@/config/countries";
import { Ionicons } from "@expo/vector-icons";
import { PhoneNumberUtil } from 'google-libphonenumber';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Image, Modal, Platform, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import CustomText from '../CustomText';

// Transform countries data to the format we need
const COUNTRIES = countries.map(country => ({
  code: country.cca2,
  name: country.name.common,
  callingCode: country.callingCode[0],
  flag: country.flag,
}));

// Simple dropdown icon
const DROPDOWN_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAi0lEQVRYR+3WuQ6AIBRE0eHL1T83FBqU5S1szdiY2NyTKcCAzU/Y3AcBXIALcIF0gRPAsehgugDEXnYQrUC88RIgfpuJ+MRrgFmILN4CjEYU4xJgFKIa1wB6Ec24FuBFiHELwIpQxa0ALUId9wAkhCnuBdQQ5ngP4I9wxXsBDyJ9m+8y/g9wAS7ABW4giBshQZji3AAAAABJRU5ErkJggg==";

// Types
interface PhoneInputProps {
  defaultCode?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onChangeCountry?: (country: typeof COUNTRIES[0]) => void;
  onChangeText?: (text: string) => void;
  onChangeFormattedText?: (data: { formattedText: string; countryName: string; countryCode: string }) => void;
  containerStyle?: ViewStyle;
  textInputStyle?: TextStyle ;
  autoFocus?: boolean;
  placeholder?: string;
}

export interface PhoneInputRef {
  getCountryCode: () => string;
  getCallingCode: () => string;
  isValidNumber: (number: string) => boolean;
  getNumberAfterPossiblyEliminatingZero: () => { number: string; formattedNumber: string };
}

const phoneUtil = PhoneNumberUtil.getInstance();

const AltePhone = forwardRef<PhoneInputRef, PhoneInputProps>(({
  defaultCode = 'US',
  value,
  defaultValue = '',
  disabled = false,
  onChangeCountry,
  onChangeText,
  onChangeFormattedText,
  containerStyle,
  textInputStyle,
  autoFocus = false,
  placeholder = 'Phone Number',
}, ref) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    COUNTRIES.find(c => c.code === defaultCode) || COUNTRIES[0]
  );
  const [searchQuery, setSearchQuery] = useState('');
  
  const phoneNumber = value ?? defaultValue;
  
  // Default container style
  const defaultContainerStyle: ViewStyle = {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#d6dbdd',
    borderRadius: 8,
    backgroundColor: '#fff',
    minHeight: 50
  };

  // Update formatted text when phone number or country changes
  React.useEffect(() => {
    if (onChangeFormattedText) {
      const formatted = phoneNumber.length > 0 
        ? `+${selectedCountry.callingCode}${phoneNumber}`
        : phoneNumber;
      onChangeFormattedText({
        formattedText: formatted,
        countryName: selectedCountry.name,
        countryCode: selectedCountry.code
      });
    }
  }, [phoneNumber, selectedCountry.callingCode, selectedCountry.name, selectedCountry.code]);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    getCountryCode: () => selectedCountry.code,
    getCallingCode: () => selectedCountry.callingCode,
    isValidNumber: (number: string) => {
      try {
        const parsedNumber = phoneUtil.parse(number, selectedCountry.code);
        return phoneUtil.isValidNumber(parsedNumber);
      } catch {
        return false;
      }
    },
    getNumberAfterPossiblyEliminatingZero: () => {
      let number = phoneNumber;
      if (number.length > 0 && number.startsWith('0')) {
        number = number.substring(1);
      }
      return {
        number,
        formattedNumber: `+${selectedCountry.callingCode}${number}`
      };
    },
  }));

  const handleCountrySelect = (country: typeof COUNTRIES[0]) => {
    setSelectedCountry(country);
    setModalVisible(false);
    if (onChangeCountry) {
      onChangeCountry(country);
    }
  };

  const handleTextChange = (text: string) => {
    if (onChangeText) {
      onChangeText(text);
    }
  };

  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
    <View style={[defaultContainerStyle, containerStyle]}>
      {/* Country selector button */}
      <TouchableOpacity
        style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          paddingHorizontal: 12, 
          paddingVertical: 12,
          minWidth: 80,
        //   borderRightWidth: 1,
        //   borderRightColor: '#ddd'
        }}
        disabled={disabled}
        onPress={() => setModalVisible(true)}
      >
        <CustomText style={{ fontSize: 20, marginRight: 4 }}>{selectedCountry.flag}</CustomText>
        <CustomText style={{ fontSize: 14, color: '#333' }}>
          +{selectedCountry.callingCode}
        </CustomText>
        <Image 
          source={{ uri: DROPDOWN_ICON }} 
          style={{ width: 12, height: 12, marginLeft: 4 }}
        />
      </TouchableOpacity>

      {/* Phone number input */}
      <TextInput
        style={[
          { flex: 1, paddingHorizontal: 12, fontSize: 16, color: '#333', fontFamily: 'Inter'},
          textInputStyle
        ]}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={phoneNumber}
        onChangeText={handleTextChange}
        editable={!disabled}
        keyboardType="phone-pad"
        autoFocus={autoFocus}
        autoComplete="tel"
        {...(Platform.OS === 'web' ? { type: 'tel', name: 'phoneNumber' } : {})}
      />
    </View>
    {/* Country picker modal */}
    {modalVisible && (
        <Modal 
            className="top-0"
        style={{
        //   position: 'absolute',
          backgroundColor:'#fff',
        //   height:'fit-content',
        top: 0,
          left: 0,
          right: 0,
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <View style={{
            backgroundColor: '#fff',
            // borderRadius: 12,
            // margin: 20,
            width: '100%',
            height: '100%',
          }}>
            {/* Header */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#eee'
            }}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
                <CustomText style={{ fontSize: 18, color: '#666' }}>✕</CustomText>
            </TouchableOpacity>
            <CustomText className="text-xl">Select Country</CustomText>
            <View/>
            </View>

            {/* Search */}
            <View style={{padding: 15}}>
            <View style={{
              padding: 16,
              borderWidth: 1,
                  borderColor: '#EBEBEC',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                  columnGap:3
            //   borderBottomWidth: 1,
            //   borderBottomColor: '#eee'
            }}>
                <Ionicons name="search" size={22} color="black" />
              <TextInput
                style={{
                  color:'#000',
                  fontSize: 16
                }}
                placeholder="Search countries..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
            </View>
            </View>

            {/* Country list */}
            <View className='flex-1 px-3'>
            <View className="border border-[#EBEBEC] rounded-t-3xl rounded-b-3xl">
              {filteredCountries.slice(0, 11).map((country) => (
                <TouchableOpacity
                  key={country.code}
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#EBEBEC'
                  }}
                  onPress={() => handleCountrySelect(country)}
                >
                    <View className="flex-row items-center">
                        <CustomText style={{ fontSize: 24, marginRight: 12 }}>{country.flag}</CustomText>
                        <CustomText style={{ fontSize: 16, color: '#000' }}>{country.name}</CustomText>
                    </View>
                    <CustomText style={{ fontSize: 14, color: '#666' }}>+{country.callingCode}</CustomText>
                </TouchableOpacity>
              ))}
            </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
});

AltePhone.displayName = 'AltePhone';

export default AltePhone;