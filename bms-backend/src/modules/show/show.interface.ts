import { type Document, Types } from "mongoose";

export type TShowFormat = "2D" | "3D" | "IMAX" | "PVR PXL";

export type TSeatStatus = "AVAILABLE" | "BOOKED" | "BLOCKED";

export interface ISeat {
  number: number;
  status: TSeatStatus;
}

export interface ISeatRow {
  row: string;
  seats: ISeat[];
}

export interface IShow extends Document {
  movie: Types.ObjectId;
  theater: Types.ObjectId;
  location: string;
  format: TShowFormat;
  audioType?: string;
  startTime: string;
  date: string;
  priceMap: Map<string, number>;
  seatLayout: ISeatRow[];
  createdAt?: Date;
  updatedAt?: Date;
}
