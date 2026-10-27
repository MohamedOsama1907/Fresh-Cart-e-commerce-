"use client";

import {
  IconAlertCircle,
  IconEye,
  IconEyeOff,
  IconLockFilled,
  IconMail,
  IconStarFilled,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginValues, loginSchema } from "../../schemas/login.schema";
import { loginAction } from "../../server/login.actions";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState, setError } = useForm<loginValues>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
  });

  const handleLogin: SubmitHandler<loginValues> = async (values) => {
    const response = await loginAction(values);

    if (response.success) {
      toast.success(response.message);
      router.push("/");
      return;
    }

    if (response.fieldErrors) {
      for (const [key, messages] of Object.entries(response.fieldErrors)) {
        if (messages?.[0]) {
          setError(key as keyof loginValues, { message: messages[0] });
        }
      }
    }

    setError("root", { message: response.message });
  };

  return (
    <div className="mx-auto my-5 w-full min-w-0 max-w-xl rounded-2xl bg-white px-4 py-7 shadow-lg sm:my-7 sm:px-7 sm:py-9 lg:my-8 lg:px-8">
      {/* Header */}
      <div className="mb-7 text-center sm:mb-9">
        <div className="mb-3 flex items-center justify-center sm:mb-4">
          <span className="text-2xl font-bold text-primary-600 sm:text-3xl">
            Fresh<span className="text-gray-800">Cart</span>
          </span>
        </div>
        <h1 className="mb-2 text-2xl font-bold leading-tight text-gray-800 sm:text-3xl">
          Welcome Back!
        </h1>
        <p className="text-sm leading-6 text-gray-600 sm:text-base">
          Sign in to continue your fresh shopping experience
        </p>
      </div>

      {/* Login Form */}
      <form
        className="space-y-5 sm:space-y-6"
        onSubmit={handleSubmit(handleLogin)}>
        {formState.errors.root?.message && (
          <div
            role="alert"
            aria-live="polite"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <IconAlertCircle
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-red-600"
            />
            <p className="leading-5">{formState.errors.root.message}</p>
          </div>
        )}

        <div className="flex min-w-0 flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              className="form-control min-h-11 w-full min-w-0 pl-11 text-sm transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-100 sm:text-base"
              placeholder="Enter your email"
              id="email"
              autoComplete="email"
              aria-invalid={Boolean(formState.errors.email)}
              {...register("email")}
            />
            <IconMail
              stroke={2}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
          {formState.errors.email?.message && (
            <p className="-mt-1 text-[13px] text-red-600">
              *{formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <div className="mb-0 flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700">
              Password
            </label>
            <Link
              href="/forget-password"
              className="text-sm font-medium text-primary-600 hover:text-primary-700">
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="form-control min-h-11 w-full min-w-0 pl-11 pr-11 text-sm transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-100 sm:text-base"
              placeholder="Enter your password"
              autoComplete="current-password"
              aria-invalid={Boolean(formState.errors.password)}
              {...register("password")}
            />
            <IconLockFilled
              aria-hidden="true"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
              {showPassword ? (
                <IconEyeOff aria-hidden="true" stroke={2} />
              ) : (
                <IconEye aria-hidden="true" stroke={2} />
              )}
            </button>
          </div>
          {formState.errors.password?.message && (
            <p className="-mt-1 text-[13px] text-red-600">
              *{formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-primary-600 accent-primary-600 border-2 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="ms-3 text-sm text-gray-700">
              Keep me signed in
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={formState.isSubmitting}
          className="btn flex min-h-11 w-full items-center justify-center bg-primary-600 px-4 text-sm text-white shadow-sm transition-all duration-200 hover:bg-primary-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 sm:text-base">
          {formState.isSubmitting ? "Signing In..." : "Sign In"}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-5 border-t border-gray-100 pt-5 text-center sm:mt-6 sm:pt-6">
        <p className="text-sm leading-6 text-gray-600 sm:text-base">
          New to FreshCart?
          <Link
            href="/signup"
            className="text-primary-600 hover:text-primary-700 ms-2 font-semibold cursor-pointer">
            Create an account
          </Link>
        </p>
      </div>

      {/* Trust Badges */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-gray-500 sm:mt-6 sm:gap-x-6">
        <div className="flex items-center">
          <IconLockFilled className="me-1 size-4 shrink-0" />
          SSL Secured
        </div>
        <div className="flex items-center">
          <IconUsers stroke={2} className="me-1 size-4 shrink-0" />
          50K+ Users
        </div>
        <div className="flex items-center">
          <IconStarFilled className="me-1 size-4 shrink-0" />
          4.9 Rating
        </div>
      </div>
    </div>
  );
}
