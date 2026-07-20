import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

import * as TokenService from "../modules/auth/token.service";
import * as UserService from "../modules/user/user.service";
import type { IUser } from "../modules/user/user.interface";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const isVerifiedUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      next(createHttpError(401, "Access token is missing"));
      return;
    }

    const decodedToken = TokenService.verifyAccessToken(accessToken);

    const user = await UserService.getUserByIdService(decodedToken._id);

    if (!user) {
      next(createHttpError(404, "User not found"));
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    next(createHttpError(401, "Invalid or expired token"));
  }
};
