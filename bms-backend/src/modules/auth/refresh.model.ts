import mongoose, { Schema } from "mongoose";
import type { IRefreshTokenPayload } from "./auth.interface";

const RefreshTokenSchema: Schema<IRefreshTokenPayload> = new Schema(
  {
    token: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export const RefreshTokenModel = mongoose.model<IRefreshTokenPayload>(
  "RefreshToken",
  RefreshTokenSchema,
);
