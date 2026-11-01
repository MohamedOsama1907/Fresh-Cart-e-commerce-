"use server";

import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import z from "zod";
import { createCashOrder } from "../services/createCashOrder";
import { checkoutShippingAddressSchema } from "../schemas/checkout.schema";
import type { CreateCashOrderInput } from "../types/checkout.types";

export type CreateCashOrderResult =
  | { success: true; message: string }
  | {
      success: false;
      message: string;
      fieldErrors?: Partial<Record<"city" | "details" | "phone" | "postalCode", string[]>>;
    };

function getResponseMessage(value: unknown): string | undefined {
  if (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof value.message === "string"
  ) {
    return value.message;
  }

  return undefined;
}

export async function createCashOrderAction(
  input: CreateCashOrderInput,
): Promise<CreateCashOrderResult> {
  if (!input.cartId.trim()) {
    return { success: false, message: "Your cart could not be identified." };
  }

  const validation = checkoutShippingAddressSchema.safeParse(
    input.shippingAddress,
  );
  if (!validation.success) {
    const { formErrors, fieldErrors } = z.flattenError(validation.error);
    return {
      success: false,
      message: formErrors[0] ?? "Check your shipping address details.",
      fieldErrors,
    };
  }

  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return { success: false, message: "Please sign in to place your order." };
  }

  try {
    const response = await createCashOrder(
      { cartId: input.cartId, shippingAddress: validation.data },
      token,
    );
    return {
      success: true,
      message: getResponseMessage(response) ?? "Your order has been placed.",
    };
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        success: false,
        message:
          getResponseMessage(error.response?.data) ??
          "Your order couldn't be placed. Please try again.",
      };
    }

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
