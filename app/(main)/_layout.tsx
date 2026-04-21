import { ConversationContextComponent } from "@/context";
import { Stack, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/context";

export default function ChatLayout() {
    return (
    <ConversationContextComponent>
        <Stack screenOptions={{ headerShown: false, headerBackVisible:false }} />
    </ConversationContextComponent>
    
)}
