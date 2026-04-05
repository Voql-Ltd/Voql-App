import { Stack } from "expo-router";
import '@/styles/global.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toastConfig } from '@/config';
import { AuthContextComponent } from '@/context';
import Toast from 'react-native-toast-message';
import * as Font from 'expo-font';

const queryClient = new QueryClient();

export default function RootLayout() {
  // const [isReady, setIsReady] = useState(false);
  
  const [loaded, error] = Font.useFonts({
    'Inter': require('../assets/fonts/Inter.ttf'),
    'InterItalic': require('../assets/fonts/Inter-Italic.ttf'),
  });
  // const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextComponent>
        <Stack screenOptions={{ headerShown: false, headerBackVisible:false }} />
        <Toast config={toastConfig}/>
      </AuthContextComponent>
    </QueryClientProvider>
)}
