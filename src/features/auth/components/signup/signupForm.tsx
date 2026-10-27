"use client";
import { apiClient } from "@/services/apiClient";
import {
  IconAlertCircle,
  IconEye,
  IconEyeOff,
  IconUserPlus,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { email } from "zod";
import { signupSchema, signupValues } from "../../schemas/signup.shcema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupAction } from "../../server/signup.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const { register, handleSubmit, formState, setError } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
    },
    resolver: zodResolver(signupSchema),
  });
  const validateFunction: SubmitHandler<signupValues> = async function (
    values,
  ) {
    const response = await signupAction(values);
    if (response.success) {
      toast.success(response.message);
      router.push("/login");
    }
    if (!response.success) {
      if (response.fieldErrors) {
        for (const [key, messages] of Object.entries(response.fieldErrors)) {
          setError(key as keyof signupValues, { message: messages[0] });
        }
      }
      setError("root", { message: response.message });
    }
  };
  const inValidateFunctuion: SubmitHandler<signupValues> = function (values) {};
  return (
    <>
      <div className="mx-auto my-5 w-full min-w-0 max-w-xl rounded-2xl bg-white px-4 py-7 shadow-lg sm:my-7 sm:px-7 sm:py-9 lg:my-8 lg:px-8">
        <div className="mb-7 sm:mb-9">
          <h2 className="mb-2 text-center text-2xl font-semibold leading-tight sm:text-3xl">
            Create Your Account
          </h2>
          <p className="text-center text-sm leading-6 text-slate-600 sm:text-base">
            Start your fresh journey with us today
          </p>
        </div>

        <form
          className="space-y-5 sm:space-y-6"
          onSubmit={handleSubmit(validateFunction)}>
          {formState.errors.root?.message && (
            <div
              role="alert"
              aria-live="polite"
              className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              <IconAlertCircle
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-red-600"
              />
              <p className="leading-5">{formState.errors.root.message}</p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name*
            </label>
            <input
              type="text"
              className="form-control min-h-11 w-full min-w-0 text-sm sm:text-base"
              placeholder="Ali"
              id="name"
              {...register("name")}
            />
            {formState.errors.name ? (
              <p className=" text-[13px] text-[#dc2626] bg-transparent -mt-1">
                *{formState.errors.name.message}
              </p>
            ) : (
              ""
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email*
            </label>
            <input
              type="email"
              className="form-control min-h-11 w-full min-w-0 text-sm sm:text-base"
              placeholder="ali@example.com"
              id="email"
              {...register("email")}
            />
            {formState.errors.email ? (
              <p className=" text-[13px] text-[#dc2626] bg-transparent -mt-1">
                *{formState.errors.email.message}
              </p>
            ) : (
              ""
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password*
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control min-h-11 w-full min-w-0 pr-12 text-sm sm:text-base"
                placeholder="create a strong password"
                autoComplete="off"
                id="password"
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

            <div className="password-requirements">
              <div className="flex items-center gap-2 text-sm">
                <div className="bar h-1 min-w-0 grow overflow-hidden rounded-md bg-gray-200">
                  <div className={`progress bg-orange-500 w-50 h-full`}></div>
                </div>
                <span>Fair</span>
              </div>
            </div>
            {formState.errors.password ? (
              <p className=" text-[13px] text-[#dc2626] bg-transparent -mt-1">
                *{formState.errors.password.message}
              </p>
            ) : (
              ""
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="rePassword" className="text-sm font-medium">
              Confirm Password*
            </label>
            <div className="relative">
              <input
                type={showRePassword ? "text" : "password"}
                className="form-control min-h-11 w-full min-w-0 pr-12 text-sm sm:text-base"
                placeholder="confirm your password"
                autoComplete="off"
                id="rePassword"
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
            {formState.errors.rePassword ? (
              <p className=" text-[13px] text-[#dc2626] bg-transparent -mt-1">
                *{formState.errors.rePassword.message}
              </p>
            ) : (
              ""
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone Number*
            </label>
            <input
              type="tel"
              className="form-control min-h-11 w-full min-w-0 text-sm sm:text-base"
              placeholder="+1 234 567 8900"
              id="phone"
              {...register("phone")}
            />
            {formState.errors.phone ? (
              <p className=" text-[13px] text-[#dc2626] bg-transparent -mt-1">
                *{formState.errors.phone.message}
              </p>
            ) : (
              ""
            )}
          </div>
          <div>
            <div className="mb-2 flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 size-4 shrink-0 accent-primary-600"
              />
              <label
                htmlFor="terms"
                className="min-w-0 text-sm leading-6 text-slate-600">
                I agree to the{" "}
                <Link href={`/terms`} className="text-primary-600">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href={`/privacy-policy`} className="text-primary-600">
                  Privacy Policy
                </Link>{" "}
                *
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn flex min-h-11 w-full items-center justify-center gap-2 bg-primary-600 text-sm text-white hover:bg-primary-700 disabled:cursor-not-allowed sm:text-base">
            <IconUserPlus stroke={2} />

            <span>Create My Account</span>
          </button>
        </form>

        <p className="my-4 border-t border-gray-300/30 pt-6 text-center text-sm leading-6 sm:pt-8 sm:text-base">
          Already have an account?{" "}
          <Link href={`/login`} className="text-primary-600">
            Sign In
          </Link>
        </p>
      </div>
    </>
  );
}
