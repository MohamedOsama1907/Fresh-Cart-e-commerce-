import z from "zod";

export const verifyResetCodeSchema = z.object({
  resetCode: z.string().regex(/^\d{6}$/, {
    error: "Enter the 6-digit reset code from your email.",
  }),
});

export type VerifyResetCodeValues = z.infer<typeof verifyResetCodeSchema>;
