import { NextFunction, Request, Response } from "express";
import * as UserService from "./user.service";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await UserService.createUserService(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await UserService.getAllUsersService();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await UserService.getUserByIdService(req.params.id);

    if (!user) {
      next(new Error("User not found", { cause: { statusCode: 404 } }));
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const activateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const updateData = req.body;
    updateData.activateUser = true;
    const updatedUser = await UserService.activateUserService(req.params.id, updateData);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};
