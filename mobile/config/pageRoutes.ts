interface TabScreen {
  route: string;
  icon: string;
  label: string;
}

interface MoreScreen {
  route: string;
  icon: string;
  label: string;
}

interface CompScreens {
  SEE_MORE: (id: string) => string;
  CREATE: string;
  DISPLAY_ONE: (id: string) => string;
}

interface WalletRoute {
  DEPOSIT: string;
  WITHDRAW: string;
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

const PAGE_ROUTES = {
  HOME_SCREEN: "/",
  LANDING_SCREEN: "/landing-page",
  LOGGED_IN_SCREEN: "/home",
  DASHBOARD: "/dashboard",
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
  COMP_SCREENS: {
    SEE_MORE: (id: string) => "/competition/" + id + "/detail",
    CREATE: "/competition/create",
    DISPLAY_ONE: (id: string) => "/competition/" + id + "/list",
  } as CompScreens,

  MORESCREENS: [
    { route: "/rules", icon: "rules.svg", label: "Rules" },
    { route: "/profile", icon: "profile.svg", label: "Profile" },
    {
      route: "/suggestion-box",
      icon: "box.svg",
      label: "Suggestion Box",
    },
  ] as MoreScreen[],
  WALLET_ROUTE: {
    DEPOSIT: "/wallet/deposit",
    WITHDRAW: "/wallet/withdrawal",
  } as WalletRoute,
};

export default PAGE_ROUTES;
