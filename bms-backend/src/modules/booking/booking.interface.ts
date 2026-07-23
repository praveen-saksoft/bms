import mongoose from "mongoose";

export const EBookingStatus = {
  conf: "CONFIRMED",
  fail: "FAILED",
  canc: "CANCELLED",
} as const;

export type TBookingStatus =
  (typeof EBookingStatus)[keyof typeof EBookingStatus];

export interface IBookingFee {
  ticketPrice: number;
  convenience: number;
  total: number;
}

export interface IBooking {
  bookingRef: string;
  userId: mongoose.Types.ObjectId;
  showId: mongoose.Types.ObjectId;
  seats: string[];
  status: TBookingStatus;
  bookingDateTime: Date;
  paymentId: string;
  paymentMethod: string;
  bookingFee: IBookingFee;
}
