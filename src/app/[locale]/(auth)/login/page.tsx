import { LoginForm } from "@/components/auth/login.form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Sign In to Your Account",
  description:
    "Log in to Best Game Account Store to access your gaming accounts, track orders, and manage your purchases. Secure login with instant access.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Login to Best Game Account Store",
    description: "Access your gaming account marketplace",
    type: "website",
  },
};

export default function LoginPage() {
  return <LoginForm />;
}
