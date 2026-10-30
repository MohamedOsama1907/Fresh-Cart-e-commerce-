"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  IconUser,
  IconLock,
  IconDeviceFloppy,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import type { appState } from "@/store/store";
import { authActions } from "@/features/auth/slices/auth.slice";
import {
  updateProfile,
  changePassword,
  getMe,
} from "../server/profile.actions";

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: appState) => state.authReducer);

  // Profile Form State
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Load detailed profile on mount if available
  useEffect(() => {
    let isMounted = true;
    getMe().then((data) => {
      if (!isMounted || !data) return;
      if (data.name) setName(data.name);
      if (data.email) setEmail(data.email);
      if (data.phone) setPhone(data.phone);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Update Profile Submit
  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const res = await updateProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });

      if (res.success) {
        toast.success(res.message);
        if (res.user) {
          dispatch(
            authActions.setAuthStates({
              isAuthenticated: true,
              user: {
                id: user?.id,
                name: res.user.name,
                email: res.user.email,
                role: user?.role,
              },
            }),
          );
        }
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("An unexpected error occurred while saving profile.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Change Password Submit
  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await changePassword({
        currentPassword,
        password: newPassword,
        rePassword: confirmPassword,
      });

      if (res.success) {
        toast.success(res.message);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("An unexpected error occurred while changing password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Account Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Update your profile information and change your password
        </p>
      </div>

      {/* Card 1: Profile Information */}
      <section
        aria-labelledby="profile-information-heading"
        className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-3.5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100/70 text-primary-600">
            <IconUser size={22} stroke={2} />
          </div>
          <div>
            <h2
              id="profile-information-heading"
              className="text-base font-bold text-slate-900">
              Profile Information
            </h2>
            <p className="text-xs text-slate-500">
              Update your personal details
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label
              htmlFor="fullName"
              className="mb-1.5 block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div>
            <label
              htmlFor="emailAddress"
              className="mb-1.5 block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              id="emailAddress"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="mb-1.5 block text-sm font-medium text-slate-700">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01xxxxxxxxx"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:opacity-60">
              <IconDeviceFloppy size={18} stroke={2} />
              {isUpdatingProfile ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        {/* Account Information Details */}
        <div className="mt-8 border-t border-slate-100 pt-6">
          <h3 className="mb-4 text-sm font-bold text-slate-900">
            Account Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-500">User ID</span>
              <span className="font-mono text-xs text-slate-700 sm:text-sm">
                {user?.id ?? "—"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-500">Role</span>
              <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-emerald-800">
                {user?.role ?? "User"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Card 2: Change Password */}
      <section
        aria-labelledby="change-password-heading"
        className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-3.5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100/80 text-amber-600">
            <IconLock size={22} stroke={2} />
          </div>
          <div>
            <h2
              id="change-password-heading"
              className="text-base font-bold text-slate-900">
              Change Password
            </h2>
            <p className="text-xs text-slate-500">
              Update your account password
            </p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label
              htmlFor="currentPassword"
              className="mb-1.5 block text-sm font-medium text-slate-700">
              Current Password
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 pr-11 text-sm text-slate-800 placeholder-slate-400 transition focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                aria-label={
                  showCurrentPassword ? "Hide password" : "Show password"
                }
                className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600">
                {showCurrentPassword ? (
                  <IconEyeOff size={18} />
                ) : (
                  <IconEye size={18} />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="mb-1.5 block text-sm font-medium text-slate-700">
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 pr-11 text-sm text-slate-800 placeholder-slate-400 transition focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                aria-label={
                  showNewPassword ? "Hide password" : "Show password"
                }
                className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600">
                {showNewPassword ? (
                  <IconEyeOff size={18} />
                ) : (
                  <IconEye size={18} />
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Must be at least 6 characters
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-sm font-medium text-slate-700">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 pr-11 text-sm text-slate-800 placeholder-slate-400 transition focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600">
                {showConfirmPassword ? (
                  <IconEyeOff size={18} />
                ) : (
                  <IconEye size={18} />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:opacity-60">
              <IconLock size={18} stroke={2} />
              {isChangingPassword ? "Updating..." : "Change Password"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
