"use server";

import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { apiClient } from "@/services/apiClient";
import { createReviewSchema, type createReviewValues } from "../schemas/createReview.schema";

type ReviewFieldErrors = Partial<Record<keyof createReviewValues, string[]>>;

export type CreateReviewActionResult =
  | { success: true }
  | { success: false; message: string; fieldErrors?: ReviewFieldErrors };

export async function createReviewAction(
  productId: string,
  values: createReviewValues,
): Promise<CreateReviewActionResult> {
  if (!productId.trim()) {
    return { success: false, message: "This product could not be identified." };
  }

  const validation = createReviewSchema.safeParse(values);
  if (!validation.success) {
    const { formErrors, fieldErrors } = validation.error.flatten();
    const typedFieldErrors = fieldErrors as ReviewFieldErrors;

    return {
      success: false,
      message:
        formErrors[0] ??
        typedFieldErrors.review?.[0] ??
        typedFieldErrors.rating?.[0] ??
        "Please check your review and try again.",
      fieldErrors: typedFieldErrors,
    };
  }

  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return { success: false, message: "Sign in to submit a product review." };
  }

  try {
    await apiClient.post(
      `/products/${encodeURIComponent(productId)}/reviews`,
      validation.data,
      {
        headers: {
          token,
          "Content-Type": "application/json",
        },
      },
    );

    return { success: true };
  } catch (error) {
    if (isAxiosError(error)) {
      const message = error.response?.data?.message;
      return {
        success: false,
        message:
          typeof message === "string" && message.trim()
            ? message
            : "We couldn't submit your review. Please try again.",
      };
    }

    return {
      success: false,
      message: "We couldn't submit your review. Please try again.",
    };
  }
}
