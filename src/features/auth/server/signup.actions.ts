"use server";

import z from "zod";
import { signupSchema, signupValues } from "../schemas/signup.shcema";
import { AxiosRequestConfig, isAxiosError } from "axios";
import { apiClient } from "@/services/apiClient";
type SignupFieldErrors = Partial<Record<keyof signupValues, string[]>>;
type signupActionReturn = {
  success: boolean;
  message: string;
  fieldErrors?: SignupFieldErrors;
};
export async function signupAction(
  values: signupValues,
): Promise<signupActionReturn> {
  const validationResult = signupSchema.safeParse(values);

  if (!validationResult.success) {
    const { formErrors, fieldErrors } = z.flattenError(validationResult.error);
    return {
      success: false,
      message: formErrors[0] ?? "something went wrong",
      fieldErrors,
    };
  }
  try {
    const option: AxiosRequestConfig = {
      method: "POST",
      url: "/auth/signup",
      data: validationResult.data,
    };
    await apiClient(option);
    return {
      success: true,
      message: "account created successfully",
    };
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data.message ?? "something went wrong",
      };
    }
    return {
      success: false,
      message: "something went wrong",
    };
  }
}
