import { Document, Types } from "mongoose";

export interface IOtpPayload {
  email: string;
  code: string;
}

export interface IRefreshTokenPayload {
  token: string;
  userId: Types.ObjectId;
}

export interface ITokenPayload {
  id: string;
  email?: string;
  phone?: string;
  role?: string;
}
