import z from "zod";

export const supportSchema = z.object({
  name: z.string().trim().min(1, { error: "Full name is required" }),
  email: z
    .string()
    .min(1, { error: "Email address is required" })
    .pipe(z.email({ error: "Email address is invalid. Please try again." })),
  subject: z.string().min(1, { error: "Please select a subject" }),
  message: z
    .string()
    .trim()
    .min(10, { error: "Message must be at least 10 characters" })
    .max(2000, { error: "Message must be 2000 characters or fewer" }),
});

export type SupportValues = z.infer<typeof supportSchema>;
