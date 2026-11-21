import LogInScreen from "@/features/auth/screens/screen.login";
import { verifyToken } from "@/features/auth/server/auth.actions";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const { isAuthenticated } = await verifyToken();
  if (isAuthenticated) {
    redirect("/");
  }

  return <LogInScreen />;
}
