import { ReactNode } from 'react';
import { Text, View } from 'react-native';

interface BottomNavProps {
  children?: ReactNode;
}

export default function BottomNav({ children }: BottomNavProps){
    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Navigation</Text>
        </View>
    )
}