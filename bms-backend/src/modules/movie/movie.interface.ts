import type { Document } from "mongoose";

export interface IMovie extends Document {
  title: string;
  description: string;
  duration: string;
  genre: string[];
  releaseDate: Date;
  languages: string[];
  certification: string;
  posterUrl: string;
  rating: number;
  votes: number;
  format?: string[];
}
