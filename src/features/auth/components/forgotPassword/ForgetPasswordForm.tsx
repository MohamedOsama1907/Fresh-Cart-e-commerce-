"use client";

import {
  IconArrowLeft,
  IconCheck,
  IconEye,
  IconEyeOff,
  IconKeyFilled,
  IconLockFilled,
  IconMail,
  IconShieldCheckFilled,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { forgotPasswordAction } from "../../server/forgotPassword.actions";
import {
  forgotPasswordSchema,
  ForgotPasswordValues,
} from "../../schemas/forgotPassword.schema";
import { verifyResetCodeAction } from "../../server/verifyResetCode.actions";
import { verifyResetCodeSchema } from "../../schemas/verifyResetCode.schema";
import { resetPasswordAction } from "../../server/resetPassword.actions";
import {
  resetPasswordSchema,
  ResetPasswordValues,
} from "../../schemas/resetPassword.schema";

function ResetPasswordHero() {
  return (
    <section
      aria-labelledby="reset-hero-title"
      className="hidden min-w-0 text-center lg:block">
      <div
        aria-hidden="true"
        className="relative mx-auto flex h-[300px] w-full max-w-xl items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 via-emerald-50 to-primary-100 shadow-lg sm:h-[360px]">
        <span className="absolute left-[9%] top-[9%] size-24 rounded-full bg-primary-100/70" />
        <span className="absolute right-[13%] top-[21%] size-16 rounded-full bg-primary-100/70" />
        <span className="absolute bottom-[12%] right-[7%] size-32 rounded-full bg-primary-100/60" />

        <div className="relative flex items-center justify-center gap-3 sm:gap-5">
          <div className="-rotate-12 rounded-2xl bg-white p-4 text-primary-600 shadow-lg sm:p-5">
            <IconMail className="size-7 sm:size-9" stroke={2.4} />
          </div>
          <div className="z-10 flex size-28 -rotate-3 items-center justify-center rounded-[2rem] border-8 border-white bg-primary-100 text-primary-600 shadow-xl sm:size-32">
            <IconLockFilled className="size-12 sm:size-14" />
          </div>
          <div className="rotate-12 rounded-2xl bg-white p-4 text-primary-600 shadow-lg sm:p-5">
            <IconShieldCheckFilled className="size-7 sm:size-9" />
          </div>
        </div>
        <div className="absolute bottom-[27%] flex gap-2" aria-hidden="true">
          <span className="size-3 rounded-full bg-primary-300" />
          <span className="size-3 rounded-full bg-primary-400" />
          <span className="size-3 rounded-full bg-primary-300" />
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-xl space-y-3">
        <h2
          id="reset-hero-title"
          className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Reset Your Password
        </h2>
        <p className="text-base leading-7 text-gray-600 sm:text-lg">
          Don&apos;t worry, it happens to the best of us. We&apos;ll help you get
          back into your account in no time.
        </p>
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 pt-2 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <IconMail aria-hidden="true" className="size-4 text-primary-600" />
            Email Verification
          </li>
          <li className="flex items-center gap-2">
            <IconShieldCheckFilled
              aria-hidden="true"
              className="size-4 text-primary-600"
            />
            Secure Reset
          </li>
          <li className="flex items-center gap-2">
            <IconLockFilled aria-hidden="true" className="size-4 text-primary-600" />
            Encrypted
          </li>
        </ul>
      </div>
    </section>
  );
}

export default function ForgetPasswordForm() {
  const router = useRouter();
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<{
    text: string;
  } | null>(null);
  const [actionMessage, setActionMessage] = useState<{
    text: string;
  } | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: passwordFormState,
    setError: setPasswordError,
  } = useForm<ResetPasswordValues>({
    defaultValues: { email: "", newPassword: "", confirmPassword: "" },
    resolver: zodResolver(resetPasswordSchema),
  });
  const { register, handleSubmit, formState, setError } =
    useForm<ForgotPasswordValues>({
      defaultValues: { email: "" },
      resolver: zodResolver(forgotPasswordSchema),
    });

  const handleForgotPassword: SubmitHandler<ForgotPasswordValues> = async (
    values,
  ) => {
    setActionMessage(null);
    const result = await forgotPasswordAction(values);

    if (result.success) {
      toast.success(result.message);
      setVerificationEmail(values.email);
      setResendMessage(null);
      return;
    }

    if (result.fieldErrors?.email?.[0]) {
      setError("email", { message: result.fieldErrors.email[0] });
    }
    setActionMessage({ text: result.message });
  };

  const handleResendCode = async () => {
    if (!verificationEmail || isResending) return;

    setIsResending(true);
    setResendMessage(null);
    const result = await forgotPasswordAction({ email: verificationEmail });
    if (result.success) {
      toast.success(result.message);
    } else {
      setResendMessage({ text: result.message });
    }
    setIsResending(false);
  };

  const handleVerifyResetCode = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (isVerifying || isCodeVerified) return;

    const validation = verifyResetCodeSchema.safeParse({ resetCode });
    if (!validation.success) {
      setVerificationError(validation.error.issues[0]?.message ?? "Enter the reset code.");
      return;
    }

    setVerificationError(null);
    setIsVerifying(true);
    const result = await verifyResetCodeAction(validation.data);
    setIsVerifying(false);

    if (result.success) {
      setIsCodeVerified(true);
      toast.success(result.message);
      return;
    }

    setVerificationError(
      result.fieldErrors?.resetCode?.[0] ?? result.message,
    );
  };

  const handleResetPassword: SubmitHandler<ResetPasswordValues> = async (
    values,
  ) => {
    if (!verificationEmail) return;

    setResetMessage(null);
    const result = await resetPasswordAction({
      ...values,
      email: verificationEmail,
    });

    if (result.success) {
      toast.success(result.message);
      router.push("/login");
      return;
    }

    for (const field of ["newPassword", "confirmPassword"] as const) {
      const message = result.fieldErrors?.[field]?.[0];
      if (message) setPasswordError(field, { message });
    }
    setResetMessage(result.message);
  };

  if (verificationEmail && isCodeVerified) {
    return (
      <main className="container mx-auto flex w-full max-w-7xl flex-1 items-center py-8 sm:py-12 lg:py-16">
        <div className="mx-auto grid w-full min-w-0 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <ResetPasswordHero />
          <section
            aria-labelledby="create-password-title"
            className="mx-auto w-full min-w-0 max-w-xl rounded-2xl bg-white px-5 py-7 shadow-xl ring-1 ring-gray-100 sm:px-8 sm:py-9 lg:px-10">
            <header className="text-center">
              <p className="text-2xl font-bold tracking-tight text-primary-600 sm:text-3xl">
                Fresh<span className="text-gray-900">Cart</span>
              </p>
              <h1
                id="create-password-title"
                className="mt-4 text-xl font-bold text-gray-900 sm:text-2xl">
                Create New Password
              </h1>
              <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base">
                Your new password must be different from previous passwords
              </p>
            </header>

            <ol
              aria-label="Password reset steps"
              className="mx-auto my-7 flex max-w-xs items-center justify-center sm:my-8">
              <li className="flex size-10 items-center justify-center rounded-full bg-primary-600 text-white">
                <IconCheck aria-hidden="true" className="size-5" />
                <span className="sr-only">Email submitted</span>
              </li>
              <li aria-hidden="true" className="h-0.5 flex-1 bg-primary-600" />
              <li className="flex size-10 items-center justify-center rounded-full bg-primary-600 text-white">
                <IconCheck aria-hidden="true" className="size-5" />
                <span className="sr-only">Reset code verified</span>
              </li>
              <li aria-hidden="true" className="h-0.5 flex-1 bg-primary-600" />
              <li
                aria-current="step"
                className="flex size-11 items-center justify-center rounded-full bg-primary-600 text-white ring-4 ring-primary-100">
                <IconLockFilled aria-hidden="true" className="size-4" />
                <span className="sr-only">Create new password, current step</span>
              </li>
            </ol>

            <form
              className="space-y-5"
              onSubmit={handlePasswordSubmit(handleResetPassword)}>
              {resetMessage && (
                <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {resetMessage}
                </p>
              )}
              <div className="flex min-w-0 flex-col gap-2">
                <label
                  htmlFor="new-password"
                  className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <IconLockFilled
                    aria-hidden="true"
                    className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Enter new password"
                    aria-invalid={Boolean(passwordFormState.errors.newPassword)}
                    className="form-control min-h-12 w-full min-w-0 rounded-xl border-gray-300 px-11 pr-12 text-sm placeholder:text-gray-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 sm:text-base"
                    {...registerPassword("newPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((shown) => !shown)}
                    aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                    aria-pressed={showNewPassword}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-sm text-gray-400 hover:text-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">
                    {showNewPassword ? (
                      <IconEyeOff aria-hidden="true" className="size-5" />
                    ) : (
                      <IconEye aria-hidden="true" className="size-5" />
                    )}
                  </button>
                </div>
                {passwordFormState.errors.newPassword?.message && (
                  <p className="text-sm text-red-700">{passwordFormState.errors.newPassword.message}</p>
                )}
              </div>

              <div className="flex min-w-0 flex-col gap-2">
                <label
                  htmlFor="confirm-password"
                  className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <IconLockFilled
                    aria-hidden="true"
                    className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Confirm new password"
                    aria-invalid={Boolean(passwordFormState.errors.confirmPassword)}
                    className="form-control min-h-12 w-full min-w-0 rounded-xl border-gray-300 px-11 pr-12 text-sm placeholder:text-gray-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 sm:text-base"
                    {...registerPassword("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((shown) => !shown)}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    aria-pressed={showConfirmPassword}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-sm text-gray-400 hover:text-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">
                    {showConfirmPassword ? (
                      <IconEyeOff aria-hidden="true" className="size-5" />
                    ) : (
                      <IconEye aria-hidden="true" className="size-5" />
                    )}
                  </button>
                </div>
                {passwordFormState.errors.confirmPassword?.message && (
                  <p className="text-sm text-red-700">{passwordFormState.errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={passwordFormState.isSubmitting}
                className="flex min-h-12 w-full items-center justify-center rounded-xl bg-primary-600 px-5 font-semibold text-white shadow-md transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 disabled:cursor-wait disabled:opacity-70">
                {passwordFormState.isSubmitting ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </section>
        </div>
      </main>
    );
  }

  if (verificationEmail) {
    return (
      <main className="container mx-auto flex w-full max-w-7xl flex-1 items-center py-8 sm:py-12 lg:py-16">
        <div className="mx-auto grid w-full min-w-0 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <ResetPasswordHero />
          <section
            aria-labelledby="check-email-title"
            className="mx-auto w-full min-w-0 max-w-xl rounded-2xl bg-white px-5 py-7 text-center shadow-xl ring-1 ring-gray-100 sm:px-8 sm:py-9 lg:px-10">
          <p className="text-2xl font-bold tracking-tight text-primary-600 sm:text-3xl">
            Fresh<span className="text-gray-900">Cart</span>
          </p>
          <h1
            id="check-email-title"
            className="mt-4 text-xl font-bold text-gray-900 sm:text-2xl">
            Check Your Email
          </h1>
          <p className="mt-2 break-words text-sm leading-6 text-gray-600 sm:text-base">
            Enter the 6-digit code sent to {verificationEmail}
          </p>

          <ol
            aria-label="Password reset steps"
            className="mx-auto my-7 flex max-w-xs items-center justify-center sm:my-8">
            <li className="flex size-10 items-center justify-center rounded-full bg-primary-600 text-white">
              <IconCheck aria-hidden="true" className="size-5" />
              <span className="sr-only">Email submitted</span>
            </li>
            <li aria-hidden="true" className="h-0.5 flex-1 bg-primary-600" />
            <li
              aria-current={isCodeVerified ? undefined : "step"}
              className={`flex size-11 items-center justify-center rounded-full text-white ${
                isCodeVerified
                  ? "bg-primary-600"
                  : "bg-primary-600 ring-4 ring-primary-100"
              }`}>
              {isCodeVerified ? (
                <IconCheck aria-hidden="true" className="size-5" />
              ) : (
                <IconKeyFilled aria-hidden="true" className="size-4" />
              )}
              <span className="sr-only">
                {isCodeVerified
                  ? "Code verified"
                  : "Enter verification code, current step"}
              </span>
            </li>
            <li
              aria-hidden="true"
              className={`h-0.5 flex-1 ${isCodeVerified ? "bg-primary-600" : "bg-gray-200"}`}
            />
            <li
              aria-current={isCodeVerified ? "step" : undefined}
              className={`flex size-10 items-center justify-center rounded-full ${
                isCodeVerified
                  ? "bg-primary-600 text-white ring-4 ring-primary-100"
                  : "bg-gray-100 text-gray-400"
              }`}>
              <IconLockFilled aria-hidden="true" className="size-4" />
              <span className="sr-only">
                {isCodeVerified
                  ? "Code verified, reset password is next"
                  : "Choose a new password"}
              </span>
            </li>
          </ol>

          <form
            className="space-y-5 text-left"
            onSubmit={handleVerifyResetCode}>
            <div className="flex min-w-0 flex-col gap-2">
              <label
                htmlFor="verification-code"
                className="text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <div className="relative">
                <IconShieldCheckFilled
                  aria-hidden="true"
                  className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="verification-code"
                  name="verificationCode"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={resetCode}
                  onChange={(event) => {
                    setResetCode(event.target.value.replace(/\D/g, "").slice(0, 6));
                    setVerificationError(null);
                  }}
                  disabled={isVerifying || isCodeVerified}
                  aria-invalid={Boolean(verificationError)}
                  aria-describedby={
                    verificationError
                      ? "verification-code-error"
                      : "verification-code-hint"
                  }
                  placeholder="• • • • • •"
                  className="form-control min-h-14 w-full min-w-0 rounded-xl border-gray-300 pl-12 text-center tracking-[0.55em] placeholder:text-gray-400 placeholder:tracking-[0.55em] focus:border-primary-600 focus:ring-2 focus:ring-primary-100 sm:text-lg"
                />
                <span id="verification-code-hint" className="sr-only">
                  Enter the six-digit verification code from your email.
                </span>
              </div>
            </div>

            {verificationError && (
              <p
                id="verification-code-error"
                role="alert"
                className="text-sm text-red-700">
                {verificationError}
              </p>
            )}

            <div className="text-center text-sm text-gray-600">
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResending}
                className="font-semibold text-primary-700 hover:text-primary-800 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 disabled:cursor-wait disabled:opacity-60">
                {isResending ? "Sending..." : "Resend Code"}
              </button>
            </div>
            {resendMessage && (
              <p
                role="alert"
                aria-live="polite"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-800">
                {resendMessage.text}
              </p>
            )}

            <button
              type="submit"
              disabled={isVerifying || isCodeVerified}
              className="flex min-h-11 w-full items-center justify-center rounded-xl bg-primary-600 px-5 font-semibold text-white shadow-md transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 disabled:cursor-not-allowed disabled:opacity-70">
              {isCodeVerified
                ? "Code Verified"
                : isVerifying
                  ? "Verifying..."
                  : "Verify Code"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setVerificationEmail(null);
              setResendMessage(null);
              setResetCode("");
              setVerificationError(null);
              setIsCodeVerified(false);
            }}
            className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-3 text-sm text-gray-600 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">
            <IconArrowLeft aria-hidden="true" className="size-4" />
            Change email address
          </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto flex w-full max-w-7xl flex-1 items-center py-8 sm:py-12 lg:py-16">
      <div className="mx-auto grid w-full min-w-0 items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <ResetPasswordHero />

        <section
          aria-labelledby="forgot-password-title"
          className="mx-auto w-full min-w-0 max-w-xl rounded-2xl bg-white px-5 py-7 shadow-xl ring-1 ring-gray-100 sm:px-8 sm:py-10 lg:px-10 lg:py-11">
          <header className="text-center">
            <p className="text-2xl font-bold tracking-tight text-primary-600 sm:text-3xl">
              Fresh<span className="text-gray-900">Cart</span>
            </p>
            <h2
              id="forgot-password-title"
              className="mt-4 text-xl font-bold text-gray-900 sm:text-2xl">
              Forgot Password?
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base">
              No worries, we&apos;ll send you a reset code
            </p>
          </header>

          <ol
            aria-label="Password reset steps"
            className="mx-auto my-7 flex max-w-xs items-center justify-center sm:my-8">
            <li aria-current="step" className="flex items-center">
              <span className="flex size-11 items-center justify-center rounded-full bg-primary-600 text-white ring-4 ring-primary-100">
                <IconMail aria-hidden="true" className="size-4" />
                <span className="sr-only">Enter email, current step</span>
              </span>
            </li>
            <li aria-hidden="true" className="h-0.5 flex-1 bg-gray-200" />
            <li className="flex size-10 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <IconKeyFilled aria-hidden="true" className="size-4" />
              <span className="sr-only">Verify code</span>
            </li>
            <li aria-hidden="true" className="h-0.5 flex-1 bg-gray-200" />
            <li className="flex size-10 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <IconLockFilled aria-hidden="true" className="size-4" />
              <span className="sr-only">Choose a new password</span>
            </li>
          </ol>

          <form
            className="space-y-5"
            onSubmit={handleSubmit(handleForgotPassword)}>
            {actionMessage && (
              <p
                role="alert"
                aria-live="polite"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {actionMessage.text}
              </p>
            )}
            <div className="flex min-w-0 flex-col gap-2">
              <label
                htmlFor="reset-email"
                className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <IconMail
                  aria-hidden="true"
                  className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email address"
                  aria-invalid={Boolean(formState.errors.email)}
                  aria-describedby={
                    formState.errors.email ? "reset-email-error" : undefined
                  }
                  className="form-control min-h-13 w-full min-w-0 rounded-xl border-gray-300 pl-12 text-sm placeholder:text-gray-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 sm:text-base"
                  {...register("email")}
                />
              </div>
              {formState.errors.email?.message && (
                <p id="reset-email-error" className="text-sm text-red-700">
                  {formState.errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={formState.isSubmitting}
              className="flex min-h-13 w-full items-center justify-center rounded-xl bg-primary-600 px-5 font-semibold text-white shadow-md transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 disabled:cursor-wait disabled:opacity-70">
              {formState.isSubmitting ? "Sending..." : "Send Reset Code"}
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link
              href="/login"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium text-primary-700 transition-colors hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">
              <IconArrowLeft aria-hidden="true" className="size-4" />
              Back to Sign In
            </Link>
          </div>

          <footer className="mt-6 border-t border-gray-100 pt-5 text-center text-sm leading-6 text-gray-600 sm:mt-8 sm:pt-6 sm:text-base">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary-700 hover:text-primary-800 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">
              Sign In
            </Link>
          </footer>
        </section>
      </div>
    </main>
  );
}
