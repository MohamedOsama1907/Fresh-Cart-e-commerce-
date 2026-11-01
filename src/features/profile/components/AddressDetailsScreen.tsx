"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { IconArrowLeft, IconBuilding, IconMapPin, IconPhone } from "@tabler/icons-react";
import Error from "@/components/Error/Error";
import Loader from "@/components/Loader/Loader";
import { getAddressById } from "../server/profile.actions";
import type { appState } from "@/store/store";

interface AddressDetailsScreenProps {
  addressId: string;
}

export default function AddressDetailsScreen({
  addressId,
}: AddressDetailsScreenProps) {
  const { isAuthenticated, user } = useSelector(
    (state: appState) => state.authReducer,
  );
  const userId = user?.id ?? user?.email;
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["getSpecificAddress", userId, addressId],
    queryFn: () => getAddressById(addressId),
    enabled: Boolean(isAuthenticated && userId && addressId),
    refetchOnMount: false,
    staleTime: 60_000,
  });
  const address = data?.data;

  if (isLoading) return <Loader message="Loading address..." />;

  if (isError) {
    return (
      <Error
        title="This address is unavailable"
        message={error.message}
        onRetry={() => void refetch()}
      />
    );
  }

  if (!address) {
    return (
      <Error
        title="This address is unavailable"
        message="We couldn't find the address you requested."
      />
    );
  }

  return (
    <section aria-labelledby="address-title" className="space-y-5">
      <Link
        href="/profile/myaddresses"
        className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-primary-700 transition hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
      >
        <IconArrowLeft size={17} aria-hidden="true" />
        Back to addresses
      </Link>

      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
        <h1 id="address-title" className="text-xl font-bold text-slate-900 sm:text-2xl">
          {address.name}
        </h1>
        <dl className="mt-6 space-y-5">
          <div>
            <dt className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <IconMapPin size={17} aria-hidden="true" />
              Address
            </dt>
            <dd className="mt-1 pl-6 text-sm leading-6 text-slate-800">
              {address.details}
            </dd>
          </div>
          <div>
            <dt className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <IconBuilding size={17} aria-hidden="true" />
              City
            </dt>
            <dd className="mt-1 pl-6 text-sm text-slate-800">{address.city}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <IconPhone size={17} aria-hidden="true" />
              Phone
            </dt>
            <dd className="mt-1 pl-6 text-sm text-slate-800">{address.phone}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
