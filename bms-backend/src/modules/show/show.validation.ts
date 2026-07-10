import { z } from "zod";

export const ShowSchema = z.object({
  movie: z
    .string("Movie ID is required")
    .min(1, { message: "Movie ID is required" }),
  theater: z
    .string("Theater ID is required")
    .min(1, { message: "Theater ID is required" }),
  location: z
    .string("Location is required")
    .min(1, { message: "Location is required" }),
  format: z.enum(["2D", "3D", "IMAX", "PVR PXL"], {
    message: "Invalid format",
  }),
  audioType: z.string().optional(),
  startTime: z
    .string("Start time is required")
    .min(1, { message: "Start time is required" }),
  date: z.string("Date is required").min(1, { message: "Date is required" }),
  priceMap: z.record(z.number(), z.string(), {
    error: "Price map is required",
  }),
  seatLayout: z.array(
    z.object({
      row: z.string("Row is required").min(1, { message: "Row is required" }),
      seatNumber: z
        .number("Seat number is required")
        .min(1, { message: "Seat number is required" }),
      status: z.enum(["AVAILABLE", "BOOKED", "BLOCKED"], {
        message: "Invalid seat status",
      }),
    }),
  ),
});
