"use server";

import { apiClient } from "@/services/apiClient";
import { AxiosRequestConfig } from "axios";
import { cookies } from "next/headers";
export async function deleteToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}
// TODO: edit type
export async function verifyToken(): Promise<{
  isAuthenticated: boolean;
  user: null | {
    id?: any;
    name?: any;
    role?: any;
  };
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  console.log(token?.value);
  if (!token) {
    return {
      isAuthenticated: false,
      user: null,
    };
  }

  try {
    const options: AxiosRequestConfig = {
      url: "/auth/verifyToken",
      method: "GET",
      headers: {
        token: token.value,
      },
    };

    const { data } = await apiClient.request(options);

    if (data.message === "verified") {
      return {
        isAuthenticated: true,
        user: {
          id: data.decoded.id,
          name: data.decoded.name,
          role: data.decoded.role,
        },
      };
    } else {
      return {
        isAuthenticated: false,
        user: null,
      };
    }
  } catch (error) {
    return {
      isAuthenticated: false,
      user: null,
    };
  }
}
