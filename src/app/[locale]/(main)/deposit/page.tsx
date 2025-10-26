import DepositSection from "@/sections/deposit-section/deposit.section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deposit Funds - Add Balance to Your Account",
  description:
    "Easily deposit funds to your Best Game Account Store wallet. Multiple payment methods available including credit card, PayPal, and cryptocurrency. Fast and secure transactions.",
  keywords: [
    "deposit funds",
    "add balance",
    "payment methods",
    "top up account",
    "gaming wallet",
  ],
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Deposit Funds - Best Game Account Store",
    description:
      "Add balance to your account with multiple secure payment methods",
    type: "website",
  },
};

export default function DepositPage() {
  return <DepositSection />;
}
