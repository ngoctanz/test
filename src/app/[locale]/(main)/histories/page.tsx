import React from "react";
import HistoriesSection from "@/sections/histories-section/histories.section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order History - Track Your Purchases",
  description:
    "View your complete order history and track all your gaming account purchases. Monitor order status, download invoices, and manage your transactions at Best Game Account Store.",
  keywords: [
    "order history",
    "purchase history",
    "track orders",
    "gaming account purchases",
    "transaction history",
  ],
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Order History - Best Game Account Store",
    description: "Track and manage all your gaming account purchases",
    type: "website",
  },
};

export default function HistoriesPage() {
  return <HistoriesSection />;
}
