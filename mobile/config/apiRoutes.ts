const API_ROUTES = {
  //PLAIN
  BRAND_NAME:'Voql',

  //AUTH
  SIGN_IN:'auth/sign-in',
  SIGN_UP:'auth/sign-up',
  SEND_OTP_GUEST:'auth/send-otp-guest',
  VERIFY_OTP:'auth/verify-otp',

  //FRIENDS
  SEND_FRIEND_REQUEST:'friends/request',
  ACCEPT_FRIEND_REQUEST:'friends/accept',
  GET_FRIENDS:'friends',
  FIND_USERS_BY_CONTACTS:'friends/find-by-contacts',
  GET_SUGGESTIONS:'friends/suggestions',
  
  //CONVERSATIONS
  GET_CONVERSATIONS:'conversations/all',

  //ROOMS
  CREATE_P2P_ROOM:'rooms/create-p2p',
  CREATE_GROUP_ROOM:'rooms/create-group',
  GET_ROOM_BY_NAME:'rooms/:roomName',
  INITIATE_CONVO:'rooms/initiate-convo'
};

export default API_ROUTES