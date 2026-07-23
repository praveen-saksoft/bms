import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import * as PaymentService from "./payment.service";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const order = await PaymentService.createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const isVerified = await PaymentService.verifyPayment(req.body);
    if (!isVerified) {
      next(createHttpError(400, "Payment verification failed"));
      return;
    }

    res.status(200).json({
      success: true,
      message: "Payment verification successful",
    });
  } catch (error) {
    next(error);
  }
};
