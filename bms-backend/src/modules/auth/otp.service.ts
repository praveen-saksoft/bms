import crypto from "node:crypto";
import nodemailer, { type SendMailOptions } from "nodemailer";
import Mailgen from "mailgen";

import { config } from "../../config/config";

// Generate OTP
export const generateOTP = () => {
  const otp = crypto.randomInt(1000, 9999);
  return otp;
};

// has OTP
export const hashOTP = (data: string) => {
  if (!config.hashingSecret) {
    throw new Error("Hashing secret is not defined");
  }

  return crypto
    .createHmac("sha256", config.hashingSecret)
    .update(data)
    .digest("hex");
};

// verify OTP
export const verifyOTP = (hashedOtp: string, data: string) => {
  const newHashedOtp = hashOTP(data);
  return newHashedOtp === hashedOtp;
};

// send otp to user via email;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: config.emailId,
    clientId: config.emailClientId,
    clientSecret: config.emailClientSecret,
    refreshToken: config.emailClientRefreshToken,
  },
});

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "BookMyScreen",
    link: "https://next-fullstack-brown.vercel.app",
    logo: "https://res.cloudinary.com/amritrajmaurya/image/upload/v1751475322/zu4fnmh2jljzbtey77ah.png",
  },
});

export const sendOtpToEmail = async (email: string, otp: number) => {
  const emailTemp: any = {
    body: {
      name: "",
      intro:
        "Welcome to BookMyScreen! We're very excited to have you on board.",
      action: {
        instructions: "To verify your account, please use the following OTP:",
        button: {
          color: "#323232", // Optional action button color
          text: otp,
          link: "#",
        },
      },
      outro:
        "This OTP will expire in a short time (2 mins) for security reasons. If you did not request this OTP, please ignore this email.",
    },
  };

  const mail = mailGenerator.generate(emailTemp);

  const message: SendMailOptions = {
    from: config.emailId,
    to: email,
    subject: "Your OTP for BookMyScreen",
    html: mail,
  };

  const res = await transporter.sendMail(message);
  return res.messageId;
};
