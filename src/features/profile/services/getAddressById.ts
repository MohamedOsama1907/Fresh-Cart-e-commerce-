import "server-only";

import { apiClient } from "@/services/apiClient";
import type { AddressApiResponse } from "../types/profile.types";

export async function getAddressById(
  addressId: string,
  token: string,
): Promise<AddressApiResponse> {
  const { data } = await apiClient.get<AddressApiResponse>(
    `/addresses/${addressId}`,
    { headers: { token } },
  );
  return data;
}
