import z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { error: "email is required" })
    .pipe(z.email({ error: "email is invalid. please try another one" })),
  password: z.string().min(1, { error: "password is required" }),
});

export type loginValues = z.infer<typeof loginSchema>;
