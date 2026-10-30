"use server";

import { AxiosRequestConfig, isAxiosError } from "axios";
import z from "zod";
import { cookies } from "next/headers";
import { apiClient } from "@/services/apiClient";
import { loginSchema, loginValues } from "../schemas/login.schema";

type LoginFieldErrors = Partial<Record<keyof loginValues, string[]>>;
type LoginApiResponse = {
  message: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
  token: string;
};
type LoginSuccess = {
  success: true;
  message: string;
  data: {
    user: LoginApiResponse["user"];
  };
};

type LoginFailure = {
  success: false;
  message: string;
  fieldErrors?: LoginFieldErrors;
};

export type LoginActionReturn = LoginSuccess | LoginFailure;

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
    const { data } = await apiClient<LoginApiResponse>(option);

    const cookieStore = await cookies();
    cookieStore.set("token", data.token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7 * 30,
    });

    return {
      success: true,
      message: data.message ?? "Signed in successfully.",
      data: { user: data.user },
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
