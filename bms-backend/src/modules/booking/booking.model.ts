import mongoose, { Schema } from "mongoose";
import {
  EBookingStatus,
  type IBookingFee,
  type IBooking,
} from "./booking.interface";

const FeeSchema: Schema<IBookingFee> = new Schema({
  ticketPrice: { type: Number, required: true },
  convenience: { type: Number, required: true },
  total: { type: Number, required: true },
});

const BookingSchema: Schema<IBooking> = new Schema(
  {
    bookingRef: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    showId: {
      type: Schema.Types.ObjectId,
      ref: "Show",
      required: true,
      index: true,
    },
    seats: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(EBookingStatus),
      required: true,
      default: "CONFIRMED",
    },
    bookingDateTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    paymentId: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    bookingFee: FeeSchema,
  },
  { timestamps: true },
);

BookingSchema.pre("save", function () {
  this.seats.sort();
});

export const BookingModel = mongoose.model<IBooking>("Booking", BookingSchema);
