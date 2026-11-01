"use server";

import { isAxiosError } from "axios";
import z from "zod";
import { apiClient } from "@/services/apiClient";
import {
  forgotPasswordSchema,
  ForgotPasswordValues,
} from "../schemas/forgotPassword.schema";

type ForgotPasswordActionReturn = {
  success: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof ForgotPasswordValues, string[]>>;
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

export async function forgotPasswordAction(
  values: ForgotPasswordValues,
): Promise<ForgotPasswordActionReturn> {
  const validationResult = forgotPasswordSchema.safeParse(values);

  if (!validationResult.success) {
    const { formErrors, fieldErrors } = z.flattenError(validationResult.error);
    return {
      success: false,
      message: formErrors[0] ?? "Please check the email address.",
      fieldErrors,
    };
  }

  try {
    const { data } = await apiClient.post<unknown>(
      "/auth/forgotPasswords",
      validationResult.data,
    );

    return {
      success: true,
      message: getResponseMessage(data) ?? "Request completed successfully.",
    };
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        success: false,
        message:
          getResponseMessage(error.response?.data) ??
          "Unable to send the reset code. Please try again.",
      };
    }

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
