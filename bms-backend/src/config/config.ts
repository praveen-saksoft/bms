import { config as envConfig } from "dotenv";
envConfig();

const _config = {
  port: process.env.PORT || 5000,
  dbUrl: process.env.MONGODB_URI as string,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
  hashingSecret: process.env.HASH_SECRET as string,
  emailId: process.env.NODEMAILER_EMAIL as string,
  emailClientId: process.env.NODEMAILER_EMAIL_CLIENT_ID as string,
  emailClientSecret: process.env.NODEMAILER_EMAIL_CLIENT_SECRET as string,
  emailClientRefreshToken: process.env.NODEMAILER_EMAIL_REFRESH_TOKEN as string,
  redisHost: process.env.REDIS_HOST as string,
  redisPort: (process.env.REDIS_PORT || "6379") as string,
  frontEndUrl: process.env.FRONTEND_URL as string,
  razorpayKey: process.env.RAZORPAY_API_KEY as string,
  razorpaySecret: process.env.RAZORPAY_API_SECRET as string,
};

export const config = Object.freeze(_config);
