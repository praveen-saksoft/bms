import jwt, { JwtPayload } from "jsonwebtoken";
import { ITokenPayload } from "./auth.interface";
import { config } from "../../config/config";
import { RefreshTokenModel } from "./refresh.model";

// Generate Access Token and Refresh Token
export const generateToken = (
  payload: ITokenPayload,
): { accessToken: string; refreshToken: string } => {
  const accessToken = jwt.sign(payload, config.accessTokenSecret, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign(payload, config.refreshTokenSecret, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

// Store refresh token in db
export const storeRefreshToken = async (
  userId: string,
  refreshToken: string,
): Promise<void> => {
  try {
    await RefreshTokenModel.create({ userId, token: refreshToken });
  } catch (error) {
    throw error;
  }
};

// verify access token
export const verifyAccessToken = <T extends ITokenPayload | JwtPayload>(
  token: string,
): T => {
  return jwt.verify(token, config.accessTokenSecret) as T;
};

// verify access token
export const verifyRefreshToken = <T extends ITokenPayload | JwtPayload>(
  token: string,
): T => {
  return jwt.verify(token, config.refreshTokenSecret) as T;
};

// DB Operations on refresh token
export const findRefreshToken = async (
  userId: string,
  token: string,
): Promise<{ userId: string; token: string } | null> => {
  return await RefreshTokenModel.findOne({ userId, token });
};

export const deleteRefreshToken = async (
  token: string,
): Promise<{ userId: string; token: string } | null> => {
  return await RefreshTokenModel.findOneAndDelete({ token });
};

export const updateRefreshToken = async (
  userId: string,
  newToken: string,
): Promise<void> => {
  try {
    await RefreshTokenModel.updateOne(
      { userId },
      { token: newToken },
      { upsert: true },
    );
  } catch (error) {
    throw error;
  }
};
