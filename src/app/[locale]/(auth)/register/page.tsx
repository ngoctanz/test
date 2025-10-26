import { RegisterForm } from "@/components/auth/register.form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - Create Your Account",
  description:
    "Create a new account at Best Game Account Store. Join thousands of gamers and get access to premium gaming accounts with secure transactions and instant delivery.",
  keywords: [
    "register gaming account",
    "create account",
    "sign up game store",
    "join gaming marketplace",
  ],
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Register at Best Game Account Store",
    description: "Join the most trusted gaming accounts marketplace",
    type: "website",
  },
};

export default function RegisterPage() {
  return <RegisterForm />;
}
