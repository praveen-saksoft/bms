import { z } from "zod";

export const MovieSchema = z
  .object({
    title: z.string("Title is required").min(1, "Title is required"),
    description: z
      .string("Description is required")
      .min(1, "Description is required"),
    duration: z.string("Duration is required").min(1, "Duration is required"),
    genre: z
      .array(z.string("Genre is required"))
      .nonempty("At least one genre is required"),
    releaseDate: z
      .string("Release date is required")
      .transform((val) => new Date(val)),
    languages: z
      .array(z.string("Language is required"))
      .nonempty("At least one language is required"),
    certification: z
      .string("Certification is required")
      .min(1, "Certification is required"),
    posterUrl: z.url("Poster URL must be a valid URL"),
    rating: z
      .number()
      .min(0, "Rating must be at least 0")
      .max(10, "Rating must be at most 10"),
    votes: z.number().min(0, "Votes must be at least 0"),
    format: z.array(z.string()).default(["2D"]),
  })
  .partial({ rating: true, votes: true, format: true });

export type MovieInput = z.infer<typeof MovieSchema>;
