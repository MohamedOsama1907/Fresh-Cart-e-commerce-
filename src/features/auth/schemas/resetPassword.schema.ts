import z from "zod";

export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .min(1, { error: "Email is required." })
      .pipe(z.email({ error: "Enter a valid email address." })),
    newPassword: z
      .string()
      .min(8, { error: "Password must be at least 8 characters long." })
      .regex(/[A-Z]/, { error: "Password must contain an uppercase letter." })
      .regex(/[a-z]/, { error: "Password must contain a lowercase letter." })
      .regex(/[0-9]/, { error: "Password must contain a number." })
      .regex(/[@$#%^&*!_]/, {
        error: "Password must contain a special character (@, #, $, %, ^, &, *, !, or _).",
      }),
    confirmPassword: z.string().min(1, { error: "Please confirm your password." }),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    error: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
