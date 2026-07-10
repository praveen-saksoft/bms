import mongoose, { Schema } from "mongoose";
import type { IMovie } from "./movie.interface";

const MovieSchema: Schema<IMovie> = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
    },
    genre: {
      type: [String],
      required: [true, "Genre is required"],
    },
    releaseDate: {
      type: Date,
      required: [true, "Release date is required"],
    },
    languages: {
      type: [String],
      required: [true, "Languages are required"],
    },
    certification: {
      type: String,
      required: [true, "Certification is required"],
    },
    posterUrl: {
      type: String,
      required: [true, "Poster URL is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
    },
    votes: {
      type: Number,
      required: [true, "Votes is required"],
    },
    format: {
      type: [String],
      default: ["2D"],
    },
  },
  {
    timestamps: true,
  },
);

export const MovieModel = mongoose.model<IMovie>("Movie", MovieSchema);
