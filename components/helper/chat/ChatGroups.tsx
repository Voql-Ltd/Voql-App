import { Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import CustomText from '../CustomText';
import { Ionicons } from '@expo/vector-icons';

interface ChatGroupsProps {
  active?: string;
  setActive?: (active: 'current' | 'unread' | 'favorite' | 'mentions') => void;
}

export default function ChatGroups({ active='All', setActive }: ChatGroupsProps) {
  
  const groups = [
    { name: 'All', count: 0 },
    { name: 'Unread', count: 12 },
    { name: 'Favorites', count: 3 },
    { name: 'First Time', count: 8 },
    { name: 'Mention', count: 15 },
    { name: 'School', count: 2 },
  ];

  return (
    <View className="bg-gray-50">
      <View className="bg-white px-5 py-3">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className=""
        >
          <View className="flex-row gap-x-3">
          {groups.map((group, index) => (
            <Pressable onPress={() => setActive?.(group.name as any)} style={active === group.name ? 
              { backgroundColor: '#E5F4FF', borderWidth: 1, borderColor: '#B2DDFF' } 
              : {backgroundColor:'#F0F0F180', borderWidth: 1, borderColor: '#F0F0F180' }} key={index} className="rounded-full flex-row gap-x-2 items-center justify-between px-4 py-1.5">
              <CustomText className="text-base">{group.name}</CustomText>
              {group.count?<CustomText className="text-sm">{group.count}</CustomText>:null}
            </Pressable>
          ))}
          <TouchableOpacity onPress={() => console.log('Add group')} className="rounded-full flex-row gap-x-2 items-center justify-between px-4 py-1.5">
            <Ionicons name='add' size={20} color='#000' />
          </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}