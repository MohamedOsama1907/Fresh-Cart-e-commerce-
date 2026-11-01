"use server";

import { isAxiosError } from "axios";
import z from "zod";
import { apiClient } from "@/services/apiClient";
import {
  verifyResetCodeSchema,
  VerifyResetCodeValues,
} from "../schemas/verifyResetCode.schema";

type VerifyResetCodeActionReturn = {
  success: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof VerifyResetCodeValues, string[]>>;
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

export async function verifyResetCodeAction(
  values: VerifyResetCodeValues,
): Promise<VerifyResetCodeActionReturn> {
  const validationResult = verifyResetCodeSchema.safeParse(values);

  if (!validationResult.success) {
    const { formErrors, fieldErrors } = z.flattenError(validationResult.error);
    return {
      success: false,
      message: formErrors[0] ?? "Enter a valid reset code.",
      fieldErrors,
    };
  }

  try {
    const { data } = await apiClient.post<unknown>(
      "/auth/verifyResetCode",
      validationResult.data,
    );

    return {
      success: true,
      message: getResponseMessage(data) ?? "Reset code verified successfully.",
    };
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        success: false,
        message:
          getResponseMessage(error.response?.data) ??
          "Unable to verify the reset code. Check it and try again.",
      };
    }

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
