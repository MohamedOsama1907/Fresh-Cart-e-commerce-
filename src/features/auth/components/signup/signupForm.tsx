"use client";

import {
  IconAlertCircle,
  IconEye,
  IconEyeOff,
  IconUserPlus,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { signupSchema, signupValues } from "../../schemas/signup.shcema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupAction } from "../../server/signup.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const { register, handleSubmit, formState, setError } = useForm<signupValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
    },
    resolver: zodResolver(signupSchema),
  });

  const handleSignup: SubmitHandler<signupValues> = async function (values) {
    const response = await signupAction(values);
    if (response.success) {
      toast.success(response.message);
      router.push("/login");
      return;
    }

    if (response.fieldErrors) {
      for (const [key, messages] of Object.entries(response.fieldErrors)) {
        if (messages?.[0]) {
          setError(key as keyof signupValues, { message: messages[0] });
        }
      }
    }
    setError("root", { message: response.message });
  };

  return (
    <div className="mx-auto my-5 w-full min-w-0 max-w-xl rounded-2xl bg-white px-4 py-7 shadow-lg sm:my-7 sm:px-7 sm:py-9 lg:my-8 lg:px-8">
      <div className="mb-7 sm:mb-9">
        <h2 className="mb-2 text-center text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
          Create Your Account
        </h2>
        <p className="text-center text-sm leading-6 text-slate-600 sm:text-base">
          Start your fresh journey with us today
        </p>
      </div>

      <form
        className="space-y-5 sm:space-y-6"
        onSubmit={handleSubmit(handleSignup)}>
        {formState.errors.root?.message && (
          <div
            role="alert"
            aria-live="polite"
            className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
          >
            <IconAlertCircle
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-rose-600"
            />
            <p className="leading-5">{formState.errors.root.message}</p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-slate-700">
            Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            className="form-control min-h-11 w-full min-w-0 text-sm sm:text-base"
            placeholder="Ali"
            id="name"
            autoComplete="name"
            aria-invalid={Boolean(formState.errors.name)}
            {...register("name")}
          />
          {formState.errors.name && (
            <p className="-mt-1 text-[13px] font-medium text-rose-600">
              *{formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            className="form-control min-h-11 w-full min-w-0 text-sm sm:text-base"
            placeholder="ali@example.com"
            id="email"
            autoComplete="email"
            aria-invalid={Boolean(formState.errors.email)}
            {...register("email")}
          />
          {formState.errors.email && (
            <p className="-mt-1 text-[13px] font-medium text-rose-600">
              *{formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control min-h-11 w-full min-w-0 pr-12 text-sm sm:text-base"
              placeholder="create a strong password"
              autoComplete="new-password"
              id="password"
              aria-invalid={Boolean(formState.errors.password)}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              {showPassword ? (
                <IconEyeOff aria-hidden="true" size={20} />
              ) : (
                <IconEye aria-hidden="true" size={20} />
              )}
            </button>
          </div>

          {formState.errors.password && (
            <p className="-mt-1 text-[13px] font-medium text-rose-600">
              *{formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="rePassword" className="text-sm font-medium text-slate-700">
            Confirm Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showRePassword ? "text" : "password"}
              className="form-control min-h-11 w-full min-w-0 pr-12 text-sm sm:text-base"
              placeholder="confirm your password"
              autoComplete="new-password"
              id="rePassword"
              aria-invalid={Boolean(formState.errors.rePassword)}
              {...register("rePassword")}
            />
            <button
              type="button"
              onClick={() => setShowRePassword((visible) => !visible)}
              aria-label={
                showRePassword ? "Hide confirmed password" : "Show confirmed password"
              }
              aria-pressed={showRePassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              {showRePassword ? (
                <IconEyeOff aria-hidden="true" size={20} />
              ) : (
                <IconEye aria-hidden="true" size={20} />
              )}
            </button>
          </div>
          {formState.errors.rePassword && (
            <p className="-mt-1 text-[13px] font-medium text-rose-600">
              *{formState.errors.rePassword.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-sm font-medium text-slate-700">
            Phone Number <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            className="form-control min-h-11 w-full min-w-0 text-sm sm:text-base"
            placeholder="01012345678"
            id="phone"
            autoComplete="tel"
            aria-invalid={Boolean(formState.errors.phone)}
            {...register("phone")}
          />
          {formState.errors.phone && (
            <p className="-mt-1 text-[13px] font-medium text-rose-600">
              *{formState.errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              required
              className="mt-1 size-4 shrink-0 accent-primary-600"
            />
            <label
              htmlFor="terms"
              className="min-w-0 text-sm leading-6 text-slate-600">
              I agree to the{" "}
              <Link href="/terms" className="font-semibold text-primary-600 hover:text-primary-700">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacypolicy" className="font-semibold text-primary-600 hover:text-primary-700">
                Privacy Policy
              </Link>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={formState.isSubmitting}
          className="btn flex min-h-11 w-full items-center justify-center gap-2 bg-primary-600 text-sm text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base">
          {formState.isSubmitting ? (
            <>
              <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <IconUserPlus stroke={2} aria-hidden="true" />
              <span>Create My Account</span>
            </>
          )}
        </button>
      </form>

      <p className="my-4 border-t border-slate-100 pt-6 text-center text-sm leading-6 text-slate-600 sm:pt-8 sm:text-base">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-700">
          Sign In
        </Link>
      </p>
    </div>
  );
}
