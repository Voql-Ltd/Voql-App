interface TabScreen {
  route: string;
  icon: string;
  label: string;
}


interface AuthScreens {
  CHOOSE_ROLE: string;
  LOGIN: string;
  STAFF_QR_SCAN: string;
  FORGOT_PASSWORD: string;
  VERIFY_OTP: string;
  RESET_PASSWORD: string;
  PIN_LOGIN: string;
  PIN_RESET: string;
  REGISTER: string;
}

interface FriendScreens{
  LIST: string;
  ADD: string;
}

interface ChatScreens{
  MESSAGE:(params: {room_id:string, room_type:string}) => string;
  NEW_MESSAGE:(params: {user_id:string}) => string;
}
const PAGE_ROUTES = {
  HOME_SCREEN: "/",
  LANDING_SCREEN: "/landing-page",
  LOGGED_IN_SCREEN: "/chats",
  WELCOME_SCREEN: "/(auth)/welcome",
  AUTH_SCREENS: {
    LOGIN: "/(auth)/login",
    REGISTER: "/(auth)/register",
  } as AuthScreens,
  TABSCREENS: [
    { route: "home", icon: "home", label: "Home" },
    { route: "competitions", icon: "trophy-main", label: "Competition" },
    { route: "rules", icon: "rule", label: "Rules" },
    { route: "more", icon: "more", label: "More" },
  ] as TabScreen[],
  CONTACTS:{
    LIST: "(main)/friends",
    ADD: "(main)/friends/add",
  } as FriendScreens,
  CHAT:{
    MESSAGE:({room_id, room_type}: {room_id:string, room_type:string})=> "(main)/chat/"+room_id+'?room_type='+room_type,
    NEW_MESSAGE:({user_id}: {user_id:string})=> "(main)/chat/new"+user_id,
  } as ChatScreens,
  NEW_CHAT:"(main)/chat/new",
};

export default PAGE_ROUTES;
