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
  GET_CONVERSATION_BY_ROOMID:(room_id:string, room_type?:string)=>`conversations/one/${room_id}${room_type ?`?room_type=${room_type}` : ''}`,

  //ROOMS
  CREATE_P2P_ROOM:'conversations/create-p2p',
  CREATE_GROUP_ROOM:'conversations/create-group',
  GET_ROOM_BY_NAME:()=>'conversations/:roomName',
  INITIATE_CONVO:'conversations/initiate-convo',

  //MESSAGES
  GET_MESSAGES:(room_id:string)=>`messages/${room_id}`,
};

export default API_ROUTES