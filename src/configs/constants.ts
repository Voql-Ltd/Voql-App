
interface Config {
  mongoURI: string;
  APP_SECRET_KEY: string;
  MAIL_EMAIL?: string;
  MAIL_PASS?: string;
  PAYSTACK_AUTHORIZATION_TOKEN?: string;
  MAILCHIMP_AUDIENCE_ID?: string;
  MAILCHIMP_API_KEY?: string;
  FRONTEND_BASE_URL: string;
  REDIS_URL: string;
  REDIS_PUBLIC_URL: string;
}
// console.log(process.env.MONGO_URI)

const config: Config = {
  mongoURI: process.env.MONGO_URI || '',
  APP_SECRET_KEY: process.env.APP_SECRET_KEY || 'keyboard',
  MAIL_EMAIL: process.env.MAIL_EMAIL,
  MAIL_PASS: process.env.MAIL_PASS,
  PAYSTACK_AUTHORIZATION_TOKEN: process.env.PAYSTACK_AUTHORIZATION_TOKEN,
  MAILCHIMP_AUDIENCE_ID: process.env.MAILCHIMP_AUDIENCE_ID,
  MAILCHIMP_API_KEY: process.env.MAILCHIMP_API_KEY,
  FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL || 'http://localhost:3000',
  REDIS_URL: process.env.REDIS_URL || 'This only works in railway hosted project',
  REDIS_PUBLIC_URL: process.env.REDIS_PUBLIC_URL || '',
};

export default config;