"use server";

import { isAxiosError } from "axios";
import z from "zod";
import { apiClient } from "@/services/apiClient";
import {
  resetPasswordSchema,
  ResetPasswordValues,
} from "../schemas/resetPassword.schema";

type ResetPasswordField = keyof ResetPasswordValues;

export type ResetPasswordActionReturn = {
  success: boolean;
  message: string;
  fieldErrors?: Partial<Record<ResetPasswordField, string[]>>;
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

export async function resetPasswordAction(
  values: ResetPasswordValues,
): Promise<ResetPasswordActionReturn> {
  const validationResult = resetPasswordSchema.safeParse(values);

  if (!validationResult.success) {
    const { formErrors, fieldErrors } = z.flattenError(validationResult.error);
    return {
      success: false,
      message: formErrors[0] ?? "Please check your password details.",
      fieldErrors,
    };
  }

  const { email, newPassword } = validationResult.data;

  try {
    const { data } = await apiClient.put<unknown>("/auth/resetPassword", {
      email,
      newPassword,
    });

    return {
      success: true,
      message: getResponseMessage(data) ?? "Password reset successfully.",
    };
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        success: false,
        message:
          getResponseMessage(error.response?.data) ??
          "Unable to reset your password. Please try again.",
      };
    }

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
