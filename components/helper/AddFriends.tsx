import ContactIcon from '@/assets/images/icons/contact.svg';
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { ActivityIndicator, FlatList, Image, TouchableOpacity, View } from "react-native";
import CustomText from "./CustomText";
import SearchButtonHelper from "./SearchButtonHelper";

export default function AddFriends({onNext}: {onNext: () => void}){
    const [contactKey, setContactKey]= useState('')

    return (
        <View>
            <View className='mb-14'>
                <SearchButtonHelper keyword={contactKey} setKeyword={(e)=>setContactKey(e)}
                    label="Search Users"    
                />
                <TouchableOpacity onPress={()=>null} className="flex-row gap-x-2 justify-center items-center">
                    <ContactIcon/>
                    <CustomText className="textblue-custom text-base">Invite friends from contacts</CustomText>
                </TouchableOpacity>
            </View>
            <View className='px-1'>
                <CustomText className='text-xl mb-5'>Friends you might know</CustomText>
                <ContactsList/>
            </View>
        </View>
    )
}
interface Contact {
  id: string;
  displayName: string;
  phoneNumber?: string;
  photoURL?: string;
  isAppUser?: boolean;
  status: "pending" | "accepted" | "none";
}
function ContactsList(){
    const fakedata: Contact[] = [
        {id:'1', displayName:'Gozi', status: 'none'},
        {id:'2', displayName:'Donald', status: 'none'}
    ]
    const listRef = useRef<FlatList<Contact>>(null);

    const renderItem = ({item}: {item: Contact}) => {
    //   const isPending = !!pending[item.id];
      const label = item.isAppUser ? "Message" : "Invite";

      return (
        <View className="justify-between flex-row items-center py-3 border-b border-gray-100">
          <Image
            source={require('@/assets/images/norm/person.png')}
            // source={{uri: item.photoURL || ""}}
            className="w-12 h-12 rounded-3xl"
          />
          <View className="flex-1 ml-3">
            <CustomText className="text-base font-semibold text-gray-900">
              {item.displayName}
            </CustomText>
            <CustomText className="text-xs text-gray-500 mt-0.5">
              {item.isAppUser ? "On Voql" : "Not on app"}
            </CustomText>
          </View>
          <TouchableOpacity
            className="rounded-full px-4 py-2.5 bg-primary-400 items-center justify-center"
            onPress={() => null}
            // disabled={isPending}
            accessibilityRole="button"
          >
            <View className="flex-row items-center">
              {0 ? (
                <ActivityIndicator size="small"  />
              ) : (
                <Ionicons
                  name={
                    item.isAppUser
                      ? "chatbubble-outline"
                      : "share-social-outline"
                  }
                  size={18}
                //   color={e}
                />
              )}
              <CustomText className="text-white font-semibold ml-1.5">
                {0 ? "Working" : label}
              </CustomText>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
//     ,
//     []
//   );

    return(
        <FlatList
          ref={listRef}
          data={fakedata}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 32}}
        //   ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
    )
}