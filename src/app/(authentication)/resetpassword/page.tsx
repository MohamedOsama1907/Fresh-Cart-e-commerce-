import type { Metadata } from "next";
import ForgetPasswordForm from "@/features/auth/components/forgotPassword/ForgetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | FreshCart",
  description: "Verify your email and choose a new FreshCart password.",
};

export default function ResetPasswordPage() {
  return <ForgetPasswordForm />;
}
