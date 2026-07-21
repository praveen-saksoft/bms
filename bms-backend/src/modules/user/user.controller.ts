import { NextFunction, Request, Response } from "express";
import * as UserService from "./user.service";
import { IUser } from "./user.interface";

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
    res.status(200).json(req.user);
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
    const { name, mobile } = req.body as IUser;

    const updatedUser = await UserService.activateUserService(req.params.id, {
      name,
      mobile,
      activateUser: true,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};
