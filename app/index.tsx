import { Redirect } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from "react";
import { ActivityIndicator, StatusBar, Text, useColorScheme, View } from 'react-native';
// import LogoIcon from '../assets/images/brand/logo-blue-bg-tp.svg';
// import { CustomSplash } from "./components";
import '../styles/global.css';
import { useAuth } from "@/context";
import { PAGE_ROUTES } from "@/config";
import { GuestRedirect } from "@/components";

// import GuestRedirect from '../src/components/helper/GuestRedirect';
// import { PAGE_ROUTES } from '../src/config';
// import { useAuth } from '../src/context';


SplashScreen.preventAutoHideAsync(); 

export default function RootLayout() {
  
  const colorScheme = useColorScheme();
  const [ready, setReady] = useState(false);
  const {isAuthenticated}= useAuth()

  useEffect(() => {
    setTimeout(async () => {
      setReady(true);
      await SplashScreen.hideAsync();
    }, 2000);
  }, []);

  if (!ready) {
    return <CustomSplash />;
  }

  return (
  <MainLayout isAuthenticated={isAuthenticated}/>)
}
function MainLayout({isAuthenticated}: {isAuthenticated: boolean}) {
  if(isAuthenticated){
    return <Redirect href={PAGE_ROUTES.LOGGED_IN_SCREEN as any} />
  }
  return <Redirect href={PAGE_ROUTES.WELCOME_SCREEN as any} />
}
function CustomSplash() {
  return (
    <View style={{backgroundColor:'#004182', flex:1, justifyContent:'space-between', 
      alignItems:'center', flexDirection:'column', paddingBottom:100}}>
      <StatusBar barStyle="light-content" />
      <Text className='text-white mt-20 text-xl'>
        {''}
      </Text>
      <View className="rounded-[25px] p-5 bg-white" >
        {/* <LogoIco/> */}
      </View>
      {/* <Image source={require('../assets/images/brand/logo-svg-blue.svg')} style={{ width: 100, height: 100 }} /> */}
      {/* <ActivityIndicator size="large" color="#FFFFFF" /> */}
    </View>
  );
}
