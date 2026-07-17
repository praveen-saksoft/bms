import mongoose, { Schema } from "mongoose";
import type { IUser } from "./user.interface";

const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: Number,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    activateUser: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const UserModel = mongoose.model<IUser>("User", UserSchema);
