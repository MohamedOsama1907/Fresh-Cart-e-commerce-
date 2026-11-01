import type { Metadata } from "next";
import ForgetPasswordForm from "@/features/auth/components/forgotPassword/ForgetPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password | FreshCart",
  description: "Request a password reset code for your FreshCart account.",
};

export default function ForgotPasswordPage() {
  return <ForgetPasswordForm />;
}
