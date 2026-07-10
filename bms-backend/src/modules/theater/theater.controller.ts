import { NextFunction, Request, Response } from "express";
import * as TheaterService from "./theater.service";

export const createTheater = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const theater = await TheaterService.createTheaterService(req.body);
    res.status(201).json(theater);
  } catch (error) {
    next(error);
  }
};

export const getTheaters = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { state } = req.query;
    let theaters;
    if (state) {
      theaters = await TheaterService.getTheatersByStateService(
        state as string,
      );
    } else {
      theaters = await TheaterService.getAllTheatersService();
    }

    res.status(200).json(theaters);
  } catch (error) {
    next(error);
  }
};

export const getTheaterById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const theater = await TheaterService.getTheaterByIdService(req.params.id);
    if (!theater) {
      next(new Error("Theater not found", { cause: { statusCode: 404 } }));
      return;
    }
    res.status(200).json(theater);
  } catch (error) {
    next(error);
  }
};
