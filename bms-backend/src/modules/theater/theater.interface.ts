import type { Document } from "mongoose";

export interface ITheater extends Document {
  name: string;
  location: string;
  logo: string;
  city: string;
  state: string;
}
