import { CustomText, DataFetchContainer, GoBack, SearchButtonHelper } from "@/components";
import { consolelog, PAGE_ROUTES } from "@/config";
import API_ROUTES from '@/config/apiRoutes';
import { useHttpServices } from '@/hooks';
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useQuery } from '@tanstack/react-query';
import * as Contacts from 'expo-contacts';
import { useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { FlatList, Linking, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Contact {
  id: string;
  name: string;
  phone: string;
  category: 'friends' | 'exists' | 'invites';
  voqlUser?: any;
}

export default function AddFriends() {
  const { getProtectedData, postProtectedData } = useHttpServices();
  const [contactsPermission, setContactsPermission] = useState<'granted' | 'denied' | 'loading'>('loading');
  const router= useRouter()

  useEffect(() => {
    checkContactsPermission();
  }, []);

  const checkContactsPermission = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      consolelog({status})
      setContactsPermission(status === 'granted' ? 'granted' : 'denied');
    } catch (error) {
      setContactsPermission('denied');
    }
  };

  const getDeviceContacts = async (): Promise<string[]> => {
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name, Contacts.Fields.Image],
    });

    const phoneNumbers = data
      .filter(contact => contact.phoneNumbers && contact.phoneNumbers.length > 0)
      .map(contact => contact.phoneNumbers![0].number)
      .filter((phone): phone is string => phone !== undefined)
      // .map(phone => phone);

    return phoneNumbers
  };
  const findUsersByContacts = async () => {
      const phoneNumbers = await getDeviceContacts();
      
      return await postProtectedData({
        path: API_ROUTES.FIND_USERS_BY_CONTACTS,
        body: { phoneNumbers }
      });
   }
   const [keyword, setKeyword] = useState('')
  const { data: contactsData, isLoading, isError } = useQuery({
    queryKey: ['findUsersByContacts'],
    queryFn: findUsersByContacts,
    enabled: contactsPermission === 'granted',
  });

  const openSettings = () => {
    Linking.openSettings();
  };

  const requestPermission = () => {
    checkContactsPermission();
  };


  const renderUserItem = ({ item }: { item: any }) => (
    <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
      <View className="">
        <CustomText className="text-lg font-semibold">{item.firstName+' '+item.lastName}</CustomText>
        <CustomText className="text-gray-500">{item.formattedText}</CustomText>
      </View>
      <TouchableOpacity onPress={()=>router.push(PAGE_ROUTES.CHAT.NEW_MESSAGE({user_id: item._id as string}) as any)} className="bgblue-custom px-4 py-2 rounded-full">
        <CustomText className="text-white text-sm">Message</CustomText>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View className="gap-y-6 w-full mb-4">
      {['New group', 'New Contact'].map((x_label,ind)=>
        <TouchableOpacity key={ind} onPress={()=>{}} className='w-full flex-row gap-x-3 items-center'>
          <View style={{borderRadius:50}} className="rounded-full p-1.5 border border-gray-400 ">
            {ind?<MaterialIcons name="person-add-alt" size={22} color="black" />:<AntDesign name="usergroup-add" size={22} color="black" />}
          </View>
          <CustomText className="text-[15px]">{x_label}</CustomText>
        </TouchableOpacity>
      )}
      <View className="mt-6">
        <CustomText className="text-gray-800">Contacts on Voql</CustomText>
      </View>
    </View>
  );

//   const renderCategory = (title: string, contacts: Contact[], showLabel: boolean) => (
//     <View className="mb-6">
//       {showLabel && contacts.length > 0 && (
//         <CustomText className="text-lg font-bold mb-3 text-gray-700">{title}</CustomText>
//       )}
//       {contacts.map(renderContactItem)}
//     </View>
//   );

  if (contactsPermission === 'loading') {
    return (
      <SafeAreaView className="">
        <GoBack label="Add Contacts" showLabel={true} />
        <View className="flex-1 items-center justify-center">
          <CustomText>Loading...</CustomText>
        </View>
      </SafeAreaView>
    );
  }

  if (contactsPermission === 'denied') {
    return (
      <SafeAreaView>
        <GoBack label="Add Friends" showLabel={true} />
        <View className="pt-20">
          <View className="items-center justify-center p-6">
            <CustomText className="text-center text-lg mb-4">
              Contacts Access Required
            </CustomText>
            <CustomText className="text-center text-gray-600 mb-6">
              We need access to your contacts to help you find friends on Voql.
            </CustomText>
            {/* <TouchableOpacity 
              onPress={requestPermission}
              className="bgblue-custom px-6 py-3 rounded-full mb-4"
            >
              <CustomText className="text-white text-center font-semibold">
                Grant Access
              </CustomText>
            </TouchableOpacity> */}
            <TouchableOpacity 
              onPress={openSettings}
              className="bgblue-custom px-6 py-3 rounded-full"
            >
              <CustomText className="text-white text-center font-semibold">
                Open Settings
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView>
       <View className='relative'>
        <View className="h-[130px] pt-5 gap-y-6 absolute top-0 left-0 right-0">
            <GoBack label="Add Friends"   
                // route={()=>router.back()}
                showLabel={true} extraComponent={
                <TouchableOpacity onPress={() => console.log('Add pressed')}>
                    <Ionicons name="ellipsis-vertical" size={24} color="black" />
                </TouchableOpacity>
            }/>
            <View className="px-1">
              <SearchButtonHelper showBtn={false} keyword={keyword} label="Search Contacts" setKeyword={setKeyword} />
            </View>
        </View>
        <View style={{ paddingTop: 150, paddingHorizontal: 16 }}>
          <DataFetchContainer
              isLoading={isLoading}
              isError={isError}
              isEmpty={contactsData?.data?.users.length === 0}
              emptyComponent={
                  <View className="flex-1 items-center justify-center p-6">
                  <CustomText className="text-center text-lg mb-4">
                      No Contacts Found
                  </CustomText>
                  <CustomText className="text-center text-gray-600">
                      Try inviting friends directly or check your contacts access.
                  </CustomText>
                  </View>
              }
              errorMsg="Failed to load contacts"
          >
              <FlatList
                  data={contactsData?.data?.users || []}
                  renderItem={renderUserItem}
                  keyExtractor={(item: any, index: number) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  ListHeaderComponent={renderHeader}
                  
              />
          </DataFetchContainer>
        </View>
      </View>
    </SafeAreaView>
  );
}