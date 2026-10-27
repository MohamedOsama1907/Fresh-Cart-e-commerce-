"use server";

import { AxiosRequestConfig, isAxiosError } from "axios";
import z from "zod";
import { apiClient } from "@/services/apiClient";
import { loginSchema, loginValues } from "../schemas/login.schema";

type LoginFieldErrors = Partial<Record<keyof loginValues, string[]>>;

type LoginActionReturn = {
  success: boolean;
  message: string;
  fieldErrors?: LoginFieldErrors;
};

export async function loginAction(
  values: loginValues,
): Promise<LoginActionReturn> {
  const validationResult = loginSchema.safeParse(values);

  if (!validationResult.success) {
    const { formErrors, fieldErrors } = z.flattenError(validationResult.error);
    return {
      success: false,
      message: formErrors[0] ?? "Something went wrong. Please try again.",
      fieldErrors,
    };
  }

  try {
    const option: AxiosRequestConfig = {
      method: "POST",
      url: "/auth/signin",
      data: validationResult.data,
    };
    const response = await apiClient(option);

    return {
      success: true,
      message: response.data.message ?? "Signed in successfully.",
    };
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ??
          "Unable to sign in. Check your details and try again.",
      };
    }

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
