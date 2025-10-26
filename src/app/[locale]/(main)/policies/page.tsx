import PolicesSection from "@/sections/policies/polices.section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Policies - Terms, Privacy & Refund Policy",
  description:
    "Read our comprehensive policies including terms of service, privacy policy, refund policy, and buyer protection guidelines at Best Game Account Store. Your security is our priority.",
  keywords: [
    "terms of service",
    "privacy policy",
    "refund policy",
    "buyer protection",
    "gaming account policies",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Our Policies - Best Game Account Store",
    description:
      "Terms, privacy, and refund policies for secure gaming account purchases",
    type: "website",
  },
};

function PoliciesPage() {
  return (
    <div>
      <PolicesSection />
    </div>
  );
}

export default PoliciesPage;
