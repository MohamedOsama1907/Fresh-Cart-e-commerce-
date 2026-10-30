"use server";

import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { apiClient } from "@/services/apiClient";
import { createReviewSchema, type createReviewValues } from "../schemas/createReview.schema";

export type ReviewActionResult =
  | { success: true }
  | { success: false; message: string };

function failureMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.trim()) return message;
  }

  return "We couldn't save your review change. Please try again.";
}

export async function updateReviewAction(
  reviewId: string,
  values: createReviewValues,
): Promise<ReviewActionResult> {
  if (!reviewId.trim()) {
    return { success: false, message: "This review could not be identified." };
  }

  const validation = createReviewSchema.safeParse(values);
  if (!validation.success) {
    return { success: false, message: "Enter a review and choose a rating from 1 to 5 stars." };
  }

  const token = (await cookies()).get("token")?.value;
  if (!token) return { success: false, message: "Sign in to update your review." };

  try {
    await apiClient.put(
      `/reviews/${encodeURIComponent(reviewId)}`,
      validation.data,
      { headers: { token, "Content-Type": "application/json" } },
    );

    return { success: true };
  } catch (error) {
    return { success: false, message: failureMessage(error) };
  }
}

export async function deleteReviewAction(reviewId: string): Promise<ReviewActionResult> {
  if (!reviewId.trim()) {
    return { success: false, message: "This review could not be identified." };
  }

  const token = (await cookies()).get("token")?.value;
  if (!token) return { success: false, message: "Sign in to delete this review." };

  try {
    await apiClient.delete(`/reviews/${encodeURIComponent(reviewId)}`, {
      headers: { token },
    });

    return { success: true };
  } catch (error) {
    return { success: false, message: failureMessage(error) };
  }
}
