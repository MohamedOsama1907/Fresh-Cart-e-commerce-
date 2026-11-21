import SignUpScreen from "@/features/auth/screens/screen.signup";
import { verifyToken } from "@/features/auth/server/auth.actions";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const { isAuthenticated } = await verifyToken();
  if (isAuthenticated) {
    redirect("/");
  }

  return <SignUpScreen />;
}
