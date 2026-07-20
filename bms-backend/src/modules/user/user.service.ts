import { Types } from "mongoose";
import type { IUser } from "./user.interface";
import { UserModel } from "./user.model";

// Create User
export const createUserService = async (user: IUser): Promise<IUser> => {
  return await UserModel.create(user);
};

// Get All Users
export const getAllUsersService = async (): Promise<IUser[]> => {
  return await UserModel.find();
};

// Get user by ID
export const getUserByIdService = async (id: string): Promise<IUser | null> => {
  return await UserModel.findById(id);
};

// Get user by email
export const getUserByEmailService = async (
  email: string,
): Promise<IUser | null> => {
  return await UserModel.findOne({ email });
};

// Activate User
export const activateUserService = async (
  id: string,
  updateData: Partial<IUser>,
): Promise<IUser | null> => {
  const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
    returnDocument: "after",
  });

  if (!updatedUser) {
    throw new Error("User not found", { cause: { errorCode: 404 } });
  }
  return updatedUser;
};
