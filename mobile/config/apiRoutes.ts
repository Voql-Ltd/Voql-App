const API_ROUTES = {
  REGISTRATION:'auth/signup',
  SEND_EMAIL:'auth/send-email-verification',
  VERIFY_EMAIL_TOKEN:({uid, token}:{uid:string, token:string})=>`/auth/verify-email?token=${token}&uid=${uid}`,
  BRAND_NAME:'Voql'
};

export default API_ROUTES