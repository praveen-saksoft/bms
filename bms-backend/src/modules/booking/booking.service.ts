import mongoose from "mongoose";
import Razorpay from "razorpay";
import createHttpError from "http-errors";
import { IBooking } from "./booking.interface";
import { generateBooingRef } from "../../utils";
import { BookingModel } from "./booking.model";
import { config } from "../../config/config";
import { updateSeatStatusService } from "../show/show.service";

// create booking
export const createBooking = async (bookingData: IBooking) => {
  //
  const { showId, seats, paymentId, bookingFee, userId } = bookingData;
  //
  if (!showId || !seats?.length || !paymentId || !bookingFee) {
    throw createHttpError(400, "Invalid booking data");
  }

  const bookingRef = generateBooingRef();

  // Start DB Transaction: Protects against the race conditions
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check is any of the requested seats are already booked

    const existingBooking = await BookingModel.findOne({
      showId,
      status: "CONFIRMED",
      seats: { $in: seats },
    }).session(session);

    if (existingBooking) {
      throw createHttpError(
        400,
        "One or more of the requested seats are already booked!",
      );
    }

    const razorpay = new Razorpay({
      key_id: config.razorpayKey,
      key_secret: config.razorpaySecret,
    });
    const paymentDetails = await razorpay.payments.fetch(paymentId);

    if (paymentDetails.status !== "captured") {
      throw createHttpError(402, "Payment not successful");
    }

    await updateSeatStatusService(showId, seats, "BOOKED", session);

    const [booking] = await BookingModel.create(
      [
        {
          bookingRef,
          userId,
          showId,
          seats,
          status: "CONFIRMED",
          paymentId,
          paymentMethod: paymentDetails.method,
          bookingFee,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return booking;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const getAllBookings = async (userId: string) => {
  return await BookingModel.find({ userId })
    .populate({
      path: "showId",
      select: "startTime date audioType format",
      populate: [
        {
          path: "movie",
          select: "title posterUrl duration format certification",
        },
        {
          path: "theater",
          select: "name location city state",
        },
      ],
    })
    .sort({ createdAt: -1 });
};
