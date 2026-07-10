import mongoose, { Schema } from "mongoose";
import type { ITheater } from "./theater.interface";

const TheaterSchema: Schema<ITheater> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    logo: {
      type: String,
      required: [true, "Logo is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
  },
  { timestamps: true },
);

export const TheaterModel = mongoose.model<ITheater>("Theater", TheaterSchema);
