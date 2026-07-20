import { Request, Response, NextFunction } from "express";
import * as OtpService from "./otp.service";
import * as TokenService from "./token.service";
import * as UserService from "../user/user.service";
import createHttpError from "http-errors";
import { isValidEmail } from "../../utils";
import { IUser } from "../user/user.interface";

export const sentOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    if (!email) {
      const err = new createHttpError.BadRequest("Email is required");
      next(err);
      return;
    }

    if (!isValidEmail(email)) {
      const err = new createHttpError.BadRequest("Invalid email format");
      next(err);
      return;
    }

    // 1. Create OTP
    const otp = OtpService.generateOTP();
    // 2. Hash OTP with email;
    const ttl = 1000 * 60 * 2; //2min
    const expires = Date.now() + ttl;
    const data = `${email}.${otp}.${expires}`;
    const hashedOtp = OtpService.hashOTP(data);

    // 3. Send OTP to user's email
    try {
      await OtpService.sendOtpToEmail(email, otp);
    } catch (error) {
      const err = new createHttpError.InternalServerError(
        "Error sending OTP to email",
      );
      next(err);
      return;
    }

    // 4.Respond to client
    res.status(201).json({
      message: "OTP sent to email successfully ✅",
      email,
      hash: `${hashedOtp}.${expires}`,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, otp, hash } = req.body;
    if (!email || !otp || !hash) {
      const err = new createHttpError.BadRequest(
        "Missing required fields [email, otp, hash]",
      );
      next(err);
      return;
    }

    //1. OTP Verification
    const [hashedOtpData, expires] = hash.split(".");
    if (Date.now() > +expires) {
      const err = new createHttpError.Unauthorized("OTP Expired");
      next(err);
      return;
    }

    const data = `${email}.${otp}.${expires}`;
    const isValid = OtpService.verifyOTP(hashedOtpData, data);
    if (!isValid) {
      const err = new createHttpError.Unauthorized("Invalid OTP");
      next(err);
      return;
    }

    //2. Find or Create a new user;
    let user: IUser | null;
    try {
      user = await UserService.getUserByEmailService(email);
      if (!user) {
        user = await UserService.createUserService({
          name: email,
          email,
          role: "user",
        });
      }
    } catch (error) {
      next(error);
      return;
    }

    //3. Generate JWT
    const { accessToken, refreshToken } = TokenService.generateToken({
      _id: user._id as string,
      email: user.email,
    });

    //4. Store refresh token
    await TokenService.storeRefreshToken(user._id as string, refreshToken);

    //5. Sending token in cookie
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60, //1 hour
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24, //24 hours
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });

    res.status(200).json(user);
    //
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.cookies;
    // delete refresh token from db
    await TokenService.deleteRefreshToken(refreshToken);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    //
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};
