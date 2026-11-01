import z from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { error: "Email is required." })
    .pipe(z.email({ error: "Enter a valid email address." })),
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
