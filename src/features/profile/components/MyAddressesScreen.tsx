"use client";

import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  IconMapPin,
  IconPlus,
  IconTrash,
  IconPhone,
  IconX,
  IconBuilding,
} from "@tabler/icons-react";
import Loader from "@/components/Loader/Loader";
import Error from "@/components/Error/Error";
import {
  getAddresses,
  addAddress,
  removeAddress,
} from "../server/profile.actions";
import type { AddAddressBody } from "../types/profile.types";

export default function MyAddressesScreen() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<AddAddressBody>({
    name: "",
    city: "",
    details: "",
    phone: "",
  });

  // Query addresses
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["getUserAddresses"],
    queryFn: getAddresses,
    refetchOnMount: false,
  });

  const addresses = response?.data ?? [];

  const handleOpenModal = () => {
    setFormData({ name: "", city: "", details: "", phone: "" });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setIsModalOpen(false);
    }
  };

  const handleAddSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter an address label (e.g. Home, Work).");
      return;
    }
    if (!formData.city.trim()) {
      toast.error("Please enter a city.");
      return;
    }
    if (!formData.details.trim()) {
      toast.error("Please enter detailed address information.");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter a phone number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await addAddress({
        name: formData.name.trim(),
        city: formData.city.trim(),
        details: formData.details.trim(),
        phone: formData.phone.trim(),
      });

      if (res.success) {
        toast.success(res.message);
        setIsModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ["getUserAddresses"] });
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("An unexpected error occurred while adding address.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await removeAddress(id);
      if (res.success) {
        toast.success(res.message);
        queryClient.invalidateQueries({ queryKey: ["getUserAddresses"] });
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to delete address.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            My Addresses
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your saved delivery addresses
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenModal}
          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700">
          <IconPlus size={18} stroke={2.5} />
          Add Address
        </button>
      </div>

      {/* Query State */}
      {isLoading ? (
        <Loader message="Loading addresses..." />
      ) : isError ? (
        <Error
          title="Addresses are unavailable"
          message={error.message}
          onRetry={() => void refetch()}
        />
      ) : addresses.length === 0 ? (
        /* Empty State (Matches Screenshot 1) */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm sm:p-20">
          <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <IconMapPin size={30} stroke={2} />
          </div>

          <h2 className="mb-2 text-lg font-bold text-slate-900">
            No Addresses Yet
          </h2>
          <p className="mb-7 max-w-sm text-sm leading-relaxed text-slate-500">
            Add your first delivery address to make checkout faster and easier.
          </p>

          <button
            type="button"
            onClick={handleOpenModal}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-primary-600/25 transition hover:bg-primary-700">
            <IconPlus size={18} stroke={2.5} />
            Add Your First Address
          </button>
        </div>
      ) : (
        /* Address Cards Grid */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address._id}
              className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-primary-200 hover:shadow-md">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
                    <IconMapPin size={14} stroke={2.2} />
                    {address.name}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDelete(address._id)}
                    disabled={deletingId === address._id}
                    aria-label={`Delete address ${address.name}`}
                    className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50">
                    <IconTrash size={16} stroke={2} />
                  </button>
                </div>

                <p className="mt-3 text-sm font-medium leading-relaxed text-slate-800">
                  {address.details}
                </p>

                <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <IconBuilding size={14} className="text-slate-400" />
                    {address.city}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono">
                    <IconPhone size={14} className="text-slate-400" />
                    {address.phone}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Address Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2
                  id="modal-title"
                  className="text-lg font-bold text-slate-900">
                  Add New Address
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Enter your delivery location details
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSubmitting}
                aria-label="Close modal"
                className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50">
                <IconX size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="addressName"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Address Label
                </label>
                <input
                  id="addressName"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Home, Office, Work"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="addressCity"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    City
                  </label>
                  <input
                    id="addressCity"
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="e.g. Cairo"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="addressPhone"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Phone Number
                  </label>
                  <input
                    id="addressPhone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="01xxxxxxxxx"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="addressDetails"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Street / Building Details
                </label>
                <textarea
                  id="addressDetails"
                  rows={3}
                  required
                  value={formData.details}
                  onChange={(e) =>
                    setFormData({ ...formData, details: e.target.value })
                  }
                  placeholder="e.g. 123 Main Street, Apt 4B, Building 2"
                  className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:opacity-50">
                  {isSubmitting ? "Saving..." : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
