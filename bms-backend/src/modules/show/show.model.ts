import mongoose, { Schema } from "mongoose";
import type { ISeat, ISeatRow, IShow } from "./show.interface";

const SeatItemSchema: Schema<ISeat> = new Schema({
  number: { type: Number, required: true },
  status: {
    type: String,
    enum: ["AVAILABLE", "BOOKED", "BLOCKED"],
    default: "AVAILABLE",
  },
});

const RowSchema: Schema<ISeatRow> = new Schema({
  row: String,
  type: String,
  price: { type: Number, required: true },
  seats: [SeatItemSchema],
});

const ShowSchema: Schema<IShow> = new Schema(
  {
    movie: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
    theater: { type: Schema.Types.ObjectId, ref: "Theater", required: true },
    location: { type: String, required: true },
    format: {
      type: String,
      enum: ["2D", "3D", "IMAX", "PVR PXL"],
      required: true,
    },
    audioType: { type: String, default: "Dolby Atmos" },
    startTime: { type: String, required: true },
    date: { type: String, required: true },
    priceMap: { type: Map, of: Number, required: true, default: new Map() },
    seatLayout: [RowSchema],
  },
  {
    timestamps: true,
  },
);

export const ShowModel = mongoose.model<IShow>("Show", ShowSchema);
