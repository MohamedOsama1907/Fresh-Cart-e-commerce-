import z from "zod";

export const createReviewSchema = z.object({
  review: z.string().trim().min(1, { error: "Please write a review." }),
  rating: z
    .number()
    .int({ error: "Choose a whole-star rating." })
    .min(1, { error: "Choose a rating from 1 to 5 stars." })
    .max(5, { error: "Choose a rating from 1 to 5 stars." }),
});

export type createReviewValues = z.infer<typeof createReviewSchema>;
