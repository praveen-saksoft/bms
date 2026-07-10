import { z } from "zod";

export const TheaterSchema = z.object({
  name: z.string("Name is required").min(1, { message: "Name is required" }),
  location: z
    .string("Location is required")
    .min(1, { message: "Location is required" }),
  logo: z.string("Logo is required").min(1, { message: "Logo is required" }),
  city: z.string("City is required").min(1, { message: "City is required" }),
  state: z.string("State is required").min(1, { message: "State is required" }),
});

export type TheaterInput = z.infer<typeof TheaterSchema>;
