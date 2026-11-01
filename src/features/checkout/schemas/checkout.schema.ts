import z from "zod";

export const checkoutShippingAddressSchema = z.object({
  city: z.string().trim().min(1, { error: "Enter your city." }),
  details: z.string().trim().min(1, { error: "Enter your street address." }),
  phone: z
    .string()
    .trim()
    .regex(/^01[0125][0-9]{8}$/, {
      error: "Enter a valid Egyptian mobile number.",
    }),
  postalCode: z.string().trim().min(1, { error: "Enter your postal code." }),
});

export type CheckoutShippingAddressValues = z.infer<
  typeof checkoutShippingAddressSchema
>;
