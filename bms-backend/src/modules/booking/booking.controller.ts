import { NextFunction, Request, Response } from "express";
import * as BookingService from "./booking.service";

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const booking = await BookingService.createBooking({
      ...req.body,
      userId: req.user?._id,
    });
    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bookings = await BookingService.getAllBookings(req.user?._id!);
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};
