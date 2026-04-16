/**
 * Header component for Chats screen
 * Center title with left/right action buttons
 */

import {Feather, Ionicons, MaterialIcons} from "@expo/vector-icons";
import {Text, TouchableOpacity, View} from "react-native";
import SearchButtonHelper from "../SearchButtonHelper";

/**
 *
 */
interface HeaderProps {
  onOpenOverflow: () => void;
  onInviteFriends: () => void;
  chatKeyword: string;
  setChatKeyword: (keyword: string) => void;
  isChatsEmpty: boolean;
}

/**
 *
 */
export default function ChatNav({
  onOpenOverflow,
  onInviteFriends,
  chatKeyword,
  setChatKeyword,
  isChatsEmpty
}: HeaderProps){
  return (
    <View className="absolute top-0 left-0 right-0 w-screen p-3 h-fit">
      <View className="flex-row items-center justify-between px-4 py-3 bg-white">
        <TouchableOpacity
          className="items-center justify-center bg-white border rounded-full w-11 h-11 border-neutral-200/70"
          onPress={onOpenOverflow}
          accessibilityRole="button"
          accessibilityLabel="Open overflow menu"
        >
          <Ionicons
            name="ellipsis-horizontal"
            size={20}
            className="text-neutral-700"
          />
        </TouchableOpacity>
        <Text className="text-2xl text-neutral-900">Chats</Text>

        <View className="flex-row gap-x-3 items-center" style={{gap: 5}}>
          {/* <TouchableOpacity
            className="items-center justify-center bg-white border rounded-full w-11 h-11 border-neutral-200/70"
            onPress={onLogout}
            accessibilityRole="button"
            accessibilityLabel="Toggle layout"
          >
            <Feather name="power" size={18} className="text-neutral-700" />
          </TouchableOpacity> */}
          <TouchableOpacity>
            <Ionicons name="menu" size={20} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity
            className="items-center justify-center rounded-full bgblue-custom w-11 h-11"
            onPress={onInviteFriends}
            accessibilityRole="button"
            accessibilityLabel="Invite friends"
          >
            <MaterialIcons name="person-add-alt" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
      {!isChatsEmpty && <View>
        <SearchButtonHelper
          label="Search"
          keyword={chatKeyword}
          setKeyword={setChatKeyword}
        />
      </View>}
    </View>
  );
};
